---
name: vercel-react-best-practices
description: Review, write, or refactor React and Next.js code for measurable performance without overriding the repository's architecture or adding speculative dependencies. Use for components, rendering, data fetching, bundles, hydration, server/client boundaries, and performance investigations.
version: 1.0.0
author: Caro
license: Apache-2.0
tags:
  - react
  - nextjs
  - performance
  - typescript
---

# React Best Practices

Diagnose before optimizing. Fetch current React or Next.js documentation when version-specific behavior matters.

## Priority

1. Remove serial waits that can safely run in parallel.
2. Avoid shipping code and data the current route does not need.
3. Preserve server/client trust boundaries; authenticate server actions like other endpoints.
4. Derive state during render when possible; reserve effects for synchronization with external systems.
5. Prevent avoidable subscriptions and re-renders only where the component is hot or the cost is visible.
6. Use stable keys, accessible native elements, explicit loading/error/empty states, and immutable state updates.

## Guardrails

- Read the package versions and existing data-fetching/state patterns first.
- Prefer platform and framework primitives already installed.
- Do not add SWR, an LRU package, `better-all`, memoization, dynamic imports, or caches without a demonstrated need.
- Parallelize only independent work. Preserve ordering, authorization, rate limits, and transaction semantics.
- Treat `useMemo`, `useCallback`, and `memo` as measured optimizations, not defaults.
- Keep request-specific mutable state out of shared server modules.
- Minimize data crossing server-to-client boundaries and avoid leaking secrets.
- For each non-trivial change, leave the smallest runnable regression or performance check.

Report the observed bottleneck, the narrow fix, and the evidence. Do not label stylistic preferences as performance defects.

Adapted for MythOs Aegis from Vercel's `react-best-practices`.
