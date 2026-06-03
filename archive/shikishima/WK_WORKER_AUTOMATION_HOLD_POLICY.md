# WK Worker Automation HOLD Policy

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** DESIGN — HOLD policy document

---

## What Remains HOLD

The following capabilities are not approved and must not be implemented without explicit human GO per gate:

### Codex / ClaudeCode Direct Launch

```text
HOLD:
  - Codex auto-launch (any mode)
  - ClaudeCode auto-launch
  - worker process spawning by Shikishima
  - scheduled worker start
```

### Remote Control

```text
HOLD:
  - Codex Remote Control
  - any remote shell execution
  - headless worker session
  - SSH or remote tunnel to worker
```

### MCP (Model Context Protocol)

```text
HOLD:
  - MCP server connection
  - MCP tool execution
  - MCP resource access
  - MCP resource modification
```

### Hooks

```text
HOLD:
  - hooks that execute shell commands
  - hooks that trigger file writes outside approved scope
  - hooks that call external APIs
  - event-triggered auto-execution hooks
```

### Daemon / Background Session

```text
HOLD:
  - background worker daemon
  - persistent session manager
  - auto-restart policy for workers
  - unattended worker loop
```

### API Token Worker Execution

```text
HOLD:
  - API-token based worker dispatch (OpenAI / Anthropic)
  - direct API call from Shikishima to worker providers
  - programmatic worker session management
```

### Level 5 Actions

```text
HOLD:
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

## Required Conditions Before Future GO

Before any automation gate above can open:

1. Explicit human GO with named gate (WK-05, WK-06, WK-07)
2. Exact scope defined (no wildcards)
3. Stop conditions defined
4. Evidence file path set
5. Rollback / disable path confirmed

---

## Safety

```yaml
productionReady:    false
execution:          disabled
rawValuesReported:  false
all_automation:     HOLD
```
