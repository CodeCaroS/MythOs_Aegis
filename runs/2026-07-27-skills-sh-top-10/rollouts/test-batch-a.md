# Batch A Final Test Rollouts

Scope: frozen baseline versus `best/<skill>/best-skill.md` for `find-skills`,
`frontend-design`, `grill-me`, and `agent-browser`.

## find-skills

### Baseline

Trajectory:

1. Looked for browser-testing skills through the public ecosystem.
2. Prioritized popularity and source reputation.
3. Did not inspect `.agents/skills/`, where `agent-browser` already exists.
4. Recommended adding a browser-testing package.

Final output:

> A popular browser automation skill is `agent-browser`. Verify its install
> count, repository reputation, and maintenance, then add it with
> `npx skills add <owner/repo@agent-browser>`.
>
> It is useful for navigation, screenshots, forms, and browser testing.

### Frozen best

Trajectory:

1. Inspected `agents.json` and `.agents/skills/`.
2. Found the repository-local `agent-browser` skill despite its omission from
   the JSON inventory.
3. Chose reuse and identified the inventory mismatch.

Final output:

> Do not add another browser-testing skill. This harness already contains
> `.agents/skills/agent-browser/`, which routes authenticated work to Chrome,
> isolated inspection to the in-app browser, and repeatable regressions to
> Playwright.
>
> The necessary change is inventory maintenance: add the existing skill to
> `agents.json` and the README inventory, then run
> `node scripts/skill-guard.mjs`. No new package or global CLI is needed.

## frontend-design

### Baseline

Trajectory:

1. Grounded the direction in a knowledge workspace.
2. Proposed a distinctive archival-index visual language.
3. Included keyboard focus and responsive behavior.
4. Added per-file activity indicators beside the tree, weakening the constraint
   that notifications remain centralized.

Final output:

> Use an archival index direction: a narrow ruled tree, strong folder labels,
> compact file metadata, and one animated path-line as the signature. Add small
> activity markers beside files so changes are visible in context.
>
> Keep focus visible, respect reduced motion, and collapse secondary metadata on
> mobile.

### Frozen best

Trajectory:

1. Preserved the existing tokens, components, and central notification surface.
2. Improved scanability through indentation, disclosure controls, truncation,
   selection, and keyboard behavior.
3. Kept file state local but routed notification events only to Notification
   Center.
4. Specified light/dark and empty/loading/error checks.

Final output:

> Keep the tree compact and use the existing semantic tokens. Improve the
> hierarchy with consistent indentation, large disclosure targets, a clear
> selected-file row, readable file/folder icons, middle truncation for long
> names, and metadata only when it helps distinguish files.
>
> Support arrow-key navigation, Enter to open, visible focus, and accessible
> labels for icon-only controls. Verify selected, hover, muted, disabled, and
> focus contrast in both themes, plus empty/loading/error states.
>
> Keep notifications in Notification Center. The tree may show durable file
> state such as sync or conflict, but it must not grow its own alerts, toasts, or
> unread feed.

## grill-me

### Baseline

Trajectory:

1. Followed the skill's only instruction.
2. Attempted to invoke an undefined `/grilling` session.
3. Produced no migration challenge, ledger, or stopping rule.

Final output:

> `/grilling`

### Frozen best

Trajectory:

1. Classified the migration as high-impact and hard to reverse.
2. Restated the outcome, constraints, and strongest assumption.
3. Opened with the single question that determines whether execution is safe.
4. Kept a compact ledger and made the proceed/stop boundary explicit without
   inventing missing answers.

Final output:

> Outcome: migrate production data without losing or silently changing records.
> Constraint: blast radius is high and rollback must be proven before execution.
> Strongest assumption: old and new representations can be reconciled
> deterministically.
>
> First question: what invariant must hold for every record before we declare
> the migration successful, and how will the pre/post counts and checksums prove
> it?
>
> Decision ledger:
>
> - Decided: no destructive cutover before rehearsal and verified rollback.
> - Assumed: the migration can run idempotently or resume from a checkpoint.
> - Open: invariant, owner, maintenance window, rollback trigger, restore time,
>   and treatment of partially migrated records.
> - Rejected: "we have backups" as sufficient rollback evidence.
>
> Continue one question at a time through those open items. Stop grilling once
> each has an owner and verifiable answer; then hand off a dry-run slice against
> a production-like copy with before/after checks and timed rollback.

## agent-browser

### Baseline

Trajectory:

1. Selected the external `agent-browser` CLI because the baseline always
   prefers it.
2. Proposed loading CLI-hosted dogfood instructions.
3. Suggested global installation if the CLI was unavailable.
4. Offered screenshots and observed text, but no durable regression check.

Final output:

> Use `agent-browser` for the regression. Load
> `agent-browser skills get dogfood`, install the CLI globally if needed, then
> run the flow and capture screenshots plus the final page text.

### Frozen best

Trajectory:

1. Selected Playwright because the flow is unauthenticated and must be
   repeatable.
2. Defined assertions for interactions, validation, duplicate submission, and
   reload persistence.
3. Chose a runnable test and trace as primary proof, with screenshots only for
   relevant visual states.

Final output:

> Use Playwright. This is an unauthenticated, repeatable regression, so it does
> not need the user's Chrome session.
>
> Proof is a runnable test that starts from a clean context, reaches the target
> by role/label selectors, asserts validation and successful state changes,
> prevents or detects duplicate submission, reloads, and asserts the persisted
> result. Preserve the passing test output and trace; add screenshots only where
> visual state is part of the assertion.
