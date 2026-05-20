# CC-03 Command Chat One-Shot Send GO Form

**date:** 2026-05-21
**status:** HOLD — awaiting explicit human GO
**worker:** ClaudeCode (will implement + execute after GO)

---

## Current State

```yaml
command_chat_ui:   display-only (onSend not wired to real endpoint)
hermes_endpoint:   not connected
api_key:           not configured for send path
```

---

## What this GO enables

- CommandChatPage → Hermes エージェントへの 1 件のみ送信
- `exact_target` に記載されたエンドポイント / モデルのみ
- `allowed_message` の verbatim 内容のみ

## What this GO does NOT enable

```text
- 2件以上の送信
- ループ・自動送信
- OAuth / token 取得
- Discord send / X post / Obsidian write
- productionReady=true / execution=enabled
- git push (別GO)
```

---

## GO Form — copy, fill ALL fields, return as GO message

```text
cc03_real_send_go:
  date:
  time_window_jst:       [例: 01:00-01:15]
  exact_target:          [endpoint / model / service — verbatim]
  allowed_message:       [verbatim — human-approved content]
  command_or_ui_path:    [how to send]
  dry_run_completed:     false
  allowed_send_count:    1
  stop_if:               loop / wrong target / content deviation
  rollback_or_disable:   [how to disable send endpoint]
  evidence_file:         docs/shikishima/CC03_SEND_EVIDENCE_2026-05-21.md
```

---

## Safety

```yaml
command_chat_sent:   false (HOLD)
hermes_connected:    false
productionReady:     false
execution:           disabled
rawValuesReported:   false
```
