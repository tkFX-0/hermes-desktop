# SC-MCP-01 XiaoZhi MCP One-shot Evidence Template

result: PASS / PARTIAL / HOLD / STOP

```text
baseline:
  date:
  time_window_jst:
  endpoint_shape: wss://api.XiaoZhi.me/mcp/?
  token_reported: false

connection:
  xiaozhi_connected:
  selected_action:
  run_count:
  disconnected_after:

capability:
  capability_list_observed:
  safe_speech_tool_found:
  safe_text_dialogue_tool_found:
  dangerous_tool_found:

speech:
  speech_executed:
  exact_text:
  spoken_once:
  unexpected_motion:

safety:
  token_output:
  microphone_used:
  camera_used:
  motion_dance_used:
  firmware_write:
  external_api_write:
  productionReady:
  execution:
  rawValuesReported:
  gate_restored_hold:
```

Notes:

- Do not paste or record raw token values.
- If tool names reveal sensitive local values, redact them.
- If any unexpected execution occurs, result is STOP.

