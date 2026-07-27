# Batch B Reflection

## Decision

All three candidates clear the shared 0.80 pass threshold and improve held-out
validation by more than 0.01 with no critical-dimension regression.

| Skill | Baseline validation | Candidate validation | Delta | Decision |
| --- | ---: | ---: | ---: | --- |
| vercel-react-best-practices | 0.8430 | 0.9625 | +0.1195 | Accept |
| grill-with-docs | 0.3325 | 0.9830 | +0.6505 | Accept |
| improve-codebase-architecture | 0.6610 | 0.9635 | +0.3025 | Accept |

## vercel-react-best-practices

Stable baseline behavior:

- Correctly recognizes request waterfalls, shared server state, and oversized
  server-to-client payloads as important defects.
- Includes useful native React and Next.js performance vocabulary.

Recurring baseline failure:

- The large quick-reference catalog turns conditional options into apparent
  defaults. It makes speculative SWR, LRU, `better-all`, cache, and memoization
  advice too easy even when the prompt requires repository-compatible,
  measurable changes.
- Verification is weaker than the recommendation: render correctness alone does
  not establish a performance improvement or concurrent-request isolation.

Candidate effect:

- The guardrails make independence, ownership, trust boundaries, package reuse,
  and measurement explicit.
- The candidate retains the useful high-impact priorities while preventing
  dependency and memoization cargo culting.

Remaining risk:

- The concise candidate omits the baseline's long tail of specialized rules.
  Fetch current framework documentation or the original detailed rule set when
  a version-specific rendering primitive is directly relevant.

## grill-with-docs

Stable baseline behavior:

- The baseline at least connects decision grilling with domain documentation.

Recurring baseline failure:

- It is not self-contained: all behavior is delegated to two other workflows,
  so it provides no decision threshold, approval boundary, or fallback.
- "Creates docs as we go" encourages premature glossary and ADR writes,
  including reversible preferences and unapproved proposals.

Candidate effect:

- The candidate supplies a usable sequence, distinguishes durable decisions
  from reversible choices, and makes ADR creation conditional and approval-led.
- It prevents glossary churn by requiring a decision-dependent domain term.

Remaining risk:

- The candidate assumes a `grill-me` workflow exists. Its own six steps are
  sufficient as a fallback, but future packaging should keep that fallback
  explicit if dependencies are optional.

## improve-codebase-architecture

Stable baseline behavior:

- Scoping through recent hotspots, reading domain decisions, and applying the
  deletion test are valuable.
- Ranking recommendation strength and refusing immediate implementation are
  directionally sound.

Recurring baseline failure:

- It overfits presentation and orchestration: mandatory subagents, Tailwind and
  Mermaid CDNs, a temporary HTML file, browser opening, and side-effecting
  domain updates add ceremony unrelated to review accuracy.
- "Two adapters = real seam" can turn a sampling signal into an unsupported
  consolidation or interface recommendation.

Candidate effect:

- The candidate raises the evidence bar, traces complete flows, preserves
  analysis-only scope, and explicitly rejects one-implementation abstractions.
- It uses prose by default and reserves diagrams/HTML for relationships that
  materially benefit from them.

Remaining risk:

- On very large repositories, the candidate's end-to-end trace can still become
  broad. Apply its hotspot scoping before tracing and report insufficient
  evidence instead of widening indefinitely.

## Integrity Notes

- Only the three matching train tasks, three matching validation tasks, six
  skill snapshots, and shared rubric were read.
- `evals/test` was not listed, opened, searched, or used.
- Outputs are representative synthetic rollouts, not claims of executed
  application changes.
- No skill, baseline, candidate, or other run artifact was edited.
