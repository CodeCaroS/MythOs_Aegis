# Batch B Representative Rollouts

Synthetic forward rollouts using only each immutable skill, its matching task
prompt, and the shared rubric. No test task was opened or used.

## vercel-react-best-practices

### Train — baseline

> The sequential requests are the highest-impact issue. Start both requests
> together and await them with `Promise.all()`; use `better-all` if one depends
> on part of the other. Remove `useMemo` around primitive arithmetic and string
> formatting, but retain it around expensive filtering. Consider SWR so repeated
> client requests are deduplicated automatically. Confirm the component renders
> correctly after the refactor.

### Train — candidate

> Findings:
>
> 1. Confirm the two requests are independent before changing their order. If
>    they are, start them together with the repository's existing fetch helper
>    and await `Promise.all`; preserve authorization, rate limits, and error
>    behavior. This is the only likely high-impact fix.
> 2. Do not remove or add `useMemo` by rule. Profile the render path, remove the
>    wrappers around cheap primitive expressions, and retain memoization only
>    where the profiler shows expensive repeated work.
> 3. Do not add SWR or another cache for this review.
>
> Verify with the smallest existing component test plus one timing/profiler
> comparison for the request path. Observed bottleneck: serialized independent
> I/O; narrow fix: parallel start; evidence required: shorter route duration
> with unchanged results and failure states.

### Validation — baseline

> Request-specific mutable state must not live at module scope in SSR/RSC.
> Move it into the route handler. Pass only the client component fields it
> renders rather than serializing the full object. Wrap duplicate server reads
> in `React.cache()` and consider an LRU cache for cross-request reuse. This
> reduces leakage risk and the RSC payload.

### Validation — candidate

> Two confirmed defects:
>
> 1. Module-level mutable request state can cross request boundaries. Move it
>    into the route/request scope and pass values explicitly; do not introduce a
>    shared cache unless its ownership, keying, and invalidation are already
>    established.
> 2. The server-to-client boundary is oversized. Select the exact serializable,
>    non-secret fields the client component renders and keep the rest on the
>    server.
>
> No package is needed. Verify with a concurrent-request isolation check and a
> payload snapshot/size comparison, plus loading, error, and empty-state
> behavior for the client component.

## grill-with-docs

### Train — baseline

> I will run a grilling session using domain modeling. What are the proposed
> modules, which domain concepts does each own, and where does the boundary sit?
> As the answers stabilize, I will update the glossary and create ADRs for the
> resulting split so the design remains documented.

### Train — candidate

> Before documenting, I would challenge the split:
>
> - Which concrete changes currently force both sides to change together?
> - What invariant, data ownership, or trust boundary becomes clearer?
> - Can the same result come from deleting or consolidating an existing seam?
> - What failure or test becomes local after the split?
> - Is the decision costly to reverse and likely to be debated again?
>
> Until those answers establish a durable boundary, this remains an unapproved
> proposal: no ADR and no glossary edit. If the final decision is load-bearing,
> offer one repository-native ADR covering context, decision, consequences,
> rejected alternatives, and verification/rollback. Add a glossary term only
> if the accepted design depends on a new domain concept.

### Validation — baseline

> Run domain modeling for both decisions. Record the rejected architecture
> option and its constraint in an ADR, add the architecture terms to the
> glossary, and document the chosen color as part of the final design decision
> so the full session has a durable record.

### Validation — candidate

> - Rejected architecture option: offer an ADR because the enduring constraint
>   is load-bearing and future reviews could otherwise re-propose the option.
>   Record the context, rejection decision, constraint, consequences, and the
>   condition that would justify reopening it.
> - Color preference: no ADR and no glossary entry. It is reversible,
>   non-architectural, and can stay in the relevant UI/theme configuration.
> - Glossary: add nothing unless the architecture decision introduced or
>   sharpened a domain term that the implementation depends on.
>
> Keep these documentation changes separate from implementation work and ask
> before writing the ADR.

## improve-codebase-architecture

### Train — baseline

> I would inspect recent history to select the hot subsystem, read `CONTEXT.md`
> and its ADRs, then delegate an Explore pass. The HTML report would rank:
>
> 1. **Strong — deepen the hot module.** Several shallow modules force callers
>    to coordinate behavior. Merge them behind one interface to improve
>    locality and leverage.
> 2. **Worth exploring — add an adapter seam.** Isolate persistence so the
>    module is easier to test.
> 3. **Speculative — split orchestration from policy.**
>
> Each report card would include files, before/after diagrams, benefits, and a
> recommendation. Which candidate would you like to explore?

### Train — candidate

> No confirmed architecture finding can be ranked from the prompt alone. I
> would first use recent history to identify the repeatedly changed subsystem,
> read the relevant ADRs and domain vocabulary, and trace its callers,
> persistence, trust boundaries, UI states, and tests.
>
> A finding becomes **Strong** only when that trace shows repeated friction and
> a small root fix—preferably deletion or consolidation through an existing
> seam. A plausible new adapter or interface without a second implementation or
> observed leak remains **Speculative** and is not recommended.
>
> This is analysis-only. The deliverable would cite exact files, current
> friction, the smallest root-cause change, and one runnable verification; no
> implementation or HTML report is justified until evidence exists.

### Validation — baseline

> Five adapters are a real seam under the "two adapters = real" rule. The top
> recommendation is to consolidate their shared behavior into a deep adapter
> module, leaving thin adapters for external differences. This improves
> locality, creates one interface as the test surface, and removes duplicated
> orchestration. I would present the five before/after diagrams in the required
> temporary HTML report and mark the recommendation **Strong**.

### Validation — candidate

> Five recently touched adapters are a hotspot signal, not proof that
> consolidation is justified.
>
> - **Confirmed:** change frequency spans five adapters. Inspect whether the
>   same policy, error mapping, lifecycle, or persistence choreography changed
>   repeatedly, and cite the matching diffs and callers.
> - **Worth exploring:** consolidate only duplicated behavior whose invariant
>   and tests are genuinely shared. Keep protocol-specific behavior local.
> - **Speculative:** a common base interface or factory based only on similar
>   names and commit frequency. Do not recommend it.
>
> Apply the deletion test to any proposed shared module: deleting it later must
> concentrate complexity rather than scatter the same branching back into five
> callers. The smallest verification is the existing adapter contract tests
> plus one behavior-specific regression check. This remains analysis-only.
