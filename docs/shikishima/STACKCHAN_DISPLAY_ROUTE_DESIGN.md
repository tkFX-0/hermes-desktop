# StackChan Display Route Design

Date: 2026-05-28
Macro: `/goalmacro shikishima.stackchan-display-route-design`
Baseline: `origin/main` = `d5c7b4d`

---

## Result

```text
status: DESIGN_PREPARED
```

---

## Background

StackChan Display Pilot (Rally 13) resulted in **HOLD** because no approved display-only route exists.

Pure contracts (`stackchan-display-preview`, `stackchan-display-pilot-readiness`) validate intent and safety flags but do not send to device.

Direct use of `stackchanFaceLocal` was correctly **not** attempted — it crosses network/device boundary without display-only guard.

---

## Goal

Design a **minimal future display-only route** from Shikishima status to StackChan screen.

This document does **not** implement that route.

---

## Design Principle

The route must only transmit **approved display intent** and its mapped presentation.

It must not transmit or imply:

```text
motion
dance
firmware write / erase / serial flash
voice / TTS / audio stream
mic / camera
autonomous control loop
productionReady true
execution enabled
Discord or external API write
raw network credentials or device identifiers
```

---

## Required Route Properties

| Property | Requirement |
|----------|-------------|
| Input | Single approved `StackChanDisplayIntent` enum per pilot GO |
| Validation | `createStackChanDisplayPreview` + `evaluateStackChanDisplayPilotReadiness` |
| Human gate | Explicit time-window GO; human present; manual stop confirmed |
| Send policy | At most **one** display update per pilot GO; no default retry loop |
| Evidence | Redacted enum evidence file after pilot |
| Safety invariants | All `StackChanDisplaySafety` flags remain false for active control |
| Wiring | Must not call `stackchanSayLocal`, `stackchanDanceLocal`, or firmware paths |
| Registry | Must register as `device_display` with preflight + Human GO in external-action registry |

---

## Read-only Discovery Summary

Classification of existing route-like code (no raw network values recorded):

| ID | Class | Location | Notes |
|----|-------|----------|-------|
| D-01 | **A** pure shared contract | `src/shared/stackchan-display-preview/` | Intent → label / faceMood / message; no I/O |
| D-02 | **A** pure shared contract | `src/shared/stackchan-display-pilot-readiness/` | Preflight; `actualDisplaySendApproved: false` |
| D-03 | **B** local service candidate | `stackchanFaceLocal` in `stackchan-local-service.ts` | WebSocket `face_mode` only; **unguarded**; free-form emotion string |
| D-04 | **B** local service candidate | `checkStackchanLocalStatus` | Read-only probe; not display send |
| D-05 | **C** network/device route | `connectWs` + JSON commands | Device WebSocket channel; used by face/voice/dance/LED |
| D-06 | **D** active control path | `stackchanSayLocal` | VOICEVOX + PCM stream + face + speaking state |
| D-07 | **D** active control path | `stackchanDanceLocal`, `stackchanLedLocal`, `stackchanPetMode` | Motion / LED / pet mode |
| D-08 | **D** active control path | `stackchan-stt-service.ts` | Inbound pat / camera / audio from firmware |
| D-09 | **E** unsafe for display pilot | Direct `stackchanFaceLocal(emotion)` | Emotion not tied to display intent; registry risk=high, shadowModeCovered=false |
| D-10 | **F** no usable route | Shikishima → StackChan display intent pipeline | **Not wired** (Rally 13 finding) |

Registry reference: `external-action-route-registry.ts` — `stackchan.faceDisplay` → `stackchanFaceLocal`, `defaultActionMode: SAFETY_HOLD`, `requiresHumanGo: true`.

---

## Candidate Route (Preferred Future)

Recommended future route (**Option C** — guarded one-shot):

```text
Human GO (time window + single display intent)
  → evaluateStackChanDisplayPilotReadiness (must be ready)
  → createStackChanDisplayPreview (intent → preview)
  → stackchanDisplayRouteAdapter (NEW — future implementation GO only)
       · map faceMood → single allowed device face_mode value (fixed table)
       · reject unknown intent / failed readiness / out-of-window
       · optional LED preset mapping (hold/pass/stop only) — separate sub-GO if used
  → one-shot guarded send (face_mode JSON only; no voice state; no dance; no PCM)
  → human visual confirmation
  → STACKCHAN_DISPLAY_PILOT_EVIDENCE (redacted enums)
```

Adapter must **wrap**, not bypass, safety policy:

```text
Do NOT export unguarded stackchanFaceLocal to renderer/IPC/autonomy zone.
Adapter is the only approved entry for display-only pilot.
```

---

## Face Mood → Device Mapping (Design Placeholder)

Pure contract `faceMood` values: `calm | happy | neutral | caution | alert | waiting`.

Device `face_mode` values used today by local service include pet-fw modes such as `normal`, `happy`, `sad`, `thinking`, `surprised`.

Future implementation must use a **fixed allowlist table** (example — to be locked in implementation GO):

| faceMood (contract) | allowed device face_mode | forbidden |
|---------------------|--------------------------|-----------|
| happy | happy | sad, surprised as “celebration dance” proxy |
| calm | normal | — |
| neutral | normal | — |
| caution | thinking | — |
| alert | surprised | — |
| waiting | normal | — |

Unknown mood → **HOLD display** (do not send).

---

## Non-Route (Explicitly Forbidden for Display-only Pilot)

```text
stackchanSayLocal          — voice + face + speaking state
stackchanDanceLocal        — motion
stackchanLedLocal (dance preset)
stackchanPetMode           — touch behavior
stackchan-stt-service      — inbound device events
firmware upload / flash
serial connection for write
renderer/mobile “preview only” UI — does not satisfy device pilot
```

---

## Relationship to Gates

| Gate | Status |
|------|--------|
| `L5-SC-DISP` / `stackchan_display_go` | Required before any device display effect |
| Active control | HOLD |
| Display pilot execution | HOLD until route implementation PASS + retry GO |
| `productionReady` | false |
| `execution` | disabled |

---

## Next Steps (Not This Task)

```text
1. /goalmacro shikishima.stackchan-display-route-implementation
2. Route implementation evidence PASS
3. /goalmacro shikishima.stackchan-display-pilot-retry (time window GO)
4. Display Pilot Acceptance (if PASS)
```

---

## Safety (This Design Task)

```text
actual_display_send: false
route_implemented: false
productionReady: false
execution: disabled
rawValuesReported: false
```
