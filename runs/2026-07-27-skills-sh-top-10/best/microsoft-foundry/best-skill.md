---
name: microsoft-foundry
description: Plan, build, deploy, invoke, evaluate, or troubleshoot Microsoft Foundry agents and projects using current official documentation and the workspace's existing Azure configuration. Use for Foundry resources, hosted or prompt agents, models, evaluations, traces, private networking, azd, and Azure AI project workflows.
version: 1.0.0
author: Caro
license: Apache-2.0
tags:
  - azure
  - microsoft-foundry
  - agents
---

# Microsoft Foundry

Fetch current official Microsoft Foundry documentation before giving version-sensitive commands or changing cloud configuration.

## Resolve Context

1. Read repository instructions and locate `azure.yaml`, `.azure/`, `eval.yaml`, and `.foundry/agent-metadata*.yaml` inside the selected agent root.
2. If `azure.yaml` has one `host: azure.ai.agent` service, use its project folder. If several match, ask which service is in scope.
3. Prefer explicit user input, then `azd env get-values`, then the selected `.foundry` metadata overlay.
4. Treat `eval.yaml` as local intent, not proof that a remote suite exists.
5. Never expose credentials or write secrets into skill, metadata, logs, or chat.

## Route the Task

- **Create/deploy hosted agent:** inspect existing `azd` project, prepare, deploy, invoke, then verify.
- **Prompt agent or model:** use the available Foundry/Azure tools and verify the selected project and deployment first.
- **Evaluate/optimize:** freeze baseline, use isolated datasets, validate candidates, and keep the test set untouched.
- **Troubleshoot:** reproduce, inspect deployment/invocation/trace evidence, fix the root cause, redeploy only when authorized, and invoke again.
- **Private networking:** confirm account network configuration before diagnosing caller-side DNS or connectivity.

## Guardrails

- Prefer existing `azd`, Azure CLI, SDK, and project conventions; do not scaffold a parallel setup.
- Treat deploys, resource creation, role changes, model changes, and remote dataset updates as external state changes requiring clear user scope.
- Do not infer release readiness from a successful local build or deployment command.
- Preserve environment separation. Never merge sibling metadata overlays automatically.
- Leave the smallest repeatable verification and report the exact project, environment, and evidence used.

Adapted and substantially condensed for MythOs Aegis from Microsoft's `microsoft-foundry`.
