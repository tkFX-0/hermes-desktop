# StackChan HOLD（完全自律実装フェーズ）

Date: 2026-05-30  
Status: **ACTIVE** — 音声・Discord→VOICEVOX 読み上げを停止。しきしま本体の自律実装を優先。

## 有効化

```powershell
node scripts/shikishima-stackchan-hold.mjs --restart-bot
```

`.env.local` に設定されるキー:

| Key | Value | 意味 |
|-----|-------|------|
| `SHIKISHIMA_STACKCHAN_HOLD` | `1` | `stackchanSay` / `stackchanSayAsAgent` をスキップ |
| `STACKCHAN_DISCORD_VOICE` | `0` | Discord 返信の VOICEVOX 直送 OFF |

起動ログ例: `[StackChan] HOLD — …` / `bridge: OFF | hold=YES`

## 再開（別 GO）

```powershell
node scripts/shikishima-stackchan-resume.mjs
# または .env.local で SHIKISHIMA_STACKCHAN_HOLD=0、STACKCHAN_DISCORD_VOICE=1
node scripts/shikishima-process-preflight.mjs --clean --restart-dev
```

**注記（ORDERED_TASKS 2026-05-31 との関係）**: Task4 で `stackchan-resume` を実行した記録があっても、**自律実装フェーズ再開時は再度 HOLD が有効**な場合があります。再開前に本ファイルと `!status` / Bot 起動ログの `hold=YES|NO` を確認してください。

## 安全不変（変更なし）

- `decision = HOLD`
- `execution = disabled`
- `productionReady = false`
- 憲法 GO・Discord 本番自動送信・FW フラッシュは別承認
