---
name: system-design-scale
description: >
  Reviews and designs systems for real traffic: load estimation, bottleneck
  identification, failure modes, back-pressure, caching, queueing, and degradation.
  Use when a design must survive growth, when latency or timeouts appear under load,
  when planning capacity, or when answering "what happens at a million users".
version: 1.0.0
author: Caro
license: Apache-2.0
overlaps_with: [apocalypse]
tags:
  - system-design
  - scalability
  - bottlenecks
  - back-pressure
  - caching
  - queueing
  - failure-modes
  - capacity-planning
  - reliability
triggers:
  - what happens at scale
  - system design review
  - the service falls over under load
  - capacity planning
  - add a cache or a queue
  - timeouts and retries under traffic
  - design for a million users
  - find the bottleneck
capabilities:
  - load-estimation
  - bottleneck-analysis
  - failure-mode-analysis
  - back-pressure-design
  - caching-strategy
  - degradation-planning
outputs:
  - markdown
  - design-review
  - load-estimate
  - failure-table
requires:
  - repository-access
constraints:
  require_numbers_before_architecture: true
  no_component_without_a_failure_mode: true
  measure_before_optimizing: true
---

# System Design at Scale

## Purpose

Prevent designs that work in a demo and collapse on contact with real traffic, and
prevent the opposite failure: architecture added for load that will never arrive.

## Core Principle

```text
State the numbers first.
Find the single narrowest resource.
Decide what the system does when that resource runs out.
```

Every component added to a design must come with the failure it introduces. A design
without failure modes is a diagram, not a design.

---

## Activation Triggers

Apply this skill when:

- A new service, endpoint, or job is designed
- Latency, timeouts, connection exhaustion, or queue growth appear under load
- Someone proposes a cache, queue, shard, replica, or new service
- Traffic, data volume, or tenant count is expected to grow by an order of magnitude
- A postmortem points at saturation rather than a logic bug

---

# Workflow

## Phase 1: Estimate Before Architecting

Refuse to choose components before these numbers exist, even as explicit assumptions:

| Quantity | Needed value |
|---|---|
| Requests per second | Average and peak, with the peak-to-average ratio |
| Read / write ratio | Per critical endpoint |
| Payload size | Typical and maximum |
| Data growth | Per day, and retention period |
| Working set | Data that must be fast, versus data that may be slow |
| Latency target | Per endpoint, at a stated percentile |
| Availability target | And what a violation costs |
| Concurrency | Simultaneous users, connections, and jobs |

Rules:

- Peak, not average, sizes the system. State the peak-to-average ratio explicitly.
- Latency targets without a percentile are meaningless. Use p95 or p99.
- Mark every unknown as an assumption in the output. Do not silently pick a number.

## Phase 2: Find the Bottleneck

There is normally one binding constraint. Identify it before proposing changes.

Candidate constraints, in the order they usually bind:

1. Database connections and lock contention
2. Single-row or single-partition hot spots
3. Synchronous external calls inside a request path
4. CPU on serialization, compression, or template rendering
5. Memory and garbage collection pressure
6. Network bandwidth and payload size
7. Disk IOPS and write amplification

Rules:

- Confirm the constraint with evidence: a profile, a metric, a query plan, a saturation graph.
- Optimizing a non-binding resource changes nothing. Say so instead of doing it.
- Recompute the constraint after every change. Fixing one moves it, never removes it.

## Phase 3: Design the Request Path

For each critical path, write it out and check each hop:

```text
client → edge → auth → application → cache → database → external service → response
```

At every hop, verify:

- A timeout is set, shorter than the caller's timeout
- Retries are bounded, jittered, and only for idempotent operations
- A circuit breaker exists for external dependencies
- Connection pools are sized against the downstream limit, not the upstream demand
- Nothing unbounded is loaded: no unpaginated list, no unlimited batch, no full scan
- Work that need not be synchronous has been moved out of the path

Reject:

- Retries without backoff, which turn a slow dependency into an outage
- Timeouts that increase from caller to callee
- Fan-out inside a loop where a batched call exists
- An N+1 query pattern on any path that scales with traffic

## Phase 4: Caching

Rules:

- Name what is cached, its key, its TTL, its invalidation event, and its staleness tolerance.
- Cache only what is read far more often than it is written.
- Handle the three failure modes explicitly:
  - **Stampede**: many misses at once. Use request coalescing or a short lock.
  - **Penetration**: repeated misses for absent keys. Cache the negative result.
  - **Avalanche**: correlated expiry. Jitter the TTLs.
- Decide behavior when the cache is unavailable: does the system serve slow, or fail?
- A cache that must be correct is not a cache, it is a database. Say so.

## Phase 5: Queues, Back-Pressure, and Degradation

Rules:

- A queue converts a latency problem into a backlog problem. Bound it, and define what
  happens when the bound is reached: reject, shed, or spill.
- Every consumer needs a dead-letter path and a poison-message policy.
- Prefer back-pressure over unbounded buffering. Unbounded buffers fail as memory exhaustion.
- Define load shedding before the incident: which traffic is dropped first, and by which key.
- Define graceful degradation per feature: what still works when a dependency is down.
- Make retried operations idempotent, keyed by a client-supplied idempotency token.

## Phase 6: Data Layer

Rules:

- Verify indexes against the actual query shapes, including sort and filter order.
- Check for hot partitions before choosing a partition key. Sequential keys create hot spots.
- State the consistency requirement per operation. Read replicas introduce replication lag.
- Bound every query: pagination limits, statement timeouts, and result-size caps.
- Plan migrations as expand, backfill, contract. Never a blocking rewrite on a live table.
- Confirm the backup and the restore. An untested restore is not a backup.

## Phase 7: Failure Table

Every design must produce this table before it is approved. Column set aligned with the shared failure table in [output-templates](../output-templates/references/components.md).

| Component | Failure | Blast radius | Detection | Response |
|---|---|---|---|---|
| Database primary | Unavailable | All writes | Error rate, replica lag | Failover, write queue, read-only mode |
| Cache | Cold or down | Latency spike, database load | Hit rate, database QPS | Coalescing, shedding |
| External API | Slow | Thread or connection exhaustion | p99, pool saturation | Timeout, breaker, degraded feature |
| Queue consumer | Stalled | Backlog growth | Queue depth, age | Scale out, dead-letter, shed |

A component with no row in this table has not been designed.

---

# Anti-Patterns

- Choosing a distributed architecture before measuring the single-node ceiling
- Adding a cache to hide a missing index
- Microservices introduced to solve a team problem, then justified as a scale decision
- Autoscaling in front of a fixed-size database connection pool
- Retry logic added at every layer, multiplying load during an incident
- Capacity plans stated as averages
- Reliability targets with no error budget or consequence

---

# Verification

Before approving a design or a change:

- The load estimate exists and its assumptions are labeled
- The binding constraint is named and evidenced
- Every new component has a failure row, a timeout, and a bound
- Degradation and shedding behavior are written down, not implied
- The change is validated by a load test, a profile, or a query plan, not by argument

Never claim a load test or profile ran when it did not.

---

# Required Final Output

```markdown
## System Design Review
Status: APPROVED | APPROVED WITH RISKS | BLOCKED

### Load assumptions
- ...

### Binding constraint
- ... (evidence: ...)

### Design changes
- ...

### Failure table
| Component | Failure | Blast radius | Detection | Response |

### Residual risks
- ...

### Next action
- ...
```

## Shared output profile

Compose the `review` profile from [output-templates](../output-templates/references/components.md).
Lead with the decision and the binding constraint, then load assumptions, changes, failure table, and residual risk.
Preserve stricter domain rules above, omit empty components, and never fill a component with invented evidence.
