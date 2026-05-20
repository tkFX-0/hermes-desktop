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

---

## DIS-03 — Discord 実返信 (Human GO Reply)

| 項目 | 内容 |
|---|---|
| 内容 | 承認済みDiscordチャンネルへ1回だけメッセージを送信する |
| 現状 | 設計書のみ (DIS-03_DISCORD_HUMAN_GO_REPLY_PLAN.md) |
| 必要な GO | Level 5 — 外部サービスへの書き込み |
| 必要な承認スコープ | server_id / channel_id / 正確なメッセージ内容 / 送信回数1回 / rollback方法 |
| 参照 | `DIS_03_DISCORD_HUMAN_GO_REPLY_PLAN.md` |

**ブロック理由:** Discordへの書き込み = 外部サービスへの書き込み = Level 5

---

## DIS-BOT — Discord Bot Token セットアップ

| 項目 | 内容 |
|---|---|
| 内容 | Discord Developer Portal でBot作成、token取得、ローカル保存 |
| 現状 | 未実施 (設計書 DISCORD_TOKEN_AND_PERMISSION_POLICY.md のみ) |
| 必要な GO | Level 5 — token発行と外部サービス接続 |
| 必要な承認スコープ | Bot作成GO / token storage policy / 専用チャンネル確認 |
| 参照 | `DISCORD_TOKEN_AND_PERMISSION_POLICY.md` |

**ブロック理由:** Botトークンは外部サービス認証情報 = Level 5

---

## DIS-CON — Discord Gateway 接続

| 項目 | 内容 |
|---|---|
| 内容 | Discord Gateway への接続を開始 (read-only) |
| 現状 | 未実施 (DIS-01 HOLD) |
| 必要な GO | DIS-01 read-only GO + time_window |
| 必要な承認スコープ | server_id / channel_id / intent設定 / 接続時間 |
| 参照 | `DIS_01_DISCORD_READ_ONLY_INTAKE_PLAN.md` |

**ブロック理由:** 外部サービス接続 = Level 5-ish

---

## DIS-04 — Discord 自動返信 (Limited Auto-reply)

| 項目 | 内容 |
|---|---|
| 内容 | 定型文のみの限定的な自動返信 |
| 現状 | DEFERRED — DIS-01/02/03 PASS後に検討 |
| 必要な GO | Level 5+ + template whitelist + loop prevention |
| 必要な承認スコープ | template一覧 / trigger条件 / rate limit / kill switch |
| 参照 | `DIS_04_DISCORD_LIMITED_AUTO_REPLY_DEFERRED.md` |

**ブロック理由:** 自動外部書き込み = Level 5+ / 現在 DEFERRED

---

## 次アクション

人間が以下を判断・承認したときに各タスクを開始できます：

| Task | 必要なアクション |
|---|---|
| CC-03 | 「CC-03 Command Chat 送信 GO: 送信先=[endpoint], scope=[...]」と明示 |
| HB-01 | 「HB-01 Hermes Bridge GO: WSL2 command=[...], port=[...]」と明示 |
| XS-01 (次回) | 「XS-READ GO: source=[...], topic=[...], read-only window=[...]」と明示 |
| DIS-BOT | 「Discord Bot 作成 GO: 専用チャンネル=[...], token storage=[...]」と明示 |
| DIS-01 | 「DIS-01 read-only GO: server=[...], channel=[...], time_window=[...]」と明示 |
| DIS-03 | 「DIS-03 reply GO: exact_message=[...], channel=[...]」と明示 |

AIは作るところまで。
鍵と発射ボタンは人間。

**更新:** 2026-05-20 — Discord Bridge (DIS series) 追加
