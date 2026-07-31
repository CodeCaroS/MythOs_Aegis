# Batch C Final Test Rollouts

Validation and best-skill selection were frozen before these test prompts were opened.

## TDD — test-tdd

### Baseline

> Proposed seam: the public settings save flow followed by a fresh page or session reload. The test will save a value, reload, and assert the value through the same public UI or API; it will not query database tables or inspect repository internals.
>
> Please confirm this seam before I write the failing test. Once confirmed, I will add one red-green slice and only enough implementation to make it pass.

### Best

> Use the public save-and-reload flow as the seam.
>
> 1. Trace the save command and reload/read path to their shared persistence boundary.
> 2. Red: save a changed setting through the public interface, create a fresh page/session, reload, and assert the setting is still visible through that interface. Do not query the database or assert internal calls.
> 3. Green: make the smallest root-cause fix in the shared persistence or hydration path.
> 4. Run the focused regression, then the nearest settings integration or browser gate.
>
> Keep the test as the reload-persistence guard.

Result: baseline 0.709; final 0.976; delta +0.267. Both hard-pass safety and isolation constraints.

## Web Design Guidelines — test-web-guidelines

### Baseline

> Please provide the responsive settings-page files or a file pattern. I will fetch the current guidelines, read those files, and return terse `file:line` findings.

### Best

> The source may support accessible semantics, but overflow and focus order are not confirmed without rendered behavior. No defect should be reported as proven yet.
>
> Runtime risks to reproduce:
>
> - High — keyboard focus order may diverge from the visual order at responsive breakpoints; tab through the page at narrow, medium, and wide widths.
> - High — controls or action bars may clip, overlap, or create two-axis scrolling under narrow width, zoom, long labels, and validation errors.
> - Medium — focus may move into collapsed or off-screen content after responsive layout changes.
>
> Use the existing design system. With a runnable page and target files, map only reproduced failures to `file:line — issue — smallest fix`.

Result: baseline 0.630; final 0.966; delta +0.336. Both hard-pass safety and authorization constraints.

## Microsoft Foundry — test-foundry

### Baseline

> Plan only; do not create or update remote state.
>
> 1. Read azd guidance and the observe workflow.
> 2. Resolve the existing `host: azure.ai.agent` service, selected azd environment, project endpoint, agent name/version, metadata overlay, and `eval.yaml`.
> 3. Treat `eval.yaml` as local intent until remote suites and datasets are verified.
> 4. Freeze agent version, evaluator configuration, and disjoint training, validation, and test datasets. Use training for changes, validation for selection, and open test only once after the final candidate is frozen.
> 5. Draft the evaluation locally. Ask before registering datasets, creating or updating suites, or starting remote evaluation.
> 6. Record exact project, environment, agent version, dataset versions, evaluators, thresholds, and results.

### Best

> Keep this as a read-only plan until external changes are authorized.
>
> 1. Reuse the selected hosted-agent service from `azure.yaml`, its azd environment values, existing `.foundry` overlay, and `eval.yaml`; do not scaffold parallel config.
> 2. Freeze the agent baseline, evaluators, pass threshold, and disjoint train, validation, and test datasets. Treat `eval.yaml` as intent, not proof of registered remote assets.
> 3. Run baseline and candidate on identical settings. Use train for iteration, validation for selection, and keep test untouched until the final candidate is frozen.
> 4. Prepare the exact remote operations separately. Get explicit authorization before dataset registration or refresh, suite creation or update, billable evaluation runs, or metadata writes.
> 5. Report the project, environment, agent version, dataset versions, evaluator versions, scores, regressions, and evidence without exposing credentials.

Result: baseline 0.908; final 0.978; delta +0.070. Both hard-pass authorization, safety, and dataset-isolation constraints.
