import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const runRoot = path.resolve(import.meta.dirname, '..');
const baselineRoot = path.join(runRoot, 'baseline');
const candidateRoot = path.join(runRoot, 'candidates');
const profiles = JSON.parse(fs.readFileSync(path.join(runRoot, 'profiles.json'), 'utf8'));
const diffRoot = path.join(runRoot, 'diffs');
fs.mkdirSync(diffRoot, { recursive: true });

function words(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function hash(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

function frontmatter(text) {
  return text.match(/^---\r?\n[\s\S]*?\r?\n---/)?.[0] ?? null;
}

const skills = [];
for (const skill of Object.keys(profiles.skills)) {
  const baselineFile = path.join(baselineRoot, skill, 'initial-skill.md');
  const candidateFile = path.join(candidateRoot, skill, 'candidate-v1.md');
  const baseline = fs.readFileSync(baselineFile, 'utf8');
  const candidate = fs.readFileSync(candidateFile, 'utf8');
  const addedWords = words(candidate) - words(baseline);
  const originalPreserved = candidate.startsWith(baseline.trimEnd());
  const frontmatterPreserved = frontmatter(candidate) === frontmatter(baseline);
  const budgetPass = addedWords >= 0 && addedWords <= 120;

  const diff = spawnSync('git', ['diff', '--no-index', '--', baselineFile, candidateFile], {
    encoding: 'utf8',
    windowsHide: true
  });
  if (![0, 1].includes(diff.status)) {
    throw new Error(`git diff failed for ${skill}: ${diff.stderr}`);
  }
  fs.writeFileSync(path.join(diffRoot, `${skill}.patch`), diff.stdout);
  skills.push({
    skill,
    baseline_sha256: hash(baseline),
    candidate_sha256: hash(candidate),
    baseline_words: words(baseline),
    candidate_words: words(candidate),
    added_words: addedWords,
    deleted_words: 0,
    original_preserved: originalPreserved,
    frontmatter_preserved: frontmatterPreserved,
    edit_budget_pass: budgetPass
  });
}

const result = {
  candidate: 'candidate-v1',
  limits: { max_added_words_per_skill: 120, max_deleted_words_per_skill: 120 },
  summary: {
    skills: skills.length,
    budget_passed: skills.filter(item => item.edit_budget_pass).length,
    original_preserved: skills.filter(item => item.original_preserved).length,
    frontmatter_preserved: skills.filter(item => item.frontmatter_preserved).length,
    maximum_added_words: Math.max(...skills.map(item => item.added_words))
  },
  skills
};

const evaluationRoot = path.join(runRoot, 'evaluations');
fs.mkdirSync(evaluationRoot, { recursive: true });
fs.writeFileSync(path.join(evaluationRoot, 'candidate-v1-edit-budget.json'), `${JSON.stringify(result, null, 2)}\n`);

if (result.summary.budget_passed !== skills.length || result.summary.original_preserved !== skills.length || result.summary.frontmatter_preserved !== skills.length) {
  console.error(JSON.stringify(result.summary));
  process.exit(1);
}

console.log(`candidate analysis: ${skills.length} skills preserved; max added words=${result.summary.maximum_added_words}; all edit budgets pass.`);
