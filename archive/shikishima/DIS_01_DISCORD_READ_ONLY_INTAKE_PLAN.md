# DIS-01 Discord Read-Only Intake Plan

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** HOLD — DIS-01 read-only GO required
**gate:** explicit dis01_read_only_go form required

---

## Summary

HOLD until explicit DIS-01 read-only GO.

Allow Shikishima to read user instructions from one approved Discord channel.
No replies. No DMs. No writes.

---

## Allowed

- read messages from one approved channel
- read only messages from approved user ID if configured
- summarize user intent
- create local draft/queue entry
- create evidence record

---

## Forbidden

- send messages
- reply to any message
- send DMs
- react with emoji
- delete messages
- edit messages
- pin messages
- mention anyone
- use @everyone or @here
- access other channels
- read private channels unless explicitly approved
- start continuous polling without time_window approval
- expose token or token fragments
- enable productionReady
- enable execution

---

## Required GO Fields

```text
dis01_read_only_go:
  date:
  time_window_jst:
  discord_server_id:
  approved_channel_id:
  approved_user_id:          (optional, tk or named user)
  read_count_or_range:
  allowed_run_count:         1
  evidence_file:
  stop_conditions:
```

All fields must be filled before DIS-01 proceeds.

---

## Initial Permission Policy

Recommended bot/channel permissions (Send Messages OFF at DIS-01):

| Permission | DIS-01 |
|---|---|
| View Channel | ON |
| Read Message History | ON |
| Send Messages | OFF |
| Manage Messages | OFF |
| Manage Channels | OFF |
| Mention Everyone | OFF |
| Administrator | OFF |
| DM Users | OFF |

Send Messages is enabled only after a separate DIS-03 GO.

---

## Gateway Intent Requirements

Required intents (read-only):
- GUILDS
- GUILD_MESSAGES
- MESSAGE_CONTENT (privileged — must be enabled in Discord Developer Portal)

MESSAGE_CONTENT is a privileged intent. It must be:
- enabled in bot settings at Discord Developer Portal
- declared in the gateway connection
- not used for writes

If MESSAGE_CONTENT is unavailable, DIS-01 cannot read message body text.
STOP and report if content cannot be accessed without escalated permissions.

---

## STOP Conditions

STOP immediately if:

- bot requires Send Messages permission before DIS-03 GO
- token appears in any output, log, or display
- unexpected channel is accessed
- DM access occurs
- bot sends any message
- polling loops start unexpectedly
- MESSAGE_CONTENT is unavailable and workaround requires escalated permission
- productionReady true appears
- execution enabled appears

---

## Safety

```yaml
productionReady:    false
execution:          disabled
rawValuesReported:  false
token_created:      false
discord_connected:  false
message_sent:       false
dis01_go_issued:    false
```
