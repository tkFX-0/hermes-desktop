# Discord-Only Operations (2026-05-28)

Human: 管制センターは見ない · 確認は Discord · すべて許可

## Active when

- `.shikishima-memory/constitutional-go.local.json` → `discordOnlyUi: true`
- or `SHIKISHIMA_CONSTITUTIONAL_ALL_GO=1` / constitutional GO active

## Behavior

| Area | Discord-only |
|------|----------------|
| UI | Minimal page only (+ Settings) |
| Control Center poll | **skipped** (no IPC errors) |
| Shadow HOLD | **off** (SideBot, StackChan status, STT, health) |
| SideBot | starts when Track D / HOLD released |
| Models | `src/shared/shikishima-agent-model-registry.json` |

## Overnight

```powershell
# Composer / 人手の前に重複チェック（推奨）
node scripts/shikishima-process-preflight.mjs
# 古い Bot が残っていれば（人間 GO 後）
node scripts/shikishima-process-preflight.mjs --clean --restart-dev

npm run dev
# or standalone: node scripts/shikishima-bot.mjs
```

### Composer 再起動ルール

Discord Human Check やコード更新の前に、エージェント（Composer）が実行する:

1. `node scripts/shikishima-process-preflight.mjs --json` — 重複 Bot / PID ファイル不整合を検出
2. 重複時は **人間のテストGO** 後に `--clean`（必要なら `--restart-dev`）
3. ユーザーは Discord で返答確認のみ

Discord: command channel — chat, `!status`, `!help`

## Not removed (Hermes desktop)

Chat / Office / Research nav hidden in Discord-only mode, not deleted from codebase.
