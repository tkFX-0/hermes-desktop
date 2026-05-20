# WK-01 Codex Worker Boundary

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** DESIGN — docs only, no Codex launch

---

## Summary

Codex is a candidate worker for audit, review, scoped source reasoning, and lint.
Current use is human-mediated copy-only. No automatic Codex launch.

---

## Current Use: Human-Mediated

```text
1. Shikishima generates a Codex task prompt
2. Human copies prompt into Codex manually
3. Human reviews Codex result
4. Human brings relevant result back to Shikishima
5. Shikishima records finding
```

---

## Allowed (human-mediated)

- code review / audit
- scoped source reasoning
- lint / typecheck suggestions
- implementation candidate review
- diff analysis
- prompt refinement

---

## Forbidden (requires separate GO)

- automatic Codex launch by Shikishima
- remote control (Local / Cloud / Remote Control modes)
- API token-based task dispatch
- autonomous repeated queries
- cloud task submission without human approval
- push / runtime / external connection actions

---

## Codex Rate / Cooldown Policy

```text
- Codex may have rate limits or cooldown periods
- Shikishima shows COOLDOWN status when rate limits are reported
- Do not bypass or retry automatically
- Human decides when to retry
- COOLDOWN status is informational — not a bypass target
```

---

## Remote Control Gates (all HOLD)

Codex offers Local / Cloud / Remote Control capabilities. These are future gates:

| Mode | Status |
|---|---|
| Local (manual) | human-mediated copy-only — current use |
| Cloud task | HOLD — separate GO required |
| Remote Control | HOLD — WK-06 gate |

---

## Safety

```yaml
productionReady:      false
execution:            disabled
rawValuesReported:    false
codex_auto_launch:    HOLD
codex_remote_control: HOLD
codex_api_token:      not used
```
