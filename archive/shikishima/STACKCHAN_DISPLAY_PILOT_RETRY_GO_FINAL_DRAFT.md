# StackChan Display Pilot Retry GO (Final Draft)

Date: 2026-05-28
Status: **DRAFT — NOT ACTIVE GO**

Preflight: `STACKCHAN_DISPLAY_PILOT_RETRY_PREFLIGHT_EVIDENCE.md` — PASS

---

## Placeholder Macro

```text
/goalmacro shikishima.stackchan-display-pilot-retry
```

---

## Human GO Placeholder

```text
I approve one StackChan Display-only Pilot Retry.

Approved time window:
START: YYYY-MM-DD HH:MM JST
END: YYYY-MM-DD HH:MM JST

Selected display intent:
STACKCHAN_BASELINE_PASS
```

This GO authorizes **exactly one** display-only pilot attempt within the declared time window.

---

## Allowed

```text
one-shot display-only send through guarded route (face_mode only)
selected intent: STACKCHAN_BASELINE_PASS
human visual confirmation
evidence record (redacted enums)
clean stop
verification tests
local docs commit
```

---

## Forbidden

```text
motion / dance / touch behavior change
voice / mic / camera
firmware write / erase / serial flash
autonomous loop
Discord send / token read / external API write
productionReady true / execution enabled
retry loop outside time window
unguarded stackchanFaceLocal / stackchanSayLocal / stackchanDanceLocal
git push (unless separate push GO)
```

---

## Required Human Confirmations Before Send

```text
human_present: yes
StackChan_screen_visible: yes
manual_stop_method_confirmed: yes
active_time_window: yes
selected_intent_confirmed: STACKCHAN_BASELINE_PASS
evaluateStackChanDisplayDeviceRoute: READY_FOR_PILOT_GO
sendStackChanDisplayOnce: guards PASS
transportMode: guarded-ws
actualDeviceSendEnabled: true
STACKCHAN_DISPLAY_PILOT_SEND: 1
```

---

## Stop Immediately If

```text
unexpected motion occurs
unexpected voice occurs
firmware operation becomes necessary
raw SSID/password/IP/device/token would be recorded
pilot cannot be stopped cleanly
guard returns HOLD or BLOCKED
```

---

## Evidence

```text
docs/shikishima/STACKCHAN_DISPLAY_PILOT_RETRY_EVIDENCE.md
```

---

## This Draft Does Not Approve

```text
Active Control
ongoing StackChan connection for autonomy
repeated attempts outside window
```
