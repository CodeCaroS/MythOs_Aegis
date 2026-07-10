---
name: quick-recap
description: End every substantive response with a one-line status recap that makes completion, blockers, and required user actions immediately visible.
version: 0.0.1
author: Caro
license: Apache-2.0
tags:
  - response-format
  - status
  - reporting
  - honesty
---

# Quick Recap

## Purpose

Make the result of every agent response understandable at a glance.

The agent must clearly state whether:

- the full request was completed,
- only part of the request was completed,
- or the request could not be completed.

The recap must never hide missing work, skipped requirements, assumptions, failed tool calls, unresolved errors, or required user input.

## When to Use

Use this skill for every substantive response, especially when:

- implementing code,
- editing files,
- running tests,
- reviewing code,
- researching information,
- executing multi-step tasks,
- using tools or subagents,
- encountering missing information,
- stopping before the entire request is complete.

Do not add the recap to trivial acknowledgements unless the acknowledgement represents the final response to a task.

## Mandatory Response Footer

End every substantive response with exactly one Quick Recap line.

Use one of these formats:

```text
🟢 Quick Recap: Completed everything requested. No further action is required.
```

```text
🟡 Quick Recap: Partially completed — <what was completed>. To continue, I need <specific action, information, permission, or file>.
```

```text
🔴 Quick Recap: Could not complete the request because <specific reason>. To proceed, I need <specific action, information, permission, or file>.
```

The Quick Recap must be the final line of the response.

## Status Rules

### 🟢 Green — Complete

Use green only when all explicit requirements were completed successfully.

Green requires that:

- every requested deliverable exists,
- every requested modification was applied,
- required tests or checks were completed,
- no known blocker remains,
- no user action is required,
- no requirement was knowingly skipped.

Do not use green merely because progress was made.

Do not use green when:

- tests were not run despite being requested,
- a requested file was not modified,
- only an example or partial implementation was produced,
- a tool failed,
- an assumption materially changed the result,
- follow-up work is still required.

### 🟡 Yellow — Partial or Waiting

Use yellow when useful progress was made, but the full request is not complete.

Examples:

- part of the implementation is finished,
- some files were changed but others remain,
- tests pass partially,
- required information is missing,
- user approval or access is required,
- a non-critical tool failed,
- the agent reached a safe stopping point,
- the agent intentionally deferred part of the work.

The recap must state:

1. what was completed,
2. what remains,
3. exactly what is needed next.

Bad:

```text
🟡 Quick Recap: Some work remains.
```

Good:

```text
🟡 Quick Recap: Implemented the date-picker state and keyboard navigation, but visual regression tests are still missing. To continue, I need the project’s Playwright configuration.
```

### 🔴 Red — Not Completed

Use red when the requested task was not meaningfully completed.

Examples:

- required files are unavailable,
- access or permissions are missing,
- the task cannot be performed safely,
- the request is impossible with the available tools,
- a critical command or tool failed,
- the supplied input is invalid,
- the agent must refuse the request,
- no reliable result could be produced.

The recap must explain the blocker precisely and state what would unblock the task.

Bad:

```text
🔴 Quick Recap: I could not do it.
```

Good:

```text
🔴 Quick Recap: Could not update the component because the repository is not available in this session. To proceed, I need the repository files or access to the project workspace.
```

## Honesty Requirements

The recap must reflect the actual state of the work.

Never:

- claim completion when work was skipped,
- hide failed commands,
- describe untested code as verified,
- imply files were changed when only suggestions were provided,
- use green when known errors remain,
- blame the user vaguely,
- use generic phrases such as “something went wrong,”
- omit the exact requirement needed to continue.

When uncertain, choose yellow instead of green.

When no meaningful progress was possible, choose red instead of yellow.

## Handling Multiple Tasks

Evaluate the user’s entire request, not only the latest completed step.

If 4 of 5 requested tasks are complete, use yellow.

Example:

```text
🟡 Quick Recap: Completed the API client, validation layer, unit tests, and documentation. The migration is still missing because no database schema was provided. To continue, I need the current schema or migration files.
```

## Tool and Test Reporting

If tools, commands, builds, linters, or tests were involved, reflect their outcome in the recap when relevant.

Examples:

```text
🟢 Quick Recap: Completed the refactor and verified it with 42 passing tests and a successful production build.
```

```text
🟡 Quick Recap: Completed the refactor, but verification is incomplete because the test command fails before execution due to a missing environment variable. To continue, I need `DATABASE_URL`.
```

```text
🔴 Quick Recap: Could not modify the repository because the file-editing tool failed before any changes were applied. To proceed, I need a writable workspace.
```

Do not say tests passed unless they were actually executed.

## Required Specificity

The recap must be one line, but it must still be actionable.

Include concrete details such as:

- file names,
- missing inputs,
- failed checks,
- pending decisions,
- required permissions,
- exact commands or configuration values,
- the remaining implementation area.

Avoid vague wording.

## Response Style

The main response may contain full context, explanations, code, logs, or recommendations.

The footer must remain:

- one line,
- direct,
- factual,
- easy to scan,
- free of unnecessary detail.

Do not add content after the Quick Recap.

## Examples

### Fully Completed

```text
Implemented the requested authentication flow, added refresh-token rotation, and verified the changes with unit and integration tests.

🟢 Quick Recap: Completed everything requested; authentication, token rotation, and all requested tests are in place and passing.
```

### Partially Completed

```text
The form component and validation schema are implemented. The API integration could not be completed because the endpoint contract is missing.

🟡 Quick Recap: Implemented the form and validation, but API integration remains. To continue, I need the endpoint URL and request/response schema.
```

### Failed Tool Call

```text
I inspected the repository structure, but the build tool stopped because Node.js is not installed in the environment.

🟡 Quick Recap: Reviewed the repository, but could not run the requested build. To continue, I need a Node.js-enabled environment.
```

### No Work Possible

```text
The referenced file is not available in the current workspace.

🔴 Quick Recap: Could not edit the requested file because it was not provided. To proceed, I need the file uploaded or its contents pasted here.
```

### Safety Refusal

```text
I cannot assist with creating malware that steals credentials. I can help with defensive detection rules or a safe demonstration that does not collect real credentials.

🔴 Quick Recap: Did not perform the requested credential-theft implementation because it is unsafe. To proceed safely, provide a defensive or sandboxed security objective.
```

## Agent Instruction Snippet

To enable this behavior globally, add the following instruction to `AGENTS.md`, `CLAUDE.md`, or the agent’s system instructions:

```markdown
Use the Quick Recap skill for every substantive response. End the response with exactly one green, yellow, or red Quick Recap line. Green means every requested item is complete. Yellow means partial completion or required user action. Red means the task was not completed. Never claim completion when requirements, tests, tool calls, or files remain unresolved.
```

## Final Self-Check

Before sending a response, verify:

- Did I complete every explicit requirement?
- Did I skip anything knowingly?
- Did any command, tool, test, or subagent fail?
- Is any user action still required?
- Does the selected color match the real state?
- Does the recap state exactly what remains?
- Is the Quick Recap the final line?

If any answer creates doubt, do not use green.
