# StackChan Active Control Future GO Draft

Date: 2026-05-28

---

## Important

```text
This is NOT active approval.
Any StackChan active control requires a future explicit Human GO per gate in STACKCHAN_GATE_MATRIX.md.
```

---

## Prerequisites Before Active Control

All must be satisfied:

```text
1. Safety Readiness: SAFETY_READINESS_PREPARED (Rally 11)
2. Baseline observation: PASS (retry evidence on record)
3. Rollback method documented and understood (see SC_RESTORE_01 planning docs)
4. Manual stop method documented
5. Command allowlist in GO (no open-ended autonomy)
6. Short bounded time window in GO
7. Human present for entire window
8. No raw secrets in evidence
9. No firmware write unless specifically approved in that GO
10. No autonomous loop
11. Evidence template completed after session
```

---

## Gates Still HOLD by Default

```text
motion, dance, touch modification, firmware write/erase, serial flash,
voice, mic, camera, autonomous Shikishima control
```

Display-only preview may proceed under a separate GO without opening these gates.

---

## Example Future GO Names (not approved)

```text
/goalmacro shikishima.stackchan-motion-one-shot-pilot
/goalmacro shikishima.stackchan-firmware-recovery
```

Each requires its own evidence file and STOP condition review.

---

## Invariants

```text
productionReady: false
execution: disabled
stackchan_control: HOLD until explicit GO changes evidence only — never implied
```
