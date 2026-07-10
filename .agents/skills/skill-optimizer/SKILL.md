---
name: skill-optimizer
description: >
  Optimize Markdown-based skills with a measured loop: baseline,
  bounded edits, held-out validation, rejection memory, and final reporting.
  Use when improving, benchmarking, or evaluating a SKILL.md file.
version: 1.0.0
tags:
  - skill-optimization
  - evaluation
  - markdown
  - agent-skills
---

# Skill Optimizer

Use this skill to improve an existing Markdown skill through an evidence-backed
optimization loop.

## Required Reference

Before starting any optimization run, read:

`references/HARNESS.md`

Treat that file as the authoritative protocol.

## Inputs

Require:

- the target `SKILL.md`,
- training tasks,
- validation tasks,
- evaluation criteria,
- the target model or agent configuration,
- a run directory.

An untouched test set is strongly recommended for final evaluation.

## Workflow

1. Locate the target `SKILL.md`.
2. Validate its frontmatter and Markdown structure.
3. Confirm the task splits:
   - `evals/train`
   - `evals/validation`
   - `evals/test`
4. Record a baseline with the unchanged skill.
5. Execute training rollouts.
6. Evaluate each rollout against an explicit rubric.
7. Reflect on recurring failures and stable successes.
8. Propose only bounded `ADD`, `DELETE`, or `REPLACE` edits.
9. Create a candidate skill without modifying the original.
10. Compare the candidate and current skill on the same validation set.
11. Accept the candidate only when it exceeds the configured threshold and
    introduces no unacceptable regression.
12. Store rejected edits and their failure reasons.
13. Repeat until a stopping condition is reached.
14. Evaluate the best skill once on the untouched test set.
15. Produce a final optimization report.

## Execution Rules

- Never overwrite the original skill.
- Never use test-set results to generate edits.
- Never accept an edit because it merely sounds better.
- Never encode benchmark answers into the skill.
- Never remove protected safety or compliance rules.
- Keep every accepted edit traceable to rollout evidence.
- Keep changes inside the configured edit budget.
- Preserve complete diffs and evaluation results.
- Distinguish task failures from harness or infrastructure failures.

## Default Paths

```text
skills/<skill-name>/SKILL.md
evals/train/
evals/validation/
evals/test/
runs/<run-id>/
```

## Default Edit Budget

Unless the repository defines another value:

```yaml
max_edits_per_iteration: 4
max_added_words_per_iteration: 120
max_deleted_words_per_iteration: 120
minimum_validation_delta: 0.01
patience: 5
```

## Output

Produce:

```text
runs/<run-id>/
├── baseline/
├── rollouts/
├── evaluations/
├── reflections/
├── candidates/
├── rejected-edits.jsonl
├── best-skill.md
└── summary.md
```

## Completion Criteria

Do not declare the optimization complete until:

- a baseline exists,
- every accepted edit passed held-out validation,
- rejected edits are recorded,
- the best skill is reproducible,
- category-level regressions are documented,
- the test set remained isolated,
- the final report exists.
