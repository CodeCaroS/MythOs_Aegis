---
name: agent-browser
description: Route website and browser tasks through the browser capability already available in the current environment. Use for navigation, forms, screenshots, data extraction, authenticated Chrome work, exploratory testing, Electron app control, and end-to-end UI verification.
version: 1.0.0
author: Caro
license: Apache-2.0
tags:
  - browser
  - automation
  - testing
---

# Agent Browser

Use the browser route that already fits the task:

- Use the in-app browser for isolated navigation and visual inspection.
- Use Chrome control when the task depends on the user's existing tabs, cookies, login, or extensions.
- Use Playwright for repeatable application tests and durable regression coverage.
- Use computer control only for Windows UI that browser tooling cannot reach.

## Operating Loop

1. Inspect the current page and URL before acting.
2. Reuse stable roles, labels, and accessibility-tree targets; use coordinates only as a last resort.
3. Perform one meaningful action, then verify the resulting state.
4. Before submitting, sending, purchasing, publishing, deleting, or overwriting, confirm the target and authorization boundary.
5. Capture evidence proportional to the task: screenshot for visual state, exact text for content, or a runnable Playwright check for repeatable behavior.
6. For UI coverage, test interactions, validation, empty/error states, duplicate submission protection, and reload persistence—not routes alone.
7. Stop after a browser-policy or URL-verification failure instead of guessing where actions will land.

Do not install another browser CLI merely because the upstream skill prefers one.

Adapted for MythOs Aegis from `vercel-labs/agent-browser`.

## Shared output profile

Compose the `execution` profile from [output-templates](../output-templates/references/components.md).
Report the URL boundary, interaction evidence, and exactly what was verified.
Preserve stricter domain rules above, omit empty components, and never fill a component with invented evidence.
