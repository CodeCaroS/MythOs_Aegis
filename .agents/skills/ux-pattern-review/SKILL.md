---
name: ux-pattern-review
description: Review product flows and UI implementations for evidence-backed pattern fit, complete states, recovery, responsive behavior, accessibility, performance, localization, analytics, SEO, and test coverage. Use when auditing whether a UX pattern fits the user job or comparing credible alternatives.
version: 1.1.0
author: Caro
license: Apache-2.0
tags:
  - ux-review
  - interaction-patterns
  - product-design
  - usability
---

# UX Pattern Review

Audit only unless the user explicitly asks for fixes.

## Source discipline

1. Start with the user job, task flow, context, and constraints. Do not justify an existing component merely because it resembles a familiar pattern.
2. Map each surface or flow to its implemented pattern and credible alternatives.
3. Prefer direct user evidence, product constraints, the existing design system, native platform behavior, and measured runtime behavior over generic guidance.
4. Use current primary standards and official documentation when they govern the pattern. Cite every external source actually used and respect its license and access terms; do not bundle third-party catalogs into this skill.
5. Use `aria-apg-review` for applicable widget semantics and keyboard behavior. Do not claim WCAG or APG conformance from this review alone.

## Review workflow

### 1. Establish the decision context

- Identify the user's goal, frequency, urgency, skill level, device, environment, and consequences of error.
- Trace the real flow through routes, shared components, data boundaries, and existing tests.
- Record constraints that change the pattern choice: content volume, comparison needs, discoverability, latency, offline behavior, localization, privacy, SEO, accessibility, and implementation cost.
- Separate confirmed behavior from assumptions and missing product evidence.

### 2. Evaluate pattern fit

For each surface or flow:

- State the implemented pattern and the job it is meant to solve.
- Compare only credible alternatives supported by the user job, product constraints, platform conventions, or cited current guidance.
- Check whether the pattern is too heavy, too hidden, too interruptive, too dense, or too weak for the job.
- Account for the total interaction cost, including states, recovery, mobile behavior, accessibility, performance, and maintenance.
- Prefer an existing native element or design-system primitive when it already solves the job.

Do not recommend a redesign because another pattern is fashionable. A different pattern is warranted only when evidence shows a better fit for the user's task and constraints.

### 3. Review implementation completeness

Check every applicable concern, especially:

- Required and optional anatomy, hierarchy, labels, actions, and information scent.
- Default, loading, empty, partial, success, error, disabled, destructive, and permission-denied states.
- Validation, duplicate actions, cancellation, undo, retry, back navigation, refresh, and preservation of user input.
- Keyboard, focus, semantics, announcements, contrast, zoom, reduced motion, touch targets, and non-color cues.
- Narrow screens, long content, localization expansion, bidirectional text, and coarse pointers.
- Async ordering, optimistic updates, slow or failed networks, large data sets, rendering cost, and layout stability.
- Analytics only when a stated product question requires it; never add tracking by default.
- SEO and crawlability only for public or discovery-dependent flows.

Trace shared primitives before reporting duplicates. Report the root cause once and list affected surfaces.

### 4. Exercise rendered behavior

When runtime access exists:

- Complete the primary task and the obvious recovery path in the same run.
- Test empty, long, duplicated, invalid, partial, slow, and failed data.
- Test repeated submission, cancellation, reload, back/forward navigation, and restored state.
- Test representative mobile and desktop viewports, 200% zoom, keyboard-only use, and reduced motion.
- Compare visual, interaction, and exposed accessibility state after async changes.

Code inspection cannot prove usability, focus behavior, responsive layout, recovery, or perceived feedback. Mark unexercised runtime behavior as unverified.

### 5. Classify results

- **Fit:** The chosen pattern matches the user job and applicable guidance.
- **Implementation gap:** The pattern fits, but required behavior or states are missing.
- **Pattern mismatch:** A credible alternative better fits confirmed constraints.
- **Partial:** Evidence is insufficient or runtime behavior is unverified.
- **Not applicable:** The pattern does not occur in scope.

Use Critical for blocked completion, data loss, or an unrecoverable destructive path; High for a broken core task or serious trust/accessibility failure; Medium for material friction or confusion; and Low for optional refinement.

## Output

Lead with confirmed findings:

```markdown
## Findings

1. [High] `file:line` or route — Pattern — issue.
   - Evidence:
   - User impact:
   - Source guidance:
   - Smallest root-cause fix:

## Pattern Decisions

| Surface or user job | Implemented pattern | Alternatives considered | Evidence | Verdict |
|---|---|---|---|---|

## State and Edge Coverage

| Pattern | Default | Loading | Empty | Error | Success | Recovery | Responsive and accessibility | Verdict |
|---|---|---|---|---|---|---|---|---|

## Unverified Risks

- Required check and exact reason it could not be verified.

## Sources

- Current primary standards or official guidance actually used.
```

If there are no confirmed findings, say so and still show decision, state, and unverified coverage. Do not report absent optional guidance as a defect.

## Shared output profile

Compose the `review` profile from [output-templates](../output-templates/references/components.md).
Keep pattern decisions, evidence-backed findings, source support, state coverage, and unverified risks explicit.
Preserve stricter domain rules above, omit empty components, and never fill a component with invented evidence.
