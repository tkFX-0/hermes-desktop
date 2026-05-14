# Local MVP Session Protocol

## Document Status

```text
roadmapVersion: v3.11.0
status: protocol_only
date_created: 2026-05-14
```

## Purpose

This document defines the step-by-step session flow and states for each
Practical Local MVP Operation session.

## Session States

```text
READY_FOR_SESSION
  → pre-session checks complete, awaiting GO

SESSION_APPROVED
  → valid explicit GO received with concrete time_window

SESSION_RUNNING
  → app is open, observation in progress

SESSION_STOPPED
  → stop condition triggered; app closed; awaiting human review

SESSION_EVIDENCE_RECORDED
  → observation complete; evidence recorded in schema

SESSION_ACCEPTED
  → human accepted evidence for this session

SESSION_REJECTED
  → human rejected evidence; requires investigation
```

## Step-by-Step Session Flow

### Step 1: Pre-Session Check (→ READY_FOR_SESSION)

```text
action:  run pre-session checks (see PRACTICAL_LOCAL_MVP_OPERATION_RULES.md)
checks:  branch, HEAD, staged=0, diff=0, binary exists, GO present, operator present
result:  all PASS → proceed to Step 2
         any FAIL → STOP; do not proceed; report to human
```

### Step 2: Valid Time_Window Confirmation (→ SESSION_APPROVED)

```text
action:  confirm explicit human GO has been received
         confirm time_window is concrete (not placeholder)
         confirm time_window has not expired
checks:  GO present; time_window filled; time_window valid
result:  confirmed → proceed to Step 3
         not confirmed → STOP; request GO from human
```

### Step 3: Local Binary Check

```text
action:  Test-Path ".\node_modules\.bin\electron.cmd"
result:  true → proceed to Step 4
         false → STOP; do not install; report to human
```

### Step 4: App Open (→ SESSION_RUNNING)

```text
action:  .\node_modules\.bin\electron.cmd .
result:  app window opens → proceed to Step 5
         fails to open → record incident_category: electron_launch_failure
                         do not install; STOP; report to human
```

### Step 5: Observation

```text
action:  human observes UI screens within approved time_window
observe: screen names, layout health, status labels, error categories
record:  PASS / HOLD / NG per screen (redacted only)
         no raw values, no secrets, no private paths
check:   stop conditions continuously (see Step 6)
result:  observation complete → proceed to Step 7
         stop condition triggered → go to Step 6
```

### Step 6: STOP Condition Check (→ SESSION_STOPPED if triggered)

```text
if triggered:
  close app immediately
  record stop_condition_category (no raw values)
  do not continue observation
  go to Step 8 (working tree check)
  report to human before any further action
```

### Step 7: App Close

```text
action:  close app normally when observation is complete or time_window ends
result:  app closed → proceed to Step 8
```

### Step 8: Working Tree Check

```text
action:  git diff --cached (staged count), git diff (diff count)
result:  staged=0, diff=0 → proceed to Step 9
         non-zero → STOP; record unexpected_file_changes; report to human
```

### Step 9: Evidence Record (→ SESSION_EVIDENCE_RECORDED)

```text
action:  fill LOCAL_MVP_EVIDENCE_SCHEMA.md fields
         fill LOCAL_MVP_DAILY_CHECK_TEMPLATE.md fields
rules:   all values redacted; no raw values, secrets, paths
result:  evidence draft complete → await human review
```

### Step 10: Human Acceptance or Revision (→ SESSION_ACCEPTED / SESSION_REJECTED)

```text
human reviews evidence
decision:
  accepted_as_local_app_observation_evidence → SESSION_ACCEPTED
  needs_revision → revise evidence, resubmit
  rejected → SESSION_REJECTED; investigate before next session
```

## Session ID Format

```text
session_id: shikishima-session-YYYY-MM-DD-NNN
  (NNN = sequential session number per day)
example: shikishima-session-2026-05-14-001
```

## Safety Boundary

```text
decision: HOLD
execution: disabled
productionReady: false
rawValuesReported: false
robotMotion: HOLD
Level 3: not approved
```
