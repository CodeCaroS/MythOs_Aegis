# Iteration 1 Reflection

## Recurring baseline failures

- All 29 skills lacked an explicit shared output profile, so generic response
  scaffolding was duplicated, implicit, or absent.
- Nineteen validation cases fell below 0.80. Compact execution and review skills
  most often omitted an explicit outcome, uncertainty boundary, or verification
  field even when their domain workflow was sound.
- Existing large review skills already contained valuable domain-specific output
  fields. Replacing them wholesale would risk losing source, safety, and evidence
  requirements.

## Stable successes to protect

- Existing workflows, safety boundaries, and domain checklists remain the source
  of truth for substance.
- Artifact modes in `humanizer` and `prompt-preflight` correctly avoid ceremonial
  wrappers.
- `quick-recap` correctly distinguishes complete, partial, and blocked states.
- Review skills already separate confirmed findings from uncertainty better than
  the compact skills.

## Accepted direction

Add one bounded profile declaration to every skill and place the generic shell
in a shared component reference. The shared layer defines ordering, evidence,
verification, limits, and proportionality; each skill retains and maps its own
domain fields. This improves consistency without deleting working guidance.

## Regression analysis

Candidate construction preserved every original skill and frontmatter byte for
byte, added at most 41 words per skill, and explicitly gives stricter domain
rules precedence. No safety, authorization, source, or artifact-only rule was
removed.
