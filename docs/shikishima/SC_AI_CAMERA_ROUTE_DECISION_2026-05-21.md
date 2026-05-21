# SC-AI / SC-CAM Route Decision

date: 2026-05-21
status: DRAFT_ROUTE_DECISION
decision: HOLD
execution: disabled
productionReady: false
rawValuesReported: false

This document records the current route decision for StackChan fixed voice
output and one still image AI comment. It does not approve execution.

## Voice

```text
recommended_route: A first, then B if A cannot speak exact text
Route A: iPhone app / StackChan World manual voice capability check
Route B: PC/local bridge exact text only, if documented safe path exists
Route C: custom firmware only if required, but HOLD
```

## Camera

```text
recommended_route: A first
Route A: iPhone app shows camera; human manually provides one safe still image
Route B: PC one-frame capture only if a safe no-stream path is confirmed
Route C: custom firmware only if required, but HOLD
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
next: SC-AI-01 fixed text voice one-shot route check
alternate_next: SC-CAM-01 still image comment one-shot route check
rule: choose one gate only, with explicit human GO
```

