# XS-AUTO-01 Watchlist and Query Policy

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** DESIGN — watchlist planning only, no execution
**gate:** all items HOLD — no run until xs_read_go or xs_auto_read_go

---

## Watchlist Categories

| Category | Status | Risk | Notes |
|---|---|---|---|
| AI / agent platform news | HOLD | low | Google/OpenAI/Anthropic/xAI updates |
| X/Discord/automation policy | HOLD | low | Platform policy changes |
| StackChan / local robot UI | HOLD | low | Robot/voice/display UI news |
| Trading / market automation | HOLD | medium | Separately approved only |
| Competitor / social monitoring | HOLD | medium | Scope must be narrow |

---

## Watch Item Schema

Each watchlist item must define:

```text
watch_item:
  id:                  (unique ID, e.g. WI-001)
  title:
  query:               (exact search string)
  source:              (public search only — no private)
  run_frequency:       (one-shot / daily / weekly / on-demand)
  max_run_count:       (integer, 1 by default)
  evidence_path:
  risk_level:          (low / medium / high)
  human_go_required:   true
  go_form:             xs_read_go or xs_auto_read_go
  status:              HOLD
```

---

## Proposed Initial Watchlist (all HOLD)

| ID | Title | Query (example) | Frequency | Max Runs |
|---|---|---|---|---|
| WI-001 | Google I/O AI agent updates | `Google I/O agent Gemini 2026` | on-demand | 1 |
| WI-002 | OpenAI / Codex updates | `OpenAI Codex agent 2026` | on-demand | 1 |
| WI-003 | Anthropic Claude Code updates | `Anthropic Claude Code agent 2026` | on-demand | 1 |
| WI-004 | X/Discord automation policy | `X API Discord webhook policy 2026` | on-demand | 1 |
| WI-005 | StackChan / voice UI | `StackChan voice robot 2026` | on-demand | 1 |

All items are HOLD. No run until explicit xs_read_go or xs_auto_read_go per item.

---

## Forbidden Query Types

```text
FORBIDDEN:
  - queries targeting credential leaks
  - queries targeting private personal data
  - queries for harassment or stalking
  - paywall bypass or scraping
  - account-specific DMs or private posts
  - hidden/private content access
  - queries requiring login/OAuth to access results
```

If a query requires login to access results, STOP and report.

---

## Query Safety Rules

```text
- queries must be public search strings
- queries must not include raw personal identifiers
- results must be attributable to public sources
- raw API response data must not be logged verbatim if it contains user PIIs
- rate limits must be respected — no bypass
```

---

## Safety

```yaml
productionReady:    false
execution:          disabled
rawValuesReported:  false
x_search_executed:  false
watchlist_active:   false
all_items:          HOLD
```
