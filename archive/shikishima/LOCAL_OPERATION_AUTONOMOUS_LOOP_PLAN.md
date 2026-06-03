# Local Operation Autonomous Loop Plan

## Document Status

```text
roadmapVersion: v3.7.0
status: plan_only
execution: disabled
productionReady: false
date_created: 2026-05-14
```

## Purpose

This document defines the autonomous loop pattern for safe repeated local
app observations.

It is a plan document only. Each loop iteration still requires the current
state to be inside the approved scope. The loop does not bypass GO gates.

## Allowed Autonomous Loop Pattern

Each loop iteration follows this sequence:

```text
Step 1: inspect current repo/doc state
  - read HEAD, origin/main, commits_ahead
  - read staged_files, actual_content_diff_files
  - confirm local binary exists

Step 2: classify next safe child task
  - check if valid GO exists for execution steps
  - if no valid GO: stop at gate and return next required human action
  - if valid GO: proceed to approved execution step only

Step 3: run only approved read-only checks or approved execution (if GO exists)
  - read-only: git log, doc read, Test-Path
  - execution: only with valid GO and concrete time_window

Step 4: create docs-only evidence or proposal if needed
  - record redacted evidence
  - do not include raw values

Step 5: commit docs-only changes if explicitly in scope
  - stage only approved files
  - create one commit per child task

Step 6: stop before any new approval boundary
  - stop at: new GO required, time_window expired, stop condition triggered
  - do not continue past missing GO

Step 7: return next required human action
  - report what happened, what was recorded, what is next
```

## Forbidden Autonomous Loop Pattern

```text
- Continue past a missing GO
- Run app without time_window GO
- Install dependencies
- Use npx or npm install / update / exec
- Change source code without separate approval
- Change package files without separate approval
- Enable execution
- Set productionReady true
- Push without explicit push GO
- Treat observation as production
- Treat Local MVP as Final 100%
- Autonomously decide time_window
- Autonomously issue GO
```

## Loop Termination Conditions

The loop stops when any of the following occurs:

```text
- A GO gate is reached without a valid GO
- A stop condition is triggered during execution
- time_window expires
- working tree becomes unexpectedly dirty
- A forbidden scope is encountered
- Local binary is missing
- Human intervention is required
```

## Loop Output Per Iteration

Each iteration returns:

```text
iteration: [number]
step_reached: [last completed step]
status: PASS / HOLD / STOP
actions_taken: [list of read-only checks or docs created]
stop_reason: [if stopped]
next_required_human_action: [what the human needs to do next]
```

## Safety Boundary

```text
decision: HOLD
execution: disabled (except within valid Local App Observation GO)
productionReady: false
rawValuesReported: false
robotMotion: HOLD
Level 3: not approved
autonomous_push: not approved
autonomous_go_issuance: not approved
autonomous_time_window_decision: not approved
```
