# MythOs Aegis

MythOs Aegis is a repository of Codex skills for agentic coding work.

The repo is split into small Markdown-based skills, each focused on one job:

- `academix/` for academic research and source evaluation
- `apocalypse/` for pre-mortems and failure analysis
- `fact-checker/` for claim verification
- `quick-recap/` for mandatory end-of-response status footers
- `rigorous-response/` for concise reasoning and premise checks
- `shepherd/` for reversible execution, checkpoints, and recovery
- `visual-pr-review/` for pull request review and implementation planning
- `.agents/skills/` for repository-local support skills such as the skill optimizer and internal workflow helpers

## What this repo is for

This repo is not an application. It is a skill library and workflow toolkit for Codex.

Each skill is a `SKILL.md` file with frontmatter metadata and behavior guidance. The skills are meant to be read by the agent at task time so it can pick the right workflow without inventing one from scratch.

## Machine-readable index

The canonical skill index lives in [`agents.json`](./agents.json).

Use it when a tool or workflow needs the repo inventory in a structured format.

## Repository layout

```text
.
|-- README.md
|-- agents.json
|-- AGENTS.md
|-- academix/
|-- apocalypse/
|-- fact-checker/
|-- quick-recap/
|-- rigorous-response/
|-- shepherd/
|-- visual-pr-review/
`-- .agents/
    `-- skills/
```

## Working with the skills

- Read the relevant `SKILL.md` before changing behavior.
- Keep skill edits bounded and evidence-based.
- Use `.agents/skills/skill-optimizer/` when you need to improve a Markdown skill through a measured loop.

## Repo conventions

- `AGENTS.md` contains workspace-level instructions.
- `agents.json` is the machine-readable inventory.
- Each skill stays in its own directory.
- Local helper skills remain under `.agents/skills/`.
