# XACC-04 Human GO Write Plan

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** HOLD — Level 5, explicit xacc_write_go required
**gate:** explicit xacc_write_go form required, XACC-03 PASS first

---

## Summary

HOLD until explicit xacc_write_go.

One approved post or reply. Verbatim content only. Once only per GO.
Level 5 — X書き込みは外部サービスへの書き込みである。

---

## Gate Level

**Level 5**

Reason: X post/reply is an external service write operation.
Every write action requires a separate explicit human GO.

---

## Allowed After GO

- send exactly one approved post or reply
- with exactly the approved verbatim content
- once only per GO

---

## Forbidden

- send more than one post/reply per GO
- deviate from approved content by even one character
- DM, like, retweet, follow, or any other write action (separate GO required each)
- mention accounts not explicitly named in the GO
- reply to the bot's own post
- start a reply chain without separate GO
- enable productionReady
- enable execution

---

## Required GO Fields

```text
xacc_write_go:
  date:
  time_window_jst:
  account_type:          (sub-account or main)
  action_type:           post / reply
  target_post_id:        (if reply — exact post ID)
  exact_content:         (verbatim — no deviation allowed)
  allowed_send_count:    1
  dry_run_completed:     true/false
  stop_if:
  rollback_or_disable:   (how to revoke token / delete post)
  evidence_file:
```

`exact_content` is verbatim. The API sends exactly this text.

---

## Pre-Send Checklist

Before executing XACC-04:

- [ ] XACC-01 PASS
- [ ] XACC-02 PASS
- [ ] XACC-03 draft reviewed by human
- [ ] exact content approved by human
- [ ] target account confirmed
- [ ] token available locally (not in chat/logs)
- [ ] rate limit checked — not near limit
- [ ] rollback/delete path known (token revoke or manual delete)
- [ ] evidence file path set

---

## Post-Send Record

```text
xacc04_result:
  sent:              true/false
  post_id:           (X post ID — OK to record, not a secret)
  content_matched:   true/false
  send_count:        1
  loop_detected:     false
  token_exposed:     false
  unexpected_write:  false
  evidence_file:
```

---

## STOP Conditions

STOP immediately if:

- content differs from approved verbatim text
- more than one write occurs
- wrong account posts
- token appears in any output
- retry loop starts
- engagement loop starts (bot replies to its own post)
- rate limit hit during send (stop, do not retry)
- productionReady true appears
- execution enabled appears

---

## Safety

```yaml
productionReady:    false
execution:          disabled
rawValuesReported:  false
token_exposed:      false
write_count_max:    1
xacc_write_go:      not issued
```
