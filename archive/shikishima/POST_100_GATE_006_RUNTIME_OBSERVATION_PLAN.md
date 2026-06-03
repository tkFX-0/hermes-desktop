# Post-100 Gate 006 — Runtime Observation Plan

## Document Status

```text
roadmapVersion: v3.60.0
date: 2026-05-17
gate: Post-100 Gate 006
name: Runtime Observation Plan
status: design_ready — not yet executed
```

---

## Purpose

Gate 006 は Limited Manual Operation 期間中のランタイム観察セッションを定義する。
Level 3-A iPhone Private Console 観察と同様に、個別の time_window GO が必要。

Goal: ランタイムを起動して観察し、安全に停止する。自動実行は一切行わない。

---

## Gate 006 Scope

```text
Allowed in this gate:
  runtime_start:         YES (with time_window GO)
  port_3030_open:        YES (with time_window GO; local only)
  iPhone console access: YES (same-LAN only; MOBILE_CONSOLE_PHASE_2C_ENABLED = true local-only)
  runtime observation:   YES (read-only; no commands sent)
  runtime_stop:          YES (when observation complete)
  snapshot display:      YES (redacted; rawValuesReported: false)

Not allowed in this gate:
  productionReady true:  NO
  execution enabled:     NO
  external API write:    NO
  autonomous loop:       NO
  push without GO:       NO
  ENABLED=true push:     NO (local-only commit only)
```

---

## Pre-Observation Checklist (run before each session)

```text
[ ] 1. baseline確認
       origin/main == expected?
       commits_ahead == 0 (or known docs-only)?
       No unexpected staged files?

[ ] 2. safety invariants at session start
       productionReady: false
       execution: disabled
       MOBILE_CONSOLE_PHASE_2C_ENABLED: false (in origin/main)
       rawValuesReported: false

[ ] 3. time_window確認
       human has provided explicit time_window for this session
       current time is within time_window?

[ ] 4. ENABLED flag protocol
       local commit to set MOBILE_CONSOLE_PHASE_2C_ENABLED = true as const
       this commit must NOT be pushed to origin/main
       backup branch created before session?

[ ] 5. observation scope確認
       observation is read-only
       no commands will be sent to runtime
       no external actions will be taken
```

---

## Observation Protocol

```text
Step 1: Create local backup branch
  git checkout -b gate006-session-NNN-runtime-local-backup

Step 2: Create local ENABLED=true commit
  MOBILE_CONSOLE_PHASE_2C_ENABLED = true as const
  commit message: local: enable phase2c for gate006 session NNN [DO NOT PUSH]

Step 3: Start runtime (with human GO)
  npm run dev (or equivalent)
  record: port_3030 observed open

Step 4: Connect iPhone console
  same-LAN only
  enter pairing token (human provides; not in transcript)
  observe snapshot: redacted values only

Step 5: Record observations (redacted)
  record what was observed (no raw values)
  capture evidence for Gate 006 Evidence Template

Step 6: Stop runtime
  terminate runtime process
  verify port_3030_closed: true

Step 7: Revert ENABLED flag
  git checkout main (or restore false as const)
  confirm: MOBILE_CONSOLE_PHASE_2C_ENABLED = false as const in working tree

Step 8: Fill Gate 006 Evidence Template
  fill all fields
  include observation outcome: PASS / FAIL / CAVEAT

Step 9: Human review
  human reviews evidence
  human decides: PASS / FAIL / CAVEAT

Step 10: Push (separate GO required)
  evidence commit (docs-only) requires explicit push GO
```

---

## Session Naming Convention

```text
session_id: gate006-session-NNN
  NNN: 001, 002, 003...

Evidence file: POST_100_GATE_006_RUNTIME_OBSERVATION_EVIDENCE_YYYYMMDD_NNN.md
```

---

## Relationship to Gate 005

```text
Gate 006 contributes to Gate 005 BLOCKER-002:
  "Gate 006 Runtime Observation: at least 1 PASS required"

completing Gate 006 with PASS resolves BLOCKER-002
```

---

## Current Status

```text
Gate 006: design_ready
First session: not yet scheduled
time_window: pending (human must provide)
productionReady: false — no change from this design doc
```

---

この範囲では問題を検出していません。
