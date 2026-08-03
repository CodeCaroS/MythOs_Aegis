import pg from "pg";
import pgvector from "pgvector";
import { randomUUID } from "node:crypto";
import { redactSensitive } from "./redact.mjs";
import { traceSummary } from "./traces.mjs";

const { Pool } = pg;

function traceRow(row) {
  return row && {
    id: row.id, tenantId: row.tenant_id, name: row.name, status: row.status, input: row.input,
    output: row.output, error: row.error, evaluationStatus: row.evaluation_status,
    startedAt: row.started_at, endedAt: row.ended_at
  };
}

function stepRow(row) {
  return {
    id: row.id, traceId: row.trace_id, parentStepId: row.parent_step_id, name: row.name, status: row.status,
    input: row.input, output: row.output, toolCall: row.tool_call, error: row.error,
    latencyMs: row.latency_ms, cost: Number(row.cost ?? 0), startedAt: row.started_at, endedAt: row.ended_at
  };
}

function json(value) {
  return value === undefined ? null : JSON.stringify(value);
}

export class PostgresStore {
  constructor({ connectionString, embeddingDimensions = 1_536 }) {
    if (!Number.isInteger(embeddingDimensions) || embeddingDimensions < 1 || embeddingDimensions > 16_000) throw new Error("embeddingDimensions must be an integer between 1 and 16000.");
    this.pool = new Pool({ connectionString, max: 10, connectionTimeoutMillis: 10_000 });
    this.embeddingDimensions = embeddingDimensions;
  }

  async init() {
    const dimension = this.embeddingDimensions;
    await this.pool.query("CREATE EXTENSION IF NOT EXISTS vector");
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS semantic_cache (
        id text PRIMARY KEY, tenant_id text NOT NULL, settings_hash text NOT NULL, request_hash text NOT NULL,
        embedding vector(${dimension}) NOT NULL, response jsonb NOT NULL, tier text NOT NULL, model text NOT NULL,
        cost_estimate double precision NOT NULL DEFAULT 0, created_at timestamptz NOT NULL, expires_at timestamptz NOT NULL
      );
      CREATE INDEX IF NOT EXISTS semantic_cache_lookup_idx ON semantic_cache (tenant_id, settings_hash, expires_at);
      CREATE INDEX IF NOT EXISTS semantic_cache_embedding_hnsw ON semantic_cache USING hnsw (embedding vector_cosine_ops);
      CREATE TABLE IF NOT EXISTS route_decisions (
        id text PRIMARY KEY, tenant_id text NOT NULL, trace_id text, tier text NOT NULL, model text NOT NULL,
        provider text, reason text NOT NULL, complexity integer, cache_hit boolean NOT NULL, cost double precision NOT NULL,
        saved_cost double precision NOT NULL, latency_ms integer NOT NULL, created_at timestamptz NOT NULL
      );
      CREATE INDEX IF NOT EXISTS route_decisions_tenant_time_idx ON route_decisions (tenant_id, created_at DESC);
      CREATE TABLE IF NOT EXISTS traces (
        id text PRIMARY KEY, tenant_id text NOT NULL, name text NOT NULL, status text NOT NULL,
        input jsonb, output jsonb, error text, evaluation_status text NOT NULL DEFAULT 'unmarked',
        started_at timestamptz NOT NULL, ended_at timestamptz
      );
      CREATE INDEX IF NOT EXISTS traces_tenant_time_idx ON traces (tenant_id, started_at DESC);
      CREATE TABLE IF NOT EXISTS trace_steps (
        id text PRIMARY KEY, trace_id text NOT NULL REFERENCES traces(id) ON DELETE CASCADE, parent_step_id text,
        name text NOT NULL, status text NOT NULL, input jsonb, output jsonb, tool_call jsonb, error text,
        latency_ms integer, cost double precision NOT NULL DEFAULT 0, started_at timestamptz NOT NULL, ended_at timestamptz
      );
      CREATE INDEX IF NOT EXISTS trace_steps_trace_time_idx ON trace_steps (trace_id, started_at);
    `);
  }

  async close() { await this.pool.end(); }

  async findCache({ tenantId, embedding, settingsHash, threshold, now }) {
    const vector = pgvector.toSql(embedding);
    const { rows } = await this.pool.query(`
      SELECT response, tier, model, cost_estimate, 1 - (embedding <=> $1::vector) AS similarity
      FROM semantic_cache
      WHERE tenant_id = $2 AND settings_hash = $3 AND expires_at > $4
        AND 1 - (embedding <=> $1::vector) >= $5
      ORDER BY embedding <=> $1::vector LIMIT 1
    `, [vector, tenantId, settingsHash, now, threshold]);
    return rows[0] ? { response: rows[0].response, tier: rows[0].tier, model: rows[0].model, costEstimate: Number(rows[0].cost_estimate), similarity: Number(rows[0].similarity) } : null;
  }

  async putCache(entry) {
    await this.pool.query(`INSERT INTO semantic_cache
      (id, tenant_id, settings_hash, request_hash, embedding, response, tier, model, cost_estimate, created_at, expires_at)
      VALUES ($1,$2,$3,$4,$5::vector,$6,$7,$8,$9,$10,$11)`,
    [entry.id, entry.tenantId, entry.settingsHash, entry.requestHash, pgvector.toSql(entry.embedding), json(entry.response), entry.tier, entry.model, entry.costEstimate, entry.createdAt, entry.expiresAt]);
  }

  async logRouting(entry) {
    await this.pool.query(`INSERT INTO route_decisions
      (id, tenant_id, trace_id, tier, model, provider, reason, complexity, cache_hit, cost, saved_cost, latency_ms, created_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
    [entry.id, entry.tenantId, entry.traceId, entry.tier, entry.model, entry.provider ?? null, entry.reason, entry.complexity, entry.cacheHit, entry.cost, entry.savedCost, entry.latencyMs, entry.createdAt]);
  }

  async metrics({ tenantId }) {
    const { rows } = await this.pool.query(`SELECT COUNT(*)::int AS requests,
      COALESCE(AVG(latency_ms),0) AS average_latency_ms,
      COALESCE(AVG(CASE WHEN cache_hit THEN 1 ELSE 0 END),0) AS cache_hit_rate,
      COALESCE(SUM(saved_cost),0) AS saved_cost, COALESCE(SUM(cost),0) AS total_cost
      FROM route_decisions WHERE tenant_id = $1`, [tenantId]);
    const tiers = await this.pool.query(`SELECT tier, COUNT(*)::int AS requests FROM route_decisions WHERE tenant_id = $1 GROUP BY tier ORDER BY tier`, [tenantId]);
    return {
      requests: rows[0].requests, averageLatencyMs: Number(rows[0].average_latency_ms), cacheHitRate: Number(rows[0].cache_hit_rate),
      savedCost: Number(rows[0].saved_cost), totalCost: Number(rows[0].total_cost), tiers: tiers.rows
    };
  }

  async createTrace(entry) {
    const trace = {
      id: entry.id ?? randomUUID(), tenantId: entry.tenantId, name: entry.name ?? "pipeline",
      status: entry.status ?? "running", input: redactSensitive(entry.input ?? null), startedAt: entry.startedAt ?? new Date()
    };
    await this.pool.query(`INSERT INTO traces (id, tenant_id, name, status, input, started_at) VALUES ($1,$2,$3,$4,$5,$6)`, [trace.id, trace.tenantId, trace.name, trace.status, json(trace.input), trace.startedAt]);
    return trace;
  }

  async addTraceStep(entry) {
    const step = {
      id: entry.id ?? randomUUID(), traceId: entry.traceId, parentStepId: entry.parentStepId ?? null, name: entry.name ?? "step",
      status: entry.status ?? "ok", input: redactSensitive(entry.input ?? null), output: redactSensitive(entry.output ?? null),
      toolCall: redactSensitive(entry.toolCall ?? null), error: redactSensitive(entry.error ?? null), latencyMs: entry.latencyMs ?? null,
      cost: entry.cost ?? 0, startedAt: entry.startedAt ?? new Date(), endedAt: entry.endedAt ?? new Date()
    };
    const result = await this.pool.query(`INSERT INTO trace_steps
      (id, trace_id, parent_step_id, name, status, input, output, tool_call, error, latency_ms, cost, started_at, ended_at)
      SELECT $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13
      FROM traces WHERE id=$2 AND tenant_id=$14 RETURNING id`,
    [step.id, step.traceId, step.parentStepId, step.name, step.status, json(step.input), json(step.output), json(step.toolCall), step.error, step.latencyMs, step.cost, step.startedAt, step.endedAt, entry.tenantId]);
    if (result.rowCount !== 1) throw new Error("Trace not found for tenant.");
    return step;
  }

  async finishTrace(entry) {
    await this.pool.query(`UPDATE traces SET status=$2, output=$3, error=$4, evaluation_status=COALESCE($5,evaluation_status), ended_at=$6 WHERE id=$1`,
      [entry.id, entry.status, json(redactSensitive(entry.output ?? null)), redactSensitive(entry.error ?? null), entry.evaluationStatus ?? null, entry.endedAt ?? new Date()]);
  }

  async listTraces({ tenantId, limit }) {
    const { rows } = await this.pool.query(`SELECT * FROM traces WHERE tenant_id=$1 ORDER BY started_at DESC LIMIT $2`, [tenantId, limit]);
    return rows.map(traceRow);
  }

  async getTrace({ tenantId, id }) {
    const trace = await this.pool.query(`SELECT * FROM traces WHERE tenant_id=$1 AND id=$2`, [tenantId, id]);
    if (!trace.rows[0]) return null;
    const steps = await this.pool.query(`SELECT * FROM trace_steps WHERE trace_id=$1 ORDER BY started_at`, [id]);
    return traceSummary(traceRow(trace.rows[0]), steps.rows.map(stepRow));
  }

  async flagTrace({ tenantId, id }) {
    const { rows } = await this.pool.query(`UPDATE traces SET evaluation_status='flagged' WHERE tenant_id=$1 AND id=$2 RETURNING *`, [tenantId, id]);
    return traceRow(rows[0]);
  }
}
