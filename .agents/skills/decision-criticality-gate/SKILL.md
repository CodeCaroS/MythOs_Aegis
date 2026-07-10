---
name: decision-criticality-gate
description: >
  Classifies architecture, product, data, security, and agent-action decisions by
  reversibility, blast radius, trust impact, likelihood, severity, and detectability.
  Use before implementation, before autonomous tool execution, and whenever a decision
  could affect users, money, privacy, permissions, production systems, or shared foundations.
version: 1.0.0
author: Caro
license: Apache-2.0
tags:
  - risk-assessment
  - decision-gating
  - architecture
  - security
  - product
  - data
  - autonomy
triggers:
  - decision criticality gate
  - criticality gate
  - assess decision risk
  - evaluate decision impact
  - should this be reviewed
  - autonomous action review
capabilities:
  - risk-classification
  - escalation-decision
  - autonomy-limiting
  - evidence-checking
  - review-requirements
outputs:
  - markdown
  - risk-gate-decision
  - review-requirements
requires:
  - repository-access
constraints:
  read_only_by_default: true
  require_evidence_for_findings: true
  require_approval_before_implementation: true
---

# Decision Criticality Gate

## Purpose

Classify how careful a decision must be before the agent acts.

Use this skill for architecture choices, product decisions, data changes, security-adjacent changes, and any agent action that could affect users, money, privacy, permissions, production systems, or shared foundations.

This skill does not decide whether an idea is good. It decides:

1. how hard the decision is to reverse,
2. how wide the impact is,
3. how much trust it affects,
4. how likely failure is,
5. how severe the failure would be,
6. how easy failure would be to detect,
7. whether the agent may act autonomously.

## Core Rule

The harder a decision is to reverse, the wider its blast radius, and the more trust it can damage, the stronger the required review and safeguards.

## Score Every Dimension

Score each dimension from `0` to `2`.

### 1. Reversibility

- `0` easy to reverse
- `1` costly to reverse
- `2` difficult or effectively irreversible

### 2. Blast Radius

- `0` isolated
- `1` multi-component
- `2` system-wide

### 3. Trust Impact

- `0` low trust sensitivity
- `1` moderate trust sensitivity
- `2` high trust sensitivity

### 4. Likelihood

- `0` hypothetical
- `1` plausible
- `2` likely or observed

### 5. Severity

- `0` minor
- `1` significant
- `2` critical

### 6. Detectability

- `0` immediately visible
- `1` delayed or indirect
- `2` silent or difficult to detect

## Score

```text
criticality_score = reversibility + blast_radius + trust_impact + likelihood + severity + detectability
```

Maximum score: `12`.

## Risk Levels

### Level 1

Score `0-3`.

Default controls:

- proceed normally,
- standard tests,
- normal code review,
- basic observability.

Autonomy:

- allowed inside existing permissions.

### Level 2

Score `4-6`.

Default controls:

- short implementation plan,
- acceptance criteria,
- rollback path if practical,
- relevant automated tests,
- post-change verification.

Autonomy:

- may implement reversible internal actions,
- ask before externally visible destructive execution.

### Level 3

Score `7-9`.

Default controls:

- ADR or equivalent decision note,
- alternatives analysis,
- rollout and rollback plan,
- testing evidence,
- named human reviewer.

Autonomy:

- may analyze, design, and prepare changes,
- must not execute destructive, externally visible, or permission-changing actions without approval.

### Level 4

Score `10-12`.

Default controls:

- architecture review,
- security review where relevant,
- human approval,
- least-privilege enforcement,
- no autonomous execution,
- explicit approval for the exact action, scope, target, and expected effect.

## Hard Escalation Rules

Force at least `Level 3` if the decision:

- modifies authentication,
- modifies authorization,
- changes tenant isolation,
- handles secrets or credentials,
- changes production data ownership,
- introduces a new externally accessible endpoint,
- sends customer-facing communication automatically,
- changes public API contracts,
- performs bulk data migration,
- introduces new AI agent tool write access.

Force `Level 4` if the decision:

- enables cross-tenant data access,
- moves money,
- accepts a binding contract,
- deletes data irreversibly without verified recovery,
- escalates permissions autonomously,
- deploys to production across the full system autonomously,
- discloses sensitive or regulated information,
- changes core auditability,
- disables security controls,
- executes untrusted input,
- could materially harm a person or organization.

## Agent Output

When this skill triggers, produce:

- the score for each dimension,
- the total criticality score,
- the resulting level,
- the required controls,
- any hard escalation rule that applies,
- the minimum safe next step.

If evidence is missing, say so plainly and label the assumption.

## Operating Rule

Do not spend equal effort on every decision.

Move quickly on low-risk, reversible choices.

Slow down when the decision is irreversible, system-wide, trust-sensitive, severe, likely, or hard to detect.
