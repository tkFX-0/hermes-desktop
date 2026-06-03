# WK-03 Worker Task Queue Plan

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** DESIGN + display-only implementation

---

## Task States

| Status | Meaning |
|---|---|
| READY | Task can be picked up by recommended worker |
| BUSY | Worker is currently handling this task |
| COOLDOWN | Worker has rate/cooldown restriction |
| DEGRADED | Worker operating at reduced capacity |
| BLOCKED | Waiting on dependency or gate |
| FAILED | Task ended with error |
| NEEDS_HUMAN | Requires explicit human action before proceeding |
| HOLD | Gate not yet open — requires separate GO |

---

## Worker Assignment

Each task is assigned to:

```text
recommended_worker: claude_code / codex / human / future
execution_mode:     copy_only / human_manual / future_remote_control_hold
autonomy_level:     1-4 for AI workers / 5 for human gate
```

Tasks at Level 5 always route to Human Gate.

---

## Status Transitions

```text
READY → BUSY (worker starts)
BUSY → READY (task complete, worker free)
BUSY → COOLDOWN (rate limit hit)
BUSY → NEEDS_HUMAN (requires human decision mid-task)
BUSY → FAILED (error)
COOLDOWN → READY (cooldown expires, human confirms)
BLOCKED → READY (dependency resolved)
HOLD → READY (gate opened by human GO)
```

No auto-retry. No auto-escalation to Level 5.

---

## Evidence Requirements

Every completed task must produce:

```text
- result summary
- changed files (if any)
- safety checklist (productionReady / execution / rawValues)
- human review confirmation
- evidence file path
```

---

## Resume Behavior

```text
- paused tasks resume only with human confirmation
- no auto-resume after cooldown
- no auto-retry after failed
- HOLD tasks remain HOLD until explicit GO
```

---

## Safety

```yaml
productionReady:    false
execution:          disabled
auto_retry:         false
auto_escalation:    false
level5_auto:        false
```
