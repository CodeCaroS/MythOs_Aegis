---
name: grill-with-docs
description: Sharpen an architecture or product decision through focused questioning while maintaining only the durable glossary and ADR records the decision actually needs. Use when the user asks for grilling plus documentation, decision records, domain language, or architectural rationale.
version: 1.0.0
author: Caro
license: Apache-2.0
tags:
  - adr
  - domain-modeling
  - planning
---

# Grill With Docs

Run the `grill-me` workflow and keep documentation proportional to the decision.

1. Read the existing glossary, `CONTEXT.md`, ADR directory, and documentation conventions.
2. Reuse established domain terms. Record a new term only when the agreed design depends on it.
3. Update the decision ledger during the interview.
4. Offer an ADR only for a load-bearing, durable decision that future work could otherwise reverse or repeatedly debate.
5. If accepted, write the smallest repository-native ADR: context, decision, consequences, rejected alternatives, and verification/rollback when relevant.
6. Show documentation changes separately from implementation work.

Do not create a glossary, ADR directory, or architecture document for a reversible choice or an unapproved proposal. Do not rewrite existing decisions merely to normalize style.

Adapted for MythOs Aegis from `mattpocock/skills` `grill-with-docs`.
