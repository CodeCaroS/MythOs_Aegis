import { createHash, randomUUID } from "node:crypto";
import { calculateActualCost, selectRoute } from "./router.mjs";
import { redactSensitive } from "./redact.mjs";

const CACHE_SETTINGS = ["model", "user", "temperature", "top_p", "seed", "tools", "tool_choice", "response_format", "max_tokens", "max_completion_tokens"];

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]));
  return value;
}

function settingsHash(body) {
  const settings = Object.fromEntries(CACHE_SETTINGS.filter(key => body[key] !== undefined).map(key => [key, body[key]]));
  return createHash("sha256").update(JSON.stringify(stable(settings))).digest("hex");
}

function embeddingText(body) {
  return (body.messages ?? []).map(message => `${message.role}: ${typeof message.content === "string" ? message.content : JSON.stringify(message.content)}`).join("\n");
}

export function createChatService({
  store,
  tiers,
  embed,
  complete,
  now = () => new Date(),
  cacheThreshold = 0.92,
  cacheTtlSeconds = 86_400,
  routingPolicy,
  systemPrompt = ""
}) {
  async function recordStep(tenantId, traceId, step) {
    await store.addTraceStep({ id: randomUUID(), tenantId, traceId, ...step });
  }

  return {
    async embeddings({ input }) {
      const values = Array.isArray(input) ? input : [input];
      const vectors = await Promise.all(values.map(value => embed(String(value))));
      return { object: "list", data: vectors.map((embedding, index) => ({ object: "embedding", embedding, index })), model: "configured-embedding-model", usage: { prompt_tokens: 0, total_tokens: 0 } };
    },

    async chat({ body, tenantId, maxLatencyMs = Number.POSITIVE_INFINITY }) {
      const startedAt = now();
      const traceId = randomUUID();
      const effectiveBody = systemPrompt
        ? { ...body, messages: [{ role: "system", content: systemPrompt }, ...body.messages] }
        : body;
      const requestText = embeddingText(effectiveBody);
      const hash = settingsHash(effectiveBody);
      await store.createTrace({ id: traceId, tenantId, name: "chat.completions", status: "running", input: redactSensitive(effectiveBody), startedAt });
      try {
        const embeddingStarted = now();
        const embedding = await embed(requestText);
        await recordStep(tenantId, traceId, { name: "embedding", status: "ok", startedAt: embeddingStarted, endedAt: now(), input: redactSensitive(requestText) });

        const cacheStarted = now();
        const cached = await store.findCache({ tenantId, embedding, settingsHash: hash, threshold: cacheThreshold, now: startedAt });
        await recordStep(tenantId, traceId, { name: "cache.lookup", status: "ok", startedAt: cacheStarted, endedAt: now(), output: { hit: Boolean(cached), similarity: cached?.similarity ?? null } });
        if (cached) {
          await store.logRouting({ id: randomUUID(), tenantId, traceId, tier: cached.tier, model: cached.model, reason: "semantic-cache", complexity: null, cacheHit: true, cost: 0, savedCost: cached.costEstimate ?? 0, latencyMs: Math.max(0, now() - startedAt), createdAt: now() });
          await store.finishTrace({ id: traceId, status: "ok", output: redactSensitive(cached.response), endedAt: now() });
          return { response: cached.response, tier: cached.tier, cacheStatus: "HIT", traceId };
        }

        const route = selectRoute({ body: effectiveBody, tiers, maxLatencyMs, policy: routingPolicy });
        await recordStep(tenantId, traceId, { name: "router.select", status: "ok", startedAt: now(), endedAt: now(), output: { tier: route.tier, model: route.model, reason: route.reason, complexity: route.complexity } });
        const providerStarted = now();
        const upstream = await complete({ tier: route.tier, model: route.model, body: { ...effectiveBody, model: route.model } });
        const cost = calculateActualCost(route, upstream.response.usage) || route.estimatedCost;
        await recordStep(tenantId, traceId, { name: "provider.chat", status: "ok", startedAt: providerStarted, endedAt: now(), output: redactSensitive(upstream.response), cost, latencyMs: upstream.latencyMs });
        await store.putCache({
          id: randomUUID(), tenantId, settingsHash: hash, requestHash: createHash("sha256").update(requestText).digest("hex"), embedding,
          response: upstream.response, tier: route.tier, model: route.model, similarity: 1, costEstimate: cost,
          createdAt: now(), expiresAt: new Date(now().getTime() + cacheTtlSeconds * 1000)
        });
        await store.logRouting({ id: randomUUID(), tenantId, traceId, tier: route.tier, model: route.model, provider: route.provider, reason: route.reason, complexity: route.complexity, cacheHit: false, cost, savedCost: 0, latencyMs: upstream.latencyMs, createdAt: now() });
        await store.finishTrace({ id: traceId, status: "ok", output: redactSensitive(upstream.response), endedAt: now() });
        return { response: upstream.response, tier: route.tier, cacheStatus: "MISS", traceId };
      } catch (error) {
        await recordStep(tenantId, traceId, { name: "pipeline.failure", status: "error", error: redactSensitive(error.message), startedAt: now(), endedAt: now() });
        await store.finishTrace({ id: traceId, status: "error", error: redactSensitive(error.message), evaluationStatus: "flagged", endedAt: now() });
        throw error;
      }
    }
  };
}
