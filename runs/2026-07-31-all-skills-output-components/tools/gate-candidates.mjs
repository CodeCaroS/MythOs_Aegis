import fs from 'node:fs';
import path from 'node:path';

const runRoot = path.resolve(import.meta.dirname, '..');
const baseline = JSON.parse(fs.readFileSync(path.join(runRoot, 'evaluations', 'baseline-validation.json'), 'utf8'));
const candidate = JSON.parse(fs.readFileSync(path.join(runRoot, 'evaluations', 'candidate-v1-validation.json'), 'utf8'));
const budget = JSON.parse(fs.readFileSync(path.join(runRoot, 'evaluations', 'candidate-v1-edit-budget.json'), 'utf8'));
const minimumDelta = 0.01;

const baselineBySkill = new Map(baseline.evaluations.map(item => [item.skill, item]));
const budgetBySkill = new Map(budget.skills.map(item => [item.skill, item]));
const decisions = candidate.evaluations.map(item => {
  const previous = baselineBySkill.get(item.skill);
  const edit = budgetBySkill.get(item.skill);
  const delta = Number((item.composite - previous.composite).toFixed(4));
  const criticalRegression = !edit.original_preserved || !edit.frontmatter_preserved || edit.deleted_words > 0;
  const accepted = item.hard_pass && item.composite >= 0.8 && delta > minimumDelta && edit.edit_budget_pass && !criticalRegression;
  return {
    skill: item.skill,
    baseline: previous.composite,
    candidate: item.composite,
    delta,
    hard_pass: item.hard_pass,
    critical_regression: criticalRegression,
    decision: accepted ? 'accept_new_best' : 'reject',
    evidence: accepted
      ? [
          'Held-out validation exceeds the frozen baseline by more than 0.01.',
          'Original skill and frontmatter are preserved; the edit adds a bounded shared-profile composition rule.',
          'Shared components prohibit invented evidence and preserve stricter domain rules.'
        ]
      : ['Acceptance threshold, edit budget, hard pass, or regression gate failed.']
  };
});

const accepted = decisions.filter(item => item.decision === 'accept_new_best');
const result = {
  candidate: 'candidate-v1',
  split: 'validation',
  minimum_delta: minimumDelta,
  aggregate: {
    baseline: baseline.summary.average,
    candidate: candidate.summary.average,
    delta: Number((candidate.summary.average - baseline.summary.average).toFixed(4)),
    accepted: accepted.length,
    rejected: decisions.length - accepted.length
  },
  decisions
};
fs.writeFileSync(path.join(runRoot, 'evaluations', 'validation-gate.json'), `${JSON.stringify(result, null, 2)}\n`);

if (accepted.length !== decisions.length) {
  console.error(`validation gate rejected ${decisions.length - accepted.length} candidates`);
  process.exit(1);
}

const bestRoot = path.join(runRoot, 'best');
for (const decision of accepted) {
  const target = path.join(bestRoot, decision.skill);
  fs.mkdirSync(target, { recursive: true });
  fs.copyFileSync(
    path.join(runRoot, 'candidates', decision.skill, 'candidate-v1.md'),
    path.join(target, 'best-skill.md')
  );
}
const sharedTarget = path.join(bestRoot, 'output-templates', 'references');
fs.mkdirSync(sharedTarget, { recursive: true });
fs.copyFileSync(
  path.join(runRoot, 'candidates', 'output-templates', 'components-v1.md'),
  path.join(sharedTarget, 'components.md')
);

console.log(`validation gate: accepted ${accepted.length}/${decisions.length}; aggregate delta=+${result.aggregate.delta.toFixed(4)}.`);
