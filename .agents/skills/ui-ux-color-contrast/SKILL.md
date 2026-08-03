---
name: ui-ux-color-contrast
description: Generate, implement, or review accessible color, contrast, status, state, chart, badge, alert, validation, focus, and brand-surface treatments. Use whenever UI work needs measured WCAG 2.2 AA foreground/background evidence, semantic color tokens, redundant non-color cues, or dark-mode and forced-colors verification.
version: 0.2.0
author: Caro
license: Apache-2.0
tags:
  - ui
  - ux
  - accessibility
  - color
  - contrast
  - status
---

# UI/UX Color Contrast

Measure rendered color pairs and preserve meaning without hue perception. Treat contrast compliance as a baseline, not proof that the typography, hierarchy, wording, or interaction is usable.

## Workflow

1. Inspect the rendered interface, semantic tokens, component variants, supported themes, real content, and every meaningful state.
2. Inventory each foreground/background pair and each meaning encoded by color, including text, icons, boundaries, focus indicators, charts, badges, alerts, and validation.
3. Classify each pair as normal text, qualifying large text, meaningful non-text UI, decorative, inactive, or exempt logo content.
4. Measure the actual computed colors over the real adjacent surface with a reliable WCAG relative-luminance checker. Include opacity, overlays, gradients, images, video, shadows, and state changes.
5. Apply the correct threshold and add a safety margin above the mathematical cutoff.
6. Preserve meaning with persistent non-color cues and accessible semantics.
7. Test every state independently at responsive sizes, `200%` zoom, in grayscale, dark mode, high-contrast or forced-colors mode, and on the weakest supported display or device where practical.
8. Automate repeatable checks where feasible, retain manual review for complex surfaces and state distinctions, and record the tested pairs, states, ratios, thresholds, cues, and method. Never approve from a screenshot or visual judgment alone.

For review-only requests, report findings without editing. For creation or fix requests, implement the smallest coherent correction and remeasure the rendered result.

## Contrast requirements

- Reach at least `4.5:1` for normal text against its background.
- Use the `3:1` text threshold only for text at least `24 CSS px` at normal weight or about `18.66 CSS px` when bold.
- Reach at least `3:1` for meaningful component boundaries, focus indicators, icons, chart marks, and visual state cues against adjacent colors where WCAG requires them to identify or understand the UI.
- Judge each actual foreground/background pair, not its color family. Use white on blue, purple, or another brand color only when that rendered pair passes for the text size and weight.
- Treat `#767676` on `#FFFFFF` and its approximate `4.54:1` ratio only as a boundary example. Never promote it to a universal gray token or reuse it without fresh measurement.
- Specify both foreground and background colors. Never assume inheritance, a browser default, a theme, or an image will preserve contrast.
- Avoid pale secondary text and cutoff-level pairings. Prefer spacing, placement, weight, and grouping over reducing legibility.
- Measure text over gradients, images, translucent layers, or video at the lowest-contrast point, or provide a dependable solid backing layer.
- Keep disabled controls understandable even when an exception applies. Treat logos and decorative content as exempt only when they are not interactive or instructional.

## Preserve meaning without color

- Keep errors, warnings, success, selection, required fields, changes, online state, and chart categories understandable without hue perception.
- Pair color with at least one persistent cue such as explicit text, an accessible icon, shape, pattern, underline, border style, checkmark, label, or weight change.
- Prefer icon plus consequence-based text plus color for important messages, such as `Payment failed`, `Saved`, or `3 fields need attention`.
- Do not rely on placeholder text, border color, a red asterisk, or an unnamed icon alone for requirements or validation.
- Associate field errors programmatically and announce important asynchronous status changes without repeated noise.
- Keep hover, focus, pressed, and selected states distinct. Preserve selected-state identification after pointer or keyboard focus moves away.
- Add labels, direct annotations, patterns, or symbols whenever chart color categories carry meaning.

## Tokens and components

- Separate brand and neutral palettes from semantic background, surface, text, border, focus, success, warning, error, and information roles.
- Define semantic roles such as `text-primary`, `text-secondary`, `surface`, `border`, `focus`, `error`, `warning`, `success`, and `info`; do not encode meaning only in names such as `gray-500` or `green-600`.
- Let components consume semantic roles and derive light and dark themes by remapping those roles rather than embedding theme-specific colors in each component.
- Keep palette steps such as `brand-100` through `brand-900` only when the product needs them. Treat supplied indigo or other example scales as references, never universal defaults.
- Document approved foreground/background pairings separately for normal text, large text, icons, boundaries, and states.
- Prevent unsupported token pairings in component APIs where practical. Passing on one surface never implies passing on another.
- Store accessible status treatments as complete components with icon, label, semantics, contrast, and screen-reader behavior rather than as color tokens alone.
- Remeasure after any theme, token, opacity, font, background, state, or brand-palette change.

## Acceptance criteria

- Every normal-text pair reaches `4.5:1` unless a documented WCAG exception applies.
- Every qualifying large-text pair reaches `3:1`.
- Every required non-text cue reaches `3:1` against its adjacent colors where WCAG requires it.
- Every status, selection, validation state, and chart category remains understandable in grayscale and without color names.
- Every error and success treatment includes persistent text or an equivalent semantic cue in addition to color.
- Default, hover, focus, active, selected, disabled, loading, error, warning, success, visited, dark, and forced-colors states are tested when applicable rather than inferred from another state.
- Measured evidence identifies the pair, state, computed colors, ratio, threshold, result, non-color cue, and validation method.

## Output

Return the requested artifact or prioritized findings first. Then report measured evidence, implemented non-color cues, exact verification, WCAG exceptions, and any state that remains unverified.

## Shared output profile

Compose the `execution` profile for creation or fixes and the `review` profile for audits from [output-templates](../output-templates/references/components.md).
Preserve the measurement evidence and non-color-cue requirements above, omit inapplicable states, and never present screenshots or subjective appearance as contrast proof.
