export const OPENAPI = {
  openapi: "3.1.0",
  info: { title: "MythOs AI Engineering Platform", version: "0.1.0" },
  servers: [{ url: "/" }],
  components: {
    securitySchemes: { bearerAuth: { type: "http", scheme: "bearer" } },
    schemas: {
      Problem: { type: "object", required: ["type", "title", "status", "detail"], properties: { type: { type: "string" }, title: { type: "string" }, status: { type: "integer" }, detail: { type: "string" }, instance: { type: "string" } } },
      ChatRequest: { type: "object", required: ["messages"], properties: { model: { type: "string", default: "auto" }, messages: { type: "array", minItems: 1, items: { type: "object" } }, stream: { const: false } } }
    }
  },
  security: [{ bearerAuth: [] }],
  paths: {
    "/v1/chat/completions": { post: { summary: "Route an OpenAI-compatible chat completion", requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ChatRequest" } } } }, responses: { "200": { description: "OpenAI-compatible chat completion" }, "422": { description: "Invalid or unsupported input", content: { "application/problem+json": { schema: { $ref: "#/components/schemas/Problem" } } } } } } },
    "/v1/embeddings": { post: { summary: "Proxy configured embeddings", responses: { "200": { description: "OpenAI-compatible embedding list" } } } },
    "/v1/models": { get: { summary: "List configured routing tiers", responses: { "200": { description: "Model aliases" } } } },
    "/api/metrics": { get: { summary: "Routing, cost, latency, and cache metrics", responses: { "200": { description: "Metrics" } } } },
    "/api/traces": { get: { summary: "List traces", responses: { "200": { description: "Trace list" } } }, post: { summary: "Create an SDK trace", responses: { "201": { description: "Trace created" } } } },
    "/api/traces/{traceId}": { get: { summary: "Read a trace timeline and root cause", parameters: [{ name: "traceId", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "Trace timeline" }, "404": { description: "Not found" } } } }
  }
};
