# StackChan Display Route Device Wiring Implementation GO Draft

Date: 2026-05-28
Status: **DRAFT — NOT ACTIVE GO**

Companion: `STACKCHAN_DISPLAY_ROUTE_DEVICE_WIRING_DESIGN.md`

---

## Placeholder Macro

```text
/goalmacro shikishima.stackchan-display-route-device-wiring-implementation
```

---

## Human GO Placeholder

```text
I approve implementation of a guarded StackChan display-only device wiring route.

This GO may implement main-process wiring and tests only.
This GO does NOT approve an actual Display Pilot on hardware unless a separate time-window pilot GO is also active.
```

---

## Preconditions

```text
origin/main includes a52e2d9 (route guard)
DEVICE_WIRING_DESIGN_PREPARED docs pushed
evaluateStackChanDisplayRoute exists and tests PASS
```

---

## Allowed Implementation

```text
src/main/stackchan-display-device-adapter.ts (name per GO)
src/main/stackchan-display-transport-mock.ts
tests proving:
  - no motion/voice/firmware/dance paths invoked
  - send disabled when route decision !== READY_FOR_FUTURE_SEND
  - one-shot enforcement
  - mock transport only in default test run
docs/shikishima/STACKCHAN_DISPLAY_ROUTE_DEVICE_WIRING_IMPLEMENTATION.md
local commit; push with separate push GO
```

Optional if GO explicitly allows:

```text
minimal guarded wrapper around face_mode send (not stackchanFaceLocal direct export)
injectable transport interface
```

---

## Forbidden

```text
IPC / preload / renderer wiring (separate GO)
actual pilot retry execution (separate GO)
stackchanSayLocal / stackchanDanceLocal / STT / firmware
motion / dance / voice / mic / camera
autonomous loop
package.json changes
productionReady true / execution enabled
git push without push GO
recording raw network credentials
```

---

## Default Send Policy

```text
actualDeviceSendEnabled: false by default in adapter
Real transport only when:
  - explicit env flag in GO (e.g. STACKCHAN_DISPLAY_PILOT_SEND=1)
  - AND active pilot retry GO
  - AND all guards PASS
```

---

## Success Criteria

```text
status: WIRING_IMPLEMENTED | PASS
unit tests PASS with mock transport
no regression in full suite
display_pilot_execution: still HOLD until pilot-retry GO
```

---

## This Draft Does Not Approve

```text
Display Pilot retry on hardware
Active Control
push (unless combined push GO)
```
