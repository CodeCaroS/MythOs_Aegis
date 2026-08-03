import { randomUUID } from "node:crypto";
import { redactSensitive } from "./redact.mjs";

export function createTraceClient({ baseUrl, apiKey = "", tenantId = "default", fetchImpl = fetch }) {
  async function request(path, body) {
    const response = await fetchImpl(`${baseUrl.replace(/\/+$/, "")}${path}`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-tenant-id": tenantId, ...(apiKey ? { authorization: `Bearer ${apiKey}` } : {}) },
      body: JSON.stringify(redactSensitive(body))
    });
    if (!response.ok) throw new Error(`Trace collector returned HTTP ${response.status}.`);
    return response.json();
  }

  return {
    async start(name, input) {
      const trace = await request("/api/traces", { id: randomUUID(), name, status: "running", input, startedAt: new Date() });
      return {
        id: trace.id,
        async step(stepName, operation, details = {}) {
          const id = randomUUID(); const startedAt = new Date(); const started = performance.now();
          try {
            const output = await operation();
            await request(`/api/traces/${encodeURIComponent(trace.id)}/steps`, { id, name: stepName, status: "ok", ...details, output, latencyMs: Math.round(performance.now() - started), startedAt, endedAt: new Date() });
            return output;
          } catch (error) {
            await request(`/api/traces/${encodeURIComponent(trace.id)}/steps`, { id, name: stepName, status: "error", ...details, error: error.message, latencyMs: Math.round(performance.now() - started), startedAt, endedAt: new Date() });
            throw error;
          }
        },
        async flagForEvaluation() { return request(`/api/traces/${encodeURIComponent(trace.id)}/evaluation`, {}); }
      };
    }
  };
}
