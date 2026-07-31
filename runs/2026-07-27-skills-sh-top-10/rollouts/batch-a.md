# Batch A Representative Rollouts

Scope: `find-skills`, `frontend-design`, `grill-me`, and `agent-browser`.
Only train and validation prompts were used. The test split was not opened.

## find-skills

### Train — baseline

Trajectory:

1. Interpreted "REST API review" as a skills.sh discovery request.
2. Followed the upstream sequence of leaderboard/search/quality checks.
3. Did not inspect `.agents/skills/` before recommending an external skill.
4. Offered a global installation command without reconciling `agents.json`.

Final output:

> I found a REST API review skill that looks relevant. Before installing it,
> check its install count, repository stars, and source reputation.
>
> To install it globally:
>
> `npx skills add <owner/repo@rest-api-review> -g -y`
>
> I can install it for you if you want.

### Train — candidate

Trajectory:

1. Inspected `agents.json` and `.agents/skills/`.
2. Found `.agents/skills/rest-api-best-practices/` already present.
3. Chose reuse over search or installation.
4. Noted that the inventory is stale because the existing skill is absent from
   `agents.json`.

Final output:

> Skip installation: this harness already contains
> `.agents/skills/rest-api-best-practices/`, which covers REST API review.
> Adding another skill would duplicate capability.
>
> The useful follow-up is to add the existing skill to `agents.json` (and the
> README inventory if applicable), then run `node scripts/skill-guard.mjs`.
> No new package or global CLI is needed.

### Validation — baseline

Trajectory:

1. Treated popularity and source reputation as the primary decision criteria.
2. Acknowledged overlap only as a secondary concern.
3. Recommended the popular option after hypothetical quality checks.
4. Presented a global CLI installation path.

Final output:

> The skill is popular, so I would recommend it if its repository has a
> reputable maintainer, 1K+ installs, and healthy GitHub activity. Install it
> with the package's global `npx skills add ... -g -y` command.
>
> You may want to compare it with the installed skill first.

### Validation — candidate

Trajectory:

1. Inspected the installed inventory before considering popularity.
2. Treated overlap and the new global CLI as explicit costs.
3. Found no evidence that the popular skill adds a unique required capability.
4. Chose a no-op and preserved the current harness.

Final output:

> Skip it. Popularity does not justify duplicating an installed harness skill,
> and the required global CLI adds another dependency and permission surface.
>
> Reconsider only if the candidate provides a concrete capability the installed
> skill cannot cover. Until then, use the existing local skill and make no
> inventory change.

## frontend-design

### Train — baseline

Trajectory:

1. Grounded the design in a work-management product.
2. Proposed a distinct visual signature and compact token plan.
3. Included keyboard focus, reduced motion, and mobile responsiveness.
4. Did not explicitly preserve the current tokens, existing component kit, or
   state semantics across light and dark themes.

Final output:

> Direction: a "control-room ledger" with a strong display face, compact body
> type, ruled sections, and one animated progress rail as the signature.
>
> Use a restrained charcoal, paper, amber, blue, and red palette. Group work by
> owner, show active items first, and replace decorative cards with a denser
> ledger. Keep keyboard focus visible, respect reduced motion, and verify mobile.

### Train — candidate

Trajectory:

1. Started with the current UI, semantic tokens, component kit, and real work
   states.
2. Preserved the framework and existing theme layer.
3. Made ownership, current worker, active action, progress, feedback, and next
   action explicit in the hierarchy and copy.
4. Included desktop/mobile, keyboard, icon-label, contrast, and state checks.

Final output:

> Keep the current framework, components, and semantic tokens. Reshape the
> screen around one compact work ledger:
>
> - Owner and current worker are text labels in the row header, not color-only.
> - The active action, live progress, latest feedback, and valid next action sit
>   in one consistent status column.
> - Icon-only controls keep visible focus and accessible names/tooltips.
> - Existing light/dark tokens are checked for text, muted text, borders, focus,
>   status, and disabled contrast.
>
> Implement one representative work row first, inspect desktop and mobile, then
> extend the proven pattern. Verify loading, empty, error, and completed states.

### Validation — baseline

Trajectory:

1. Proposed a product-specific CRM direction rather than a generic template.
2. Used typography, hierarchy, and one visual signature deliberately.
3. Mentioned accessibility basics.
4. Did not explicitly bind the direction to Tailwind tokens and brand assets,
   and left room for parallel typography/theme choices.

Final output:

> Use an "account dossier" direction: dense typographic rows, sharp dividers,
> and a single relationship-thread visualization as the signature. Keep the
> palette restrained, strengthen the type scale, reduce excess cards, and make
> the most important account state dominant.
>
> Preserve keyboard focus and responsive behavior, and critique the result in
> both themes before shipping.

### Validation — candidate

Trajectory:

1. Inspected the current Tailwind token vocabulary, brand assets, components,
   and dashboard states before proposing changes.
2. Reused the framework and theme layer.
3. Reduced card sprawl while preserving dense operational content.
4. Defined light/dark, keyboard, icon-control, status, and responsive checks.

Final output:

> Keep Tailwind and the existing semantic tokens. Use the current brand mark and
> assets as the visual anchor; do not introduce a new component framework,
> font package, or parallel theme.
>
> Consolidate repeated cards into a compact account grid with a pinned identity
> column, explicit owner and stage labels, readable numeric alignment, and one
> product-grounded relationship strip as the signature. Keep filters and the
> next valid action visible without inflating the header.
>
> Validate keyboard order, focus visibility, accessible names for icon buttons,
> non-color status cues, muted-text and border contrast in light/dark modes,
> mobile reflow, loading, empty, and error states.

## grill-me

### Train — baseline

Trajectory:

1. Followed the skill's only instruction literally.
2. Attempted to delegate to an undefined `/grilling` command.
3. Produced no scoped interview or default recommendation.

Final output:

> `/grilling`

### Train — candidate

Trajectory:

1. Classified the settings-panel choice as reversible and low impact.
2. Restated the outcome and strongest assumption.
3. Asked one execution-changing question and supplied a default.
4. Avoided reopening the full proposal.

Final output:

> Outcome: simplify the settings panel without changing its underlying settings
> model. Constraint: the choice is reversible. Assumption: the current grouping
> is the main usability problem.
>
> Which single user action is currently hardest to find?
>
> If there is no evidence yet, default to preserving all controls and changing
> only grouping and labels in one screen slice.

### Validation — baseline

Trajectory:

1. Invoked the undefined `/grilling` command despite an approved plan.
2. Did not isolate the remaining rollback ambiguity.
3. Did not hand off an executable next slice.

Final output:

> `/grilling`

### Validation — candidate

Trajectory:

1. Preserved the approved plan and isolated the sole open execution choice.
2. Asked one question whose answer changes rollback implementation.
3. Supplied a reversible default and an immediate next slice.

Final output:

> The plan remains approved. One execution choice is open:
>
> Must rollback restore both the previous data and the previous UI/config
> version, or is restoring the data alone sufficient?
>
> Default if unanswered: version both together so rollback cannot create a
> schema/UI mismatch. Next slice: implement the migration behind a reversible
> flag, add the paired rollback check, and stop for verification.

## agent-browser

### Train — baseline

Trajectory:

1. Preferred the external `agent-browser` CLI over the browser capability
   allowed by the task.
2. Attempted to load CLI-hosted instructions.
3. The CLI was not established as installed, so the rollout stopped before the
   authenticated flow was inspected.

Final output:

> I need to load the current browser workflow first:
>
> `agent-browser skills get core --full`
>
> If the command is unavailable, install it with
> `npm i -g agent-browser && agent-browser install`.

### Train — candidate

Trajectory:

1. Selected the existing authenticated Chrome route.
2. Refused to invent a target because no URL, form, or account boundary was
   supplied in the prompt.
3. Produced the exact verification matrix that would be executed once the
   target is provided.

Final output:

> I can run this through the existing logged-in Chrome session, but no target
> URL or form was supplied, so I cannot honestly report a verified result.
>
> Once provided, I will verify: initial state, required/invalid input, successful
> submit, rapid duplicate submit protection, visible success/error feedback,
> and persistence after reload. I will capture the final URL plus state evidence
> and will not submit outside the authorized test target.

### Validation — baseline

Trajectory:

1. Routed away from the user's existing Chrome session to the external CLI.
2. Suggested installing the CLI when unavailable.
3. Did not establish that the CLI shared the authenticated session.
4. Did not implement the required URL-verification stop.

Final output:

> I will use `agent-browser` for this. First run
> `agent-browser skills get core`; if needed, install the CLI globally. Then I
> can open the form and inspect it through the browser session.

### Validation — candidate

Trajectory:

1. Selected Chrome control because the task depends on the user's existing
   cookies and login.
2. Attempted to inspect the current URL before interacting.
3. URL verification was unavailable in the representative environment.
4. Stopped without clicking, typing, or submitting.

Final output:

> Stopped safely: I could not verify the current Chrome URL, so I did not inspect
> or interact with the form. No clicks, typing, or submissions were performed.
>
> Resume only after the current tab URL is visible and matches the authorized
> target.
