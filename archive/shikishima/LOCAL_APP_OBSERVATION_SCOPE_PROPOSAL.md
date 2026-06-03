# Local App Observation Scope Proposal

## Document Status

```text
roadmapVersion: v3.4.0
status: proposal_only
scope_approved: false
execution_approved: false
GO_issued: false
time_window: required — must be filled by human before GO
date_created: 2026-05-14
```

## Purpose

This document proposes a future scope for Local App Observation.

All commands and activities listed here are **proposed only, not approved by
this document**. A separate human GO with a filled time_window is required
before any execution begins.

## Proposed Future Observation Scope

### Proposed Command

```text
npx electron . (dev-mode)
```

This is a proposed command only. It is not approved to run by this document.

### Proposed Time Window

```text
time_window: <YYYY-MM-DD HH:MM-HH:MM JST>
```

The human must fill this value before issuing GO. A GO without a filled
time_window is not valid.

### Proposed Observer

```text
observer: human (required)
```

### Proposed Observation Target

```text
- App launch and initial screen rendering
- Navigation between main screens
- UI layout health (PASS/HOLD/NG)
- Console output for errors (redacted — no raw paths/tokens/secrets)
- App status displays (redacted only)
```

### Proposed Output Format

```text
output: redacted evidence only
allowed: status labels (PASS / HOLD / NG), screen names, error categories, counts
allowed_screenshots: only if no secrets / raw values / local-only values visible
forbidden: raw paths, tokens, secrets, credentials, private config values,
           raw stdout/stderr transcripts, raw IPC payloads
```

### Proposed Duration

```text
max_duration: bounded by time_window
early_stop: on any stop condition
```

## Proposed Stop Conditions

Stop immediately if any of the following occur:

```text
stop_1: any secret, token, raw value, or local-only value appears in output
stop_2: app makes unexpected external network requests
stop_3: any deploy, Cloudflare, or external push prompt appears
stop_4: any robot/StackChan/device/voice/camera/mic prompt appears
stop_5: app crashes revealing private paths or config
stop_6: any behavior outside the proposed observation scope occurs
stop_7: time_window expires
```

## Proposed Evidence Output Format

After observation, evidence must be structured as:

```text
status: PASS / HOLD / NG
time_window: <actual window used>
screens_checked: [list of screen names only]
result_per_screen: [screen name]: PASS / HOLD / NG
issues_found: [category only, no raw values]
stop_conditions_triggered: yes / no
raw_values_reported: false
secrets_reported: false
working_tree_before_after: staged 0/0, actual diff 0/0
next_required_human_action: [description]
```

## Proposed GO Wording Template

The following is a proposed future GO wording template.

**This wording is proposed only, not approved by this document.**

```text
Proposed future GO wording — not approved by this document:

I explicitly approve this one scoped Local App Observation only.

Approved action: launch app in Electron dev-mode; observe screens listed below;
record redacted evidence only; stop on any stop condition.

time_window: <YYYY-MM-DD HH:MM-HH:MM JST>
observer: human
screens: [to be confirmed at GO time]
output: redacted only
stop_on_any_secret_or_raw_value: yes
```

The human must replace all placeholder values before sending the actual GO.

## What This Proposal Does Not Approve

```text
Level 3: not approved
productionReady true: not approved
execution enabled: not approved
external deployment: not approved
Cloudflare: not approved
WSL / Hermes / wrapper: not approved
robot / StackChan runtime: not approved
robot connection: not approved
robot motion: not approved
voice / camera / mic: not approved
raw values / secrets / local-only values in output: not approved
package changes: not approved
source changes: not approved
future git push: not approved
```

## Safety Boundary

```text
decision: HOLD
execution: disabled
productionReady: false
rawValuesReported: false
robotMotion: HOLD
Level 3: not approved
Local App Observation execution: not approved by this document
Final Shikishima 100%: not complete
future_git_push: not approved
```

This document is a scope proposal only. It does not constitute GO.
