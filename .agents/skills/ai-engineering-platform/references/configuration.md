# Configuration and contracts

## Contents

1. Runtime
2. Model tiers and cache
3. HTTP contract
4. Regression dataset
5. GitHub Actions
6. Harness startup
7. Bounded self-improvement
8. Known MVP limits

## 1. Runtime

The service requires Node.js 20 or newer and PostgreSQL with pgvector. `scripts/platform/docker-compose.yml` supplies both runtime services. Copy `env.example` to `.env`; never commit credentials. The tracked `policy.json` contains only reviewed, non-secret routing, cache, and system-prompt policy.

Required values:

- `TIER_CHEAP_MODEL`, `TIER_MEDIUM_MODEL`, `TIER_POWERFUL_MODEL`
- `EMBEDDING_MODEL`
- the corresponding base URLs and API keys when the provider is not inherited from `LLM_BASE_URL` and `LLM_API_KEY`

Set either `PLATFORM_API_KEY` or `PLATFORM_TENANT_KEYS` outside isolated local development. `PLATFORM_API_KEY` is an explicit admin token with access to every tenant. `PLATFORM_TENANT_KEYS` is a JSON object such as `{"team-a":"long-random-token"}`; a scoped token works only when `X-Tenant-ID` names its own entry. Prefer a dedicated scoped token for self-improvement evidence. `DATABASE_URL` defaults to the local Compose database.

## 2. Model tiers and cache

Each `TIER_<NAME>_*` group accepts `PROVIDER`, `BASE_URL`, `API_KEY`, `MODEL`, `QUALITY`, `LATENCY_MS`, `INPUT_PER_MILLION`, and `OUTPUT_PER_MILLION`. Prices are currency units per one million tokens. Zero prices are valid for local models but make latency the tie-breaker. Keep the workflow quality and latency variables aligned with the deployed tiers so held-out gates use representative values.

The router estimates complexity, derives the minimum quality, applies optional `X-Max-Latency-Ms`, then selects the cheapest suitable tier. A model value equal to a tier name or configured model bypasses automatic selection. Leave `CACHE_THRESHOLD` empty to use reviewed `policy.json`; a non-empty environment value deliberately overrides the policy.

Semantic cache entries are scoped by `X-Tenant-ID`, generation settings, TTL, and cosine similarity. Configure `CACHE_THRESHOLD`, `CACHE_TTL_SECONDS`, and `EMBEDDING_DIMENSIONS`. The cache stores an embedding, request hash, response, and expiry; it does not store the raw prompt.

## 3. HTTP contract

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Process health |
| `GET` | `/openapi.json` | OpenAPI 3.1 contract |
| `GET` | `/dashboard` | Metrics and trace timeline |
| `GET` | `/v1/models` | Tier aliases |
| `POST` | `/v1/chat/completions` | Non-streaming OpenAI-compatible routing and cache |
| `POST` | `/v1/embeddings` | Configured embedding proxy |
| `GET` | `/api/metrics` | Requests, routes, costs, savings, hit rate, latency |
| `GET/POST` | `/api/traces` | List or create traces |
| `GET` | `/api/traces/{id}` | Timeline and likely first failing step |

Errors use RFC 9457 Problem Details. Requests are limited to 1 MiB and a configurable per-process requests-per-minute limit. Streaming is deliberately rejected with `422` in this MVP. Tenant-scoped bearer tokens cannot override their `X-Tenant-ID`; the optional admin token can do so intentionally.

## 4. Regression dataset

Store a JSON array. Each case needs `id`, `input.messages`, evaluation `criteria`, and optionally `minimumScore`:

```json
[
  {
    "id": "stable-answer",
    "input": { "messages": [{ "role": "user", "content": "Question" }] },
    "criteria": "Concrete correctness criteria",
    "minimumScore": 0.8
  }
]
```

The runner calls baseline and candidate endpoints, asks the configured judge for scores from 0 to 1, writes a Markdown report, and exits non-zero on a score-floor violation or excessive drop. Set `BASELINE_MODEL` and `CANDIDATE_MODEL` for raw provider endpoints; `auto` is valid for this platform. Golden cases and generated answers cross the judge boundary, so do not use sensitive datasets with an unapproved provider.

## 5. GitHub Actions

Copy an asset from `assets/workflows/` to the target repository's `.github/workflows/` only when the complete skill package is present at the same local path. Configure repository variables for URLs and model names and encrypted secrets for API keys. The regression template uses `workflow_dispatch`; replace it only with a trigger that matches how the candidate endpoint becomes available.

The documentation action needs `contents: write` and `pull-requests: write`. It redacts the diff, proposes only complete contents for supplied tracked Markdown candidates, records sources and uncertainty, commits to the current non-main branch, and creates or reuses a draft pull request.

The self-improvement template runs weekly and manually. Configure its repository variables and encrypted secrets from `env.example`. It must be able to reach `SELF_IMPROVEMENT_EVIDENCE_URL`; use a self-hosted runner or an approved remote platform endpoint when `127.0.0.1` is not reachable from GitHub-hosted runners. The workflow never uses `pull_request_target` and never auto-merges.

## 6. Harness startup

The trusted repository hook in `.codex/hooks.json` handles `SessionStart` sources `startup` and `resume`. It reads `scripts/platform/.env`, then:

1. skips without starting Docker when required values are missing;
2. reuses the service only when `GET /health` returns this platform's service identity;
3. refuses a foreign listener on `PORT`;
4. otherwise runs `docker compose up -d --build --wait` once and verifies health.

Hook failures add short recovery context to the Harness session but do not block unrelated repository work. The hook never invokes the optimizer or GitHub.

## 7. Bounded self-improvement

`policy.json` is the only activation surface. Candidate schemas are strict and allow only:

- `routing.simpleMaxScore`
- `routing.mediumMaxScore`
- `cache.threshold`
- `prompts.system`

Prompt values reject common secrets, shell payloads, and path traversal. All CLI input/output paths stay inside the current repository. Evidence collection reads tenant-scoped metrics and traces plus the current regression report, redacts it again, and sends only training cases to the proposer. Configure `SELF_IMPROVEMENT_EVIDENCE_API_KEY` with the scoped token for `SELF_IMPROVEMENT_TENANT_ID` instead of using the admin token.

The candidate is frozen before evaluation. Training must pass first; the separate held-out file is loaded only afterward. Acceptance requires all case floors, no quality regression, no more than 5% cost increase, no more than 10% latency increase, and a measurable quality, cost, or latency improvement. Prompt mutations additionally require independent target and judge endpoints. Missing credentials, unreachable evidence, malformed output, unsafe fields, and incomplete evaluation all leave active policy unchanged.

Local `improve` runs write `policy.candidate.json` by default. The workflow explicitly targets tracked `policy.json`, commits only an accepted policy to `automation/ai-platform-self-improvement`, and creates or refreshes a draft pull request. The new policy becomes active only after a human merges it and the service restarts.

## 8. Known MVP limits

- Chat streaming is not implemented.
- Rate limiting is per process, not distributed.
- Token counts are estimated when an upstream response omits usage.
- Redaction covers common tokens, secrets, passwords, and email addresses; organization-specific PII needs additional rules.
- The first failing step is the root-cause heuristic. Complex causal graphs need a richer evaluator.
- The optimizer changes four policy fields only; model inventories, provider URLs, credentials, code, workflows, and deployment settings are never self-modified.
- Scheduled evidence collection needs a runner that can reach the configured platform endpoint.
