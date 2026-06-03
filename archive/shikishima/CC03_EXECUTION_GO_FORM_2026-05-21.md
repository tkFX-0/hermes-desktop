# CC-03 Command Chat One-Shot Send — Execution GO Form

**date:** 2026-05-21
**status:** AWAITING HUMAN GO
**worker:** ClaudeCode (will execute after GO)
**gate:** BLOCKER-002 resolution

---

## What this GO enables

- Hermes エージェントへの 1 件のみ送信
- `exact_message` の verbatim 内容のみ
- 送信後は immediately HOLD 復帰

## What this GO does NOT enable

```text
- 2件以上の送信 / ループ / スケジュール送信
- Discord / X / Obsidian への書き込み
- WSL / Hermes bridge 接続
- productionReady true / execution enabled
- git push (別GO)
```

---

## Proposed message (確認してください)

```text
しきしまです。CC-03 接続確認のテスト送信です。2026-05-21 / CC-03 one-shot
```

---

## GO Form — copy, fill, return

```text
cc03_real_send_go:
  date:                  2026-05-21
  time_window_jst:       [記入]
  exact_target:          [Hermesエンドポイント / モデル名 — verbatim]
  allowed_message:       しきしまです。CC-03 接続確認のテスト送信です。2026-05-21 / CC-03 one-shot
  dry_run_completed:     false
  allowed_send_count:    1
  stop_if:               loop / wrong target / content deviation / token appears
  rollback_or_disable:   [エンドポイント無効化方法]
  evidence_file:         docs/shikishima/CC03_SEND_EVIDENCE_2026-05-21.md
```

**`exact_target` と `rollback_or_disable` の記入が必要です。**

---

## Note

Hermes エンドポイントが未確認の場合は、`exact_target: local-test-only` として
ローカル dry-run のみで evidence を記録することも可能です。
