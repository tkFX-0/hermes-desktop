# Shikishima v3.x HOLD Gate Matrix — v2.1.0

## Purpose

Documents all HOLD gates for v3.x execution validation.
Each gate requires a separate, explicit human GO. No gate carries over from another.
This document does not create GO approval.

- documentVersion: v2.1.0
- documentDate: 2026-05-12
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

---

## Gate Index

| Gate ID | Gate Name | Triggered By | Current State |
|---|---|---|---|
| G-01 | tests/ichikishima commit | v3.2 | HOLD — human GO required |
| G-02 | tests/hermes commit | v3.2 | HOLD — human GO required |
| G-03 | typecheck:node execution | v3.4 | HOLD — human GO required |
| G-04 | typecheck:web execution | v3.4 | HOLD — human GO required |
| G-05 | eslint execution | v3.4 | HOLD — human GO required |
| G-06 | vitest execution | v3.4 | HOLD — human GO required |
| G-07 | build execution | v3.4 | HOLD — human GO required |
| G-08 | local-only value check | v3.6 | HOLD — human GO required |
| G-09 | dummy process execution | v3.7 | HOLD — explicit scoped GO required |
| G-10 | wrapper execution | v3.7 | HOLD — explicit scoped GO required |
| G-11 | WSL execution | v3.8 | HOLD — explicit scoped GO required |
| G-12 | Hermes execution | v3.8 | HOLD — explicit scoped GO required |
| G-13 | RunPod execution | v6+ | HOLD — explicit scoped GO required |
| G-14 | StackChan connection | v7+ | HOLD — explicit scoped GO + hardware safety review |
| G-15 | voice I/O | v8+ | HOLD — explicit scoped GO + audio safety review |
| G-16 | camera / microphone | v8+ | HOLD — explicit scoped GO |
| G-17 | git push | any | HOLD — explicit human approval per push |
| G-18 | productionReady = true | v10+ | HOLD — final separate human approval only |
| G-19 | execution = enabled | v10+ | HOLD — final separate human approval only |

---

## Gate Details

### G-01: tests/ichikishima commit

- **GO condition**: Human reviews V3_TEST_COMMIT_DECISION_MATRIX.md; confirms CI guard on process-local test; confirms no raw values in fixtures; issues explicit commit GO for this group
- **STOP condition**: Any raw value, local path, or secret found in test fixtures; CI guard for dummy-hermes-stub-design.process-local.test.ts not verified
- **Human confirmation items**:
  - [ ] TESTS_ICHIKISHIMA_REVIEW_PACKAGE.md reviewed
  - [ ] dummy-hermes-path.ts: path constant only (no execution)
  - [ ] dummy-hermes-stub-design.process-local.test.ts: CI guard confirmed (`CI=true` skips)
  - [ ] hermes-real-pilot-minimal.test.ts: risk accepted or split out
  - [ ] No raw local paths in any fixture file
  - [ ] Explicit GO issued: "Approve tests/ichikishima commit"

### G-02: tests/hermes commit

- **GO condition**: Human reviews V3_TEST_COMMIT_DECISION_MATRIX.md; confirms all 12 zone tests reviewed; issues explicit commit GO for this group
- **STOP condition**: Any raw value or secret found; smoke/pilot tests not reviewed
- **Human confirmation items**:
  - [ ] TESTS_HERMES_REVIEW_PACKAGE.md reviewed
  - [ ] smoke test CI guard verified
  - [ ] pilot test risk accepted or split out
  - [ ] No raw local paths in any fixture
  - [ ] Explicit GO issued: "Approve tests/hermes commit"

### G-03: typecheck:node execution

- **GO condition**: tests committed (G-01 + G-02); human issues explicit GO for typecheck:node
- **STOP condition**: tests not yet committed; execution gate not lifted
- **Human confirmation items**:
  - [ ] tests committed
  - [ ] Environment: local dev only
  - [ ] Output redaction policy reviewed
  - [ ] Explicit GO: "Approve typecheck:node"

### G-04: typecheck:web execution

- **GO condition**: Same as G-03; explicit GO for typecheck:web
- **Human confirmation items**:
  - [ ] tests committed
  - [ ] Explicit GO: "Approve typecheck:web"

### G-05: eslint execution

- **GO condition**: Human issues explicit GO for eslint
- **Human confirmation items**:
  - [ ] Explicit GO: "Approve eslint"

### G-06: vitest execution

- **GO condition**: G-01 + G-02 + G-03 + G-04 done; explicit GO for vitest; environment confirmed
- **STOP condition**: Any preceding gate not satisfied; local-only value exposure not addressed
- **Human confirmation items**:
  - [ ] All preceding validation done
  - [ ] CI mode or local-only mode decided
  - [ ] Explicit GO: "Approve vitest"

### G-07: build execution

- **GO condition**: typecheck passes; explicit GO for build
- **Human confirmation items**:
  - [ ] typecheck:node PASS
  - [ ] typecheck:web PASS
  - [ ] Explicit GO: "Approve build"

### G-08: local-only value check

- **GO condition**: V3_LOCAL_VALUE_BOUNDARY_POLICY.md reviewed; human confirms redaction policy; explicit GO
- **Human confirmation items**:
  - [ ] Policy document reviewed
  - [ ] Dummy paths: confirmed non-sensitive
  - [ ] Local server ports (e.g., localhost:8765): confirmed display-only
  - [ ] Explicit GO: "Approve local-only value check"

### G-09: dummy process execution

- **GO condition**: V3_DUMMY_WRAPPER_EXECUTION_PLAN.md reviewed; environment confirmed local-only; explicit scoped GO
- **STOP condition**: Any real Hermes endpoint involved; external network reachable
- **Human confirmation items**:
  - [ ] Execution plan reviewed
  - [ ] Environment: local dev only, no external network
  - [ ] Dummy path: confirmed not a real Hermes binary
  - [ ] Explicit scoped GO: "Approve dummy process execution"

### G-10: wrapper execution

- Same as G-09, plus explicit scoped GO for wrapper specifically

### G-11: WSL execution

- **GO condition**: V3_WSL_HERMES_EXECUTION_PLAN.md reviewed; WSL environment verified; explicit scoped GO
- **STOP condition**: Hermes not installed; WSL not confirmed available; RunPod/external network involved
- **Human confirmation items**:
  - [ ] WSL environment verified locally
  - [ ] Execution plan reviewed
  - [ ] No external network involved
  - [ ] Explicit scoped GO: "Approve WSL execution"

### G-12: Hermes execution

- **GO condition**: WSL execution approved (G-11); Hermes install verified; explicit scoped GO
- **STOP condition**: Hermes binary not confirmed; external network involved; RunPod involved
- **Human confirmation items**:
  - [ ] Hermes environment verified
  - [ ] Execution scope defined (local-only)
  - [ ] Explicit scoped GO: "Approve Hermes execution"

### G-13: RunPod execution

- **GO condition**: v6+ scope; explicit scoped GO; external service authorization confirmed
- **Human confirmation items**:
  - [ ] Explicit scoped GO: "Approve RunPod execution"

### G-14: StackChan connection

- **GO condition**: v7+ scope; hardware safety review; explicit scoped GO
- **Human confirmation items**:
  - [ ] Hardware connected and available
  - [ ] Safety review complete (no unintended motion)
  - [ ] Explicit scoped GO: "Approve StackChan connection"

### G-15: voice I/O

- **GO condition**: v8+ scope; audio safety review; explicit scoped GO
- **Human confirmation items**:
  - [ ] Explicit scoped GO: "Approve voice I/O"

### G-16: camera / microphone

- Similar to G-15

### G-17: git push

- **GO condition**: Explicit human approval per push target; per-push, not blanket approval
- **Human confirmation items**:
  - [ ] Push target specified
  - [ ] Branch confirmed
  - [ ] Explicit approval: "Approve push to [branch/remote]"

### G-18: productionReady = true

- **GO condition**: All v10 preconditions met; final separate human approval only
- This gate cannot be satisfied by any automated process or agent decision.

### G-19: execution = enabled

- Same as G-18 — final separate human approval only.

---

## Gate Dependency Chain

```
G-01 ──┐
G-02 ──┼──→ G-03 (typecheck:node)
       │     G-04 (typecheck:web)
       │     G-05 (eslint)
       │     G-03+G-04 → G-06 (vitest)
       │     G-03+G-04 → G-07 (build)
       └──→ G-08 (local-only check)
G-08 ──→ G-09 (dummy) → G-10 (wrapper)
G-10 ──→ G-11 (WSL) → G-12 (Hermes)
G-12 ──→ G-13 (RunPod) → G-14 (StackChan) → G-15 (voice) → ... → G-18/G-19
```

Gates do NOT automatically unlock each other. Each requires independent human GO.

---

## Global HOLD Override

Any of the following conditions globally blocks all gates regardless of individual GO:

```text
execution: still disabled
productionReady: still false
rawValuesReported: must remain false
robotMotion: HOLD
git push: not blanket-approved
WSL/Hermes/RunPod/StackChan/voice: HOLD unless gate satisfied
```

この範囲では問題を検出していません。
