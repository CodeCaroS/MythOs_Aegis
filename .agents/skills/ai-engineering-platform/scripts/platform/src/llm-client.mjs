function endpoint(baseUrl, resource) {
  return `${String(baseUrl).replace(/\/+$/, "")}/${resource.replace(/^\/+/, "")}`;
}

async function postJson({ url, apiKey, body, timeoutMs, fetchImpl }) {
  let response;
  try {
    response = await fetchImpl(url, {
      method: "POST",
      headers: { "content-type": "application/json", ...(apiKey ? { authorization: `Bearer ${apiKey}` } : {}) },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs)
    });
  } catch (error) {
    const wrapped = new Error(`The configured AI provider could not be reached. Check its base URL and network access.`);
    wrapped.cause = error;
    throw wrapped;
  }
  const raw = await response.text();
  let value;
  try { value = raw ? JSON.parse(raw) : {}; } catch { value = null; }
  if (!response.ok || !value) {
    const error = new Error(`The configured AI provider rejected the request with HTTP ${response.status}. Check the model, credentials, and provider limits.`);
    error.statusCode = response.status;
    error.technicalDetails = raw.slice(0, 4_000);
    throw error;
  }
  return value;
}

export function createCompatibleClient(config, fetchImpl = fetch) {
  return {
    async embed(input) {
      const response = await postJson({
        url: endpoint(config.embedding.baseUrl, "embeddings"), apiKey: config.embedding.apiKey,
        body: { model: config.embedding.model, input }, timeoutMs: config.requestTimeoutMs, fetchImpl
      });
      if (!Array.isArray(response.data?.[0]?.embedding)) throw new Error("The embedding provider returned no embedding vector.");
      if (response.data[0].embedding.length !== config.embeddingDimensions) throw new Error(`The embedding provider returned ${response.data[0].embedding.length} dimensions; configure EMBEDDING_DIMENSIONS to match.`);
      return response.data[0].embedding;
    },

    async complete({ tier, model, body }) {
      const selected = config.tiers.find(item => item.tier === tier);
      if (!selected) throw new Error(`Unknown model tier: ${tier}.`);
      const started = performance.now();
      const response = await postJson({
        url: endpoint(selected.baseUrl, "chat/completions"), apiKey: selected.apiKey,
        body: { ...body, model }, timeoutMs: config.requestTimeoutMs, fetchImpl
      });
      return { response, latencyMs: Math.round(performance.now() - started) };
    }
  };
}

export async function compatibleChat({ baseUrl, apiKey, model, input, timeoutMs = 60_000, fetchImpl = fetch }) {
  return (await compatibleCompletion({ baseUrl, apiKey, model, input, timeoutMs, fetchImpl })).text;
}

export async function compatibleCompletion({ baseUrl, apiKey, model, input, timeoutMs = 60_000, fetchImpl = fetch }) {
  const started = performance.now();
  const response = await postJson({ url: endpoint(baseUrl, "chat/completions"), apiKey, body: { ...input, model: input.model ?? model }, timeoutMs, fetchImpl });
  return {
    response,
    text: response.choices?.[0]?.message?.content ?? "",
    latencyMs: Math.round(performance.now() - started)
  };
}
