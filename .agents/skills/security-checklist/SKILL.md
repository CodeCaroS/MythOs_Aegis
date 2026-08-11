---
name: security-checklist
description: >
  Repository-wide security testing checklist for web applications and APIs:
  OWASP Top 10 attack classes, auth/session/cookie hardening, API security,
  encryption, security headers, infrastructure/operations hygiene, test and
  review processes, and GDPR obligations. Use when a repository must be
  audited against XSS, SQL injection, CSRF, SSRF, IDOR/BOLA, session and
  cookie security, CORS, secret handling, security headers, dependency and
  patch hygiene, SAST/DAST/pentest coverage, or GDPR obligations before
  release or as a recurring audit.
version: 1.0.0
author: Caro
license: Apache-2.0
tags:
  - security
  - owasp
  - asvs
  - gdpr
  - authentication
  - authorization
  - api-security
  - security-headers
  - dependency-security
triggers:
  - security checklist
  - audit this repo for security
  - gdpr check
  - owasp top 10 check
  - pentest checklist
capabilities:
  - repo-wide-security-audit
  - owasp-top-10-mapping
  - asvs-mapping
  - gdpr-compliance-review
outputs:
  - markdown
  - checklist-with-status
  - findings
requires:
  - repository-access
constraints:
  read_only_by_default: true
  require_evidence_for_findings: true
  no_status_without_verification: true
---

# Security Checklist

## Purpose

A checklist is not proof of security. A checked item is only valid when it
is backed by a concrete finding in the repository (a code location, a test
run, tool output, or a configuration file). "I know this, it's usually done
that way" does not count. If an item cannot be verified (no access, no
runtime environment), mark it `UNVERIFIED` rather than scoring it as passed.

This checklist does not replace a professional penetration test, legal
advice on GDPR, or SAST/DAST tooling. It structures what must be
demonstrable in the repository, before and after.

## Workflow

1. Determine the repository type (frontend, backend/API, monorepo,
   infrastructure) and select the relevant sections from
   [references/checklist.md](references/checklist.md).
2. For every item, find the code location or configuration that implements
   the control. Without a finding, the item counts as open, not "probably
   fine".
3. Where possible, reproduce the attack instead of only reading code (e.g. an
   XSS payload in an input field, a foreign ID in an API call, an expired
   token). Static code can contain a control that does not actually apply at
   runtime.
4. Record a result per item: `PASS` (with evidence), `FAIL` (with
   reproduction and impact), or `UNVERIFIED` (with reason).
5. End with an overall assessment by severity, not a plain yes/no summary. A
   single `BLOCKER` (e.g. SQL injection, missing authorization, plaintext
   passwords) blocks a "secure" verdict regardless of how many other items
   passed.
6. For deeper auth/authorization/rate-limiting/injection review, also use
   `.agents/skills/pre-launch-security-gate/SKILL.md` — it covers those four
   controls in detail with test cases and a findings format.

## Checklist structure

The full list with a test method per item lives in
[references/checklist.md](references/checklist.md), grouped into:

1. Injection & input validation (XSS, SQL injection, command injection, path
   traversal, HTTP parameter pollution, input/output validation)
2. Web-specific attacks (CSRF, clickjacking, open redirect, host-header
   attacks, SSRF)
3. Authentication & credentials (brute force, rate limiting, passwords,
   password hashing, MFA, account enumeration)
4. Sessions & cookies (secure sessions, timeout, rotation, secure cookies)
5. Authorization (RBAC, IDOR, BOLA, least privilege)
6. API security (API authentication, API authorization, request limits,
   CORS, secret/API-key protection, webhook security, replay protection)
7. Transport, encryption & data (HTTPS/TLS, encryption, row-level security,
   database permissions, backups, data minimization, logging)
8. File upload security & malware scanning
9. Security headers (CSP, HSTS, X-Content-Type-Options, X-Frame-Options,
   Referrer-Policy, Permissions-Policy)
10. Infrastructure & operations (firewall, patches, dependency security,
    secret scanning, prod/dev separation, monitoring, alerting)
11. Test processes (dependency scanning, SAST, DAST, code reviews, security
    tests, penetration tests, OWASP Top 10, OWASP ASVS)
12. GDPR/privacy (erasure, export, rectification, retention periods, DPAs,
    third-party vendor security, privacy by design/default)

## Result format

```markdown
## Security Checklist – Result

Status: SAFE ENOUGH FOR RELEASE | NOT RELEASE READY | INCOMPLETELY REVIEWED

### Blockers (fix immediately)
- [Category] Item – Location – Attack scenario – Impact

### Open items by severity
- HIGH / MEDIUM / LOW – Item – Location – Recommended fix

### Unverified items
- Item – Reason (no access, no runtime environment, out of scope)

### Passed items (with evidence)
- Item – Location/test run that proves the control

```

A statement like "everything was checked and is secure" is not valid without
this evidence list. GDPR fines of up to €20 million or 4% of global annual
turnover (Art. 83 GDPR) are reason enough to label an incomplete review as
`INCOMPLETELY REVIEWED` instead of glossing over it.
