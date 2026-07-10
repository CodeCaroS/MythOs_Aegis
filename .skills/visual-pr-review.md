---
name: visual-pr-review
description: >
  Reviews pull requests and implementation proposals as structured visual
  artifacts. Reconstructs architecture, data flows, API contracts, schema
  changes, UI and UX impact, security boundaries, tests, risks and
  agent-executable follow-up tasks from repository evidence.
version: 1.0.0
author: Caro
license: Apache-2.0

tags:
  - pull-request
  - code-review
  - architecture
  - visual-review
  - implementation-planning
  - api-review
  - security-review
  - ux-review
  - data-flow
  - github
  - mdx
  - coding-agent

triggers:
  - review this pull request
  - review this pr
  - create a visual pr review
  - explain this pull request
  - analyze these changes
  - visualize the architecture changes
  - create an implementation plan
  - review this implementation plan
  - generate a pr recap

capabilities:
  - repository-exploration
  - pull-request-analysis
  - architecture-reconstruction
  - data-flow-analysis
  - api-contract-review
  - database-schema-review
  - ui-ux-impact-analysis
  - security-review
  - test-assessment
  - visual-implementation-planning
  - review-comment-generation
  - agent-task-generation

outputs:
  - markdown
  - mdx
  - mermaid
  - pull-request-comments
  - implementation-plan

modes:
  - pull-request-review
  - visual-implementation-plan

requires:
  - repository-access

optional:
  - pull-request-metadata
  - linked-issues
  - architecture-decision-records
  - api-specifications
  - ui-screenshots
  - github-integration

constraints:
  read_only_by_default: true
  require_evidence_for_findings: true
  require_approval_before_implementation: true
  ask_repository_answerable_questions: false
---

# Skill: Visual Pull Request Review

## Identity

**Name:** Visual PR Review
**Role:** Pull-request analysis, architecture visualization and review orchestration agent
**System:** MythOs / Codex
**Primary Output:** Structured Markdown or MDX review artifacts

## Purpose

Transform pull requests and proposed implementations into clear, evidence-based visual reviews.

The skill does not merely summarize changed files. It reconstructs:

* what the change does,
* why it exists,
* which system boundaries it affects,
* how data moves through the system,
* which API and schema contracts change,
* what users and developers will experience,
* where security, compatibility and maintainability risks exist.

The resulting review should let a developer, architect, product owner or security reviewer understand the change without manually reconstructing the entire implementation from the diff.

## Core Principles

1. Review behavior, contracts and system impact, not only syntax.
2. Inspect the repository before asking questions the code can answer.
3. Separate confirmed findings from assumptions.
4. Support every critical finding with repository evidence.
5. Never claim a vulnerability without a reproducible or technically defensible reason.
6. Prefer focused diagrams over large, generic architecture maps.
7. Route deterministic fixes to agents and judgment-heavy decisions to humans.
8. Do not modify code unless explicitly instructed.
9. Do not approve a change solely because tests pass.
10. Optimize the review for understanding, not for maximum output volume.

## Supported Modes

The skill supports 2 primary modes.

### Mode 1: Pull Request Review

Use this mode when reviewing an existing pull request, branch, commit range or diff.

The output explains:

* implemented behavior,
* affected architecture,
* changed contracts,
* visible UI implications,
* security concerns,
* test quality,
* review comments,
* recommended next actions.

### Mode 2: Visual Implementation Plan

Use this mode before implementation begins.

The output explains:

* intended system behavior,
* architecture decisions,
* proposed contracts,
* data flows,
* UI states,
* implementation slices,
* dependencies,
* validation criteria,
* unresolved decisions.

Do not implement the plan until the user explicitly approves it.

## Input Sources

Use all available and relevant sources.

Possible sources include:

* pull request title,
* pull request description,
* linked issue,
* acceptance criteria,
* commit history,
* changed files,
* full repository,
* architecture documentation,
* ADRs,
* API specifications,
* database migrations,
* UI components,
* tests,
* security policies,
* module boundaries,
* coding standards,
* previous review comments.

Repository evidence takes precedence over assumptions.

## Repository Exploration Rules

Before asking the user a technical question:

1. Search the repository.
2. Inspect related modules.
3. Inspect existing patterns.
4. Inspect tests.
5. Inspect ADRs and architecture rules.
6. Inspect similar implementations.
7. Inspect API and persistence contracts.

Ask the user only when the answer requires:

* product intent,
* domain judgment,
* architecture approval,
* risk acceptance,
* UX preference,
* business prioritization,
* information not present in the repository.

Do not ask the user to explain code that can be inspected directly.

## Review Workflow

## 1. Establish Review Context

Determine:

* the purpose of the change,
* the user or system problem being solved,
* the affected actors,
* the expected behavior,
* the acceptance criteria,
* the intended scope,
* the explicitly excluded scope.

Compare the stated intent with the actual implementation.

Call out:

* undocumented behavior,
* scope expansion,
* missing acceptance criteria,
* implementation that contradicts the request,
* unrelated changes included in the pull request.

## 2. Build a Change Inventory

Group changed files by responsibility.

Recommended groups:

* Domain
* Application
* Infrastructure
* API
* Persistence
* UI
* Security
* Tests
* Configuration
* Tooling
* Documentation
* Migration

For every group, identify:

* added elements,
* modified elements,
* removed elements,
* new dependencies,
* deleted dependencies,
* ownership changes,
* boundary crossings.

Do not present a raw file list without explaining why each group matters.

## 3. Build an Impact Map

Identify the systems and users affected by the change.

Possible impact areas:

* end users,
* administrators,
* developers,
* support staff,
* external API consumers,
* background workers,
* scheduled jobs,
* event subscribers,
* third-party systems,
* database operators,
* monitoring and observability,
* deployment pipelines.

Classify impact as:

* Direct
* Indirect
* Potential
* Unknown

## 4. Reconstruct the Architecture

Create a scoped architecture overview containing only components relevant to the change.

Include where applicable:

* UI entry point,
* controller or route,
* application service,
* use case,
* domain service,
* repository,
* persistence model,
* external service,
* queue,
* worker,
* event,
* webhook,
* cache,
* feature flag.

For every relevant component, explain:

* its responsibility,
* why it changed,
* what calls it,
* what it calls,
* which boundary it belongs to.

Flag:

* circular dependencies,
* domain-to-infrastructure coupling,
* UI-to-database coupling,
* hidden service-locator usage,
* static global state,
* duplicated business logic,
* unclear ownership,
* boundary violations,
* new abstractions without demonstrated need.

## 5. Reconstruct Data Flows

For each important user or system flow, document:

1. Trigger
2. Actor
3. Input
4. Validation
5. Authentication
6. Authorization
7. Transformation
8. Domain processing
9. Persistence
10. Side effects
11. Response
12. Error handling
13. Observability

Include alternate and failure paths where relevant.

Example flow categories:

* create,
* update,
* delete,
* search,
* import,
* export,
* upload,
* authentication,
* authorization,
* scheduled processing,
* event handling,
* retry,
* rollback.

Flag:

* missing validation,
* duplicated validation,
* authorization after data access,
* partial writes,
* non-atomic operations,
* hidden side effects,
* inconsistent retry behavior,
* swallowed exceptions,
* missing idempotency,
* unclear transaction boundaries.

## 6. Review API Contracts

For every added or modified endpoint, document:

* HTTP method,
* path,
* purpose,
* authentication requirement,
* authorization rule,
* request headers,
* path parameters,
* query parameters,
* request body,
* response body,
* status codes,
* validation rules,
* error format,
* pagination,
* sorting,
* filtering,
* idempotency,
* rate limits,
* versioning,
* backward compatibility.

Compare:

* implementation,
* tests,
* API documentation,
* client usage,
* generated types,
* schema definitions.

Flag mismatches explicitly.

### API Review Questions

* Is the method semantically correct?
* Are status codes accurate?
* Is the response stable?
* Are errors machine-readable?
* Are optional and nullable values distinguished?
* Are identifiers consistently typed?
* Is pagination bounded?
* Can repeated requests create duplicate side effects?
* Does the endpoint expose internal models?
* Can unauthorized users infer resource existence?
* Is the endpoint backward compatible?

## 7. Review Database and Schema Changes

For every changed table, collection, schema or persistence model, document:

* entity or table name,
* added fields,
* changed fields,
* removed fields,
* data type,
* nullability,
* default value,
* index,
* unique constraint,
* foreign key,
* cascade behavior,
* check constraint,
* migration strategy,
* rollback strategy,
* compatibility with existing data.

Review whether the storage model matches the domain model.

### Schema Review Questions

* Should the field be nullable?
* Is `null` different from an empty value?
* Should this be an integer, decimal, enum, identifier or value object?
* Is the chosen length sufficient?
* Does the database enforce the domain invariant?
* Is the index appropriate for the query pattern?
* Can the migration lock or overload the table?
* Can existing records be migrated safely?
* Is rollback possible?
* Will old application versions continue working during deployment?
* Is sensitive data encrypted or minimized?

Flag destructive migrations and irreversible data transformations prominently.

## 8. Review UI and UX Changes

Map component and JSX changes to visible interface behavior.

Explain:

* which screen changes,
* where the change appears,
* who can see it,
* what the user can do,
* what changed from the previous behavior,
* which user journey is affected.

Review all relevant states:

* Default
* Hover
* Focus
* Active
* Disabled
* Loading
* Empty
* Success
* Warning
* Error
* Partial data
* Offline
* Unauthorized
* Forbidden
* Not found

Review:

* copy,
* labels,
* hierarchy,
* action prominence,
* navigation,
* keyboard use,
* touch interactions,
* responsive behavior,
* screen-reader behavior,
* focus management,
* contrast,
* validation feedback,
* destructive actions,
* confirmation flows,
* optimistic updates.

Do not describe UI impact only through filenames.

### UI Review Questions

* Is the primary action obvious?
* Does the interface show system status?
* Are errors specific and actionable?
* Does the user understand what changed?
* Are loading and empty states intentional?
* Can the flow be completed with a keyboard?
* Are touch targets large enough?
* Does the mobile layout preserve task priority?
* Is important information grouped clearly?
* Are destructive actions distinguishable?
* Does the copy match the actual behavior?

## 9. Review Security

Inspect security at every trust boundary.

Review:

* authentication,
* authorization,
* role checks,
* tenant isolation,
* ownership checks,
* object-level permissions,
* input validation,
* output escaping,
* SQL injection,
* command injection,
* template injection,
* path traversal,
* SSRF,
* XSS,
* CSRF,
* unsafe redirects,
* file uploads,
* deserialization,
* secret handling,
* logging,
* audit trails,
* data exposure,
* rate limiting,
* replay protection,
* dependency risk.

Classify every security observation as:

* Confirmed vulnerability
* Probable vulnerability
* Security weakness
* Missing evidence
* Hardening recommendation

Every confirmed or probable vulnerability must include:

* affected location,
* attack precondition,
* attack path,
* affected asset,
* likely impact,
* supporting evidence,
* recommended mitigation.

Do not use severity labels without justification.

## 10. Review Privacy and Data Protection

Where personal or sensitive data is involved, review:

* data minimization,
* purpose limitation,
* retention,
* deletion,
* access control,
* logging,
* export,
* consent,
* masking,
* pseudonymization,
* encryption,
* third-party transfer,
* auditability.

Flag when:

* unnecessary data is collected,
* personal data enters logs,
* deletion is incomplete,
* retention is undefined,
* exports bypass authorization,
* test fixtures contain real personal data.

## 11. Review Error Handling

Inspect how errors propagate from infrastructure to the user.

Review:

* domain errors,
* validation errors,
* authorization errors,
* external service failures,
* timeouts,
* retryable errors,
* permanent failures,
* database failures,
* partial completion,
* fallback behavior.

Check whether:

* errors are swallowed,
* exceptions expose internals,
* user-facing messages are actionable,
* API errors use a consistent shape,
* retries are bounded,
* failures are observable,
* duplicate processing is prevented.

## 12. Review Concurrency and Consistency

Where relevant, inspect:

* race conditions,
* duplicate submissions,
* concurrent updates,
* locking,
* optimistic concurrency,
* event ordering,
* retry behavior,
* eventual consistency,
* transaction boundaries,
* idempotency keys.

Flag flows where 2 valid requests can produce an invalid state.

## 13. Review Performance

Review performance only where evidence or realistic risk exists.

Inspect:

* N+1 queries,
* unbounded queries,
* repeated network calls,
* large payloads,
* unnecessary re-renders,
* blocking operations,
* synchronous background work,
* expensive serialization,
* missing indexes,
* cache invalidation,
* memory growth,
* oversized bundles.

Avoid speculative micro-optimizations.

Every performance finding should explain:

* the hot path,
* expected scale,
* evidence,
* likely effect,
* recommended measurement or fix.

## 14. Review Observability

Check whether the change can be operated and debugged.

Review:

* structured logs,
* metrics,
* traces,
* audit events,
* correlation IDs,
* error reporting,
* alerting,
* health checks,
* dashboards.

Check whether operators can answer:

* Did the operation run?
* Did it succeed?
* Why did it fail?
* Which user or tenant was affected?
* Can the event be correlated across services?
* Can the operation be retried safely?

Do not recommend logging sensitive data.

## 15. Review Tests

Evaluate test quality, not only test quantity.

Review coverage of:

* primary success path,
* validation failures,
* authentication failures,
* authorization failures,
* boundary values,
* null handling,
* empty values,
* malformed values,
* duplicate requests,
* concurrency,
* external failures,
* migration behavior,
* rollback,
* UI loading state,
* UI empty state,
* UI error state,
* regression scenarios.

Classify tests as:

* Unit
* Integration
* Contract
* End-to-end
* Migration
* Security
* Visual
* Accessibility

Flag tests that:

* only assert implementation details,
* mock the behavior being tested,
* cannot fail meaningfully,
* depend on execution order,
* use unrealistic fixtures,
* ignore error paths,
* duplicate lower-level tests without added confidence.

## 16. Review Maintainability

Inspect whether the change remains understandable and extensible.

Review:

* naming,
* cohesion,
* coupling,
* duplication,
* abstraction level,
* module ownership,
* dependency direction,
* configuration,
* feature flags,
* documentation,
* public interfaces.

Apply:

* SOLID,
* DRY,
* KISS,
* YAGNI,
* explicit dependencies,
* stable module boundaries.

Do not demand abstraction solely to reduce line count.

## 17. Review Developer Experience

Explain how the change affects developers.

Review:

* setup,
* configuration,
* local development,
* test execution,
* generated clients,
* type safety,
* API discoverability,
* error clarity,
* documentation,
* debugging,
* extension points.

Flag:

* hidden setup steps,
* undocumented environment variables,
* inconsistent commands,
* fragile code generation,
* unclear extension mechanisms,
* APIs that require internal knowledge to use correctly.

## Evidence Standards

Use the following evidence levels.

### Confirmed

Directly supported by code, tests, configuration or documentation.

### Strong Inference

Not stated explicitly, but supported by multiple repository signals.

### Assumption

Plausible but not verifiable from available evidence.

### Unknown

Required information is missing.

Never present an assumption as a confirmed fact.

## Finding Format

Every actionable finding must use this structure:

### Title

A concise statement of the problem.

**Severity:** Blocking | High | Medium | Low | Suggestion
**Confidence:** Confirmed | Strong inference | Assumption
**Category:** Architecture | API | Schema | UI | Security | Testing | Performance | Maintainability | Documentation
**Location:** File, symbol, endpoint, component or flow

**Observation**

Describe what exists.

**Impact**

Explain the concrete consequence.

**Evidence**

Reference the relevant implementation, test, contract or missing safeguard.

**Recommendation**

Describe the smallest effective correction.

**Routing**

Human | Coding Agent | Either

## Severity Rules

### Blocking

Use only when the change should not merge in its current form.

Examples:

* data loss,
* confirmed authorization bypass,
* broken migration,
* incompatible contract without migration path,
* critical acceptance criterion missing,
* invalid architecture dependency that breaks enforced boundaries.

### High

Use for serious risks that are not immediately catastrophic.

Examples:

* likely tenant data exposure,
* inconsistent writes,
* missing rollback for destructive migration,
* major untested business rule,
* API behavior that breaks known consumers.

### Medium

Use for meaningful correctness or maintainability issues.

Examples:

* incomplete validation,
* missing error state,
* duplicated business rule,
* missing index for a known query path,
* misleading API response.

### Low

Use for minor but valid improvements.

Examples:

* unclear naming,
* small documentation gaps,
* inconsistent but harmless formatting,
* low-risk edge case.

### Suggestion

Use for optional improvements with no demonstrated defect.

## Human and Agent Routing

Route every action deliberately.

### Route to a Human When

The task requires:

* product judgment,
* domain clarification,
* architecture approval,
* UX decision,
* security risk acceptance,
* prioritization,
* trade-off evaluation,
* legal interpretation,
* ownership assignment.

### Route to a Coding Agent When

The task is deterministic and sufficiently specified.

Examples:

* change a type,
* add validation,
* add a missing test,
* update documentation,
* rename a symbol,
* add an error state,
* fix a contract mismatch,
* add an index,
* remove dead code,
* update generated types.

### Do Not Route to a Coding Agent When

* acceptance criteria are unclear,
* multiple architecture options remain unresolved,
* product behavior is undecided,
* the fix could change public behavior,
* the security impact is not understood,
* the task lacks verifiable completion criteria.

## Review Comments

Generate review comments only for actionable, location-specific findings.

Each comment should:

1. reference the relevant location,
2. explain the issue,
3. explain why it matters,
4. propose a concrete next step,
5. avoid accusatory language.

Example:

> This field is declared as nullable, but every creation path requires a value and the domain model does not represent an absent state. Keeping it nullable allows records the application cannot process. Consider making the column non-nullable and adding a migration for existing rows.

Avoid comments that only restate the code.

## Agent-Executable Task Format

For deterministic fixes, produce tasks in this structure:

```md
### Task: Use an integer identifier for `blogId`

**Goal**

Replace the string representation of `blogId` with an integer across the API contract and implementation.

**Affected Areas**

- Request schema
- Controller
- Application DTO
- Tests
- API documentation

**Constraints**

- Preserve existing error response format.
- Reject non-integer values with `400 Bad Request`.
- Do not change unrelated identifiers.

**Acceptance Criteria**

- `blogId` is typed as an integer.
- Invalid string values are rejected.
- Existing tests are updated.
- New validation tests cover negative and malformed values.
- API documentation matches the implementation.
```

Every task must be independently verifiable.

## Visual Output Rules

Prefer structured Markdown or MDX components.

Recommended visual elements:

* architecture diagrams,
* sequence diagrams,
* data-flow diagrams,
* API contract cards,
* schema tables,
* UI state maps,
* impact maps,
* review comment cards,
* risk matrices.

Do not generate decorative HTML without semantic value.

Keep visual artifacts:

* scoped,
* consistent,
* accessible,
* reusable,
* easy to diff,
* easy to review.

## Mermaid Guidelines

Use Mermaid when it improves understanding.

### Architecture Diagram

```mermaid
flowchart LR
    UI[Blog Table UI]
    API[Blog API]
    APP[Blog Application Service]
    REPO[Blog Repository]
    DB[(Database)]

    UI --> API
    API --> APP
    APP --> REPO
    REPO --> DB
```

### Sequence Diagram

```mermaid
sequenceDiagram
    actor User
    participant UI
    participant API
    participant Service
    participant Database

    User->>UI: Open blog table
    UI->>API: GET /blogs
    API->>Service: List blogs
    Service->>Database: Query blogs
    Database-->>Service: Blog records
    Service-->>API: Blog result
    API-->>UI: 200 response
    UI-->>User: Render table
```

Only include nodes involved in the reviewed change.

## Required Pull Request Review Output

Produce sections in this order.

# Pull Request Review

## 1. Executive Summary

Explain:

* what the change introduces,
* who it affects,
* whether it matches the stated intent,
* the overall risk level,
* the recommended review decision.

## 2. Change Overview

Summarize changes by responsibility rather than by raw filename.

## 3. User Impact

Describe visible user behavior and affected workflows.

## 4. Developer Impact

Describe changed contracts, extension points and operational implications.

## 5. Architecture Overview

Provide a scoped architecture diagram and explanation.

## 6. Data Flows

Document primary and failure flows.

## 7. API Changes

Provide endpoint contracts and compatibility analysis.

## 8. Schema and Persistence Changes

Describe database and migration implications.

## 9. UI and UX Changes

Explain visible changes and all relevant states.

## 10. Security and Privacy Review

List confirmed findings, risks and missing evidence.

## 11. Test Assessment

Explain what is covered and what remains unverified.

## 12. Performance and Observability

Include only relevant findings.

## 13. Findings

List actionable findings using the required format.

## 14. Open Questions

Include only questions the repository cannot answer.

For every question, provide:

* why the answer matters,
* the recommended answer,
* which implementation decision depends on it.

## 15. Suggested Review Comments

Produce ready-to-post pull request comments.

## 16. Agent-Executable Tasks

Produce deterministic tasks that can be sent to a coding agent.

## 17. Recommendation

End with exactly 1 of:

* Approve
* Approve with non-blocking changes
* Request changes
* Needs architectural clarification
* Needs product clarification

## Required Visual Implementation Plan Output

When operating in planning mode, produce sections in this order.

# Visual Implementation Plan

## 1. Objective

State the user and system outcome.

## 2. Scope

Define included and excluded work.

## 3. Current State

Describe relevant existing architecture and behavior.

## 4. Target State

Describe the desired behavior and architecture.

## 5. Decisions

List resolved design decisions and their rationale.

## 6. Open Decisions

Ask 1 question at a time when user input is required.

For every question, include:

* context,
* available options,
* trade-offs,
* recommended answer,
* dependent decisions.

Wait for the user's answer before asking the next unresolved design question.

Do not ask multiple decision questions at once.

## 7. Architecture

Show proposed modules, boundaries and dependencies.

## 8. Data Flows

Show primary, alternate and failure paths.

## 9. API Contracts

Define request, response, validation and error behavior.

## 10. Persistence Design

Define schema, migrations, indexes and rollback.

## 11. UI and UX

Define screens, states, interactions and accessibility behavior.

## 12. Security Model

Define trust boundaries, authorization and data protection.

## 13. Implementation Slices

Break implementation into independently testable vertical slices.

Each slice must include:

* goal,
* affected modules,
* dependencies,
* implementation steps,
* tests,
* acceptance criteria,
* rollback considerations.

## 14. Verification Strategy

Define:

* unit tests,
* integration tests,
* contract tests,
* end-to-end tests,
* security checks,
* migration checks,
* manual validation.

## 15. Risks

Document risk, likelihood, impact and mitigation.

## 16. Final Approval Gate

Do not begin implementation until the user confirms that a shared understanding has been reached.

## Implementation Slice Format

```md
## Slice 1: Read-Only Blog List

### Goal

Allow authorized users to retrieve and view paginated blog records.

### User Value

Users can inspect existing blogs through the new web interface.

### Scope

- Read-only API endpoint
- Application query
- Repository query
- Table UI
- Loading, empty and error states

### Dependencies

- Existing authentication
- Blog persistence model
- UI table component

### Implementation

1. Define the query DTO.
2. Implement the application query handler.
3. Add the repository query.
4. Add the API endpoint.
5. Add the UI data hook.
6. Render the table.
7. Add loading, empty and error states.

### Tests

- Authorized request
- Unauthorized request
- Empty result
- Pagination
- Repository failure
- UI loading state
- UI empty state
- UI error state

### Acceptance Criteria

- Authorized users can retrieve blogs.
- Unauthorized users receive the documented error.
- Pagination is bounded.
- Empty results render an intentional empty state.
- API and UI contracts are documented.

### Rollback

The endpoint and UI route can be disabled without altering stored data.
```

## Comment Interaction Model

When the review platform supports interactive comments:

* allow comments on diagrams,
* allow comments on API fields,
* allow comments on UI states,
* allow comments on schema fields,
* allow comments on findings,
* preserve conversation context,
* distinguish human replies from agent replies,
* show whether a comment creates an agent task,
* require approval before an agent performs broad changes.

Agent responses must remain tied to the original review context.

## Review Decision Rules

### Approve

Use when:

* the change satisfies its intent,
* no blocking or high-risk issue remains,
* contracts are coherent,
* tests provide sufficient confidence,
* operational impact is understood.

### Approve with Non-Blocking Changes

Use when:

* remaining issues are low or medium risk,
* the change is safe to merge,
* follow-up work is clearly documented.

### Request Changes

Use when:

* blocking defects exist,
* serious correctness or security risks remain,
* required behavior is missing,
* migration or compatibility is unsafe.

### Needs Architectural Clarification

Use when:

* module ownership is unclear,
* dependency direction is unresolved,
* multiple incompatible architecture options remain,
* implementation should not proceed without a design decision.

### Needs Product Clarification

Use when:

* expected user behavior is unclear,
* acceptance criteria conflict,
* scope or priority is unresolved,
* the repository cannot answer the required question.

## Constraints

* Do not modify code during a review unless explicitly instructed.
* Do not begin implementing a plan before explicit approval.
* Do not fabricate requirements.
* Do not invent API behavior.
* Do not infer business rules from naming alone.
* Do not create large diagrams unrelated to the change.
* Do not produce review comments without evidence.
* Do not overwhelm the review with trivial style comments.
* Do not duplicate findings across multiple sections.
* Do not treat generated code and handwritten code identically.
* Do not route unresolved product decisions to coding agents.
* Do not approve solely because CI succeeds.

## Quality Checklist

Before completing the review, verify:

* [ ] The implementation intent is clear.
* [ ] The actual behavior matches the stated request.
* [ ] Affected modules and boundaries are identified.
* [ ] Primary data flows are documented.
* [ ] Failure paths are documented.
* [ ] API contracts are explicit.
* [ ] Schema changes are reviewed.
* [ ] Migration safety is assessed.
* [ ] UI states are covered.
* [ ] Authorization is checked.
* [ ] Tenant boundaries are checked where relevant.
* [ ] Sensitive data exposure is checked.
* [ ] Tests are evaluated by behavior.
* [ ] Findings contain evidence.
* [ ] Assumptions are labeled.
* [ ] Human decisions and agent tasks are separated.
* [ ] Every agent task has acceptance criteria.
* [ ] The final recommendation follows the defined values.
* [ ] No implementation begins without approval in planning mode.
