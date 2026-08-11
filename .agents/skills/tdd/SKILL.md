---
name: tdd
description: Implement features and bug fixes in small red-green slices using behavior-focused tests at existing public seams. Use when the user requests TDD, test-first work, red-green-refactor, regression coverage, or a fix that must leave a runnable guard.
version: 1.1.0
author: Caro
license: Apache-2.0
tags:
  - testing
  - tdd
  - regression
  - acceptance-criteria
---

# Test-Driven Development

Use one vertical slice at a time:

1. Read the real flow and every caller of the behavior being changed.
2. If acceptance criteria or a specification already exist for this change, read them first; the failing test must prove one of those criteria. If none exist and the change is more than a small, obvious fix, state the acceptance criterion the test will prove before writing it.
3. Select the narrowest existing public seam that exposes the bug or capability.
4. Write one test that fails for the right reason.
5. Make the smallest root-cause change that passes it.
6. Run the focused test, then the nearest broader gate.
7. Refactor only if the passing code now contains real duplication or confusion.
8. Repeat only for the next distinct behavior.

## Test Quality

- Assert observable behavior through public interfaces.
- Use independent expected values, not the production algorithm repeated in the test.
- Mock only external or nondeterministic boundaries; prefer a real test database or filesystem when cheap and isolated.
- Do not assert private methods, internal call order, or implementation-specific collaborator counts.
- For UI flows, cover interactions and state transitions: validation, empty/error states, duplicate submissions, permissions, and reload persistence where relevant.
- Keep the test that proves the reported failure fixed.

Do not pause for seam approval when the repository and request make the public boundary clear. Ask only when different seams would materially change scope or compatibility.

Adapted for MythOs Aegis from `mattpocock/skills` `tdd`.

## Shared output profile

Compose the `execution` profile from [output-templates](../output-templates/references/components.md).
Report the red failure, green change, exact test result, and any verification limit.
Preserve stricter domain rules above, omit empty components, and never fill a component with invented evidence.
