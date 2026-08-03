import path from "node:path";
import { readFile, writeFile } from "node:fs/promises";
import { redactSensitive } from "./redact.mjs";

function isInside(root, target) {
  const relative = path.relative(path.resolve(root), path.resolve(root, target));
  return relative !== "" && !relative.startsWith("..") && !path.isAbsolute(relative);
}

export function validateDocUpdates({ root, candidates, updates }) {
  const allowed = new Set(candidates.map(candidate => candidate.replaceAll("\\", "/")));
  return (updates ?? []).filter(update => {
    if (!update || typeof update.path !== "string" || typeof update.content !== "string" || update.content.length > 200_000) return false;
    if (!Array.isArray(update.sources) || update.sources.length === 0 || typeof update.uncertainty !== "string") return false;
    const normalized = update.path.replaceAll("\\", "/");
    return normalized.toLowerCase().endsWith(".md") && allowed.has(normalized) && isInside(root, normalized);
  });
}

export function parseModelJson(text) {
  const cleaned = String(text).trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  return JSON.parse(cleaned);
}

export function changedFilesFromDiff(diff) {
  return [...String(diff).matchAll(/^\+\+\+ b\/(.+)$/gm)].map(match => match[1]);
}

export async function selectDocCandidates({ root, markdownFiles, changedFiles, diff, limit = 12 }) {
  const terms = new Set(changedFiles.flatMap(file => {
    const base = path.basename(file, path.extname(file));
    return [base, ...file.split(/[\\/._-]+/)].filter(term => term.length >= 4);
  }));
  for (const match of String(diff).matchAll(/\b[A-Za-z_$][A-Za-z0-9_$]{5,}\b/g)) terms.add(match[0]);
  const ranked = [];
  for (const file of markdownFiles) {
    let content;
    try { content = await readFile(path.join(root, file), "utf8"); } catch { continue; }
    let score = changedFiles.includes(file) ? 100 : 0;
    const lower = content.toLowerCase();
    for (const term of [...terms].slice(0, 200)) if (lower.includes(term.toLowerCase())) score += 1;
    if (score > 0) ranked.push({ path: file.replaceAll("\\", "/"), content: content.slice(0, 30_000), score });
  }
  return ranked.sort((a, b) => b.score - a.score || a.path.localeCompare(b.path)).slice(0, limit);
}

export function buildDocPrompt({ diff, candidates }) {
  const documents = candidates.map(candidate => `\n--- ${candidate.path} ---\n${candidate.content}`).join("\n");
  return redactSensitive(`You update technical Markdown documentation from verified code changes.
Return one JSON object with an updates array. Each update must contain path, complete content, sources (changed code paths), and uncertainty.
Only update the supplied Markdown candidates. Preserve unrelated prose. If evidence is insufficient, return {"updates":[]}.

GIT DIFF:
${String(diff).slice(0, 50_000)}

MARKDOWN CANDIDATES:${documents.slice(0, 120_000)}`);
}

export async function applyDocUpdates({ root, candidates, updates }) {
  const accepted = validateDocUpdates({ root, candidates: candidates.map(candidate => candidate.path), updates });
  for (const update of accepted) await writeFile(path.join(root, update.path), update.content.replace(/\r?\n/g, "\n"), "utf8");
  return accepted;
}

export function renderDocReport(updates) {
  if (updates.length === 0) return "# Documentation update report\n\nNo evidence-backed Markdown changes were proposed.\n";
  return `# Documentation update report\n\n${updates.map(update => `## ${update.path}\n\n- Sources: ${(update.sources ?? []).join(", ") || "not supplied"}\n- Uncertainty: ${update.uncertainty || "not supplied"}`).join("\n\n")}\n`;
}
