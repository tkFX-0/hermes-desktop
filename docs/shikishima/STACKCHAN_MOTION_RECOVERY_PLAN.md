# StackChan Motion — Recovery Plan (Kickoff)

Date: 2026-05-28
Human GO: umbrella record `STACKCHAN_NEXT_CHAPTERS_HUMAN_GO_RECORD.md` (planning only)

---

## Purpose

Plan **motion command** recovery under guarded active-control rules. This is **not** a motion pilot GO.

---

## Existing Evidence (reference)

```text
SC_MOTION_02 — operation motion candidates (planning)
SC_MOTION_03 — preset implementation evidence (historical)
SC_MOTION_04 — dialogue motion fix
SC_MOTION_05 — pat sensitivity / LED
SC_MOTION_06 — cat-like nuzzle pat motion
```

Use for requirements and overlap rules; do not treat as automatic re-approval to run hardware.

---

## Recovery Plan Outline

| Step | Content | Device send |
|------|---------|-------------|
| 1 | Inventory allowed `move` preset names vs gate allowlist | no |
| 2 | Map PC path (`stackchanDanceLocal` / motion WS) to guarded wrapper design | no |
| 3 | Define one-shot motion pilot GO draft (time window, single preset) | future GO |
| 4 | Human visual evidence template | after pilot |

---

## Safety Defaults (carry forward)

```text
one motion at a time
no motion during firmware write
no voice loop with unbounded motion
cooldown between repeated motions
return to center after motion unless idle/sleep
```

---

## Status

```text
chapter_design_go: DONE
motion_route: IMPLEMENTED (sendStackChanMotionOnce)
motion_pilot: PASS_WITH_CAVEAT (center send ok)
next: human visual confirm; optional wake_up pilot with new GO
```
