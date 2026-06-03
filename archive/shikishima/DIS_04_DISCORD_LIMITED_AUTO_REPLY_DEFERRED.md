# DIS-04 Discord Limited Auto-Reply Deferred

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** DEFERRED — not approved
**gate:** future Level 5+ gate, not yet defined

---

## Summary

DIS-04 is a future candidate for extremely limited automatic replies.
It is not approved. It is not designed in detail yet.
This document records the concept and required preconditions only.

---

## Examples That Might Be Considered Later

Candidates for extremely limited template-only auto-replies:

```text
- "受付しました"
- "HOLDです"
- "人間確認待ちです"
- "証跡を作成します"
```

These would not be free-form. Template whitelist only.

---

## What Is NOT Approved Now

- natural language free-form auto replies
- DM auto replies
- mention replies
- multi-channel posting
- repeated polling/reply loops
- error retry messages
- external execution notices
- replies to other bots
- replies triggered by any message (not just approved user)
- replies without content filter

---

## Required Future Conditions Before DIS-04 Can Be Designed

All of the following must be PASS before DIS-04 design begins:

```text
- DIS-01: PASS (read-only intake working)
- DIS-02: PASS (draft response verified)
- DIS-03: PASS (at least one human GO reply test completed)
- rate_limit_handling: implemented and tested
- loop_prevention: implemented and verified (bot does not reply to itself)
- channel_whitelist: enforced
- user_whitelist: enforced
- template_whitelist: defined and enforced
- kill_switch: implemented and tested
- evidence_logging: implemented
```

---

## Required Future GO Fields (placeholder — not finalized)

```text
dis04_auto_reply_go:
  date:
  time_window_jst:
  approved_server_id:
  approved_channel_id:
  approved_user_id:
  template_whitelist:         (exact strings only)
  trigger_condition:          (exact match only)
  max_replies_per_session:
  loop_prevention_method:
  kill_switch_method:
  stop_if:
  evidence_file:
```

---

## Safety

```yaml
productionReady:    false
execution:          disabled
rawValuesReported:  false
dis04_approved:     false
auto_reply_active:  false
```
