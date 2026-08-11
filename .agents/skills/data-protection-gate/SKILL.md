---
name: data-protection-gate
description: >
  Reviews features, data flows, and AI integrations for privacy by design: lawful
  basis, data minimization, retention and deletion, transparency, third-party and
  cross-border transfers, subject rights, and logging hygiene. Use before shipping
  anything that collects, stores, infers, or forwards personal data.
version: 1.0.0
author: Caro
license: Apache-2.0
overlaps_with: [pre-launch-security-gate]
tags:
  - privacy
  - gdpr
  - data-protection
  - data-minimization
  - retention
  - subject-rights
  - third-party-transfer
  - ai-act
  - logging-hygiene
triggers:
  - privacy review
  - gdpr check
  - data protection gate
  - is this compliant
  - we collect user data
  - send data to a third-party api
  - retention and deletion policy
  - handle a deletion request
capabilities:
  - data-inventory
  - lawful-basis-review
  - minimization-review
  - retention-review
  - transfer-review
  - subject-rights-review
outputs:
  - markdown
  - privacy-review
  - data-inventory
  - gate-decision
requires:
  - repository-access
constraints:
  read_only_by_default: true
  not_legal_advice: true
  require_evidence_for_findings: true
---

# Data Protection Gate

## Purpose

Make privacy a design constraint checked in code, not a policy document written after launch.

This skill produces an engineering review. It is not legal advice, and it does not
replace a data protection officer or counsel. Findings are stated so a lawyer can act
on them, and legal questions are raised as questions rather than answered.

## Core Principle

```text
For every personal data element, name: why it exists, what permits it,
how long it stays, who else sees it, and how it is deleted.
Data you never collected cannot leak, cannot be subpoenaed, and cannot be deleted wrongly.
```

---

## Activation Triggers

Apply this skill when a change involves:

- Collecting, inferring, or enriching data about a person
- Analytics, tracking, session recording, or A/B testing
- Sending data to a third party, including an AI provider
- Model training, fine-tuning, or evaluation on user content
- Logging, telemetry, crash reports, or error tracking
- Export, backup, replication, or a new storage region
- Account deletion, deactivation, or data export
- Cookies, consent, or a new banner

---

# Workflow

## Phase 1: Data Inventory

Nothing else proceeds until this table exists for the change under review:

| Element | Category | Source | Purpose | Basis | Retention | Recipients | Location |
|---|---|---|---|---|---|---|---|
| Email | Identifier | User input | Login, notices | Contract | Account life + 30d | Mail provider | EU |
| IP address | Identifier | Request | Abuse control | Legitimate interest | 7 days | None | EU |
| Chat message | Content | User input | Feature delivery | Contract | 12 months | Model provider | US |

Mark separately any element that is a special category (health, biometric, religion,
politics, sexual orientation, trade-union membership, ethnicity) or relates to children.
Those require a stricter basis and usually a documented assessment before the feature exists.

Rules:

- One row per element. "User profile" is not an element.
- Inferred and derived data is personal data. Score, segment, and embedding all count.
- If a purpose cannot be stated in one sentence, the collection is not justified.

## Phase 2: Minimization

Verify, per element:

- It is necessary for the stated purpose, not merely useful later
- The least identifying form that works is used: aggregate, pseudonym, hash with
  a secret salt, coarse value, or truncation
- Free-text fields that invite sensitive input are avoided or labeled
- The precision is bounded: coarse location instead of exact, age band instead of birth date
- Where identity is not required, it is not collected

Reject:

- "Collect now, decide later"
- Full request or response bodies captured wholesale into logs or analytics
- Unique device or user identifiers used where a rotating session identifier suffices
- Hashing treated as anonymization. A hash of an identifier is still personal data.

## Phase 3: Lawful Basis and Consent

Verify:

- Each purpose has exactly one basis, and it is written down
- Consent, where used, is specific, informed, unbundled, and as easy to withdraw as to give
- Nothing non-essential runs before consent, including analytics scripts and network calls
- Withdrawing consent stops future processing and triggers deletion where the basis was consent
- Legitimate interest, where used, has a recorded balancing test naming the interest,
  the necessity, and the user's expectation
- The basis for a secondary purpose (analytics, training, personalization) is separate
  from the basis for the primary feature

## Phase 4: Retention and Deletion

Verify:

- Every element has a defined retention period, and the period is enforced by a job,
  a policy, or a TTL — not by intention
- Deletion is verified in every location: primary store, replicas, caches, search
  indexes, queues, object storage, exports, analytics, third parties, and backups
- Backup behavior is stated explicitly: if backups cannot be edited, the retention of
  backups is documented and bounded
- Account deletion covers derived data: embeddings, model artifacts, aggregates that
  can re-identify, and prompt or conversation history
- Deletion is distinguished from deactivation, and soft-deleted rows are excluded from
  every query path, including analytics and admin views
- Logs age out on a stated schedule

## Phase 5: Third Parties, AI Providers, and Transfers

Verify, per recipient:

- What exactly is sent — field by field, not "the request"
- Whether the recipient may retain it, and for how long
- Whether the recipient may train on it, and whether that is switched off
- Where it is processed, and what covers a cross-border transfer
- Whether a processing agreement exists
- Whether the recipient appears in user-facing transparency documentation
- What happens on the recipient's outage, and whether failure leaks data into logs

For AI features specifically:

- Redact or minimize prompts before sending. Do not forward whole records to obtain one field.
- Never send credentials, tokens, or special-category data into a prompt.
- Model output about a person is personal data and inherits the same retention rules.
- Where a decision materially affects a person, record how a human can review it and how
  the user is informed. Automated decisions with legal or similarly significant effects
  need an explicit route to human intervention.
- Keep a record of which model version and which prompt produced a stored inference.

## Phase 6: Subject Rights

Verify each right is implemented as a working path, not a mailbox:

| Right | Requirement |
|---|---|
| Access | Export all elements for one person, including derived data |
| Rectification | Correction propagates to caches, indexes, and downstream copies |
| Erasure | Verified deletion, per Phase 4 |
| Portability | Machine-readable, structured, common format |
| Objection / restriction | Processing genuinely stops, not just hides in the UI |
| Withdrawal | As easy as granting, with a stated effect |

Verify the response path is bounded in time and that a request can be authenticated
without collecting more data than the request itself.

## Phase 7: Logging and Exposure Hygiene

Verify:

- No credentials, tokens, session identifiers, or full payloads in logs
- Personal data in logs is minimized, redacted at the logging boundary, and short-lived
- Error messages and stack traces sent to clients contain no personal data
- Analytics events carry no free-text personal content
- Screenshots, session replays, and support tooling mask sensitive fields
- Access to personal data is authorized and audited, including internal admin tooling
- Data in URLs, query strings, and referrers is avoided entirely

---

# Findings Format

Severity (BLOCKER here corresponds to Critical in the shared severity ladder in [output-templates](../output-templates/references/components.md)):

- `BLOCKER`: Unlawful basis, undeleted data after erasure, special-category data without
  a basis, personal data sent to an unassessed third party, secrets or personal data in logs
- `HIGH`: Missing retention enforcement, unbounded collection, missing subject-right path
- `MEDIUM`: Excess precision, weak minimization, undocumented transfer detail
- `LOW`: Documentation or transparency gap with no processing impact

```markdown
## Privacy Finding: <title>
Severity: BLOCKER | HIGH | MEDIUM | LOW

### Evidence
- File and location, data element, flow

### Impact
What is processed, by whom, for how long, and why that is a problem.

### Required fix
Smallest complete fix at the correct layer.

### Verification
The check or test that proves the fix.

### Legal question (if any)
Stated as a question for counsel, not answered here.
```

---

# Gate Decision

Do not approve while any of these hold:

- An element in the inventory lacks a purpose, a basis, or a retention period
- Deletion is claimed but not verified in every store, index, cache, and third party
- Non-essential processing runs before consent
- Personal data reaches a third party or AI provider without an assessed, documented flow
- Special-category or children's data is processed without an explicit documented basis
- Secrets or personal data appear in logs or error responses
- A subject right has no working implementation path

---

# Required Final Output

```markdown
## Data Protection Gate Result
Status: PASS | PASS WITH WARNINGS | FAIL

### Scope reviewed
- ...

### Data inventory
| Element | Category | Purpose | Basis | Retention | Recipients | Location |

### Findings
- ...

### Verified controls
- Minimization: ...
- Retention and deletion: ...
- Transfers and AI providers: ...
- Subject rights: ...
- Logging hygiene: ...

### Open legal questions
- ...

### Decision
- ...
```

A `PASS` requires evidence. Absence of discovered issues is not proof of compliance,
and this review does not constitute legal advice.

## Shared output profile

Compose the `review` profile from [output-templates](../output-templates/references/components.md).
Lead with the gate decision, then the data inventory, findings, verified controls, and open legal questions.
Preserve stricter domain rules above, omit empty components, and never fill a component with invented evidence.
