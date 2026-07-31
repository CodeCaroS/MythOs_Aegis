import fs from 'node:fs';
import path from 'node:path';

const runRoot = path.resolve(import.meta.dirname, '..');
const profiles = JSON.parse(fs.readFileSync(path.join(runRoot, 'profiles.json'), 'utf8'));

const scenarios = {
  'academix': [
    'Compare two peer-reviewed studies with different methods and synthesize what their evidence supports.',
    'Assess a contested claim when only abstracts and one preprint are available; separate evidence from access limitations.',
    'Produce an annotated research summary and verify every quotation, citation field, and claim-to-source link.'
  ],
  'agent-browser': [
    'Verify a signed-in account form including required fields, invalid input, successful submit, and reload persistence.',
    'Inspect a logged-in page but stop because the current URL cannot be confirmed before interaction.',
    'Verify checkout duplicate-submit protection and distinguish observed UI state from untested payment behavior.'
  ],
  'apocalypse': [
    'Run a pre-mortem for moving critical background jobs to a new queue and prioritize the failure chain.',
    'Assess a launch risk when ownership and dependency telemetry are incomplete; identify what cannot be scored confidently.',
    'Evaluate a disaster-recovery proposal with prevention, detection, containment, recovery, and proof requirements.'
  ],
  'aria-apg-review': [
    'Review a custom combobox against applicable APG keyboard, focus, name, role, and state requirements.',
    'Assess a tree widget from source when rendered keyboard behavior cannot be exercised; separate findings from unverified risks.',
    'Review tabs in both themes and report only reproducible APG deviations with verification evidence.'
  ],
  'crawler-readiness-audit': [
    'Audit a marketing landing page for raw HTML content, metadata, canonical links, and crawler-visible navigation.',
    'Assess crawler readiness when rendered DOM is available but raw response capture is blocked; state the evidence limit.',
    'Audit a JavaScript product listing and recommend the smallest rendering change supported by tested URLs.'
  ],
  'decision-criticality-gate': [
    'Classify a reversible database-index change using every scoring dimension and state the proportional process.',
    'Classify a data-retention decision when legal impact is unknown; apply hard escalation without inventing a score.',
    'Classify an authentication-model change and give the level, rationale, required approvers, and next gate.'
  ],
  'fact-checker': [
    'Verify numerical claims in a product press release using independent primary or high-quality sources.',
    'Classify a claim supported by conflicting current sources and state what remains unverifiable.',
    'Check a quotation, attribution, and date while preserving exact source wording and confidence.'
  ],
  'find-skills': [
    'Find REST API review capability after checking the installed local inventory for overlap.',
    'Evaluate a popular external skill that duplicates a local skill and requires a new global CLI.',
    'Recommend or reject a specialized document skill after comparing unique capability, trust, and installation cost.'
  ],
  'frontend-design': [
    'Reshape a work-management screen around ownership, active work, feedback, and the next valid action.',
    'Give design direction from source evidence when the runtime cannot be opened; label visual assumptions.',
    'Design a dense responsive workflow using existing tokens, brand assets, accessible controls, and complete UI states.'
  ],
  'grill-me': [
    'Stress-test a reversible settings proposal with only questions that can change the decision.',
    'Preserve an approved plan while isolating one unresolved rollback choice and supplying a safe default.',
    'Interrogate an irreversible data-retention proposal until ownership, evidence, failure cost, and exit criteria are explicit.'
  ],
  'grill-with-docs': [
    'Challenge a module-boundary decision and record documentation only if the result is durable and load-bearing.',
    'Separate an enduring rejected constraint from a reversible visual preference when deciding ADR and glossary updates.',
    'Resolve an authentication architecture decision and hand off the exact ADR changes plus next implementation slice.'
  ],
  'humanizer': [
    'Rewrite a German status update in the author voice while preserving facts, commands, and uncertainty.',
    'Edit prose whose factual source is incomplete; improve tone without filling the missing evidence.',
    'Rewrite an English pull-request description while preserving Markdown links, identifiers, and verification results.'
  ],
  'improve-codebase-architecture': [
    'Review duplicated adapters and rank evidence-backed consolidation opportunities without implementing them.',
    'Assess an apparent architecture smell when commit history and runtime evidence are incomplete; separate risk from finding.',
    'Review a shared transaction boundary and provide locations, consequences, smallest refactor, and verification seam.'
  ],
  'microsoft-foundry': [
    'Resolve a repository containing conflicting azd and metadata project endpoints before any cloud mutation.',
    'Diagnose a private-network error when subscription context cannot be verified; stop before deployment.',
    'Verify a hosted-agent deployment path and report context, actions, evidence, and remaining cloud-state uncertainty.'
  ],
  'output-templates': [
    'Compose a concise direct diagnosis from reusable components without empty headings.',
    'Compose a partial-completion response that makes completed work, remaining work, and the exact unblocker visible.',
    'Compose a multi-finding review that scales structure to evidence and ends with concrete verification status.'
  ],
  'pre-launch-security-gate': [
    'Review authentication and authorization boundaries and return a release decision supported by attack-path evidence.',
    'Assess tenant isolation when the integration environment is unavailable; distinguish confirmed defects from unverified controls.',
    'Run a release gate covering auth, authorization, rate limits, validation, injection, tests, and residual risks.'
  ],
  'prompt-preflight': [
    'Silently refine an ambiguous implementation request whose desired output format is inferable from repository context.',
    'Stop on a high-impact request because the target system and authorization boundary are materially unknown.',
    'Pass through a clear rewrite request without adding planning ceremony or exposing the preflight process.'
  ],
  'quick-recap': [
    'Summarize a fully completed change with passing checks and no remaining action.',
    'Summarize partial implementation blocked only by a missing environment variable and name the exact next input.',
    'Summarize a task that could not start because the referenced repository is unavailable.'
  ],
  'rest-api-best-practices': [
    'Review a paginated collection endpoint for method, schema, ordering, bounds, errors, and authorization.',
    'Design retry behavior when idempotency requirements are unclear; expose the compatibility decision instead of guessing.',
    'Review a concurrent update contract using validators and report the smallest compatible fix plus tests.'
  ],
  'rigorous-response': [
    'Compare two implementation options and lead with a recommendation grounded in known constraints.',
    'Answer a question with incomplete evidence while separating confirmed facts, inference, assumption, and unknowns.',
    'Correct a false premise concisely and provide the actionable alternative without performative agreement.'
  ],
  'shepherd': [
    'Supervise a reversible refactor with baseline, checkpoint, mutation scope, verification, and recovery path.',
    'Handle a failed operation when no valid checkpoint exists; stop and report state without claiming rollback.',
    'Promote a verified change and report final state, evidence, residual risk, and recovery availability.'
  ],
  'skill-optimizer': [
    'Establish an unchanged baseline with train, validation, and isolated test splits for one Markdown skill.',
    'Reject a candidate that improves average validation but regresses a protected safety dimension.',
    'Freeze the best skill, open the untouched test split once, and report accepted, rejected, and remaining failure modes.'
  ],
  'tdd': [
    'Fix duplicate submission test-first at the shared public command seam and report the red-green evidence.',
    'Handle a failing test caused by an unavailable external service without misclassifying infrastructure failure as red behavior.',
    'Fix a parser regression with the smallest root change and report exact tests, results, and remaining limits.'
  ],
  'ux-logic-loop': [
    'Inventory a workflow into stories, states, priorities, and runnable checks before implementation.',
    'Update the loop when browser coverage is blocked; preserve open states and name missing evidence.',
    'Close a feature only after interaction, validation, error, duplicate-submit, and reload checks are evidenced.'
  ],
  'ux-pattern-review': [
    'Evaluate whether a wizard fits a multi-step task and verify the implementation states against the chosen pattern.',
    'Review a source-only interaction when runtime behavior is unavailable; separate pattern decision from unverified behavior.',
    'Review tabs with validation, busy, error, empty, keyboard, and responsive states using current sources.'
  ],
  'vercel-react-best-practices': [
    'Review a React request waterfall and recommend only measured fixes compatible with existing dependencies.',
    'Assess speculative memoization when no profile data exists; avoid presenting a performance claim as confirmed.',
    'Review a server-client serialization boundary and report finding, evidence, impact, fix, and verification.'
  ],
  'visual-flow-storyboard': [
    'Reconstruct onboarding from entry through success as frames with actions, states, transitions, and evidence.',
    'Storyboard an error path when screenshots omit backend feedback; mark inferred frames and missing proof.',
    'Reconstruct a purchase journey across responsive states and expose blockers, recovery, and verification gaps.'
  ],
  'visual-pr-review': [
    'Review a pull request across architecture, data flow, UI, security, tests, and developer impact with evidence-ranked findings.',
    'Review source changes when rendered behavior is unavailable; distinguish confirmed code defects from runtime risks.',
    'Produce an implementation plan for a cross-stack change with slices, contracts, rollback, and acceptance checks.'
  ],
  'web-design-guidelines': [
    'Audit an icon toolbar for accessible names, focus, themes, error states, and responsive behavior.',
    'Review UI source when browser execution is unavailable; report missing runtime coverage instead of claiming a pass.',
    'Audit a form through validation, busy, failure, success, duplicate submit, keyboard, and reload behavior.'
  ]
};

const splits = ['train', 'validation', 'test'];
for (const [index, split] of splits.entries()) {
  const target = path.join(runRoot, 'evals', split);
  fs.mkdirSync(target, { recursive: true });
  const tasks = Object.entries(profiles.skills).map(([skill, config]) => ({
    id: `${split}-${skill}`,
    category: skill,
    difficulty: split === 'train' ? 'medium' : 'hard',
    prompt: scenarios[skill][index],
    context_files: [`.agents/skills/${skill}/SKILL.md`],
    allowed_tools: split === 'train' ? ['filesystem'] : ['filesystem', 'shell'],
    expected_artifact: config.profile,
    rubric: 'evals/rubrics/output-quality.md',
    metadata: { source: split === 'train' ? 'curated' : 'held-out', version: '1.0.0' }
  }));
  fs.writeFileSync(path.join(target, 'tasks.jsonl'), `${tasks.map(task => JSON.stringify(task)).join('\n')}\n`);
}

console.log(`build-evals: wrote ${splits.length * Object.keys(profiles.skills).length} tasks across isolated splits.`);
