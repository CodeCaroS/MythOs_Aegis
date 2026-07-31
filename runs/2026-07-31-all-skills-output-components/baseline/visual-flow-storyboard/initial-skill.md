---
name: visual-flow-storyboard
description: Reconstruct complete user journeys from actual code and turn them into visual storyboards. Use when analyzing multi-step flows, hidden branches, roles, feature flags, failure paths, or planning a better target flow from the codebase.
version: 1.0.0
author: Caro
license: Apache-2.0
tags:
  - flow-analysis
  - journey-mapping
  - ux
  - state-matrix

---

# Visual Flow Storyboard

Use this skill to map what the product actually does, not what the docs say it should do.

## What to analyze

- Entry points, exits, and interrupted resumes
- Screens, states, branches, and transitions
- Roles, permissions, tenant states, and feature flags
- Hidden, legacy, or unreachable paths
- Error, empty, loading, cancellation, and recovery states
- UX friction across the full journey

## Required approach

1. Start from the real codebase.
2. Identify the flow boundary: start point, end point, user role, and relevant flags or data states.
3. Trace the actual path through routes, guards, loaders, actions, APIs, redirects, and state transitions.
4. Build a state matrix for the meaningful variants.
5. Convert the states into a storyboard with numbered steps.
6. Mark uncertainty when a screen or branch is inferred rather than proven.
7. If asked for a future-state storyboard, describe the target flow and the changes needed to get there.
8. If asked for a change recap, compare before vs after and call out removed, added, or changed states.

## What to inspect

- Routes, pages, views, forms, dialogs, navigation, and responsive variants
- Guards, middleware, permissions, feature flags, redirects, and validation rules
- Loading, error, empty, and recovery behavior
- Tests, analytics events, and screenshots or design artifacts when present

## Output shape

Prefer a compact, structured storyboard:

- Flow summary
- Boundaries and roles
- State matrix
- Storyboard steps
- Branch diagram or table
- UX issues and friction points
- Target flow if requested
- Open questions or uncertain branches

## Rules

- Do not invent screens that are not supported by code or evidence.
- Do not analyze screens in isolation when the real issue is the full flow.
- Do not assume a framework implies the rendering or navigation model.
- Focus on the actual user journey and how the system responds at each step.
