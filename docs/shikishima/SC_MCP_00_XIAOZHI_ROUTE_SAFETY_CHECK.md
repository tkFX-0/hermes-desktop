# SC-MCP-00 XiaoZhi MCP Route Safety Check

date: 2026-05-21
status: SAFETY_CHECK
decision: HOLD
execution: disabled
productionReady: false
rawValuesReported: false

This document records the observed XiaoZhi MCP route for future StackChan
conversation/speech integration.

Observed by human:

```text
mcp_endpoint_shape: wss://api.XiaoZhi.me/mcp/?
token_available: true
token_recorded: false
token_shared_with_codex: false
```

This is an external WebSocket MCP route with token authentication. It may be
useful for StackChan speech/conversation, but it is not opened here.

---

## Current Classification

```text
route: Route B candidate
type: external_mcp_websocket
provider: XiaoZhi
connection_status: HOLD
token_status: human-held / not recorded
speech_confirmed: false
tools_confirmed: false
```

---

## Why This Is Not Opened Automatically

The route involves:

- external WebSocket connection
- token authentication
- possible tool execution through MCP
- possible speech/TTS/chat behavior

Therefore it requires a dedicated human GO with scope, time window, token
policy, tool policy, and stop conditions.

---

## Required Preflight Checks

Before any connection:

```text
time_window_jst:
purpose:
endpoint_confirmed_without_token:
token_storage_policy:
token_redaction_policy:
allowed_tools:
forbidden_tools:
speech_allowed:
microphone_allowed: false
camera_allowed: false
motion_dance_allowed: false
firmware_write_allowed: false
external_write_allowed: false
run_count: 1
evidence_file:
```

---

## Allowed Future Minimal Test

If approved later:

- one connection attempt
- list capability names only if safe
- no raw token output
- no tool execution unless explicit
- no speech unless SC-MCP-01 says speech is allowed
- disconnect after test
- restore gate to HOLD

---

## Forbidden Without Separate GO

- saving or printing token
- arbitrary MCP tool execution
- continuous conversation
- microphone always-on
- camera monitoring
- motion / dance
- firmware write
- external API write
- productionReady true
- execution enabled

---

## Safety Boundary

```text
xiaozhi_connected: false
token_reported: false
mcp_tools_executed: false
speech_executed: false
microphone_used: false
camera_used: false
motion_dance_used: false
firmware_written: false
external_api_write: false
productionReady: false
execution: disabled
```

