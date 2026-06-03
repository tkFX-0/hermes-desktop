# Level B3 Daily Loop Runbook v1

## Document Status

```text
roadmapVersion: v3.13.0
status: runbook_v1
date_created: 2026-05-14
human_acceptance: pending
```

## Purpose

This runbook defines how to repeatably run a Level B3 daily operation session.
It does not approve execution, Level 3, productionReady, or autonomous operation.

## When to Run a B3 Session

Run a B3 session when you want to:

- observe the local app UI/status under defined rules
- verify a source fix is reflected in the running app
- record evidence for a specific screen or feature
- accumulate incident-free evidence toward Level 3 preconditions

Do not run a B3 session autonomously. Every session requires a human present.

## Who Can Operate

```text
- Human reviewer with a valid explicit time_window GO
- No autonomous agent operation without human present
- No remote operation
- No scheduled/unattended operation
```

## Session GO Template

Every session requires this exact GO format:

```text
I explicitly approve this one Level B3 daily operation session only.

Approved time_window:
YYYY-MM-DD HH:MM-HH:MM JST

Approved purpose:
[specific observation goal — one sentence]

Approved command:
.\node_modules\.bin\electron.cmd .
```

Required fields in GO:
- `time_window`: concrete start and end time — AI cannot choose this
- `purpose`: specific observation goal for this session
- `command`: exact approved command (no variation)

## Pre-Run Checklist

Before launching the app, verify:

```text
branch_main: PASS
HEAD_eq_origin_main: PASS (or HEAD is docs commit ahead only)
working_tree_staged_empty: PASS
actual_content_diff_files_0: PASS
local_binary_exists: PASS (.\node_modules\.bin\electron.cmd)
build_is_current: PASS (out/ reflects latest src changes)
```

If any item is not PASS: STOP, do not launch.

## Observation Checklist

During the session (Show must not be clicked):

```text
- record screen names visited
- record status labels observed (label only, no raw values)
- record any unexpected prompts or displays
- note PASS / HOLD / NG for each screen
- do not enter real API keys
- do not click Show on any secret field
- do not trigger external network calls
- do not trigger robot / voice / device prompts
```

## STOP Classification

Trigger STOP immediately if:

```text
secret_like_value_visible_in_ui    — secret/raw value appears in any field
unexpected_external_network_prompt — external API call attempted
robot_voice_device_prompt          — robot/voice/device activation attempted
unexpected_file_change             — working tree changes after launch
install_required                   — npm/npx/install required
time_window_expired                — session exceeds approved window
local_binary_missing               — electron.cmd not found
scope_expansion_requested          — any action beyond observation
```

STOP does not mean failure. STOP triggers the self-resolution loop:

```text
1. classify the STOP cause
2. close the app
3. record working tree counts (before/after)
4. create STOP evidence (no raw values)
5. generate remediation plan
6. stop at human decision boundary
7. do not push without new GO
```

## Evidence Creation

After each session (PASS or STOP), create:

```text
docs/shikishima/LOCAL_MVP_OPERATION_EVIDENCE_YYYY-MM-DD-NNN.md
```

Required fields (see LOCAL_MVP_EVIDENCE_SCHEMA.md for full schema):

```text
session_id, date, time_window, operator, command_used,
local_binary_exists, app_started,
screens_checked (label + PASS/HOLD/NG),
status_labels_observed (label only),
issues_found,
stop_conditions_triggered,
raw_values_reported (always false),
working_tree_before/after,
human_acceptance_status
```

## Human Acceptance

After each session, the human must:

1. review the evidence file
2. confirm `raw_values_reported: false`
3. confirm `working_tree_after: staged=0 / diff=0`
4. set `human_acceptance_status` to one of:
   - `accepted_as_local_mvp_operation_evidence`
   - `needs_revision`
   - `rejected`
5. commit the acceptance update (docs-only)

## Push Readiness After Session

After evidence acceptance, push readiness check confirms:

```text
origin_main_as_expected: PASS
latest_local_commit_correct: PASS
commits_ahead_as_expected: PASS
docs_only_scope: PASS
no_src_package_changes: PASS
staged_files_0: PASS
raw_values_in_commits_false: PASS
```

Then human issues push GO.

## Repeat Cadence

```text
- Sessions may be run as frequently as needed
- Each session requires its own time_window GO
- Sessions may not overlap or extend without a new GO
- No minimum interval required
- No maximum sessions per day
- AI cannot schedule sessions
```

## When to Escalate to Level 3 Gap Audit

Escalate when:

```text
- sufficient incident-free B3 sessions have accumulated
- main dashboard status labels have been verified
- navigation/status regression has been checked
- human decides to assess Level 3 preconditions
```

See: LEVEL_3_GAP_AUDIT.md

## Safety Boundary (always maintained)

```text
decision         : HOLD
execution        : disabled
productionReady  : false
rawValuesReported: false
robotMotion      : HOLD
Level 3          : not approved
Final Shikishima 100%: not complete
```

---

この範囲では問題を検出していません
