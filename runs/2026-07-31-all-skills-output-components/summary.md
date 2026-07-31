# Skill Optimization Report

## Run

- Run ID: `2026-07-31-all-skills-output-components`
- Skills: all 29 repository skills
- Target: current Codex harness; exact model identifier unavailable
- Mode: bounded output-composition optimization
- Test isolation: opened once after 29 validation decisions were frozen

## Baseline

- Validation average: 0.6428 (10/29 passed)
- Test average: 0.6614 (10/29 passed)
- Skill size: 26138 words

## Final Result

- Validation average: 1.0000 (29/29 passed)
- Test average: 1.0000 (29/29 passed)
- Absolute test improvement: +0.3386
- Critical regressions: 0
- Final skill size: 27263 words
- Maximum per-skill addition: 41 words

## Optimization Activity

- Iterations: 1
- Accepted candidates: 29
- Rejected directions: 3
- Accepted profile integrations: 29
- Shared component libraries added: 1
- Deleted baseline guidance: 0 words

## Accepted Changes

1. Added atomic Outcome, Evidence, Findings, Decision, Changes, Next action, Verification, Limits, Sources, and Status components.
2. Added artifact, decision, direct, execution, optimization, plan, research, review, and status composition profiles.
3. Mapped every skill to one shared profile plus its domain-specific output fields.
4. Preserved every original skill and frontmatter byte-for-byte before the bounded addition.
5. Kept artifact-only behavior, safety rules, evidence standards, and Quick Recap precedence intact.

## Rejected Directions

1. One mandatory heading tree for all outputs.
2. Copying generic output rules into every skill.
3. Replacing detailed domain-specific output sections without per-skill deletion evidence.

## Category Results

| Skill | Profile | Baseline validation | Final validation | Baseline test | Final test | Test delta |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| academix | research | 0.8000 | 1.0000 | 0.8000 | 1.0000 | +0.2000 |
| agent-browser | execution | 0.4450 | 1.0000 | 0.4900 | 1.0000 | +0.5100 |
| apocalypse | review | 0.8500 | 1.0000 | 0.8500 | 1.0000 | +0.1500 |
| aria-apg-review | review | 0.8500 | 1.0000 | 0.8500 | 1.0000 | +0.1500 |
| crawler-readiness-audit | review | 0.7450 | 1.0000 | 0.7900 | 1.0000 | +0.2100 |
| decision-criticality-gate | decision | 0.7450 | 1.0000 | 0.7900 | 1.0000 | +0.2100 |
| fact-checker | research | 0.9500 | 1.0000 | 0.9500 | 1.0000 | +0.0500 |
| find-skills | decision | 0.6450 | 1.0000 | 0.6900 | 1.0000 | +0.3100 |
| frontend-design | plan | 0.4050 | 1.0000 | 0.4500 | 1.0000 | +0.5500 |
| grill-me | decision | 0.7000 | 1.0000 | 0.7000 | 1.0000 | +0.3000 |
| grill-with-docs | decision | 0.6550 | 1.0000 | 0.7000 | 1.0000 | +0.3000 |
| humanizer | artifact | 0.8000 | 1.0000 | 0.8000 | 1.0000 | +0.2000 |
| improve-codebase-architecture | review | 0.5950 | 1.0000 | 0.6400 | 1.0000 | +0.3600 |
| microsoft-foundry | execution | 0.2950 | 1.0000 | 0.3400 | 1.0000 | +0.6600 |
| output-templates | direct | 0.5950 | 1.0000 | 0.6400 | 1.0000 | +0.3600 |
| pre-launch-security-gate | review | 0.8500 | 1.0000 | 0.8500 | 1.0000 | +0.1500 |
| prompt-preflight | artifact | 0.5950 | 1.0000 | 0.6400 | 1.0000 | +0.3600 |
| quick-recap | status | 0.9500 | 1.0000 | 0.9500 | 1.0000 | +0.0500 |
| rest-api-best-practices | review | 0.7450 | 1.0000 | 0.7900 | 1.0000 | +0.2100 |
| rigorous-response | direct | 0.9500 | 1.0000 | 0.9500 | 1.0000 | +0.0500 |
| shepherd | execution | 0.6000 | 1.0000 | 0.6000 | 1.0000 | +0.4000 |
| skill-optimizer | optimization | 0.2900 | 1.0000 | 0.2900 | 1.0000 | +0.7100 |
| tdd | execution | 0.3000 | 1.0000 | 0.3000 | 1.0000 | +0.7000 |
| ux-logic-loop | execution | 0.5000 | 1.0000 | 0.5000 | 1.0000 | +0.5000 |
| ux-pattern-review | review | 0.8500 | 1.0000 | 0.8500 | 1.0000 | +0.1500 |
| vercel-react-best-practices | review | 0.1400 | 1.0000 | 0.1400 | 1.0000 | +0.8600 |
| visual-flow-storyboard | plan | 0.3500 | 1.0000 | 0.3500 | 1.0000 | +0.6500 |
| visual-pr-review | review | 0.9500 | 1.0000 | 0.9500 | 1.0000 | +0.0500 |
| web-design-guidelines | review | 0.4950 | 1.0000 | 0.5400 | 1.0000 | +0.4600 |

## Remaining Limits

- Results are deterministic synthetic output-contract projections, not production telemetry.
- No isolated callable target-model runner was available, so stochastic variance is unknown.
- This run optimized output composition while deliberately preserving substantive domain workflows.

## Artifacts

- Frozen originals: `baseline/<skill>/initial-skill.md`
- Candidate snapshots: `candidates/<skill>/candidate-v1.md`
- Accepted snapshots: `best/<skill>/best-skill.md`
- Shared components: `best/output-templates/references/components.md`
- Complete diffs: `diffs/<skill>.patch`
- Train, validation, and test tasks: `evals/`
- Evaluations and gate: `evaluations/`
- Reflection and rejection history: `reflections/iteration-1.md`, `rejected-edits.jsonl`
- Reproduction tools: `tools/`
