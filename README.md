# My AI Workspace

A curated collection of reusable AI agent skills for research, critical reasoning, risk analysis, and structured decision-making.

These skills are designed to be:

- agent-agnostic,
- easy to reuse,
- explicit about assumptions and boundaries,
- compatible with Markdown-based agent systems,
- suitable for Codex, Claude Code, custom agents, and personal AI operating systems.

## Skills

### Academix

**Academic research and citation agent**

Academix supports source-backed academic work, including:

- paper summaries,
- literature reviews,
- citation formatting,
- source evaluation,
- methodological analysis,
- evidence classification,
- structured research excerpts.

It prioritizes strong sources, distinguishes facts from assumptions, and never invents references.

**Best for:**

- academic papers,
- literature reviews,
- APA, MLA, and Chicago citations,
- source criticism,
- research synthesis,
- evidence-based writing.

[View Academix](./academix/SKILL.md)

---

### Apocalypse

**Pre-mortem, risk, and failure-analysis agent**

Apocalypse assumes that a project has already failed and works backward to identify:

- failure modes,
- cascading risks,
- missing controls,
- weak assumptions,
- operational gaps,
- recovery failures,
- untested dependencies.

It produces concrete prevention, detection, containment, recovery, and verification measures.

**Best for:**

- architecture reviews,
- implementation plans,
- migrations,
- release readiness,
- AI-agent risk analysis,
- resilience testing,
- disaster recovery planning.

[View Apocalypse](./apocalypse/SKILL.md)

---

### Rigorous Response

**Critical-thinking and decision-support agent**

Rigorous Response improves the quality of answers by enforcing:

- clarification of material ambiguity,
- explicit assumptions,
- premise validation,
- honest criticism,
- calibrated uncertainty,
- concise reasoning,
- actionable recommendations.

It avoids vague agreement, unsupported confidence, unnecessary filler, and fabricated precision.

**Best for:**

- idea evaluation,
- architecture decisions,
- implementation reviews,
- technical recommendations,
- trade-off analysis,
- critical feedback,
- precise answers.

[View Rigorous Response](./rigorous-response/SKILL.md)

## Repository Structure

```text
.
├── README.md
├── academix/
│   └── SKILL.md
├── apocalypse/
│   └── SKILL.md
└── rigorous-response/
    └── SKILL.md
```

Each skill lives in its own directory and contains a standalone `SKILL.md` file.

A skill typically includes:

- YAML frontmatter,
- identity and purpose,
- activation triggers,
- capabilities,
- constraints,
- operating principles,
- workflows,
- output formats,
- boundaries,
- quality checks.

## Installation

Clone the repository:

```bash
git clone https://github.com/<your-username>/<your-repository>.git
cd <your-repository>
```

Copy the skills into the skill directory used by your agent system.

Example:

```bash
cp -R academix ~/.agents/skills/
cp -R apocalypse ~/.agents/skills/
cp -R rigorous-response ~/.agents/skills/
```

Adjust the destination path to match your setup.

## Usage

Skills may be loaded automatically by compatible agent systems or activated manually.

### Manual activation

```text
Use the Academix skill to review this paper.
```

```text
Use Apocalypse to perform a pre-mortem on this implementation plan.
```

```text
Use Rigorous Response to evaluate this idea and challenge my assumptions.
```

### Referencing a skill file

Some agent systems support direct file references:

```text
Use the instructions from ./academix/SKILL.md.
```

### Combining skills

Skills can be combined when their responsibilities complement each other.

Example:

```text
Use Rigorous Response to validate the assumptions,
Academix to verify the evidence,
and Apocalypse to identify how the plan could fail.
```

Recommended order:

1. **Rigorous Response** validates the goal, assumptions, and premise.
2. **Academix** verifies claims and evaluates supporting evidence.
3. **Apocalypse** tests resilience and identifies catastrophic failure paths.

## Design Principles

### Explicit over implicit

Important assumptions, uncertainties, constraints, and evidence gaps must be visible.

### Evidence over confidence

A confident answer is not automatically a reliable answer.

Skills should distinguish between:

- verified facts,
- strong inferences,
- assumptions,
- interpretations,
- unknowns.

### Actionable over vague

Recommendations should include concrete actions, decision rules, tests, or acceptance criteria.

### Boundaries over unrestricted behavior

Each skill defines what it must not do, including:

- fabricating sources,
- inventing evidence,
- overstating certainty,
- hiding important assumptions,
- producing unsupported criticism.

### Reusable over agent-specific

The skills avoid unnecessary dependencies on one model, vendor, or runtime.

## Skill Format

A typical skill starts with YAML frontmatter:

```yaml
---
name: example-skill
description: >
  A concise description of the skill.
version: 1.0.0
author: Caro
license: Apache-2.0

tags:
  - example
  - reasoning

triggers:
  - review this
  - analyze this

capabilities:
  - analysis
  - evaluation

constraints:
  fabricate_information: false
---
```

The Markdown body then defines:

```text
Identity
Purpose
Use cases
Operating principles
Workflow
Output format
Boundaries
Quality checklist
```

## Creating a New Skill

When adding a new skill:

1. Create a new directory using a lowercase, hyphenated name.
2. Add a `SKILL.md` file.
3. Include valid YAML frontmatter.
4. Define clear triggers and capabilities.
5. Add explicit constraints and boundaries.
6. Include a deterministic workflow.
7. Define the expected output structure.
8. Add a quality checklist.
9. Update this README.

Example:

```text
new-skill/
└── SKILL.md
```

## Quality Standard

Every skill should answer these questions:

- What problem does it solve?
- When should it activate?
- What information does it require?
- What steps does it follow?
- What must it verify?
- What must it never do?
- What does the final output look like?
- How can the result be checked?

## Compatibility

These skills are written as portable Markdown instructions and can be adapted for:

- OpenAI Codex,
- Claude Code,
- custom agent frameworks,
- local LLM workflows,
- personal AI operating systems,
- repository-level agent instructions,
- tool-using assistants.

Exact loading behavior depends on the target agent runtime.

## Contributing

Contributions are not welcome.

## License

Licensed under the Apache License 2.0.

See [LICENSE](./LICENSE) for details.

## Author

Created by **Caro**
