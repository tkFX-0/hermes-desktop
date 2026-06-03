# XS-AUTO-04 Stop Conditions

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** DESIGN — policy document only

---

## Universal STOP Conditions

STOP immediately (any XS-AUTO phase) if any of the following occurs:

### Authentication / Token

```text
- login / OAuth prompt appears unexpectedly
- token or credential appears in any output, log, or doc
- token fragment appears in any context
```

### Write Actions

```text
- post, reply, DM, like, follow, retweet, delete is triggered
- any account mutation occurs
- account profile or settings change
```

### Data Safety

```text
- private or hidden content appears unexpectedly
- user PII appears in raw form in any output
- rawValuesReported becomes true
```

### Polling / Loop

```text
- repeated polling starts unexpectedly
- polling loop cannot be stopped
- API calls exceed approved run count
- rate limit hit and auto-retry begins
```

### Rate Limit

```text
- HTTP 429 received
- stop immediately
- do not retry without human GO
- mark watchlist item COOLDOWN
```

### System Safety

```text
- productionReady true appears
- execution enabled appears
- source requests private content to proceed
- external write path appears
- git status changes unexpectedly (unintended file modification)
```

---

## Required Actions After STOP

```text
1. Stop all x_search calls immediately
2. Record incident in evidence (without tokens or raw credentials)
3. Keep gate HOLD — do not retry automatically
4. Report STOP reason in final report
5. Wait for human GO before any retry
6. If token exposed: rotate immediately
```

---

## Phase-Specific STOP Additions

### XS-AUTO-03 (one-shot scheduled run)

```text
- run count exceeds approved count
- time window expires and run is still active
- evidence file path is unavailable
```

### XS-AUTO-04 (recurring patrol)

```text
- review checkpoint missed
- run count exceeds max without human confirmation
- result quality degraded (garbage output, unreachable sources)
- cooldown extends past scheduled window
```

---

## Safety

```yaml
productionReady:    false
execution:          disabled
rawValuesReported:  false
```
