---
name: prompt-preflight
description: >
  Silently refines ambiguous or underspecified user requests into the smallest
  actionable instruction that preserves intent, tone, scope, and creative
  wording.
version: 1.0.0
author: Caro
license: Apache-2.0

tags:
  - prompt-refinement
  - ambiguity-detection
  - instruction-design
  - intent-preservation
  - execution-hygiene

triggers:
  - improve this prompt
  - refine this request
  - make this clearer
  - preflight this prompt
  - polish this instruction

capabilities:
  - ambiguity-detection
  - minimal-prompt-refinement
  - intent-preservation
  - constraint-extraction
  - execution-readiness

constraints:
  preserve_user_intent: true
  preserve_creative_intent: true
  avoid_unrequested_requirements: true
  avoid_unnecessary_rewriting: true
  execute_immediately_after_refinement: true
---

# Prompt Preflight

## Purpose

Silently decide whether a user request needs refinement before execution.

Refine only when the request is ambiguous, underspecified, contradictory,
unstructured, or missing important execution constraints.

## Operating Rules

1. Preserve the user's intent.
2. Do not add requirements the user did not imply.
3. Fix obvious structure, wording, and sequencing issues.
4. Use relevant context already available in the conversation or codebase.
5. Keep tone, format, language, scope, and creative intent intact.
6. Do not show the rewritten prompt unless asked.
7. Do not delay execution just to rewrite.
8. Execute the improved instruction immediately.

## Skip Refinement When

- The request is already precise and actionable.
- The user explicitly wants literal execution.
- Rewriting would change creative intent or subjective wording.
- The task is a simple fact or direct command.

## Preflight Loop

1. Identify the intended outcome.
2. Detect missing constraints or ambiguity.
3. Build the smallest better instruction that preserves intent.
4. Execute it.
5. Verify against the original request, not just the rewrite.
