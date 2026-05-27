# StackChan Custom Firmware Forensics Plan

Date: 2026-05-28
Rally: StackChan Custom Firmware Forensics / Recovery Plan (Rally 10.5)
Baseline: `origin/main` = `dce1fe4`, Rally 10 HOLD evidence `bf66b2e`

---

## Result

```text
status: PREPARED_ONLY
```

---

## Background

StackChan Baseline Observation (Rally 10) is **HOLD**.

The device was available, but normal read-only visual observation was not confirmed in the prior session (no observable face/display behavior reported by operator).

Redacted known state:

```text
firmware_state_redacted: custom_suspected
Wi-Fi_state_redacted: connected (no SSID/password recorded)
motion_command_sent: false
firmware_write: false
```

---

## Purpose

Prepare a **safe investigation path** for custom firmware state **without touching the device**.

This is planning and repo-local doc synthesis only — not recovery execution.

---

## Repo Discovery Summary (read-only, 2026-05-28)

| Class | Finding |
|-------|---------|
| A. Phase plans | `STACKCHAN_PHASE0_*`, `STACKCHAN_SAFETY_BOUNDARY.md`, baseline HOLD evidence |
| B. Firmware notes | `SC_FW_*`, `SC_FACE_03_*`, `SC_PC_02_FIRMWARE_WRITE_EVIDENCE.md`, `SC_RESTORE_01_FACTORY_RESTORE_ROLLBACK_PLAN.md` |
| C. Motion/dance | `SC_MOTION_*`, `SC_FW_06_DANCE_ROUTE_*`, `SC_DANCE_01_*`, `SC_EVENT_00_PC_TOUCH_DANCE_*` |
| D. Touch/pet | `SC_MOTION_06_CAT_LIKE_NUZZLE_PAT_*`, touch/dance event server design |
| E. Display/face | `SC_FACE_*`, display-only test evidence |
| F. Network | Wi-Fi mentioned in historical docs — **redacted only** in new records |
| G. App source | `src/renderer/.../StackChan/StackChanPage.tsx` exists; **not activated** in this rally |

Historical docs may contain serial/port references. **Do not copy** port names, IPs, or credentials into new evidence.

---

## Design Reference Only (do not merge to current main)

```text
worker-task-contract-preview @ 2bcd087 is an older baseline artifact.
Current origin/main = dce1fe4 (Final Core + StackChan Phase 0 + Completion Room de-scope).
Do not push or cherry-pick 2bcd087 onto main without explicit Human GO and scope review.
Use only as design reference if needed.
```

---

## What This Does Not Approve

```text
- firmware write / erase / flash
- serial connection
- motion or dance command
- touch handler modification
- voice / mic / camera
- autonomous Shikishima → StackChan control
- external API write
- productionReady true
- execution enabled
- StackChan network connection from Shikishima
```

---

## Investigation Questions (human read-only, next session)

1. Does custom firmware show a face/display at boot?
2. Does firmware expose official app or local UI (observe only)?
3. Is touch/pet implemented, disabled, or unknown?
4. Is dance/motion implemented, disabled, or unknown?
5. Is the screen blank, frozen, or custom state?
6. Is Wi-Fi connected without a usable observation route?
7. Is firmware recovery path required?
8. Is a **separate future firmware recovery GO** required?

---

## Hypotheses (docs-only, unverified)

```text
H1: Custom firmware changed boot/display path — baseline visual checklist blocked
H2: Dance/motion routes exist in prior SC_FW docs but may be disabled or broken on device
H3: Touch/pet may be unimplemented or sensitivity-gated (see SC_MOTION_05 pat evidence)
H4: Official StackChan-UserDemo path may differ from current flash — restore plan exists but needs new GO
H5: Wi-Fi connected does not imply observable UI without human screen confirmation
```

---

## Next Recommended Action

```text
1. Human completes STACKCHAN_CUSTOM_FIRMWARE_CHECKLIST.md (read-only)
2. /goalmacro shikishima.stackchan-baseline-observation-retry when screen/power visible
3. If State D/E in recovery tree → firmware recovery GO draft only (no flash in retry)
4. Rally 11 Safety Readiness only after Baseline PASS
```

---

## Related Historical Docs (reference)

```text
SC_STACKCHAN_DO_NOT_OPEN_YET.md — capability HOLD list
SC_RESTORE_01_FACTORY_RESTORE_ROLLBACK_PLAN.md — rollback planning (separate GO for any write)
SC_FACE_03_CUSTOM_FIRMWARE_FEASIBILITY_GATE.md — custom FW feasibility (build/flash HOLD)
SC_FW_01_DANCE_LED_RESTORE_INVESTIGATION.md — dance/LED restore investigation notes
```
