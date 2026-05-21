# SC-MCP-01 XiaoZhi MCP One-shot GO Form

date: 2026-05-21
status: DRAFT / NOT APPROVED
decision: HOLD
execution: disabled
productionReady: false
rawValuesReported: false

This is a draft GO form for one controlled XiaoZhi MCP route test. It is not
approval to connect.

---

## Required Human Fields

```text
time_window_jst:
purpose:
endpoint: XiaoZhi MCP WebSocket endpoint
token_input_method: human-only / not pasted to chat
token_storage_policy:
allowed_action:
  - capability_list_only
  - fixed_text_speech_one_shot
  - text_dialogue_one_shot
selected_action:
exact_text_to_speak:
exact_user_prompt:
allowed_tool_names:
evidence_file:
stop_conditions:
```

---

## Default Minimal Action

Recommended first action:

```text
selected_action: capability_list_only
speech: false
microphone: false
camera: false
motion_dance: false
firmware_write: false
external_write: false
```

Speech should only be selected after capability listing confirms a safe
fixed-text speech route.

---

## Fixed Speech Candidate

If speech is later explicitly selected:

```text
exact_text_to_speak: しきしまです。StackChan音声の接続確認です。
allowed_speech_count: 1
loop: false
```

---

## Forbidden

- token pasted into chat
- token printed in logs/evidence
- microphone always-on
- camera monitoring
- autonomous conversation loop
- arbitrary tool call
- motion / dance
- firmware write
- external write
- productionReady true
- execution enabled

---

## STOP Conditions

- token becomes visible
- unexpected tool list includes dangerous commands
- speech starts without selected action
- microphone/camera starts
- motion/dance starts
- firmware update/write is requested
- connection cannot be closed cleanly

---

## After-action Verification

```text
xiaozhi_connected:
selected_action:
run_count:
token_reported: false
tools_executed:
speech_executed:
gate_restored_hold:
productionReady: false
execution: disabled
rawValuesReported: false
```

