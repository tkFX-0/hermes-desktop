# SC-AI-02 Text Dialogue One-shot GO Form

date: 2026-05-21
status: DRAFT / NOT APPROVED
decision: HOLD
execution: disabled
productionReady: false
rawValuesReported: false

This form is for one text-only AI dialogue test. It does not approve voice,
microphone, camera, StackChan motion, firmware write, external write, or
production readiness.

---

## Required Human Fields

```text
time_window_jst:
route_selected: existing_text / local_llm / future_grok
exact_user_prompt:
tools_allowed: false
expected_result:
evidence_file:
```

Default prompt:

```text
しきしま、StackChanに話しかける前の会話テストです。短く一文で返事してください。
```

---

## Allowed If Approved Later

- one user prompt
- one AI answer
- text-only
- no tool use unless explicitly added to the GO
- evidence record

---

## Forbidden

- microphone
- voice output
- TTS
- camera
- motion / dance
- firmware write
- external API write
- social post/reply
- autonomous loop
- productionReady true
- execution enabled

---

## STOP Conditions

- model asks for token/secret
- model attempts external write
- tool call starts without GO
- more than one turn starts
- microphone/camera/voice activates
- raw token/secret/local-only value appears

