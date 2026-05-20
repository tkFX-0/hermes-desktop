# DIS-03 Discord Human GO Reply Plan

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** HOLD — Level 5, DIS-03 reply GO required
**gate:** explicit dis03_reply_go form required

---

## Summary

HOLD until explicit DIS-03 reply GO.

One approved message. One approved channel. Once only.
Level 5 — Discordへの返信は外部サービスへの書き込みである。

---

## Gate Level

**Level 5**

Reason: Discord send is an external service write operation.
Every send requires a separate explicit human GO.

---

## Allowed After GO

- send exactly one approved message
- to exactly one approved channel
- with exactly the approved content
- once only per GO

---

## Forbidden

- send repeated messages
- hidden retry loop
- reply to DMs
- mention @everyone or @here
- send to other channels
- edit or delete messages
- react with emoji
- follow-up messages without a new DIS-03 GO
- autonomous replies of any kind
- external API write beyond the single approved Discord send
- enable productionReady
- enable execution

---

## Required GO Fields

```text
dis03_reply_go:
  date:
  time_window_jst:
  approved_server_id:
  approved_channel_id:
  exact_message_content:     (verbatim — no deviation allowed)
  allowed_send_count:        1
  dry_run_completed:         true/false
  stop_if:
  rollback_or_disable:       (how to disable bot send)
  evidence_file:
```

All fields must be filled. `exact_message_content` is verbatim — the bot sends exactly this text.

---

## Pre-Send Checklist

Before executing DIS-03:

- [ ] DIS-01 PASS
- [ ] DIS-02 draft reviewed by human
- [ ] exact message content approved
- [ ] server ID confirmed
- [ ] channel ID confirmed
- [ ] bot has Send Messages permission in that channel only
- [ ] kill switch / disable path known
- [ ] evidence file path set

---

## Post-Send Record

After executing DIS-03:

```text
dis03_result:
  sent:              true/false
  message_id:        (not raw token — Discord message ID is OK to record)
  channel_confirmed: true/false
  content_matched:   true/false
  send_count:        1
  loop_detected:     false
  token_exposed:     false
  unexpected_send:   false
  evidence_file:
```

---

## STOP Conditions

STOP immediately if:

- message content differs from approved verbatim text
- more than one send occurs
- wrong channel receives the message
- wrong server
- bot replies to its own message
- bot replies to another bot's message
- retry loop starts
- token appears in any output
- unexpected permission request appears
- productionReady true appears
- execution enabled appears

---

## Safety

```yaml
productionReady:    false
execution:          disabled
rawValuesReported:  false
token_exposed:      false
send_count_max:     1
dis03_go_issued:    false
```
