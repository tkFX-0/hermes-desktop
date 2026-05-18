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

## Grok-Hermes Provider Gates (GHG series)

| Gate ID | Capability | Current Status | Required Before |
|---|---|---|---|
| GHG-00 | Docs-only research | COMPLETE | — |
| GHG-01 | Hermes version / readiness check | HOLD | explicit human GO |
| GHG-02 | Auth boundary review | HOLD | GHG-01 PASS |
| GHG-03 | Manual OAuth login (human-only) | HOLD | GHG-02 PASS + human GO |
| GHG-04 | Redacted provider status | HOLD | GHG-03 PASS |
| GHG-05 | Chat-only dry run | HOLD | GHG-04 PASS + human GO + time_window |
| GHG-06 | Provider-router integration | HOLD | GHG-05 PASS + impl GO |
| GHG-07 | Fallback / quota / timeout policy | HOLD | GHG-06 PASS |
| GHG-08 | Limited manual chat operation | HOLD | GHG-07 PASS + human GO + time_window |
| GHG-09a | x_search enablement | HOLD | GHG-08 PASS + XS-01+ |
| GHG-09b | TTS | HOLD | GHG-08 PASS + separate GO |
| GHG-09c | Image generation | HOLD | GHG-08 PASS + separate GO |
| GHG-09d | Video generation | HOLD | GHG-08 PASS + separate GO |
| GHG-09e | Transcription | HOLD | GHG-08 PASS + mic gate |
| GHG-09f | Messaging adapters | HOLD | GHG-08 PASS + per-platform GO |

## x_search Social Awareness Gates (XS series)

| Gate ID | Capability | Current Status | Required Before |
|---|---|---|---|
| XS-00 | Docs-only registration | COMPLETE | — |
| XS-01 | Auth boundary review for x_search | HOLD | GHG-04 PASS |
| XS-02 | Enablement GO draft | HOLD | XS-01 PASS |
| XS-03 | Read-only manual dry run | HOLD | XS-02 PASS + human GO + time_window |
| XS-04 | Redacted result display | HOLD | XS-03 PASS |
| XS-05 | Daily digest draft only | HOLD | XS-04 PASS + human GO |
| XS-06 | Draft Outbox integration | HOLD | XS-05 PASS + impl GO |
| XS-07 | Runtime UI status | HOLD | XS-06 PASS |
| XS-08 | Limited manual operation | HOLD | XS-07 PASS + human GO + time_window |
| XS-09 | External posting review | HOLD | XS-08 PASS + content policy GO |

## Agent Theater Implementation Gates (AT series)

| Gate ID | Capability | Current Status | Required Before |
|---|---|---|---|
| AT-00 | Docs-only design | COMPLETE | — |
| AT-01 | Page route design (docs) | HOLD | AT-00 + human review |
| AT-02 | Static UI implementation | HOLD | AT-01 + impl GO |
| AT-03 | Pixel ghost asset integration | HOLD | AT-02 + asset review GO |
| AT-04 | State binding to snapshot | HOLD | AT-02 + impl GO |
| AT-05 | CSS-only animation | HOLD | AT-02 + impl GO + human visual review |
| AT-06 | Slot worker status display | HOLD | AT-04 + impl GO |
| AT-07 | Handoff animation | HOLD | AT-06 + impl GO + human visual review |
| AT-08 | Runtime visual recheck (initial) | PASS (2026-05-18) | — |
| AT-08b | AT-04 refined ghost runtime recheck | HOLD | human GO + time_window |

## Required Statement

No gate in this registry is approved.
This registry only records approval boundaries.
All capabilities listed remain HOLD.
productionReady remains false.
execution remains disabled.
_Updated: 2026-05-18 — added GHG and XS gate series_

---

_Created: 2026-05-17_
_productionReady: false_
_execution: disabled_
