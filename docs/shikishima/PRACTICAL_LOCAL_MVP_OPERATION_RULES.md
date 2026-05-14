# Practical Local MVP Operation Rules

## Document Status

```text
roadmapVersion: v3.11.0
status: rules_candidate
operation_level: Level B3
human_acceptance: pending
date_created: 2026-05-14
```

## Purpose

This document defines the rules, boundaries, and conditions for Practical
Local MVP Operation of the Shikishima app.

These rules apply after Level B1 Local App Observation evidence has been
accepted (accepted_as_local_app_observation_evidence).

## Operation Level

```text
Level B3: Practical Local MVP Operation
  → human-supervised local-only operation
  → repeatable sessions under defined rules
  → evidence recorded each session
  → human review after each session
```

## Allowed Operator

```text
- Human reviewer with a valid operation session GO
- No autonomous agent operation without human present
- No remote operation
```

## Allowed Timing

```text
- Only within an approved time_window in a valid explicit GO
- Each session requires its own time_window
- Sessions may not overlap or be extended without a new GO
```

## Allowed Command

```text
.\node_modules\.bin\electron.cmd .
```

```text
- Uses already-present local binary only
- npx: not allowed
- npm install / update / exec: not allowed
- If binary is missing: STOP — do not install
```

## Required Pre-Run Checks

Before every session:

```text
pre_1:  branch main confirmed
pre_2:  HEAD at expected commit
pre_3:  staged_files: 0
pre_4:  actual_content_diff_files: 0
pre_5:  local binary .\node_modules\.bin\electron.cmd exists
pre_6:  time_window filled and valid (concrete, not placeholder)
pre_7:  explicit operation GO received
pre_8:  observer: human confirmed present
pre_9:  no npm/npx/install needed
pre_10: redacted-only output policy confirmed
pre_11: stop conditions reviewed
pre_12: local-only operation (no external deploy/Cloudflare)
pre_13: robot/voice/device not connected
```

If any pre-run check fails: STOP. Do not open app.

## Allowed Observation Actions

During each session:

```text
- Open app with .\node_modules\.bin\electron.cmd .
- Observe UI screens: layout, navigation, status labels
- Note screen names and PASS / HOLD / NG results
- Verify status labels: HOLD, disabled, false, not approved
- Take screenshots only if no secrets/raw/local-only values visible
- Record console errors by category only (no raw output)
- Record working tree: staged count, diff count only
- Summarize session using LOCAL_MVP_DAILY_CHECK_TEMPLATE.md
```

## Forbidden Actions

At any point during session:

```text
- Click execution or deployment buttons
- Enable execution state
- Set productionReady true
- Approve Level 3
- Run npx or npm install / update / exec
- Install packages
- Connect to external services
- Trigger network requests beyond local dev-mode
- Start robot / StackChan / device / voice / camera / mic
- Stage or commit source changes
- Output raw values, tokens, secrets, private paths
- Take screenshots containing secrets or private config
```

## Required Evidence

After each session, record using `LOCAL_MVP_EVIDENCE_SCHEMA.md`:

```text
- session_id
- time_window used
- command used
- app_started
- screens_checked and results
- status labels observed
- issues_found (category only)
- stop_conditions_triggered
- raw_values_reported: false
- secrets_reported: false
- working_tree before/after (counts only)
- human_acceptance_status
```

## STOP Conditions

Stop immediately and close app if:

```text
stop_1:  secret, token, raw value, or local-only value appears in output
stop_2:  unexpected external network request triggered
stop_3:  deploy, Cloudflare, or external push prompt appears
stop_4:  robot/StackChan/device/voice/camera/mic prompt appears
stop_5:  app crash reveals private paths or config
stop_6:  unexpected file changes appear in working tree
stop_7:  any behavior outside the approved scope occurs
stop_8:  scope ambiguity detected
stop_9:  time_window expires
stop_10: local binary missing — do not install
stop_11: execution state changes unexpectedly
stop_12: productionReady state changes from false
```

After stop: record category (no raw values), check working tree, report.

## Incident Handling

Follow `LOCAL_MVP_INCIDENT_RESPONSE_PLAYBOOK.md` for all incidents.

General rule:
1. Stop immediately, close app
2. Record incident category (no raw values)
3. Check working tree: staged=0, diff=0
4. Do not continue until human reviews
5. No commit or push until human approves post-incident state

## Daily / Each-Session Checklist

Use `LOCAL_MVP_DAILY_CHECK_TEMPLATE.md` for every session.

Minimum required fields each session:
```text
date, operator, time_window, command_used, local_binary_exists,
app_started, screens_checked, status_labels_observed,
stop_conditions_triggered, result, raw_values_reported: false
```

## What Remains HOLD

```text
Level 3: HOLD
productionReady true: HOLD
execution enabled: HOLD
autonomous execution: HOLD
external deployment: HOLD
Cloudflare: HOLD
WSL / Hermes / wrapper: HOLD
robot / StackChan runtime: HOLD
robot connection / motion: HOLD
voice / camera / mic: HOLD
autonomous push: HOLD
```

## What This Does Not Approve

```text
Level 3
productionReady true
execution enabled
autonomous operation without human
external deployment
robot/voice/device runtime
WSL/Hermes/wrapper execution
Final Shikishima 100%
```

## Next Level Conditions

For Level B4 (Repeated Observation Loop) consideration:

```text
- Multiple Level B3 sessions completed (minimum: 3 recommended)
- All sessions: evidence accepted (no raw values, no stop conditions)
- Incident playbook reviewed at least once
- Daily check template in active use
- Autonomous loop boundaries confirmed and respected
- Human explicitly approves Level B4 readiness
```

## Safety Boundary

```text
decision: HOLD
execution: disabled
productionReady: false
rawValuesReported: false
robotMotion: HOLD
Level 3: not approved
Final Shikishima 100%: not complete
```
