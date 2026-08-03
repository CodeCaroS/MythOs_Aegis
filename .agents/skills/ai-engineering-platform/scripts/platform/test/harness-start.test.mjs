import test from "node:test";
import assert from "node:assert/strict";
import { ensurePlatform } from "../src/harness-start.mjs";

const configured = {
  PLATFORM_API_KEY: "local-token",
  TIER_CHEAP_MODEL: "small",
  TIER_MEDIUM_MODEL: "medium",
  TIER_POWERFUL_MODEL: "large",
  EMBEDDING_MODEL: "embedding"
};

test("Harness startup reuses the owned healthy platform without starting Docker", async () => {
  let starts = 0;
  const result = await ensurePlatform({
    environment: configured,
    probePort: async () => "expected",
    startCompose: async () => { starts += 1; }
  });

  assert.equal(result.status, "reused");
  assert.equal(starts, 0);
});

test("Harness startup rejects a port owned by another process", async () => {
  let starts = 0;
  const result = await ensurePlatform({
    environment: configured,
    probePort: async () => "foreign",
    startCompose: async () => { starts += 1; }
  });

  assert.equal(result.status, "rejected");
  assert.match(result.message, /another process/i);
  assert.equal(starts, 0);
});

test("Harness startup skips safely when required local configuration is missing", async () => {
  let probed = false;
  const result = await ensurePlatform({
    environment: {},
    probePort: async () => { probed = true; return "absent"; },
    startCompose: async () => assert.fail("Docker must not start without configuration")
  });

  assert.equal(result.status, "skipped");
  assert.match(result.message, /PLATFORM_API_KEY/);
  assert.equal(probed, false);
});

test("Harness startup treats an empty tenant-key map as missing authentication", async () => {
  const result = await ensurePlatform({
    environment: { ...configured, PLATFORM_API_KEY: "", PLATFORM_TENANT_KEYS: "{}" },
    probePort: async () => assert.fail("Port must not be probed"),
    startCompose: async () => assert.fail("Docker must not start")
  });
  assert.equal(result.status, "skipped");
});

test("Harness startup starts once and verifies the expected service", async () => {
  const probes = ["absent", "absent", "expected"];
  let starts = 0;
  const result = await ensurePlatform({
    environment: configured,
    probePort: async () => probes.shift() ?? "expected",
    startCompose: async () => { starts += 1; },
    wait: async () => {}
  });

  assert.equal(result.status, "started");
  assert.equal(starts, 1);
});
