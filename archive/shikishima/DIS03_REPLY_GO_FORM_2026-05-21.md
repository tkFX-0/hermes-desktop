# DIS-03 Discord One-Shot Reply GO Form

**date:** 2026-05-21
**status:** AWAITING HUMAN GO — fill all fields and return as GO message
**worker:** ClaudeCode (will implement + execute after GO)

---

## Prerequisites

```yaml
DIS-01: ONE_SHOT_PASS (2026-05-21) ✓
DIS-02: IMPLEMENTED ✓
dis03_dry_run: not yet completed (complete before GO)
```

---

## What this GO enables

- Discord REST API POST to channel `1498670816366428208`
- 1件のみ送信 (`allowed_send_count: 1`)
- `exact_message_content` に記載された verbatim 内容のみ
- 送信後は即座に HOLD に戻す

## What this GO does NOT enable

```text
- 2件以上の送信
- exact_message_content からの逸脱
- DM / リプライ / スレッド / リアクション
- ループ送信・スケジュール送信
- OB01_DRY_RUN=false
- productionReady=true
- execution=enabled
- git push (別GO)
```

---

## GO Form — copy, fill ALL fields, return as GO message

```text
dis03_reply_go:
  date:                  2026-05-21
  time_window_jst:       [例: 01:00-01:15]
  approved_server_id:    [Discord server ID — optional if channel confirmed]
  approved_channel_id:   1498670816366428208
  exact_message_content: [verbatim — no deviation allowed]
  allowed_send_count:    1
  dry_run_completed:     false
  stop_if:               content deviation / >1 send / loop / token appears
  rollback_or_disable:   delete DISCORD_BOT_TOKEN from env or revoke in Dev Portal
  evidence_file:         docs/shikishima/DIS03_REPLY_EVIDENCE_2026-05-21.md
```

**重要:** `exact_message_content` は verbatim (一字一句) で記入してください。
ClaudeCode はその内容から一切逸脱しません。

---

## Implementation after GO

ClaudeCode が実行する変更:

```typescript
// src/main/discord-intake.ts に send handler を追加
// DIS-03 send: channel 1498670816366428208 / count=1 / exact_content のみ
```

手順:
1. send handler 実装 (channel ID固定 / count guard / exact content のみ)
2. typecheck:node 確認
3. 1件送信実行
4. 送信確認
5. send handler を HOLD に戻す or 削除
6. evidence doc 作成
7. commit (push は別GO)

---

## Safety

```yaml
discord_send:       1件のみ (exact_message_content)
discord_loop:       forbidden
token_in_output:    false
productionReady:    false
execution:          disabled
rawValuesReported:  false
```
