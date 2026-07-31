---
name: ux-logic-loop
description: Systematically inventory features from code, derive testable user stories, persist them in a structured matrix, and run a continuous test-fix-retest loop until UX, logic, and integration issues are resolved or blocked. Use when you need an autonomous audit of user-facing behavior across roles, states, permissions, and edge cases.
version: 1.0.0
author: Caro
license: Apache-2.0
tags:
  - ux
  - testing
  - user-stories
  - regression

---

# UX & Logic Loop

Use this skill to turn a codebase into a persistent, testable user-story loop.

## Core workflow

1. Inspect the repository first.
2. Build a feature inventory from the actual code.
3. Derive user stories for happy path, validation, empty state, loading, error, recovery, permission, persistence, concurrency, boundary, destructive, accessibility, and responsive behavior.
4. Write the stories into a persistent, machine-readable test matrix.
5. Pick the highest-priority ready story.
6. Reproduce the behavior as a real user.
7. Fix the root cause, not just the symptom.
8. Retest the original story and nearby regressions.
9. Record the finding, status, and coverage.
10. Continue until the matrix is exhausted or a real blocker is reached.

## First repository pass

Inspect, in order when available:

- `AGENTS.md`
- `README.md`
- `CONTRIBUTING.md`
- architecture docs
- existing skills
- test config
- coding standards
- security rules
- design-system docs
- deployment and environment rules

Then document the discovered framework, runtime, start commands, test commands, main modules, roles, auth, permissions, persistence, external dependencies, tests, and available browser or UI tools.

## Persistent working files

Keep the loop state in machine-readable files. Prefer these names unless the repo already has a stricter convention:

- `.agents/ux-logic-loop/session-state.md`
- `.agents/ux-logic-loop/feature-inventory.md`
- `.agents/ux-logic-loop/user-stories.csv`
- `.agents/ux-logic-loop/findings.md`
- `.agents/ux-logic-loop/test-runs.md`
- `.agents/ux-logic-loop/coverage.md`
- `.agents/ux-logic-loop/bugs/`

## Story matrix minimum fields

Use a CSV or compatible table with at least:

`id, area, feature, role, precondition, user_story, scenario, expected_result, test_type, risk, dependencies, status, last_tested, finding_id, automated_test, notes`

## Status flow

- `DISCOVERED`
- `READY`
- `BLOCKED`
- `TESTING`
- `FAILED`
- `FIXING`
- `RETEST`
- `PASSED`
- `SKIPPED`
- `NEEDS_REVIEW`

Only mark a story `PASSED` after:

- the original failure was reproduced
- the cause was understood
- the fix was implemented
- the original test passed again
- relevant regression tests passed

## Prioritization

Test high-impact, high-risk work first:

1. Security and permission bugs
2. Data loss
3. Wrong business logic
4. Blocking main flows
5. Missing error handling
6. UX problems in common flows
7. Cosmetic issues

## Testing rules

- Use the lowest sensible test level first.
- Prefer a browser test for end-to-end flows, a unit test for pure logic, and integration tests for services, APIs, permissions, and transactions.
- Check reload, navigation, keyboard interaction, focus, slow requests, error responses, and repeated actions.
- Do not weaken assertions, hide errors, skip tests, or mark a fix complete without retesting.
- Document blocked scenarios with the blocker, needed decision, affected stories, and safe alternatives.

## Findings

Give each finding a stable ID and record:

- title
- category
- severity
- affected stories
- starting state
- reproduction steps
- actual behavior
- expected behavior
- root cause
- fix
- verification
- automated test

## Final report

When the loop is done, summarize:

- analyzed features
- created user stories
- executed tests
- passed, failed, and blocked stories
- fixed findings
- open findings
- remaining risks
- not tested areas
- next steps
