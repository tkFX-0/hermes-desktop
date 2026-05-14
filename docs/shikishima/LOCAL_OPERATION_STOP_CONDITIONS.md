# Local Operation Stop Conditions

## Document Status

```text
roadmapVersion: v3.7.0
status: stop_conditions_only
execution: disabled
productionReady: false
date_created: 2026-05-14
```

## Purpose

This document defines all stop conditions for Local App Observation and
Local MVP Operation.

Any stop condition triggers an immediate halt of the current operation.
The stop must be recorded (category only, no raw values) and reported to
the human.

## Pre-Observation Stop Conditions

Stop and do not start the app if:

```text
pre_stop_1: HEAD != expected commit hash
pre_stop_2: staged_files != 0
pre_stop_3: actual_content_diff_files != 0
pre_stop_4: local binary .\node_modules\.bin\electron.cmd does not exist
pre_stop_5: time_window is a placeholder or invalid
pre_stop_6: time_window has already expired
pre_stop_7: no valid explicit human GO received
pre_stop_8: observer (human) not confirmed present
```

## During-Observation Stop Conditions

Stop immediately and close the app if:

```text
obs_stop_1: any secret, token, raw value, or local-only value appears in output
obs_stop_2: unexpected external network request is triggered
obs_stop_3: deploy, Cloudflare, or external push prompt appears
obs_stop_4: robot / StackChan / device / voice / camera / mic prompt appears
obs_stop_5: app crash reveals private paths or config
obs_stop_6: unexpected file changes appear in working tree
obs_stop_7: any behavior outside the approved observation scope occurs
obs_stop_8: scope ambiguity is detected
obs_stop_9: time_window expires
obs_stop_10: execution button is activated or execution state changes
obs_stop_11: productionReady state changes from false
obs_stop_12: Level 3 approval prompt appears
```

## Post-Observation Stop Conditions

Stop evidence recording and report if:

```text
post_stop_1: working tree is not clean after observation (staged or diff != 0)
post_stop_2: evidence draft contains raw values — revise before commit
post_stop_3: evidence draft contains local-only paths
post_stop_4: screenshots contain visible secrets or raw config
```

## Autonomous Loop Stop Conditions

Stop the loop and return to human if:

```text
loop_stop_1: a GO gate is reached without a valid GO
loop_stop_2: any obs_stop or pre_stop condition triggers
loop_stop_3: a forbidden scope is encountered (npm/npx/install/deploy etc.)
loop_stop_4: local binary becomes missing mid-loop
loop_stop_5: human intervention is explicitly required
loop_stop_6: commit fails for any reason
loop_stop_7: unexpected state detected (unexpected files, branches, config)
```

## After Any Stop

```text
1. Stop immediately.
2. Close app if open.
3. Record stop condition category (no raw values, no secrets).
4. Check working tree: confirm staged=0, diff=0.
5. Report stop condition and working tree state to human.
6. Do not continue until human reviews and issues new GO if needed.
```

## Safety Boundary After Stop

```text
decision: HOLD
execution: disabled
productionReady: false
rawValuesReported: false
robotMotion: HOLD
Level 3: not approved
```
