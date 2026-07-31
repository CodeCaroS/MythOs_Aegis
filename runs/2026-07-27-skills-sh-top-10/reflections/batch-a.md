# Batch A Reflections

## Result

All four candidates exceed their paired baseline on held-out validation by more
than the required `+0.01`, with no critical-dimension regression.

| Skill | Baseline validation | Candidate validation | Delta | Decision |
| --- | ---: | ---: | ---: | --- |
| find-skills | 0.4000 | 0.9430 | +0.5430 | Accept candidate |
| frontend-design | 0.7190 | 0.9765 | +0.2575 | Accept candidate |
| grill-me | 0.2350 | 0.9830 | +0.7480 | Accept candidate |
| agent-browser | 0.1575 | 0.9875 | +0.8300 | Accept candidate |

## Findings

### find-skills

The baseline has useful public-ecosystem discovery and quality heuristics, but
it starts outside the harness. That ordering causes the core failure: it can
recommend a popular duplicate and global tooling before checking what already
exists. The candidate's "reuse before adding" rule, repository-local install
preference, inventory update contract, and guard command directly prevent the
observed train failure and transfer cleanly to validation.

Protected behavior: retain source, license, maintenance, install-count, and
permission checks when external discovery is actually necessary.

### frontend-design

The baseline remains strong at distinctive visual direction, subject grounding,
copy, and restraint. Its weakness is not taste; it is insufficient binding to
an existing product system. The candidate converts personal preferences and
architecture constraints into an executable checklist: reuse tokens/assets,
avoid framework changes, expose operational state, and verify accessibility and
functional states in both themes.

Protected behavior: preserve the baseline's insistence on one product-grounded
signature and removal of generic decoration. The candidate retains this in a
more compact form.

### grill-me

The baseline is a non-portable delegation stub. When `/grilling` is unavailable,
it provides no behavior at all. The candidate is self-contained and correctly
scales questioning by reversibility. On validation, its rule not to reopen an
approved plan is decisive: it asks only the rollback question and hands off the
smallest reversible slice.

Protected behavior: the baseline contributes no unique behavior beyond the
intent to interview relentlessly; that intensity should not override decision
relevance or approved scope.

### agent-browser

The baseline hard-codes an external CLI and even instructs installation, which
conflicts with tasks that explicitly require browser tools already present or
an existing authenticated Chrome session. It also lacks the harness's known
URL-verification stop. The candidate routes by state and repeatability, verifies
after each action, expands UI coverage beyond route smoke tests, and stops
safely when the destination cannot be established.

Protected behavior: retain the baseline's preference for accessibility-tree
targets and specialized browser workflows, but only after selecting a capability
that is already authorized and available.

## Evaluation Limits

- These are single representative rollouts, not repeated stochastic trials.
- The browser prompts do not provide a concrete site or form. The candidate
  therefore receives credit for an honest blocked result and correct coverage
  plan, not for fabricated execution evidence.
- The test split stayed isolated and must remain unopened until the controller's
  final evaluation stage.
