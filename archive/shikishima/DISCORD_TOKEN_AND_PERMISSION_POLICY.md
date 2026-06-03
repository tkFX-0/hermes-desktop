# Discord Token and Permission Policy

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** DESIGN — policy document only, no token created
**gate:** HOLD — no token until DIS-01 GO is issued

---

## Token Is Secret

The Discord bot token must never appear in:

```text
NEVER:
  - chat messages
  - Claude Code conversation
  - committed files
  - screenshots
  - logs
  - evidence docs
  - README or docs
  - shell history (if visible)
  - test output
  - error messages
```

If a token is accidentally exposed in any of the above, rotate it immediately.

---

## Token Storage Policy

Allowed future options (not yet activated):

```text
1. Local ignored file:
   e.g. .discord-token.local (must be in .gitignore)
   content: token only, no other secrets
   readable by: local process only

2. Environment variable:
   e.g. DISCORD_BOT_TOKEN
   set in terminal session only
   not exported to child processes unnecessarily

3. OS secret manager:
   if separately approved (not currently approved)
```

Forbidden storage:

```text
FORBIDDEN:
  - committed config files
  - docs/ directory
  - README.md
  - chat logs
  - screenshots
  - shell history exports
  - package.json
  - any tracked file
```

---

## Minimum Permission Policy

### DIS-01: Read-only intake

Bot permissions:

| Permission | Value |
|---|---|
| View Channel | ON |
| Read Message History | ON |
| Send Messages | OFF |
| Manage Messages | OFF |
| Manage Channels | OFF |
| Mention Everyone | OFF |
| Administrator | OFF |
| Direct Messages | OFF |

### DIS-03: Human GO reply (single test)

Add only in approved channel, only when DIS-03 GO is issued:

| Permission | Value |
|---|---|
| Send Messages | ON (approved channel only) |

All other permissions remain OFF.

### Always Forbidden (all phases)

```text
Administrator
Manage Guild
Manage Channels
Manage Roles
Ban Members
Kick Members
Manage Webhooks
Mention Everyone
Create Instant Invite
View Audit Log
```

---

## Channel Restriction

```text
allowed_server:    1 (exact server ID)
allowed_channel:   1 (exact channel ID, e.g. #shikishima-control)
allowed_user_id:   tk only, or explicitly named user
dm:                forbidden
other_channels:    forbidden
wildcard:          forbidden
server_scan:       forbidden
```

The bot must never read or write to any channel except the one approved channel.

---

## Message Content Intent

MESSAGE_CONTENT is a privileged intent. Requirements:

```text
- enable in Discord Developer Portal → Bot → Privileged Gateway Intents
- declare GUILD_MESSAGE_CONTENT in gateway connection
- required for DIS-01 to read message body text
```

If MESSAGE_CONTENT is unavailable:
- STOP and report
- do not use slash command workarounds without separate GO

---

## Token Rotation Policy

Rotate token immediately if:

```text
- token appears in any chat/log/commit/screenshot
- bot behavior is unexpected and token may be compromised
- token was used in a scope beyond the approved channel
- token file was accidentally staged or committed
```

After rotation:
- update local token storage only
- do not commit new token
- record rotation date in evidence (not the token itself)

---

## Safety

```yaml
productionReady:    false
execution:          disabled
rawValuesReported:  false
token_created:      false
token_stored:       false
token_committed:    false
```
