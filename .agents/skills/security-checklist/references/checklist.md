# Full security checklist with test method

Format per line: **Item** — test method (what to check in the repo/runtime
behavior) — fail criterion (how a failure is recognized).

## 1. Injection & input validation

- **XSS (Cross-Site Scripting)** — Check whether user-controlled values reach
  HTML/DOM/attributes/`innerHTML`/`dangerouslySetInnerHTML` etc. without
  context-aware encoding; inject a payload such as `<script>alert(1)</script>`
  or `"><img src=x onerror=alert(1)>` into every input field, every query
  parameter, and every stored text field (stored XSS). — Fail: payload
  executes unfiltered in the browser or renders as active markup in the DOM.
- **SQL Injection** — Search the code for string concatenation/interpolation
  in SQL statements instead of parameterized queries/ORM bindings; test with
  a payload such as `' OR '1'='1` or `1; DROP TABLE ...` in search, filter,
  sort, and ID parameters. — Fail: query structure changes with the input,
  errors reveal SQL syntax hints, or additional/different records are
  returned.
- **Command Injection** — Search the code for `exec`, `system`, `popen`,
  `child_process.exec`, or shell calls with unvalidated input; test with a
  payload such as `; whoami`, `` `id` ``, `$(whoami)` in fields that are
  passed to shell commands, filenames, or external tools. — Fail: the
  payload executes as a command instead of being treated as data.
- **Path Traversal** — Test file/path parameters with `../../../etc/passwd`,
  URL-encoded and double-encoded, as well as absolute paths; check whether
  paths are canonicalized and checked against an allowed directory. — Fail:
  access to files outside the intended directory is possible.
- **HTTP Parameter Pollution** — Send the same parameter multiple times in
  one request (`?id=1&id=2`, in both body and query simultaneously) and
  check which value is used server-side and whether validation/authorization
  can be bypassed. — Fail: the server behaves inconsistently with its
  validation/authorization logic or uses the unexpected value.
- **Input validation (server-side)** — For every field: check type, format,
  length, allowed values, required/optional status; send unknown/extra
  fields (`role`, `isAdmin`, `ownerId`, `price`, etc.) in the request. —
  Fail: validation exists only on the frontend, or unknown/privileged fields
  are accepted server-side.
- **Output validation / encoding** — Check whether output is encoded per
  context (HTML encoding, JSON serialization, URL encoding) instead of
  emitting raw data; check error responses for stack traces, internal
  paths, query strings. — Fail: raw data or internal details appear
  unencoded in the response.

## 2. Web-specific attacks

- **CSRF** — Check whether state-changing requests (POST/PUT/PATCH/DELETE)
  require a CSRF token, `SameSite=Lax/Strict` cookies, or origin/referer
  checks; reproduce a request from a foreign origin without a token. —
  Fail: a state-changing request is accepted without a token/origin check.
- **Clickjacking** — Check response headers for `X-Frame-Options` or
  `Content-Security-Policy: frame-ancestors`; embed the page in an
  `<iframe>` from a foreign domain. — Fail: the page can be embedded and
  sensitive actions can be triggered inside it.
- **Open Redirect** — Test every redirect/callback/`returnUrl` parameter
  with an external domain (`?redirect=https://evil.example`). — Fail: the
  user is redirected to an arbitrary external domain without an allowlist
  check.
- **Host-header attacks** — Send a request with a manipulated `Host` header
  and check whether password-reset links, cache keys, or redirects use it. —
  Fail: the server uses the host header unchecked for links, redirects, or
  cache keys.
- **SSRF (Server-Side Request Forgery)** — Test every place where the server
  fetches a URL on the user's instruction (webhooks, image/file import, URL
  preview) with internal targets (`http://127.0.0.1`,
  `http://169.254.169.254/` cloud metadata, internal hostnames). — Fail: the
  server connects to internal/local targets or returns their response.

## 3. Authentication & credentials

- **Brute-force protection** — Test login repeatedly with wrong credentials
  in a row (automated). — Fail: no lockout, no increasing delay, no CAPTCHA
  after repeated failures.
- **Rate limiting** — For login, registration, password reset, search,
  export, and expensive endpoints, check whether a limit per
  account/IP/API-key exists and is enforced (load test with many requests in
  quick succession). — Fail: no limit, or a limit that is only global
  instead of per actor, or bypassable via a header
  (`X-Forwarded-For`).
- **Secure passwords** — Check whether a minimum complexity/length is
  enforced server-side (NIST-aligned: length over forced special-character
  rules, checking against known compromised passwords is recommended). —
  Fail: no server-side check, or the check exists only on the frontend.
- **Password hashing** — Search the code for the hash function used. Only
  `bcrypt`, `argon2`, or `scrypt` with a sufficient cost factor are
  acceptable. — Fail: MD5, SHA-1, SHA-256 without salt/cost factor, a
  custom hash implementation, or plaintext storage.
- **MFA (Multi-Factor Authentication)** — Check whether MFA is available or
  enforceable for login and especially for privileged/sensitive actions, and
  whether the second factor is verified server-side. — Fail: no MFA present,
  or the MFA check is only client-side/bypassable.
- **Account enumeration** — Compare login, registration, and password reset
  with an existing and a non-existing email/username (error message, status
  code, response time). — Fail: different responses reveal whether an
  account exists.

## 4. Sessions & cookies

- **Secure sessions** — Check whether session IDs/tokens are verified
  server-side, have high entropy, and are regenerated after login (test
  session fixation: note the session ID before login, compare it after). —
  Fail: same session ID before/after login, predictable IDs.
- **Session timeout** — Check whether sessions expire after inactivity and
  after an absolute maximum duration (trace the token expiry in code/config,
  test an expired token against a protected endpoint). — Fail: no expiry, or
  an expired token is still accepted.
- **Session rotation** — Check whether old sessions/tokens are invalidated
  after login, password change, permission change, and logout (reuse the old
  token after logout/password change). — Fail: the old token still works.
- **Secure cookies** — Check the Set-Cookie header for `Secure`, `HttpOnly`,
  `SameSite=Lax/Strict`. — Fail: the session cookie is missing one of these
  attributes without a documented reason.

## 5. Authorization

- **Authentication vs. authorization** — Check that every protected endpoint
  verifies both identity and permission for the specific action and
  resource (not just "is logged in"). — Fail: a logged-in user can reach
  actions/resources they are not authorized for.
- **RBAC (Role-Based Access Control)** — Extract the role/permission matrix
  from the code; try to call admin/higher-privileged endpoints with a
  low-privilege account. — Fail: role checks are missing server-side or
  inconsistent between endpoints.
- **IDOR (Insecure Direct Object Reference)** — On every endpoint with an ID
  parameter (`/api/orders/123`), replace the ID with a foreign but valid ID. —
  Fail: a foreign resource is read, modified, or deleted.
- **BOLA (Broken Object Level Authorization)** — Same as IDOR, additionally
  test at the API level including nested/referenced objects, bulk endpoints,
  export, and search. — Fail: object access is not re-checked against the
  actor on every request.
- **Least privilege** — Check DB users, service accounts, API keys, and
  CI/CD credentials against the rights they actually need (read config/IAM). —
  Fail: the application uses a DB superuser/admin role for normal requests,
  service accounts have more rights than their task requires.

## 6. API security

- **API authentication** — Call every API endpoint without a token/API key. —
  Fail: the endpoint returns data or performs actions without valid
  authentication.
- **API authorization** — See IDOR/BOLA/RBAC above, plus internal/admin API
  routes that may not appear in public documentation. — Fail: an internal
  route is reachable without an authorization check.
- **Request limits** — Check body size, file size/count, pagination size,
  batch size, and query complexity limits (send an oversized
  request/batch). — Fail: no limit, the server processes arbitrarily
  large/expensive requests.
- **CORS** — Check the `Access-Control-Allow-Origin`/`-Credentials`
  headers. — Fail: `Access-Control-Allow-Origin: *` combined with
  `Access-Control-Allow-Credentials: true`, or origin reflection without an
  allowlist.
- **Secret protection** — Search the repository (including git history) for
  secrets (`.env`, config files, frontend bundles, logs); check that secrets
  come from environment variables/a secret manager instead of code. — Fail: a
  secret is found in source code, in a commit, or in the shipped frontend
  bundle.
- **API key protection** — Check how API keys are transmitted (not in the
  URL/query, due to logging), stored (hashed, not plaintext), and rotated. —
  Fail: an API key in the URL, stored in plaintext in the DB, with no
  rotation/revocation mechanism.
- **Webhook security** — Check whether incoming webhooks are verified by
  signature (HMAC) before the payload is processed; send a forged webhook
  without/with an invalid signature. — Fail: the payload is processed
  without a valid signature check.
- **Replay protection** — Check whether requests/webhooks carry a
  timestamp/nonce that is verified server-side; resend the same signed
  request. — Fail: an identical request is accepted and re-executed any
  number of times.

## 7. Transport, encryption & data

- **HTTPS/TLS** — Check that HTTP traffic redirects to HTTPS, no mixed
  content exists, and TLS version/ciphers are current (e.g. via
  `testssl.sh`/SSL Labs). — Fail: HTTP is reachable without a redirect, or
  an outdated TLS version is active.
- **Encryption at rest** — Check whether sensitive fields (passwords,
  tokens, personal data depending on protection needs) are encrypted or
  hashed at rest. — Fail: sensitive plaintext data in the DB/backups without
  encryption.
- **Row-Level Security (RLS)** — If the DB supports RLS: check policies for
  SELECT/INSERT/UPDATE/DELETE on all relevant tables; test access with the
  DB role the application uses against another tenant's/user's data. —
  Fail: RLS is missing, only enforced on reads, or the application role
  bypasses the policy.
- **Secure database permissions** — Check DB roles/grants (the application
  must not access the DB with owner/superuser rights). — Fail: the
  application uses a role with rights beyond its actual needs (e.g. `DROP`,
  `CREATE ROLE`).
- **Secure backups** — Check whether backups are stored encrypted, access is
  restricted, and a restore test is documented/performed. — Fail: an
  unencrypted backup, a publicly reachable backup store, or no tested
  restore.
- **Data minimization** — Check which personal fields are actually
  collected/stored and whether a documented purpose exists for each. —
  Fail: data is collected/stored without a discernible purpose or legal
  basis.
- **Secure logging** — Search log statements for passwords, tokens, full
  credit-card/ID numbers, session IDs. — Fail: sensitive values appear in
  plaintext in logs.

## 8. File upload security

- **File upload security** — Test upload endpoints with a wrong/forged MIME
  type, executable file types (`.php`, `.exe`, `.svg` with embedded script),
  oversized files, and manipulated filenames (path traversal, double
  extension). — Fail: the file type is checked only via extension/client
  claim, executable files land in a publicly reachable/executable
  directory.
- **Malware scanning** — Check whether uploaded files are scanned by an
  antivirus engine (e.g. ClamAV) before being released/further processed,
  especially for uploads that get redistributed publicly. — Fail: no check,
  the file is immediately retrievable by other users.

## 9. Security headers

- **Content Security Policy (CSP)** — Check the `Content-Security-Policy`
  header (no `unsafe-inline`/`unsafe-eval` without a nonce/hash strategy, a
  restrictive `default-src`). — Fail: no CSP header, or the CSP allows
  arbitrary inline script.
- **HSTS** — Check the `Strict-Transport-Security` header for a sufficient
  `max-age` (and ideally `includeSubDomains`). — Fail: the header is missing
  or `max-age` is too low/0.
- **X-Content-Type-Options** — Check the header is set to `nosniff`. — Fail:
  the header is missing.
- **X-Frame-Options** — See clickjacking above. — Fail: the header is
  missing and CSP `frame-ancestors` is also not set.
- **Referrer-Policy** — Check the header (e.g.
  `strict-origin-when-cross-origin` or more restrictive). — Fail: the header
  is missing or set to `unsafe-url`.
- **Permissions-Policy** — Check whether unneeded browser features (camera,
  microphone, geolocation) are explicitly disabled. — Fail: the header is
  entirely missing.

## 10. Infrastructure & operations

- **Firewall** — Check network/security-group configuration: only necessary
  ports/services are reachable from outside (DB, admin panels, internal
  services must NOT be public). — Fail: a database, admin interface, or
  internal service is directly reachable from the internet.
- **Security patches** — Check OS/runtime versions (Node, Python, base
  Docker images, etc.) against known open CVEs and document the patch
  process/cadence. — Fail: an outdated version with a known critical
  vulnerability is in use.
- **Dependency security** — Run `npm audit`/`pip-audit`/`osv-scanner` or
  similar; check the result for High/Critical findings. — Fail: a known
  critical vulnerability in a used dependency without a fix/mitigation.
- **Secret scanning** — Run automated secret scanning (e.g. Gitleaks, GitHub
  Secret Scanning) across the full git history. — Fail: the tool finds
  un-rotated secrets in the history.
- **Production/development separation** — Check that production and
  development/test environments use separate databases, secrets, and
  domains, and that debug/verbose error modes are disabled in production. —
  Fail: debug mode, test data, or shared secrets in production.
- **Monitoring** — Check whether security-relevant events (failed logins,
  permission changes, spikes in 5xx errors) are captured and viewable. —
  Fail: no central capture, no way to reconstruct an incident afterward.
- **Alerting** — Check whether automated notifications are configured for
  critical events (mass failed attempts, anomalies, outages). — Fail:
  incidents are only noticed randomly/manually.

## 11. Test processes

- **Dependency scanning** — Check for an automated run in CI that is active
  (search for a file in `.github/workflows/` or similar). — Fail: no
  automated scan, or a scan exists but does not block merges on critical
  findings.
- **SAST (Static Application Security Testing)** — Check whether a SAST tool
  (e.g. Semgrep, CodeQL) runs in CI and findings are actually addressed. —
  Fail: no SAST, or findings are permanently ignored.
- **DAST (Dynamic Application Security Testing)** — Check whether the
  running application is regularly and automatically tested against known
  attack patterns (e.g. OWASP ZAP). — Fail: no dynamic testing of the
  running application.
- **Code reviews** — Check whether security-relevant changes (auth,
  payments, access control) go through a mandatory review step (branch
  protection rules). — Fail: a direct push to the main branch without
  review is possible.
- **Security tests** — Check whether automated negative tests exist (a
  foreign user must not gain access, an expired token is rejected, etc.),
  not only happy-path tests. — Fail: the test suite covers only successful
  cases.
- **Penetration tests** — Check whether and when an external or internal
  penetration test was last performed, and whether its findings were
  demonstrably fixed. — Fail: no documented pentest, or open critical
  findings without a fix date.
- **OWASP Top 10** — Explicitly walk through each of the ten current
  categories against the repository (overlaps with sections 1–8 of this
  list). — Fail: a category was not checked.
- **OWASP ASVS** — For security-critical applications, use the appropriate
  ASVS level (usually L2) as a reference catalog and document deviations. —
  Fail: no comparison against ASVS for an application with sensitive data.

## 12. GDPR/privacy

- **Privacy overview** — Check whether a privacy notice exists that
  describes the actual data processing (records of processing activities,
  Art. 30 GDPR). — Fail: the processing in the code diverges from the
  documented notice, or none exists.
- **Erasure** — Check whether an erasure process (Art. 17 GDPR) exists and
  actually removes/anonymizes data across primary DB, backups, caches,
  logs, and third-party systems, not just a soft-delete flag. — Fail: an
  erased user's data remains retrievable through another path.
- **Data export** — Check whether a machine-readable export of a user's own
  data (Art. 20 GDPR, data portability) can be provided. — Fail: no way to
  export one's own data in a structured format.
- **Rectification** — Check whether users can correct inaccurate data
  (Art. 16 GDPR) and the correction propagates to relevant places. — Fail:
  inaccurate data cannot be corrected, or the correction is not applied
  everywhere.
- **Retention periods** — Check whether a retention duration is defined and
  technically enforced for every data category (automatic deletion/
  anonymization after expiry). — Fail: data is retained indefinitely
  without a documented reason.
- **DPA (Data Processing Agreement)** — Check whether a DPA under Art. 28
  GDPR exists for every external processor that handles personal data
  (hosting, email, analytics, payment provider). — Fail: personal data
  flows to a third party without a DPA.
- **Third-party vendor security** — Check which third-party SDKs/APIs are
  embedded and what data is sent to them (analyze network traffic). —
  Fail: unknown/undocumented data flows to a third party.
- **Privacy by design** — Check whether privacy is already considered in the
  architecture (e.g. pseudonymization, role-based access restriction)
  rather than bolted on afterward. — Fail: privacy measures were added as a
  patch after the fact, the architecture collects more data than needed by
  default.
- **Privacy by default** — Check whether privacy-friendly settings (e.g. no
  marketing consent, minimal visibility) are the default without the user
  having to actively restrict anything. — Fail: opt-out instead of opt-in
  for non-essential data processing, the default setting is the most
  data-intensive one.
