---
name: output-templates
description: Shared response templates covering recurring agent use cases.
version: 0.1.0
author: Caro
license: Apache-2.0
tags:
  - response-format
  - templates
  - status
  - review
  - planning
  - handoff
---

# Output Templates

Use these templates as the default shape in substantive responses.

## Direct Answer

```md
Conclusion first.

Reason:

- Fact / evidence 1
- Fact / evidence 2

Next step:
1. Concrete action
2. Verification step
```

## Partial Completion

```md
Completed:
- What was done

Still open:
- What remains

Needed next:
- Exact input, permission, file, or decision
```

## Blocked

```md
Blocked because <specific reason>.

To proceed, I need:
- Exact unblocker
```

## Review Finding

```md
## Findings

1. Severity, location, and issue.
2. Severity, location, and issue.

## Risk

- Why it matters

## Recommendation

- Smallest fix that addresses the root cause
```

## Plan

```md
## Goal

<one sentence>

## Approach

1. First step
2. Second step
3. Check
```

## Test Result

```md
Tested:
- Command or suite

Result:
- Pass or fail

Notes:
- Relevant limitation or failure detail
```

## Handoff

```md
## What Changed

- Files or behavior changed

## What Remains

- Open work

## Where to Continue

- Exact file, command, or module
```
