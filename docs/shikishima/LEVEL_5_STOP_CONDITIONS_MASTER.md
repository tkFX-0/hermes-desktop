# Level 5 Stop Conditions Master

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** MASTER DOCUMENT — applies to all Level 5 operations

---

## Universal STOP Conditions

STOP immediately for any Level 5 operation if:

### Credential / Secret

```text
- raw token appears in any output, log, doc, or screenshot
- password appears in any context
- API key appears
- secret appears
- raw local path (C:\Users\...) appears in evidence or log
```

### Scope Violation

```text
- productionReady true appears unexpectedly
- execution enabled appears unexpectedly
- external write occurs without GO
- OAuth starts without GO
- wrong destination / channel / account is used
- action scope expands beyond GO form specification
```

### Loop Detection

```text
- repeated polling starts unexpectedly
- hidden retry loop begins
- auto-restart loop starts
- background daemon remains running after task completes
- worker launches automatically without GO
- send count exceeds approved count
```

### Physical / Hardware

```text
- StackChan moves unexpectedly
- voice / mic / camera activates unexpectedly
- physical robot action occurs without explicit motion GO
```

### System State

```text
- git status changes unexpectedly (untracked files staged, tracked files dirtied)
- package.json changes unexpectedly
- lockfile changes
- token file created without explicit approval
```

---

## Required Actions After STOP

```text
1. Stop the running process immediately
   (Ctrl+C, kill process, disconnect, or revoke token)

2. Do not retry automatically
   Wait for explicit human GO before any retry

3. Record incident in evidence
   Without including tokens, raw paths, or secrets
   Format: what happened / what was stopped / what state was left

4. Keep Level 5 HOLD
   The gate that was open closes immediately on STOP

5. Preserve evidence
   Do not delete or overwrite the incident record

6. Report to human
   Human decides whether to:
   a. Fix and retry (new GO required)
   b. Abandon this gate (stays HOLD permanently until rescheduled)
   c. Escalate (rare, for unexpected system behavior)
```

---

## Gate-Specific STOP Additions

### Obsidian local write

```text
- target path outside vault_root
- rawValues found in content before write
- overwrite of existing file
- cloud sync starts
```

### Discord (DIS-01/DIS-03)

```text
- bot sends message without DIS-03 GO
- bot replies to its own message (loop)
- bot accesses wrong channel
- token appears in output
- MESSAGE_CONTENT unavailable without workaround
```

### HB-01 Hermes/WSL

```text
- WSL process cannot be stopped
- unexpected network connection from WSL
- token/env contents appear in output
- command scope expands beyond approved list
```

### CC-03 Command Chat

```text
- send loop detected
- wrong endpoint
- API response contains unexpected data
- message content deviates from approved
```

### X account (XACC)

```text
- write scope requested during read-only phase
- post/reply/DM/like/follow without write GO
- rate limit hit (HTTP 429) — stop, no retry
- token appears
```

### StackChan

```text
- unexpected physical movement
- connection to wrong device
- serial port accessed without approval
```

---

## Safety

```yaml
productionReady:    false
execution:          disabled
rawValuesReported:  false
```
