---
name: ui-ux-form-validation
description: Generate, implement, or fix humane form validation and error feedback. Use whenever UI work changes form fields, inline errors, error summaries, validation timing, submit behavior, server validation, or positive confirmation for valid input.
version: 0.1.0
author: Caro
license: Apache-2.0
tags:
  - ui
  - ux
  - forms
  - validation
  - accessibility
---

# UI/UX Form Validation

Validate when feedback can help the user act, not while they are still expressing the value.

## Field state model

| State | Behavior |
| --- | --- |
| Untouched or typing before first blur | Show no validation error. |
| Blurred and invalid | Show one specific inline error and mark the field invalid. |
| Previously invalid and being corrected | Revalidate that field live. |
| Corrected | Clear the error immediately and confirm success when useful. |
| Submitted with invalid fields | Validate all fields, keep every value, and move the user to the first actionable error. |

## Required rules

### 1. Validate on blur first

- Wait until the user leaves a field before showing its first validation error.
- Do not flag an incomplete email, date, password, or other in-progress value on each initial keystroke.
- Allow input formatting, character counts, and password guidance while typing, but keep them distinct from errors.

### 2. Switch only an invalid field to live validation

- After a field has failed validation, revalidate that field on input or change.
- Clear its error as soon as the current value is valid. Do not require another blur or submit.
- Keep other untouched fields quiet. Do not switch the entire form to eager validation because one field failed.

### 3. Make submit recovery immediate

- On submit, validate every remaining field because submission is an explicit validation request.
- Keep all entered values and show errors beside their fields.
- For long forms or multiple errors, show a concise error summary linked to each invalid field and focus the summary or first invalid field.
- Scroll the first error into view without hiding it beneath sticky headers. Do not make the user hunt through a wall of red.

### 4. Confirm valid input

- Show a check icon or equally clear positive state after a previously invalid field becomes valid, or when confirmation materially reduces uncertainty.
- Pair color and icons with accessible text or a programmatic state. Do not use green alone.
- Avoid success states for untouched fields, trivial optional blanks, or every ordinary keystroke. Announce the transition once instead of creating live-region noise.

### 5. Make errors specific and accessible

- State the cause and recovery in plain language, such as `Enter an email in the format name@example.com`.
- Associate each message with its field and expose the invalid state using native semantics or `aria-invalid` plus `aria-describedby` when needed.
- Preserve keyboard focus, visible focus styles, and screen-reader access. Never rely on placeholders or color as the label or error.

### 6. Preserve the same lifecycle for server validation

- Treat client validation as guidance, not as a replacement for server-side validation.
- Map returned field errors beside the matching controls, keep submitted values, and route form-level failures to the error summary.
- For asynchronous field checks, start after blur, cancel or ignore stale responses, and confirm success only for the current value.

## Verification

Leave one runnable interaction check covering the full changed lifecycle:

1. Type a temporarily invalid value and confirm that no error appears before first blur.
2. Blur the field and confirm that a specific associated error appears.
3. Correct the value and confirm that the error clears immediately without another submit.
4. Confirm that the valid state is perceivable without relying on color alone.
5. Submit a form with untouched invalid fields and confirm value preservation, summary or first-error focus, and direct recovery.
6. Exercise returned server errors and stale asynchronous responses when those paths exist.

If runtime or assistive-technology verification is unavailable, state exactly which feedback and focus transitions remain unverified.

## Output

Return the implementation or interaction specification first, then the verification result and any remaining runtime limits.

## Shared output profile

Compose the `execution` profile from [output-templates](../output-templates/references/components.md).
Preserve the validation lifecycle above, omit empty components, and never present static inspection as proof of runtime behavior.
