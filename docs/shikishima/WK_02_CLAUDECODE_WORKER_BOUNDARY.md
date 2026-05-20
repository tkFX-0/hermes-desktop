# WK-02 ClaudeCode Worker Boundary

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** DESIGN — docs only

---

## Summary

ClaudeCode is a candidate worker for UI implementation, React/TypeScript, docs, and evidence. Current use is human-mediated copy-only. No automatic ClaudeCode launch by Shikishima.

---

## Current Use: Human-Mediated

```text
1. Shikishima generates a ClaudeCode task prompt
2. Human copies prompt into ClaudeCode CLI or IDE extension manually
3. ClaudeCode implements under human supervision
4. Human reviews result
5. Human brings commit candidate back
6. Human issues push GO separately
```

---

## Allowed (human-mediated, Level 4 max)

- UI component implementation (display-only)
- React / TypeScript source
- docs and evidence record creation
- typecheck / ESLint fixes
- evidence commit candidate preparation

---

## Forbidden (requires separate GO)

- automatic ClaudeCode launch by Shikishima
- shell execution initiated by Shikishima on behalf of user
- MCP server connection by Shikishima
- hooks that execute shell commands (Level 5 guard required)
- daemon or background worker session started by Shikishima
- Claude CLI automation piped from Shikishima
- push / runtime / external connection without human GO

---

## Level 5 Remains Human GO

```text
Level 5 actions remain HOLD for ClaudeCode as worker:
  - git push
  - runtime start
  - OAuth
  - external API write
  - x_search
  - Discord reply
  - X post
  - Hermes/WSL connection
  - Command Chat real send
```

---

## Future Gates (HOLD)

| Gate | Status |
|---|---|
| hooks for shell execution | HOLD |
| MCP server connection | HOLD |
| daemon worker session | HOLD |
| Claude CLI automation | HOLD |

---

## Safety

```yaml
productionReady:         false
execution:               disabled
rawValuesReported:       false
claudecode_auto_launch:  HOLD
mcp_connected:           false
hooks_shell_exec:        HOLD
daemon_session:          HOLD
```
