# Agent Orchestration Local MVP Plan

## Document Status

```text
roadmapVersion: v3.15.0
status: plan_v1
date_created: 2026-05-15
```

## Current State

The 5-agent system is implemented in `src/main/ichikishima/` with:

| Agent | File | Status |
|---|---|---|
| hermes_worker | hermes/ | implemented |
| ichikishima_reviewer | review/ | implemented |
| approval_guardian | approval/ | implemented |
| audit_keeper | audit/ | implemented |
| memory_curator | memory/ | implemented |
| research_agent | (integrated in hermes) | implemented |
| supervisor | orchestrator/ | implemented |

Scheduler: disabled (dry-run policy)

## Dry-Run Verification

The agent team can be verified via:

```text
npm test
```

Tests cover:
- Agent registry
- Task queue
- Agent handoff
- Supervisor logic
- Approval queue
- Audit log
- Memory candidates

## MVP Operation Flow

```text
User message
  ↓
ichikishima-orchestrator.ts (supervisor)
  ↓
hermes_worker (proposes action)
  ↓
ichikishima_reviewer (safety check)
  ↓
approval_guardian (if approval needed)
  ↓
User approves/denies
  ↓
audit_keeper (records result)
  ↓
memory_curator (extracts learnings)
```

## Safety Gates

```text
All agent actions go through autonomy-zone/:
  - read-policy.ts (what can be read)
  - write-policy.ts (what can be written)
  - denylist.ts (forbidden paths)
  - path-guard.ts (path validation)
  - approval-request.ts (escalation to human)
```

## Next Steps

```text
1. B3 Session-009 complete (human observation)
2. Enable scheduler in dry-run review mode
3. Run first supervised agent task
4. Record dry-run evidence
```

---

この範囲では問題を検出していません
