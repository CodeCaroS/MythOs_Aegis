---
name: aria-apg-review
description: Review web interfaces against every applicable W3C WAI-ARIA Authoring Practices Guide pattern. Use when auditing UI code or rendered widgets for accessible structure, names, roles, states, properties, keyboard interaction, focus management, composite navigation, or popup and dialog behavior.
version: 1.0.0
author: Caro
license: Apache-2.0
overlaps_with: [ux-pattern-review, web-design-guidelines, ui-ux-generation]
tags:
  - accessibility
  - aria
  - apg
  - ui-review
---

# WAI-ARIA APG Review

Audit only unless the user explicitly asks for fixes.

## Source discipline

1. Read [references/patterns.md](references/patterns.md) before reviewing.
2. Inventory every interactive widget and landmark in scope, then map each one to the routing matrix.
3. Open the current W3C page for every matched pattern. Read the entire About, Keyboard Interaction, WAI-ARIA Roles/States/Properties, notes, warnings, and linked dependency patterns.
4. Treat the current W3C page as authoritative when the bundled routing summary differs.
5. Distinguish required behavior from optional APG behavior. Missing optional behavior is not a conformance defect unless the product relies on it.

APG is design guidance, not proof of WCAG conformance. Its examples are illustrative code, not production-ready components. Prefer native HTML semantics and behavior before adding ARIA.

## Review workflow

### 1. Establish coverage

- Read repository instructions, component primitives, callers, routes, supported states, and existing tests.
- Include repeated and nested widgets, responsive variants, disabled states, empty states, loading states, errors, and dynamically inserted or removed items.
- Record each applicable pattern instance. Mark patterns that are absent as not applicable; do not invent findings for them.

### 2. Inspect the implementation

For each mapped pattern, verify:

- Native element choice and whether custom ARIA is necessary.
- Required role hierarchy and DOM or `aria-owns` relationships.
- Accessible name and description sources.
- Required states and properties, valid values, valid ID references, and synchronization with visual state.
- Tab stops, roving `tabindex` or `aria-activedescendant`, selection versus focus, orientation, and type-ahead behavior.
- Popup ownership, hidden or inert content, live regions, busy state, and focus restoration where applicable.

Trace shared primitives before reporting duplicate findings. Report the root cause once and list affected callers.

### 3. Exercise rendered behavior

When runtime access exists:

- Run every required APG key interaction in every reachable state and supported orientation.
- Verify focus entry, movement, wrapping, activation, dismissal, return, and recovery after removal or rerender.
- Inspect the accessibility tree for computed roles, names, descriptions, states, positions, and relationships.
- Confirm pointer or touch support does not replace required keyboard behavior.
- Recheck state after validation errors, async updates, route changes, and reloads.

Static code cannot prove focus order or keyboard behavior. Automated accessibility scans cannot prove APG interaction conformance. If runtime or assistive-technology testing is unavailable, state that limitation instead of claiming a pass.

### 4. Classify results

- **Pass:** All applicable required APG behavior was verified.
- **Fail:** A required behavior is demonstrably missing or incorrect.
- **Partial:** Static evidence exists, but required runtime behavior was not verified.
- **Not applicable:** The pattern does not occur in scope.

Uses the shared severity ladder from [output-templates](../output-templates/references/components.md): Critical for blocked access or an inescapable focus trap, High for missing core keyboard/focus/role/state behavior, Medium for a material but non-blocking mismatch, Low for optional enhancements or maintainability risks.

## Output

Lead with confirmed findings:

```markdown
## Findings

1. [High] `file:line` or route — Pattern — broken requirement.
   - Evidence:
   - User impact:
   - Smallest root-cause fix:

## Pattern Coverage

| Pattern | Instance | Static review | Runtime review | Verdict |
|---|---|---|---|---|

## Unverified Risks

- Required check and exact reason it could not be verified.

## Sources

- Current W3C pattern pages used for the review.
```

Do not claim screen-reader compatibility without testing a named browser, screen reader, and version. If there are no confirmed findings, say so and still show coverage and unverified risks.

## Shared output profile

Compose the `review` profile from [output-templates](../output-templates/references/components.md).
Keep APG pattern coverage, evidence-backed findings, and unverified runtime risks explicit.
Preserve stricter domain rules above, omit empty components, and never fill a component with invented evidence.
