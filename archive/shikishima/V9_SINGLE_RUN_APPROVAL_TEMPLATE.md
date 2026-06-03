# Shikishima v9 Single-Run Approval Template — v2.6.0

## Purpose

Template for issuing a single-run G-23 approval.
Copy this template and fill in all fields before issuing G-23.

- documentVersion: v2.6.0
- documentDate: 2026-05-12
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

---

## G-23 Single-Run Approval Template

```
=== G-23: CONTROLLED PILOT SINGLE-RUN APPROVAL ===
Date: [YYYY-MM-DD HH:MM]
Issued by: [human name or alias — required; cannot be agent]

Pilot scenario: [scenario name]
Run number: [N]
Duration limit: [N minutes]
Human monitor: [name — required; must be present throughout]

Scope confirmation:
  ✓ Single run only — this approval does NOT cover any subsequent run
  ✓ Local-only environment — no external network unless specified below
  ✓ Redacted output only — no raw values to be reported
  ✓ Immediate stop on any stop condition
  ✓ Human monitor present throughout

External services in scope (list or none):
  [service name: local-only / G-13 issued / none]

Devices in scope (list or none):
  [device: StackChan display-only (G-14 issued) / none]

Explicit GO statement:
  "GO G-23: Approve controlled pilot [scenario name] run [N]. [date]. Human monitor: [name]."

Post-run action:
  Review result before issuing any new G-23.

rawValuesReported: false
===
```

---

## What This Approval Covers

| Covered | Not Covered |
|---|---|
| Named scenario, single run | Any subsequent run |
| Listed devices in scope | Devices not listed |
| Redacted output capture | Raw value output |
| Human-stopped termination | Autonomous continue |

---

## What Invalidates This Approval

| Event | Result |
|---|---|
| P0 incident | Approval suspended; new review required |
| Scope violation | Approval suspended; return to HOLD |
| Human monitor absent | Approval suspended; do not continue |
| Duration exceeded without completion | Approval expires; terminate |

---

## Archive

When G-23 is issued, copy to V3_HUMAN_GO_CHECKLIST.md GO Statement Archive:

| Date | Gate | Statement | Monitor | Run# |
|---|---|---|---|---|
| [date] | G-23 | [GO statement] | [name] | [N] |

この範囲では問題を検出していません。
