# Level 5 Blocked Tasks — hermes-desktop

## 2026-05-21 Autonomous Operation Preparation Addendum

Status remains HOLD for all Level 5 actions.

Prepared but not approved:

- XS-AUTO-03 GO form / evidence template / dry-run plan
- CC-03 GO form / evidence template / dry-run plan
- HB-01 GO form / evidence template / dry-run plan
- XACC-01 decision form
- BLOCKER-005 human review form
- LMO session design
- productionReady GO draft marked DO NOT USE YET
- execution enabled GO draft marked DO NOT USE YET
- Agent Theater Autonomous Operation Readiness panel

Still blocked without explicit human GO:

- x_search execution
- Discord read/send
- Obsidian additional write
- Hermes/WSL connection
- Command Chat send
- X OAuth/API
- StackChan operation
- external API write
- productionReady true
- execution enabled

Safety invariants:

```text
productionReady: false
execution: disabled
rawValuesReported: false
```

**作成:** 2026-05-19
**更新:** 2026-05-19

これらのタスクは Level 5 (人間 GO 必須) または専用 Gate が必要なため、
ClaudeCode が単独で実行することはできません。

---

## L5-PROD — productionReady true

| 項目 | 内容 |
|---|---|
| 内容 | productionReady を true にする |
| 現状 | HOLD — TypeScript literal type で false に固定 |
| 必要な GO | productionReady_go (全 Level 5 gate PASS 後) |
| 参照 | `LEVEL_5_HUMAN_GO_TEMPLATE.md` |

**ブロック理由:** アプリの実運用姿勢への不可逆シフト = Critical

---

## L5-EXEC — execution enabled

| 項目 | 内容 |
|---|---|
| 内容 | execution を enabled にする |
| 現状 | HOLD — TypeScript literal type で "disabled" に固定 |
| 必要な GO | execution_go (productionReady true + 全 Level 5 PASS 後) |
| 参照 | `LEVEL_5_HUMAN_GO_TEMPLATE.md` |

**ブロック理由:** 自律エージェント実行 = 最後のゲート / Critical

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

## OBS-LIB-04 — Obsidian ローカル書き込み有効化

| 項目 | 内容 |
|---|---|
| 内容 | OB-01 gate GO 後に Shikishima からの vault 直接書き込みを有効化 |
| 現状 | **ONE_SHOT_PASS** — 2026-05-20 one-shot test 成功 / OB01_DRY_RUN=true に復元済み |
| 証跡 | `OB01_WRITE_EVIDENCE_2026-05-20.md` / `shikishima-library/30_Evidence/2026-05-20_ob01-local-write-test.md` |
| 次回書き込み | 新規 ob01_local_write_go が必要 |
| 参照 | `OBS_LIB_04_LOCAL_WRITE_GATE_POLICY.md` |

**状態:** 30_Evidence/ へのパス疎通確認済み。次回はファイル内容 + GO 発行が必要。

---

## OBS-LIB-05 — ライブラリ自動書き込みループ

| 項目 | 内容 |
|---|---|
| 内容 | バックグラウンドで自動的に vault に書き込む |
| 現状 | HOLD — 自動書き込み禁止 |
| 必要な GO | OBS-LIB-04 PASS + 別途自動書き込み GO |
| 参照 | `OBS_LIB_04_LOCAL_WRITE_GATE_POLICY.md` |

**ブロック理由:** 自動書き込みループ = Level 5+

---

## LIB-03 — Obsidian ローカル書き込み (OB-01)

| 項目 | 内容 |
|---|---|
| 内容 | しきしまが承認済み Vault フォルダにのみ Markdown を書き込む |
| 現状 | **ONE_SHOT_PASS** — IPC 実装済み / 30_Evidence/ パス疎通確認済み / OB01_DRY_RUN=true 復元 |
| 証跡 | `OB01_WRITE_EVIDENCE_2026-05-20.md` |
| 次の GO | 実運用書き込みには新規 ob01_local_write_go |
| 参照 | `LIB_03_OBSIDIAN_LOCAL_WRITE_GATE.md` |

**状態:** gate path 確認済み。実運用には内容確認 + GO 発行が必要。

---

## LIB-05 — Vault Index / RAG 検索

| 項目 | 内容 |
|---|---|
| 内容 | Vault 索引表示 / embedding / ベクトル検索 |
| 現状 | HOLD — LIB-03 PASS 後 |
| 必要な GO | lib04_index_go + 別途 RAG GO |
| 参照 | `LIB_04_INDEX_AND_RAG_PLAN.md` |

**ブロック理由:** ファイルシステム read + cloud upload 候補 = Level 5

---

## XS-AUTO-03 — 単発スケジュール x_search 実行

| 項目 | 内容 |
|---|---|
| 内容 | ウォッチリスト項目を1回だけ自動実行 |
| 現状 | HOLD (XS_AUTO_02_PATROL_SCHEDULER_HOLD_PLAN.md) |
| 必要な GO | xs_auto_read_go |
| 参照 | `XS_AUTO_02_PATROL_SCHEDULER_HOLD_PLAN.md` |

**ブロック理由:** スケジューラー起動 = 外部自動実行 = Level 5-ish

---

## XS-AUTO-04 — 定期 x_search パトロール

| 項目 | 内容 |
|---|---|
| 内容 | ウォッチリスト定期自動巡回 |
| 現状 | HOLD — 将来Gate |
| 必要な GO | xs_auto_schedule_go + review checkpoint |
| 参照 | `XS_AUTO_02_PATROL_SCHEDULER_HOLD_PLAN.md` |

**ブロック理由:** 継続的外部アクセス = Level 5

---

## XS-OAUTH — X アカウント OAuth / x_search 認証

| 項目 | 内容 |
|---|---|
| 内容 | X API OAuth 認証 + 認証済み x_search |
| 現状 | HOLD (XACC-01 先行) |
| 必要な GO | XACC-01 PASS + XS-AUTH GO |
| 参照 | `XACC_01_READ_ONLY_AUTH_SCOPE_PLAN.md` |

**ブロック理由:** OAuth = 外部サービス認証 = Level 5

---

## WK-05 — Worker 自動実行アダプター

| 項目 | 内容 |
|---|---|
| 内容 | Shikishima が自動的に Codex / ClaudeCode を起動・実行する |
| 現状 | HOLD (WK_WORKER_AUTOMATION_HOLD_POLICY.md) |
| 必要な GO | WK-05 Gate GO + remote control / MCP / API token policy |
| 参照 | `WK_WORKER_AUTOMATION_HOLD_POLICY.md` |

**ブロック理由:** worker自動実行 = 実行制御の外部委譲 = Level 5

---

## WK-06 — Remote Control (Codex / ClaudeCode)

| 項目 | 内容 |
|---|---|
| 内容 | Codex Remote Control または ClaudeCode CLI を Shikishima から制御 |
| 現状 | HOLD |
| 必要な GO | WK-05 PASS + WK-06 remote control GO |
| 参照 | `WK_02_CLAUDECODE_WORKER_BOUNDARY.md` / `WK_01_CODEX_WORKER_BOUNDARY.md` |

**ブロック理由:** remote shell/API制御 = Level 5

---

## WK-07 — MCP / Hook / Daemon 実行

| 項目 | 内容 |
|---|---|
| 内容 | MCP接続・shell hook実行・daemon worker起動 |
| 現状 | HOLD |
| 必要な GO | WK-06 PASS + MCP/hook/daemon GO |
| 参照 | `WK_WORKER_AUTOMATION_HOLD_POLICY.md` |

**ブロック理由:** 任意コマンド実行 = Level 5

---

## XACC-04 — X 実投稿/返信 (Human GO Write)

| 項目 | 内容 |
|---|---|
| 内容 | 承認済みXアカウントから1回だけ投稿または返信する |
| 現状 | 設計書のみ (XACC_04_HUMAN_GO_WRITE_PLAN.md) |
| 必要な GO | Level 5 — 外部SNSへの書き込み |
| 必要な承認スコープ | account_type / action_type / exact_content (verbatim) / 送信回数1回 |
| 参照 | `XACC_04_HUMAN_GO_WRITE_PLAN.md` |

**ブロック理由:** X投稿/返信 = 外部サービスへの書き込み = Level 5

---

## XACC-OAUTH — X OAuth 認証フロー開始

| 項目 | 内容 |
|---|---|
| 内容 | OAuth 2.0 PKCE フローを開始してアクセストークンを取得 |
| 現状 | 未実施 (XACC_01_READ_ONLY_AUTH_SCOPE_PLAN.md のみ) |
| 必要な GO | Level 5 — 外部サービス認証 |
| 必要な承認スコープ | account_type / requested_scopes / callback_url / token_storage_method |
| 参照 | `X_ACCOUNT_TOKEN_AND_SCOPE_POLICY.md` |

**ブロック理由:** OAuth + token発行 = 外部サービス認証 = Level 5

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
