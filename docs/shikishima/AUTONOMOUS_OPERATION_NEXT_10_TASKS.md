# Autonomous Operation — Next 10 Tasks

**date:** 2026-05-21
**status:** RECOMMENDED ORDER — not execution approval

---

## Task 1 — Push productionReady precheck + inventory docs

```text
type:    git push
scope:   current ahead commits (0ca95df + inventory docs commit)
risk:    zero (docs-only)
worker:  ClaudeCode + tk (push GO)
status:  pending push GO
```

## Task 2 — Post-push integrity check

```text
type:    read-only git + typecheck
scope:   HEAD == origin/main, typecheck PASS, flags correct
risk:    zero
worker:  ClaudeCode
status:  after Task 1
```

## Task 3 — XS-AUTO-03 one-shot read-only GO form

```text
type:    docs — prepare GO form
scope:   xs_auto_read_go form
risk:    zero (docs-only)
worker:  ClaudeCode
status:  HOLD — after Task 2
gate_form: docs/shikishima/XS_AUTO_03_GO_FORM_YYYY-MM-DD.md
```

## Task 4 — XS-AUTO-03 one-shot execution + evidence

```text
type:    Level 5 execution — external read-only search
scope:   WI-001 (AI / Agent Platform) 1 run / read-only
risk:    Low-Medium
worker:  ClaudeCode + tk (GO)
status:  HOLD — needs xs_auto_read_go from tk
gate:    BLOCKER-004 resolution
```

## Task 5 — CC-03 one-shot Command Chat GO form

```text
type:    docs — prepare GO form
scope:   cc03_real_send_go form (exact target + message TBD)
risk:    zero (docs-only)
worker:  ClaudeCode
status:  HOLD — after Task 4
```

## Task 6 — CC-03 one-shot execution + evidence

```text
type:    Level 5 execution — AI API send
scope:   Hermes endpoint / 1 message / exact content
risk:    Medium
worker:  ClaudeCode + tk (GO)
status:  HOLD — needs cc03_real_send_go from tk
gate:    BLOCKER-002 resolution
```

## Task 7 — HB-01 controlled Hermes/WSL GO form

```text
type:    docs — prepare GO form
scope:   hb01_hermes_wsl_go (purpose / commands / time_window TBD)
risk:    zero (docs-only)
worker:  ClaudeCode
status:  HOLD — after Task 6
```

## Task 8 — HB-01 controlled Hermes/WSL execution + evidence

```text
type:    Level 5 execution — WSL2 process + bridge
scope:   limited commands only / time_window / bridge shutdown confirmed
risk:    Medium-High
worker:  ClaudeCode + tk (GO)
status:  HOLD — needs hb01_hermes_wsl_go from tk
gate:    BLOCKER-001 resolution
```

## Task 9 — XACC-01 decision

```text
type:    human decision (no code execution)
scope:   GO or explicit DEFER for X account OAuth
risk:    High (if GO) / zero (if DEFER)
worker:  tk (decision only)
status:  HOLD — tk 判断待ち
note:    DEFER でも文書化が必要
gate:    BLOCKER-003 resolution
```

## Task 10 — BLOCKER-005 human review session

```text
type:    human review (no code execution)
scope:   FINAL_HOLD_AND_FUTURE_GO_REGISTRY active items review
risk:    zero (review only)
worker:  tk + ClaudeCode
status:  HOLD — after Tasks 4/6/8
note:    可能なら LMO session と同時実施
gate:    BLOCKER-005 resolution
```

---

## Notes

```text
- StackChan は deferred (Tasks に含まず)
- 各 Task 完了後は必ず push readiness + push GO の順
- Level 5 実行後は gate HOLD 復帰を最優先
- productionReady GO は Task 10 完了後に別途検討
```
