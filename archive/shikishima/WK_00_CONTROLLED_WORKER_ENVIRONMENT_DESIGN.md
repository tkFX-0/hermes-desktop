# WK-00 Controlled Worker Environment Design

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** IMPLEMENTED — display-only UI + docs
**gate:** worker auto-execution remains HOLD

---

## Purpose

Define and implement a safe control layer for Shikishima to assign work to external AI workers (Codex, ClaudeCode) in a controlled, human-mediated environment.

---

## Core Rule

```text
AIは指示書を作るところまで。
鍵と発射ボタンは人間。

Worker assignment is allowed.
Worker auto-execution is HOLD.
```

---

## Current Manual Workflow

```text
1. Human describes a task to Shikishima
2. Shikishima classifies the task (docs / ui / source / audit / push / etc.)
3. Shikishima recommends a worker (ClaudeCode / Codex / Human Gate)
4. Shikishima generates a copy-only prompt
5. Human copies the prompt into ClaudeCode or Codex manually
6. Human brings the result back
7. Shikishima records the result and evidence
```

The human is the bridge between Shikishima and the worker.

---

## Future Controlled Worker Flow (HOLD)

```text
WK-05 (HOLD):
  Shikishima generates task + prompt
  → Worker adapter dispatches automatically
  → Worker executes
  → Result returned to Shikishima
  → Evidence recorded automatically

This requires: remote control / MCP / hooks / daemon
All of which are HOLD gates.
```

---

## Why Direct Auto-execution Is HOLD

1. Remote control can escape the safety boundary if misconfigured
2. MCP and hooks can execute shell commands outside reviewed scope
3. Daemon workers can accumulate state and drift from approved task
4. API token-based execution can trigger unexpected external writes
5. Rate limits and cooldowns are not automatically respected

---

## Current Safe State

```yaml
execution_mode:     copy_only / human_manual
auto_execution:     HOLD
remote_control:     HOLD
mcp:                HOLD
hooks:              HOLD
daemon:             HOLD
api_tokens:         not used
max_autonomy_level: 4 (AI workers)
level_5:            human GO required
```

---

## Worker Environment Map

| Worker | Max Level | Mode | Status |
|---|---|---|---|
| ClaudeCode Local | 4 | copy-only / human manual | READY |
| Codex Worker | 4 | copy-only / human manual | COOLDOWN |
| Human Gate | 5 | human manual | NEEDS_HUMAN |
| Future Adapter | 5 | future_remote_control_hold | HOLD |

---

## Safety

```yaml
productionReady:    false
execution:          disabled
rawValuesReported:  false
worker_auto_launch: HOLD
remote_control:     HOLD
mcp_connected:      false
```
