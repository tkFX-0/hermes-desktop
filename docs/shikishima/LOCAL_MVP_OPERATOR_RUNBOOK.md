# Local MVP Operator Runbook

## Document Status

```text
roadmapVersion: v3.8.0
status: runbook_only
execution: disabled
productionReady: false
date_created: 2026-05-14
```

## Purpose

This runbook guides a human operator through practical local MVP use of
the Shikishima app.

Local MVP operation is human-supervised only.
It does not approve autonomous execution.
It does not approve productionReady true.
It does not approve Level 3.
It does not approve robot / voice / device / external runtime.

## Who May Operate

```text
- Human reviewer with explicit GO and filled time_window
- No autonomous agent operation without human present
```

## When App May Be Opened

```text
- Only within an approved time_window in a valid explicit GO
- Only with command: .\node_modules\.bin\electron.cmd .
- Only after all pre-open checks pass
- Not outside of an approved time_window
```

## Pre-Open Checklist

Before launching the app, confirm all of the following:

```text
pre_1:  branch main confirmed
pre_2:  HEAD at expected commit
pre_3:  staged_files: 0
pre_4:  actual_content_diff_files: 0
pre_5:  local binary .\node_modules\.bin\electron.cmd exists
pre_6:  time_window filled and valid (concrete, not placeholder)
pre_7:  explicit GO received from human
pre_8:  observer: human confirmed present
pre_9:  no npm/npx/install needed (binary must already exist)
pre_10: redacted-only output policy understood
pre_11: stop conditions reviewed
pre_12: incident playbook available
```

If any check fails, STOP. Do not open app.

## What Is Allowed During Observation

```text
- Open app with .\node_modules\.bin\electron.cmd .
- Observe UI screens: layout, navigation, status labels
- Note screen names and PASS / HOLD / NG results
- Check status labels: HOLD, disabled, false, not approved
- Take screenshots if no secrets / raw / local-only values visible
- Record console errors by category only (no raw output)
- Record working tree: staged count, diff count only
```

## What Is Forbidden During Observation

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
```

## What Must Be Recorded

```text
- time_window used
- command used
- app_started: true / false
- screens_checked: [list of screen names]
- status_labels_observed: HOLD / disabled / false / not approved confirmed
- issues_found: category only, no raw values
- stop_conditions_triggered: yes / no
- raw_values_reported: false
- secrets_reported: false
- working_tree_before_after: staged/diff counts only
```

Use template: `docs/shikishima/LOCAL_MVP_DAILY_CHECK_TEMPLATE.md`

## How to Stop

```text
1. If any stop condition triggers: close app immediately
2. Record stop condition category (no raw values)
3. Check working tree: confirm staged=0, diff=0
4. Report stop condition and working tree state
5. Do not reopen app until human reviews and issues new GO
```

Stop conditions are defined in:
`docs/shikishima/LOCAL_OPERATION_STOP_CONDITIONS.md`

## How to Report Issues

```text
1. Identify issue category (no raw values in report)
2. Note screen name or operation context
3. Record working tree state
4. Follow incident playbook:
   docs/shikishima/LOCAL_MVP_INCIDENT_RESPONSE_PLAYBOOK.md
5. Return to human with issue category and working tree state
```

## What Remains HOLD

```text
Autonomous execution: HOLD
External deployment: HOLD
Cloudflare: HOLD
WSL / Hermes / wrapper: HOLD
robot / StackChan runtime: HOLD
robot connection / motion: HOLD
voice / camera / mic: HOLD
productionReady true: HOLD
Level 3 approval: HOLD
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
