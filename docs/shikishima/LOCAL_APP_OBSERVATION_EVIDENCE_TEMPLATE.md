# Local App Observation Evidence Template

## Document Status

```text
roadmapVersion: v3.4.0
status: template_only
template_for: Local App Observation (Track B)
date_created: 2026-05-14
```

## Purpose

This is a fill-in template for recording evidence after a human-approved
Local App Observation. It must not be filled until an explicit GO has been
issued and the observation has been completed.

All values must be redacted. No raw paths, tokens, secrets, credentials,
private config values, or local-only values may appear in any field.

---

## Evidence Record (fill after observation)

```text
status: [PASS / HOLD / NG]
time_window: [actual window used — YYYY-MM-DD HH:MM-HH:MM JST]
command_scope_used: [exact approved command only]
observer: [human]
```

## Screens Checked

```text
screens_checked:
  - [screen name 1]: [PASS / HOLD / NG]
  - [screen name 2]: [PASS / HOLD / NG]
  - [screen name 3]: [PASS / HOLD / NG]
  (add rows as needed)
```

## Result Summary

```text
result: [PASS / HOLD / NG]
layout_health: [PASS / HOLD / NG]
navigation_health: [PASS / HOLD / NG]
console_errors_category: [none / warnings only / errors — category label only, no raw output]
unexpected_behavior: [none / description without raw values]
```

## Issues Found

```text
issues_found:
  - [category label only, no raw values, no private paths]
  (or: none)
```

## Stop Conditions

```text
stop_conditions_triggered: [yes / no]
stop_condition_detail: [category label only if triggered, or: n/a]
```

## Raw Value Safety

```text
raw_values_reported: false
secrets_reported: false
tokens_reported: false
local_only_values_reported: false
private_paths_reported: false
```

## Working Tree Before / After

```text
working_tree_before:
  staged_files: 0
  actual_content_diff_files: 0

working_tree_after:
  staged_files: [count]
  actual_content_diff_files: [count]
  note: [should be 0/0 if no changes made]
```

## Safety Boundary After Observation

```text
decision: HOLD
execution: disabled
productionReady: false
rawValuesReported: false
robotMotion: HOLD
Level 3: not approved
Local App Observation further execution: not approved unless new GO issued
Final Shikishima 100%: not complete
future_git_push: not approved
```

## Next Required Human Action

```text
next_required_human_action: [description of next gate]
```

---

## Template Use Policy

- Do not fill this template before a GO has been issued.
- Do not include raw values, tokens, secrets, or private config in any field.
- Do not use this template to imply approval for any further gate.
- Each observation requires its own separate evidence record.
- This template does not approve Level 3, productionReady, execution, or any
  further gate.
