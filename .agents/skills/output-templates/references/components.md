# Reusable Output Components

Compose only the components the task needs. Keep their meaning stable; labels
may change to match the domain. Omit empty components and never invent content
to fill a template.

## Atomic components

- **Outcome**: the answer, verdict, state, or requested artifact first.
- **Evidence**: observed facts, file locations, sources, and explicit assumptions.
- **Findings**: ordered defects or risks with location, criterion, and impact.
- **Decision**: selected option, rationale, confidence, and conditions.
- **Acceptance criteria**: the concrete, checkable conditions that define done; testable, not aspirational.
- **Changes**: mutations actually completed; do not mix planned work with done work.
- **Next action**: the smallest useful recommendation, implementation slice, or unblocker.
- **Verification**: exact checks run and results; distinguish passed, failed, skipped, and not run.
- **Limits**: unknowns, unverified behavior, residual risks, and incomplete scope.
- **Sources**: citations or current documentation supporting external claims.
- **Status**: completed work, remaining work, and required user action.

## Composition profiles

| Profile | Ordered components |
| --- | --- |
| `artifact` | requested artifact; then verification and limits only when the owning workflow allows commentary |
| `decision` | decision, evidence, assumptions or limits, next action |
| `direct` | outcome, evidence when useful, next action when one exists |
| `execution` | outcome, changes, verification, limits or next action |
| `optimization` | baseline, candidate, validation, isolated test, accepted and rejected edits, limits, artifacts |
| `plan` | goal, constraints, ordered steps, acceptance criteria, verification, risks or open decisions |
| `research` | answer, evidence, sources, limits |
| `review` | verdict, findings, impact, recommendation, verification, limits |
| `status` | state, completed work, remaining work, exact unblocker |

## Composition rules

1. Lead with the result or requested artifact, not process narration.
2. Scale structure to the evidence: one fact can be prose; several findings may need headings or a table.
3. Keep confirmed evidence, inference, assumptions, and unknowns visibly distinct.
4. Preserve domain-specific fields from the owning skill; profiles provide the shell, not the substance.
5. Never present planned, skipped, blocked, or unrun verification as completed.
6. For partial or blocked work, name the exact remaining action or unblocker.
7. When the workspace requires Quick Recap, keep it as the final status footer and do not duplicate it in the body.
