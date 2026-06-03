# HB-01 Hermes / WSL Gate Readiness

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** HOLD — design-ready, no execution, gate closed
**gate:** HB01_HERMES_WSL_GO required before any action

---

## Summary

Hermes/WSL bridge infrastructure is **design-ready** but has no execution capability.
The outcome type is `"designReadyNoExecution"` — no `wsl.exe` launch occurs.
The gate remains HOLD. This document does not open the gate.

---

## Codebase Inventory

Files found in `src/main/ichikishima/hermes/`:

| File | Role | Execution State |
|---|---|---|
| `hermes-bridge.ts` | Contract layer — defines operation kinds | No execution |
| `hermes-wsl2-wrapper-config.ts` | WSL wrapper config + outcome type | `"designReadyNoExecution"` |
| (additional pilot/readiness/adapter files) | Infrastructure stubs | No execution |

### hermes-bridge.ts — Operation Kinds Defined

```text
zone_read
zone_write
execute_shell
network_http
(others per contract)
```

All are contract definitions only. No IPC channel dispatches them to an active process.

### hermes-wsl2-wrapper-config.ts — Outcome Type

```yaml
outcome: "designReadyNoExecution"
```

This is an explicit design sentinel. It means:
- Infrastructure is designed and documented
- No `wsl.exe` is launched
- No shell command is executed
- No bridge process is started

---

## What Would Be Required to Open HB-01

The following are prerequisites — this document does not approve any of them.

### Environment prerequisites

```text
- WSL2 installed and configured on host machine
- Hermes process running inside WSL2 (separate install/setup phase)
- IPC channel: main → WSL bridge → Hermes
- Approved command list (explicit, no wildcards)
- Token/env policy: no token printed to any log or UI
- Rollback and shutdown path defined
```

### Codebase prerequisites

```text
- Activate IPC handler for Hermes bridge operations
- Wire hermes-bridge.ts contract to actual wsl.exe call (separate GO needed)
- Implement approved command list enforcement
- Implement output redaction (no raw values in any channel)
- Implement shutdown / process kill path
```

### Gate form required before opening

```text
hb01_hermes_wsl_go:
  date:
  time_window:
  purpose:
  allowed_environment:
  allowed_commands:
  forbidden_commands:
  token_policy:
  expected_result:
  stop_if:
  shutdown:
  evidence_file:
```

---

## Current State

```yaml
hermes_bridge:        design-ready
wsl_execution:        none (designReadyNoExecution)
ipc_active:           false
wsl_process:          not started
token_policy:         not defined
gate:                 HOLD
hb01_hermes_wsl_go:   not issued
external_write:       blocked (global)
```

---

## Gate Condition

HB-01 may open only when:

1. Explicit human `hb01_hermes_wsl_go` is issued with all required fields
2. WSL2 environment is confirmed running and stable
3. Approved command list is explicit (no wildcards)
4. Token policy is defined and approved
5. Shutdown / rollback path is verified
6. Stop conditions are defined in advance

This document does not open the gate.

---

## Safety

```yaml
productionReady:      false
execution:            disabled
rawValuesReported:    false
external_write:       blocked
wsl_execution:        none
hermes_bridge:        HOLD
```
