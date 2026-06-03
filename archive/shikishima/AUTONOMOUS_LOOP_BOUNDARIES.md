# Autonomous Loop Boundaries

## Document Status

```text
roadmapVersion: v3.8.0
status: boundaries_only
execution: disabled
productionReady: false
date_created: 2026-05-14
```

## Purpose

This document defines what an autonomous assistant loop may and may not do
during Practical Local MVP Operation.

## Allowed Autonomous Loop Actions

The assistant may autonomously:

```text
allow_1:  Read approved docs and evidence records
allow_2:  Summarize evidence from previous observation sessions
allow_3:  Compare current evidence against previous evidence for regressions
allow_4:  Generate the next docs-only task based on current state
allow_5:  Recommend STOP when a boundary is reached
allow_6:  Recommend human review when evidence needs acceptance
allow_7:  Prepare draft checklists or evidence templates
allow_8:  Prepare draft reports for human review
allow_9:  Check git state (branch, HEAD, staged count, diff count)
allow_10: Check local binary existence (Test-Path only)
allow_11: Create docs-only files and commits within approved scope
allow_12: Update roadmap and status docs within approved scope
```

## Forbidden Autonomous Loop Actions

The assistant must NOT autonomously:

```text
forbid_1:  Run the app without a valid explicit human GO
forbid_2:  Execute commands without an explicit human GO
forbid_3:  Push to remote without an explicit push GO
forbid_4:  Edit src / tests / package without separate explicit approval
forbid_5:  Install dependencies (npm install / npx / npm exec)
forbid_6:  Use npx for any purpose
forbid_7:  Enable execution state
forbid_8:  Set productionReady true
forbid_9:  Approve Level 3
forbid_10: Operate robot / StackChan / device
forbid_11: Start voice / camera / mic
forbid_12: Expose raw / local-only values in any output
forbid_13: Decide or fill a time_window on behalf of the human
forbid_14: Issue a GO on behalf of the human
forbid_15: Infer GO from context or intent (GO must be explicit)
forbid_16: Continue past a GO gate without a valid GO
forbid_17: Deploy or trigger Cloudflare / external services
forbid_18: Use WSL / Hermes / wrapper
```

## Level B3 Specific: Allowed Autonomous Actions

Under Level B3 Practical Local MVP Operation, the assistant may additionally:

```text
b3_allow_1: Prepare session checklist using LOCAL_MVP_DAILY_CHECK_TEMPLATE.md
b3_allow_2: Compare current evidence to previous session evidence for regressions
b3_allow_3: Summarize STOP causes from evidence records (category only)
b3_allow_4: Generate docs-only remediation task if issue detected
b3_allow_5: Recommend human GO wording for next session
b3_allow_6: Prepare operation evidence draft for human review
b3_allow_7: Generate session_id for next session
```

## Level B3 Specific: Forbidden Autonomous Actions

Under Level B3, the assistant must still NOT:

```text
b3_forbid_1: Choose or fill time_window for any session
b3_forbid_2: Issue GO for any session
b3_forbid_3: Run app without explicit session GO
b3_forbid_4: Push without explicit push GO
b3_forbid_5: Enable execution state
b3_forbid_6: Set productionReady true
b3_forbid_7: Approve Level 3
b3_forbid_8: Operate robot / voice / device
b3_forbid_9: Expose raw or local-only values in any output
```

## Loop Gate Rules

At each step, the assistant must check:

```text
gate_check_1: Is the next action inside the allowed scope?
  → yes: proceed
  → no: STOP, return reason, request human action

gate_check_2: Is there a valid explicit human GO for execution steps?
  → yes: may proceed to execution within approved scope
  → no: skip execution, continue docs-only work

gate_check_3: Is the working tree clean (staged=0, diff=0)?
  → yes: safe to proceed
  → no: STOP, report, wait for human

gate_check_4: Is the time_window (if applicable) valid and not expired?
  → yes: proceed within window
  → no: STOP, request new GO

gate_check_5: Has any stop condition been triggered?
  → no: continue
  → yes: STOP immediately, record category, report
```

## Loop Output Contract

Each loop iteration must return:

```text
iteration: [number]
actions_taken: [list — docs read, files created, checks run]
gate_checks_passed: [list]
stopped_at: [step name if stopped, or: none]
stop_reason: [reason if stopped, or: n/a]
commits_created: [hash and subject if any, or: none]
next_recommended_action: [docs task or human action request]
safety_boundary_confirmed: [HOLD / disabled / false — all three]
```

## Safety Boundary

```text
decision: HOLD
execution: disabled (except within valid Local App Observation GO)
productionReady: false
rawValuesReported: false
robotMotion: HOLD
Level 3: not approved
autonomous_time_window_decision: not allowed
autonomous_go_issuance: not allowed
autonomous_push: not allowed
```
