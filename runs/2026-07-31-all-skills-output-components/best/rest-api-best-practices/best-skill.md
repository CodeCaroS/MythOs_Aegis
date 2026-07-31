---
name: rest-api-best-practices
description: Design, implement, document, or review framework-neutral REST/HTTP APIs using current HTTP semantics, predictable resource contracts, secure trust boundaries, compatibility rules, and focused verification. Use for endpoint design, API reviews, OpenAPI contracts, HTTP methods and status codes, resource URLs, errors, pagination, filtering, idempotency, caching, concurrency, versioning, deprecation, authorization, rate limits, or API test plans.
version: 1.0.0
author: Caro
license: Apache-2.0
tags:
  - rest
  - http
  - api-design
  - security
  - openapi
  - compatibility
---

# REST API Best Practices

Build the smallest predictable HTTP contract that fits the product. Preserve sound repository conventions; correct conventions that conflict with HTTP semantics, security, or compatibility.

## Workflow

1. Inspect the existing routes, handlers, schemas, OpenAPI files, shared response/error helpers, authorization boundaries, and contract tests. Trace callers before changing shared behavior.
2. State the resource, consumer, operation, trust boundary, compatibility promise, and expected scale. If the interface is mainly commands or workflows, say when HTTP RPC is clearer than forced resource-shaped REST.
3. Define the contract before implementation: method, path, request, success response, error response, headers, authorization rule, retry behavior, and compatibility impact.
4. Apply [the standards-backed checklist](references/practices.md). Load only the relevant sections for a narrow task; read it fully for a new API or whole-API review.
5. Reuse existing validation, authorization, serialization, pagination, and error infrastructure. Add no framework or dependency unless the current stack cannot express the contract safely.
6. Implement shared boundary behavior once, then leave the smallest runnable check that would fail on regression.
7. Verify the published contract and runtime behavior agree. Report any deliberate deviation with its consumer-visible consequence.

## Non-negotiables

- Follow HTTP method safety and idempotency semantics; do not use `POST` for every operation.
- Use HTTP status codes and headers as protocol semantics, not decorative metadata inside a `200` body.
- Validate syntax and shape at the boundary; enforce business invariants in the domain; authorize every object, function, and exposed property.
- Use RFC 9457 Problem Details for a new error format unless an established compatible format must be preserved.
- Keep success representations consistent by resource and media type. Do not impose a universal `{success,message,data}` wrapper without a demonstrated client need.
- Bound collection size and resource consumption. Define stable ordering and pagination behavior.
- Prevent lost updates where concurrent writes matter with validators such as `ETag` and `If-Match`.
- Prefer additive evolution. Introduce a new API version only for a breaking contract change that cannot be migrated compatibly.
- Never expose secrets, stack traces, internal queries, or sensitive identifiers in responses or logs.
- Describe the contract with the repository's existing OpenAPI tooling when present. Do not hand-maintain a second source of truth.

## Review Output

Lead with confirmed contract defects, ordered by user or security impact. For each defect, give the endpoint, violated semantic or invariant, consequence, and smallest compatible fix. Separate optional style preferences from correctness issues. End with checks run and unresolved compatibility decisions.

## Shared output profile

Compose the `review` profile from [output-templates](../output-templates/references/components.md).
Keep the contract, semantic defect, compatibility impact, fix, and verification together.
Preserve stricter domain rules above, omit empty components, and never fill a component with invented evidence.
