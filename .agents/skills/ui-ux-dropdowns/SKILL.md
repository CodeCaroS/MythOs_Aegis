---
name: ui-ux-dropdowns
description: Generate, implement, or fix dropdowns, selects, comboboxes, popup option lists, and action menus with obvious triggers, collision-aware placement, complete keyboard operation, scalable filtering and virtualization, and fast motion. Use whenever UI work creates or changes a dropdown-style control.
version: 0.1.0
author: Caro
license: Apache-2.0
tags:
  - ui
  - ux
  - dropdowns
  - accessibility
---

# UI/UX Dropdowns

Build dropdowns that remain obvious, reachable, operable, and fast at every supported size.

## Choose the smallest correct control

1. Use a native `select` when its appearance and behavior meet the brief.
2. Otherwise reuse the product's existing select, combobox, popover, or menu primitive.
3. Distinguish selection controls from action menus and preserve the matching native or WAI-ARIA interaction pattern. Do not add ARIA that duplicates native semantics.

## Required rules

### 1. Make the trigger obvious

- Show a caret or equivalent disclosure indicator.
- Provide visible hover, keyboard-focus, open, disabled, and error states where applicable.
- Give the trigger a minimum `44px` by `44px` pointer target without forcing the visible control itself to look oversized.
- Expose the control's name, current value or purpose, and expanded state. Do not rely on color alone to communicate clickability or state.

### 2. Keep the popup inside the viewport

- Anchor the popup to its trigger and use collision detection.
- Open upward when the available space below cannot contain the popup and more useful space exists above.
- Constrain the popup to the remaining viewport, scroll inside it, and keep the active or selected item visible.
- Recompute placement after resize, scroll, zoom, filtering, or content-size changes. Never leave the final item unreachable off-screen.

### 3. Make keyboard navigation complete

- Let `Tab` reach the trigger and use `Enter` or `Space` to open it.
- Use arrow keys to move through enabled items, `Enter` to select or invoke, and `Escape` to close without applying a pending choice.
- Return focus to the trigger when the popup closes. Keep focus and selection distinct when the chosen pattern requires it.
- Preserve native type-ahead or provide equivalent behavior for a custom non-editable list. Keep pointer and touch support in addition to keyboard support.

### 4. Scale the option list

- With more than 10 items, add a clearly labelled search field that filters immediately and provides a no-results state.
- With more than 100 items, virtualize the list while preserving keyboard reachability, active-item scrolling, accessible item count and position, and the selected value.
- Reuse an installed virtualization primitive before writing windowing logic.

### 5. Keep motion under 150 milliseconds

- Complete open and close motion in less than `150ms`.
- Animate compositor-friendly opacity or transform properties, not layout.
- Resolve the final placement before animating and honor `prefers-reduced-motion`.

## Verification

Leave one runnable interaction check covering the changed control. At minimum, verify:

- Pointer and focus affordances plus a `44px` target.
- Upward placement at the viewport bottom and full access to the last item.
- Arrow, `Enter`, and `Escape` behavior with focus restoration.
- Search at 11 items and virtualization at 101 items.
- Motion duration and reduced-motion behavior.

Use real boundary values (`10`, `11`, `100`, and `101`) instead of assuming the thresholds work. If runtime verification is unavailable, state exactly which interactions remain unverified.

## Output

Return the implementation or component specification first, then the verification result and any remaining runtime limits.

## Shared output profile

Compose the `execution` profile from [output-templates](../output-templates/references/components.md).
Preserve the required dropdown rules above, omit empty components, and never present static inspection as proof of runtime behavior.
