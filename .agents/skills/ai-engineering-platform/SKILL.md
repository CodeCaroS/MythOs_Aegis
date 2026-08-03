---
name: ai-engineering-platform
description: >
  Build, run, test, or extend the Harness-native AI Engineering Platform: an
  OpenAI-compatible cost router, PostgreSQL/pgvector semantic cache,
  model-regression action, failure-forensics trace SDK and dashboard, and
  self-healing Markdown documentation action. Use for LLM routing, semantic
  caching, golden-dataset CI, AI pipeline tracing, cost and latency dashboards,
  or evidence-backed documentation updates.
version: 0.2.0
author: Caro
license: Apache-2.0
tags:
  - llm-routing
  - semantic-cache
  - evaluation
  - observability
  - documentation
---

# AI Engineering Platform

Use the shared Node service in `scripts/platform/`; do not scaffold five separate stacks. Read [configuration.md](references/configuration.md) before starting the service or a GitHub Action.

## Route the task

| Need | Use |
| --- | --- |
| Cheapest suitable model, route logs, savings | `POST /v1/chat/completions` with model `auto` |
| Semantic response reuse | The same endpoint; pgvector lookup runs before routing |
| Baseline versus candidate quality | `node src/cli.mjs regress` or `assets/actions/model-regression/action.yml` |
| Pipeline traces and root-cause timeline | `src/sdk.mjs`, `/api/traces`, and `/dashboard` |
| Markdown updates from code diffs | `node src/cli.mjs heal-docs` or `assets/actions/self-healing-docs/action.yml` |
| Bounded policy improvement | `node src/cli.mjs improve` or `assets/workflows/self-improvement.yml` |

## Run the platform

1. Copy `scripts/platform/env.example` to an untracked `.env` and configure three model identifiers, prices, an embedding model, and credentials.
2. Trust the repository hook when prompted. On Harness `SessionStart`, `.codex/hooks.json` starts or reuses the Compose stack after configuration is complete. Manual fallback: from `scripts/platform/`, run `docker compose up --build`.
3. Check `GET /health`, then use `/v1/chat/completions` with `Authorization: Bearer <token>` and `X-Tenant-ID`. `PLATFORM_API_KEY` is an explicit all-tenant admin token; prefer a matching `PLATFORM_TENANT_KEYS` entry for ordinary tenant traffic.
4. Open `/dashboard` for routing, cache, cost, latency, and trace evidence.

Use provider URLs only from environment configuration. Never accept an upstream URL from an API request. Bind ordinary bearer tokens to tenant IDs, redact before persistence, and expose provider diagnostics only under explicit debug output.

The startup hook is idempotent. It reuses only a health endpoint identifying this platform, refuses an unrelated process on the configured port, skips cleanly when `.env` is incomplete, and never changes policy.

## Run CI capabilities

- Copy the applicable template from `assets/workflows/` into `.github/workflows/` only where this complete skill package remains at `.agents/skills/ai-engineering-platform/`; the workflow uses its local action and scripts. Otherwise copy the complete package, not the workflow alone.
- Keep regression datasets in JSON and compare separate baseline and candidate URLs. A judge-score drop beyond the configured allowance fails the command after the Markdown report is written.
- Keep the model-regression template manual by default; select a repository-specific trigger only after the candidate endpoint lifecycle is known. Send sensitive golden cases only to an approved judge boundary.
- Let documentation automation touch only tracked Markdown candidates. Keep sources and uncertainty in the generated report, commit to the current feature branch, and create a draft pull request only.
- The self-improvement workflow may propose only `routing.simpleMaxScore`, `routing.mediumMaxScore`, `cache.threshold`, and `prompts.system`. It sees training cases and redacted evidence, then evaluates the frozen proposal against a separate held-out file with quality, cost, and latency caps.
- Rejected or incomplete candidates do not write `policy.json`. Accepted candidates are pushed only to the automation branch and opened or refreshed as a draft pull request. Human merge is the activation boundary; never auto-merge or modify live configuration.

Do not use `pull_request_target` for the documentation workflow: it would combine write credentials with untrusted pull-request code.

## Verify changes

From `scripts/platform/` run:

```powershell
npm test
node --check src/cli.mjs
docker compose config
```

For a configured optimizer, run `npm run improve -- --training fixtures/self-improvement-training.json --heldout fixtures/self-improvement-heldout.json`. The local default writes `policy.candidate.json`; only CI targets tracked `policy.json`, after held-out acceptance.

From the repository root run `node scripts/skill-guard.mjs`. A live provider call and PostgreSQL integration remain unverified unless credentials and Docker are available; report that boundary explicitly.

## Shared output profile

Compose the `execution` profile from [output-templates](../output-templates/references/components.md). Report the selected capability, mutation, exact checks, and any unverified provider, database, CI, or draft-PR state.
