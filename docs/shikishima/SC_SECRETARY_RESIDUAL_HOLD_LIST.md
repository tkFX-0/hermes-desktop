# SC Secretary Residual HOLD List

date: 2026-05-26
status: ACTIVE_HOLD_LIST
scope: secretary and StackChan remaining gated actions

## Critical HOLD

These remain blocked until separate explicit human GO and evidence:

```text
productionReady true
execution enabled
continuous camera monitoring
microphone always-on
voice conversation loop
external API write
Discord/X/Obsidian write automation
autonomous retry loops
unbounded background daemon
firmware write / Burn / Erase
unsafe StackChan motion
```

## High-Risk HOLD

These may be opened later with bounded, visible, stoppable gates:

```text
SC-CAM-01 one still image comment
SC-CAM-MONITOR bounded local camera session
SC-MIC-SESSION bounded local microphone session
SC-ROUTINE-CHECKIN scheduled check-in
SC-EXTERNAL-WRITE one approved write
X / social read-only awareness
Hermes / WSL bridge
Command Chat real send
```

## Medium-Risk Follow-Up

These are allowed as refinement tasks when scoped:

```text
spoken tone tuning
forbidden phrase policy tuning
motion smoothness tuning
LED color tuning
pat sensitivity tuning
routine text templates
secretary status UI summary
evidence document cleanup
```

## Required Stop Conditions

Return to HOLD if any of these occur:

```text
unexpected second voice output
unexpected motion during a non-motion task
camera stream starts when only one image was approved
microphone stays active after a bounded session
external write occurs without GO
secret/token/local raw value is spoken or logged
retry loop begins
productionReady flips without final GO
execution flips without final GO
```

## Current Recommended Safe Next Step

```text
SC-ROUTINE-CHECKIN-DRY-RUN
```

Reason:

```text
It proves pause/stop and scheduler boundaries without requiring camera, microphone, external write, or productionReady.
```

