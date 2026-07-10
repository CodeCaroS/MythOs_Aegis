# ai_workspace

Reusable agent skills for reasoning, verification, failure analysis, review, academic work, and short status reporting.

Each skill is self-contained in `skill-name/SKILL.md`.

## Recommended Use Order

1. `rigorous-response` - clarify the premise, assumptions, and decision.
2. `fact-checker` - verify claims, numbers, dates, and quotes.
3. `apocalypse` - test how a plan fails and what blocks release.
4. `visual-pr-review` - reconstruct diffs, architecture, and review findings.
5. `academix` - source-backed academic research and citation work.
6. `quick-recap` - end substantive responses with a one-line completion status.

## Skills

| Skill | Path | Best for |
| --- | --- | --- |
| Academix | [`academix/SKILL.md`](./academix/SKILL.md) | Academic research, literature reviews, citations, source evaluation |
| Apocalypse | [`apocalypse/SKILL.md`](./apocalypse/SKILL.md) | Pre-mortems, risk analysis, failure chains, recovery planning |
| Fact Checker | [`fact-checker/SKILL.md`](./fact-checker/SKILL.md) | Independent claim verification and correction |
| Quick Recap | [`quick-recap/SKILL.md`](./quick-recap/SKILL.md) | Required one-line status footer for substantive responses |
| Rigorous Response | [`rigorous-response/SKILL.md`](./rigorous-response/SKILL.md) | Clear assumptions, premise checks, concise critical reasoning |
| Visual PR Review | [`visual-pr-review/SKILL.md`](./visual-pr-review/SKILL.md) | Diff review, architecture reconstruction, implementation planning |

## Layout

- `README.md`
- `academix/SKILL.md`
- `apocalypse/SKILL.md`
- `fact-checker/SKILL.md`
- `quick-recap/SKILL.md`
- `rigorous-response/SKILL.md`
- `visual-pr-review/SKILL.md`

## Working Rules

- Keep skills standalone and portable.
- Prefer the smallest skill that fits the task.
- Avoid hidden or duplicate sources of truth.
- Add new skills as `skill-name/SKILL.md` and update this index.
