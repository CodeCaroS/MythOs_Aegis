function number(env, key, fallback, minimum = 0) {
  const value = env[key] === undefined || env[key] === "" ? fallback : Number(env[key]);
  if (!Number.isFinite(value) || value < minimum) throw new Error(`${key} must be a number greater than or equal to ${minimum}.`);
  return value;
}

function tier(env, name, quality, latencyMs) {
  const prefix = `TIER_${name.toUpperCase()}`;
  return {
    tier: name,
    provider: env[`${prefix}_PROVIDER`] ?? name,
    baseUrl: env[`${prefix}_BASE_URL`] ?? env.LLM_BASE_URL ?? "https://api.openai.com/v1",
    apiKey: env[`${prefix}_API_KEY`] ?? env.LLM_API_KEY ?? "",
    model: env[`${prefix}_MODEL`] ?? "",
    quality: number(env, `${prefix}_QUALITY`, quality, 0),
    latencyMs: number(env, `${prefix}_LATENCY_MS`, latencyMs, 1),
    inputPerMillion: number(env, `${prefix}_INPUT_PER_MILLION`, 0, 0),
    outputPerMillion: number(env, `${prefix}_OUTPUT_PER_MILLION`, 0, 0)
  };
}

function tenantKeys(env) {
  if (!env.PLATFORM_TENANT_KEYS) return {};
  let parsed;
  try { parsed = JSON.parse(env.PLATFORM_TENANT_KEYS); }
  catch { throw new Error("PLATFORM_TENANT_KEYS must be a JSON object of tenant IDs to bearer tokens."); }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed) || Object.keys(parsed).length > 100) throw new Error("PLATFORM_TENANT_KEYS must contain at most 100 tenant-token entries.");
  for (const [tenantId, token] of Object.entries(parsed)) {
    if (!/^[A-Za-z0-9._-]{1,64}$/.test(tenantId) || typeof token !== "string" || token.length < 8) throw new Error("PLATFORM_TENANT_KEYS contains an invalid tenant ID or token.");
  }
  return parsed;
}

export function loadConfig(env = process.env) {
  const policy = loadPolicy(env.AI_PLATFORM_POLICY_PATH);
  const tiers = [tier(env, "cheap", 0.45, 250), tier(env, "medium", 0.72, 600), tier(env, "powerful", 0.95, 1_200)];
  const missingModels = tiers.filter(item => !item.model).map(item => `TIER_${item.tier.toUpperCase()}_MODEL`);
  if (missingModels.length) throw new Error(`Configure the three model tiers: ${missingModels.join(", ")}.`);
  const embeddingModel = env.EMBEDDING_MODEL ?? "";
  if (!embeddingModel) throw new Error("EMBEDDING_MODEL is required for semantic caching.");
  const host = env.HOST ?? "127.0.0.1";
  const apiKey = env.PLATFORM_API_KEY ?? "";
  const scopedTenantKeys = tenantKeys(env);
  if (!apiKey && Object.keys(scopedTenantKeys).length === 0 && !["127.0.0.1", "localhost", "::1"].includes(host)) throw new Error("PLATFORM_API_KEY or PLATFORM_TENANT_KEYS is required when HOST is not loopback-only.");
  return {
    port: number(env, "PORT", 8797, 1),
    host,
    databaseUrl: env.DATABASE_URL ?? "postgresql://postgres:postgres@127.0.0.1:55432/ai_engineering",
    apiKey,
    tenantKeys: scopedTenantKeys,
    rateLimitPerMinute: number(env, "RATE_LIMIT_PER_MINUTE", 60, 1),
    requestTimeoutMs: number(env, "UPSTREAM_TIMEOUT_MS", 60_000, 100),
    cacheThreshold: number(env, "CACHE_THRESHOLD", policy.cache.threshold, 0),
    cacheTtlSeconds: number(env, "CACHE_TTL_SECONDS", 86_400, 1),
    embeddingDimensions: number(env, "EMBEDDING_DIMENSIONS", 1_536, 1),
    embedding: {
      provider: env.EMBEDDING_PROVIDER ?? "configured-provider",
      baseUrl: env.EMBEDDING_BASE_URL ?? env.LLM_BASE_URL ?? "https://api.openai.com/v1",
      apiKey: env.EMBEDDING_API_KEY ?? env.LLM_API_KEY ?? "",
      model: embeddingModel
    },
    tiers,
    policy
  };
}
import { loadPolicy } from "./self-improvement.mjs";
