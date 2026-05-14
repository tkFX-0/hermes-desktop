# Local MVP Incident Response Playbook

## Document Status

```text
roadmapVersion: v3.8.0
status: playbook_only
execution: disabled
productionReady: false
date_created: 2026-05-14
```

## Purpose

This playbook defines how to respond to incidents during Local MVP operation.

All incident records must be redacted. No raw values, secrets, tokens,
private paths, or local-only config values may appear in any incident record.

## General Rule for All Incidents

```text
1. Stop immediately.
2. Close app if open.
3. Record incident category only (no raw values).
4. Check working tree: staged=0, diff=0.
5. Do not continue until human reviews.
6. Commit is not allowed until human approves post-incident state.
7. Push is not allowed until human approves.
```

---

## Incident Type 1: Raw Value Exposure

```text
trigger: any raw value, token, key, or credential appears in UI or output
immediate_action: close app, do not screenshot
record: incident_category: raw_value_exposure
record: screen_context: [screen name only, no raw value]
what_NOT_to_record: the raw value itself
commit_allowed: no — pending human review
reopen_allowed: no — pending human review
who_decides_next: human
```

## Incident Type 2: Secret or Token Exposure

```text
trigger: any secret, API key, token, credential, or auth value appears
immediate_action: close app, do not screenshot, do not copy value
record: incident_category: secret_or_token_exposure
record: screen_context: [screen name only]
what_NOT_to_record: the secret or token
commit_allowed: no
reopen_allowed: no
who_decides_next: human — treat as high severity
```

## Incident Type 3: Local-Only Path Exposure

```text
trigger: private local absolute path appears in output or UI
immediate_action: close app, do not include path in evidence
record: incident_category: local_only_path_exposure
record: screen_context: [screen name only]
what_NOT_to_record: the path
commit_allowed: no — pending human review
reopen_allowed: no — pending human review
who_decides_next: human
```

## Incident Type 4: Unexpected Execution Behavior

```text
trigger: app performs unexpected action, execution state changes, loop starts
immediate_action: close app immediately
record: incident_category: unexpected_execution
record: behavior_category: [label only, no raw details]
record: execution state before/after: [HOLD/disabled or changed]
commit_allowed: no
reopen_allowed: no — pending human investigation
who_decides_next: human
```

## Incident Type 5: Unexpected Network or Deploy Prompt

```text
trigger: app attempts external network request, shows deploy/Cloudflare prompt
immediate_action: dismiss prompt if possible, close app
record: incident_category: unexpected_network_or_deploy_prompt
record: prompt_category: [label only]
commit_allowed: no
reopen_allowed: no — pending human investigation
who_decides_next: human — treat as significant
```

## Incident Type 6: Electron Launch Failure

```text
trigger: .\node_modules\.bin\electron.cmd . fails to start
immediate_action: stop, do not attempt npm install
record: incident_category: electron_launch_failure
record: failure_category: [error category only, no raw path or message]
what_NOT_to_do: run npm install, run npx, install packages
commit_allowed: no — pending human decision
reopen_allowed: no — investigate binary without installing
who_decides_next: human
```

## Incident Type 7: Unexpected File Changes

```text
trigger: working tree shows unexpected staged or modified files after observation
immediate_action: do not stage, do not commit
record: incident_category: unexpected_file_changes
record: file_category: [docs / src / config — category only, no paths]
record: staged_count, diff_count
what_NOT_to_do: commit, push, or discard changes without human approval
commit_allowed: no
who_decides_next: human
```

## Incident Type 8: Robot / Voice / Device Prompt

```text
trigger: robot, StackChan, voice, camera, or mic prompt or connection request appears
immediate_action: close app, do not interact with prompt
record: incident_category: robot_voice_device_prompt
record: prompt_category: [label only]
commit_allowed: no
reopen_allowed: no — pending human review
who_decides_next: human — Track E remains HOLD
```

## Incident Type 9: Ambiguous Scope

```text
trigger: uncertainty about whether a UI action is inside or outside approved scope
immediate_action: stop current action, do not proceed
record: incident_category: scope_ambiguity
record: context_category: [screen name, action category]
commit_allowed: no — pending clarification
reopen_allowed: only after human clarifies scope
who_decides_next: human
```

## Incident Record Format

All incident records must use:

```text
incident_category: [one of the 9 types above]
trigger_summary: [category label only]
screen_context: [screen name only if relevant]
working_tree_at_incident: staged=[count], diff=[count]
raw_values_in_record: false
secrets_in_record: false
local_paths_in_record: false
app_state_at_incident: [open / closed]
next_required_human_action: [description]
```

## Safety Boundary After Any Incident

```text
decision: HOLD
execution: disabled
productionReady: false
rawValuesReported: false
robotMotion: HOLD
Level 3: not approved
app: closed until human approves reopen
```
