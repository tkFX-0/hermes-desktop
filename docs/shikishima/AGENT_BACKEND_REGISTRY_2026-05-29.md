# Agent Backend Registry — Grok Research HOLD (2026-05-29)

## Decision

```text
Grok Research / x_search: HOLD (credit protection, through 2026-06-01)
Groq: normal replies, summaries, light judgment
Claude: safety (shizume), design, important decisions
ClaudeCode / Codex: tsumugi implementation workers
Cursor: external worker candidate (disabled in registry)
```

**Groq ≠ Grok** — different providers.

## Source of truth

`src/shared/shikishima-agent-model-registry.json`

TypeScript: `src/main/shikishima-agent-model-registry.ts`  
Policy gate: `src/main/shikishima-agent-backend-policy.ts`  
SideBot: `scripts/lib/load-agent-models.mjs`

## Per-agent (this month)

| Agent | Primary | Fallback | Workers |
|-------|---------|----------|---------|
| しきしま | Groq | Claude | — |
| しずめ | Claude | deterministic HOLD | — |
| つむぎ | ClaudeCode | Codex | cursor deferred |
| はじめ | Groq | Claude | — |
| しるべ | Groq | Claude | — |

**ちはや**: 2026-05-30 廃止（正規5体）。`CHIHAYA_REMOVED_2026-05-30.md` 参照。

## Code enforcement

- `runHermesResearch()` → immediate HOLD when `policy.grokResearchHold`
- `grokChat()` → HOLD; IPC `shikishima-grok-chat` → `dispatchToAgent` (Groq/Claude)
- SideBot market report → `callGroq` when HOLD
- Logs: `[trace agent=… backend=… model=… grokHold=true]`

## Re-enable Grok Research

Set in registry:

```json
"policy": {
  "grokResearchHold": false,
  "xSearchEnabled": true
}
```

Then per-agent `grokResearchEnabled` / `xSearchEnabled` as needed.
