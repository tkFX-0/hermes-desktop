# StackChan Display Route Implementation

Date: 2026-05-28
Macro: `/goalmacro shikishima.stackchan-display-route-implementation`
Baseline: `origin/main` = `3cc290b`

---

## Result

```text
status: ROUTE_GUARD_IMPLEMENTED
```

---

## What Was Implemented

A pure shared guarded display route contract:

```text
src/shared/stackchan-display-route/
  stackchan-display-route-types.ts
  stackchan-display-route.ts
  stackchan-display-route.test.ts
  index.ts
```

Function: `evaluateStackChanDisplayRoute(request) → StackChanDisplayRouteResult`

---

## What It Does

```text
- validates display intent (via display-preview contract)
- validates readiness fields (human, manual stop, screen, time window)
- creates display preview for allowed intents
- returns route decision: READY_FOR_FUTURE_SEND | HOLD | BLOCKED
- keeps actual display send disabled (safety flags always false)
```

---

## What It Does Not Do

```text
- no StackChan connection command
- no WebSocket send
- no serial connection
- no firmware write / erase
- no motion / dance / touch behavior change
- no voice / mic / camera
- no runtime start
- no external action / Discord send
- no src/main, preload, or renderer changes
```

---

## Meaning of READY_FOR_FUTURE_SEND

```text
READY_FOR_FUTURE_SEND means the request is ready for a separate future GO.
It does NOT mean the device was contacted.
It does NOT approve actual display send.
Actual display pilot execution remains HOLD.
```

---

## Decision Matrix

| Condition | Decision |
|-----------|----------|
| All readiness true + valid intent + invariants false | `READY_FOR_FUTURE_SEND` |
| Missing human / stop / screen / time window | `HOLD` |
| Invalid intent, productionReady, execution, send approved | `BLOCKED` |

---

## Device Wiring Status

```text
Device wiring design: DEVICE_WIRING_DESIGN_PREPARED (see STACKCHAN_DISPLAY_ROUTE_DEVICE_WIRING_DESIGN.md)
Main-process adapter: not implemented
Actual display send: HOLD
```

## Next Steps

```text
/goalmacro shikishima.stackchan-display-route-device-wiring-implementation
→ stackchan-display-pilot-retry-preflight
→ stackchan-display-pilot-retry
```

Device adapter in `src/main` requires separate implementation GO.

---

## Safety

```text
actualDisplaySendPerformed: false (always)
actualDisplaySendApproved: false (always in safety block)
productionReady: false
execution: disabled
rawValuesReported: false
```
