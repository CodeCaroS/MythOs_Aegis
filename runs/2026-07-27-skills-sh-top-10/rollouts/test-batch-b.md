# Batch B Frozen Test Rollouts

Final forward comparison of each frozen baseline and frozen best skill. These
representative outputs use only the matching test prompt and shared rubric.

## vercel-react-best-practices

### Baseline

> The list should use `content-visibility: auto` so off-screen rows are skipped.
> Memoize the filtered and sorted items with `useMemo`, wrap each row in
> `memo`, and use `useCallback` for row handlers. Build a `Map` for repeated
> item lookups and cache expensive formatting results at module scope. Use the
> React Profiler afterward to confirm the render count falls.

### Final

> First capture a React Profiler trace for the slow interaction and identify
> whether the cost is list size, repeated derivation, broad subscriptions, or
> expensive rows.
>
> - If the trace shows thousands of off-screen DOM nodes dominate the commit,
>   use the repository's existing virtualization pattern; if none exists,
>   test native `content-visibility` before adding a package.
> - If filtering or sorting is the measured hot path, derive it during render
>   and memoize only that expensive calculation with primitive dependencies.
> - Do not add `memo`, `useCallback`, a module cache, or row-level memoization
>   until the trace shows avoidable repeated work; a cache also requires proven
>   keying, lifetime, and invalidation needs.
>
> Preserve stable keys, keyboard/focus behavior, and loading, empty, and error
> states. Verify the narrow change with the existing interaction test and a
> before/after profiler trace for the same data and action.

## grill-with-docs

### Baseline

> Run a grilling and domain-modeling session: why is the name changing, which
> domain concept does it represent, and what modules use it? Update the glossary
> with the new name as the discussion progresses, then create an ADR explaining
> the rename so the terminology decision is preserved.

### Final

> Before changing documentation:
>
> - Is this merely a clearer label for the same concept, or did its invariant,
>   ownership, lifecycle, or scope change?
> - Has the new wording been agreed, and which existing glossary definition and
>   code paths depend on it?
> - Is the naming decision load-bearing, costly to reverse, or likely to be
>   repeatedly debated?
>
> Decision:
>
> - Same concept, clearer agreed name: update the existing glossary term and its
>   references; do not create a duplicate term or ADR.
> - Different domain concept: update or split the glossary only after the
>   concept is accepted.
> - Create an ADR only when the name encodes a durable architectural/domain
>   decision that future work could otherwise reverse or re-litigate.
> - If the rename is cosmetic, tentative, or reversible: neither.
>
> Show the proposed documentation diff separately and ask before writing it.

## improve-codebase-architecture

### Baseline

> The subsystem's many tiny helpers indicate shallow modules and poor locality.
> Read the prior ADR, then consolidate related helpers into a deeper module with
> one interface as the test surface. Mark this **Strong** when the deletion test
> shows that removing the helpers concentrates complexity. Keep any candidate
> that contradicts the ADR only when the friction justifies reopening it.
>
> Present the files, benefits, and before/after diagrams in the temporary HTML
> report, then ask which candidate to explore. Do not implement yet.

### Final

> Many tiny helpers are a review signal, not a confirmed defect.
>
> 1. **Confirmed only with trace evidence:** map the subsystem's callers,
>    persistence and trust boundaries, UI states, and tests. Cite helpers that
>    force one behavior change across multiple files or leak sequencing and
>    invariants to callers.
> 2. **Respect the ADR:** treat its decision as binding unless current,
>    repeated friction directly contradicts its assumptions. If so, label the
>    finding **Worth exploring**, quote the affected decision, and explain the
>    new evidence; do not silently re-litigate it.
> 3. **Root change:** prefer deleting or consolidating proven duplicated
>    choreography through an existing seam. Apply the deletion test. Do not add
>    an interface, factory, or "deep module" based only on helper count.
> 4. **Verification:** name the smallest existing subsystem test plus one
>    regression check covering the shared behavior before ranking a change
>    **Strong**.
>
> This audit remains analysis-only. With no cited repository trace, the helper
> consolidation is **Speculative** and is not recommended for implementation.
