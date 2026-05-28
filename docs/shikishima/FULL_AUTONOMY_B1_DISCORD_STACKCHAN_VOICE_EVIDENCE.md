# Track B1 — Discord → StackChan voice one-shot

Date: 2026-05-28  
Human GO: **received** (`B1にA2` — B1 first)  
Machine result: **PASS**  
Human audible confirmation: **PASS** (`B1PASS` / `PASSバンバン`, 2026-05-28)

---

## Summary

| Item | Value |
|------|-------|
| Route | `planDiscordToStackChanVoice` → `runDiscordSecretaryVoiceBridge` → guarded WS |
| Plan | **ALLOW_DRAFT** |
| Device send | **ok** / **sent** |
| `deviceDecision` | READY_FOR_PILOT_GO |
| WebSocket PCM | **performed** |
| Redacted preview (phrase hint) | `了解しました` (6 chars) |
| Audible phrase on device | allowlist `STACKCHAN_VOICE_PILOT_ACK` → 「よろしく。」 |
| `execution` | disabled |
| `productionReady` | false |
| Discord REST message send | **not performed** (voice path only) |

Machine-readable: `FULL_AUTONOMY_B1_DISCORD_STACKCHAN_VOICE_EVIDENCE.json`  
Runner: `scripts/shikishima-discord-stackchan-voice-b1-once.mjs`

---

## Operator note

B1 validates the **secretary bridge → StackChan voice** guarded path.  
Discord message text is redacted into the plan; the device speaks the **fixed pilot allowlist** phrase (same as voice pilot).  
Mapping Discord body → free-form TTS is **Track B2+** scope.

---

## Still HOLD

| Item | Status |
|------|--------|
| Discord auto loop (B2) | HOLD — separate GO |
| StackChan production voice loop (B3) | HOLD |
| `execution` / `productionReady` ON | HOLD |
