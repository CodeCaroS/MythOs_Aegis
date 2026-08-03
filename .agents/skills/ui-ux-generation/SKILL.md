---
name: ui-ux-generation
description: Generate or reshape coherent, production-ready UI/UX by routing interface components and cross-cutting concerns to focused specialist rules. Use for building screens, flows, design systems, or multi-component frontend work; use the matching ui-ux specialist skill directly when the request has one focused concern.
version: 0.8.0
author: Caro
license: Apache-2.0
tags:
  - ui
  - ux
  - generation
  - components
---

# UI/UX Generation

Route component and cross-cutting behavior before generating code or visual direction.

## Workflow

1. Read the brief, current UI, component kit, semantic tokens, supported states, and responsive behavior.
2. Inventory the component types and cross-cutting concerns required by the requested screen or flow.
3. Read every matching specialist skill in the map below before designing or editing that concern.
4. Reuse native elements, existing product primitives, and installed dependencies before writing a custom control.
5. Generate the smallest coherent implementation that satisfies the brief and every selected specialist skill.
6. Verify keyboard, pointer, touch, viewport, responsive, reduced-motion, initial, loading, empty, partial-data, success, error, offline, disabled, read-only, permission-denied, unsaved-changes, destructive-confirmation, and recovery behavior that applies to the changed UI.

## Specialist skill map

| Concern | Read |
| --- | --- |
| Design-system architecture, tokens, spacing, grid, layout, iconography, motion, component contracts, documentation, or governance | [UI/UX Design Systems](../ui-ux-design-systems/SKILL.md) |
| Component radii, action labels, selection visibility, touch targets, readability, or decision metadata | [UI/UX Component Quality](../ui-ux-component-quality/SKILL.md) |
| Color contrast, semantic color roles, status cues, charts, dark mode, or forced-colors behavior | [UI/UX Color Contrast](../ui-ux-color-contrast/SKILL.md) |
| Dropdown, select, combobox, popup option list, or action menu | [UI/UX Dropdowns](../ui-ux-dropdowns/SKILL.md) |
| Form validation, inline error, error summary, or valid-field feedback | [UI/UX Form Validation](../ui-ux-form-validation/SKILL.md) |
| Skeleton, spinner, progress, pending action, slow operation, timeout, or retry | [UI/UX Loading States](../ui-ux-loading-states/SKILL.md) |
| Mobile CSS, anchor motion, modal scrolling, input zoom, tap feedback, or focus styling | [UI/UX Mobile CSS](../ui-ux-mobile-css/SKILL.md) |
| Typography scale, body size, fluid headings, line height, text measure, wrapping, or text resizing | [UI/UX Typography](../ui-ux-typography/SKILL.md) |

If the request concerns only one mapped concern, use its specialist skill directly. If no specialist skill exists yet, follow the existing product patterns and accessibility requirements; do not invent a speculative subskill during unrelated implementation work.

## Adding specialist skills

Add one top-level `ui-ux-<concern>` skill only when that concern is requested. Keep its rules specific, testable, and free of screen-level duplication, then add it to the map and repository inventories.

## Output

Return the requested artifact first. Follow it with the exact verification performed and any behavior that remains unverified.

## Shared output profile

Compose the `execution` profile from [output-templates](../output-templates/references/components.md).
Preserve stricter specialist-skill rules, omit empty components, and never present unverified behavior as complete.
