# Batch C Reflections

## Decision

Accept all three candidates on held-out validation.

| Skill | Baseline validation | Candidate validation | Delta | Critical regression |
| --- | ---: | ---: | ---: | --- |
| tdd | 0.684 | 0.983 | +0.299 | No |
| web-design-guidelines | 0.611 | 0.964 | +0.353 | No |
| microsoft-foundry | 0.919 | 0.979 | +0.060 | No |

## TDD

The baseline protects behavior-level testing and avoids internal mocks, but its unconditional seam-confirmation gate blocks progress even when the request and repository flow already identify the seam. It also lacks an explicit all-callers/root-cause instruction. The candidate preserves the useful test-quality rules while making seam selection conditional, tracing callers, and requiring focused plus broader verification.

Protected behavior: public-interface assertions, independent expected values, one red-green slice, no internal collaborator mocks.

Remaining risk: the candidate names UI state categories broadly; agents should apply only states relevant to the actual behavior rather than expanding every fix into full UI coverage.

## Web Design Guidelines

The baseline is safe against fabricated findings but becomes a one-line request for files when the prompt already supplies meaningful audit conditions. It also assumes source inspection is enough. The candidate correctly treats rendered focus, contrast, overflow, and action states as runtime evidence and separates confirmed defects from unverified risks. This matches the user's preference for functional UI coverage beyond route smoke tests.

Protected behavior: fetch current upstream guidance, inspect actual target files, keep findings actionable and source-located.

Remaining risk: the candidate's checklist is intentionally broad. Severity still depends on reproduction and user impact; absent runtime evidence must remain a risk, not a confirmed defect.

## Microsoft Foundry

The baseline is already strong and safety-complete. Its advantage is explicit workflow routing and exact conflict resolution, but much of the document is unrelated to either task. The candidate retains the tested essentials: select one service/root, preserve overlay separation, prefer existing azd context, stop on ambiguity or endpoint conflict, redact credentials, and avoid unauthorized remote changes. It reaches the same safe answer with substantially less ceremony.

Protected behavior: current official documentation for version-sensitive commands, explicit scope for cloud mutations, environment isolation, no secret exposure, and evidence-backed verification.

Remaining risk: the condensed candidate no longer names every specialized Microsoft workflow document. For uncommon fine-tuning, quota, RBAC, or WebSocket tasks, current official documentation becomes more important and should be fetched before action.

## Aggregate

Baseline validation averaged 0.738; candidate validation averaged 0.975, a +0.237 gain. No candidate weakened authorization, safety, data-loss protection, or test isolation. The test split remained unopened.
