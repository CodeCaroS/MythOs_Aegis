---
name: sql-query-correctness
description: >
  Reviews SQL and ORM queries for silent wrongness: NULL semantics, join
  multiplication, filters that cancel outer joins, aggregation without grouping
  guarantees, window frames, timezone and date boundaries, and non-deterministic
  pagination. Use when a query returns zero rows, too many rows, or numbers nobody
  can reproduce.
version: 1.0.0
author: Caro
license: Apache-2.0
tags:
  - sql
  - query-correctness
  - null-semantics
  - joins
  - aggregation
  - window-functions
  - orm
  - data-quality
  - timezones
triggers:
  - query returns no rows
  - query returns duplicate rows
  - sum does not match
  - review this sql
  - left join not working
  - null comparison problem
  - pagination skips rows
  - orm generates the wrong query
capabilities:
  - query-review
  - null-semantics-check
  - join-cardinality-check
  - aggregation-review
  - determinism-check
  - test-case-derivation
outputs:
  - markdown
  - query-review
  - corrected-query
  - test-cases
requires:
  - repository-access
constraints:
  verify_cardinality_before_aggregation: true
  require_test_rows_for_each_finding: true
  never_edit_data_to_fix_a_query: true
---

# SQL Query Correctness

## Purpose

Catch queries that run without error and return the wrong answer. These are more
dangerous than queries that fail, because nothing reports them.

## Core Principle

```text
A query is wrong until its row count, its NULL behavior, and its grouping are explained.
Correct output on today's data is not evidence. Construct the row that breaks it.
```

---

## Activation Triggers

Apply this skill when:

- A query returns zero rows, unexpected duplicates, or a total that does not reconcile
- A `LEFT JOIN` behaves like an inner join
- A report, dashboard, or export disagrees with another source
- An ORM query is being written for anything beyond a primary-key lookup
- Pagination skips or repeats rows
- Dates, "today", or per-user timezones are involved

---

# Review Checklist

## 1. NULL Semantics

Verify:

- Comparisons use `IS NULL` / `IS NOT NULL`, never `= NULL` or `<> NULL`.
- `NOT IN (subquery)` is not used where the subquery can produce `NULL`. A single
  `NULL` makes the whole predicate return no rows. Prefer `NOT EXISTS`.
- `<>` on a nullable column silently excludes `NULL` rows. Decide whether that is intended
  and make it explicit with `IS DISTINCT FROM` or an explicit `OR col IS NULL`.
- Aggregates ignore `NULL`: `COUNT(col)` and `AVG(col)` skip them, `COUNT(*)` does not.
- Arithmetic and string concatenation with `NULL` yield `NULL`, poisoning derived columns.
- `NULL` sorts differently per engine. State `NULLS FIRST` / `NULLS LAST` when order matters.
- Unique constraints usually permit multiple `NULL`s. Do not rely on them for absence.

## 2. Join Cardinality

Verify, for every join:

- The expected relationship: one-to-one, one-to-many, or many-to-many.
- Whether the join can multiply rows. If it can, any downstream `SUM`, `COUNT`, or
  `AVG` is inflated. Aggregate in a subquery or lateral join before joining.
- Whether a filter on the right table sits in `WHERE` instead of `ON`. In an outer join,
  a `WHERE` predicate on the right table discards the unmatched rows and turns it into
  an inner join. Put the predicate in `ON`, or allow `IS NULL`.
- Whether `DISTINCT` is masking a cardinality bug. `DISTINCT` added to fix duplicates is
  a symptom, not a fix, and it also hides legitimate duplicates.
- Whether any join key is nullable, differently typed, or differently collated. Implicit
  casts silently drop matches and disable indexes.

Diagnostic: run the query without aggregation and count rows per key. If a key appears
more times than expected, the aggregation is already wrong.

## 3. Aggregation and Grouping

Verify:

- Every non-aggregated selected column is in `GROUP BY`, or is functionally dependent on it.
- Filters on aggregates are in `HAVING`, filters on rows are in `WHERE`. Moving one to the
  other changes the result.
- `COUNT(*)`, `COUNT(col)`, and `COUNT(DISTINCT col)` are distinguished deliberately.
- Empty groups: an aggregate over no rows returns `NULL`, not `0`. Wrap with `COALESCE`
  where a zero is intended.
- Percentages and ratios guard against division by zero.
- Averages of averages are not computed. Aggregate from the base rows.

## 4. Window Functions

Verify:

- Every `ORDER BY` inside a window that uses a frame states the frame explicitly. The
  default frame with `ORDER BY` is `RANGE ... CURRENT ROW`, which groups ties together
  and surprises most authors.
- `ROW_NUMBER`, `RANK`, and `DENSE_RANK` are chosen deliberately for tie behavior.
- The `PARTITION BY` key matches the intended reset boundary.
- Window functions are not filtered in `WHERE` — they are evaluated after it. Wrap in a
  subquery or use `QUALIFY` where supported.

## 5. Dates, Times, and Timezones

Verify:

- The column type: instant versus local date-time. Compare like with like.
- The stored timezone and the presentation timezone are both stated. "Today" is not a
  server-side constant when users span timezones.
- Range predicates use half-open intervals (`>= start AND < next_start`), never `BETWEEN`
  over timestamps, which includes the endpoint and misses sub-second values.
- Functions are not applied to the indexed column in a predicate. `WHERE date(ts) = x`
  disables the index; use a range instead.
- Daylight-saving transitions and month-end arithmetic are handled by interval arithmetic,
  not by adding fixed second counts.

## 6. Determinism and Pagination

Verify:

- Every `ORDER BY` used for pagination is total: it ends in a unique tiebreaker.
- `LIMIT`/`OFFSET` pagination over changing data skips and repeats rows. Use keyset
  pagination for anything a user scrolls.
- No row order is assumed without `ORDER BY`, including from a CTE, a subquery, or a view.
- Set operations are chosen deliberately: `UNION` deduplicates and sorts, `UNION ALL` does not.

## 7. ORM-Specific Traps

Verify:

- The generated SQL was inspected, not assumed.
- Lazy relations do not create an N+1 pattern on any collection path.
- Eager joins on multiple collections do not produce a cartesian expansion, and are not
  combined with `LIMIT`, which then limits joined rows rather than entities.
- Soft-delete, tenant, and default scopes are applied — and are still applied inside raw
  fragments, subqueries, and aggregates.
- Raw fragments are parameterized. Never interpolate values or identifiers.

---

# Required Tests

For each finding, construct the rows that expose it:

- A row with `NULL` in every nullable column touched by the query
- A parent with zero children, one child, and two children
- Two rows tied on the sort key
- A boundary timestamp: exact start, exact end, and one microsecond before the end
- A second tenant or user, to prove scoping holds
- An empty result set, to prove aggregates and ratios behave

A fix without a failing-then-passing test is unverified.

---

# Anti-Patterns

- Adding `DISTINCT` to remove duplicates without explaining them
- `BETWEEN` on timestamps
- `NOT IN` against a nullable subquery
- Casting or wrapping an indexed column inside a predicate
- Trusting that the current data proves correctness
- Editing data to make a query return the expected result

---

# Required Final Output

```markdown
## Query Review
Status: CORRECT | WRONG | UNVERIFIED

### Intent
One sentence: what the query must return.

### Findings
- Issue: ...
  Evidence: row or plan that shows it
  Impact: wrong count / missing rows / inflated sum
  Fix: ...

### Corrected query
```sql
...
```

### Tests
- ...

### Remaining uncertainty
- ...
```

## Shared output profile

Compose the `review` profile from [output-templates](../output-templates/references/components.md).
Lead with the verdict and the intent, then findings with row-level evidence, the corrected query, and tests.
Preserve stricter domain rules above, omit empty components, and never fill a component with invented evidence.
