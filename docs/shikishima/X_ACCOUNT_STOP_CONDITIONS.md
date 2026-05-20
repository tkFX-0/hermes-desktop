# X Account Stop Conditions

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** DESIGN — policy document only

---

## Universal STOP Conditions

STOP immediately (any phase) if any of the following occurs:

### Credential Safety

```text
- X password is requested or entered anywhere
- token appears in chat, log, doc, screenshot, or committed file
- token fragment appears in output
- token is printed by any process
```

### Scope Escalation

```text
- write scope is requested during read-only phase (XACC-01/02)
- OAuth requests more scopes than approved
- API response indicates unexpected granted scopes
```

### Unauthorized Write

```text
- post is sent without XACC-04 GO
- reply is sent without XACC-04 GO
- DM, like, follow, or retweet occurs without explicit GO
- account profile or settings are mutated
- post/reply count exceeds approved count
- content differs from approved verbatim text
```

### Loop Detection

```text
- bot replies to its own post
- engagement loop starts (post → reply → reply chain)
- polling loop cannot be stopped
- API calls exceed expected run count
- rate limit hit and retry begins automatically
```

### Rate Limiting

```text
- HTTP 429 received — STOP, do not retry without human GO
- unexpected rate limit message appears
```

### Data Safety

```text
- rawValues (tokens, credentials, private data) appear in output
- private posts of third parties are accessed unexpectedly
- user data is stored beyond evidence scope
```

### System Safety

```text
- productionReady true appears in any context
- execution enabled appears in any context
- git status changes unexpectedly
- external API write expands beyond approved scope
```

---

## Required Actions After STOP

```text
1. Stop API calls immediately
2. Revoke token if exposure is confirmed
3. Record incident in evidence (without secrets or token)
4. Keep Level 5 HOLD — do not retry automatically
5. Report STOP reason in final report
6. Wait for human GO before any retry
```

---

## Phase-Specific STOP Additions

### XACC-01 STOP additions

```text
- OAuth starts without explicit GO
- write scope is included in the OAuth request
- callback URL is unreachable and workaround requires escalated scope
```

### XACC-02 STOP additions

```text
- read results include unexpected private data
- source attribution is unclear or unsupported
- repeated polling runs without approval
```

### XACC-04 STOP additions

```text
- send count exceeds 1
- any character in content differs from approved text
- send occurs after time window expires
- rollback / delete path is unavailable
```

---

## Safety

```yaml
productionReady:    false
execution:          disabled
rawValuesReported:  false
```
