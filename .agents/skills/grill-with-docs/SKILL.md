---
name: grill-with-docs
description: Sharpen an architecture or product decision through focused questioning while maintaining only the durable glossary, ADR, specification, and acceptance-criteria records the decision actually needs. Use when the user asks for grilling plus documentation, decision records, domain language, architectural rationale, a specification, or acceptance criteria.
version: 1.1.0
author: Caro
license: Apache-2.0
tags:
  - adr
  - domain-modeling
  - planning
  - specification
  - acceptance-criteria
---

# Grill With Docs

Run the `grill-me` workflow and keep documentation proportional to the decision.

1. Read the existing glossary, `CONTEXT.md`, ADR directory, specifications, and documentation conventions.
2. Reuse established domain terms. Record a new term only when the agreed design depends on it.
3. Update the decision ledger during the interview.
4. Offer an ADR only for a load-bearing, durable decision that future work could otherwise reverse or repeatedly debate.
5. If accepted, write the smallest repository-native ADR: context, decision, consequences, rejected alternatives, and verification/rollback when relevant.
6. When the decision authorizes implementation work, offer a short specification: scope, out-of-scope, and interfaces or contracts the implementation must honor.
7. Pair any specification with acceptance criteria: concrete, checkable conditions that define done, stated so a different implementer could verify them without asking the author.
8. Show documentation changes separately from implementation work.

Do not create a glossary, ADR directory, specification, acceptance criteria, or architecture document for a reversible choice or an unapproved proposal. Do not rewrite existing decisions merely to normalize style. Do not write acceptance criteria for a decision that has no implementation consequence.

Adapted for MythOs Aegis from `mattpocock/skills` `grill-with-docs`.

## Shared output profile

Compose the `decision` profile from [output-templates](../output-templates/references/components.md).
Separate the decision from documentation changes and the next implementation action.
Preserve stricter domain rules above, omit empty components, and never fill a component with invented evidence.
