import http from "node:http";
import { createHash, timingSafeEqual } from "node:crypto";
import { DASHBOARD_HTML } from "./dashboard.mjs";
import { OPENAPI } from "./openapi.mjs";
import { redactSensitive } from "./redact.mjs";

class HttpProblem extends Error {
  constructor(status, title, detail) { super(detail); this.status = status; this.title = title; }
}

function sendJson(res, status, value, headers = {}) {
  res.writeHead(status, { "content-type": "application/json", "cache-control": "no-store", ...headers });
  res.end(JSON.stringify(value));
}

function sendProblem(res, error, instance) {
  const status = error.status ?? 500;
  sendJson(res, status, { type: "about:blank", title: error.title ?? "Internal Server Error", status, detail: status >= 500 ? "The request could not be completed." : error.message, instance }, { "content-type": "application/problem+json" });
}

function matchesSecret(supplied, expected) {
  if (!expected) return false;
  const a = Buffer.from(supplied); const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

function authorized(req, config, tenantId) {
  if (!config.apiKey && Object.keys(config.tenantKeys ?? {}).length === 0) return true;
  const supplied = req.headers.authorization?.replace(/^Bearer\s+/i, "") ?? "";
  return matchesSecret(supplied, config.apiKey) || matchesSecret(supplied, config.tenantKeys?.[tenantId]);
}

function tenant(req) {
  const value = String(req.headers["x-tenant-id"] ?? "default");
  if (!/^[A-Za-z0-9._-]{1,64}$/.test(value)) throw new HttpProblem(400, "Bad Request", "x-tenant-id must contain 1-64 letters, digits, dots, underscores, or hyphens.");
  return value;
}

async function readJson(req, limit = 1_048_576) {
  if (!String(req.headers["content-type"] ?? "").toLowerCase().startsWith("application/json")) throw new HttpProblem(415, "Unsupported Media Type", "Use application/json.");
  const chunks = []; let size = 0;
  for await (const chunk of req) { size += chunk.length; if (size > limit) throw new HttpProblem(413, "Content Too Large", "Request body exceeds 1 MiB."); chunks.push(chunk); }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"); } catch { throw new HttpProblem(400, "Bad Request", "Request body is not valid JSON."); }
}

function validateChat(body) {
  if (!Array.isArray(body.messages) || body.messages.length === 0) throw new HttpProblem(422, "Unprocessable Content", "messages must be a non-empty array.");
  if (body.messages.length > 100 || body.messages.some(message => !message || typeof message !== "object" || !["system", "developer", "user", "assistant", "tool"].includes(message.role) || !(typeof message.content === "string" || Array.isArray(message.content)))) throw new HttpProblem(422, "Unprocessable Content", "messages contains an unsupported role or content shape, or exceeds 100 items.");
  if (body.stream === true) throw new HttpProblem(422, "Unprocessable Content", "Streaming is outside this MVP; send stream=false.");
}

export function createHttpServer({ service, store, config, logger = console }) {
  const windows = new Map();
  const limit = Math.max(1, Number(config.rateLimitPerMinute ?? 60));
  return http.createServer(async (req, res) => {
    const url = new URL(req.url, "http://localhost");
    try {
      if (req.method === "GET" && url.pathname === "/health") return sendJson(res, 200, { status: "ok", service: "mythos-ai-engineering-platform", version: 1 });
      if (req.method === "GET" && url.pathname === "/openapi.json") return sendJson(res, 200, OPENAPI);
      if (req.method === "GET" && url.pathname === "/dashboard") { res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" }); return res.end(DASHBOARD_HTML); }
      const protectedPath = url.pathname.startsWith("/v1/") || url.pathname.startsWith("/api/");
      const tenantId = protectedPath ? tenant(req) : "default";
      if (protectedPath && !authorized(req, config, tenantId)) {
        res.setHeader("www-authenticate", "Bearer"); throw new HttpProblem(401, "Unauthorized", "A valid bearer token is required.");
      }
      if (protectedPath) {
        const authHash = createHash("sha256").update(String(req.headers.authorization ?? "anonymous")).digest("hex");
        const key = `${req.socket.remoteAddress}:${authHash}`;
        const minute = Math.floor(Date.now() / 60_000); const current = windows.get(key);
        const count = current?.minute === minute ? current.count + 1 : 1; windows.set(key, { minute, count });
        if (count > limit) { res.setHeader("retry-after", String(60 - Math.floor(Date.now() / 1000) % 60)); throw new HttpProblem(429, "Too Many Requests", "Rate limit exceeded."); }
      }
      if (req.method === "GET" && url.pathname === "/v1/models") return sendJson(res, 200, { object: "list", data: (config.tiers ?? []).map(tier => ({ id: tier.tier, object: "model", owned_by: tier.provider ?? "configured-provider" })) });
      if (req.method === "POST" && url.pathname === "/v1/chat/completions") {
        const body = await readJson(req); validateChat(body);
        const result = await service.chat({ body, tenantId, maxLatencyMs: Number(req.headers["x-max-latency-ms"] ?? Number.POSITIVE_INFINITY) });
        return sendJson(res, 200, result.response, { "x-ai-route-tier": result.tier, "x-ai-cache": result.cacheStatus, "x-trace-id": result.traceId ?? "" });
      }
      if (req.method === "POST" && url.pathname === "/v1/embeddings") {
        const body = await readJson(req); if (body.input === undefined) throw new HttpProblem(422, "Unprocessable Content", "input is required.");
        if (Array.isArray(body.input) && body.input.length > 128) throw new HttpProblem(422, "Unprocessable Content", "input accepts at most 128 items.");
        return sendJson(res, 200, await service.embeddings(body));
      }
      if (req.method === "GET" && url.pathname === "/api/metrics") return sendJson(res, 200, await store.metrics({ tenantId }));
      if (req.method === "GET" && url.pathname === "/api/traces") return sendJson(res, 200, await store.listTraces({ tenantId, limit: Math.min(100, Math.max(1, Number(url.searchParams.get("limit") ?? 30))) }));
      const traceMatch = url.pathname.match(/^\/api\/traces\/([^/]+)$/);
      if (req.method === "GET" && traceMatch) {
        const trace = await store.getTrace({ tenantId, id: decodeURIComponent(traceMatch[1]) });
        if (!trace) throw new HttpProblem(404, "Not Found", "Trace not found.");
        return sendJson(res, 200, trace);
      }
      if (req.method === "POST" && url.pathname === "/api/traces") {
        const body = await readJson(req); const created = await store.createTrace({ ...body, tenantId });
        return sendJson(res, 201, created, { location: `/api/traces/${encodeURIComponent(created.id)}` });
      }
      const stepMatch = url.pathname.match(/^\/api\/traces\/([^/]+)\/steps$/);
      if (req.method === "POST" && stepMatch) {
        const body = await readJson(req); const created = await store.addTraceStep({ ...body, tenantId, traceId: decodeURIComponent(stepMatch[1]) });
        return sendJson(res, 201, created);
      }
      const evalMatch = url.pathname.match(/^\/api\/traces\/([^/]+)\/evaluation$/);
      if (req.method === "POST" && evalMatch) {
        const updated = await store.flagTrace({ tenantId, id: decodeURIComponent(evalMatch[1]) });
        return sendJson(res, 200, updated);
      }
      throw new HttpProblem(404, "Not Found", "Route not found.");
    } catch (error) {
      if ((error.status ?? 500) >= 500) logger.error("AI platform request failed", { path: url.pathname, cause: redactSensitive(error.message), technicalDetails: redactSensitive(error.technicalDetails ?? null) });
      sendProblem(res, error, url.pathname);
    }
  });
}
