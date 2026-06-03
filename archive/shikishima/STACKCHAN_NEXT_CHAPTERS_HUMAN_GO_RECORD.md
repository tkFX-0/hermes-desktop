# StackChan Next Chapters — Umbrella Human GO Record

Date: 2026-05-28
Context: Display-only Operation ACCEPTED (`fb86fee` on `origin/main`)

---

## Human GO Statement

```text
Operator approves Human GO for all three next StackChan chapters:
1. Active Control — design / architecture chapter
2. Motion — recovery planning chapter (not device motion pilot)
3. Voice — design chapter (not voice output pilot)
```

This record is **chapter-opening GO for documentation and guarded design work only**.

---

## What This GO Authorizes

```text
- docs/shikishima/ planning, boundaries, GO drafts, evidence templates
- route/gate matrix updates (design status vs execution HOLD)
- type definitions and safety-policy checks in autonomy-zone scope (if a later macro requests)
- review of existing SC_MOTION_* and stackchan-local-service references (read-only)
- ledger / roadmap / dashboard updates
```

---

## What This GO Does NOT Authorize

```text
- any StackChan WebSocket / device send (display, motion, dance, voice)
- motion command, dance command, touch behavior change
- voice output, mic input, camera input
- firmware write, erase, serial flash
- IPC/preload/renderer wiring for active control
- productionReady: true
- execution: enabled
- autonomous Shikishima control
- git push (unless a separate push GO)
- raw SSID / IP / token / device URL in evidence
```

Display-only path remains **ACCEPTED** and is not reopened by this GO.

---

## Per-Chapter Status After Umbrella GO

| Chapter | Design | Implementation | Pilot |
|---------|--------|----------------|-------|
| Active Control | DONE | route delegation | n/a |
| Motion | DONE | `sendStackChanMotionOnce` | PASS (send + visual) |
| Voice | DONE | `sendStackChanVoiceOnce` | HOLD (voicevox/ws) |

Each **execution** pilot still requires its own bounded macro, time window, evidence file, and STOP review (same pattern as Display Pilot Retry).

---

## Prerequisites Already Satisfied (Display chapter)

```text
Display-only Operation: ACCEPTED
Display pilot Attempt 3: PASS
Display pilot Attempt 4: PASS (supplemental)
Safety Readiness: PREPARED (Rally 11)
Baseline observation: PASS
```

---

## Recommended Next Macros (sequential; not auto-run)

```text
1. /goalmacro shikishima.stackchan-active-control-chapter-design
2. /goalmacro shikishima.stackchan-motion-recovery-plan
3. /goalmacro shikishima.stackchan-voice-chapter-design
```

Future execution examples (each needs **separate** GO — not covered by this umbrella):

```text
/goalmacro shikishima.stackchan-motion-one-shot-pilot
/goalmacro shikishima.stackchan-voice-one-shot-pilot
```

---

## Invariants (unchanged)

```text
decision: HOLD
execution: disabled
productionReady: false
rawValuesReported: false
stackchan_control: HOLD (execution)
Active_control_execution: HOLD
```

---

## References

- `STACKCHAN_DISPLAY_ONLY_OPERATION_ACCEPTANCE.md`
- `STACKCHAN_ACTIVE_CONTROL_FUTURE_GO_DRAFT.md`
- `STACKCHAN_GATE_MATRIX.md`
- `SC_MOTION_02` … `SC_MOTION_06` (historical motion evidence; planning reference)
