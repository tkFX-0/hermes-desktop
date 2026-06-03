# Discord Bridge STOP Conditions

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** DESIGN — policy document only

---

## Universal STOP Conditions

STOP immediately (any phase) if any of the following occurs:

### Token

```text
- token appears in any chat, log, output, screenshot, or doc
- token fragment appears
- token is printed by bot process
```

### Permission Escalation

```text
- bot requests Administrator permission
- bot requests Manage Guild, Manage Channels, or Manage Roles
- bot requests Mention Everyone
- bot requests any permission not in the approved list
```

### Unexpected Access

```text
- bot can see a channel not in the approved list
- bot accesses DMs
- bot accesses private channels
- bot responds in wrong server
```

### Unauthorized Send

```text
- bot sends a message without DIS-03 GO
- bot sends more than approved count
- wrong channel receives message
- wrong server receives message
- message content differs from approved verbatim text
```

### Loop Detection

```text
- bot replies to its own message
- bot replies to another bot
- retry loop starts
- polling loop cannot be stopped
- message rate exceeds expected
```

### Data Safety

```text
- rawValues (tokens, credentials, local paths) appear in output
- secret / credential is printed in log
- @everyone or @here appears in bot output
```

### System Safety

```text
- productionReady true appears in any context
- execution enabled appears in any context
- OAuth/login flow starts unexpectedly
- external API write path expands beyond approved scope
- git status changes unexpectedly (unintended file modification)
```

---

## Required Actions After STOP

```text
1. Disconnect or stop bridge process if running
2. Record incident in evidence (without secrets)
3. Keep Level 5 HOLD — do not retry automatically
4. Do not rotate token unless exposure is confirmed
5. Report STOP reason in final report
6. Wait for human GO before restarting
```

---

## Phase-Specific STOP Additions

### DIS-01 STOP additions

```text
- MESSAGE_CONTENT unavailable and no approved workaround
- bot begins polling outside approved time window
- bot receives message from unapproved user and acts on it
```

### DIS-03 STOP additions

```text
- send count exceeds 1
- message content deviates by even one character from approved text
- send occurs after time window expires
- kill switch / disable path fails
```

---

## Safety

```yaml
productionReady:    false
execution:          disabled
rawValuesReported:  false
```
