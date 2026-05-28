# StackChan Display Pilot — Final GO Draft (NOT ACTIVE)

Date: 2026-05-28

---

## Important

```text
This file is a DRAFT template only.
It is NOT Human GO.
Requires DISPLAY_PILOT_READINESS_PREPARED and prior StackChan gates PASS/PREPARED.
Actual Display Pilot remains HOLD until this GO is explicitly completed by a human.
```

---

# /goalmacro shikishima.stackchan-display-pilot

## Human GO Placeholder

```text
I approve one limited StackChan display-only pilot.

This GO allows only a single display-only pilot within the declared time window.

This GO does not authorize motion, dance, firmware write, firmware erase, serial flash,
touch behavior change, voice, mic, camera, autonomous control, Discord send,
productionReady true, or execution enabled.
```

---

## Required Time Window

```text
start: ___________
end: ___________
(max duration recommended: short; e.g. 10–30 minutes)
```

---

## Required Human Confirmation

```text
- human_present: yes
- StackChan_visible: yes
- manual_stop_method_known: yes
- display_intent_selected: yes
```

---

## Allowed Display Intents (choose one)

```text
FINAL_CORE_ACCEPTED
STACKCHAN_BASELINE_PASS
SAFETY_READINESS_PREPARED
HOLD
PASS
STOP
WAITING_FOR_HUMAN
NEEDS_HUMAN_GO
DISCORD_HOLD
EXECUTION_DISABLED
PRODUCTION_READY_FALSE
```

---

## Stop Conditions

Stop immediately if:

```text
- unexpected motion occurs
- unexpected voice occurs
- screen shows unsafe error (record summary only)
- raw value appears (SSID, password, IP, token)
- command path is ambiguous
- pilot cannot be stopped cleanly
```

---

## Evidence

Use `STACKCHAN_DISPLAY_PILOT_EVIDENCE_TEMPLATE.md` after session.
