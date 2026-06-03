# Hermes Tool Expansion Catalog

## Document Status

```
date:            2026-05-18
status:          docs-only catalog — NOT activation approval
decision:        HOLD (all tools)
execution:       disabled
productionReady: false
runtime_started: false
```

---

## Purpose

Catalog all known Hermes tool/feature categories with Shikishima activation status.
No tool is active. This catalog records what exists, what is planned, and what is blocked.

---

## Activation Status Key

```
HOLD       — desired feature, blocked by prerequisite gates
CANDIDATE  — identified for future use, plan exists
REJECT     — explicitly not suitable for Shikishima; never approve autonomously
```

---

## Conversation / Language Models

| Tool / Feature | Status | Gate Required | Notes |
|---|---|---|---|
| Grok-Hermes OAuth (xai-oauth) | HOLD | GHG-03 | Primary conversation candidate |
| Grok 4.3 | HOLD | GHG-03 | Default model for xai-oauth |
| Gemini Flash / Flash-Lite | HOLD | Gemini provider gate | Fallback / utility |
| GPT-4o / GPT-4.5 | HOLD | Manual escalation GO | High-stakes review |
| Claude Sonnet / Opus | HOLD | Manual escalation GO | High-stakes review |
| XAI API key mode | HOLD | Separate from OAuth | Cost-controlled fallback |

---

## Search / Web

| Tool / Feature | Status | Gate Required | Notes |
|---|---|---|---|
| x_search | HOLD | XS-01 through XS-03 | Read-only first; default-off in Hermes |
| web_search | HOLD | Separate web gate | General web search capability |
| web_extract | HOLD | Separate web gate | Extract content from URL |
| browser tools | HOLD | browser Gate | Automated browser interaction |

---

## Voice / Audio

| Tool / Feature | Status | Gate Required | Notes |
|---|---|---|---|
| TTS (text-to-speech) | HOLD | GHG-09b | Requires subscription tier check |
| Custom voices | HOLD | GHG-09b + voice policy | Additional voice customization |
| Transcription | HOLD | GHG-09e + mic gate | Requires mic activation gate |
| Voice input | HOLD | GATE-MIC-01 | micActive: false literal; separate gate |

---

## Image / Video

| Tool / Feature | Status | Gate Required | Notes |
|---|---|---|---|
| Image generation | HOLD | GHG-09c | Content policy required before use |
| Video generation | HOLD | GHG-09d | Default-off in Hermes; high quota risk |

---

## Messaging Adapters

| Tool / Feature | Status | Gate Required | Notes |
|---|---|---|---|
| Discord | HOLD | GATE-MSG-01 (Discord) | External message send |
| Telegram | HOLD | GATE-MSG-01 (Telegram) | External message send |
| WhatsApp | HOLD | GATE-MSG-01 (WhatsApp) | Personal communication platform |
| Signal | HOLD | GATE-MSG-01 (Signal) | Encrypted messaging |
| LINE | HOLD | GATE-MSG-01 (LINE) | Japan-primary messaging platform |
| Microsoft Teams | HOLD | GATE-MSG-01 (Teams) | Workplace messaging |
| SimpleX | HOLD | GATE-MSG-01 (SimpleX) | Privacy-focused messaging |

---

## Scheduling / Automation

| Tool / Feature | Status | Gate Required | Notes |
|---|---|---|---|
| cron / scheduled digest | HOLD | XS-08 minimum | Manual trigger first; scheduled after XS-08 |
| Scheduled x_search | HOLD | XS-08 | Part of social awareness limited operation |
| Automated pipelines | HOLD | GATE-AUTO-01 | Full automation HOLD until productionReady |

---

## Memory / Context

| Tool / Feature | Status | Gate Required | Notes |
|---|---|---|---|
| Hermes memory | HOLD | Memory gate (TBD) | Long-term memory persistence across sessions |
| Context window management | HOLD | Memory gate | Auto-summarization of long contexts |

---

## Multi-Agent / Orchestration

| Tool / Feature | Status | Gate Required | Notes |
|---|---|---|---|
| Multi-agent Kanban | HOLD | GATE-AUTO-01 | Agent task coordination system |
| /goal / /subgoal | HOLD | GATE-AUTO-01 | Goal hierarchy commands |
| Agent orchestrator | HOLD | GATE-AUTO-01 | Multi-agent routing |
| Hermes --tui | HOLD | GHG-01 minimum | TUI requires provider + auth first |

---

## System / Infrastructure

| Tool / Feature | Status | Gate Required | Notes |
|---|---|---|---|
| local proxy | HOLD | Local proxy gate (TBD) | Route requests through local proxy |
| computer_use | REJECT | N/A | Desktop automation — never autonomous in Shikishima |
| GitHub write actions | HOLD | GATE-GH-01 | Remote issue/PR only with per-action GO |

---

## External Actions

| Tool / Feature | Status | Gate Required | Notes |
|---|---|---|---|
| External posting (general) | HOLD | GATE-EW-01 + per-platform | Any external content creation |
| X (Twitter) posting | HOLD | XS-09 | Per-post human GO; autonomous is REJECT |
| X replies / DM | REJECT | N/A | Autonomous replies/DM are REJECT |
| Email send | HOLD | GATE-EMAIL-01 | Per-send human GO |
| Calendar event creation | HOLD | GATE-CAL-01 | Per-event human GO |
| Purchase / reservation / payment | REJECT | N/A | Financial autonomy is REJECT |

---

## Computer Use Note

```
computer_use:  REJECT — autonomous GUI control is never appropriate for Shikishima
               Human controls the desktop; Shikishima does not automate user actions
               Even supervised computer_use creates unacceptable ambiguity
               Permanently REJECT until explicitly re-evaluated by human
```

---

## Activation Priority Order

```
Priority 1 (near-term, chat foundation):
  GHG-01 → GHG-05: Grok-Hermes chat-only

Priority 2 (social awareness):
  XS-01 → XS-05: x_search read-only + digest draft

Priority 3 (utility tools):
  web_search (general search fallback)
  Gemini Flash (cheap utility)

Priority 4 (enhanced conversation):
  TTS (GHG-09b)
  image generation (GHG-09c)

Priority 5 (future consideration):
  memory, multi-agent, scheduling
  Each requires substantial gate work
```

---

_Created: 2026-05-18_
_productionReady: false_
_execution: disabled_
