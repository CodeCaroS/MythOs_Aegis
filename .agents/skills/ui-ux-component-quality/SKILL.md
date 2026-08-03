---
name: ui-ux-component-quality
description: Generate, improve, or review UI components for concentric corner geometry, consequence-based action labels, persistent selection, usable touch targets, readable typography, and decision-relevant information. Use whenever component-level UI work or review needs concrete usability rules and verifiable acceptance criteria.
version: 0.1.0
author: Caro
license: Apache-2.0
tags:
  - ui
  - ux
  - components
  - accessibility
  - usability
---

# UI/UX Component Quality

Improve evidence-based usability and geometry. Keep personal aesthetic preference separate from material defects.

## Workflow

1. Inspect the rendered component, existing tokens, related components, callers, actual content, and responsive variants.
2. Cover default, hover, focus, pressed, selected, disabled, loading, error, and success states that apply.
3. Apply every relevant rule below at the component's actual rendered size.
4. Verify touch, keyboard, assistive-technology, zoom, wrapping, localization, contrast, and compact variants.
5. Before finalizing a review, account for all six rule categories as a finding, pass, or not applicable; never skip a supplied geometry, state, or metadata condition silently.
6. For review-only requests, report findings without editing. For creation or fix requests, implement the smallest coherent change.

## Required rules

### 1. Keep nested corner radii concentric

- Do not automatically give a visibly inset inner shape the same radius as its outer container.
- For concentric rectangles, start with `inner radius = max(0, outer radius - inset)` and account for the actual border and inset geometry.
- Treat an inner radius near half the outer radius only as a visual starting point, never a universal formula.
- Inspect the result at its rendered size and apply the same logic across siblings, compact states, and responsive variants.
- Avoid unnecessary layers of rounded containers.

Verify even corner spacing, sibling consistency, and stable geometry at every supported density.

### 2. Label actions by consequence

- Name the action the button performs. Avoid `Yes`, `No`, `OK`, or `Continue` when the consequence is not already unmistakable.
- Keep the dialog title, explanation, button label, and resulting behavior consistent.
- Describe destructive scope and permanence precisely, such as `Delete file` or `Leave without saving`.
- Keep a safe escape action available. Do not initially focus or visually prioritize a destructive action unless the workflow requires it.
- Make labels understandable when announced without nearby visual context.

Verify that users can predict the result and that the implementation does exactly what the label promises.

### 3. Keep selection visible

- Make selected styling persistent and stronger than hover styling after pointer or keyboard focus moves away.
- Combine at least two compatible cues such as fill, border, checkmark, indicator, icon, label, or font weight.
- Never communicate selection through color alone.
- Keep hover, focus, pressed, active, and selected states visually distinct.
- Expose selection with the correct native semantic or ARIA state and preserve sufficient text and indicator contrast.

Verify selection in grayscale, dense lists, keyboard use, assistive technology, and after focus leaves the item.

### 4. Size the complete interactive target

- Expand the interactive container with padding instead of enlarging a small icon disproportionately.
- Default primary touch targets to at least `44 × 44 CSS px`.
- Treat `24 × 24 CSS px` as the WCAG 2.2 Level AA minimum only with its documented exceptions and spacing rules.
- Prefer larger, well-separated targets for frequent, destructive, mobile, crowded, or motor-sensitive actions.
- Make the hit region match the complete visible affordance and draw keyboard focus around the actual target.

Verify one-handed activation, adjacent-target independence, padding coverage, focus-ring size, and usability at `200%` zoom.

### 5. Preserve font weight and readability

- Use regular weight or stronger for body text by default. Reserve thin or light weights for large decorative text after testing.
- Never combine light weight with low contrast. Use spacing, size, grouping, and hierarchy before reducing legibility.
- Validate the actual font on supported devices because equal numerical weights render differently across typefaces.
- Maintain at least `4.5:1` contrast for normal text and `3:1` for qualifying large text.
- Support zoom, text resizing, font substitution, longer translations, high-contrast mode, and wrapping without clipping or lost function.

Keep secondary and disabled labels legible and never hide important information through excessive opacity.

### 6. Show decision-relevant information

- Show only information that helps users understand an item, compare options, predict consequences, reduce uncertainty, or prevent mistakes.
- Place qualifying metadata near its item or action and structure repeated metadata consistently for scanning.
- Use progressive disclosure for secondary detail, but never hide essential information behind hover-only interaction.
- Include relevant values such as size, type, owner, status, progress, scope, timing, cost, permission, modification time, or destructive consequence when they affect the decision.
- Do not add metadata merely to fill space, and do not remove it merely to appear minimal.

Verify that required information appears before commitment and remains available to touch and keyboard users.

## Findings contract

For every material review finding, provide:

- Evidence and exact component or state.
- User impact.
- Smallest concrete recommendation.
- Testable acceptance criteria.
- Validation method and any unverified runtime behavior.

Separate usability defects from subjective preferences. Do not invent findings for rules that do not apply.
Classify confirmed visual-geometry inconsistencies as component-quality findings without inflating them into functional or accessibility failures.

## Output

For creation or fixes, return the component changes first, then verification and limits. For reviews, lead with prioritized evidence-backed findings and acceptance criteria.

## Shared output profile

Compose the `execution` profile for creation or fixes and the `review` profile for audits from [output-templates](../output-templates/references/components.md).
Preserve the complete component checklist above, omit inapplicable rules, and never present personal taste as a confirmed defect.
