import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { randomUUID } from "node:crypto";
import { PostgresStore } from "../src/store.mjs";
import { createCompatibleClient } from "../src/llm-client.mjs";
import { createChatService } from "../src/chat-service.mjs";
import { createHttpServer } from "../src/server.mjs";

function listen(server) {
  return new Promise(resolve => server.listen(0, "127.0.0.1", () => resolve(`http://127.0.0.1:${server.address().port}`)));
}

function close(server) {
  return new Promise(resolve => server.close(resolve));
}

test("full platform routes once and serves the second request from pgvector", { skip: !process.env.TEST_DATABASE_URL }, async () => {
  const tenantId = `e2e-${randomUUID()}`;
  let chatCalls = 0;
  const embedding = Array.from({ length: 1_536 }, (_, index) => index === 0 ? 1 : 0);
  const provider = http.createServer(async (req, res) => {
    for await (const _ of req) { /* consume request */ }
    res.setHeader("content-type", "application/json");
    if (req.url === "/v1/embeddings") return res.end(JSON.stringify({ data: [{ embedding }] }));
    if (req.url === "/v1/chat/completions") {
      chatCalls += 1;
      return res.end(JSON.stringify({ id: "chat-e2e", object: "chat.completion", model: "small", choices: [{ index: 0, message: { role: "assistant", content: "Berlin" }, finish_reason: "stop" }], usage: { prompt_tokens: 5, completion_tokens: 1, total_tokens: 6 } }));
    }
    res.statusCode = 404; res.end("{}");
  });
  const providerUrl = `${await listen(provider)}/v1`;
  const tiers = [
    { tier: "cheap", provider: "fake", baseUrl: providerUrl, apiKey: "", model: "small", quality: 0.45, latencyMs: 10, inputPerMillion: 0.1, outputPerMillion: 0.2 },
    { tier: "medium", provider: "fake", baseUrl: providerUrl, apiKey: "", model: "medium", quality: 0.72, latencyMs: 20, inputPerMillion: 1, outputPerMillion: 2 },
    { tier: "powerful", provider: "fake", baseUrl: providerUrl, apiKey: "", model: "large", quality: 0.95, latencyMs: 30, inputPerMillion: 5, outputPerMillion: 10 }
  ];
  const config = { apiKey: "test-key", rateLimitPerMinute: 60, requestTimeoutMs: 5_000, embeddingDimensions: 1_536, embedding: { baseUrl: providerUrl, apiKey: "", model: "embedding" }, tiers };
  const store = new PostgresStore({ connectionString: process.env.TEST_DATABASE_URL, embeddingDimensions: 1_536 });
  await store.init();
  const client = createCompatibleClient(config);
  const service = createChatService({ store, tiers, embed: client.embed, complete: client.complete });
  const platform = createHttpServer({ service, store, config });
  const platformUrl = await listen(platform);
  try {
    const request = () => fetch(`${platformUrl}/v1/chat/completions`, { method: "POST", headers: { authorization: "Bearer test-key", "content-type": "application/json", "x-tenant-id": tenantId }, body: JSON.stringify({ model: "auto", messages: [{ role: "user", content: "What is Germany's capital?" }] }) });
    const first = await request(); const second = await request();
    assert.equal(first.status, 200, await first.clone().text());
    assert.equal(second.status, 200, await second.clone().text());
    assert.equal(first.headers.get("x-ai-cache"), "MISS");
    assert.equal(second.headers.get("x-ai-cache"), "HIT");
    assert.equal((await second.json()).choices[0].message.content, "Berlin");
    assert.equal(chatCalls, 1);
    assert.equal((await store.metrics({ tenantId })).requests, 2);
  } finally {
    await close(platform); await close(provider);
    await store.pool.query("DELETE FROM route_decisions WHERE tenant_id=$1", [tenantId]);
    await store.pool.query("DELETE FROM semantic_cache WHERE tenant_id=$1", [tenantId]);
    await store.pool.query("DELETE FROM traces WHERE tenant_id=$1", [tenantId]);
    await store.close();
  }
});
