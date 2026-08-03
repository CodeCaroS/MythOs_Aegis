# Changelog

## Unreleased

- Added a Harness-native AI Engineering Platform with cost routing, pgvector semantic caching, model-regression CI, failure-forensics tracing, self-healing documentation actions, configuration-gated SessionStart reuse, and held-out, draft-PR-only policy improvement.
- Added Focus-Friendly Output for action-first, low-cognitive-load responses.

## 1.0.1

- Expanded the library to 29 skills, including personalized engineering, writing, API, accessibility, and UX review workflows.
- Added shared output components and optimized skill output composition.
- Added Apache License 2.0 release notices, retained third-party license terms, and EU AI Act discovery guidance.
- `skill-guard` now validates Apache-2.0 metadata in addition to inventory drift, frontmatter, and name alignment.

## 1.0.0

- Canonical skill inventory is synchronized across `.agents/skills/`, `agents.json`, and `README.md`.
- `skill-guard` now checks inventory drift in addition to frontmatter and name alignment.
- Added the missing `decision-criticality-gate` and `output-templates` entries to the canonical inventory.
