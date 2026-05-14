# Local App Observation Readiness

## Document Status

```text
roadmapVersion: v3.4.0
status: readiness_scope_only
track: B
Local App Observation execution: not approved
Electron dev-mode: not approved
Level 3: not approved
productionReady: false
execution: disabled
date_created: 2026-05-14
```

## Purpose

This document defines the readiness scope for Track B: Local App Observation.

It is docs-only. It does not approve any execution.

Before any Local App Observation can occur, a separate scope proposal must be
reviewed and a new explicit human GO must be issued with a filled time_window.

## What Local App Observation Means

Local App Observation is a future human-supervised observation of the local
app UI and status only.

```text
scope: local only
observer: human
execution mode: Electron dev-mode (requires separate explicit GO)
output: redacted evidence only — status labels, PASS/HOLD/NG, counts
screenshots: only if no secrets / raw values / local-only values visible
```

## What Local App Observation Does NOT Include

```text
external deployment: not included
Cloudflare / hosting / CDN: not included
robot / StackChan / device: not included
voice / camera / mic: not included
autonomous actions: not included
raw values: not included
secrets: not included
tokens: not included
local-only config values: not included
WSL / Hermes / wrapper: not included
productionReady: not changed
Level 3: not approved
```

## Preconditions Before GO Can Be Issued

All of the following must be confirmed before any Local App Observation GO:

```text
pre_1: Level 2 evidence accepted (completed — accepted_as_level_2_validation_evidence)
pre_2: Track B readiness package reviewed by human
pre_3: scope proposal reviewed and accepted by human
pre_4: GO wording reviewed by human
pre_5: time_window filled by human before sending GO
pre_6: observer confirmed (human)
pre_7: no pending HOLD items in forbidden scope
pre_8: working tree verified (staged 0, actual diff 0)
pre_9: redacted-only output policy confirmed
pre_10: stop conditions listed and understood
```

## Allowed Observation Activities

When a future GO is issued, the following are candidates for the observation:

```text
- Launch app in Electron dev-mode (requires explicit GO)
- Observe UI screens for basic rendering
- Check app status displays (no raw values)
- Check navigation between screens (no secrets visible)
- Record screen names and layout health as PASS/HOLD/NG
- Note any visible errors or unexpected behavior
```

All observations must be redacted. No raw values, tokens, paths, or
secrets may appear in any evidence output.

## Forbidden Activities

At any point during Local App Observation:

```text
- Run commands not in the approved scope
- Output raw values, tokens, secrets, local-only config
- Connect to external services
- Trigger network requests beyond local dev-mode
- Start robot/StackChan/device/voice/camera/mic
- Stage or commit source changes
- Install packages
- Run npm install / npx
- Access private local paths in evidence
- Approve Level 3 or productionReady true
```

## Stop Conditions

Stop immediately and do not continue if:

```text
- Any secret, token, raw value, or local-only value is visible in output
- App makes unexpected external network requests
- Any deploy, Cloudflare, or external push prompt appears
- Any robot/StackChan/device/voice/camera/mic prompt appears
- App crashes in a way that reveals private paths or config
- Any behavior outside the approved observation scope occurs
- time_window expires
```

## Human Decision Options After Observation

After a completed Local App Observation, the human may choose:

```text
observation_passed: proceed to Local App Observation GO wording review for next gate
observation_needs_follow_up: identify specific screens or issues for re-check
observation_hold: stop and investigate before proceeding
```

## Safety Boundary

```text
decision: HOLD
execution: disabled
productionReady: false
rawValuesReported: false
robotMotion: HOLD
Level 3: not approved
Local App Observation execution: not approved
Final Shikishima 100%: not complete
future_git_push: not approved
```

This document records readiness scope only. It does not approve execution.
