---
name: ui-ux-design-systems
description: Generate, document, implement, or audit coherent design systems across foundations, semantic tokens, spacing, grids, layouts, iconography, motion, component and pattern contracts, system states, documentation, and governance. Use for design-system architecture, component-library audits, token scales, responsive foundations, icon or motion standards, duplicate components, contribution rules, ownership, and breaking-change policy.
version: 0.1.0
author: Caro
license: Apache-2.0
tags:
  - ui
  - ux
  - design-system
  - tokens
  - governance
  - accessibility
---

# UI/UX Design Systems

Treat the design system as the binding source for reusable UI, tokens, behavior, UX patterns, documentation, and governance—not only as a component library.

## Workflow

1. Establish the product, platform, audience, user role, primary task, devices, breakpoints, technical constraints, and existing design system.
2. Inventory foundations, components, patterns, documentation, governance, and every supported state before proposing changes.
3. Read each matching specialist before auditing or changing color, typography, component behavior, loading, mobile behavior, or a named control.
4. Find hard-coded values, arbitrary spacing, near-duplicate type or component roles, missing states, inconsistent icons, vague labels, undersized targets, and decorative or slow motion.
5. Prioritize findings by user impact, frequency, reach, accessibility risk, recovery cost, and implementation risk.
6. Recommend or implement the smallest coherent change that fixes the shared cause rather than patching every instance.
7. Define measurable acceptance criteria and a validation plan across supported themes, states, breakpoints, input methods, and assistive technology.

## System layers

Account for all four layers:

1. **Foundations:** color, typography, spacing, grid and layout, iconography, motion.
2. **Components:** primitives such as buttons, inputs, badges, icon buttons, checkboxes, radios, and switches; compositions such as cards, modals, dropdowns, search, form fields, tabs, tables, and navigation; variants, states, and responsive behavior.
3. **Patterns:** navigation, forms, dialogs, data tables, search and filtering, selection, loading, empty, and error flows.
4. **Documentation and governance:** usage rules, properties, examples, naming, contribution, ownership, and change policy.

Do not force atomic-design terminology onto a product with a different established taxonomy. Preserve the layer responsibilities even when names differ.

## Foundations

### Tokens

- Reuse semantic tokens and supported component variants before adding direct values or new primitives.
- Let components consume role tokens rather than raw palette steps. Keep palette scales as implementation inputs, not component semantics.
- Read [UI/UX Color Contrast](../ui-ux-color-contrast/SKILL.md) for color roles, themes, status cues, and measured pairings.
- Read [UI/UX Typography](../ui-ux-typography/SKILL.md) for type roles, sizing, line height, measure, and resizing.

### Spacing

- Start with a `4px` base only when it fits the existing product and target devices.
- Prefer a restrained scale such as `4, 8, 12, 16, 24, 32, 48, 64px`; adapt or reuse the product scale instead of introducing near-duplicates.
- Draw margin, padding, and gap from tokens unless a documented optical correction is necessary.
- Use tighter spacing for strong relationships and larger spacing between sections or different tasks.
- Avoid both cramped layouts and empty space without structural purpose.

### Grid and layout

- Use a consistent grid. Treat 12 columns, `16–24px` gutters, and `24–48px` outer margins only as starting points for large layouts.
- Define breakpoint behavior explicitly and preserve content priority at every size.
- Reflow or reorder content before shrinking it past usability. Permit horizontal scrolling only for intrinsically wide content such as data tables or timelines.
- Verify narrow, wide, zoomed, translated, and content-heavy layouts rather than approving the grid in an empty mockup.

### Iconography

- Prefer one existing icon library and keep stroke, corner, cap, join, optical alignment, and sizing consistent.
- Treat a `24 × 24px` box and about `2px` stroke only as common starting points. Use `16px` inline, `20px` standard, `24px` navigation, `32px` feature, and `48px` decorative sizes only when they fit the chosen library and context.
- Use `currentColor` when an icon should inherit its semantic color role.
- Give icon-only controls an accessible name and a discoverable tooltip when the action is not self-evident.
- Separate visible icon size from the interactive target; default important touch targets to at least `44 × 44 CSS px`.

### Motion

- Animate only to direct attention, explain state change or spatial relationship, provide feedback, or clarify a transition.
- Start enter motion with `ease-out`, movement or resize with `ease-in-out`, and exit motion with `ease-in`; change them when observed behavior calls for it.
- Treat `100, 200, 300, 400, 500ms` as a draft scale for micro-feedback through complex orchestration, not universal assignments.
- Keep direct interactions at or below `300ms` unless a stricter component rule applies. Preserve the dropdown specialist's `<150ms` requirement instead of copying a generic `300ms` dropdown example.
- Do not mirror enter and exit automatically. Avoid blocked interaction, delayed readability, distracting choreography, and animation-driven layout shift.
- Respect `prefers-reduced-motion` with an understandable non-motion state.

## Components, patterns, and states

- Build from existing primitives into compositions and reusable patterns; extend a suitable component before creating a parallel near-duplicate.
- For every component, define purpose, use and non-use cases, anatomy, properties, sizes, variants, allowed content, responsive behavior, keyboard behavior, accessibility, code examples, copy-ready snippets, do and do-not guidance, and known limits.
- Cover default, hover, focus, active or pressed, selected, disabled, read-only, loading, error, and success when applicable.
- Keep selected stronger than hover, focus continuously visible, and disabled distinct from loading and read-only. Give destructive actions a recognizable variant and precise consequence label.
- For relevant views, also define initial, empty, partial-data, offline, permission-denied, unsaved-changes, destructive-confirmation, and recovery behavior.
- Read [UI/UX Component Quality](../ui-ux-component-quality/SKILL.md) for component-level usability and [UI/UX Loading States](../ui-ux-loading-states/SKILL.md) for loader selection, timeout, retry, and async transitions.

## Documentation and governance

- Define binding token namespaces, component names, property conventions, and state terminology.
- Document when a new component is justified and require an existing-component extension check first.
- Maintain a contribution process, responsible owners, review expectations, and compatibility policy.
- Record changes, deprecations, migration guidance, and possible breaking changes.
- Keep documentation aligned with shipped properties, variants, behavior, accessibility, and examples; stale documentation is a system defect.

## Findings and acceptance

Classify findings as:

- **Critical:** a primary task is impossible or a severe accessibility or safety failure exists.
- **High:** frequent failure or major confusion is likely.
- **Medium:** material friction, inconsistency, or maintenance risk exists.
- **Low:** consistency or visual quality can improve without blocking use.

For each finding, report evidence, user impact, affected components, violated rule, smallest recommendation, required tokens or variants, acceptance criteria, and validation.

Accept the system only when tokens have clear roles, foundations are responsive, components and patterns cover relevant states, duplicates have an explicit disposition, documentation matches implementation, governance has owners, and validation covers real content and supported environments.

Treat `4px`, 12 columns, `44 × 44px`, icon sizes, easing, and durations as defaults or review checkpoints. Product context, the existing system, accessibility, measured behavior, and technical constraints always decide the final value.

## Output

Return the requested system artifact or prioritized findings first, followed by implemented changes, verification, and remaining limits.

## Shared output profile

Compose the `execution` profile for creation or fixes and the `review` profile for audits from [output-templates](../output-templates/references/components.md).
Preserve the layer inventory, finding fields, and acceptance requirements above; never present a copied blueprint value as product evidence.
