# SC-AI-00 Voice Capability Check

date: 2026-05-21
status: ROUTE_CHECK_DRAFT
result: PARTIAL
decision: HOLD
execution: disabled
productionReady: false
rawValuesReported: false

This document records the safe route check for making StackChan speak a single
human-approved fixed sentence through Shikishima in the future.

No speech output, microphone, voice loop, firmware write, motion, dance,
external API, productionReady true, or execution enabled is approved here.

---

## Voice Routes

### Route A - iPhone / StackChan World

```text
iphone_voice_output: UNKNOWN
arbitrary_text_speech: UNKNOWN
voice_output_trigger_once: UNKNOWN
firmware_write_required: false for menu inspection
```

Route A is the safest first route if the app can speak exact text or a preset
phrase without firmware changes.

### Route B - PC / Local Bridge

```text
pc_text_to_speech_possible: UNKNOWN
current_firmware_support: UNKNOWN
arbitrary_command_execution_allowed: false
```

Route B needs a documented safe request path before one-shot execution.

### Route C - Custom Firmware

```text
custom_firmware_required: POSSIBLE
build: HOLD
flash: HOLD
Burn: HOLD
Erase: HOLD
```

---

## Capability Summary

```text
voice:
  iphone_voice_output: UNKNOWN
  arbitrary_text_speech: UNKNOWN
  pc_text_to_speech_possible: UNKNOWN
  current_firmware_support: UNKNOWN
  custom_firmware_required: POSSIBLE
  safest_next_route: Route A menu/manual capability check, then Route B if needed
```

---

## Result

```text
result: PARTIAL
reason: voice routes are identified, but exact text speech is not confirmed
next_gate: SC-AI-01 fixed text voice one-shot GO form review
```

