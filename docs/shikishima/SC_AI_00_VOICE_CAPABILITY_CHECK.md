# SC-AI-00 Voice Capability Check

date: 2026-05-21
status: ROUTE_CHECK_UPDATED
result: HOLD
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
iphone_voice_output: UNCONFIRMED
arbitrary_text_speech: UNCONFIRMED
voice_output_trigger_once: NOT_READY
firmware_write_required: false for menu inspection
```

Route A is the safest first route if the app can speak exact text or a preset
phrase without firmware changes.

Current decision:

- Route A remains first priority.
- Fixed text speech has not been proven.
- Codex cannot confirm the iPhone menu without the human operating the app.
- SC-AI-01 execution GO is not ready until the app can trigger one exact or
  acceptable fixed phrase without firmware changes.

### Route B - PC / Local Bridge

```text
pc_text_to_speech_possible: UNCONFIRMED
current_firmware_support: UNCONFIRMED
arbitrary_command_execution_allowed: false
```

Route B needs a documented safe request path before one-shot execution.

Current decision:

- Route B is second priority.
- Current Shikishima source keeps StackChan voice/camera/mic display-only and
  does not expose a confirmed StackChan speech push API.
- No serial/API command may be attempted until the command surface is documented
  and constrained to one exact text output.

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
  iphone_voice_output: UNCONFIRMED
  arbitrary_text_speech: UNCONFIRMED
  pc_text_to_speech_possible: UNCONFIRMED
  current_firmware_support: UNCONFIRMED
  custom_firmware_required: POSSIBLE
  safest_next_route: Route A voice menu/capability check only; Route B if Route A cannot speak fixed text
```

---

## Result

```text
result: HOLD
reason: exact text or fixed phrase speech is not confirmed
next_gate: SC-AI-00A iPhone voice menu/capability check, then SC-AI-01 if fixed speech is possible
```

---

## Next GO Proposal Status

```text
sc_ai_01_fixed_text_voice_go_ready: false
blocking_confirmation:
  - confirm whether iPhone app can trigger speech once
  - confirm whether exact or acceptable fixed text can be selected
  - confirm whether current UserDemo exposes a documented speech route
  - confirm no firmware write is requested
  - confirm no motion/dance/microphone loop starts
```

---

## Human Check Request

```text
route_a_iphone_menu_checked: false
human_check_needed: true
check_only:
  - Voice / Talk / Speak / Chat / TTS / Text / Message / AI / LLM
  - 読み上げ / 発話 / 会話 / 音声
do_not_press_if:
  - it would speak immediately
  - it asks for microphone
  - it starts motion/dance
  - it asks for firmware update/write
```
