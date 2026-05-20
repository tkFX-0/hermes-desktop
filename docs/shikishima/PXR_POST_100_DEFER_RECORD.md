# PXR Post-100 Defer Record

date: 2026-05-20
status: DEFERRED
decision: HOLD
execution: disabled
productionReady: false
rawValuesReported: false

This document records the decision to defer Pixel Room and character-design
polish until after final real-operation readiness acceptance.

---

## 1. Decision

Pixel Room work is not on the critical path to 100% readiness.

Current decision:

```text
Pixel Room: provisional acceptable
character design rebuild: post-100 polish
sprite asset integration: post-100 gated work
handoff motion refinement: post-100 polish
Three.js / R3F expansion: post-100 gated work
```

---

## 2. Why Deferred

The current Pixel Room has enough value for orientation and review. Further
polish would improve identity and presentation, but it does not answer the
remaining safety questions:

- Can the human safely review the app?
- Are redacted snapshots visible?
- Are raw values hidden?
- Are Level 5 gates held?
- Are final acceptance documents complete?

Therefore, Pixel Room polish must not block final verification.

---

## 3. Deferred Items

| Item | Status | Future gate |
|---|---|---|
| character sheet rebuild | DEFERRED | PXR-POLISH-GO |
| sprite sheet asset integration | HOLD | AT-05 / asset GO |
| cropped sprite files | HOLD | asset license / originality review |
| walking animation | DEFERRED | visual polish GO |
| handoff motion path tuning | DEFERRED | visual polish GO |
| Three.js / R3F runtime room | HOLD | package/dependency GO |
| image asset commit | HOLD | explicit asset GO |

---

## 4. Current Acceptance

Current Pixel Room may be used as:

- provisional orientation layer
- visual review aid
- non-operational Agent Theater display

It must not be interpreted as:

- production-quality character finalization
- Level 5 operation approval
- device/robot behavior
- external action approval

---

## 5. Future PXR Restart Conditions

PXR may resume after final readiness acceptance or with a separate explicit GO.

Required GO fields:

```text
pxr_polish_go:
  target:
  allowed_files:
  image_asset_allowed:
  asset_source:
  license_or_originality_note:
  runtime_allowed:
  package_change_allowed:
  expected_result:
  stop_conditions:
  evidence_file:
```

Default:

```text
image_asset_allowed: false
runtime_allowed: false
package_change_allowed: false
```

---

## 6. Safety Boundary

This defer record does not approve:

- image asset import
- generated PNG commit
- package/dependency changes
- runtime start
- Three.js / R3F activation
- productionReady true
- execution enabled
- StackChan physical operation
- voice/camera/mic
- external API write

---

## 7. Next Mainline Task

Return to final verification:

```text
AT-14 Room visual evidence
```

