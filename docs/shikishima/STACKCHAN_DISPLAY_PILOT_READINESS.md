# StackChan Display Pilot Readiness

Date: 2026-05-28
Rally: StackChan Display Pilot Readiness
Baseline: `origin/main` = `562c8f5`

---

## Result

```text
status: DISPLAY_PILOT_READINESS_PREPARED
```

---

## Background

```text
Final Core: ACCEPTED_AS_FINAL_CORE_100
StackChan Baseline Observation: PASS (retry)
StackChan Safety Readiness: SAFETY_READINESS_PREPARED
StackChan Display-only Preview: DISPLAY_ONLY_PREVIEW_PREPARED (pushed)
Active Control: HOLD
```

---

## Purpose

Prepare the **future** StackChan display-only pilot.

This document does **not** authorize actual display output to the device.

---

## Display Pilot Definition

A Display Pilot may only attempt to show Shikishima status on StackChan display (when a future explicit GO authorizes it).

A Display Pilot must **not** perform:

```text
- motion / dance
- firmware write / erase / serial flash
- touch behavior change
- voice / mic / camera
- autonomous execution
- productionReady true
- execution enabled
- Discord send / external API write
```

---

## Required Preconditions

```text
- human present
- StackChan screen visible (confirmed before pilot GO)
- manual stop method known and documented
- short time window declared (start / end)
- allowed display intent selected (from preview contract)
- no raw SSID / password / IP / device ID / token in evidence
- no firmware operation
- no motion / voice / camera operation
```

---

## Allowed Future Display Intents

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

See: `src/shared/stackchan-display-preview/`, `STACKCHAN_DISPLAY_STATE_MAPPING.md`.

---

## Actual Pilot Status

```text
Display Pilot execution: HOLD (until /goalmacro shikishima.stackchan-display-pilot with time window GO)
StackChan connection by Shikishima command: NOT_APPROVED in this rally
```

---

## Related Artifacts

| File | Role |
|------|------|
| `STACKCHAN_DISPLAY_PILOT_EVIDENCE_TEMPLATE.md` | Post-pilot evidence form |
| `STACKCHAN_DISPLAY_PILOT_FINAL_GO_DRAFT.md` | Future GO template |
| `src/shared/stackchan-display-pilot-readiness/` | Pure readiness validation |
