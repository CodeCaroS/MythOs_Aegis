import { execFile as execFileCallback } from "node:child_process";
import { readFile } from "node:fs/promises";
import { promisify } from "node:util";
import path from "node:path";
import { fileURLToPath } from "node:url";

const execFile = promisify(execFileCallback);
const SERVICE_ID = "mythos-ai-engineering-platform";
const REQUIRED_CONFIGURATION = [
  "TIER_CHEAP_MODEL",
  "TIER_MEDIUM_MODEL",
  "TIER_POWERFUL_MODEL",
  "EMBEDDING_MODEL"
];

function parseDotEnv(text) {
  const values = {};
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match) continue;
    let value = match[2];
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    values[match[1]] = value;
  }
  return values;
}

function hasTenantKey(value) {
  try {
    const parsed = JSON.parse(value ?? "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) && Object.keys(parsed).length > 0;
  } catch { return false; }
}

export async function ensurePlatform({ environment, probePort, startCompose, wait = delay, attempts = 20 }) {
  const missing = REQUIRED_CONFIGURATION.filter(key => !environment[key]);
  if (!environment.PLATFORM_API_KEY && !hasTenantKey(environment.PLATFORM_TENANT_KEYS)) missing.unshift("PLATFORM_API_KEY or PLATFORM_TENANT_KEYS");
  if (missing.length > 0) return { status: "skipped", message: `AI platform auto-start skipped; configure ${missing.join(", ")} in scripts/platform/.env.` };

  const current = await probePort();
  if (current === "expected") return { status: "reused", message: "AI Engineering Platform is already healthy and was reused." };
  if (current === "foreign") return { status: "rejected", message: "AI platform auto-start refused because another process owns the configured port." };

  await startCompose();
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const state = await probePort();
    if (state === "expected") return { status: "started", message: "AI Engineering Platform started for this Harness session." };
    if (state === "foreign") return { status: "rejected", message: "AI platform start was rejected because another process owns the configured port." };
    await wait(500);
  }
  return { status: "failed", message: "AI platform containers started, but the expected health endpoint did not become ready." };
}

function delay(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function defaultProbe(port) {
  let response;
  try {
    response = await fetch(`http://127.0.0.1:${port}/health`, { signal: AbortSignal.timeout(1_000) });
  } catch (error) {
    return error.cause?.code === "ECONNREFUSED" ? "absent" : "foreign";
  }
  if (!response.ok) return "foreign";
  try {
    const body = await response.json();
    return body?.service === SERVICE_ID && body?.status === "ok" ? "expected" : "foreign";
  } catch { return "foreign"; }
}

async function hookInput() {
  let raw = "";
  for await (const chunk of process.stdin) raw += chunk;
  raw = raw.replace(/^\uFEFF/, "");
  try { return raw ? JSON.parse(raw) : {}; } catch { return {}; }
}

export async function runSessionStartHook() {
  const platformDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  let fileEnvironment = {};
  try { fileEnvironment = parseDotEnv(await readFile(path.join(platformDir, ".env"), "utf8")); } catch { /* Missing local configuration is handled below. */ }
  const environment = { ...fileEnvironment, ...process.env };
  const port = Number(environment.PORT ?? 8797);
  const input = await hookInput();
  let result;
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    result = { status: "skipped", message: "AI platform auto-start skipped because PORT must be an integer from 1 to 65535." };
  } else {
    try {
      result = await ensurePlatform({
        environment,
        probePort: () => defaultProbe(port),
        startCompose: () => execFile("docker", ["compose", "--project-directory", platformDir, "up", "-d", "--build", "--wait"], { cwd: platformDir, windowsHide: true, timeout: 120_000, maxBuffer: 1_000_000 })
      });
    } catch {
      result = { status: "failed", message: "AI platform auto-start failed. Check Docker Desktop and scripts/platform/.env; Harness execution will continue." };
    }
  }

  const source = ["startup", "resume"].includes(input.source) ? input.source : "session";
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext: `${result.message} Source: ${source}. Active policy is never changed by this hook.`
    }
  }));
  return result;
}
