# Local MVP Daily Check Template

## Document Status

```text
roadmapVersion: v3.8.0
status: template_only
date_created: 2026-05-14
```

## Purpose

This is a fill-in template for each Local MVP observation session.

Do not include raw paths, secrets, tokens, or local-only values in any field.
All values must be redacted.

Do not fill this template before a valid GO has been issued.

---

## Session Record

```text
date: [YYYY-MM-DD]
operator: [human]
time_window: [YYYY-MM-DD HH:MM-HH:MM JST — from approved GO]
command_used: .\node_modules\.bin\electron.cmd .
```

## Pre-Open State

```text
local_binary_exists: [true / false]
staged_files_before: [count]
actual_diff_files_before: [count]
branch: [main]
head_commit: [short hash]
```

## Observation

```text
app_started: [true / false]

screens_checked:
  - [screen name 1]: [PASS / HOLD / NG]
  - [screen name 2]: [PASS / HOLD / NG]
  - [screen name 3]: [PASS / HOLD / NG]
  (add rows as needed)
```

## Status Labels Observed

```text
decision_state_observed: [HOLD / other — label only]
execution_disabled_observed: [true / false — disabled visible]
productionReady_false_observed: [true / false — false visible]
rawValuesReported_false_observed: [true / false — no raw values]
level_3_not_approved_observed: [true / false — not approved visible or documented]
```

## Safety Checks

```text
unexpected_network_prompt: [yes / no]
unexpected_file_changes: [yes / no]
robot_voice_device_prompt: [yes / no]
screenshots_contain_secrets: [yes / no]
```

## Stop Conditions

```text
stop_conditions_triggered: [yes / no]
stop_condition_category: [category label if triggered, or: n/a]
```

## Raw Value Safety

```text
raw_values_reported: false
secrets_reported: false
tokens_reported: false
local_only_values_reported: false
private_paths_reported: false
```

## Post-Close State

```text
staged_files_after: [count — should be 0]
actual_diff_files_after: [count — should be 0]
untracked_unchanged: [true / false]
```

## Result

```text
result: [PASS / HOLD / NG]
issues_found: [category label only, no raw values — or: none]
```

## Next Action

```text
next_action: [description — e.g., record evidence, issue new GO, STOP and investigate]
next_required_human_action: [description]
```

---

## Template Use Policy

- Do not fill before a valid GO has been issued.
- All fields must be redacted — no raw values, paths, tokens, secrets.
- One template per session.
- Completed templates become evidence when accepted.
- This template does not approve Level 3, productionReady, execution,
  or any further gate.
