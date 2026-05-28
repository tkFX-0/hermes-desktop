# StackChan Display-only Preview — GO Draft (NOT ACTIVE)

Date: 2026-05-28

---

## Important

```text
This file is a DRAFT template only.
It is NOT Human GO.
Requires Rally 11 Safety Readiness PREPARED (complete).
```

---

# /goalmacro shikishima.stackchan-display-only-preview

## Human GO Placeholder

```text
I approve one StackChan display-only preview planning task.

This GO allows planning and/or UI contract work for display-only StackChan status mapping.

This GO does not authorize motion, dance, firmware write, serial flash, voice, mic, camera, or autonomous control.
```

---

## Goal

Prepare how StackChan may display Shikishima status safely (mapping only):

```text
- HOLD
- PASS
- STOP
- WAITING_FOR_HUMAN
- STACKCHAN_BASELINE_PASS
- CORE_ACCEPTED
```

No device commands unless a future separate GO explicitly allows a bounded read-only poll (not in this draft).

---

## Safety — Display-only Means

```text
- no servo/motor command
- no dance command
- no firmware write / erase
- no voice / mic / camera
- no autonomous execution
- no productionReady true
- no execution enabled
```

---

## Baseline Inputs (redacted)

```text
Refer to STACKCHAN_BASELINE_OBSERVATION_RETRY_EVIDENCE.md
official_app_or_ui_reachable_without_command: false — plan around this limitation
```

---

## Evidence Output (when executed)

```text
docs/shikishima/STACKCHAN_DISPLAY_ONLY_PREVIEW_EVIDENCE.md (future)
```
