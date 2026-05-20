# DIS-00 Discord Bridge Gate Design

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** DESIGN — docs only, no token, no bot, no connection
**gate:** HOLD — DIS-01 GO required for any action

---

## Purpose

Discord Bridge is a future gate that lets the user send instructions to Shikishima through one approved Discord room/channel.

Shikishima may:
- read instructions after approval
- summarize intent
- classify GO / HOLD / DEFER
- prepare draft replies
- record evidence

Shikishima must not:
- send Discord messages without human GO
- reply to DMs
- mention everyone/here
- mutate accounts or channels
- run autonomous loops
- expose tokens
- enable productionReady
- enable execution

---

## Core Rule

```text
Discordは便利だが外部サービスである。
読むだけでもGate管理。
書き込みはLevel 5。

AIは作るところまで。
鍵と発射ボタンは人間。
```

---

## Required Phases

### DIS-00: Design only (this document)

```yaml
token:       none
bot:         not created
connection:  none
package:     not installed
runtime:     not started
git_push:    not performed
```

### DIS-01: Read-only intake

```yaml
purpose:     read user instructions from one approved channel
send:        forbidden
level:       5-ish (external read)
gate:        DIS-01 read-only GO required
```

### DIS-02: Draft response

```yaml
purpose:     prepare reply draft locally — no Discord write
level:       1-4
gate:        no Discord write, Level 1-4 candidate after DIS-01
```

### DIS-03: Human GO reply

```yaml
purpose:     send one approved message to one approved channel
level:       5
gate:        DIS-03 reply GO required
send_count:  1 per GO
exact_message: human-approved content only
```

### DIS-04: Limited auto-reply

```yaml
purpose:     future candidate (定型文 only)
level:       5+
status:      DEFERRED — not approved
```

---

## Architecture (design-only)

```text
Discord → (Gateway read) → DIS-01 intake
  → local message queue
  → DIS-02 draft response (local only)
  → human review
  → human GO
  → DIS-03 one-shot reply (external write, Level 5)
```

No implementation exists. This is design documentation only.

---

## Gate Sequence

| Gate | Action | Level | Status |
|---|---|---|---|
| DIS-00 | Design docs | docs | DESIGN (this doc) |
| DIS-01 | Read channel | 5-ish | HOLD |
| DIS-02 | Draft locally | 1-4 | HOLD (after DIS-01) |
| DIS-03 | Send reply | 5 | HOLD |
| DIS-04 | Auto reply | 5+ | DEFERRED |

Each gate requires a separate explicit human GO.

---

## Channel Restriction Policy

```text
allowed_server:    1 (exact server ID, to be set at DIS-01 GO)
allowed_channel:   1 (exact channel ID, e.g. #shikishima-control)
allowed_user_id:   tk only, or named approved user
dm:                forbidden
other_channels:    forbidden
wildcard:          forbidden
server_scan:       forbidden
```

---

## Token Policy

See `DISCORD_TOKEN_AND_PERMISSION_POLICY.md`.

Summary:
- token never appears in chat, logs, docs, screenshots, or commits
- stored only in local ignored file or environment variable
- rotate immediately if exposed

---

## STOP Conditions

See `DISCORD_BRIDGE_STOP_CONDITIONS.md`.

---

## Safety

```yaml
productionReady:    false
execution:          disabled
rawValuesReported:  false
token_created:      false
discord_connected:  false
message_sent:       false
bot_created:        false
```
