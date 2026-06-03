# Level 3-A Observation Evidence Template

## Document Status

```text
roadmapVersion: v3.30.0
date: 2026-05-16
status: template_only — blank until a future Level 3-A run fills it
```

---

## WARNING

**This template is not evidence.**  
Only a completed future Level 3-A run can produce evidence.  
Do not mark any field as PASS unless the actual run occurred.

---

## Session Header

```text
session_id:          [shikishima-session-YYYY-MM-DD-0NN]
date:                [YYYY-MM-DD]
approved_time_window:
  date:              [YYYY-MM-DD]
  start:             [HH:MM JST]
  end:               [HH:MM JST]
approved_command:    [exact command]
operator:            human
claudecode_role:     evidence recorder / checker
user_role:           runtime approver / UI observer
```

---

## Pre-Run State

```text
origin/main:         [commit hash]
HEAD:                [commit hash]
commits_ahead:       [N]
staged:              [0]
tracked_dirty:       [0]
port_3030_before:    closed
runtime_before:      not started
runtime_branch:      [local only / pushed — must be local only]
activation_commit:   [not in main]
level3_approved:     [not approved / approved for this run only]
productionReady:     false
execution:           disabled
```

---

## Runtime Start Result

```text
start_time:          [HH:MM JST]
within_window:       [yes / no]
command_matched:     [yes / no]
port_3030_after_start: [listening / not applicable]
startup_errors:      [none / describe]
```

---

## Electron UI Observation

```text
decision:            [HOLD / stop]
execution:           [disabled]
productionReady:     [false]
rawValuesReported:   [false]
level3:              [not_approved]
appStatus:           [redacted summary only]
raw_values_visible:  [false]
secrets_visible:     [false]
```

---

## iPhone Observation (if applicable)

```text
iphone_required:     [yes / no]
health_check:        [PASS / not performed]
mobile_ui_reachable: [yes / no / not performed]
token_input_masked:  [true / not applicable]
snapshot_visible:    [yes / no / not performed]
snapshot_decision:   [HOLD / not performed]
snapshot_execution:  [disabled / not performed]
snapshot_productionReady: [false / not performed]
snapshot_rawValuesReported: [false / not performed]
raw_token_in_chat:   false
raw_lan_ip_in_chat:  false
```

---

## Negative Checks

```text
snapshot_without_token:     [rejected 401 / not checked]
snapshot_invalid_token:     [rejected 401 / not checked]
wildcard_cors:              false
zero_zero_zero_zero_bind:   false
execution_endpoint:         none
write_endpoint:             none
push_endpoint:              none
```

---

## Shutdown Result

```text
shutdown_time:       [HH:MM JST]
within_window:       [yes / no]
runtime_stopped:     [true / false]
port_3030_after_shutdown: [closed / open — must be closed]
```

---

## Post-Run State

```text
staged:              [0]
tracked_dirty:       [0]
runtime_branch:      [local only, not pushed]
activation_commit:   [not in main]
productionReady:     false
execution:           disabled
rawValuesReported:   false
```

---

## STOP Conditions Triggered

```text
stop_triggered:      [none / describe if any]
stop_reason:         [n/a / describe]
remediation:         [n/a / describe]
```

---

## Result

```text
result: [PASS / PASS_WITH_CAVEAT / HOLD / NG]

PASS:              all checks passed, runtime clean, port closed, no boundary violation
PASS_WITH_CAVEAT:  minor issue noted, human reviews
HOLD:              uncertain — do not accept yet
NG:                boundary violation — do not count
```

---

## Next Required Human Decision

```text
next_required_human_decision:
- [acceptance review / push evidence / do not count / remediate]
```

---

この範囲では問題を検出していません。
