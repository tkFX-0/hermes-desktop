# DIS-01 Read-Only Intake GO Form

**date:** 2026-05-20
**status:** AWAITING HUMAN GO — fill all fields and return as GO message
**worker:** ClaudeCode (will execute after GO)

---

## What this GO enables

- `DIS01_HOLD` を `false` に変更
- Discord REST API v10 で channel 1498670816366428208 のメッセージ読み取りを有効化
- DiscordInboxPanel の "Read (DIS-01)" ボタンが実際のAPI呼び出しになる
- 最大10件のメッセージを取得、authorName + contentPreview(200文字) のみ表示

## What this GO does NOT enable

```text
- Discord メッセージ送信 (dis03_reply_go が別途必要)
- Discord DM / リプライ / スレッド参加
- OB01_DRY_RUN=false (Obsidian write は別GO)
- 他チャンネルの読み取り
- token の表示・ログ出力
- productionReady=true
- execution=enabled
- git push (別GO)
```

---

## GO Form Template — copy, fill, and return

```text
dis01_read_only_go:
  date:                2026-05-20
  time_window_jst:     [例: 23:00-23:30]
  discord_server_id:   [任意 — channel IDで特定済み]
  approved_channel_id: 1498670816366428208
  approved_user_id:    (optional — 省略可)
  read_count_or_range: 最大 10 件
  allowed_run_count:   1
  stop_if:             token appears / write action / wrong channel / loop
  evidence_file:       docs/shikishima/DIS01_READ_EVIDENCE_2026-05-20.md
```

---

## Implementation after GO

ClaudeCode が実行する変更:

```typescript
// src/main/discord-intake.ts — line 22
// Before:
const DIS01_HOLD = true;
// After:
const DIS01_HOLD = false;
```

変更後:
- typecheck:node 確認
- commit: `fix(dis01): enable Discord read — DIS-01 GO authorized`
- push: 別途 push GO が必要
- runtime での動作確認が推奨 (npm run dev + Read ボタン)

---

## Token handling (変更なし)

```text
token source:  自立型AIイツキシマ/.env の DISCORD_BOT_TOKEN=
read timing:   API呼び出し時のみ (起動時キャッシュなし)
token in result: false (rawTokenReported: false リテラル)
token in log:    false
token in UI:     false
```

---

## Safety after GO

```yaml
DIS01_HOLD:         false (GOにより変更)
OB01_DRY_RUN:       true (変更なし)
discord_send:       disabled (send handler 未実装)
productionReady:    false
execution:          disabled
rawValuesReported:  false
channel_scope:      1498670816366428208 のみ (ハードコード)
```
