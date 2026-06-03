# StackChan Active Control — Chapter Design (Kickoff)

Date: 2026-05-28
Human GO: umbrella record `STACKCHAN_NEXT_CHAPTERS_HUMAN_GO_RECORD.md` (design only)

---

## Scope

Define how **Active Control** differs from **Display-only**, without implementing sends or enabling execution.

---

## Display-only Baseline (closed chapter)

```text
Path: display intent → route guard → device route → sendStackChanDisplayOnce (guarded-ws)
Approved: face_mode one-shot under explicit GO windows
Forbidden paths: stackchanFaceLocal / stackchanSayLocal / stackchanDanceLocal direct pilot use
```

---

## Active Control — Design Questions (TBD in this chapter)

```text
1. Command allowlist per GO (motion names, voice phrases, LED, pet mode)
2. Coupling to stackchan-local-service.ts vs new guarded transport layers
3. isSpeaking / pat / camera overlap rules (see SC_MOTION_04 lessons)
4. Manual stop + rollback (SC_RESTORE_01 family)
5. Registry entry: device_active_control vs device_display
6. Evidence template per one-shot pilot type
```

---

## Explicit HOLD Until Future Execution GO

```text
motion, dance, touch modification, voice, mic, camera, firmware, autonomous control
productionReady: false
execution: disabled
```

---

## Deliverables (this chapter)

```text
- boundary doc (display vs active control)
- gate matrix delta draft
- future one-shot GO draft per command class
- STOP conditions aligned with STACKCHAN_STOP_CONDITIONS.md
```

Implementation: **DONE** — see `STACKCHAN_ACTIVE_CONTROL_CHAPTER_EVIDENCE.md`.
