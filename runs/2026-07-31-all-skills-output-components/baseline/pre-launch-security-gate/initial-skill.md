---
name: pre-launch-security-gate
description: >
  Reviews application changes and release candidates for authentication,
  authorization, tenant isolation, rate limiting, server-side validation,
  injection risks, and unsafe data exposure. Use before implementing APIs,
  modifying access-controlled resources, merging security-sensitive changes,
  or releasing an application.
version: 1.0.0
author: Caro
license: Apache-2.0
tags:
  - security
  - authentication
  - authorization
  - api-security
  - rate-limiting
  - row-level-security
  - input-validation
  - injection-prevention
  - multi-tenancy
  - secure-coding
triggers:
  - pre-launch security gate
  - security check before launch
  - review application security
  - check security before release
  - release candidate security review
  - security review before merge
  - make the app secure
  - check security
capabilities:
  - access-boundary-review
  - authentication-review
  - authorization-review
  - tenant-isolation-review
  - rate-limit-review
  - validation-review
  - injection-review
  - release-readiness-review
outputs:
  - markdown
  - security-review
  - findings
  - release-gate-decision
requires:
  - repository-access
constraints:
  read_only_by_default: true
  require_evidence_for_findings: true
  require_negative_tests_for_release: true
---

# Pre-Launch Security Gate

## Purpose

Prevent applications from shipping with security controls that only appear secure.

The agent must verify security from the server and data boundary inward. Client-side checks, hidden UI elements, unpredictable IDs, TypeScript types, and frontend validation are not security controls.

This skill focuses on 4 mandatory controls:

1. Authentication
2. Authorization and data isolation
3. Rate and resource limiting
4. Server-side validation and injection prevention

These controls are necessary but not sufficient for a complete production security program.

## Core Principle

For every protected operation, prove all of the following:

```text
Who is making the request?
Are they allowed to perform this action?
Are they allowed to access this exact resource and every affected field?
Is the request bounded?
Is every untrusted value validated and safely handled?
```

Never infer authorization from authentication alone.

---

## Activation Triggers

Apply this skill when the task involves any of the following:

- Creating or changing an API endpoint
- Reading or mutating user-owned or tenant-owned data
- Login, registration, password reset, sessions, tokens, OAuth, or API keys
- Admin or privileged operations
- File uploads, imports, exports, search, filters, or dynamic queries
- Webhooks, background jobs, queues, or service-to-service calls
- Public forms or unauthenticated endpoints
- Changes to database permissions, policies, repositories, or ORM queries
- Preparing a release, deployment, or pull request
- Any request to "make the app secure" or "check security"

---

# Mandatory Security Workflow

## Phase 1: Map the Trust Boundary

Before editing code, identify:

- Entry points
- Authentication mechanism
- Actor types
- Roles and permissions
- Tenant, organization, group, and ownership boundaries
- Protected resources
- Sensitive fields
- Public endpoints
- Privileged service accounts
- External integrations
- Database access path

Create a compact access matrix:

| Actor | Resource | Action | Allowed condition |
|---|---|---|---|
| Anonymous | Login | Create session | Valid credentials and anti-abuse controls |
| User | Record | Read | Record belongs to user or permitted group |
| Manager | Team record | Update | Same tenant and permitted role |
| Admin | Tenant settings | Update | Explicit scoped privilege |
| Service | Job record | Process | Dedicated service identity and minimum scope |

Do not continue until ambiguous ownership and permission rules are stated as assumptions or resolved from project files.

## Phase 2: Authentication Review

Authentication proves identity. It does not grant access to every resource.

Verify:

- Protected endpoints reject unauthenticated requests.
- Sessions or tokens are verified server-side.
- Token signature, issuer, audience, expiry, and intended use are checked.
- Passwords use a modern password hashing function provided by a trusted library.
- Session identifiers and tokens are never logged.
- Session cookies use appropriate `Secure`, `HttpOnly`, and `SameSite` settings.
- Login, password reset, verification, and recovery flows resist enumeration.
- Password-reset tokens are random, short-lived, single-use, and invalidated after use.
- OAuth redirects and state parameters are validated.
- Multi-factor authentication is required for high-risk or privileged actions when supported.
- Authentication failures do not reveal whether an account exists.
- Logout and credential rotation invalidate relevant sessions where required.

Reject:

- Trusting a client-supplied user ID, role, tenant ID, or email as identity
- Decoding a token without verifying it
- Long-lived bearer tokens without rotation or revocation strategy
- Secrets embedded in source code or frontend bundles
- Authentication implemented only in UI routing or middleware that can be bypassed

## Phase 3: Authorization Review

Authorization must be enforced for every operation and every resource.

For each endpoint or command, verify:

1. Function-level authorization
   Can this actor perform this type of action?

2. Object-level authorization
   Can this actor access this exact object?

3. Property-level authorization
   Can this actor read or modify these exact fields?

4. Tenant-level authorization
   Does every query remain inside the actor's tenant or organization?

5. Relationship authorization
   Is access based on a verified membership, ownership, assignment, or delegation?

### Mandatory Rules

- Deny by default.
- Enforce authorization server-side.
- Derive the current actor from the verified session or token.
- Never use a request-supplied owner or tenant ID as proof of access.
- Scope database queries by actor, tenant, and permission before loading data.
- Re-check authorization during mutations, not only during the initial page load.
- Validate authorization for nested resources and indirect references.
- Apply field allowlists for create and update operations.
- Protect bulk actions, exports, search, and counts with the same rules as single-record endpoints.
- Treat UUIDs and hidden IDs as identifiers, not permissions.
- Ensure admin bypasses are explicit, narrow, logged, and tested.
- Prevent horizontal privilege escalation between users.
- Prevent vertical privilege escalation between roles.
- Return a safe response without exposing whether inaccessible resources exist.

Prefer:

```text
find record where:
  record.id = requested_id
  AND record.tenant_id = current_actor.tenant_id
  AND authorization policy permits current_actor
```

Avoid:

```text
record = find by requested_id
then hope a later layer checks ownership
```

### Multi-Tenant Fail-Closed Rule

Every tenant-owned query must be tenant-scoped by construction.

Preferred enforcement order:

1. Database-level isolation where supported
2. Central repository or policy layer
3. Service-level authorization
4. Endpoint-level guard

Use multiple layers for sensitive systems. Do not rely on scattered controller checks alone.

## Phase 4: Row-Level Security Review

Row-level security is defense in depth, not a replacement for application authorization.

When the database supports row-level policies:

- Enable policies on every intended table.
- Define policies for `SELECT`, `INSERT`, `UPDATE`, and `DELETE`.
- Use both visibility conditions and write constraints.
- Confirm the application role does not bypass policies.
- Confirm table owners, elevated roles, migrations, jobs, and maintenance tasks behave intentionally.
- Test direct database access through the same role used by the application.
- Test cross-user and cross-tenant reads and writes.
- Ensure views, functions, triggers, and security-definer functions do not bypass isolation.
- Keep privileged database credentials out of normal request handling.

Fail the review when:

- RLS exists but the runtime role bypasses it.
- Only reads are protected while writes remain unrestricted.
- Inserted or updated rows can be reassigned to another tenant.
- Background workers use global credentials without explicit scoping.
- Tests only cover successful access.

## Phase 5: Rate and Resource Limiting

Rate limiting must match the abuse case and the identity available at that boundary.

### Choose the Correct Key

Use one or more of:

- IP or network range for anonymous traffic
- Account ID for authenticated traffic
- Tenant or organization ID for shared quotas
- API key or client ID for integrations
- Endpoint or operation
- Resource identifier
- Device or session signal where justified

Do not use only a global counter for authenticated users. One noisy user must not exhaust another user's allowance.

### Apply Separate Policies

Use stricter limits for:

- Login attempts
- Password reset and verification
- Account creation
- Expensive search
- File upload and processing
- Exports
- AI or compute-heavy operations
- Webhook ingestion
- Email, SMS, or notification sending
- Payment or redemption actions
- Bulk mutations

### Bound More Than Request Count

Also constrain:

- Request body size
- File size and file count
- Pagination size
- Query complexity
- Search range
- Batch size
- Concurrent jobs
- Processing time
- Memory usage
- Retry count
- Queue depth
- Export size
- Cost per actor or tenant

### Required Behavior

- Return an appropriate throttling response.
- Provide retry guidance where suitable.
- Do not reveal internal infrastructure details.
- Record enough metadata to investigate abuse without logging secrets.
- Define behavior for distributed deployments.
- Decide whether limits are fail-open or fail-closed during limiter outages.
- Prevent attackers from bypassing limits by changing untrusted headers.
- Test normal, burst, sustained, and concurrent traffic.

## Phase 6: Server-Side Validation

Treat every external value as untrusted, including values from:

- Browser clients
- Mobile apps
- Query parameters
- Path parameters
- Headers
- Cookies
- Files
- Webhooks
- Third-party APIs
- Message queues
- Imported CSV, JSON, XML, or spreadsheets
- Stored database content originally supplied by users

Validate on the server before business logic.

For each field define:

- Required or optional
- Type
- Format
- Minimum and maximum
- Length
- Allowed values
- Normalization rules
- Cross-field constraints
- Business invariants
- Unknown-field behavior

Prefer allowlists and schema validation.

Reject unknown or forbidden fields for security-sensitive DTOs.

Do not silently accept fields such as:

```text
role
isAdmin
ownerId
tenantId
permissions
status
approved
price
balance
createdBy
```

unless the current operation explicitly permits the actor to set them.

### Validation Is Not Output Encoding

Use the correct control for each sink:

| Sink | Required protection |
|---|---|
| SQL | Parameterized query |
| HTML | Context-aware output encoding |
| Shell | Avoid shell; otherwise strict argument handling |
| URL | URL parsing and scheme allowlist |
| File path | Canonicalization and allowed-directory enforcement |
| LDAP | Safe API and context-specific escaping |
| Template | Safe template engine defaults |
| JSON | Structured serialization |
| Redirect | Destination allowlist |
| Logs | Structured logging and newline/control-character handling |

## Phase 7: Injection Prevention

Do not treat generic "sanitization" as the primary injection defense.

Mandatory controls:

- Use parameterized SQL queries or safe ORM bindings.
- Never concatenate untrusted values into SQL.
- Never concatenate untrusted values into shell commands.
- Avoid dynamic code execution.
- Avoid unsafe deserialization.
- Use allowlists for dynamic table names, column names, sort directions, operators, and command options.
- Encode output for the destination context.
- Keep database and service accounts least-privileged.
- Validate uploaded and imported content before processing.
- Treat filenames, archive paths, metadata, and MIME declarations as untrusted.
- Do not rely on escaping when a safer structured API exists.

Unsafe:

```text
"SELECT * FROM users WHERE id = " + request.id
```

Safe pattern:

```text
query("SELECT * FROM users WHERE id = ?", [validatedId])
```

For dynamic identifiers that cannot be parameterized:

```text
requested sort field
→ map through fixed allowlist
→ use mapped internal identifier
```

---

# Required Security Tests

The agent must add or identify tests for both allowed and denied behavior.

## Authentication Tests

- Anonymous request is rejected.
- Invalid, expired, malformed, or wrong-audience token is rejected.
- Revoked or invalidated credential is rejected where applicable.
- Authentication error does not disclose account existence.

## Authorization Tests

For every protected action:

- Owner can perform allowed action.
- Different user cannot read it.
- Different user cannot modify it.
- Different user cannot delete it.
- User from another tenant cannot access it.
- Lower role cannot call privileged function.
- Forbidden field cannot be read or changed.
- Guessed or valid foreign ID still fails.
- Bulk endpoint cannot include inaccessible records.
- Export and search do not leak inaccessible data.

## RLS Tests

- Runtime database role is subject to policies.
- Cross-tenant `SELECT`, `INSERT`, `UPDATE`, and `DELETE` fail.
- New rows cannot be assigned to another tenant.
- Elevated workers only bypass policies intentionally.
- Policy behavior remains correct through views and functions.

## Rate-Limit Tests

- Correct actor reaches their own quota.
- One actor does not consume another actor's quota.
- Anonymous and authenticated limits use appropriate keys.
- Expensive routes have stricter or cost-aware limits.
- Concurrent requests cannot trivially bypass the limiter.
- Oversized and excessive workloads are rejected.

## Validation and Injection Tests

- Missing, malformed, oversized, and unexpected fields fail.
- Unknown privileged fields fail.
- SQL metacharacters remain data, not executable syntax.
- Sort, filter, and search inputs cannot alter query structure.
- Shell-like input cannot execute commands.
- Path traversal input cannot leave the allowed directory.
- Stored values are safely encoded at output.
- Error responses do not expose queries, stack traces, secrets, or internals.

## Security Review Procedure

## 1. Discover

Inspect:

- Route definitions
- Middleware
- Authentication configuration
- Authorization policies
- Controllers and handlers
- Services
- Repositories and ORM queries
- Database migrations and policies
- DTOs and validators
- File-processing code
- Background jobs
- Tests
- Deployment configuration
- Secret handling
- Logs and error responses

## 2. Trace

For every affected endpoint, trace:

```text
request → authentication → actor context → authorization → validation → business logic → database external service → response serialization → audit logging
```

Identify path skips control.

## 3. Attack Attempt

Break the feature conceptually through tests:

- Remove authentication.
- Change object IDs.
- Change tenant IDs.
- Add privileged fields.
- Replay requests.
- Send requests concurrently.
- Exceed normal payload size.
- Manipulate sort filter inputs.
- Submit injection payloads.
- Access same operation through alternate route.
- Trigger operation worker webhook.
- Inspect whether error messages leak information.

## 4. Fix

Prefer centralized reusable controls:

- Authentication middleware
- Policy or permission service
- Tenant-scoped repository
- Typed request schema
- Parameterized data-access layer
- Shared rate-limit policy
- Database constraints
- RLS policies
- Secure response DTOs
- Negative integration tests

Do not "fix" a systemic issue with one isolated conditional when equivalent paths remain vulnerable.

## 5. Verify

Run:

- Unit tests
- Integration tests
- Authorization matrix tests
- Cross-tenant tests
- Static analysis
- Dependency secret scanning when available
- Migration or policy tests
- Relevant linters or type checks

Never claim a test ran when it did not.

---

# Findings Format

Classify finding:

- `BLOCKER`: Direct data exposure, privilege escalation, authentication bypass, injection, secret exposure, cross-tenant access
- `HIGH`: Realistic abuse path affecting sensitive operations availability
- `MEDIUM`: Defense weakness requiring specific conditions
- `LOW`: Hardening opportunity limited direct impact

Use format:

```markdown
## Security Finding: <title> Severity: BLOCKER | HIGH | MEDIUM | LOW ### Evidence - File location - Relevant code path - Reproduction or attack scenario ### Impact Describe what attacker could read, change, execute, disrupt. ### Required Fix Describe smallest complete fix correct architectural layer. ### Verification List negative positive tests required prove fix.
```

---

# Release Gate

Do not approve release while any remain:

- protected route lacks verified authentication
- Authorization depends only on frontend check
- An object is loaded by user-controlled ID without object-level authorization
- Tenant isolation is missing or inconsistent
- Clients can set protected ownership privilege fields
- SQL commands built through untrusted string concatenation
- Sensitive endpoints lack appropriate abuse controls
- Payload, file, batch, query cost unbounded
- RLS assumed but not active runtime role
- Cross-user cross-tenant negative tests missing
- Secrets or tokens can appear in source, responses, or logs
- Security-critical behavior is uncertain or undocumented

---

# Required Final Output

At end task, report:

```markdown
## Security Gate Result Status: PASS | PASS WITH WARNINGS | FAIL ### Scope Reviewed - ... ### Controls Verified - Authentication: ... - Authorization: ... - Tenant/RLS isolation: ... - Rate/resource limiting: ... - Validation/injection prevention: ... ### Findings - ... ### Tests Added or Run - ... ### Remaining Risks - ... ### Release Decision - ...
```

A `PASS` requires evidence. Absence of discovered vulnerabilities is not proof the system is secure.
