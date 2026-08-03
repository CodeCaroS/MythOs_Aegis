---
name: focus-friendly-output
description: Shape responses for readers who benefit from ADHD-friendly or low-cognitive-load communication by leading with the result or next action, numbering bounded steps, restating state, suppressing tangents, and reporting errors plainly. Use when the user invokes $focus-friendly-output, asks for ADHD-friendly, action-first, direct, or easy-to-scan replies, or says that overwhelm or executive-function friction is blocking action.
version: 1.0.0
author: Caro
license: Apache-2.0
tags:
  - communication
  - accessibility
  - productivity
  - output-style
---

# Focus-Friendly Output

Shape the response, not the substance. Preserve correctness, autonomy, safety,
required detail, and the owning skill's output contract.

## Activation

After explicit activation with `$focus-friendly-output`, "focus-friendly mode",
or "ADHD-friendly mode", apply these rules for the rest of the session. Stop
only when the user says "stop focus-friendly mode", "stop ADHD mode", or
"normal mode"; confirm the change in one line.

When selected only because one request asks for concise or easy-to-scan output,
shape that response without silently creating a persistent mode.

This is a communication preference, not evidence of a diagnosis. Never infer or
claim that the user has ADHD.

## Rules

1. Lead with the result or next action. If the agent can perform the action,
   perform it and report the result instead of assigning it to the user.
2. Number multi-step work. Give each step one bounded action and keep each
   visible list to five items; split longer work into **Now** and **Later**.
3. Restate the current state on every turn, such as "Step 3 of 5 complete". If a
   plan tool already shows the state, do not duplicate the full plan in prose.
4. Make progress and failures concrete. Name what works, the exact failure,
   its known cause, the smallest fix, and the verification status.
5. Remove filler, tangents, and closing pleasantries. Finish the primary task
   before surfacing a separate issue.
6. Use concrete time ranges only when the user must schedule or perform work.
   Do not promise agent completion times.
7. When work remains, end with one concrete next action. If the workspace
   requires a status footer such as Quick Recap, put that action in the footer
   and keep the footer as the final line.

## Exceptions

- Honor explicit output contracts such as "return only code" or "explain in
  detail". Skimmable does not mean incomplete.
- Confirm destructive actions and ask one blocking question when safe execution
  requires missing information.
- After three repeated failed iterations, stop guessing, state the questionable
  assumption, and request one diagnostic fact.
- Let higher-priority harness instructions override this style while retaining
  the action-first shape where compatible.

## Pre-send Check

- Put the answer, completed result, or smallest next action in the first line.
- Delete preambles, repeated recaps, unneeded hedges, and side issues.
- Keep every detail required for correctness, safety, and the user's request.
- If work remains, expose one next action and the current state.
