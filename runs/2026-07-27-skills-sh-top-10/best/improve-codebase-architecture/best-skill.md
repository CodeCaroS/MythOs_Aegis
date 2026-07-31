---
name: improve-codebase-architecture
description: Review a codebase for evidence-backed architecture improvements, prioritizing hot paths, duplicated complexity, leaky boundaries, and hard-to-test flows while preserving established domain decisions. Use for architecture audits, module reviews, refactor candidates, or blunt good-cop/bad-cop reviews.
version: 1.0.0
author: Caro
license: Apache-2.0
tags:
  - architecture
  - refactoring
  - review
---

# Improve Codebase Architecture

Keep the review analysis-only until implementation is explicitly requested.

## Workflow

1. Read repository instructions, status, recent history, domain vocabulary, and relevant ADRs.
2. Scope the review to the named area or recurring change hotspots.
3. Trace each candidate end to end, including callers, persistence, trust boundaries, UI state, and tests.
4. Prefer deletion, consolidation, or an existing seam over a new abstraction.
5. Apply the deletion test: removing a module should concentrate complexity, not merely relocate it.
6. Rank only confirmed findings:
   - **Strong**: repeated friction with a small, testable root fix.
   - **Worth exploring**: credible benefit with unresolved tradeoffs.
   - **Speculative**: insufficient evidence; do not recommend implementation.
7. For each finding, cite files, explain current friction, give the smallest root-cause change, and name the verification.
8. Use a diagram or HTML report only when relationships are materially clearer than concise prose.

Reject one-implementation interfaces, speculative factories, framework rewrites, test-only extraction, and patterns imported against the repository's architecture. Distinguish implementation evidence from formal acceptance or release status.

Adapted for MythOs Aegis from `mattpocock/skills` `improve-codebase-architecture`.
