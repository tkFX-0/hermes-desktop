# Practical Local MVP Operation Definition

## Document Status

```text
roadmapVersion: v3.7.0
status: definition_only
execution: disabled
productionReady: false
date_created: 2026-05-14
```

## Purpose

This document defines what "Practical Local MVP Operation" means for the
Shikishima project.

It is a definition document only. It does not approve execution.

## Operation Tiers

```text
Level B0: readiness docs only
  → Track B preparation docs created and reviewed
  → No app started

Level B1: Local App Observation
  → One-time human-supervised observation within explicit GO + time_window
  → Command: .\node_modules\.bin\electron.cmd .
  → Redacted evidence recorded only

Level B2: Local App Evidence Accepted
  → Human reviewer accepts B1 evidence
  → accepted_as_local_app_observation_evidence

Level B3: Practical Local MVP Operation Rules
  → Human-supervised repeated local app usage
  → Rules defined (who, when, what outputs, stop conditions)
  → Loop proposal approved

Level B4: Repeated Local Observation Loop
  → Controlled autonomous loop within approved scope
  → Each loop: read status → observe → record → compare → next task

Level C: Level 3 candidate (not approved)
  → Requires separate explicit GO
  → Requires Level 3 approval
  → Not a natural extension of Level B
```

## Definition: Practical Local MVP Operation

```text
Human-supervised local app usage only.
No autonomous execution.
No external deployment.
No robot / voice / device runtime.
No productionReady true.
No raw / local-only value exposure.
No WSL / Hermes / wrapper execution.
No npm install / npx / transient package execution.
```

Practical Local MVP Operation allows:

```text
- Opening the app with the approved local binary
- Observing UI screens and status labels
- Recording redacted evidence (PASS / HOLD / NG, counts)
- Comparing results across sessions
- Generating next recommended tasks based on observations
- Stopping at any execution boundary
```

## What Must Be Verified Each Session

```text
app_launches: app opens with .\node_modules\.bin\electron.cmd .
status_visible: status labels visible (HOLD, disabled, false)
hold_state_visible: decision=HOLD visible or documented
execution_disabled_visible: execution=disabled visible
productionReady_false_visible: productionReady=false visible
rawValuesReported_false: no raw values appear in UI
level_3_not_approved: Level 3 not approved visible or documented
observation_evidence_recordable: evidence can be recorded in template
no_secrets_in_ui: no secrets / raw / local-only values appear
no_unexpected_file_changes: working tree clean after observation
no_unexpected_network_prompt: no deploy / Cloudflare / external prompts
no_robot_voice_device_prompt: no robot / voice / device prompts
stop_conditions_functional: STOP is possible at any moment
```

## What Remains HOLD

```text
execution enabled: HOLD
productionReady true: HOLD
Level 3: HOLD
External deployment: HOLD
Cloudflare: HOLD
WSL / Hermes / wrapper: HOLD
robot / StackChan runtime: HOLD
robot connection / motion: HOLD
voice / camera / mic: HOLD
autonomous code execution: HOLD
autonomous push: HOLD
autonomous package install: HOLD
```

## What Would Be Required for Level 3 Candidate

```text
Level B2 accepted (Local App Observation evidence accepted)
Level B3 operational rules defined and in use
Multiple observation sessions PASS
Human decision to nominate Level 3 candidate
Separate explicit Level 3 GO
```

## Safety Boundary

```text
decision: HOLD
execution: disabled
productionReady: false
rawValuesReported: false
robotMotion: HOLD
Level 3: not approved
Local App Observation execution: requires separate GO
Final Shikishima 100%: not complete
```
