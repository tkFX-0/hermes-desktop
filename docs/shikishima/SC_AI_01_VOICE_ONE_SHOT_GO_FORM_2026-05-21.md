# SC-AI-01 Voice One-shot GO Form

date: 2026-05-21
status: DRAFT / NOT APPROVED / ROUTE NOT CONFIRMED
decision: HOLD
execution: disabled
productionReady: false
rawValuesReported: false

This form is a draft for one fixed StackChan voice output. It is not approval.

Current readiness:

```text
ready_for_execution_go: false
reason: exact/fixed text speech route has not been confirmed
required_first: SC-AI-00A iPhone voice menu/capability check or documented PC bridge route
```

## Required Human Fields

```text
time_window:
route_selected: A / B / C
exact_text_to_speak:
expected_output:
evidence_file:
```

Default exact text:

```text
しきしまです。StackChan音声の接続確認です。
```

## Allowed If Approved Later

- one voice output
- exact text only
- one run count
- no loop
- no motion
- no dance
- no camera

## Forbidden

- voice chat loop
- microphone always-on
- arbitrary conversation
- motion / dance
- firmware write
- Burn / Erase / Firmware Exporter Start
- productionReady true
- execution enabled

## STOP Conditions

- more than one voice output occurs
- unexpected motion starts
- microphone turns on unexpectedly
- firmware change is requested
- connection becomes unstable
- raw token/secret/local-only value appears
