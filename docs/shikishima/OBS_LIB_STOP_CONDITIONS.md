# OBS-LIB Stop Conditions

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** DESIGN — policy document

---

## Universal STOP Conditions

STOP immediately if any of the following occurs:

### Path / Secret Safety

```text
- raw local path appears in evidence, chat, logs, or UI
- token/secret/API key appears in any export content
- raw IP address appears
- personal PII of third parties appears
```

### Write Safety

```text
- export attempts to write outside configured vault_root
- file overwrite occurs without confirmation
- automatic background write loop starts
- write runs without explicit user action
- write count exceeds approved count
```

### Cloud / External

```text
- external/cloud sync starts unexpectedly
- Obsidian Sync, iCloud, Google Drive sync activates
- export sends content to external API
- x_search, Discord, X, Hermes, Command Chat action starts
```

### System Safety

```text
- productionReady true appears
- execution enabled appears
- rawValuesReported becomes true
- new package install starts
- npm run dev starts
- push occurs without explicit GO
```

---

## Required Actions After STOP

```text
1. Stop any pending export operation
2. Record incident without raw paths or tokens
3. Keep OB-01 write gate HOLD
4. Do not retry automatically
5. Report STOP reason
6. Wait for human GO before any retry
```

---

## Safety

```yaml
productionReady:    false
execution:          disabled
rawValuesReported:  false
```
