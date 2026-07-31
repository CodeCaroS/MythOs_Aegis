# REST/HTTP practices

## Contents

1. Resource model and URLs
2. Methods and idempotency
3. Status codes and headers
4. Representations and errors
5. Collections
6. Concurrency, caching, and retries
7. Security and resource limits
8. Evolution and documentation
9. Verification
10. Source map

## 1. Resource model and URLs

- Model stable domain resources, not controller functions: `/users/{userId}/orders`, not `/getUserOrders`.
- Use one consistent naming convention. Prefer plural collection nouns when starting fresh.
- Keep identifiers opaque to clients. Do not leak storage layout or require clients to parse IDs.
- Nest only when the parent scopes identity or access. Avoid deep paths; link related resources instead.
- Represent a real domain action as a subordinate resource when useful (`POST /orders/{id}/cancellations`). Use a documented command endpoint when inventing a fake resource would be less clear.
- Put filtering, sorting, pagination, and field selection in query parameters. Do not put credentials or secrets in URLs.

## 2. Methods and idempotency

- `GET`: retrieve a representation. Keep it safe and free of requested state changes.
- `HEAD`: return the headers a corresponding `GET` would return, without a response body.
- `POST`: submit data for resource-specific processing; creation is common but not its only meaning.
- `PUT`: create or replace the state of the target resource. Keep repeated identical requests idempotent.
- `PATCH`: apply a partial modification using a declared patch media type or clearly specified merge semantics.
- `DELETE`: request removal of the target association or resource. Keep repeated identical requests idempotent even when later responses differ.
- `OPTIONS`: expose supported communication options when the platform needs it.

Do not retry non-idempotent operations automatically unless the API defines a deduplication contract. If accepting idempotency keys for `POST`, bind a key to the authenticated caller and normalized request, retain the first outcome for a documented window, and reject key reuse with a different payload.

## 3. Status codes and headers

Choose the most specific standard code the client can act on:

| Situation | Typical response |
| --- | --- |
| Successful read/update with a body | `200 OK` |
| New resource created | `201 Created` plus `Location` |
| Accepted for asynchronous processing | `202 Accepted` plus status location |
| Successful response with no body | `204 No Content` |
| Conditional retrieval unchanged | `304 Not Modified` |
| Malformed syntax or invalid generic request | `400 Bad Request` |
| Missing or invalid authentication | `401 Unauthorized` plus `WWW-Authenticate` |
| Authenticated but not permitted | `403 Forbidden` |
| Resource absent, or deliberately concealed | `404 Not Found` |
| Conflict with current resource state | `409 Conflict` |
| Failed conditional write | `412 Precondition Failed` |
| Unsupported request media type | `415 Unsupported Media Type` |
| Well-formed but semantically invalid content | `422 Unprocessable Content` |
| Rate limit exceeded | `429 Too Many Requests`, usually plus `Retry-After` |
| Unexpected server failure | appropriate `5xx` without internal details |

Never send a body with `204` or `304`. Use `Content-Type` for the selected representation, `Location` for a created or redirected resource, `Allow` where required, `ETag` for validators, `Cache-Control` and `Vary` for caching, `Retry-After` when retry timing is known, and registered `Link` relations where links belong in headers.

## 4. Representations and errors

- Return the resource representation directly unless a stable envelope provides concrete metadata such as pagination.
- Keep field names, nullability, date/time format, numeric precision, and identifier representation consistent and documented.
- Avoid boolean `success` fields that duplicate the HTTP status.
- Use RFC 9457 `application/problem+json` for new error contracts. Populate stable `type`, short `title`, actual HTTP `status`, occurrence-specific `detail`, and `instance` when useful.
- Add extension members such as validation violations only when clients can rely on their schema. Never make clients parse prose.
- Give clients a safe correlation identifier; keep stack traces and implementation details server-side.

## 5. Collections

- Require a bounded default and maximum page size.
- Define stable ordering and a deterministic tie-breaker.
- Prefer cursor pagination for large or frequently changing collections. Use offset pagination only when its drift and cost are acceptable.
- Treat cursors as opaque, scoped to the query, and tamper-resistant when exposed to untrusted clients.
- Keep filter and sort names stable; allowlist fields and operators.
- Return navigation links or cursors consistently. Avoid expensive total counts unless consumers need them.
- Define empty collections as successful responses with an empty array, not `404`.

## 6. Concurrency, caching, and retries

- Emit strong `ETag` validators for editable representations when lost updates matter; require `If-Match` on writes and return `412` on stale state.
- Support conditional `GET` with `If-None-Match` when caching pays off.
- Set explicit cache policy for sensitive, personalized, or shared responses. Include `Vary` for request headers that select the representation.
- Make timeout, retry, and asynchronous completion behavior observable and documented.
- Retry only transient failures, use backoff and jitter, honor `Retry-After`, and cap attempts.

## 7. Security and resource limits

- Require TLS outside trusted local development.
- Authenticate centrally, then authorize at object, function, and property level on every request. Never trust client-supplied ownership or role fields.
- Use allowlist validation, request body and upload limits, bounded query complexity, execution timeouts, and rate or quota limits.
- Prevent mass assignment by mapping writable fields explicitly.
- Restrict outbound destinations and redirects for server-side fetches; defend against SSRF.
- Configure CORS for known origins, methods, and headers. Do not combine wildcard origins with credentials.
- Avoid sensitive data in URLs, errors, metrics, and logs. Redact tokens and credentials.
- Maintain an inventory of hosts, versions, and exposed endpoints; remove retired and debug endpoints.
- Test cross-tenant access and excessive data exposure, not only authentication.

## 8. Evolution and documentation

- Prefer additive optional fields and endpoints. State whether consumers must ignore unknown response fields.
- Treat removal, rename, type/nullability changes, narrower accepted input, changed authorization, and changed semantics as breaking unless the contract says otherwise.
- Version only when a breaking change cannot be shipped compatibly. Choose one strategy that fits existing infrastructure and apply it consistently; URL versioning is a convention, not an HTTP requirement.
- Publish migration guidance and a deprecation window. Use standard `Deprecation` and `Sunset` headers when clients can consume them.
- Keep one authoritative OpenAPI description aligned with runtime validation and examples.

## 9. Verification

Leave focused automated checks for:

- method, path, status, headers, media type, and response schema;
- malformed, missing, boundary, and unknown input;
- unauthenticated, unauthorized, cross-object, cross-tenant, and property-level access;
- idempotent retries and idempotency-key conflicts where supported;
- pagination stability, bounds, filters, sort order, and empty results;
- stale conditional writes and cache validators;
- rate, size, timeout, and query-complexity limits;
- Problem Details shape without sensitive leakage;
- OpenAPI compatibility or generated contract drift.

## 10. Source map

- TikTok seed carousel: <https://www.tiktok.com/@theforeverknights/photo/7665576318683073800>
- HTTP semantics, methods, status codes, conditional requests, and caching: <https://www.rfc-editor.org/rfc/rfc9110>
- PATCH: <https://www.rfc-editor.org/rfc/rfc5789>
- Problem Details for HTTP APIs: <https://www.rfc-editor.org/rfc/rfc9457>
- Web linking: <https://www.rfc-editor.org/rfc/rfc8288>
- Additional HTTP status codes, including `429`: <https://www.rfc-editor.org/rfc/rfc6585>
- Sunset header: <https://www.rfc-editor.org/rfc/rfc8594>
- Deprecation header: <https://www.rfc-editor.org/rfc/rfc9745>
- OWASP API Security Top 10 (2023): <https://owasp.org/API-Security/editions/2023/en/0x11-t10/>
- OpenAPI Specification: <https://spec.openapis.org/oas/latest.html>
