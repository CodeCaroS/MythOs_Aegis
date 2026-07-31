import fs from 'node:fs';
import path from 'node:path';

const runRoot = path.resolve(import.meta.dirname, '..');
const candidateRoot = path.join(runRoot, 'candidates');
const profiles = JSON.parse(fs.readFileSync(path.join(runRoot, 'profiles.json'), 'utf8'));

const domainRules = {
  'academix': 'Keep citation-supported claims, source quality, and limitation status visible.',
  'agent-browser': 'Report the URL boundary, interaction evidence, and exactly what was verified.',
  'apocalypse': 'Keep the failure chain, ranked risk, countermeasure, proof, and residual exposure explicit.',
  'aria-apg-review': 'Keep APG pattern coverage, evidence-backed findings, and unverified runtime risks explicit.',
  'crawler-readiness-audit': 'Keep tested URLs, raw-versus-rendered crawler evidence, and the smallest rendering recommendation explicit.',
  'decision-criticality-gate': 'Keep the level, score rationale, hard escalation, required process, and next gate explicit.',
  'fact-checker': 'Keep each claim, source, status, correction, confidence, and remaining uncertainty traceable.',
  'find-skills': 'State the reuse, recommend, or reject decision after checking installed overlap and dependency cost.',
  'frontend-design': 'Lead with the design direction, then constraints, state coverage, implementation slices, and verification.',
  'grill-me': 'Return only decision-changing questions, one safe default when useful, and the next decision or action.',
  'grill-with-docs': 'Separate the decision from documentation changes and the next implementation action.',
  'humanizer': 'Return the rewrite as the deliverable while preserving facts, protected structure, and voice.',
  'improve-codebase-architecture': 'Rank findings by impact with location, evidence, consequence, smallest refactor, risk, and verification seam.',
  'microsoft-foundry': 'Report resolved context, planned or completed mutation, verification evidence, and unverified cloud state.',
  'output-templates': 'Use reusable components and named profiles; omit empty sections and preserve owning-skill fields.',
  'pre-launch-security-gate': 'Lead with the release decision, then findings, attack evidence, required fix, tests, and residual risk.',
  'prompt-preflight': 'Keep refinement silent; return the preserved request or the single material clarification needed.',
  'quick-recap': 'State completed work, remaining work, and the exact required action in one final status line.',
  'rest-api-best-practices': 'Keep the contract, semantic defect, compatibility impact, fix, and verification together.',
  'rigorous-response': 'Lead with the conclusion; separate evidence, inference, assumptions, uncertainty, and next action.',
  'shepherd': 'Report state, checkpoint, changes, verification, recovery availability, and the next safe action.',
  'skill-optimizer': 'Report baseline, candidate, validation gate, isolated test, accepted and rejected edits, limits, and artifacts.',
  'tdd': 'Report the red failure, green change, exact test result, and any verification limit.',
  'ux-logic-loop': 'Report story status, discovered findings, fixes, test evidence, remaining coverage, and blockers.',
  'ux-pattern-review': 'Keep pattern decisions, evidence-backed findings, source support, state coverage, and unverified risks explicit.',
  'vercel-react-best-practices': 'Report each finding with evidence, measurement or unknown impact, smallest fix, and verification method.',
  'visual-flow-storyboard': 'Keep every journey frame tied to state, action, transition, evidence, and any inferred gap.',
  'visual-pr-review': 'Lead with the recommendation; keep every finding tied to evidence, impact, fix, and verification.',
  'web-design-guidelines': 'Report evidence-backed findings first, then missing runtime coverage and exact steps to verify behavior.'
};

for (const [skill, config] of Object.entries(profiles.skills)) {
  const file = path.join(candidateRoot, skill, 'candidate-v1.md');
  const baselineFile = path.join(runRoot, 'baseline', skill, 'initial-skill.md');
  const content = fs.readFileSync(baselineFile, 'utf8').trimEnd();
  const reference = skill === 'output-templates'
    ? 'references/components.md'
    : '../output-templates/references/components.md';
  const block = [
    '',
    '',
    '## Shared output profile',
    '',
    `Compose the \`${config.profile}\` profile from [output-templates](${reference}).`,
    domainRules[skill],
    'Preserve stricter domain rules above, omit empty components, and never fill a component with invented evidence.',
    ''
  ].join('\n');
  fs.writeFileSync(file, `${content}${block}`);
}

console.log(`build-candidates: integrated shared profiles into ${Object.keys(profiles.skills).length} candidate skills.`);
