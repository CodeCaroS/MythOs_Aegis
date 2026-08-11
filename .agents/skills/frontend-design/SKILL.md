---
name: frontend-design
description: Design or reshape distinctive, production-ready interfaces while preserving the product's existing architecture, brand assets, semantic tokens, accessibility, and literal UI direction. Use for frontend implementation, redesigns, visual systems, dashboards, settings, work-management views, and light/dark UI work.
version: 1.0.0
author: Caro
license: Apache-2.0
overlaps_with: [ui-ux-generation, web-design-guidelines, ux-pattern-review]
tags:
  - frontend
  - ui
  - accessibility
  - design-system
---

# Frontend Design

Start from the product, not a fashionable template.

Use this for holistic screen/visual-direction work. If the request is a single focused concern (dropdowns, form validation, loading states, typography, color contrast, mobile CSS), use `ui-ux-generation`'s specialist map instead — it routes to the matching `ui-ux-*` skill directly. For an audit of already-built UI rather than new design, use `web-design-guidelines` or `ux-pattern-review`.

## Workflow

1. Read the brief, existing UI, tokens, assets, component kit, and responsive behavior.
2. Name the screen's user, single job, and actual content. Preserve literal product direction.
3. Reuse the current framework and semantic tokens. Do not add a design library, font package, animation system, or parallel theme layer unless the existing stack cannot deliver the brief.
4. Choose one visual signature grounded in the product. Keep everything else disciplined.
5. Implement the smallest coherent slice, then inspect it at desktop and mobile sizes.
6. Verify keyboard focus, labels for icon-only controls, contrast in light and dark themes, reduced motion, empty/error/loading states, and readable density.
7. Remove decoration that does not clarify hierarchy, state, ownership, or the next action.

## Direction

- Use existing brand assets before inventing replacements.
- Prefer professional, compact structure over oversized marketing layouts.
- Make state explicit: current worker, active action, progress, feedback, and valid next steps should not be inferred from color alone.
- Keep notifications in the product's designated notification surface.
- Write interface copy in plain verbs. Keep an action's name consistent through button, progress, success, and error states.
- Avoid generic gradients, arbitrary glass effects, excessive cards, decorative numbering, and animation without a user-facing purpose.

Adapted and materially modified for MythOs Aegis from Anthropic's `frontend-design`.

## Shared output profile

Compose the `plan` profile from [output-templates](../output-templates/references/components.md).
Lead with the design direction, then constraints, state coverage, implementation slices, and verification.
Preserve stricter domain rules above, omit empty components, and never fill a component with invented evidence.
