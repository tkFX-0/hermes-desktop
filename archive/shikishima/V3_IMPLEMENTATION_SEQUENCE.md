# Shikishima v3.x Implementation Sequence — v2.1.0

## Purpose

Defines the linear task sequence for v3.x with explicit HOLD gates.
Each step either creates docs or requires human GO before proceeding.
No execution step runs automatically.

- documentVersion: v2.1.0
- documentDate: 2026-05-12
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

---

## Sequence

### v3.0 — V3 Goal & Execution Validation Task Pack

| Field | Value |
|---|---|
| Type | docs-only |
| HOLD gate | none |
| Status | DONE (this session) |
| Output | 7 new docs; roadmapVersion v2.1.0 |
| Commit | `docs: add shikishima v3 goal and operation path` |

---

### v3.1 — tests/ichikishima + tests/hermes Final Review Package

| Field | Value |
|---|---|
| Type | docs-only (read-only review) |
| HOLD gate | none for review; G-01/G-02 for commit |
| Status | HOLD — not yet started |
| Input | TESTS_ICHIKISHIMA_REVIEW_PACKAGE.md, TESTS_HERMES_REVIEW_PACKAGE.md |
| Output | Updated V3_TEST_COMMIT_DECISION_MATRIX.md |
| Forbidden | stage/commit any test file; execute tests |

---

### [HOLD GATE: G-01 + G-02 — tests commit GO]

Human must issue explicit GO for tests/ichikishima/ and tests/hermes/ separately.
See V3_HUMAN_GO_CHECKLIST.md #1 and #2.

---

### v3.2 — Test Suite Commit Execution

| Field | Value |
|---|---|
| Type | git commit (tests/ichikishima/ and/or tests/hermes/) |
| HOLD gate | G-01 and/or G-02 must be satisfied |
| Status | HOLD |
| Forbidden | execute tests; npm install; git push |

---

### v3.3 — Static Validation Command Plan

| Field | Value |
|---|---|
| Type | docs-only |
| HOLD gate | none for plan |
| Status | HOLD — not yet started |
| Output | V3_STATIC_VALIDATION_PLAN.md |
| Forbidden | execute any command |

---

### [HOLD GATE: G-03/G-04/G-05 — typecheck/eslint GO]

Human must issue explicit GO for each command separately.
See V3_HUMAN_GO_CHECKLIST.md #3, #4, #5.

---

### v3.4 — First Validation Execution (typecheck + eslint)

| Field | Value |
|---|---|
| Type | command execution (typecheck:node, typecheck:web, eslint) |
| HOLD gate | G-03, G-04, G-05 — each separate |
| Status | HOLD |
| Output | Redacted error counts and categories |
| Forbidden | run vitest without separate GO; output raw paths |

---

### v3.5 — Redacted Validation Result Review

| Field | Value |
|---|---|
| Type | docs-only (review v3.4 output) |
| HOLD gate | none for review; G-06 for vitest |
| Status | HOLD — after v3.4 |
| Output | Redacted result summary + remediation plan |
| Forbidden | expose raw file paths or local values |

---

### [HOLD GATE: G-06 — vitest GO]

Human must issue explicit GO for vitest after reviewing v3.4/v3.5 results.
See V3_HUMAN_GO_CHECKLIST.md #6.

---

### v3.6 — Local-Only Value Boundary Review

| Field | Value |
|---|---|
| Type | docs-only + policy document |
| HOLD gate | G-08 for any local-value validation |
| Status | HOLD — not yet started |
| Output | V3_LOCAL_VALUE_BOUNDARY_POLICY.md |
| Forbidden | expose actual local paths; raw values |

---

### [HOLD GATE: G-08 — local-only value check GO]

See V3_HUMAN_GO_CHECKLIST.md #8.

---

### v3.7 — Dummy/Wrapper Execution Plan (docs-only)

| Field | Value |
|---|---|
| Type | docs-only |
| HOLD gate | none for plan; G-09/G-10 for execution |
| Status | HOLD — not yet started |
| Output | V3_DUMMY_WRAPPER_EXECUTION_PLAN.md |
| Forbidden | execute dummy/wrapper process |

---

### [HOLD GATE: G-09 + G-10 — dummy/wrapper execution GO]

See V3_HUMAN_GO_CHECKLIST.md #9 and #10.

---

### v3.8 — WSL/Hermes Execution Plan (docs-only)

| Field | Value |
|---|---|
| Type | docs-only |
| HOLD gate | none for plan; G-11/G-12 for execution |
| Status | HOLD — not yet started |
| Output | V3_WSL_HERMES_EXECUTION_PLAN.md |
| Forbidden | execute WSL; run Hermes |

---

### [HOLD GATE: G-11 + G-12 — WSL/Hermes execution GO]

See V3_HUMAN_GO_CHECKLIST.md #11 and #12.

---

### v3.9 — v4 Readiness Package

| Field | Value |
|---|---|
| Type | docs-only |
| HOLD gate | none for package creation |
| Status | HOLD — after v3.8 |
| Output | V4_READINESS_PACKAGE.md |
| Forbidden | src change; build/test/typecheck; git push |

---

## Deferred to v4+

| Item | Deferred To | Reason |
|---|---|---|
| vitest full run | v4 | After typecheck results reviewed |
| build execution | v4 | After typecheck passes |
| RunPod execution | v6 | External service — separate GO |
| StackChan connection | v7 | Hardware — hardware safety review |
| voice I/O | v8 | Audio — audio safety review |
| productionReady = true | v10 | Final separate approval only |

---

## What Is Never Automatic

```text
HOLD gates do not automatically satisfy each other.
A completed v3.X task does not unlock v3.(X+1) HOLD gates.
Each gate requires independent human GO.
No agent or automated process can issue GO.
```

この範囲では問題を検出していません。
