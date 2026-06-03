# DIS-01 Read-Only Intake GO Form

**date:** 2026-05-21
**status:** AWAITING HUMAN GO — fill all fields and return as GO message
**worker:** ClaudeCode (will execute after GO)

---

## 現在の実装状態

```yaml
ipc_handler:       src/main/discord-intake.ts
DIS01_HOLD:        true (変更待ち)
channel_id:        1498670816366428208 (ハードコード)
token_source:      自立型AIイツキシマ/.env — DISCORD_BOT_TOKEN (呼び出し時のみ読取)
token_in_result:   false (rawTokenReported: false リテラル)
max_read_count:    10 件
UI:                DiscordInboxPanel (AgentTheaterPage — Read ボタン)
```

---

## What this GO enables

- `DIS01_HOLD = false` に変更
- Discord REST API v10 でチャンネル `1498670816366428208` のメッセージを最大10件取得
- `DiscordInboxPanel` の "Read (DIS-01)" ボタンが実際のAPI呼び出しになる
- 返却内容: `authorName` + `contentPreview` (200文字) + `timestamp` のみ

## What this GO does NOT enable

```text
- Discord メッセージ送信 (dis03_reply_go が別途必要)
- Discord DM / リプライ / スレッド参加 / リアクション
- 他チャンネルの読み取り
- token の表示・ログ出力
- OB01_DRY_RUN=false (Obsidian write は別GO)
- productionReady=true
- execution=enabled
- git push (別GO)
```

---

## GO Form — copy, fill all fields, return as GO message

```text
dis01_read_only_go:
  date:                2026-05-21
  time_window_jst:     [例: 00:00-00:30]
  discord_server_id:   [任意 — channel IDで特定済み、省略可]
  approved_channel_id: 1498670816366428208
  approved_user_id:    (optional)
  read_count_or_range: 最大 10 件
  allowed_run_count:   1
  stop_if:             token appears / write action / wrong channel / loop
  evidence_file:       docs/shikishima/DIS01_READ_EVIDENCE_2026-05-21.md
```

---

## Implementation after GO

ClaudeCode が実行する変更:

```typescript
// src/main/discord-intake.ts — line 22-23
// Before:
// DIS01_HOLD = true until explicit human GO
const DIS01_HOLD = true;
// After:
// DIS-01 GO authorized YYYY-MM-DD by tk — one-shot read only
const DIS01_HOLD = false;
```

変更後:
1. typecheck:node 確認
2. commit: `feat(dis01): enable Discord read — DIS-01 GO authorized`
3. アプリ起動 (runtime GO が別途必要) → Read ボタンで実行
4. 結果確認 → evidence doc 作成
5. DIS01_HOLD を true に戻す (gate restore) または継続使用
6. push: 別途 push GO

---

## Token handling

```text
token source:   自立型AIイツキシマ/.env の DISCORD_BOT_TOKEN=
read timing:    API呼び出し時のみ (起動時キャッシュなし)
token in result: false (rawTokenReported: false リテラル型)
token in log:    false
token in UI:     false
token in docs:   false (raw token は一切記録しない)
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
