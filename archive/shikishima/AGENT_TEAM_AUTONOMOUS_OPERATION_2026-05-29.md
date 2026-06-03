# All-Agent Autonomous Operation (2026-05-29)

## Goal today

全員（6エージェント）が **同じレジストリ方針** で自律応答できる状態。

## Done in code

| Piece | Role |
|-------|------|
| `shikishima-agent-model-registry.json` | Groq/Claude/Worker + Grok HOLD |
| `dispatch-agent-reply.mjs` | SideBot: per-agent Groq/Claude/Worker |
| `agent-router` + `modelTrace` | Electron / STT path |
| `agent-team-autonomous-tick.ts` | 6-agent maintenance ping (capped) |
| Audit | `agent_reply` + `modelTrace` metadata |

## Commands

```powershell
# Before Discord Human Check — duplicate process preflight (Composer)
node scripts/shikishima-process-preflight.mjs --json
node scripts/shikishima-process-preflight.mjs --clean --restart-dev   # after human テストGO

# 6-agent tick (needs Groq/Claude/WSL; may call real APIs)
npx tsx scripts/shikishima-agent-team-tick.mjs

# Discord live
npm run dev
# or: node scripts/shikishima-bot.mjs
```

## Discord 順番 Human Check（API課金なし）

コマンドチャンネルで次のいずれかを送ると、**6エージェントが約1.4秒間隔で順番に** 固定文で返信（Groq/Claude **未使用**）:

- `!agent-test`
- `!起動テスト` / `!回答テスト`
- `順番での回答` / `起動テスト 順番`

各返信に `local-human-check` / `API課金なし` が含まれる。通常の雑談は従来どおり Groq/Claude（キー設定時のみ課金）。

全員を常にローカルだけにする場合（任意）: `.env.local` に `SHIKISHIMA_DISCORD_HUMAN_CHECK_LOCAL=1`

## Per-agent routing (SideBot)

| Agent | Path |
|-------|------|
| しきしま | Groq → Claude |
| しずめ | Claude only |
| つむぎ | Claude Code worker |
| はじめ | Groq → Claude |
| しるべ | Groq → Claude |
| ちはや | Groq → Claude |

## Still not "full autonomy"

- No unbounded 24/7 auto-Discord-send loop
- Codex spawn from SideBot still via Claude WSL (OPENAI key path separate)
- High-risk routes still need human GO

## Next

- Wire Codex worker from bot when `OPENAI_API_KEY` set
- Optional: scheduled `shikishima-agent-team-tick` in ops file
