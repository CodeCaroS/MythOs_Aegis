import test from "node:test";
import assert from "node:assert/strict";
import { createHttpServer } from "../src/server.mjs";
import { createTraceClient } from "../src/sdk.mjs";

async function withServer(options, run) {
  const server = createHttpServer(options);
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  try {
    const address = server.address();
    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
}

test("HTTP boundary requires auth, rejects streaming, and preserves compatible chat responses", async () => {
  const service = {
    async chat() {
      return { response: { id: "chat-1", object: "chat.completion", choices: [], model: "small" }, tier: "cheap", cacheStatus: "MISS" };
    }
  };
  const store = { async metrics() { return { requests: 0 }; }, async listTraces() { return []; } };
  await withServer({ service, store, config: { apiKey: "test-key", rateLimitPerMinute: 60 } }, async baseUrl => {
    const unauthenticated = await fetch(`${baseUrl}/v1/chat/completions`, { method: "POST", body: "{}", headers: { "content-type": "application/json" } });
    assert.equal(unauthenticated.status, 401);
    assert.equal(unauthenticated.headers.get("content-type"), "application/problem+json");

    const streaming = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: { authorization: "Bearer test-key", "content-type": "application/json" },
      body: JSON.stringify({ stream: true, messages: [{ role: "user", content: "hello" }] })
    });
    assert.equal(streaming.status, 422);

    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: { authorization: "Bearer test-key", "content-type": "application/json", "x-tenant-id": "demo" },
      body: JSON.stringify({ model: "auto", messages: [{ role: "user", content: "hello" }] })
    });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("x-ai-route-tier"), "cheap");
    assert.equal((await response.json()).object, "chat.completion");
  });
});

test("tenant-scoped bearer tokens cannot select another tenant", async () => {
  const service = { async chat() { return { response: { object: "chat.completion" }, tier: "cheap", cacheStatus: "MISS" }; } };
  const store = { async metrics() { return {}; }, async listTraces() { return []; } };
  await withServer({ service, store, config: { apiKey: "admin-key", tenantKeys: { alpha: "alpha-key", beta: "beta-key" }, rateLimitPerMinute: 60 } }, async baseUrl => {
    const request = tenantId => fetch(`${baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: { authorization: "Bearer alpha-key", "content-type": "application/json", "x-tenant-id": tenantId },
      body: JSON.stringify({ messages: [{ role: "user", content: "hello" }] })
    });
    assert.equal((await request("alpha")).status, 200);
    assert.equal((await request("beta")).status, 401);
  });
});

test("dashboard exposes metrics and a trace timeline surface", async () => {
  const service = { async chat() { throw new Error("unused"); } };
  const store = { async metrics() { return { requests: 0 }; }, async listTraces() { return []; } };
  await withServer({ service, store, config: { apiKey: "", rateLimitPerMinute: 60 } }, async baseUrl => {
    const response = await fetch(`${baseUrl}/dashboard`);
    const html = await response.text();
    assert.equal(response.status, 200);
    assert.match(html, /<main/);
    assert.match(html, /Cache hit rate/);
    assert.match(html, /Trace timeline/);
  });
});

test("trace SDK records redacted successful steps through the public collector API", async () => {
  const recorded = [];
  const store = {
    async metrics() { return {}; }, async listTraces() { return []; },
    async createTrace(entry) { recorded.push(entry); return entry; },
    async addTraceStep(entry) { recorded.push(entry); return entry; },
    async flagTrace(entry) { return entry; }
  };
  await withServer({ service: {}, store, config: { apiKey: "", rateLimitPerMinute: 60 } }, async baseUrl => {
    const trace = await createTraceClient({ baseUrl }).start("pipeline", { email: "caro@example.com" });
    const value = await trace.step("tool.lookup", async () => ({ answer: 42 }));
    assert.deepEqual(value, { answer: 42 });
    assert.equal(recorded.length, 2);
    assert.equal(recorded[0].input.email, "[REDACTED_EMAIL]");
    assert.equal(recorded[1].name, "tool.lookup");
  });
});
