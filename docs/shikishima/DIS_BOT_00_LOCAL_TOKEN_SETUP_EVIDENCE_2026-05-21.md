# DIS-BOT-00: Discord Bot Local Token Setup Evidence

- **gate_id**: DIS-BOT-00
- **date**: 2026-05-21
- **result**: PASS

## Setup Record

| 項目 | 値 |
|---|---|
| bot_name | Shikishima |
| bot_id | 1506860632602054727 |
| guild_id | 1506531288838963281 |
| token_present | true |
| token_value_printed | false |
| token_committed | false |
| env_file | .env.local |
| env_file_gitignored | true (.env.* パターンで除外) |

## Intent Setup

| 項目 | 値 |
|---|---|
| MESSAGE_CONTENT_INTENT | ON |
| PRESENCE_INTENT | OFF |
| SERVER_MEMBERS_INTENT | OFF |

## Source Changes

- `src/main/discord-intake.ts`: トークンソース → `.env.local` / `sendDiscordMessage()` 追加 / `getDiscordChannelIds()` 追加
- `src/main/discord-bot-service.ts`: 新規作成 — ポーリングループ / コマンドルーティング / レポート送信
- `src/main/index.ts`: IPC ハンドラ `shikishima-discord-read` シグネチャ修正
- `.env.local`: DISCORD_BOT_TOKEN / DISCORD_GUILD_ID / DISCORD_COMMAND_CHANNEL_ID / DISCORD_REPORT_CHANNEL_ID 追加 (gitignore済み)

## Safety Boundary

- token_output: false
- token_committed: false
- discord_connection_opened: false (DIS01_HOLD=true 維持)
- external_api_write: false (送信テストは DIS-BOT-02 で別記録)
- productionReady: false
- execution: disabled
- rawValuesReported: false

## Naming Note

この作業は Discord Bot ローカルセットアップであり、X アカウント OAuth とは無関係。
`XACC-01` という名称を使うことは誤り。正しくは `DIS-BOT-00` シリーズ。
XACC-01 (X Account read-only OAuth) は引き続き HOLD。
