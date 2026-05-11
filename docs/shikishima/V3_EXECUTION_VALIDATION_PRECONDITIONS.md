# v3.x Execution Validation Preconditions — v2.0

## Purpose

Defines the minimum preconditions that must be satisfied before v3.x
execution validation can begin. This document is reference-only.
It is not a GO approval and does not enable any execution.

- documentVersion: v2.0
- documentDate: 2026-05-12
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

---

## Minimum Preconditions for v3.x

| # | Precondition | Current State | Required |
|---|---|---|---|
| 1 | tests/ichikishima/ committed | HOLD — human GO required | Required (test coverage needed) |
| 2 | tests/hermes/ committed | HOLD — human GO required | Required (test coverage needed) |
| 3 | Typecheck passes | HOLD — not run | Required (run before v3.x begins) |
| 4 | Separate scoped GO for v3.x work | Not issued | Required — must be explicit and scoped |

---

## Already Satisfied

| Precondition | State | Satisfied In |
|---|---|---|
| ControlCenter IPC read-only verified | Done | v1.2.9 |
| Safety invariants maintained | Done | All versions |
| Package metadata migration complete | Done | v1.2.3 – v1.3.0 |
| Group B feature committed | Done | v1.2.11 |

---

## NOT Required Before v3.x

These items are noted as HOLD but are not blockers for v3.x:

| Item | Reason Not Required |
|---|---|
| Phase D src rename | Cosmetic — ichikishima names work; does not affect functionality |
| Phase E repo rename | External action — does not affect local execution |
| docs/ichikishima archive | Legacy docs — does not affect functionality |
| appId change | Separate optional decision — no impact on v3.x execution |

---

## v3.x Execution Gate Process

When v3.x readiness is assessed:

1. Confirm all 4 minimum preconditions above are met.
2. Human issues explicit scoped GO specifying:
   - Which v3.x component (e.g., Hermes runtime, voice, StackChan motion)
   - Which environment (local dev, CI, staging)
   - Which safety constraints apply
3. No v3.x work begins until GO is issued.
4. Each v3.x sub-component requires its own scoped GO.

---

## Forbidden Without Scoped v3.x GO

```text
WSL command
Hermes command
wrapper/dummy execution
execFile real pilot
external network connection
robot/StackChan motion
voice input/output
microphone access
camera access
RunPod execution
git push to shared remote
```

この範囲では問題を検出していません。
