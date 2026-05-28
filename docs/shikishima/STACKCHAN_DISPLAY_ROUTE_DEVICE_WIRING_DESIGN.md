# StackChan Display Route Device Wiring Design

Date: 2026-05-28
Macro: `/goalmacro shikishima.stackchan-display-route-device-wiring-design`
Baseline: `origin/main` = `a52e2d9` (route guard pushed)

---

## Result

```text
status: DEVICE_WIRING_DESIGN_PREPARED
```

---

## Background

| Layer | Status |
|-------|--------|
| Display preview contract | PUSHED |
| Pilot readiness contract | PUSHED |
| Display route guard (`evaluateStackChanDisplayRoute`) | PUSHED (`a52e2d9`) |
| Guarded main-process device adapter | **Not implemented** |
| Actual display pilot | HOLD |

Rally 13 HOLD reason remains valid until device wiring exists behind guards.

---

## Goal

Design the **minimum future path** to send **one display-only intent** to StackChan hardware.

This document does **not** implement wiring or approve actual display send.

---

## Required Future Route

```text
Human GO (time window + single display intent)
  → evaluateStackChanDisplayPilotReadiness
  → createStackChanDisplayPreview
  → evaluateStackChanDisplayRoute
       decision must be READY_FOR_FUTURE_SEND
  → guarded main-process display adapter (NEW)
       · injectable transport (real WS vs mock)
       · map faceMood → fixed face_mode allowlist only
       · one JSON face_mode message per pilot GO
  → one-shot StackChan face/display update
  → human visual confirmation
  → STACKCHAN_DISPLAY_PILOT_EVIDENCE (redacted enums)
```

---

## Important Boundary

```text
This design does not approve actual display send.
This design does not approve Active Control.
READY_FOR_FUTURE_SEND (shared guard) ≠ device contacted.
Device wiring implementation requires separate Human GO.
Display Pilot retry requires separate time-window GO after wiring PASS.
```

---

## Device Wiring Must Be

| Property | Requirement |
|----------|-------------|
| Semantics | One-shot only; no default retry loop |
| Gates | Time-window, human present, manual stop, screen visible |
| Input | Display intent allowlist only |
| Output | Single face/display update per GO |
| Forbidden | voice, dance, motion, firmware, mic, camera, autonomous loop |
| Evidence | No raw SSID/password/IP/device/token in logs or docs |
| Coupling | Must not call `stackchanSayLocal`, `stackchanDanceLocal`, STT, firmware paths |

---

## Candidate Future Implementation

### Module shape (design only)

```text
src/main/stackchan-display-device-adapter.ts   (future impl GO)
  - sendStackChanDisplayOnce(input): Promise<SendResult>
  - requires route decision === READY_FOR_FUTURE_SEND
  - uses faceMood → face_mode table from STACKCHAN_DISPLAY_ROUTE_DESIGN.md
  - transport: StackChanDisplayTransport interface (mock | guarded-ws)

src/main/stackchan-display-transport-mock.ts     (future; default in tests)
```

### Wrapping policy

Existing `stackchanFaceLocal(emotion: string)`:

- **Not** callable from pilot flow directly
- May be wrapped **only** inside adapter after:
  - route guard PASS
  - pilot readiness PASS
  - external-action preflight PASS
  - Human GO flag set for this pilot window
- Adapter sends **only** `face_mode` JSON; never `state: speaking`, never PCM, never `dance`

### IPC / renderer

Separate GO after main adapter unit tests PASS. Display pilot retry must not require UI button that calls unguarded local service.

---

## Preflight Chain (Future)

```text
1. evaluateStackChanDisplayPilotReadiness → ready
2. evaluateStackChanDisplayRoute → READY_FOR_FUTURE_SEND
3. createExternalActionGuard (device_display) → allowed
4. Human GO document active + time window
5. sendStackChanDisplayOnce (one shot)
```

Any failure → HOLD; no send.

---

## Meaning for Display Pilot PASS

```text
A guarded device wiring route is required before Display Pilot retry can PASS.
Today’s “Display-only 実運用 100%” = one safe visual confirmation via this chain.
Active Control 100% is a separate chapter.
```

---

## Next Macro

```text
/goalmacro shikishima.stackchan-display-route-device-wiring-implementation
```

---

## Safety (This Design Task)

```text
actual_display_send: false
device_wiring_implemented: false
productionReady: false
execution: disabled
rawValuesReported: false
```
