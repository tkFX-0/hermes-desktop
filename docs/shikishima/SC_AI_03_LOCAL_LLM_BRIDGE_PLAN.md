# SC-AI-03 Local LLM Bridge Plan

date: 2026-05-21
status: PLAN
decision: HOLD
execution: disabled
productionReady: false
rawValuesReported: false

This document records the no-new-API route for local LLM conversation.

No install, model download, server start, network tunnel, external API, token
creation, productionReady true, or execution enabled is approved here.

---

## Purpose

Prepare a local-only dialogue backend for Shikishima/StackChan when cloud/API
routes are not desired.

---

## Candidate Local Routes

| Route | Status | Notes |
|---|---|---|
| Already-running Ollama-compatible endpoint | HOLD | Requires local runtime GO and endpoint confirmation. |
| Already-running LM Studio local server | HOLD | Requires local runtime GO and model confirmation. |
| llama.cpp server | HOLD | Requires build/install/run GO, not approved here. |
| Bundled model inside app | FUTURE | Requires package/model asset policy; not approved. |

---

## Bridge Contract

```text
request:
  prompt:
  max_turns: 1
  max_tokens:
  temperature:
  tools_allowed: false

response:
  text:
  route:
  elapsed_ms:
  error_redacted:
```

No raw local endpoint, model path, token, or local-only value should be printed
in public evidence.

---

## Recommended First Local Test

```text
gate: SC-AI-02
route_selected: local_llm
condition: user confirms local model server is already running
action: one text prompt only
voice: false
camera: false
motion: false
```

---

## Still HOLD

- installing Ollama / LM Studio / llama.cpp
- downloading models
- starting background server
- opening firewall ports
- exposing local endpoint externally
- using local model for autonomous loop

