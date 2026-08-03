const COMPLEXITY_TERMS = /\b(analy[sz]e|architecture|trade-?offs?|debug|migration|evidence|reason|strategy|multi-?step|security|optimi[sz]e)\b/gi;

function promptText(body) {
  return (body.messages ?? []).map(message => {
    if (typeof message.content === "string") return message.content;
    if (Array.isArray(message.content)) return message.content.map(part => part.text ?? "").join(" ");
    return "";
  }).join("\n");
}

export function estimateTokens(value) {
  return Math.max(1, Math.ceil((typeof value === "string" ? value : JSON.stringify(value)).length / 4));
}

export function scoreComplexity(body) {
  const text = promptText(body);
  let score = text.length > 8_000 ? 6 : text.length > 2_500 ? 3 : text.length > 800 ? 1 : 0;
  score += Math.min(3, (text.match(COMPLEXITY_TERMS) ?? []).length);
  if (body.tools?.length) score += 2;
  if (body.response_format || body.reasoning_effort) score += 1;
  return { score, inputTokens: estimateTokens(text), text };
}

function requiredQuality(score, policy = {}) {
  if (score <= Number(policy.simpleMaxScore ?? 1)) return 0.4;
  if (score <= Number(policy.mediumMaxScore ?? 5)) return 0.7;
  return 0.9;
}

function estimatedCost(tier, inputTokens, outputTokens) {
  return (inputTokens * tier.inputPerMillion + outputTokens * tier.outputPerMillion) / 1_000_000;
}

export function selectRoute({ body, tiers, maxLatencyMs = Number.POSITIVE_INFINITY, policy }) {
  if (!Array.isArray(tiers) || tiers.length === 0) throw new Error("At least one model tier is required.");
  const explicit = body.model && body.model !== "auto"
    ? tiers.find(tier => tier.tier === body.model || tier.model === body.model)
    : null;
  const complexity = scoreComplexity(body);
  const outputTokens = Math.min(Number(body.max_completion_tokens ?? body.max_tokens ?? 512), 16_384);
  if (explicit) {
    return { ...explicit, complexity: complexity.score, estimatedCost: estimatedCost(explicit, complexity.inputTokens, outputTokens), reason: "explicit-model" };
  }

  const minimumQuality = requiredQuality(complexity.score, policy);
  const suitable = tiers.filter(tier => tier.quality >= minimumQuality && tier.latencyMs <= maxLatencyMs);
  const pool = suitable.length > 0 ? suitable : [...tiers].sort((a, b) => b.quality - a.quality).slice(0, 1);
  const chosen = [...pool].sort((a, b) => {
    const cost = estimatedCost(a, complexity.inputTokens, outputTokens) - estimatedCost(b, complexity.inputTokens, outputTokens);
    return cost || a.latencyMs - b.latencyMs || b.quality - a.quality;
  })[0];
  return {
    ...chosen,
    complexity: complexity.score,
    requiredQuality: minimumQuality,
    estimatedCost: estimatedCost(chosen, complexity.inputTokens, outputTokens),
    reason: suitable.length > 0 ? "cheapest-suitable" : "quality-fallback"
  };
}

export function calculateActualCost(tier, usage = {}) {
  return ((usage.prompt_tokens ?? 0) * tier.inputPerMillion + (usage.completion_tokens ?? 0) * tier.outputPerMillion) / 1_000_000;
}
