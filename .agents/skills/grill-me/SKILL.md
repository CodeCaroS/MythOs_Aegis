---
name: grill-me
description: Stress-test a plan, design, or decision through a focused interview that exposes load-bearing assumptions without restarting an already approved plan. Use when the user asks to be grilled, challenged, interrogated, or wants a proposal sharpened before implementation.
version: 1.0.0
author: Caro
license: Apache-2.0
overlaps_with: [apocalypse, decision-criticality-gate, rigorous-response]
tags:
  - decision-making
  - planning
  - interview
---

# Grill Me

Use this when key information is missing before a plan can be approved. If the plan is otherwise complete and the goal is finding failure modes rather than filling gaps, use `apocalypse` instead.

Ask only questions whose answers can change the decision.

1. Restate the outcome, current constraints, and strongest assumption in three lines or fewer.
2. Classify the decision with `decision-criticality-gate`.
3. For reversible low-impact choices, ask no more than three questions, then recommend a default.
4. For high-impact or hard-to-reverse choices, probe success criteria, users, constraints, failure modes, ownership, migration, rollback, and evidence.
5. Ask one question at a time. Challenge vague words with a concrete example or counterexample.
6. Maintain a compact decision ledger: decided, assumed, open, rejected.
7. Stop when remaining answers would not change the plan. Summarize the decision and smallest next verified slice.

Do not reopen settled requirements without new evidence. When the user has explicitly approved implementation, execute instead of starting another interview.

Adapted for MythOs Aegis from `mattpocock/skills` `grill-me`.

## Shared output profile

Compose the `decision` profile from [output-templates](../output-templates/references/components.md).
Return only decision-changing questions, one safe default when useful, and the next decision or action.
Preserve stricter domain rules above, omit empty components, and never fill a component with invented evidence.
