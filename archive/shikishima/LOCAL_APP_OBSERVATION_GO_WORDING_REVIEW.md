# Local App Observation GO Wording Review

## Document Status

```text
roadmapVersion: v3.6.0
status: go_wording_review_only
Local App Observation execution: not approved
Electron dev-mode: not approved
GO_issued: false
time_window: required
decision: HOLD
execution: disabled
productionReady: false
date_created: 2026-05-14
```

## Purpose

This document reviews future GO wording only.

It does not itself approve the Local App Observation.

A separate explicit human GO with a concrete time_window is required before
any Local App Observation execution begins.

Reading or reviewing this document is not GO.

## Distinction

```text
This document:  GO wording review only — not GO
GO template:    LOCAL_APP_OBSERVATION_FINAL_GO_TEMPLATE.md (fill-in, not GO)
Actual GO:      a separate message from the human with a concrete time_window
```

## Proposed Future Command Scope

The following is the proposed command for a future Local App Observation.
It is proposed only, not approved to run by this document.

```text
proposed_command: .\node_modules\.bin\electron.cmd .
mode: dev-mode
scope: local only — uses already-present local binary only
proposed_only_until_human_go: true
npx: HOLD — not used
npm_install: HOLD — not used
npm_update: HOLD — not used
npm_exec: HOLD — not used
transient_package_execution: HOLD
```

This command uses the already-present local Electron binary only.
It must not run npm install, npm update, npm exec, or npx.
If the local Electron binary is missing, STOP. Do not install.
The GO command must use an already-present local binary only.
No package fetching or dependency installation is approved.

This command must not be executed until an explicit human GO is issued with
a filled time_window.

## Pre-Run Checks Required Before GO

All of the following must pass before sending GO:

```text
pre_1:  branch main confirmed
pre_2:  latest commit hash confirmed
pre_3:  staged_files: 0
pre_4:  actual_content_diff_files: 0
pre_5:  no package.json / package-lock.json staged
pre_6:  no src/** / tests/** staged
pre_7:  untracked files not staged
pre_8:  time_window filled and valid (not placeholder)
pre_9:  observer confirmed (human)
pre_10: redacted-only output policy confirmed
pre_11: stop conditions understood
pre_12: this is a local-only observation (no external deploy / Cloudflare)
pre_13: StackChan / robot / voice / camera / mic: all confirmed not connected
pre_14: .\node_modules\.bin\electron.cmd exists locally — do not run npm install if missing
```

If any pre-run check fails, STOP and do not issue GO.

## Approved Command Scope (after GO)

After a valid GO is issued, the approved scope is:

```text
- Launch app in Electron dev-mode within the approved time_window
- Observe UI screens: layout, navigation, status labels
- Record screen names and results as PASS / HOLD / NG
- Note console errors by category only (no raw output, no raw paths)
- Record working tree before/after (staged, diff counts only)
```

All output must be redacted. No raw values, tokens, paths, secrets, or
local-only config values may appear in any evidence field.

## Forbidden During Observation

```text
- Run commands outside the approved scope
- Output raw values, tokens, secrets, private paths, credentials
- Connect to external services
- Trigger network requests beyond local dev-mode
- Stage or commit source changes during observation
- Run npx
- Run npm install
- Run npm update
- Run npm exec
- Execute transient packages or network package resolution
- Change package.json or package-lock.json
- Change dependencies
- Approve Level 3 or productionReady true
- Start robot / StackChan / device / voice / camera / mic
- Take screenshots containing secrets or private config
```

## Stop Conditions

Stop immediately and do not continue if any of the following occur:

```text
stop_1: any secret, token, raw value, or local-only value appears in output
stop_2: unexpected external network request is triggered
stop_3: deploy, Cloudflare, or external push prompt appears
stop_4: robot / StackChan / device / voice / camera / mic prompt appears
stop_5: app crash reveals private paths or config
stop_6: unexpected file changes appear in working tree
stop_7: any behavior outside the approved observation scope occurs
stop_8: scope ambiguity is detected — stop and clarify before continuing
stop_9: time_window expires
stop_10: local Electron binary (.\node_modules\.bin\electron.cmd) is missing — do not install
```

After any stop: record the stop condition category (no raw values),
restore working tree if changed, and report to human.

## Redacted Output Policy

```text
allowed:  PASS / HOLD / NG labels; screen names; error categories; counts
allowed:  screenshots only if no secrets / raw values / local-only values visible
forbidden: raw stdout / stderr transcripts
forbidden: raw paths, tokens, secrets, credentials, private config values
forbidden: raw IPC payloads
forbidden: raw internal state values
```

## Post-Observation Evidence Format

After observation, evidence must use the template:

```text
docs/shikishima/LOCAL_APP_OBSERVATION_EVIDENCE_TEMPLATE.md
```

All fields must be filled with redacted values only. No raw values.

## Post-Observation Human Decision Options

After evidence is recorded and reviewed:

```text
observation_passed: proceed to Practical Local MVP operation rules
observation_needs_follow_up: identify specific screens or issues for re-check
observation_hold: stop and investigate before proceeding
```

## GO Wording Review Checklist

Before issuing the actual GO, confirm all of the following:

```text
item_01: time_window filled with concrete date and hours (not placeholder)
item_02: proposed command confirmed (npx electron . — dev-mode)
item_03: local-only scope confirmed (no external deploy)
item_04: observer confirmed as human
item_05: redacted-only output policy confirmed
item_06: stop conditions listed (9 items) and understood
item_07: evidence template confirmed (LOCAL_APP_OBSERVATION_EVIDENCE_TEMPLATE.md)
item_08: forbidden scope confirmed (no Level 3 / productionReady / execution)
item_09: robot / StackChan / device / voice / camera / mic: not connected / not approved
item_10: raw values / secrets / local-only values: not to be reported
item_11: pre-run checks (13 items) reviewed
item_12: post-observation decision options understood (3 options)
item_13: this wording review document is not itself GO — a separate human message is required
```

All 13 items must be confirmed before the human issues GO.

## Safety Boundary

```text
decision: HOLD
execution: disabled
productionReady: false
rawValuesReported: false
robotMotion: HOLD
Level 3: not approved
Local App Observation execution: not approved by this document
Electron dev-mode: not approved by this document
Final Shikishima 100%: not complete
future_git_push: not approved
```

This document records wording review only. It does not constitute GO.
