# Device Roles and Boundaries

## Purpose

This document defines device roles for the しきしま計画. It does not change
network settings, connect devices, or approve execution.

Current state:

- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false
- phaseStatus: draft_created / documentation_only

## Device Matrix

| Device | Role | Allowed uses | Forbidden uses | Approval requirement |
|---|---|---|---|---|
| RTX 4070 12GB PC | development/runtime base | local development, local LLM experiments, main control environment | unapproved execution, raw value publishing | human approval for execution |
| Mini PC | deferred optional always-on node | future evaluation only | treating as required now | separate device decision |
| Lenovo TAB6 | display monitor | read-only dashboard and review | execution controller | human approval for control features |
| Redmi 12 | prototype face/expression terminal | Android HTML/PWA face candidate | autonomous control or private capture | separate sensor approval |
| iPhone 15 Pro | private review/planning device | read-only review and approval notes | execution controller | separate approval before any control role |
| StackChan | future expression robot | expression-only plan | autonomous motion or control | しずめ plus human approval |
| RunPod | external GPU room | explicit approved experiments only | local-only/private values by default | explicit scoped approval |

## Data Handling

- Private/local-only data stays local.
- Raw values must not be written to tracked docs.
- Device status may be documented using roles, enums, and approval state only.

この範囲では問題を検出していません。
