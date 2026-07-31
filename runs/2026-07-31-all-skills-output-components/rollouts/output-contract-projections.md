# Output Contract Projections

These are deterministic synthetic projections of each skill's output contract.
They verify instruction coverage and composition behavior; they are not live
production-model telemetry.

| Skill | Profile | Baseline validation | Final validation | Baseline test | Final test | Test delta |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| academix | research | 0.8000 | 1.0000 | 0.8000 | 1.0000 | +0.2000 |
| agent-browser | execution | 0.4450 | 1.0000 | 0.4900 | 1.0000 | +0.5100 |
| apocalypse | review | 0.8500 | 1.0000 | 0.8500 | 1.0000 | +0.1500 |
| aria-apg-review | review | 0.8500 | 1.0000 | 0.8500 | 1.0000 | +0.1500 |
| crawler-readiness-audit | review | 0.7450 | 1.0000 | 0.7900 | 1.0000 | +0.2100 |
| decision-criticality-gate | decision | 0.7450 | 1.0000 | 0.7900 | 1.0000 | +0.2100 |
| fact-checker | research | 0.9500 | 1.0000 | 0.9500 | 1.0000 | +0.0500 |
| find-skills | decision | 0.6450 | 1.0000 | 0.6900 | 1.0000 | +0.3100 |
| frontend-design | plan | 0.4050 | 1.0000 | 0.4500 | 1.0000 | +0.5500 |
| grill-me | decision | 0.7000 | 1.0000 | 0.7000 | 1.0000 | +0.3000 |
| grill-with-docs | decision | 0.6550 | 1.0000 | 0.7000 | 1.0000 | +0.3000 |
| humanizer | artifact | 0.8000 | 1.0000 | 0.8000 | 1.0000 | +0.2000 |
| improve-codebase-architecture | review | 0.5950 | 1.0000 | 0.6400 | 1.0000 | +0.3600 |
| microsoft-foundry | execution | 0.2950 | 1.0000 | 0.3400 | 1.0000 | +0.6600 |
| output-templates | direct | 0.5950 | 1.0000 | 0.6400 | 1.0000 | +0.3600 |
| pre-launch-security-gate | review | 0.8500 | 1.0000 | 0.8500 | 1.0000 | +0.1500 |
| prompt-preflight | artifact | 0.5950 | 1.0000 | 0.6400 | 1.0000 | +0.3600 |
| quick-recap | status | 0.9500 | 1.0000 | 0.9500 | 1.0000 | +0.0500 |
| rest-api-best-practices | review | 0.7450 | 1.0000 | 0.7900 | 1.0000 | +0.2100 |
| rigorous-response | direct | 0.9500 | 1.0000 | 0.9500 | 1.0000 | +0.0500 |
| shepherd | execution | 0.6000 | 1.0000 | 0.6000 | 1.0000 | +0.4000 |
| skill-optimizer | optimization | 0.2900 | 1.0000 | 0.2900 | 1.0000 | +0.7100 |
| tdd | execution | 0.3000 | 1.0000 | 0.3000 | 1.0000 | +0.7000 |
| ux-logic-loop | execution | 0.5000 | 1.0000 | 0.5000 | 1.0000 | +0.5000 |
| ux-pattern-review | review | 0.8500 | 1.0000 | 0.8500 | 1.0000 | +0.1500 |
| vercel-react-best-practices | review | 0.1400 | 1.0000 | 0.1400 | 1.0000 | +0.8600 |
| visual-flow-storyboard | plan | 0.3500 | 1.0000 | 0.3500 | 1.0000 | +0.6500 |
| visual-pr-review | review | 0.9500 | 1.0000 | 0.9500 | 1.0000 | +0.0500 |
| web-design-guidelines | review | 0.4950 | 1.0000 | 0.5400 | 1.0000 | +0.4600 |

All candidate integrations preserve the complete baseline skill and add one
bounded shared-profile mapping. The final test was opened only after all 29
validation decisions were frozen.
