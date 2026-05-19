# Level 5 Blocked Tasks — hermes-desktop

**作成:** 2026-05-19
**更新:** 2026-05-19

これらのタスクは Level 5 (人間 GO 必須) または専用 Gate が必要なため、
ClaudeCode が単独で実行することはできません。

---

## CC-03 — Command Chat 実送信

| 項目 | 内容 |
|---|---|
| 内容 | CommandChatPage から実際に Hermes エージェントへメッセージを送信する |
| 現状 | display-only。`onSend` は `ccMessages` に追記するだけ |
| 必要な GO | Level 5 — 外部 AI API 呼び出しを含む |
| 必要な承認スコープ | 送信先エンドポイント / APIキー policy / レート制限 / エラー処理方針 |
| 実装メモ | `hermesAPI.chat()` または IPC 経由で Hermes bridge に接続 |

**ブロック理由:** 外部 AI API への実送信 = Level 5

---

## HB-01 — Hermes Bridge 接続 (WSL2 → desktop)

| 項目 | 内容 |
|---|---|
| 内容 | WSL2 上の Hermes プロセスとデスクトップ間のブリッジ接続を有効化 |
| 現状 | ブリッジコードは存在するが `pilot_dry_run` / `controlled_pilot` は HOLD |
| 必要な GO | Level 5 — WSL2 コマンド実行 + 外部接続 |
| 必要な承認スコープ | WSL2 コマンド / port / 接続先 URL / タイムアウト設定 |
| 参照 | `hermes-bridge.ts` / `hermes-controlled-pilot-config.ts` |

**ブロック理由:** WSL2 実行 + runtime start = Level 5

---

## XS-01 — x_search read-only Gate (XS-READ)

| 項目 | 内容 |
|---|---|
| 内容 | x_search / SNS読み取りの read-only Gate を実装 |
| 現状 | Gate ダッシュボードで `XS-READ: FUTURE` 表示のみ |
| 必要な GO | XS-READ GO (専用 gate) + Level 5 |
| 必要な承認スコープ | source / topic / read-only window / token policy |
| 参照 | `X_SEARCH_HOLD_GO_MATRIX.md` / `XS-READ-GATE` task card |

**ブロック理由:** SNS 外部接続 = XS-READ gate 未開放

---

## 次アクション

人間が以下を判断・承認したときに各タスクを開始できます：

| Task | 必要なアクション |
|---|---|
| CC-03 | 「CC-03 Command Chat 送信 GO: 送信先=[endpoint], scope=[...]」と明示 |
| HB-01 | 「HB-01 Hermes Bridge GO: WSL2 command=[...], port=[...]」と明示 |
| XS-01 | 「XS-READ GO: source=[...], topic=[...], read-only window=[...]」と明示 |

AIは作るところまで。
鍵と発射ボタンは人間。
