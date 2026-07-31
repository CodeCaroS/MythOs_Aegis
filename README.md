# MythOs Aegis

MythOs Aegis is a repository of skills for agentic coding work.

The canonical inventory lives in [`agents.json`](./agents.json). This README is
the human-readable map of the same set.

## Skills

- `.agents/skills/academix/` for academic research, literature reviews, and source evaluation
- `.agents/skills/agent-browser/` for routing browser automation and functional UI verification
- `.agents/skills/apocalypse/` for pre-mortems, risk analysis, and failure chains
- `.agents/skills/aria-apg-review/` for reviewing UI widgets against every applicable WAI-ARIA APG pattern
- `.agents/skills/crawler-readiness-audit/` for crawler readability, SSR, metadata, and indexability
- `.agents/skills/decision-criticality-gate/` for classifying decisions by reversibility, blast radius, trust impact, and urgency
- `.agents/skills/fact-checker/` for claim verification and correction
- `.agents/skills/find-skills/` for discovering reusable skills without duplicating harness capability
- `.agents/skills/frontend-design/` for distinctive accessible interfaces that preserve product architecture
- `.agents/skills/grill-me/` for focused decision interviews without unnecessary planning ceremony
- `.agents/skills/grill-with-docs/` for decision interviews with proportional ADR and glossary updates
- `.agents/skills/humanizer/` for natural German and English prose that preserves facts and author voice
- `.agents/skills/improve-codebase-architecture/` for evidence-backed architecture reviews and refactor candidates
- `.agents/skills/microsoft-foundry/` for safe Microsoft Foundry agent and project workflows
- `.agents/skills/output-templates/` for shared response templates for recurring agent tasks
- `.agents/skills/pre-launch-security-gate/` for security review before release
- `.agents/skills/prompt-preflight/` for silent prompt refinement before execution
- `.agents/skills/quick-recap/` for mandatory end-of-response status footers
- `.agents/skills/rest-api-best-practices/` for predictable and secure REST/HTTP API contracts
- `.agents/skills/rigorous-response/` for concise reasoning and premise checks
- `.agents/skills/shepherd/` for reversible execution, checkpoints, and recovery
- `.agents/skills/skill-optimizer/` for optimizing Markdown-based skills
- `.agents/skills/tdd/` for small behavior-first red-green implementation slices
- `.agents/skills/ux-logic-loop/` for user-story inventory and test loops
- `.agents/skills/ux-pattern-review/` for reviewing product flows and UI pattern choices against uxpatterns.dev
- `.agents/skills/vercel-react-best-practices/` for measured React and Next.js performance work
- `.agents/skills/visual-flow-storyboard/` for user-journey reconstruction
- `.agents/skills/visual-pr-review/` for pull-request review and implementation planning
- `.agents/skills/web-design-guidelines/` for accessibility and functional web UI audits

## Canonical Skill Frontmatter

Every `SKILL.md` uses the same frontmatter shape:

```yaml
---
name: <slug>
description: <short summary>
version: <semantic version>
author: Caro
license: Apache-2.0
tags:
  - <topic>
  - <topic>
# optional sections when relevant:
# triggers:
# capabilities:
# outputs:
# modes:
# requires:
# optional:
# constraints:
---
```

Keep the key order stable so the skills read the same way across the repo.

## What this repo is for

This repo is not an application. It is a skill library and workflow toolkit for
coding agents.

Each skill is a `SKILL.md` file with frontmatter metadata and behavior
guidance. The skills are meant to be read by the agent at task time so it can
pick the right workflow without inventing one from scratch.

## Repository layout

```text
.
|-- README.md
|-- agents.json
|-- AGENTS.md
`-- .agents/
    `-- skills/
        |-- academix/
        |-- agent-browser/
        |-- apocalypse/
        |-- aria-apg-review/
        |-- crawler-readiness-audit/
        |-- decision-criticality-gate/
        |-- fact-checker/
        |-- find-skills/
        |-- frontend-design/
        |-- grill-me/
        |-- grill-with-docs/
        |-- humanizer/
        |-- improve-codebase-architecture/
        |-- microsoft-foundry/
        |-- output-templates/
        |-- pre-launch-security-gate/
        |-- prompt-preflight/
        |-- quick-recap/
        |-- rest-api-best-practices/
        |-- rigorous-response/
        |-- shepherd/
        |-- skill-optimizer/
        |-- tdd/
        |-- ux-logic-loop/
        |-- ux-pattern-review/
        |-- vercel-react-best-practices/
        |-- visual-flow-storyboard/
        |-- visual-pr-review/
        `-- web-design-guidelines/
```

## Working with the skills

- Read the relevant `SKILL.md` before changing behavior.
- Keep skill edits bounded and evidence-based.
- Use `.agents/skills/skill-optimizer/` when you need to improve a Markdown
  skill through a measured loop.
- Run `node scripts/skill-guard.mjs` before committing to catch inventory drift,
  missing frontmatter, and naming mismatches.
- GitHub Actions CI lives in `.github/workflows/ci.yml`; make the `skill-guard`
  check required on `main` and disable direct pushes in repository settings.

## Repo conventions

- `AGENTS.md` contains workspace-level instructions.
- `agents.json` is the machine-readable inventory.
- Each skill stays in its own directory.
- Local helper skills remain under `.agents/skills/`.
