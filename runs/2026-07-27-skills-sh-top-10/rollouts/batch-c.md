# Batch C Representative Rollouts

Test tasks were not opened. Each output below is a fresh forward simulation from only the named skill version, matching train or validation prompt, and shared rubric.

## TDD

### train-tdd — baseline

> Proposed seam: the shared public command/API entry point that exposes the reported behavior. I would add one behavior-level regression test there, using real boundary dependencies where cheap and mocking only nondeterministic external services.
>
> Before writing the test, please confirm that this is the seam you want covered. Once confirmed, I will run one cycle: failing regression test, minimal implementation, focused test. I will not mock internal collaborators.

### train-tdd — candidate-v1

> I’ll trace the public entry point and every caller first, then reproduce the bug at the narrowest shared seam.
>
> 1. Add one regression test that invokes the public command/API and asserts the externally visible result using an independent expected value.
> 2. Run it and confirm it fails for the reported reason.
> 3. Fix the root cause once in the shared implementation; do not add caller-specific guards.
> 4. Run the focused test, then the nearest integration suite.
>
> Internal collaborators stay real unless they cross an external or nondeterministic boundary. The regression test remains after the fix.

### validation-tdd — baseline

> The likely seam is the public command handler because both the affected UI and sibling callers route through it. The test should submit the same command twice and assert a single externally visible side effect, without asserting internal call counts.
>
> Please confirm that command-handler seam before I write the failing test. After confirmation I will add the one test, make the minimum change needed to pass, and stop the cycle.

### validation-tdd — candidate-v1

> Use the shared command handler as the seam, not the reported UI component. First inspect all callers to confirm they converge there.
>
> Red: through the public command API, issue two rapid equivalent submissions and assert one accepted operation and one persisted side effect. The test must fail against the current handler and must not mock its internal collaborators.
>
> Green: add the smallest deduplication or in-flight guard in the shared handler, keyed by the command’s existing identity semantics. Do not patch individual UIs.
>
> Verify the focused regression, then the handler’s integration suite. Keep the test as the guard for every caller.

## Web Design Guidelines

### train-web-guidelines — baseline

> I need the UI files or a file pattern before I can perform the review and produce `file:line` findings. Please provide the target path. I’ll then fetch the current upstream guidelines and audit those files.

### train-web-guidelines — candidate-v1

> No confirmed file-level defects can be reported without the implementation or runtime. The current route tests prove navigation only; they do not prove the icon actions work.
>
> Runtime risks to reproduce:
>
> - High — icon-only controls: verify an accessible name, keyboard activation, and a visible focus indicator in both themes.
> - High — action state: verify errors are announced and recoverable, busy controls prevent duplicate activation, and state is not conveyed by color alone.
> - Medium — theme coverage: measure text, icon, border, and focus contrast in light and dark modes.
> - Medium — functional coverage: exercise each action, validation/error paths, disabled and loading states, and reload persistence where applicable.
>
> With the target files and a runnable URL, I can convert reproduced defects to `file:line — issue — smallest fix`.

### validation-web-guidelines — baseline

> Please provide the toolbar files or a file pattern. The baseline workflow requires fetching the current guidelines and reading the specified files before issuing `file:line` findings.

### validation-web-guidelines — candidate-v1

> Route smoke tests do not establish functional toolbar coverage. With no code or runtime supplied, these are risks requiring reproduction rather than confirmed defects:
>
> - High — each icon button needs a programmatic name, keyboard operation, and a clearly visible focus indicator in both themes.
> - High — failed actions need an explicit, announced error with a recovery path.
> - High — pending actions need a visible busy state and duplicate-submit prevention; disabled state must remain understandable.
> - Medium — verify icon, focus-ring, error, disabled, and busy contrast separately in light and dark themes.
>
> Smallest next check: exercise every toolbar action by keyboard under success, error, and slow-response conditions in both themes, then map reproduced failures to their exact source lines.

## Microsoft Foundry

### train-foundry — baseline

> I’ll keep this diagnostic read-only.
>
> 1. Read the azd guidance, invoke, and troubleshoot workflow references.
> 2. Resolve the single `host: azure.ai.agent` service from `azure.yaml`, its project folder, selected azd environment, and `azd env get-values`.
> 3. Choose one metadata overlay by explicit environment or filename. Do not merge the two overlays.
> 4. Compare its project endpoint with the azd endpoint. If they differ, stop and ask which is authoritative.
> 5. Reproduce the invocation failure without printing environment values.
> 6. If the error indicates public access is disabled, use a read-only management-plane lookup to inspect `publicNetworkAccess`, network ACLs, and private endpoint status. If access is enabled with empty ACLs, inspect DNS resolution from the caller instead.
>
> No deploy, metadata write, role change, or network change will be made. I will report the selected service, environment, overlay, redacted endpoint host, and evidence supporting either account isolation or caller-side connectivity.

### train-foundry — candidate-v1

> Diagnosis only; no cloud or metadata mutation.
>
> - Resolve the hosted-agent root from the matching `azure.yaml` service.
> - Select one environment and one `.foundry/agent-metadata.<env>.yaml` overlay; keep the sibling overlay untouched.
> - Prefer the explicit target, then redacted `azd env get-values`, and surface any endpoint conflict before continuing.
> - Reproduce the failure without echoing credentials.
> - Confirm network state with a read-only account lookup. Disabled or restricted public access points to VNet isolation; enabled public access with empty ACLs shifts the check to caller DNS and routing.
>
> The result will name the service, environment, overlay, redacted endpoint host, and observed network evidence. Deploy, RBAC, resource, model, and dataset changes are out of scope.

### validation-foundry — baseline

> Context cannot be selected safely yet.
>
> - `azure.yaml` contains two `host: azure.ai.agent` services, so choose the target service/project folder first.
> - For that service, resolve the azd environment and read its values without printing secrets.
> - Select only the matching metadata overlay.
> - The azd and metadata project endpoints conflict. Stop and ask which source is authoritative; do not rewrite, merge, provision, or deploy.
>
> Please provide the target service and confirm whether azd or the selected metadata endpoint is authoritative.

### validation-foundry — candidate-v1

> Deployment is blocked on two explicit context choices:
>
> 1. Which of the two `host: azure.ai.agent` services is the target? That selects the agent root.
> 2. The selected service’s azd endpoint conflicts with its metadata overlay. Which source is authoritative for this run?
>
> Until both are answered, I will not deploy, scaffold, merge overlays, or write metadata. After selection, I’ll resolve the environment from the chosen service, verify the endpoint without exposing credentials, and report the exact service, environment, and overlay used.
