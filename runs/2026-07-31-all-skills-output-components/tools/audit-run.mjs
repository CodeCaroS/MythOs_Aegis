import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const runRoot = path.resolve(import.meta.dirname, '..');
const repoRoot = path.resolve(runRoot, '..', '..');
const profiles = JSON.parse(fs.readFileSync(path.join(runRoot, 'profiles.json'), 'utf8'));
const freeze = JSON.parse(fs.readFileSync(path.join(runRoot, 'final-freeze.json'), 'utf8'));
const final = JSON.parse(fs.readFileSync(path.join(runRoot, 'evaluations', 'final.json'), 'utf8'));
const gate = JSON.parse(fs.readFileSync(path.join(runRoot, 'evaluations', 'validation-gate.json'), 'utf8'));
const skills = Object.keys(profiles.skills);

const hash = file => crypto.createHash('sha256')
  .update(fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n'))
  .digest('hex');
const failures = [];
const requireCondition = (condition, message) => { if (!condition) failures.push(message); };

for (const [folder, fileName] of [
  ['baseline', 'initial-skill.md'],
  ['candidates', 'candidate-v1.md'],
  ['best', 'best-skill.md']
]) {
  const present = skills.filter(skill => fs.existsSync(path.join(runRoot, folder, skill, fileName)));
  requireCondition(present.length === skills.length, `${folder}: expected ${skills.length} skill snapshots, found ${present.length}`);
}

for (const skill of skills) {
  const live = path.join(repoRoot, '.agents', 'skills', skill, 'SKILL.md');
  const best = path.join(runRoot, 'best', skill, 'best-skill.md');
  const diff = path.join(runRoot, 'diffs', `${skill}.patch`);
  requireCondition(hash(live) === hash(best), `${skill}: live skill differs from frozen best`);
  requireCondition(hash(best) === freeze.best_skill_hashes[skill], `${skill}: frozen best hash changed after test`);
  requireCondition(fs.existsSync(diff) && fs.statSync(diff).size > 0, `${skill}: complete diff missing`);
  const content = fs.readFileSync(live, 'utf8');
  const match = content.match(/\[output-templates\]\(([^)]+components\.md)\)/);
  requireCondition(Boolean(match), `${skill}: shared component reference missing`);
  if (match) {
    requireCondition(fs.existsSync(path.resolve(path.dirname(live), match[1])), `${skill}: shared component link is broken`);
  }
}

const shared = path.join(repoRoot, '.agents', 'skills', 'output-templates', 'references', 'components.md');
requireCondition(hash(shared) === freeze.shared_components_sha256, 'shared component library changed after test');
requireCondition(hash(path.join(runRoot, 'evals', 'test', 'tasks.jsonl')) === freeze.test_set_sha256, 'test set changed after final evaluation');
requireCondition(hash(path.join(runRoot, 'evaluations', 'baseline-test.json')) === freeze.baseline_test_evaluation_sha256, 'baseline test evaluation changed');
requireCondition(hash(path.join(runRoot, 'evaluations', 'best-test.json')) === freeze.best_test_evaluation_sha256, 'best test evaluation changed');
requireCondition(hash(path.join(runRoot, 'evaluations', 'final.json')) === freeze.final_evaluation_sha256, 'final evaluation changed');
requireCondition(final.aggregate.final_test_passed === skills.length && final.aggregate.final_test_failed === 0, 'final test did not pass all skills');
requireCondition(gate.aggregate.accepted === skills.length && gate.aggregate.rejected === 0, 'validation gate did not accept all skills');
requireCondition(gate.decisions.every(item => !item.critical_regression), 'validation gate records a critical regression');

const rejected = fs.readFileSync(path.join(runRoot, 'rejected-edits.jsonl'), 'utf8').trim().split(/\r?\n/).filter(Boolean);
for (const line of rejected) JSON.parse(line);
requireCondition(rejected.length >= 1, 'rejected edit history is empty');
requireCondition(fs.existsSync(path.join(runRoot, 'summary.md')), 'final summary missing');
requireCondition(fs.existsSync(path.join(runRoot, 'reflections', 'iteration-1.md')), 'reflection missing');
requireCondition(fs.existsSync(path.join(runRoot, 'meta-memory.md')), 'optimizer meta memory missing');

if (failures.length) {
  failures.forEach(failure => console.error(failure));
  process.exit(1);
}

console.log(`completion audit: ${skills.length} live skills match frozen best snapshots; links, diffs, gates, test hashes, rejection history, and reports are complete.`);
