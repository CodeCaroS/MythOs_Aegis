# Skill Optimization Report

## Run

- Run ID: `2026-07-27-skills-sh-top-10`
- Skills: skills.sh all-time top ten
- Target: current Codex harness
- Source snapshot: 2026-07-27
- Repository commit at start: `6f3c55a`
- Mode: personalized clone, full-rewrite candidate mode

## Baseline

- Validation average: 0.5562
- Test average: 0.5958
- Baselines: pinned upstream `SKILL.md` files under `baseline/`

## Final Result

- Validation average: 0.9724
- Test average: 0.9675
- Absolute test improvement: +0.3717
- Relative test improvement: +62.4%
- Critical regressions: 0
- Final size: 2,386 words across ten skills

## Category Results

| Skill | Baseline test | Final test | Delta |
| --- | ---: | ---: | ---: |
| find-skills | 0.4650 | 0.9785 | +0.5135 |
| frontend-design | 0.6705 | 0.9715 | +0.3010 |
| grill-me | 0.2350 | 0.9365 | +0.7015 |
| agent-browser | 0.4000 | 0.9825 | +0.5825 |
| vercel-react-best-practices | 0.7620 | 0.9590 | +0.1970 |
| grill-with-docs | 0.4620 | 0.9625 | +0.5005 |
| improve-codebase-architecture | 0.7170 | 0.9655 | +0.2485 |
| tdd | 0.7090 | 0.9755 | +0.2665 |
| web-design-guidelines | 0.6295 | 0.9655 | +0.3360 |
| microsoft-foundry | 0.9080 | 0.9780 | +0.0700 |

## Optimization Activity

- Iterations: 1 full candidate pass
- Accepted candidates: 10
- Rejected directions: 3
- Test split opened only after all validation decisions were frozen
- Independent evaluator batches: 3

## Accepted Changes

1. Routed skill discovery and browser work through existing harness capabilities.
2. Replaced missing slash-command aliases with self-contained decision workflows.
3. Personalized design, UI review, and TDD behavior around accessibility,
   functional browser coverage, literal product direction, and small verified slices.
4. Scoped architecture and documentation work to evidence-backed, durable needs.
5. Condensed React and Foundry guidance around current docs, existing dependencies,
   authorization, and measurable verification.

## Rejected Directions

1. Extra per-skill UI scaffolding without a harness consumer.
2. Vendoring every upstream React rule.
3. Vendoring the full Microsoft Foundry routing tree.

## Remaining Limits

- Scores come from representative synthetic rollouts, not production telemetry.
- Live rankings and install counts will drift after the recorded snapshot.
- The generic Codex skill validator rejects this repository's required extended
  frontmatter; the repository contract remains authoritative.
- The full repository guard is blocked by pre-existing untracked `humanizer` and
  `rest-api-best-practices` skills that are outside this run.

## Artifacts

- Leaderboard and source commits: `leaderboard.md`, `sources.json`
- Frozen upstream skills: `baseline/`
- Candidate and best snapshots: `candidates/`, `best/`
- Complete textual diffs: `diffs/`
- Tasks and rubric: `evals/`
- Rollouts and reflections: `rollouts/`, `reflections/`
- Validation and final test results: `evaluations/`
- Rejection history: `rejected-edits.jsonl`
