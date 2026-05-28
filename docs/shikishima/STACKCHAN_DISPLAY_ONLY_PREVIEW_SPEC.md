# StackChan Display-only Preview Spec

Date: 2026-05-28
Rally: StackChan Display-only Preview
Baseline: `origin/main` = `657378b`

---

## Result

```text
status: DISPLAY_ONLY_PREVIEW_PREPARED
```

---

## Purpose

Define how StackChan can display Shikishima status **safely** without controlling the device.

StackChan acts as a **status face**, not an executor.

---

## Scope

Display-only planning and pure shared contract mapping.

Future visual representation may cover:

```text
- FINAL_CORE_ACCEPTED
- STACKCHAN_BASELINE_PASS
- SAFETY_READINESS_PREPARED
- HOLD
- PASS
- STOP
- WAITING_FOR_HUMAN
- NEEDS_HUMAN_GO
- DISCORD_HOLD
- EXECUTION_DISABLED
- PRODUCTION_READY_FALSE
```

---

## Non-Scope

This does **not** approve:

```text
- StackChan connection command
- motion / dance
- firmware write / erase / serial flash
- voice / mic / camera
- autonomous Shikishima control
- productionReady true
- execution enabled
- IPC / preload / renderer wiring to device
```

---

## Display Principle

```text
- Display must never imply that HOLD items are approved.
- EXECUTION_DISABLED and PRODUCTION_READY_FALSE must remain visible invariants.
- Display state changes must not send motion, voice, or external actions.
- official_app_or_ui_reachable_without_command: false remains a known baseline limitation.
```

---

## Implementation Artifacts

| Artifact | Role |
|----------|------|
| `STACKCHAN_DISPLAY_STATE_MAPPING.md` | Human-readable mapping table |
| `src/shared/stackchan-display-preview/` | Pure TypeScript contract + tests |
| `STACKCHAN_DISPLAY_PILOT_GO_DRAFT.md` | Future bounded pilot GO template |

---

## Invariants

```text
stackchan_active_control: HOLD
productionReady: false
execution: disabled
rawValuesReported: false
```
