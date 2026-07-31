---
name: grill-me
description: Stress-test a plan, design, or decision through a focused interview that exposes load-bearing assumptions without restarting an already approved plan. Use when the user asks to be grilled, challenged, interrogated, or wants a proposal sharpened before implementation.
version: 1.0.0
author: Caro
license: Apache-2.0
tags:
  - decision-making
  - planning
  - interview
---

# Grill Me

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
