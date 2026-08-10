# MythOs Aegis

MythOs Aegis is a library of reusable skills for agentic coding work. Start
with the task finder below, then open the linked `SKILL.md` for the complete
workflow. [`agents.json`](./agents.json) is the canonical machine-readable
inventory.

## Find the right skill

| I need to... | Start with | Expected result |
| --- | --- | --- |
| Research a topic or review literature | [Academix](./.agents/skills/academix/SKILL.md) | Source-backed research with citations |
| Verify claims, dates, numbers, or quotes | [Fact Checker](./.agents/skills/fact-checker/SKILL.md) | Supported, corrected, or explicitly unresolved claims |
| Make replies action-first and easy to scan | [Focus-Friendly Output](./.agents/skills/focus-friendly-output/SKILL.md) | Low-cognitive-load responses with visible progress and bounded next steps |
| Use a website or test a rendered UI | [Agent Browser](./.agents/skills/agent-browser/SKILL.md) | Browser work routed through an available automation tool |
| Design or reshape an interface | [Frontend Design](./.agents/skills/frontend-design/SKILL.md) | Accessible UI that preserves the product architecture and brand |
| Build or operate LLM routing, caching, evaluation, tracing, or doc repair | [AI Engineering Platform](./.agents/skills/ai-engineering-platform/SKILL.md) | One executable platform with configuration-gated Harness startup and held-out, draft-PR-only improvement |
| Generate a screen or address a focused UI concern | [UI UX Generation](./.agents/skills/ui-ux-generation/SKILL.md) for routing, or use the matching UI UX specialist listed below directly | Coherent UI generation with testable specialist behavior |
| Audit accessibility or interaction quality | [ARIA APG Review](./.agents/skills/aria-apg-review/SKILL.md) for widget behavior; [Web Design Guidelines](./.agents/skills/web-design-guidelines/SKILL.md) for the broader interface | Actionable accessibility and usability findings |
| Reconstruct or test a complete user journey | [Visual Flow Storyboard](./.agents/skills/visual-flow-storyboard/SKILL.md) for mapping; [UX & Logic Loop](./.agents/skills/ux-logic-loop/SKILL.md) for persistent test-and-fix work | An evidence-based journey map or verified story matrix |
| Review a pull request before implementation | [Visual PR Review](./.agents/skills/visual-pr-review/SKILL.md) | Reconstructed architecture, findings, and an implementation plan |
| Improve codebase architecture | [Improve Codebase Architecture](./.agents/skills/improve-codebase-architecture/SKILL.md) | Prioritized refactor candidates grounded in repository evidence |
| Design or review a REST API | [REST API Best Practices](./.agents/skills/rest-api-best-practices/SKILL.md) | Predictable HTTP contracts and focused verification |
| Check release security | [Pre-Launch Security Gate](./.agents/skills/pre-launch-security-gate/SKILL.md) | A release-focused security verdict and required fixes |
| Implement a feature or bug fix test-first | [TDD](./.agents/skills/tdd/SKILL.md) | A small red-green slice with a runnable regression guard |
| Challenge a plan or decision | [Grill Me](./.agents/skills/grill-me/SKILL.md) for an interview; [Apocalypse](./.agents/skills/apocalypse/SKILL.md) for a pre-mortem; [Decision Criticality Gate](./.agents/skills/decision-criticality-gate/SKILL.md) for proportional rigor | Exposed assumptions, risks, and a clearer decision |
| Execute a risky or long-running change safely | [Shepherd](./.agents/skills/shepherd/SKILL.md) | Reversible steps, checkpoints, and recovery rules |
| Rewrite German or English prose naturally | [Humanizer](./.agents/skills/humanizer/SKILL.md) | Natural wording without changing facts or protected structure |
| Work with Microsoft Foundry | [Microsoft Foundry](./.agents/skills/microsoft-foundry/SKILL.md) | Current, documented agent and project workflows |
| Find or improve a reusable skill | [Find Skills](./.agents/skills/find-skills/SKILL.md) to discover one; [Skill Optimizer](./.agents/skills/skill-optimizer/SKILL.md) to improve one | Reuse before duplication, or measured skill optimization |

If more than one row fits, choose the skill that owns the main deliverable and
add a second skill only for a distinct concern such as security or browser
verification.

## Skills

### Research and evidence

- `.agents/skills/academix/` for [Academix](./.agents/skills/academix/SKILL.md): academic research, literature reviews, citations, and source evaluation
- `.agents/skills/fact-checker/` for [Fact Checker](./.agents/skills/fact-checker/SKILL.md): independent claim verification and correction

### Web, UI, and product flows

- `.agents/skills/agent-browser/` for [Agent Browser](./.agents/skills/agent-browser/SKILL.md): browser automation and functional UI verification through available tools
- `.agents/skills/aria-apg-review/` for [ARIA APG Review](./.agents/skills/aria-apg-review/SKILL.md): reviewing widgets against applicable WAI-ARIA APG patterns
- `.agents/skills/crawler-readiness-audit/` for [Crawler Readiness Audit](./.agents/skills/crawler-readiness-audit/SKILL.md): crawler readability, SSR, metadata, and indexability
- `.agents/skills/frontend-design/` for [Frontend Design](./.agents/skills/frontend-design/SKILL.md): distinctive accessible interfaces that preserve architecture and tokens
- `.agents/skills/ui-ux-component-quality/` for [UI UX Component Quality](./.agents/skills/ui-ux-component-quality/SKILL.md): component geometry, labels, selection, targets, readability, and decision metadata
- `.agents/skills/ui-ux-color-contrast/` for [UI UX Color Contrast](./.agents/skills/ui-ux-color-contrast/SKILL.md): measured contrast, semantic color roles, and redundant status cues
- `.agents/skills/ui-ux-design-systems/` for [UI UX Design Systems](./.agents/skills/ui-ux-design-systems/SKILL.md): foundations, tokens, spacing, grids, iconography, motion, component contracts, documentation, and governance
- `.agents/skills/ui-ux-dropdowns/` for [UI UX Dropdowns](./.agents/skills/ui-ux-dropdowns/SKILL.md): obvious, accessible, viewport-safe, and scalable dropdown controls
- `.agents/skills/ui-ux-form-validation/` for [UI UX Form Validation](./.agents/skills/ui-ux-form-validation/SKILL.md): humane validation timing, recovery, errors, and positive field feedback
- `.agents/skills/ui-ux-generation/` for [UI UX Generation](./.agents/skills/ui-ux-generation/SKILL.md): routing screen and flow generation through focused specialist skills
- `.agents/skills/ui-ux-loading-states/` for [UI UX Loading States](./.agents/skills/ui-ux-loading-states/SKILL.md): stable skeleton, spinner, progress, timeout, and retry behavior
- `.agents/skills/ui-ux-mobile-css/` for [UI UX Mobile CSS](./.agents/skills/ui-ux-mobile-css/SKILL.md): stable mobile scrolling, focus, tap, viewport, and form-control behavior
- `.agents/skills/ui-ux-typography/` for [UI UX Typography](./.agents/skills/ui-ux-typography/SKILL.md): readable type scales, line height, text measure, wrapping, and resizing
- `.agents/skills/ux-logic-loop/` for [UX & Logic Loop](./.agents/skills/ux-logic-loop/SKILL.md): persistent feature inventory, story matrices, and test loops
- `.agents/skills/ux-pattern-review/` for [UX Pattern Review](./.agents/skills/ux-pattern-review/SKILL.md): evidence-backed review of product flows, pattern fit, alternatives, states, and recovery
- `.agents/skills/vercel-react-best-practices/` for [Vercel React Best Practices](./.agents/skills/vercel-react-best-practices/SKILL.md): measured React and Next.js performance work
- `.agents/skills/visual-flow-storyboard/` for [Visual Flow Storyboard](./.agents/skills/visual-flow-storyboard/SKILL.md): reconstructing complete user journeys from code
- `.agents/skills/visual-pr-review/` for [Visual PR Review](./.agents/skills/visual-pr-review/SKILL.md): pull-request analysis, architecture reconstruction, and implementation planning
- `.agents/skills/web-design-guidelines/` for [Web Design Guidelines](./.agents/skills/web-design-guidelines/SKILL.md): accessibility, interaction, responsive, and functional UI audits

### Engineering, APIs, security, and platforms

- `.agents/skills/ai-engineering-platform/` for [AI Engineering Platform](./.agents/skills/ai-engineering-platform/SKILL.md): OpenAI-compatible routing, pgvector caching, model regression, failure traces, self-healing Markdown docs, and bounded policy improvement
- `.agents/skills/improve-codebase-architecture/` for [Improve Codebase Architecture](./.agents/skills/improve-codebase-architecture/SKILL.md): evidence-backed architecture reviews and refactor candidates
- `.agents/skills/microsoft-foundry/` for [Microsoft Foundry](./.agents/skills/microsoft-foundry/SKILL.md): Microsoft Foundry agents, projects, deployments, and evaluations
- `.agents/skills/pre-launch-security-gate/` for [Pre-Launch Security Gate](./.agents/skills/pre-launch-security-gate/SKILL.md): security review before release
- `.agents/skills/rest-api-best-practices/` for [REST API Best Practices](./.agents/skills/rest-api-best-practices/SKILL.md): predictable, secure REST and HTTP contracts
- `.agents/skills/tdd/` for [TDD](./.agents/skills/tdd/SKILL.md): behavior-first implementation slices and regression guards

### Decisions, planning, and safe execution

- `.agents/skills/apocalypse/` for [Apocalypse](./.agents/skills/apocalypse/SKILL.md): pre-mortems, failure chains, and recovery planning
- `.agents/skills/decision-criticality-gate/` for [Decision Criticality Gate](./.agents/skills/decision-criticality-gate/SKILL.md): classifying decisions by reversibility, blast radius, trust impact, and urgency
- `.agents/skills/grill-me/` for [Grill Me](./.agents/skills/grill-me/SKILL.md): focused decision interviews without unnecessary ceremony
- `.agents/skills/grill-with-docs/` for [Grill With Docs](./.agents/skills/grill-with-docs/SKILL.md): decision interviews with proportional ADR, specification, acceptance-criteria, and glossary updates
- `.agents/skills/shepherd/` for [Shepherd](./.agents/skills/shepherd/SKILL.md): reversible execution, checkpoints, recovery, and supervisor guardrails

### Writing and harness operations

- `.agents/skills/find-skills/` for [Find Skills](./.agents/skills/find-skills/SKILL.md): discovering reusable skills without duplicating harness capability
- `.agents/skills/focus-friendly-output/` for [Focus-Friendly Output](./.agents/skills/focus-friendly-output/SKILL.md): action-first, low-cognitive-load replies with visible progress and bounded next steps
- `.agents/skills/humanizer/` for [Humanizer](./.agents/skills/humanizer/SKILL.md): natural German and English prose that preserves facts and author voice
- `.agents/skills/output-templates/` for [Output Templates](./.agents/skills/output-templates/SKILL.md): shared response structures for recurring agent tasks
- `.agents/skills/prompt-preflight/` for [Prompt Preflight](./.agents/skills/prompt-preflight/SKILL.md): silently refining ambiguous requests before execution
- `.agents/skills/quick-recap/` for [Quick Recap](./.agents/skills/quick-recap/SKILL.md): required one-line status footers for substantive responses
- `.agents/skills/rigorous-response/` for [Rigorous Response](./.agents/skills/rigorous-response/SKILL.md): clear assumptions, premise checks, and concise critical reasoning
- `.agents/skills/skill-optimizer/` for [Skill Optimizer](./.agents/skills/skill-optimizer/SKILL.md): measured optimization of Markdown-based skills

## EU AI Act context

> **Voluntary project designation:** AI-assisted development tooling — human
> oversight required.

This repository primarily contains instructions, prompts, and validation
metadata for coding agents. It also includes an optional, inactive-by-default
AI engineering runtime that calls configured model providers. EU AI Act
obligations depend on the activated integrating system, the provider or deployer role,
the generated output, and the concrete use case. Article 50 establishes
transparency duties for providers and deployers of certain AI systems, rather
than a universal compliance badge for AI-related repositories.

This designation is a transparency note, not a claim of conformity,
certification, legal advice, or final risk classification. Anyone integrating
these skills must assess the resulting system and use case separately.
This repository-level notice does not replace disclosures, technical markings,
or other obligations that apply to an integrating AI system or its outputs.
Providers and deployers may also need operational measures such as AI literacy
under Article 4; those duties belong in the integrating organization's
governance and deployment, not in repository metadata.

Legal context reviewed **31 July 2026**. The European Commission lists
**2 August 2026** as the Regulation's general application date, with staged
exceptions. Check the official sources for later changes:

- [Regulation (EU) 2024/1689 — official text on EUR-Lex](https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng)
- [Article 4 — AI literacy](https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-4)
- [Article 50 — AI Act Service Desk](https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-50)
- [European Commission overview and application timeline](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai)

## License and third-party material

MythOs Aegis is distributed under the [Apache License 2.0](./LICENSE).
Copyright and attribution information is recorded in [NOTICE](./NOTICE).
Adapted material, pinned upstream sources, modification notices, and retained
license terms are documented in [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).

## Use and maintain the library

1. Find the task above and open the linked `SKILL.md`.
2. Follow that skill's triggers, workflow, output contract, and checks.
3. Treat [`agents.json`](./agents.json) as the inventory source of truth.
4. Keep each skill in `.agents/skills/<skill-name>/` and preserve the canonical
   frontmatter key order.
5. Run `node scripts/skill-guard.mjs` before committing to catch missing skills,
   invalid frontmatter, and inventory drift.

Canonical frontmatter:

```yaml
---
name: <slug>
description: <short summary>
version: <semantic version>
author: Caro
license: Apache-2.0
tags:
  - <topic>
---
```

Optional metadata such as `triggers`, `capabilities`, `outputs`, `modes`,
`requires`, `optional`, and `constraints` follows `tags` when relevant.

## Repository layout

```text
.
|-- .agents/skills/   # one directory per skill
|   `-- ai-engineering-platform/ # optional executable AI engineering MVPs
|-- .codex/hooks.json # trusted SessionStart hook for configuration-gated platform reuse
|-- .github/workflows/ci.yml
|-- scripts/skill-guard.mjs
|-- AGENTS.md         # workspace-level instructions
|-- LICENSE
|-- NOTICE
|-- THIRD_PARTY_NOTICES.md
|-- agents.json       # canonical skill inventory
`-- README.md         # human-readable task and skill map
```
