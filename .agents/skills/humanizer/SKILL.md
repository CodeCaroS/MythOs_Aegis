---
name: humanizer
description: Rewrite or review German or English prose so it sounds natural, specific, and consistent with the author's voice without changing facts, certainty, or protected structure. Use for documents, emails, posts, PR descriptions, comments, status updates, and agent responses that feel generic, promotional, repetitive, over-polished, or AI-written. Also use when the user asks to humanize text, remove AI tone, match a writing sample, or make wording sound more like them. Do not use for code-only tasks.
version: 1.0.0
author: Caro
license: Apache-2.0
tags:
  - writing
  - editing
  - german
  - english
  - tone
  - voice
---

# Humanizer

Edit the prose, not the author's identity. Prefer a small faithful rewrite over
a conspicuously "human" performance.

## Priority

Apply these rules in order:

1. Follow the user's explicit wording, tone, language, and format requirements.
2. Match any supplied writing sample, including its quirks and punctuation.
3. Preserve meaning, facts, uncertainty, and required harness structure.
4. Apply the heuristics below only where they improve the text.

## Protect before rewriting

Do not alter or invent:

- names, facts, numbers, dates, quotes, citations, URLs, and claim strength;
- code, commands, paths, identifiers, logs, frontmatter, data, or link targets;
- Markdown directives, writing-block fences, Git directives, and inline comments;
- required output-template sections or the final Quick Recap status and meaning.

Keep domain terms when they are precise. Do not replace useful technical
language with casual approximations.

## Rewrite pass

1. Identify the audience, register, language, and intended outcome.
2. Look for clusters of problems, not isolated words or punctuation:
   - filler, throat-clearing, signposting, and repeated conclusions;
   - inflated significance, sales language, or generic positivity;
   - vague authorities, unsupported certainty, or fabricated specificity;
   - uniform sentence length, forced groups of three, synonym cycling, or
     stacked punchline fragments;
   - abstract nouns and elaborate verbs where a concrete subject and simple
     verb are clearer;
   - diff narration in timeless documentation;
   - chatbot residue such as praise, offers to continue, or ceremonial framing.
3. Rewrite only the affected passages. Keep strong, distinctive phrasing.
4. Vary rhythm naturally, but do not manufacture slang, jokes, opinions,
   hesitations, or personal anecdotes.
5. Read the result once for voice and once for factual fidelity.

An isolated em dash, transition word, polished sentence, or formal term is not
evidence of AI writing. Preserve it when it fits the author's voice.

## Harness modes

### Pasted text

Return only the final rewrite unless the user asks for an audit, alternatives,
or an explanation.

### File

Edit prose in place. Leave protected content untouched. Report the changed file
and the verification performed instead of pasting the whole file.

### Embedded

When another task invokes this skill for an email, document, PR description,
commit message, or final response, apply the pass silently and return only the
requested artifact. Preserve the owning workflow's output template.

## Compatibility

- Run factual, security, and reasoning checks before this style pass.
- Do not soften criticism, hide uncertainty, or turn evidence into opinion.
- Keep concise harness responses concise. Natural does not mean longer.
- Do not add a "humanization audit" unless requested.

## Final check

Confirm that:

- every factual claim still matches the source;
- no protected token or required section changed accidentally;
- the result remains in the source language unless translation was requested;
- the voice fits the author and audience;
- the rewrite removed actual patterns rather than merely swapping synonyms.

## Provenance

Adapted and substantially rewritten for MythOs Aegis from
[blader/humanizer](https://github.com/blader/humanizer/tree/523374dee72d67c7b2b5f858ea0094ffda49c3ac).
The retained MIT notice is in
[THIRD_PARTY_NOTICES.md](../../../THIRD_PARTY_NOTICES.md).

## Shared output profile

Compose the `artifact` profile from [output-templates](../output-templates/references/components.md).
Return the rewrite as the deliverable while preserving facts, protected structure, and voice.
Preserve stricter domain rules above, omit empty components, and never fill a component with invented evidence.
