# SC-AI / SC-CAM Route Decision

date: 2026-05-21
status: ROUTE_DECISION_UPDATED
decision: HOLD
execution: disabled
productionReady: false
rawValuesReported: false

This document records the current route decision for StackChan fixed voice
output and one still image AI comment. It does not approve execution.

## Voice

```text
recommended_route: A capability check first; SC-AI-01 execution GO is not ready yet
Route A: iPhone app / StackChan World manual voice capability check
Route B: PC/local bridge exact text only, if documented safe path exists
Route C: custom firmware only if required, but HOLD
current_readiness: HOLD until exact/fixed speech output is confirmed
```

## Camera

```text
recommended_route: deferred
Route A: iPhone app shows camera; human manually provides one safe still image
Route B: PC one-frame capture only if a safe no-stream path is confirmed
Route C: custom firmware only if required, but HOLD
current_readiness: SC-CAM-01 GO form is ready for human review
priority: deferred until voice route is settled
```

## Explicit Non-Approvals

```text
continuous_monitoring_today: false
autonomous_conversation_today: false
motion_dance_today: false
microphone_always_on: false
productionReady_true: false
execution_enabled: false
firmware_write: false
external_api_write: false
```

## Next Recommended Gate

```text
next: SC-AI-00A voice menu capability check
voice_status: SC-AI-01 execution GO not ready until fixed speech route is confirmed
camera_status: deferred; SC-CAM-01 GO form remains draft-only
rule: choose one gate only, with explicit human GO
```
