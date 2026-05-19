# しきしま実運用100% — Command Chat Plan

**状態:** BLOCKED — CC-03 GO 待ち
**Baseline:** aadea91 | **Prepared:** 2026-05-19

---

## 現状

CommandChatPage は display-only。
`onSend` は `ccMessages` にローカル追記するだけ。
外部への実送信は接続されていない。

---

## display / local draft (現在可能)

- ユーザーがメッセージをタイプできる
- ローカル履歴に追記される
- 外部への送信はされない

---

## 実送信 (CC-03 GO 後のみ)

### 必要な実装項目

- 送信先エンドポイントの設定 (hermesAPI.chat または IPC)
- 1 回送信後のレスポンス受信
- エラーハンドリング / タイムアウト
- 自律的な繰り返し送信の防止

### 実装は CC-03 GO 後に開始

```
CC-03 GO フォームに以下を記入:
  endpoint: 送信先
  test_message: テストメッセージ
  max_messages: 1
承認後 ClaudeCode が実装 → typecheck → evidence → commit
```

---

## no-repeat ポリシー

```
自律的な繰り返し送信: 禁止
リトライループ: 禁止
未承認の外部宛先への送信: 禁止
raw secret/token の送信: 禁止
```

---

## evidence テンプレート

```yaml
cc03_send_evidence:
  result:
  date:
  time_window:
  message_sent:        1 (count)
  endpoint_used:
  response_received:
  raw_value_output:    false
  unexpected_send:     false
  git_status_after:    clean
```

---

## rollback / disable 手順

```
1. CommandChatPage の onSend を no-op に戻す
2. endpoint 設定を削除
3. commit → push GO
```

> CC-03 GO なしに実送信の実装・テストを行わない。
