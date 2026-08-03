import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { PostgresStore } from "../src/store.mjs";

test("PostgreSQL store persists cache metrics and a trace root cause", { skip: !process.env.TEST_DATABASE_URL }, async () => {
  const tenantId = `test-${randomUUID()}`;
  const store = new PostgresStore({ connectionString: process.env.TEST_DATABASE_URL, embeddingDimensions: 1_536 });
  await store.init();
  try {
    const embedding = Array.from({ length: 1_536 }, (_, index) => index === 0 ? 1 : 0);
    await store.putCache({ id: randomUUID(), tenantId, settingsHash: "settings", requestHash: "request", embedding, response: { answer: 42 }, tier: "cheap", model: "small", costEstimate: 0.01, createdAt: new Date(), expiresAt: new Date(Date.now() + 60_000) });
    const cached = await store.findCache({ tenantId, settingsHash: "settings", embedding, threshold: 0.99, now: new Date() });
    assert.equal(cached.response.answer, 42);

    await store.logRouting({ id: randomUUID(), tenantId, traceId: null, tier: "cheap", model: "small", provider: "test", reason: "test", complexity: 0, cacheHit: true, cost: 0, savedCost: 0.01, latencyMs: 4, createdAt: new Date() });
    assert.equal((await store.metrics({ tenantId })).requests, 1);

    const trace = await store.createTrace({ tenantId, name: "integration", status: "running", input: { password: "secret" } });
    await assert.rejects(() => store.addTraceStep({ tenantId: "different-tenant", traceId: trace.id, name: "forbidden", status: "ok" }), /Trace not found for tenant/);
    await store.addTraceStep({ tenantId, traceId: trace.id, name: "provider", status: "error", error: "timeout" });
    await store.finishTrace({ id: trace.id, status: "error", error: "timeout", evaluationStatus: "flagged" });
    const storedTrace = await store.getTrace({ tenantId, id: trace.id });
    assert.equal(storedTrace.input.password, "[REDACTED_SECRET]");
    assert.equal(storedTrace.rootCause.name, "provider");
  } finally {
    await store.pool.query("DELETE FROM route_decisions WHERE tenant_id=$1", [tenantId]);
    await store.pool.query("DELETE FROM semantic_cache WHERE tenant_id=$1", [tenantId]);
    await store.pool.query("DELETE FROM traces WHERE tenant_id=$1", [tenantId]);
    await store.close();
  }
});
