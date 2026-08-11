---
name: context-budget
description: >
  Plans and enforces the context window as a budget: what an agent loads, what it
  keeps, what it writes down, and when it hands over. Use for long agent sessions,
  large repositories, repeated codebase re-reading, token cost complaints,
  multi-session work, project memory files, and handover before context overflow.
version: 1.0.0
author: Caro
license: Apache-2.0
overlaps_with: [shepherd]
tags:
  - context-engineering
  - token-economy
  - codebase-indexing
  - project-memory
  - handover
  - retrieval
  - session-continuity
  - agent-efficiency
triggers:
  - context budget
  - too many tokens
  - agent keeps re-reading the codebase
  - session context is full
  - handover to a new session
  - project memory file
  - reduce token cost
  - index the repository for agents
capabilities:
  - context-inventory
  - load-policy-design
  - memory-file-design
  - handover-package
  - retrieval-routing
  - budget-reporting
outputs:
  - markdown
  - context-plan
  - memory-file
  - handover-note
requires:
  - repository-access
constraints:
  measure_before_optimizing: true
  never_summarize_away_decisions: true
  handover_before_overflow: true
---

# Context Budget

## Purpose

Treat the context window as a finite budget with an explicit allocation, not as a
place where files accumulate until quality collapses.

For checkpoint/rollback safety around irreversible actions during a session, also see `shepherd`.

Three failure modes this skill prevents:

1. **Re-reading.** Every new session rediscovers the same repository facts.
2. **Silent overflow.** The session degrades or truncates mid-task and loses decisions.
3. **Undocumented state.** Work cannot continue because the reasoning lived only in chat.

## Core Principle

```text
Load the smallest set of facts that makes the next action correct.
Write down anything a successor would otherwise have to rediscover.
Hand over before the window forces the decision.
```

Compression is not the goal. Retrievability is.

---

## Activation Triggers

Apply this skill when:

- A session spans more than a few tasks or is expected to resume later
- The repository is too large to read exhaustively
- The same files are read repeatedly across sessions
- Token cost, latency, or answer quality is degrading
- Work must be handed to another agent, another session, or a human
- A project memory, `AGENTS.md`, or equivalent context file is being written

---

# Workflow

## Phase 1: Inventory the Budget

Before loading anything, record:

| Slot | Content | Rough size | Refreshable? |
|---|---|---|---|
| Instructions | System prompt, skills, rules | fixed | no |
| Project memory | Durable repo facts | small | yes |
| Task state | Current goal, decisions, open questions | small | yes |
| Working set | Files being edited | medium | yes |
| Evidence | Command output, search results | volatile | yes |

Rules:

- Instructions and project memory must stay small enough to survive every turn.
- Evidence is the first thing discarded, so it must be summarized into task state
  before it is dropped.
- Never let the working set grow past the files actually being changed.

## Phase 2: Define the Load Policy

For each information need, choose the cheapest sufficient source:

| Need | Preferred source | Avoid |
|---|---|---|
| Where does X live | Symbol or path search | Reading directories |
| What does X do | Signature plus call sites | Whole-file read |
| How is X used | Grep for usages, bounded output | Recursive reads |
| Why is X this way | Decision record, commit message | Guessing from code |
| Full detail | Read only the relevant range | Read entire file |

Required behavior:

- Search before reading. Read ranges before reading files. Read files before reading trees.
- Never re-read a file already in context unless it changed.
- Cap command output; quote the shortest decisive lines.
- Prefer structured extraction (one pass producing a table) over many small reads.

## Phase 3: Build Durable Project Memory

Write repository facts once into a durable file that every session loads.

A project memory entry earns its place only if it is:

- Stable across sessions
- Not derivable from a single cheap command
- Load-bearing for future decisions

Include:

- Entry points, build, test, and lint commands
- Directory map with one line per meaningful area
- Non-obvious conventions and their reason
- Architectural decisions and rejected alternatives
- Known traps: flaky tests, generated files, forbidden edits

Exclude:

- Anything the code, README, or git history already states plainly
- Facts that expire quickly (branch names, in-flight work)
- Long code excerpts

Convert relative dates to absolute dates before writing.

## Phase 4: Retrieval Routing

When the repository exceeds what any session can hold:

1. Maintain an index keyed by symbol, path, and concept.
2. Route each question to the smallest index slice that answers it.
3. Return locations plus evidence lines, not whole files.
4. Refresh index entries when the underlying file changes, not on a timer.

Verify the index instead of trusting it: a stale index is worse than none, because
it produces confident wrong file paths. Confirm any location before editing it.

## Phase 5: Handover Before Overflow

Trigger a handover when any of the following is true:

- The window is roughly two thirds consumed
- Evidence is being dropped faster than it is summarized
- The task will clearly not finish in the current session

A handover package contains, in this order:

```markdown
## Goal
One sentence: what done looks like.

## State
What now works, verified how.

## Decisions
Each decision, its reason, and the rejected alternative.

## Open questions
Each question and who or what can answer it.

## Next action
One concrete step, with the exact file or command.
```

Never hand over a summary that drops a decision. A decision without its reason will
be re-litigated and reversed.

---

# Anti-Patterns

- Loading the whole repository "for context" before knowing the task
- Summarizing chat history instead of recording decisions
- Memory files that restate the README
- Index built once and never invalidated
- Treating a truncated session as a finished one
- Optimizing token count while increasing the number of round trips

---

# Verification

Before claiming a context plan works, verify:

- A fresh session can reach the first correct action using only the durable files
- Every claim in project memory is checked against the current repository
- The handover note names one next action, not a list of intentions
- No dropped evidence contained an unrecorded decision

Never claim a file was loaded, indexed, or verified when it was not.

---

# Required Final Output

```markdown
## Context Budget Result
Status: PLANNED | APPLIED | HANDOVER

### Budget allocation
- ...

### Load policy changes
- ...

### Durable memory written
- ...

### Dropped or deferred
- ...

### Next action
- ...
```

## Shared output profile

Compose the `plan` profile from [output-templates](../output-templates/references/components.md).
Lead with the allocation and the load policy, then durable memory, dropped context, and the next action.
Preserve stricter domain rules above, omit empty components, and never fill a component with invented evidence.
