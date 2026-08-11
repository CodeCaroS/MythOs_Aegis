---
name: rag-retrieval-quality
description: >
  Diagnoses and improves retrieval-augmented generation quality by measuring it:
  chunking, embeddings, hybrid search, top-k, reranking, and grounding checked
  against a fixed evaluation set. Use when RAG answers are wrong, incomplete, or
  hallucinated, when tuning retrieval settings, or when building a new RAG pipeline.
version: 1.0.0
author: Caro
license: Apache-2.0
tags:
  - rag
  - retrieval
  - embeddings
  - chunking
  - reranking
  - hybrid-search
  - evaluation
  - grounding
  - vector-database
triggers:
  - rag answers are wrong
  - improve retrieval quality
  - tune chunk size
  - which embedding model
  - top-k and reranking
  - hallucinated answers from documents
  - build a rag pipeline
  - evaluate retrieval
capabilities:
  - retrieval-diagnosis
  - eval-set-construction
  - chunking-strategy
  - hybrid-search-design
  - rerank-strategy
  - grounding-verification
outputs:
  - markdown
  - eval-set
  - retrieval-report
  - configuration-diff
requires:
  - repository-access
constraints:
  no_tuning_without_eval_set: true
  report_retrieval_and_generation_separately: true
  require_measured_before_and_after: true
---

# RAG Retrieval Quality

## Purpose

Stop tuning RAG by feel. Every change to chunking, embeddings, `k`, or reranking must
be justified by a measured difference on a fixed evaluation set.

## Core Principle

```text
If the correct passage is not in the retrieved set, no prompt fixes the answer.
Measure retrieval first. Measure generation second. Never blend the two numbers.
```

A wrong answer has exactly one of three causes:

1. **Retrieval miss** — the evidence was never retrieved.
2. **Ranking miss** — the evidence was retrieved but buried or crowded out.
3. **Generation miss** — the evidence was present and the model still answered wrong.

Diagnose which one before changing anything.

---

## Activation Triggers

Apply this skill when:

- Answers cite the wrong document, or cite nothing
- Answers are right for some questions and confidently wrong for others
- Someone proposes changing chunk size, `k`, or the embedding model
- A new corpus, language, or document type is added
- A RAG pipeline is being designed from scratch

---

# Workflow

## Phase 1: Build the Evaluation Set First

No tuning happens before this exists.

Minimum viable eval set:

- 30 to 50 real questions, taken from actual usage where possible
- For each: the passage or document that contains the answer (the gold reference)
- A mix of: exact-fact, multi-passage, negative (answer not in corpus), and paraphrased questions
- Frozen. Changes to the eval set invalidate comparisons across runs.

Negative questions are mandatory. A pipeline that never says "not in the corpus" is
not accurate, it is confident.

## Phase 2: Measure Retrieval Alone

For the current configuration, report:

| Metric | Meaning | Use |
|---|---|---|
| Recall@k | Gold passage appears in top k | The ceiling on answer quality |
| MRR / nDCG | How high the gold passage ranks | Whether reranking will help |
| Miss list | Questions with no gold hit at any k | Where chunking or coverage failed |

Rules:

- Report Recall@k for at least two values of `k`.
- Inspect the miss list by hand. Categorize each miss before proposing a fix.
- If Recall@k is high but answers are wrong, the problem is generation, not retrieval.

## Phase 3: Chunking

Chunking is the highest-leverage and most commonly mis-tuned setting.

Rules:

- Chunk on document structure (headings, sections, list items) before chunking on length.
- Keep a chunk semantically self-contained: a reader must understand it without the neighbors.
- Overlap only enough to preserve sentences and references that cross boundaries.
- Attach metadata to every chunk: source, section path, date, permissions, language.
- Prepend the section path or document title to the chunk text so short chunks stay
  interpretable to the embedding model.
- Never split tables, code blocks, or numbered procedures across chunks.

Diagnose by miss category:

| Miss looks like | Likely cause | Fix |
|---|---|---|
| Gold split across two chunks | Chunks too small | Larger chunks or structure-aware split |
| Gold buried in a large chunk | Chunks too large | Split on headings |
| Gold retrieved for wrong query | Chunk lacks context | Add title and section prefix |
| Gold never indexed | Ingestion failure | Verify the pipeline, not the settings |

## Phase 4: Embeddings and Search

Rules:

- Verify the embedding model matches the corpus language and domain before tuning anything else.
- Use the same normalization and distance metric at index and query time. Mismatch here
  looks like a quality problem and is a bug.
- Use hybrid search (dense plus lexical) whenever the corpus contains identifiers, error
  codes, product names, or exact strings. Dense-only retrieval reliably misses exact tokens.
- Filter by metadata (tenant, permission, date, language) inside the query, not after retrieval.
  Post-filtering silently reduces the effective `k`.
- Re-embed the whole corpus when the model changes. Mixed-model indexes are invalid.

## Phase 5: Top-k and Reranking

Rules:

- Choose `k` from the Recall@k curve, not from a default.
- Retrieve wide, rerank narrow: a larger candidate set plus a cross-encoder reranker
  usually beats a larger final context.
- Deduplicate near-identical chunks before they consume context slots.
- Cap the total context passed to generation. More passages past the point of diminishing
  recall reduces answer quality and raises cost.
- Measure reranking as a separate step: report nDCG before and after.

## Phase 6: Grounding and Answer Verification

Rules:

- Require the generator to cite the chunk it used.
- Verify each cited claim appears in the cited chunk. An unverifiable citation is a hallucination.
- Instruct and test the "not in the corpus" path explicitly.
- Report answer quality only on questions where retrieval succeeded, and report the
  retrieval failure rate next to it.

---

# Anti-Patterns

- Tuning chunk size against a handful of questions checked by eye
- Changing several settings at once and attributing the result to one of them
- Dense-only retrieval over corpora full of identifiers
- Raising `k` to hide a chunking problem
- Reporting one blended accuracy number that hides whether retrieval or generation failed
- Eval sets written from the same documents by the same model that will answer them

---

# Verification

Before claiming an improvement:

- The eval set is unchanged between the before and after runs
- Exactly one variable changed, or a factorial comparison is reported
- Both retrieval metrics and answer metrics are reported
- Negative questions still return "not found"
- The change is checked for cost and latency, not only quality

Never claim an evaluation ran when it did not.

---

# Required Final Output

```markdown
## Retrieval Quality Result
Status: DIAGNOSED | IMPROVED | NO CHANGE

### Failure attribution
- Retrieval / ranking / generation: ...

### Measurements
| Config | Recall@k | nDCG | Answer accuracy | Cost |
|---|---|---|---|---|

### Change applied
- ...

### Remaining misses
- ...

### Next action
- ...
```

## Shared output profile

Compose the `review` profile from [output-templates](../output-templates/references/components.md).
Lead with the failure attribution, then measurements, the applied change, remaining misses, and the next action.
Preserve stricter domain rules above, omit empty components, and never fill a component with invented evidence.
