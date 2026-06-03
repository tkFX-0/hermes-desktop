# Shikishima Future Implementation Task Order — 2026-05-24

## Purpose

Master Design を実装可能な順番に分解する。

This document is a planning artifact only.

```text
implementation_started: false
runtime_started: false
external_action_performed: false
productionReady: false
execution: disabled
```

## Priority Order

### 1. Registry / Policy Foundation

Worker:

```text
ClaudeCode
```

Files to create:

```text
src/main/shikishima-core/model-assignment-registry.ts
src/main/shikishima-core/profile-policy.ts
src/main/shikishima-core/response-policy.ts
src/main/shikishima-core/operation-ledger-types.ts
```

Tests:

```text
tests/shikishima-model-assignment.test.ts
tests/shikishima-profile-policy.test.ts
tests/shikishima-response-policy.test.ts
```

Acceptance:

```text
all agents have one canonical model assignment
profile correction priority is defined
StackChan spoken_response is separate from full_response
```

### 2. Profile Correction Fix

Goal:

```text
User correction applies across Shikishima, Discord, StackChan, sidebot, and Agent Theater.
```

Implementation:

```text
add profile correction store
add final ProfileComplianceCheck
add forbidden phrase tests
```

Acceptance:

```text
if human marks phrase as forbidden, no response path may emit it
```

### 3. StackChan Response Split

Goal:

```text
StackChan receives only curated spoken_response.
```

Implementation:

```text
full_response for UI
spoken_response for StackChan
speech_policy for permission
StackChan speech remains HOLD unless GO ticket exists
```

Acceptance:

```text
raw full_response cannot reach stackchanSayLocal
errors are never spoken raw
speech max length is enforced
```

### 4. Operation Ledger

Goal:

```text
All external/device/autonomous actions leave one record.
```

Implementation:

```text
operation ledger schema
write candidate in dry-run
gate restored HOLD field
redacted summaries
```

Acceptance:

```text
Discord send, Obsidian write, StackChan speak, x_search, runtime all require ledger candidate
```

### 5. Automation Contract

Goal:

```text
Sidebot, research watcher, schedules, and autonomous loops become declared contracts.
```

Implementation:

```text
automation contract model
max run count
max duration
stop conditions
evidence path
read-only/write classification
```

Acceptance:

```text
background daemon cannot start without contract
retry loop cannot run without cap
```

### 6. Realtime Gate Unification

Goal:

```text
Read, draft, write, device, and continuous modes are separated.
```

Implementation:

```text
realtime source registry
one-shot window model
continuous monitoring default HOLD
camera/mic privacy policy
```

Acceptance:

```text
continuous camera/mic stays HOLD
one-shot StackChan voice can be prepared but not executed without GO
```

### 7. FX Chihaya Upgrade

Goal:

```text
FX agent produces useful thesis and risk output without trade execution.
```

Implementation:

```text
FX output schema
direction bias labels
risk calculator integration
position intent draft
no trade execution guard
```

Acceptance:

```text
trade_execution is always false
AI position intent is clearly a thesis, not an order
```

### 8. Agent Debate Mode

Goal:

```text
Multi-agent disagreement and synthesis become visible.
```

Implementation:

```text
debate session type
agent position records
conflict/resolution summary
human decision gate
Agent Theater debate panel
```

Acceptance:

```text
debate mode ends in recommendation, not execution
```

## Push / Runtime Rules

Every implementation task must end with:

```text
npm run typecheck:node if main source changed
npm run typecheck:web if renderer source changed
targeted tests
git status --short
push readiness review
```

Forbidden without separate GO:

```text
git push
runtime start
StackChan speech/motion/camera
Discord send/read
Obsidian write
x_search
OAuth
Hermes/WSL live execution
productionReady true
execution enabled
```

## Suggested First GO

```text
ClaudeCode Task:
Add Shikishima registry and policy foundation.
Implement types and tests only.
Do not wire live execution paths yet.
Do not start runtime.
Do not push.
```
