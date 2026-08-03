import { readFile, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "./config.mjs";
import { createCompatibleClient, compatibleChat, compatibleCompletion } from "./llm-client.mjs";
import { createChatService } from "./chat-service.mjs";
import { PostgresStore } from "./store.mjs";
import { createHttpServer } from "./server.mjs";
import { runRegression } from "./regression.mjs";
import { applyDocUpdates, buildDocPrompt, changedFilesFromDiff, parseModelJson, renderDocReport, selectDocCandidates } from "./doc-healer.mjs";
import {
  collectEvidence,
  loadPolicy,
  promoteCandidate,
  proposeCandidate,
  readEvaluationCases,
  resolveRepositoryPath,
  renderImprovementReport,
  writePolicy
} from "./self-improvement.mjs";

const PLATFORM_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function args(values) {
  const parsed = { _: [] };
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (!value.startsWith("--")) { parsed._.push(value); continue; }
    const [key, inline] = value.slice(2).split("=", 2);
    parsed[key] = inline ?? (values[index + 1] && !values[index + 1].startsWith("--") ? values[++index] : true);
  }
  return parsed;
}

function required(value, name) {
  if (!value || value === true) throw new Error(`${name} is required.`);
  return value;
}

function caseInput(item, model) {
  const input = item.input ?? { messages: item.messages };
  return { ...input, model: input.model ?? model };
}

async function serve() {
  const config = loadConfig();
  const store = new PostgresStore({ connectionString: config.databaseUrl, embeddingDimensions: config.embeddingDimensions });
  await store.init();
  const client = createCompatibleClient(config);
  const service = createChatService({
    store,
    tiers: config.tiers,
    embed: client.embed,
    complete: client.complete,
    cacheThreshold: config.cacheThreshold,
    cacheTtlSeconds: config.cacheTtlSeconds,
    routingPolicy: config.policy.routing,
    systemPrompt: config.policy.prompts.system
  });
  const server = createHttpServer({ service, store, config });
  server.listen(config.port, config.host, () => console.log(`AI Engineering Platform listening on http://${config.host}:${config.port}`));
  const close = () => server.close(() => store.close().finally(() => process.exit(0)));
  process.on("SIGINT", close); process.on("SIGTERM", close);
}

async function regress(options) {
  const datasetPath = path.resolve(required(options.dataset, "--dataset"));
  const cases = JSON.parse(await readFile(datasetPath, "utf8"));
  if (!Array.isArray(cases) || cases.length === 0) throw new Error("The regression dataset must be a non-empty JSON array.");
  const baselineUrl = required(options["baseline-url"] ?? process.env.BASELINE_API_URL, "--baseline-url or BASELINE_API_URL");
  const candidateUrl = options["candidate-url"] ?? process.env.CANDIDATE_API_URL ?? "http://127.0.0.1:8797/v1";
  const judgeUrl = required(options["judge-url"] ?? process.env.JUDGE_BASE_URL, "--judge-url or JUDGE_BASE_URL");
  const judgeModel = required(options["judge-model"] ?? process.env.JUDGE_MODEL, "--judge-model or JUDGE_MODEL");
  const baselineModel = options["baseline-model"] ?? process.env.BASELINE_MODEL ?? "auto";
  const candidateModel = options["candidate-model"] ?? process.env.CANDIDATE_MODEL ?? "auto";
  const judge = async ({ item, answer, version }) => {
    const text = await compatibleChat({
      baseUrl: judgeUrl, apiKey: process.env.JUDGE_API_KEY ?? "", model: judgeModel,
      input: { response_format: { type: "json_object" }, temperature: 0, messages: [
        { role: "system", content: "Score the answer from 0 to 1 against the case criteria. Return JSON: {\"score\": number, \"reason\": string}." },
        { role: "user", content: JSON.stringify({ case: item, version, answer }) }
      ] }
    });
    return parseModelJson(text);
  };
  const result = await runRegression({
    cases,
    baseline: item => compatibleChat({ baseUrl: baselineUrl, apiKey: process.env.BASELINE_API_KEY ?? "", model: baselineModel, input: caseInput(item, baselineModel) }),
    candidate: item => compatibleChat({ baseUrl: candidateUrl, apiKey: process.env.CANDIDATE_API_KEY ?? "", model: candidateModel, input: caseInput(item, candidateModel) }),
    judge,
    allowedDrop: Number(options["allowed-drop"] ?? process.env.ALLOWED_SCORE_DROP ?? 0.05)
  });
  const report = path.resolve(options.report ?? "model-regression-report.md");
  await writeFile(report, result.markdown, "utf8");
  console.log(`${result.passed ? "PASS" : "FAIL"}: ${result.cases.length} cases; report: ${report}`);
  if (!result.passed) process.exitCode = 1;
}

async function healDocs(options) {
  const root = process.cwd();
  const base = options.base ?? process.env.DOCS_BASE_REF ?? "origin/main";
  const diff = execFileSync("git", ["diff", `${base}...HEAD`, "--"], { cwd: root, encoding: "utf8", maxBuffer: 5_000_000 });
  const changedFiles = changedFilesFromDiff(diff);
  const markdownFiles = execFileSync("git", ["ls-files", "--", "*.md"], { cwd: root, encoding: "utf8" }).split(/\r?\n/).filter(Boolean);
  const candidates = await selectDocCandidates({ root, markdownFiles, changedFiles, diff });
  let accepted = [];
  if (diff && candidates.length > 0) {
    const answer = await compatibleChat({
      baseUrl: required(process.env.DOCS_LLM_BASE_URL, "DOCS_LLM_BASE_URL"), apiKey: process.env.DOCS_LLM_API_KEY ?? "",
      model: required(process.env.DOCS_LLM_MODEL, "DOCS_LLM_MODEL"),
      input: { temperature: 0, response_format: { type: "json_object" }, messages: [{ role: "user", content: buildDocPrompt({ diff, candidates }) }] }
    });
    accepted = await applyDocUpdates({ root, candidates, updates: parseModelJson(answer).updates ?? [] });
  }
  const report = path.resolve(options.report ?? "documentation-update-report.md");
  await writeFile(report, renderDocReport(accepted), "utf8");
  console.log(`Documentation healer updated ${accepted.length} Markdown file(s); report: ${report}`);
}

function scopedPath(value, fallback, label) {
  return resolveRepositoryPath(process.cwd(), value ?? fallback, label);
}

function promptEvaluator(environment) {
  return async ({ policy, cases }) => {
    const targetUrl = required(environment.SELF_IMPROVEMENT_TARGET_URL, "SELF_IMPROVEMENT_TARGET_URL");
    const targetModel = required(environment.SELF_IMPROVEMENT_TARGET_MODEL, "SELF_IMPROVEMENT_TARGET_MODEL");
    const judgeUrl = required(environment.SELF_IMPROVEMENT_JUDGE_URL, "SELF_IMPROVEMENT_JUDGE_URL");
    const judgeModel = required(environment.SELF_IMPROVEMENT_JUDGE_MODEL, "SELF_IMPROVEMENT_JUDGE_MODEL");
    const inputPrice = Number(environment.SELF_IMPROVEMENT_INPUT_PER_MILLION ?? 0);
    const outputPrice = Number(environment.SELF_IMPROVEMENT_OUTPUT_PER_MILLION ?? 0);
    const results = [];
    for (const item of cases) {
      const messages = policy.prompts.system
        ? [{ role: "system", content: policy.prompts.system }, ...item.input.messages]
        : item.input.messages;
      const completion = await compatibleCompletion({
        baseUrl: targetUrl,
        apiKey: environment.SELF_IMPROVEMENT_TARGET_API_KEY ?? "",
        model: targetModel,
        input: { ...item.input, messages, model: targetModel }
      });
      const judgment = parseModelJson(await compatibleChat({
        baseUrl: judgeUrl,
        apiKey: environment.SELF_IMPROVEMENT_JUDGE_API_KEY ?? "",
        model: judgeModel,
        input: {
          temperature: 0,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: "Score the answer from 0 to 1 against the criteria. Return JSON only: {\"score\": number, \"reason\": string}." },
            { role: "user", content: JSON.stringify({ criteria: item.criteria, answer: completion.text }) }
          ]
        }
      }));
      const score = Math.max(0, Math.min(1, Number(judgment.score) || 0));
      const usage = completion.response.usage ?? {};
      const cost = ((Number(usage.prompt_tokens ?? 0) * inputPrice) + (Number(usage.completion_tokens ?? 0) * outputPrice)) / 1_000_000;
      results.push({ score, cost, latencyMs: completion.latencyMs, passed: score >= Number(item.minimumScore ?? 0) });
    }
    return {
      quality: results.reduce((sum, item) => sum + item.score, 0) / results.length,
      cost: results.reduce((sum, item) => sum + item.cost, 0),
      latencyMs: results.reduce((sum, item) => sum + item.latencyMs, 0) / results.length,
      floorsPassed: results.every(item => item.passed)
    };
  };
}

async function improve(options) {
  const report = scopedPath(options.report, "self-improvement-report.md", "--report");
  const writeReport = value => writeFile(report, value, "utf8");
  const proposerUrl = process.env.SELF_IMPROVEMENT_PROPOSER_URL;
  const proposerModel = process.env.SELF_IMPROVEMENT_PROPOSER_MODEL;
  if (!proposerUrl || !proposerModel) {
    await writeReport(renderImprovementReport({ status: "SKIPPED", message: "Missing SELF_IMPROVEMENT_PROPOSER_URL or SELF_IMPROVEMENT_PROPOSER_MODEL; active policy was not changed." }));
    console.log(`SKIPPED: self-improvement is not configured; report: ${report}`);
    return;
  }

  let config;
  try { config = loadConfig(); }
  catch (error) {
    await writeReport(renderImprovementReport({ status: "SKIPPED", message: `${error.message} Active policy was not changed.` }));
    console.log(`SKIPPED: platform configuration is incomplete; report: ${report}`);
    return;
  }

  const policyPath = scopedPath(options.policy, path.join(PLATFORM_ROOT, "policy.json"), "--policy");
  const output = scopedPath(options.output, path.join(PLATFORM_ROOT, "policy.candidate.json"), "--output");
  const trainingPath = scopedPath(required(options.training, "--training"), "", "--training");
  const heldoutPath = scopedPath(required(options.heldout, "--heldout"), "", "--heldout");
  const regressionReport = options["regression-report"] ? scopedPath(options["regression-report"], "", "--regression-report") : undefined;
  const baseline = loadPolicy(policyPath);
  const trainingCases = await readEvaluationCases(trainingPath);
  let evidence;
  try {
    evidence = await collectEvidence({
      baseUrl: process.env.SELF_IMPROVEMENT_EVIDENCE_URL ?? `http://127.0.0.1:${config.port}`,
      apiKey: process.env.SELF_IMPROVEMENT_EVIDENCE_API_KEY ?? process.env.PLATFORM_API_KEY ?? "",
      tenantId: process.env.SELF_IMPROVEMENT_TENANT_ID ?? "self-improvement",
      regressionReport
    });
  } catch {
    await writeReport(renderImprovementReport({ status: "SKIPPED", message: "Trace, cost, cache, or regression evidence could not be collected; active policy was not changed." }));
    console.log(`SKIPPED: evidence collection failed; report: ${report}`);
    return;
  }

  let candidate;
  try {
    candidate = await proposeCandidate({
      baseline,
      evidence,
      trainingCases,
      propose: prompt => compatibleChat({
        baseUrl: proposerUrl,
        apiKey: process.env.SELF_IMPROVEMENT_PROPOSER_API_KEY ?? "",
        model: proposerModel,
        input: { temperature: 0, response_format: { type: "json_object" }, messages: [{ role: "user", content: prompt }] }
      })
    });
  } catch {
    await writeReport(renderImprovementReport({ status: "REJECTED", message: "The proposal was malformed or violated the mutation allowlist; active policy was not changed." }));
    console.log(`REJECTED: unsafe or invalid proposal; report: ${report}`);
    return;
  }

  const heldoutCases = await readEvaluationCases(heldoutPath);
  let result;
  try {
    result = await promoteCandidate({
      baseline,
      candidate,
      trainingCases,
      heldoutCases,
      tiers: config.tiers,
      promptEvaluator: promptEvaluator(process.env),
      writeCandidate: value => writePolicy(output, value)
    });
  } catch {
    await writeReport(renderImprovementReport({ status: "REJECTED", message: "Independent evaluation could not verify the proposal; active policy was not changed.", candidate }));
    console.log(`REJECTED: candidate evaluation was incomplete; report: ${report}`);
    return;
  }
  await writeReport(renderImprovementReport({
    status: result.accepted ? "ACCEPTED" : "REJECTED",
    message: result.accepted ? "Training and held-out checks improved within all caps. The candidate is ready for human review." : "The candidate failed training or held-out checks; active policy was not changed.",
    training: result.training,
    heldout: result.heldout,
    candidate
  }));
  console.log(`${result.accepted ? "ACCEPTED" : "REJECTED"}: self-improvement candidate; report: ${report}`);
}

const options = args(process.argv.slice(2));
const command = options._[0];
try {
  if (command === "serve") await serve();
  else if (command === "regress") await regress(options);
  else if (command === "heal-docs") await healDocs(options);
  else if (command === "improve") await improve(options);
  else throw new Error("Usage: node src/cli.mjs serve | regress --dataset FILE --baseline-url URL | heal-docs --base REF | improve --training FILE --heldout FILE");
} catch (error) {
  console.error(error.message);
  if (process.env.DEBUG && error.technicalDetails) console.error(error.technicalDetails);
  process.exitCode = 1;
}
