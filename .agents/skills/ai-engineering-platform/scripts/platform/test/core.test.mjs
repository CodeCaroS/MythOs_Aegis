import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { selectRoute } from "../src/router.mjs";
import { redactSensitive } from "../src/redact.mjs";
import { createChatService } from "../src/chat-service.mjs";
import { runRegression } from "../src/regression.mjs";
import { findRootCause } from "../src/traces.mjs";
import { validateDocUpdates } from "../src/doc-healer.mjs";
import { loadConfig } from "../src/config.mjs";

const tiers = [
  { tier: "cheap", model: "small", quality: 0.45, latencyMs: 200, inputPerMillion: 0.1, outputPerMillion: 0.4 },
  { tier: "medium", model: "medium", quality: 0.72, latencyMs: 500, inputPerMillion: 0.5, outputPerMillion: 1.5 },
  { tier: "powerful", model: "large", quality: 0.95, latencyMs: 900, inputPerMillion: 2, outputPerMillion: 8 }
];

test("routes simple, analytical, and demanding requests to the cheapest suitable tier", () => {
  assert.equal(selectRoute({ body: { messages: [{ role: "user", content: "Translate hello to German." }] }, tiers }).tier, "cheap");
  assert.equal(selectRoute({ body: { messages: [{ role: "user", content: "Analyze this architecture and compare the tradeoffs between three options with evidence." }] }, tiers }).tier, "medium");
  assert.equal(selectRoute({ body: { messages: [{ role: "user", content: `${"x".repeat(9000)}\nDebug this distributed system and produce a migration plan.` }] }, tiers }).tier, "powerful");
});

test("redacts common credentials and personal identifiers before tracing", () => {
  const input = "Authorization: Bearer secret-token; email caro@example.com; password=hunter2; sk-12345678901234567890";
  const redacted = redactSensitive(input);
  assert.doesNotMatch(redacted, /secret-token|caro@example.com|hunter2|sk-123/);
  assert.match(redacted, /\[REDACTED/);
});

test("semantic cache serves a similar request without a second model call", async () => {
  const entries = [];
  let modelCalls = 0;
  const store = {
    async findCache({ tenantId, settingsHash }) {
      return entries.find(entry => entry.tenantId === tenantId && entry.settingsHash === settingsHash) ?? null;
    },
    async putCache(entry) { entries.push(entry); },
    async logRouting() {},
    async createTrace() {},
    async addTraceStep() {},
    async finishTrace() {}
  };
  const service = createChatService({
    store,
    tiers,
    embed: async () => [1, 0, 0],
    complete: async ({ model }) => {
      modelCalls += 1;
      return {
        response: { id: "chat-1", object: "chat.completion", model, choices: [{ index: 0, message: { role: "assistant", content: "Berlin" }, finish_reason: "stop" }], usage: { prompt_tokens: 5, completion_tokens: 1, total_tokens: 6 } },
        latencyMs: 120
      };
    },
    now: () => new Date("2026-08-02T12:00:00Z")
  });

  const body = { model: "auto", messages: [{ role: "user", content: "What is Germany's capital?" }] };
  const first = await service.chat({ body, tenantId: "test" });
  const second = await service.chat({ body, tenantId: "test" });

  assert.equal(first.cacheStatus, "MISS");
  assert.equal(second.cacheStatus, "HIT");
  assert.equal(second.response.choices[0].message.content, "Berlin");
  assert.equal(modelCalls, 1);
});

test("regression runner compares baseline and candidate with an LLM judge", async () => {
  const result = await runRegression({
    cases: [{ id: "capital", input: { messages: [{ role: "user", content: "Capital of Germany?" }] }, minimumScore: 0.8 }],
    baseline: async () => "Berlin",
    candidate: async () => "Munich",
    judge: async ({ answer }) => answer === "Berlin" ? { score: 1, reason: "correct" } : { score: 0.2, reason: "incorrect" },
    allowedDrop: 0.1
  });

  assert.equal(result.passed, false);
  assert.equal(result.cases[0].regression, true);
  assert.match(result.markdown, /capital.*FAIL/s);
});

test("forensics identifies the first failed pipeline step", () => {
  const root = findRootCause([
    { id: "a", name: "retrieve", status: "ok", startedAt: "2026-08-02T10:00:00Z" },
    { id: "b", name: "tool.weather", status: "error", error: "timeout", startedAt: "2026-08-02T10:00:01Z" },
    { id: "c", name: "summarize", status: "error", error: "missing input", startedAt: "2026-08-02T10:00:02Z" }
  ]);
  assert.equal(root.id, "b");
  assert.equal(root.name, "tool.weather");
});

test("documentation healer only accepts existing candidate Markdown paths", () => {
  const accepted = validateDocUpdates({
    root: "C:/repo",
    candidates: ["README.md", "docs/api.md"],
    updates: [
      { path: "docs/api.md", content: "# API\nUpdated", sources: ["src/api.mjs"], uncertainty: "none" },
      { path: "../secrets.md", content: "stolen" },
      { path: "src/api.mjs", content: "not markdown" }
    ]
  });
  assert.deepEqual(accepted.map(update => update.path), ["docs/api.md"]);
});

test("configuration refuses an unauthenticated non-loopback listener", () => {
  const env = { HOST: "0.0.0.0", TIER_CHEAP_MODEL: "small", TIER_MEDIUM_MODEL: "medium", TIER_POWERFUL_MODEL: "large", EMBEDDING_MODEL: "embedding" };
  assert.throws(() => loadConfig(env), /PLATFORM_API_KEY or PLATFORM_TENANT_KEYS is required/);
  assert.equal(loadConfig({ ...env, PLATFORM_API_KEY: "secret" }).apiKey, "secret");
  const tenantConfig = loadConfig({ ...env, PLATFORM_TENANT_KEYS: '{"alpha":"alpha-key"}' });
  assert.deepEqual(tenantConfig.tenantKeys, { alpha: "alpha-key" });
});

test("empty CACHE_THRESHOLD activates the reviewed policy value", () => {
  const directory = mkdtempSync(path.join(tmpdir(), "ai-platform-policy-"));
  const policyPath = path.join(directory, "policy.json");
  writeFileSync(policyPath, JSON.stringify({ version: 1, routing: { simpleMaxScore: 1, mediumMaxScore: 5 }, cache: { threshold: 0.93 }, prompts: { system: "" } }));
  try {
    const config = loadConfig({
      AI_PLATFORM_POLICY_PATH: policyPath,
      CACHE_THRESHOLD: "",
      TIER_CHEAP_MODEL: "small",
      TIER_MEDIUM_MODEL: "medium",
      TIER_POWERFUL_MODEL: "large",
      EMBEDDING_MODEL: "embedding"
    });
    assert.equal(config.cacheThreshold, 0.93);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
