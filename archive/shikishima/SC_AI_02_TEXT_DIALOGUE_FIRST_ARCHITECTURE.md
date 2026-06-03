# SC-AI-02 Text Dialogue First Architecture

date: 2026-05-21
status: DESIGN
decision: HOLD
execution: disabled
productionReady: false
rawValuesReported: false

This document defines the first practical StackChan AI conversation route:
make the system able to hold a one-shot text dialogue before opening voice,
microphone, camera, motion, firmware, or external API gates.

The goal is:

```text
Shikishima = brain / prompt / judgment / record
StackChan = face / output device
first milestone = one text question -> one AI answer -> evidence
later milestone = one fixed answer spoken by StackChan
```

No API addition is approved here. No cloud API, OAuth, token creation, firmware
write, microphone, camera, motion, productionReady true, or execution enabled
is approved here.

---

## Why Text Dialogue First

Voice output is still unconfirmed:

```text
iphone_voice_output: MENU_PRESENT_UNCONFIRMED_OUTPUT
exact_text_speech: UNCONFIRMED
pc_text_to_speech_possible: UNCONFIRMED
```

Therefore the safe path is:

1. prove one local text dialogue path
2. record the generated answer
3. later route that exact answer to StackChan speech only after SC-AI-01 is ready

This avoids opening microphone, continuous conversation, TTS, or firmware work
before the dialogue path itself is proven.

---

## Route Options

### Route A - Existing Shikishima / Hermes Text Path

Use only already-configured Shikishima/Hermes text capability if available.

Allowed later with explicit GO:

- one prompt
- one response
- no tools unless already approved by the GO
- no external write
- evidence file

Still HOLD:

- voice output
- microphone
- autonomous loop
- StackChan actuation

### Route B - Local LLM

Use a locally running LLM only if the user has already installed and launched it
or gives a separate local-runtime GO.

Examples of local routes, for planning only:

- Ollama-compatible local endpoint
- LM Studio local server
- llama.cpp local server

No install or model download is approved here.

### Route C - Future Grok via Shikishima Agent

Future target:

- Shikishima agent uses existing Grok/x-linked capability as a conversation
  backend.

Status:

```text
future_route: HOLD
new_api_addition: false
requires_existing_gate: XACC / Grok route GO
```

This is not the first route because it depends on higher-risk external account
and provider gates.

---

## Minimal One-shot Dialogue Contract

```text
input:
  user_prompt:
  route_selected: existing_text / local_llm / future_grok
  max_turns: 1
  tools_allowed: false by default

output:
  assistant_answer:
  answer_recorded:
  rawValuesReported: false
  productionReady: false
  execution: disabled
```

---

## Safety Boundary

```text
voice_output: false
microphone_used: false
camera_used: false
motion_dance_used: false
firmware_written: false
external_write: false
new_api_added: false
productionReady: false
execution: disabled
```

