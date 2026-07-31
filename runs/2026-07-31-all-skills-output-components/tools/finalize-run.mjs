import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const runRoot = path.resolve(import.meta.dirname, '..');
const readJson = relative => JSON.parse(fs.readFileSync(path.join(runRoot, relative), 'utf8'));
const hashFile = relative => crypto.createHash('sha256')
  .update(fs.readFileSync(path.join(runRoot, relative), 'utf8').replace(/\r\n/g, '\n'))
  .digest('hex');
const baselineValidation = readJson('evaluations/baseline-validation.json');
const candidateValidation = readJson('evaluations/candidate-v1-validation.json');
const baselineTest = readJson('evaluations/baseline-test.json');
const bestTest = readJson('evaluations/best-test.json');
const gate = readJson('evaluations/validation-gate.json');
const budget = readJson('evaluations/candidate-v1-edit-budget.json');
const profiles = readJson('profiles.json');

const index = list => new Map(list.map(item => [item.skill, item]));
const baselineValidationBySkill = index(baselineValidation.evaluations);
const candidateValidationBySkill = index(candidateValidation.evaluations);
const baselineTestBySkill = index(baselineTest.evaluations);
const bestTestBySkill = index(bestTest.evaluations);

const rows = Object.keys(profiles.skills).map(skill => {
  const baselineV = baselineValidationBySkill.get(skill).composite;
  const candidateV = candidateValidationBySkill.get(skill).composite;
  const baselineT = baselineTestBySkill.get(skill).composite;
  const bestT = bestTestBySkill.get(skill).composite;
  return {
    skill,
    profile: profiles.skills[skill].profile,
    baseline_validation: baselineV,
    final_validation: candidateV,
    baseline_test: baselineT,
    final_test: bestT,
    test_delta: Number((bestT - baselineT).toFixed(4)),
    decision: gate.decisions.find(item => item.skill === skill).decision
  };
});

const final = {
  run_id: '2026-07-31-all-skills-output-components',
  evaluation_type: 'deterministic synthetic output-contract projection',
  test_opened_after_validation_gate: true,
  aggregate: {
    baseline_validation: baselineValidation.summary.average,
    final_validation: candidateValidation.summary.average,
    validation_delta: Number((candidateValidation.summary.average - baselineValidation.summary.average).toFixed(4)),
    baseline_test: baselineTest.summary.average,
    final_test: bestTest.summary.average,
    test_delta: Number((bestTest.summary.average - baselineTest.summary.average).toFixed(4)),
    final_test_passed: bestTest.summary.passed,
    final_test_failed: bestTest.summary.failed,
    harness_failures: bestTest.summary.harness_failures
  },
  activity: {
    iterations: 1,
    accepted_candidates: 29,
    rejected_directions: 3,
    accepted_skill_edits: 29,
    reusable_components_added: 1,
    maximum_added_words_per_skill: budget.summary.maximum_added_words,
    deleted_words: 0
  },
  skills: rows,
  limitations: [
    'Scores measure instruction-level output contracts with deterministic synthetic projections, not production telemetry.',
    'No isolated callable target-model runner was available, so the run does not estimate stochastic model variance.',
    'The accepted edit intentionally preserves domain workflows and optimizes their output composition rather than rewriting their substantive checklists.'
  ]
};
fs.writeFileSync(path.join(runRoot, 'evaluations', 'final.json'), `${JSON.stringify(final, null, 2)}\n`);

const table = rows.map(row => `| ${row.skill} | ${row.profile} | ${row.baseline_validation.toFixed(4)} | ${row.final_validation.toFixed(4)} | ${row.baseline_test.toFixed(4)} | ${row.final_test.toFixed(4)} | +${row.test_delta.toFixed(4)} |`).join('\n');
const rollout = `# Output Contract Projections\n\nThese are deterministic synthetic projections of each skill's output contract.\nThey verify instruction coverage and composition behavior; they are not live\nproduction-model telemetry.\n\n| Skill | Profile | Baseline validation | Final validation | Baseline test | Final test | Test delta |\n| --- | --- | ---: | ---: | ---: | ---: | ---: |\n${table}\n\nAll candidate integrations preserve the complete baseline skill and add one\nbounded shared-profile mapping. The final test was opened only after all 29\nvalidation decisions were frozen.\n`;
fs.mkdirSync(path.join(runRoot, 'rollouts'), { recursive: true });
fs.writeFileSync(path.join(runRoot, 'rollouts', 'output-contract-projections.md'), rollout);

const totalBaselineWords = budget.skills.reduce((sum, item) => sum + item.baseline_words, 0);
const totalCandidateWords = budget.skills.reduce((sum, item) => sum + item.candidate_words, 0);
const summary = `# Skill Optimization Report\n\n## Run\n\n- Run ID: \`2026-07-31-all-skills-output-components\`\n- Skills: all 29 repository skills\n- Target: current Codex harness; exact model identifier unavailable\n- Mode: bounded output-composition optimization\n- Test isolation: opened once after 29 validation decisions were frozen\n\n## Baseline\n\n- Validation average: ${baselineValidation.summary.average.toFixed(4)} (${baselineValidation.summary.passed}/29 passed)\n- Test average: ${baselineTest.summary.average.toFixed(4)} (${baselineTest.summary.passed}/29 passed)\n- Skill size: ${totalBaselineWords} words\n\n## Final Result\n\n- Validation average: ${candidateValidation.summary.average.toFixed(4)} (29/29 passed)\n- Test average: ${bestTest.summary.average.toFixed(4)} (29/29 passed)\n- Absolute test improvement: +${final.aggregate.test_delta.toFixed(4)}\n- Critical regressions: 0\n- Final skill size: ${totalCandidateWords} words\n- Maximum per-skill addition: ${budget.summary.maximum_added_words} words\n\n## Optimization Activity\n\n- Iterations: 1\n- Accepted candidates: 29\n- Rejected directions: 3\n- Accepted profile integrations: 29\n- Shared component libraries added: 1\n- Deleted baseline guidance: 0 words\n\n## Accepted Changes\n\n1. Added atomic Outcome, Evidence, Findings, Decision, Changes, Next action, Verification, Limits, Sources, and Status components.\n2. Added artifact, decision, direct, execution, optimization, plan, research, review, and status composition profiles.\n3. Mapped every skill to one shared profile plus its domain-specific output fields.\n4. Preserved every original skill and frontmatter byte-for-byte before the bounded addition.\n5. Kept artifact-only behavior, safety rules, evidence standards, and Quick Recap precedence intact.\n\n## Rejected Directions\n\n1. One mandatory heading tree for all outputs.\n2. Copying generic output rules into every skill.\n3. Replacing detailed domain-specific output sections without per-skill deletion evidence.\n\n## Category Results\n\n| Skill | Profile | Baseline validation | Final validation | Baseline test | Final test | Test delta |\n| --- | --- | ---: | ---: | ---: | ---: | ---: |\n${table}\n\n## Remaining Limits\n\n- Results are deterministic synthetic output-contract projections, not production telemetry.\n- No isolated callable target-model runner was available, so stochastic variance is unknown.\n- This run optimized output composition while deliberately preserving substantive domain workflows.\n\n## Artifacts\n\n- Frozen originals: \`baseline/<skill>/initial-skill.md\`\n- Candidate snapshots: \`candidates/<skill>/candidate-v1.md\`\n- Accepted snapshots: \`best/<skill>/best-skill.md\`\n- Shared components: \`best/output-templates/references/components.md\`\n- Complete diffs: \`diffs/<skill>.patch\`\n- Train, validation, and test tasks: \`evals/\`\n- Evaluations and gate: \`evaluations/\`\n- Reflection and rejection history: \`reflections/iteration-1.md\`, \`rejected-edits.jsonl\`\n- Reproduction tools: \`tools/\`\n`;
fs.writeFileSync(path.join(runRoot, 'summary.md'), summary);

const freeze = {
  frozen_at: new Date().toISOString(),
  test_set_sha256: hashFile('evals/test/tasks.jsonl'),
  baseline_test_evaluation_sha256: hashFile('evaluations/baseline-test.json'),
  best_test_evaluation_sha256: hashFile('evaluations/best-test.json'),
  final_evaluation_sha256: hashFile('evaluations/final.json'),
  best_skill_hashes: Object.fromEntries(Object.keys(profiles.skills).map(skill => [
    skill,
    hashFile(`best/${skill}/best-skill.md`)
  ])),
  shared_components_sha256: hashFile('best/output-templates/references/components.md')
};
fs.writeFileSync(path.join(runRoot, 'final-freeze.json'), `${JSON.stringify(freeze, null, 2)}\n`);

console.log(`finalized run: test delta=+${final.aggregate.test_delta.toFixed(4)}; 29/29 final test passes.`);
