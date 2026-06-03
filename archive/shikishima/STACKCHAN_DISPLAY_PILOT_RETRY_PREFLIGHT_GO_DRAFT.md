# StackChan Display Pilot Retry Preflight GO Draft

Date: 2026-05-28
Status: **PREFLIGHT COMPLETED (PASS)** — Rally 4 GO still required for actual send

Companion: `STACKCHAN_DISPLAY_PILOT_RETRY_GO_DRAFT.md`

---

## Placeholder Macro

```text
/goalmacro shikishima.stackchan-display-pilot-retry-preflight
```

---

## Human GO Placeholder

```text
I approve a preflight check for StackChan Display Pilot Retry.

This does NOT approve actual display send to StackChan hardware.
This validates that all guards and wiring are ready before a separate pilot-retry GO.
```

---

## Purpose

Run **read-only / mock / contract** checks so human can approve pilot retry with confidence.

```text
Preflight PASS → eligible for stackchan-display-pilot-retry GO
Preflight HOLD → do not run pilot retry
```

---

## Required Preconditions

```text
stackchan-display-route-device-wiring-implementation: PASS or WIRING_IMPLEMENTED
evaluateStackChanDisplayRoute: tests PASS
evaluateStackChanDisplayPilotReadiness: tests PASS
guarded device adapter: exists; mock send tests PASS
human_present: true (declared)
screen_visible: true (declared)
manual_stop_method_confirmed: true (declared)
time_window: prepared (START/END JST in GO doc, not executed yet)
selected_display_intent: STACKCHAN_BASELINE_PASS (or allowed alternate)
productionReady: false
execution: disabled
```

---

## Preflight Checks (No Device Send)

```text
git baseline clean
typecheck + full tests PASS
route guard returns READY_FOR_FUTURE_SEND for prepared request fixture
readiness returns ready for prepared fixture
adapter dry-run with mock transport records would-send face_mode only
verify no import of stackchanSayLocal / stackchanDanceLocal in adapter
evidence template present
```

---

## Forbidden Under Preflight GO

```text
actual WebSocket send to StackChan
StackChan connection command for ongoing use
runtime start (unless explicit sub-clause)
motion / dance / voice / mic / camera / firmware
recording raw SSID/password/IP/device/token
```

---

## Output

```text
docs/shikishima/STACKCHAN_DISPLAY_PILOT_RETRY_PREFLIGHT_EVIDENCE.md

status: PREFLIGHT_PASS | PREFLIGHT_HOLD
actual_display_send_performed: false
```

---

## Next Step After PREFLIGHT_PASS

```text
/goalmacro shikishima.stackchan-display-pilot-retry
(with explicit time window; may authorize one hardware send)
```

---

## This Draft Does Not Approve

```text
hardware display pilot
push (unless separate GO)
Active Control
```
