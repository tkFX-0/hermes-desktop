# StackChan Display Route Device Wiring Implementation

Date: 2026-05-28
Macro: `/goalmacro shikishima.stackchan-display-route-device-wiring-implementation`
Baseline: `origin/main` = `56a8d14`

---

## Result

```text
status: DEVICE_WIRING_FOUNDATION_IMPLEMENTED
```

---

## What Was Implemented

Guarded main-process display route foundation:

```text
src/main/stackchan-display-route/
  stackchan-display-device-route-types.ts
  stackchan-display-device-route.ts
  stackchan-display-device-route.test.ts
  index.ts
```

Function: `evaluateStackChanDisplayDeviceRoute(request)`

---

## What It Does

```text
- evaluates evaluateStackChanDisplayPilotReadiness
- evaluates evaluateStackChanDisplayRoute (shared guard)
- returns READY_FOR_PILOT_GO when route decision is READY_FOR_FUTURE_SEND
- transportMode: disabled | mock only
- keeps actual display send disabled
```

---

## What It Does Not Do

```text
- no actual StackChan display send
- no WebSocket send
- no serial connection
- no firmware operation
- no motion / dance / touch behavior change
- no voice / mic / camera
- no autonomous control
- no runtime / IPC / preload / renderer wiring
- no stackchanFaceLocal / stackchanSayLocal / stackchanDanceLocal calls
```

---

## Meaning of READY_FOR_PILOT_GO

```text
READY_FOR_PILOT_GO = route foundation ready for a separate explicit time-window Display Pilot GO.
It does NOT mean the device was contacted.
It does NOT approve actual display send.
It does NOT approve Active Control.
```

---

## Next Rally

```text
Rally 2: push / safety review
/goalmacro shikishima.stackchan-display-route-device-wiring-push-review
```

---

## Safety

```text
displaySendPerformed: false (always)
websocketSendPerformed: false (always)
stackchanConnectedByCommand: false (always)
productionReady: false
execution: disabled
Display Pilot: HOLD
Active Control: HOLD
```
