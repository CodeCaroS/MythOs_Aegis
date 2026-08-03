---
name: ui-ux-typography
description: Generate, implement, or review resilient interface typography, including restrained type tokens, relative and fluid sizing, line height, readable text measure, hierarchy, wrapping, zoom, localization, and user text spacing. Use whenever UI work creates or changes typography systems, body copy, headings, text containers, or responsive type behavior.
version: 0.1.0
author: Caro
license: Apache-2.0
tags:
  - ui
  - ux
  - typography
  - readability
  - accessibility
---

# UI/UX Typography

Build a small resilient type system instead of choosing every text size independently.

## Required rules

### 1. Start from a flexible body baseline

- Start body text around `1rem` under normal browser defaults.
- Treat `16px` as a practical baseline, not a universal accessibility threshold.
- Use relative units such as `rem`, preserve browser text resizing, and never disable zoom.

### 2. Keep the type scale restrained

- Reuse existing typography tokens before adding new ones.
- Define only the sizes needed for the product's actual hierarchy.
- Use a modular ratio around `1.2–1.333` only as a starting point. Let optical hierarchy, available space, typeface characteristics, content, and responsive behavior override mathematical purity.
- Avoid near-duplicate tokens whose visual or semantic roles cannot be distinguished.

### 3. Use fluid type deliberately

- Use `clamp()` where headings must adapt across viewports without abrupt jumps.
- Express minimum and maximum sizes with relative units and avoid pure viewport-based text sizing that ignores zoom.
- Test every fluid value at its minimum, interpolation range, maximum, and `200%` text resizing.
- Keep ordinary body copy stable unless the design has a measured need for fluid sizing.

### 4. Set line height for the role

- Start reading-heavy body copy around `1.45–1.65` unitless line height.
- Start headings around `1.1–1.3`, then test wrapped headings, capitals, descenders, and diacritics.
- Do not force one line-height token across body copy, controls, headings, and code.

### 5. Control reading measure selectively

- Keep reading-heavy paragraphs around `45–75` characters per line, using approximately `65ch` as a useful starting point.
- Apply measure to the text container, not the entire page or component shell.
- Do not mechanically constrain controls, navigation, tables, dashboards, labels, or code to paragraph measure.
- Recheck measure with the actual typeface because character width varies.

### 6. Create hierarchy with multiple cues

- Combine size, weight, spacing, placement, and contrast instead of relying on size alone.
- Keep visual hierarchy aligned with semantic heading structure and document order.
- Avoid thin or low-contrast text as a shortcut for de-emphasis; use the existing component-quality rules for readability and contrast.

### 7. Let text reflow

- Avoid fixed-height text containers and layouts that depend on one line of content.
- Allow wrapping without clipping, overlap, accidental truncation, or hidden actions.
- Preserve functionality under font substitution, longer translations, narrow and wide viewports, browser zoom, `200%` text resizing, and user-applied text spacing.
- Use truncation only when the full value remains available and the product decision truly requires a single-line constraint.

## Verification

Leave one runnable browser or visual regression check where the project supports it, then verify:

1. The token set is small, role-based, and visibly distinct.
2. Body text remains near the intended baseline without blocking browser resizing or zoom.
3. Fluid headings transition without abrupt jumps and still scale at `200%` text size.
4. Body and heading line heights survive wrapping, diacritics, and the actual production font.
5. Reading paragraphs remain around `45–75` characters while controls, tables, navigation, dashboards, and code remain unconstrained by paragraph measure.
6. Narrow and wide viewports, longer translations, font substitution, high-contrast mode, text spacing, and zoom produce no clipping, overlap, hidden content, or lost actions.

If the production font, localization samples, runtime layout, or user text-spacing checks are unavailable, state that limitation explicitly.

## Output

Return the typography tokens or implementation changes first, then the tested font, viewport, language, resizing, and wrapping matrix plus any remaining limits.

## Shared output profile

Compose the `execution` profile from [output-templates](../output-templates/references/components.md).
Preserve the typography rules above, omit empty components, and never present mathematical scale consistency as proof of readability.
