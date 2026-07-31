import fs from 'node:fs';
import path from 'node:path';

const [snapshotRootArg, label, split, fileName = 'initial-skill.md'] = process.argv.slice(2);
if (!snapshotRootArg || !label || !split) {
  console.error('usage: node evaluate-output-contracts.mjs <snapshot-root> <label> <train|validation|test> [file-name]');
  process.exit(2);
}
if (!['train', 'validation', 'test'].includes(split)) {
  console.error(`invalid split: ${split}`);
  process.exit(2);
}

const runRoot = path.resolve(import.meta.dirname, '..');
const snapshotRoot = path.resolve(snapshotRootArg);
const profileConfig = JSON.parse(fs.readFileSync(path.join(runRoot, 'profiles.json'), 'utf8'));
const tasks = fs.readFileSync(path.join(runRoot, 'evals', split, 'tasks.jsonl'), 'utf8')
  .trim()
  .split(/\r?\n/)
  .filter(Boolean)
  .map(line => JSON.parse(line));

const patterns = {
  outcome: /\b(outcome|verdict|conclusion|answer first|lead with|requested artifact|final rewrite|decision)\b/i,
  evidence: /\b(evidence|source|observed|confirmed|fact|citation|assumption)\b/i,
  action: /\b(next action|next step|recommendation|required fix|countermeasure|implementation|unblocker)\b/i,
  verification: /\b(verification|verify|tested|tests? run|checks? run|proof|runtime)\b/i,
  limits: /\b(limit|uncertainty|unknown|unverified|remaining|blocker|not run|incomplete)\b/i,
  proportional: /\b(omit empty|only include|when relevant|proportional|concise|smallest useful|minimal structure)\b/i
};

function round(value) {
  return Number(value.toFixed(4));
}

function scoreTask(task) {
  const config = profileConfig.skills[task.category];
  const file = path.join(snapshotRoot, task.category, fileName);
  if (!fs.existsSync(file)) {
    return {
      skill: task.category,
      task_id: task.id,
      split,
      version: label,
      hard_pass: false,
      composite: 0,
      verdict: 'harness_failure',
      evidence: [`Missing evaluated skill snapshot: ${file}`]
    };
  }

  const content = fs.readFileSync(file, 'utf8');
  const lower = content.toLowerCase();
  const profilePattern = new RegExp(`\\b${config.profile}\\b[\\s\x60]*profile`, 'i');
  const profileReference = lower.includes('output-templates') && profilePattern.test(content);
  const componentCandidates = [
    path.join(snapshotRoot, 'output-templates', 'components-v1.md'),
    path.join(snapshotRoot, 'output-templates', 'references', 'components.md')
  ];
  const componentFile = componentCandidates.find(candidate => fs.existsSync(candidate));
  const composedContent = profileReference && componentFile
    ? `${content}\n${fs.readFileSync(componentFile, 'utf8')}`
    : content;
  const requiredMatches = config.requiredTerms.filter(term => lower.includes(term.toLowerCase()));
  const domainFit = requiredMatches.length / config.requiredTerms.length;

  const signals = {
    outcome: patterns.outcome.test(composedContent),
    evidence: patterns.evidence.test(composedContent),
    action: patterns.action.test(composedContent),
    verification: patterns.verification.test(composedContent),
    limits: patterns.limits.test(composedContent),
    proportional: patterns.proportional.test(composedContent),
    reuse: profileReference && Boolean(componentFile)
  };

  const dimensions = {
    outcome_usability: signals.outcome ? 1 : 0,
    evidence_fidelity: signals.evidence && (split === 'train' || signals.limits) ? 1 : signals.evidence ? 0.7 : 0,
    actionability: signals.action ? 1 : 0,
    verification_honesty: signals.verification && (split !== 'validation' || signals.limits) ? 1 : signals.verification ? 0.7 : 0,
    domain_fit: domainFit,
    proportionality: signals.proportional ? 1 : 0,
    reuse: signals.reuse ? 1 : 0
  };
  const composite = round(
    dimensions.outcome_usability * 0.20
    + dimensions.evidence_fidelity * 0.20
    + dimensions.actionability * 0.15
    + dimensions.verification_honesty * 0.15
    + dimensions.domain_fit * 0.15
    + dimensions.proportionality * 0.10
    + dimensions.reuse * 0.05
  );
  const hardPass = domainFit >= 2 / 3 && (split !== 'validation' || signals.limits);

  return {
    skill: task.category,
    task_id: task.id,
    split,
    version: label,
    profile: config.profile,
    hard_pass: hardPass,
    dimensions: Object.fromEntries(Object.entries(dimensions).map(([key, value]) => [key, round(value)])),
    composite,
    verdict: hardPass && composite >= 0.8 ? 'pass' : 'fail',
    evidence: [
      `Shared profile reference: ${profileReference ? 'present' : 'absent'}.`,
      `Output signals: ${Object.entries(signals).filter(([, value]) => value).map(([key]) => key).join(', ') || 'none'}.`,
      `Domain terms matched: ${requiredMatches.join(', ') || 'none'} of ${config.requiredTerms.join(', ')}.`
    ]
  };
}

const evaluations = tasks.map(scoreTask);
const completed = evaluations.filter(item => item.verdict !== 'harness_failure');
const summary = {
  average: round(completed.reduce((sum, item) => sum + item.composite, 0) / completed.length),
  passed: completed.filter(item => item.verdict === 'pass').length,
  failed: completed.filter(item => item.verdict === 'fail').length,
  harness_failures: evaluations.filter(item => item.verdict === 'harness_failure').length
};
const result = {
  label,
  split,
  rubric: 'evals/rubrics/output-quality.md',
  evaluator: 'deterministic-output-contract-v1',
  task_count: tasks.length,
  summary,
  evaluations
};

const outputDir = path.join(runRoot, 'evaluations');
fs.mkdirSync(outputDir, { recursive: true });
const outputFile = path.join(outputDir, `${label}-${split}.json`);
fs.writeFileSync(outputFile, `${JSON.stringify(result, null, 2)}\n`);
console.log(`${label} ${split}: average=${summary.average.toFixed(4)} pass=${summary.passed} fail=${summary.failed} harness=${summary.harness_failures}`);
