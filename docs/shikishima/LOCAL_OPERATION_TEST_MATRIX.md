# Local Operation Test Matrix

## Document Status

```text
roadmapVersion: v3.7.0
status: matrix_only
execution: disabled
productionReady: false
date_created: 2026-05-14
```

## Purpose

This matrix defines what must be checked during each Local App Observation
and what result is acceptable.

All checks must be performed with redacted output only. No raw values.

## Pre-Observation Checks (before starting app)

| Check | Method | Pass Condition | Fail Action |
|---|---|---|---|
| branch_main | git branch | main | STOP |
| HEAD_clean | git rev-parse HEAD | matches expected | STOP |
| staged_files | git diff --cached | 0 | STOP |
| actual_diff_files | git diff | 0 | STOP |
| local_binary_exists | Test-Path .\node_modules\.bin\electron.cmd | True | STOP — do not install |
| time_window_valid | check GO timestamp | concrete, not placeholder | STOP |
| observer_present | human confirms | human watching | STOP |

## During-Observation Checks

| Check | What to Verify | Pass Result | Stop Condition |
|---|---|---|---|
| app_launches | app window opens | window visible | crash or error |
| status_labels_visible | HOLD / disabled / false visible | visible | labels missing or raw values shown |
| hold_state | decision=HOLD state reflected | HOLD visible | any indication of non-HOLD |
| execution_disabled | execution=disabled reflected | disabled visible | any execution prompt |
| productionReady_false | productionReady=false reflected | false visible | any productionReady=true |
| rawValuesReported_false | no raw values in UI | no raw values | any raw value, token, secret |
| no_network_prompt | no external network / deploy prompt | no prompt | any external prompt |
| no_robot_voice_prompt | no robot / voice / device prompt | no prompt | any device prompt |
| no_unexpected_file_changes | working tree unchanged | staged 0, diff 0 | any unexpected change |
| screenshots_safe | screenshots contain no secrets | redacted only | raw values visible |

## Post-Observation Checks (after closing app)

| Check | Method | Pass Condition | Fail Action |
|---|---|---|---|
| working_tree_after | git diff --cached && git diff | 0 / 0 | STOP, report |
| staged_files_after | git diff --cached | 0 | STOP, report |
| untracked_unchanged | git status | no new untracked | report |
| evidence_redacted | review evidence draft | no raw values | revise before commit |

## Evidence Recording Rules

```text
allowed:  PASS / HOLD / NG labels
allowed:  screen names
allowed:  error categories (no raw output)
allowed:  counts
allowed:  screenshots if no secrets/raw/local-only visible
forbidden: raw stdout / stderr
forbidden: raw paths, tokens, secrets, credentials
forbidden: private config values
forbidden: raw IPC payloads
forbidden: raw internal state
```

## Overall Session Result Criteria

```text
PASS:  all checks pass, no stop conditions triggered, evidence redacted
HOLD:  one or more checks pending, follow-up required
NG:    stop condition triggered or critical check failed
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
