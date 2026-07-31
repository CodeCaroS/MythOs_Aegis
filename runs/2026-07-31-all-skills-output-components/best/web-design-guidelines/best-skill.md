---
name: web-design-guidelines
description: Audit web UI code and rendered behavior for accessibility, interaction, responsive layout, visual consistency, and usable states. Use when reviewing a UI, checking accessibility or UX, validating a redesign, or comparing implementation against current web-interface guidance.
version: 1.0.0
author: Caro
license: Apache-2.0
tags:
  - ui-review
  - accessibility
  - ux
---

# Web Design Guidelines

1. Fetch the current upstream guidelines from `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`.
2. Read repository instructions, the target files, semantic tokens, and existing component patterns.
3. Inspect rendered behavior when runtime access is available; code alone cannot prove focus order, contrast, overflow, or interaction state.
4. Check keyboard use, labels, semantics, focus visibility, contrast in every supported theme, reduced motion, responsive layout, loading/empty/error states, destructive-action confirmation, and disabled/busy states.
5. Report only actionable findings, ordered by severity, as `file:line — issue — smallest fix`.
6. Separate confirmed defects from runtime risks that still need reproduction.

Do not replace the design system during an audit. Do not report route coverage as complete functional UI coverage. Preserve icon-control accessibility and make the user's next action explicit.

Adapted for MythOs Aegis from Vercel's `web-design-guidelines`.

## Shared output profile

Compose the `review` profile from [output-templates](../output-templates/references/components.md).
Report evidence-backed findings first, then missing runtime coverage and exact steps to verify behavior.
Preserve stricter domain rules above, omit empty components, and never fill a component with invented evidence.
