# Provider Router Updated Design

## Document Status

```
date:            2026-05-18
status:          design doc — NOT implementation approval
decision:        HOLD
source:          GROK_HERMES_PROVIDER_ARCHITECTURE_REVIEW.md
```

---

## Provider Hierarchy

### Primary — Grok-Hermes OAuth

```
provider_id:   xai-oauth
model:         grok-4.3
mechanism:     Hermes OAuth bearer token (auto-refresh)
use_case:      ordinary conversation — daily Shikishima interaction
api_key:       not required
cost_model:    Grok subscription (not per-token API billing)
activation:    HOLD — requires GHG-03+ gates
chat_only:     yes (tools disabled until GHG-08+)
```

### Fallback — Gemini Flash / Flash-Lite

```
provider_id:   gemini-flash | gemini-flash-lite
use_case:      cheap utility tasks, summaries, low-priority background tasks
trigger:       xai-oauth unavailable, quota exceeded, or explicit route override
api_key:       GOOGLE_API_KEY (secured, never printed)
cost_model:    low per-token API billing
activation:    HOLD — requires separate Gemini provider gate
```

### Manual Escalation — GPT / Claude

```
provider_id:   openai | anthropic
use_case:      high-stakes decisions: security, finance, code review, architecture
trigger:       human explicitly routes a query to escalation tier
api_key:       OPENAI_API_KEY / ANTHROPIC_API_KEY (secured)
cost_model:    high per-token API billing — human confirms before use
activation:    HOLD — human GO required per escalation session
```

### API-Key Fallback — XAI Direct

```
provider_id:   xai (api-key mode)
model:         determined by key tier
use_case:      non-OAuth xAI surfaces only (if xai-oauth unavailable)
api_key:       XAI_API_KEY (fallback — cost-controlled)
activation:    HOLD — separate from xai-oauth gate
```

### Local — Rule-Based / Summarizer

```
provider_id:   local
use_case:      no-external-call operations: local rule evaluation, template fill
trigger:       offline mode, or query explicitly flagged as local-only
api_key:       none
cost_model:    none
activation:    always available (no gate required for local-only)
```

---

## Routing Rules

### Ordinary Conversation

```
condition:     standard Shikishima interaction
primary:       xai-oauth (Grok 4.3) if available and GHG-08+ passed
fallback_1:    human prompted to wait if xai-oauth unavailable
fallback_2:    Gemini Flash if human approves fallback routing
```

### Cheap Summary / Low-Priority Utility

```
condition:     background summarization, audit log summary, low-stakes classification
primary:       Gemini Flash / Flash-Lite
requires:      Gemini provider gate passed + human routing approval
```

### High-Stakes Design / Security / Financial / Code Review

```
condition:     security audit, code review, financial decision, architecture review
primary:       GPT / Claude (manual escalation)
requires:      human explicitly routes the query
              human confirms API cost before routing
              no autonomous escalation
```

### Provider Unavailable

```
condition:     xai-oauth token expired / Hermes unreachable / quota exceeded
action:        fallback to Gemini if available, OR
              prompt human: "xai-oauth unavailable — route to Gemini or defer?"
              no silent fallback without human awareness
```

### Quota / Rate Limit

```
condition:     provider returns quota or rate-limit error
action:        fallback to next tier OR defer task
              human notified
              no silent retry loop without bound
```

### Any External Action Request

```
condition:     any tool that writes, sends, or modifies external state
action:        HOLD — route to human approval queue
              no autonomous external write regardless of provider
              see GROK_HERMES_TOOL_HOLD_REGISTRY.md
```

---

## Routing Decision Matrix

| Query type | Provider | Condition | STOP if |
|---|---|---|---|
| Ordinary conversation | xai-oauth | GHG-08+ passed | tool activation attempt |
| Cheap utility | Gemini Flash | Gemini gate passed | autonomous action |
| Security / finance review | GPT / Claude | Human explicit route | silent escalation |
| Local-only | local | always | any external call |
| Any external action | — | HOLD | any write attempt |

---

## What This Document Is NOT

- Not an approval to run any provider
- Not an approval to run OAuth
- Not an approval to change source code
- Not an approval to push
- Not a declaration that any provider is active

All providers remain HOLD until the relevant gate sequence is completed
with explicit human GO at each gate.

---

_Created: 2026-05-18_
_productionReady: false_
_execution: disabled_
