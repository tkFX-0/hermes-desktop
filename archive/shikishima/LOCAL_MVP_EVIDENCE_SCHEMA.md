# Local MVP Evidence Schema

## Document Status

```text
roadmapVersion: v3.11.0
status: schema_only
date_created: 2026-05-14
```

## Purpose

This schema defines all required fields for a Local MVP Operation session
evidence record. All values must be redacted. No raw paths, secrets, tokens,
credentials, or local-only config values may appear in any field.

## Required Fields

```text
session_id:
  type: string
  format: shikishima-session-YYYY-MM-DD-NNN
  example: shikishima-session-2026-05-14-001
  required: true

date:
  type: date
  format: YYYY-MM-DD
  required: true

time_window:
  type: string
  format: YYYY-MM-DD HH:MM-HH:MM JST
  note: actual window used (from approved GO)
  required: true

operator:
  type: string
  value: human
  required: true

command_used:
  type: string
  allowed_value: .\node_modules\.bin\electron.cmd .
  required: true

local_binary_exists:
  type: boolean
  required: true

app_started:
  type: boolean
  required: true
```

## Observation Fields

```text
screens_checked:
  type: list
  format:
    - [screen_name]: [PASS / HOLD / NG]
  note: screen names only; no raw values
  required: true

status_labels_observed:
  type: object
  fields:
    decision_state: [HOLD / other — label only]
    execution_state: [disabled / other — label only]
    productionReady_state: [false / other — label only]
    rawValuesReported_state: [false / other — label only]
    level_3_state: [not approved / other — label only]
  required: true

issues_found:
  type: list or string
  format: category label only (no raw values)
  example: none / layout_issue / missing_label
  required: true
```

## Safety Fields

```text
stop_conditions_triggered:
  type: boolean
  required: true

stop_condition_category:
  type: string
  format: category label only if triggered; n/a otherwise
  required: if stop_conditions_triggered = true

raw_values_reported:
  type: boolean
  fixed_value: false
  required: true

secrets_reported:
  type: boolean
  fixed_value: false
  required: true

tokens_reported:
  type: boolean
  fixed_value: false
  required: true

local_only_values_reported:
  type: boolean
  fixed_value: false
  required: true

private_paths_reported:
  type: boolean
  fixed_value: false
  required: true
```

## Working Tree Fields

```text
working_tree_before:
  type: object
  fields:
    staged_files: [integer — count only]
    actual_diff_files: [integer — count only]
  required: true

working_tree_after:
  type: object
  fields:
    staged_files: [integer — count only, should be 0]
    actual_diff_files: [integer — count only, should be 0]
  required: true
```

## Acceptance Fields

```text
human_acceptance_status:
  type: string
  allowed_values:
    - accepted_as_local_app_observation_evidence
    - needs_revision
    - rejected
    - pending
  required: true

next_action:
  type: string
  description: what happens after this session
  required: true
```

## Validation Rules

```text
rule_1: raw_values_reported must always be false
rule_2: secrets_reported must always be false
rule_3: private_paths_reported must always be false
rule_4: working_tree_after.staged_files should be 0
rule_5: working_tree_after.actual_diff_files should be 0
rule_6: command_used must match approved command exactly
rule_7: operator must be "human"
rule_8: no raw absolute paths in any string field
rule_9: no secrets or tokens in any string field
rule_10: screen names must be UI labels, not file paths
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
