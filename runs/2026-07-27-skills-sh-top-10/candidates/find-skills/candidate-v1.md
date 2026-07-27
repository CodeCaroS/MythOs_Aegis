---
name: find-skills
description: Find, assess, and add agent skills when the user asks for a reusable capability, a skill recommendation, or an extension to the harness. Use for skills.sh discovery, repository-local skill selection, install requests, and deciding whether an existing skill already covers the task.
version: 1.0.0
author: Caro
license: Apache-2.0
tags:
  - skill-discovery
  - harness
  - reuse
---

# Find Skills

Reuse before adding anything.

## Workflow

1. Inspect the available skill catalog and `.agents/skills/`.
2. If an installed skill covers the request, use it and stop.
3. Otherwise search the live skills.sh leaderboard, then use `npx skills find <specific query>` when needed.
4. Verify the candidate's source, license, install count, maintenance, required tools, and overlap with existing skills.
5. Recommend at most three options with the smallest useful comparison.
6. Install only when the user asks. Prefer this repository's `.agents/skills/` for harness skills; use global installation only when explicitly requested.
7. After adding a local skill, update `agents.json` and `README.md`, then run `node scripts/skill-guard.mjs`.

Do not recommend a skill from popularity alone. Treat a new dependency, opaque installer, or broad tool permission as a cost. If no skill is clearly better than the existing harness or general capability, say so and proceed without adding one.

Adapted for MythOs Aegis from `vercel-labs/skills` `find-skills`.
