# StackChan Safety Boundary

Date: 2026-05-27
Applies to: all StackChan work after Final Shikishima Core Acceptance

---

## Default State

```text
StackChan control: HOLD
StackChan connection: NOT_APPROVED (baseline observation PASS; Shikishima command connection still NOT_APPROVED)
Shikishima autonomous StackChan actions: FORBIDDEN
```

---

## Explicit HOLD Areas

| Area | Status |
|------|--------|
| Physical motion | HOLD |
| Dance routines | HOLD |
| Servo / motor movement | HOLD |
| Firmware write | HOLD |
| Firmware erase | HOLD |
| Bootloader / serial flash | HOLD |
| Voice output | HOLD |
| Microphone input | HOLD |
| Camera input | HOLD |
| Autonomous behavior | HOLD |
| Shikishima command execution to device | HOLD |
| External network actions (API write) | HOLD |
| Discord send | HOLD |
| Cursor Automations as direct executor | HOLD |

---

## Allowed Without New GO

```text
None for physical StackChan interaction.
Docs-only preparation (Phase 0) is allowed without device access.
```

---

## Allowed With Baseline Observation GO Only

```text
Read-only observation by a human-present operator:
- look at screen / face / UI
- note power / Wi-Fi / firmware state (redacted in records)
- note presence/absence of motion/dance/touch features without triggering them
```

---

## Required Before Any Active Control

Future rallies must satisfy **all** before motion/firmware/voice/etc.:

```text
1. Baseline observation: PASS or PASS_WITH_CAVEAT (documented)
2. Safety readiness rally: PASS
3. Rollback method documented and understood
4. Manual stop method documented
5. Human present for entire window
6. Short bounded time window in GO
7. Command allowlist in GO (no open-ended autonomy)
8. Evidence template completed
9. External Action Guard route reviewed if Shikishima issues commands
```

---

## Relationship to Shikishima Core

```text
Final Core 100 does not include StackChan control.
StackChan is a separate physical-interface phase.
Guards and Human GO from Core phase still apply.
```

---

## Invariants (never implied by observation)

```text
productionReady: false
execution: disabled
rawValuesReported: false
```

---

## Rally 11 Update (2026-05-28)

```text
StackChan Baseline Observation Retry: PASS
Safety Readiness: SAFETY_READINESS_PREPARED (Rally 11)
Active control: remains HOLD

Display-only preview may be planned next (/goalmacro shikishima.stackchan-display-only-preview).
Motion, dance, firmware write, voice, mic, camera, and autonomous control remain HOLD.
```

See: `STACKCHAN_SAFETY_READINESS.md`, `STACKCHAN_GATE_MATRIX.md`, `STACKCHAN_STOP_CONDITIONS.md`.

---

## Display-only Preview (2026-05-28)

```text
Display-only preview: PREPARED (pure contract + docs).
Active control: remains HOLD.
Motion, dance, firmware write, voice, mic, camera, and autonomous control remain HOLD.
```

See: `STACKCHAN_DISPLAY_ONLY_PREVIEW_SPEC.md`, `src/shared/stackchan-display-preview/`.

---

## Display Pilot Readiness (2026-05-28)

```text
Display Pilot Readiness is the next gate after Display-only Preview.
Actual display pilot remains HOLD until explicit future GO with time window.
Active control remains HOLD.
```

See: `STACKCHAN_DISPLAY_PILOT_READINESS.md`, `STACKCHAN_DISPLAY_PILOT_FINAL_GO_DRAFT.md`.
