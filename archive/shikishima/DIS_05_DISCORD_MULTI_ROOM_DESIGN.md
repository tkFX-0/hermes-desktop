# DIS-05 — Discord マルチルーム（portfolio / dialogue）

Date: 2026-05-31  
表記: **G** / **H**

## チャンネル

| 役割 | env | 備考 |
|------|-----|------|
| 指令 | `DISCORD_COMMAND_CHANNEL_ID` | 既存 `!status` 等 |
| ポートフォリオ | `DISCORD_PORTFOLIO_CHANNEL_ID` | `1510129430100709407` — 開発成果の置き場 |
| 対話 | `DISCORD_DIALOGUE_CHANNEL_ID` | `1510127716207296693` — エージェント読み合い・許可待ち |

## G ゲート

- `SHIKISHIMA_DISCORD_MULTI_ROOM_G=1` — `!multi-room-test` と `shikishima-discord-multi-room-test.mjs`

## コマンド

- `!multi-room-test`（指令部屋）— ポートフォリオ投稿 + 対話 6+1 通 + 許可待ち（allowlist メンション 1 回）

## 許可待ち通知

- 文面: allowlist のみ（`確認しました。` 等）
- `DISCORD_OPERATOR_USER_ID` 未設定時はメンション省略ししずめが案内
- 設定（値はチャットに出さない）:

```powershell
node scripts/shikishima-env-operator-patch.mjs <あなたのDiscordユーザーID>
node scripts/shikishima-process-preflight.mjs --clean --restart-dev
```

Discord: 設定 → 詳細 → **開発者モード** ON → 自分のプロフィール右クリック → **IDをコピー**
- **SHI-005（人間）**: `.env.local` に Discord ユーザー ID（数字のみ）を設定。値はログ・チャットに載せない。設定後 `!multi-room-test` で allowlist メンションを確認

## テスト

```powershell
node scripts/shikishima-discord-multi-room-test.mjs --apply-env
node scripts/shikishima-discord-multi-room-test.mjs
```

指令部屋で: `!multi-room-test`

## ポートフォリオに「開発指示」を書いてよいか（2026-05-31）

| できる（今） | まだ自動ではない |
|-------------|------------------|
| 成果物・要約・リンクを **置く**（しるべが「受領」1 通） | 投稿だけで対話部屋が自動で読み合い開始 |
| 指令部屋で `!multi-room-test` → 正しい部屋にテスト投稿 | ポートフォリオ投稿 → 自動でつむぎ開発パイプライン |
| 指令部屋で従来どおりしきしま／タスク指示 | 対話部屋への無制限自律ループ |

**推奨**: 開発担当は **ポートフォリオに成果を置く**。**指示・GO・テスト**は **指令部屋**（`DISCORD_COMMAND_CHANNEL_ID`）で行う。  
次実装: ポートフォリオ新規投稿 → 対話部屋へ要約転送（Phase C）。

## スレッド記憶（2026-05-30）

- `.shikishima-memory/discord-threads/{channelId}.json` — 部屋共有ログ + エージェント別ターン（Hermes `SessionStore` 相当）
- 司令部の通常発話・Bot 返信を自動追記；起動時に Discord GET で hydrate
- `@Bot` メンションのみでもしきしまが短く応答（本文テンプレート）
- `!部屋状況` — 全エージェント直近 + agent-log + hydrate 後の部屋要約

## 安全

- API 課金なし（local-dialogue）
- 金銭・EA・本番送信は **H**（Phase D）
