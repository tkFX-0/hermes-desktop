# Full Autonomy Level Matrix

Date: 2026-05-28

| Level | Name | Cursor 自走 | 外部効果 | Human GO |
|------:|------|:-----------:|:--------:|:--------:|
| 0 | Manual Gate | 証跡のみ | なし | すべて |
| 1 | Safe One-shot | macro 実行 | 1回/窓 | 窓 GO |
| 2 | Draft-first Planning | **可** | なし | 実行時 |
| 3 | Read-only Monitoring | **可** | read-only | read GO |
| 4 | Local Autonomous Work | **可** | ローカル | push/send 時 |
| 5 | Controlled External | 準備まで | 1回 | **必須** |
| 6 | Limited Autonomous Exec | 承認範囲 | ポーリング等 | 拡張時 |
| 7 | Secretary Mode | 設計→段階 | StackChan 出力 | 常時監視 |
| 8 | Full Autonomous Operation | 統合 | 分類済み | 高リスクのみ |

## 現在の到達 Level（2026-05-28）

```text
Foundation: Level 0 完了
StackChan Display / Motion / Voice pilot: Level 1 完了
Burn-in A1+A2: PASS
B1 Discord→StackChan voice: PASS
Declared: Level 8 — Full Autonomous Operation (pilot scope)
Evidence: FULL_AUTONOMY_LEVEL_8_DECLARATION_2026-05-28.md
productionReady / execution: still false / disabled
```

## Level 昇格ルール

```text
昇格には Acceptance evidence + burn-in 該当章が必要
降格は常に可（STOP → HOLD → Level 0 相当の手動）
```
