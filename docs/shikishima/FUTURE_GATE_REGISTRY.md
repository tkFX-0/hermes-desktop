# Future Gate Registry

## Purpose

Records the Gates that must be completed before high-risk capabilities
can be considered for approval. None of these Gates are approved here.
This registry only defines the approval boundaries.

---

## Registry

| Gate ID | Capability | Current Status | Required Before |
|---|---|---|---|
| GATE-PR-01 | productionReady: true | HOLD | Gate 005 resolution + LMO session + human GO |
| GATE-EX-01 | execution: enabled | HOLD | GATE-PR-01 + separate execution Gate |
| GATE-EW-01 | external API write (general) | HOLD | GATE-EX-01 + per-service Gate |
| GATE-EMAIL-01 | email send | HOLD | GATE-EW-01 + email Gate |
| GATE-CAL-01 | calendar event creation | HOLD | GATE-EW-01 + calendar Gate |
| GATE-GH-01 | GitHub issue/PR creation | HOLD | GATE-EW-01 + GitHub Gate |
| GATE-SOC-01 | social post | HOLD | GATE-EW-01 + social Gate |
| GATE-PAY-01 | purchase / reservation / payment | HOLD | GATE-EW-01 + payment Gate |
| GATE-PUSH-01 | git push from UI | HOLD | separate explicit per-push GO |
| GATE-SC-DISP-01 | StackChan display-only (face terminal) | HOLD | display Gate + safety review |
| GATE-SC-PHYS-01 | StackChan physical motion | HOLD | GATE-SC-DISP-01 + physical Gate |
| GATE-SC-CONN-01 | StackChan serial/USB/Wi-Fi connection | HOLD | GATE-SC-PHYS-01 |
| GATE-VOICE-01 | voice output | HOLD | separate voice Gate |
| GATE-MIC-01 | microphone input | HOLD | separate mic Gate |
| GATE-CAM-01 | camera input | HOLD | separate camera Gate |
| GATE-AUTO-01 | autonomous command execution | HOLD | all above + autonomous Gate |

## Gate Dependency Chain

```
GATE-PR-01 (productionReady)
  └─ GATE-EX-01 (execution)
       └─ GATE-EW-01 (external write)
            ├─ GATE-EMAIL-01
            ├─ GATE-CAL-01
            ├─ GATE-GH-01
            ├─ GATE-SOC-01
            └─ GATE-PAY-01

GATE-SC-DISP-01 (StackChan display)
  └─ GATE-SC-PHYS-01 (physical motion)
       └─ GATE-SC-CONN-01 (connection)

GATE-VOICE-01 (independent)
GATE-MIC-01 (independent)
GATE-CAM-01 (independent)

GATE-AUTO-01 (requires all above)
```

## Required Statement

Task 24 does not approve any future gate.
Task 24 only records future approval boundaries.
All capabilities listed remain HOLD.
productionReady remains false.
execution remains disabled.

---

_Created: 2026-05-17_
_productionReady: false_
_execution: disabled_
