# Shikishima v3.x Human GO Checklist — v2.1.0

## Purpose

Provides discrete GO checklists for each human approval decision in v3.x.
Each checklist is independent. Approving one does NOT approve any other.
No agent can mark these as approved. Only human can issue GO.

- documentVersion: v2.1.0
- documentDate: 2026-05-12
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

---

## How to Use

1. Review the relevant checklist items.
2. Verify each item is confirmed.
3. Issue explicit GO statement with gate ID.
4. Agent executes only the scoped action — nothing more.

Example GO statement:
> "GO G-01: Approve tests/ichikishima commit. All checklist items confirmed."

---

## Checklist #1 — G-01: tests/ichikishima Commit

**Required before**: v3.2 (tests/ichikishima/ commit)

- [ ] TESTS_ICHIKISHIMA_REVIEW_PACKAGE.md reviewed
- [ ] V3_TEST_COMMIT_DECISION_MATRIX.md reviewed
- [ ] dummy-hermes-path.ts: confirmed path constant only (no execution invocation)
- [ ] dummy-hermes-stub-design.process-local.test.ts: CI guard verified (`CI=true` → skip)
- [ ] hermes-real-pilot-minimal.test.ts: risk reviewed and accepted or split decision made
- [ ] hermes-real-process-adapter.test.ts: risk reviewed and accepted or split decision made
- [ ] No absolute local paths in any fixture file confirmed
- [ ] No API keys / tokens / secrets in any file confirmed
- [ ] Commit scope confirmed: tests/ichikishima/ only (no src, no docs/ichikishima, no sandbox)
- [ ] Git push NOT included in this GO

**GO statement**:
> "GO G-01: Approve tests/ichikishima commit."

---

## Checklist #2 — G-02: tests/hermes Commit

**Required before**: v3.2 (tests/hermes/ commit)

- [ ] TESTS_HERMES_REVIEW_PACKAGE.md reviewed
- [ ] V3_TEST_COMMIT_DECISION_MATRIX.md reviewed
- [ ] Smoke test CI guard verified
- [ ] Pilot test risk reviewed and accepted or split decision made
- [ ] No absolute local paths in any fixture confirmed
- [ ] No API keys / tokens / secrets in any file confirmed
- [ ] Commit scope confirmed: tests/hermes/ only
- [ ] Git push NOT included in this GO

**GO statement**:
> "GO G-02: Approve tests/hermes commit."

---

## Checklist #3 — G-03: typecheck:node Execution

**Required before**: v3.4 (typecheck:node)

- [ ] G-01 completed (tests committed) or explicit override confirmed
- [ ] G-02 completed (tests committed) or explicit override confirmed
- [ ] Environment: local dev only
- [ ] Output redaction policy reviewed (V3_EXECUTION_VALIDATION_ROADMAP.md)
- [ ] Understood: raw file paths will be redacted in any report
- [ ] npm install NOT included in this GO

**GO statement**:
> "GO G-03: Approve typecheck:node execution."

---

## Checklist #4 — G-04: typecheck:web Execution

**Required before**: v3.4 (typecheck:web)

- [ ] G-03 reviewed / same preconditions
- [ ] Environment: local dev only
- [ ] Output redaction policy reviewed

**GO statement**:
> "GO G-04: Approve typecheck:web execution."

---

## Checklist #5 — G-05: eslint Execution

**Required before**: v3.4 (eslint)

- [ ] Environment: local dev only
- [ ] Output redaction policy reviewed
- [ ] Understood: eslint may surface raw file paths — must be redacted

**GO statement**:
> "GO G-05: Approve eslint execution."

---

## Checklist #6 — G-06: vitest Execution

**Required before**: vitest full run

- [ ] G-01 + G-02 completed (tests committed)
- [ ] G-03 + G-04 completed (typecheck passes)
- [ ] G-08 reviewed (local-only value policy)
- [ ] process-local test CI guard re-confirmed
- [ ] Run mode confirmed: CI=true or local-only mode?
- [ ] Output redaction policy reviewed
- [ ] Understood: vitest may invoke test setup code — confirm no real Hermes calls

**GO statement**:
> "GO G-06: Approve vitest execution in [mode]."

---

## Checklist #7 — G-07: Build Execution

**Required before**: v4 (build)

- [ ] G-03 + G-04 completed (typecheck passes)
- [ ] No typecheck blockers remaining
- [ ] Environment: local dev only
- [ ] Output redaction policy reviewed

**GO statement**:
> "GO G-07: Approve build execution."

---

## Checklist #8 — G-08: Local-Only Value Check

**Required before**: v3.6 (local-only boundary review)

- [ ] V3_STATIC_VALIDATION_PLAN.md reviewed (created in v3.3)
- [ ] Localhost:8765 reference in Research.tsx: confirmed display-only
- [ ] Dummy hermes path: confirmed non-sensitive
- [ ] WSL paths: not in committed code (redacted)
- [ ] Policy accepted: what counts as "local-only" confirmed

**GO statement**:
> "GO G-08: Approve local-only value check scope."

---

## Checklist #9 — G-09: Dummy Process Execution

**Required before**: v6 (dummy process)

- [ ] V3_DUMMY_WRAPPER_EXECUTION_PLAN.md reviewed (created in v3.7)
- [ ] Dummy path: confirmed not a real Hermes binary
- [ ] Environment: local dev only — no external network
- [ ] No RunPod involved
- [ ] Process isolation confirmed (no side effects on real Hermes state)

**GO statement**:
> "GO G-09: Approve dummy process execution in local dev environment."

---

## Checklist #10 — G-10: Wrapper Execution

**Required before**: v6 (wrapper)

- [ ] G-09 completed
- [ ] Wrapper plan reviewed
- [ ] No external network access during wrapper run
- [ ] Output redaction policy confirmed

**GO statement**:
> "GO G-10: Approve wrapper execution in local dev environment."

---

## Checklist #11 — G-11: WSL Execution

**Required before**: v6 (WSL)

- [ ] V3_WSL_HERMES_EXECUTION_PLAN.md reviewed (created in v3.8)
- [ ] WSL environment confirmed available on target machine
- [ ] No external network access beyond WSL-local
- [ ] No RunPod endpoint involved
- [ ] Command scope defined (exactly which command runs)

**GO statement**:
> "GO G-11: Approve WSL execution. Command: [specified command]."

---

## Checklist #12 — G-12: Hermes Execution

**Required before**: v6 (Hermes)

- [ ] G-11 completed (WSL available)
- [ ] Hermes binary confirmed installed in WSL
- [ ] Execution scope: local-only, no external network
- [ ] No RunPod endpoint involved
- [ ] Output: redacted only

**GO statement**:
> "GO G-12: Approve Hermes execution via WSL. Scope: [specified scope]."

---

## Checklist #13 — G-13: RunPod Execution

**Required before**: v6+ (RunPod)

- [ ] Local Hermes execution (G-12) validated
- [ ] RunPod service confirmed available and authorized
- [ ] External service authorization confirmed
- [ ] No secrets in command arguments

**GO statement**:
> "GO G-13: Approve RunPod execution. Endpoint: [specified]."

---

## Checklist #14 — G-14: StackChan Connection

**Required before**: v7 (StackChan display-only)

- [ ] Hardware physically available and connected
- [ ] Hardware safety review complete (no unintended motion risk)
- [ ] Mode confirmed: DISPLAY-ONLY (no motion commands)
- [ ] robotMotion HOLD explicitly maintained

**GO statement**:
> "GO G-14: Approve StackChan connection for display-only. robotMotion remains HOLD."

---

## Checklist #15 — G-15: Voice I/O

**Required before**: v8 (voice)

- [ ] Audio system confirmed available
- [ ] Audio safety review complete (no unintended audio output to speakers)
- [ ] Scope: concept validation only
- [ ] Microphone access: separate GO required

**GO statement**:
> "GO G-15: Approve voice I/O concept validation. Scope: [specified]."

---

## Checklist #16 — G-16: Camera / Microphone

**Required before**: v8+ (camera/microphone)

- [ ] Explicit need confirmed
- [ ] Privacy review complete
- [ ] Scope: local-only, no cloud upload

**GO statement**:
> "GO G-16: Approve camera/microphone access. Scope: [specified]."

---

## Checklist #17 — G-17: Git Push

**Required before**: any push to remote

- [ ] Push target branch confirmed
- [ ] Push remote confirmed
- [ ] No force push
- [ ] Scope confirmed (only intended files/commits)

**GO statement** (must be issued per-push):
> "GO G-17: Approve push to [branch] at [remote]."

---

## Checklist #18 — G-18: productionReady = true

**Required before**: v10 (final approval)

- [ ] ALL v3–v9 stages complete and reviewed
- [ ] ALL safety invariants confirmed across all subsystems
- [ ] ALL HOLD gates (G-01 through G-16) satisfied
- [ ] Final audit complete
- [ ] Human issues explicit final approval statement

**GO statement** (final, non-delegable):
> "FINAL GO G-18: Approve productionReady = true. All preconditions confirmed."

**Note**: This cannot be issued by any agent. Human only.

---

## Checklist #19 — G-19: execution = enabled

**Same conditions as G-18.** Cannot be issued by any agent. Human only.

**GO statement**:
> "FINAL GO G-19: Approve execution = enabled. All preconditions confirmed."

---

## GO Statement Archive

Record all issued GO statements here when issued:

| Date | Gate | GO Statement | Issued By |
|---|---|---|---|
| — | — | (none issued) | — |

この範囲では問題を検出していません。
