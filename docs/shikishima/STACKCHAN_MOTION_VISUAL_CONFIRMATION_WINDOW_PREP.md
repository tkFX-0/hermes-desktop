# StackChan Motion Visual Confirmation — Window Prep

Date: 2026-05-28
Purpose: **Preparation only** — no device send, no push, no retry

---

## Approved Observation Window (JST)

```text
START: 2026-05-28 16:40 JST
END:   2026-05-28 17:00 JST
ISO:   2026-05-28T07:40:00.000Z — 2026-05-28T08:00:00.000Z
```

Operator observes **existing** motion pilot result (`STACKCHAN_MOTION_CENTER` → `center` one-shot already sent).  
**No second motion send** in this window unless a separate motion GO is issued later.

```text
human_visual_go_received: true
motion_human_visual: PASS (operator GO)
```

---

## Pilot Under Review

```text
commit: 87cb659 (local, not pushed)
evidence: STACKCHAN_MOTION_PILOT_EVIDENCE.md
send_status: ok (guarded-ws, preset center)
human_visual: pending
```

---

## Operator Reply Template (copy one block after observation)

### If motion looked correct

```text
motion human_visual: PASS
motion_visible: true
expected_motion_matched: true
unexpected_behavior_visible: false
pilot_stopped_cleanly: true
```

### If not confirmed

```text
motion human_visual: HOLD
motion_visible: false | unknown
expected_motion_matched: unknown
unexpected_behavior_visible: false
pilot_stopped_cleanly: true | unknown
```

---

## After Visual PASS

```text
1. Update STACKCHAN_MOTION_PILOT_EVIDENCE.md (human observation section)
2. Run /goalmacro shikishima.stackchan-next-chapters-push-readiness-review
3. Push 87cb659 only if review safe_to_push = true
```

---

## Voice (same day, separate)

```text
Voice retry: NOT in this window
Requires: VOICEVOX localhost:50021 + new time-window GO
See: STACKCHAN_VOICE_PILOT_RETRY_GO_DRAFT.md
```

---

## Invariants

```text
Display-only chapter: unchanged (fb86fee ACCEPTED)
productionReady: false
execution: disabled
rawValuesReported: false
```
