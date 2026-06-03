# Grok-Hermes Provider Architecture Review

## Document Status

```
date:              2026-05-18
status:            docs-only research — NOT implementation approval
decision:          HOLD
execution:         disabled
productionReady:   false
oauth_performed:   false
runtime_started:   false
```

---

## Purpose

Record the official Grok-Hermes OAuth integration finding and its architectural
implications for the Shikishima provider design.

This document is NOT:
- An approval to run OAuth
- An approval to run Hermes
- An approval to send external API calls
- A runtime GO

This document IS:
- A record of external research findings
- A candidate specification for future gate consideration
- A basis for GHG-00 through GHG-09 gate definition

---

## Official Integration Summary

Sources indicate:

```
integration:       xAI Grok subscription usable inside Nous Research Hermes Agent
provider_id:       xai-oauth
default_model:     grok-4.3
auth_mechanism:    browser-based OAuth flow against accounts.x.ai
api_key_required:  false (OAuth bearer token used instead of XAI_API_KEY)
credential_store:  ~/.hermes/auth.json (local only; auto-refresh)
```

Bearer token from OAuth can be reused by Hermes for these surfaces:
- chat (primary conversation)
- auxiliary tasks
- TTS
- image generation
- video generation
- transcription
- X Search

Default-off surfaces (HOLD until explicitly enabled):
- x_search (off by default in Hermes)
- video generation (off by default in Hermes)

---

## Old Shikishima Hermes Assumption

Prior architecture assumed:
- XAI_API_KEY required for any xAI model access
- Grok access = direct REST API with key-based auth
- No OAuth path was modeled

---

## New Architecture Implication

With xai-oauth provider:
- Grok chat access via existing Grok subscription (no per-token billing for chat)
- Hermes manages token lifecycle automatically
- No raw API key needed for primary conversation surface
- Subscription tier determines model/quota availability (must verify locally)

This changes the Shikishima provider cost model:
- Primary chat: Grok subscription (subscription cost, not API cost)
- Fallback: Gemini Flash / Flash-Lite (low API cost)
- Manual escalation: GPT / Claude (high capability, explicit GO per use)
- XAI_API_KEY: retained as fallback only for non-OAuth surfaces

---

## Why Grok-Hermes OAuth Is a Formal Candidate

1. Cost-efficiency: subscription-based chat vs. per-token API billing
2. Integration maturity: official xAI + Nous Research partnership
3. Model quality: Grok 4.3 is a capable primary conversation model
4. Familiar UX: same OAuth pattern as other Hermes providers

---

## Why This Is NOT Implementation Approval

- OAuth login has not been performed
- Hermes version/availability on this machine has not been verified
- Subscription tier (X Premium / SuperGrok / etc.) has not been verified locally
- Auth boundary review (GHG-02) has not been completed
- No chat-only dry run has been conducted
- No redacted provider status has been reviewed by human

---

## Why This Is NOT OAuth Approval

OAuth login requires:
- Separate human GO at GHG-03
- Human confirms browser auth flow
- Human confirms auth.json location and permissions
- Human confirms no raw token is exposed in logs or UI

---

## Why This Is NOT Runtime Approval

Hermes runtime requires:
- productionReady gate (currently false)
- execution gate (currently disabled)
- Controlled observation time_window from human
- HOLD maintained until all GHG gates are passed in order

---

## Provider Classification

```
role:                 primary_conversation_candidate
activation_gate:      GHG-03 (OAuth login GO) minimum
chat_only_first:      yes — GHG-05 chat-only dry run before tool expansion
tools_hold:           x_search, TTS, image, video, transcription — all HOLD
subscription_tier:    unverified — must be confirmed locally before use
```

---

## Candidate Provider Table

| Provider | Role | Trigger | Cost model | Status |
|---|---|---|---|---|
| xai-oauth (Grok 4.3) | Primary conversation | Subscription | Subscription | HOLD until GHG-03+ |
| Gemini Flash/Flash-Lite | Cheap fallback | Utility/summary | Low API | HOLD |
| GPT / Claude | Manual escalation | High-stakes | High API | HOLD |
| XAI_API_KEY | Direct API fallback | Non-OAuth surface | Per-token | HOLD |
| Local rule-based | Local-only | No external call | None | Inactive |

---

## Reference Gate

See `GROK_HERMES_PROVIDER_GATE.md` for GHG-00 through GHG-09.

---

_Created: 2026-05-18_
_productionReady: false_
_execution: disabled_
