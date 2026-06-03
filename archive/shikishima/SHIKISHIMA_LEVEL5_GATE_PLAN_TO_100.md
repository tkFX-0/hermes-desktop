# しきしま Level 5 Gate Plan — 100% まで

**Baseline:** 75e690b
**Prepared:** 2026-05-19
**Worker:** ClaudeCode (docs-only)

---

## Level 5 とは何か

Level 5 操作は「**AI が単独で判断・実行してはならない操作**」である。

理由:
- 外部・物理世界への影響が不可逆または広範
- 人間の意図確認なしに実行すると意図しない結果が生じる可能性がある
- ロールバック/停止が困難または不可能な場合がある
- セキュリティ/プライバシー/安全性への直接の影響がある

---

## Level 5 操作の一覧

### 外部接続・実行系

| 操作 | Gate ID | 現状 |
|---|---|---|
| git push | PUSH-GO | 人間 GO のみ実施済み |
| runtime start (npm run dev) | RUNTIME-GO | time_window GO 必要 |
| Command Chat 実送信 | CC-03 | BLOCKED |
| Hermes Bridge / WSL2 接続 | HB-01 | BLOCKED |
| OAuth / ログイン | OAUTH-GO | HOLD |
| x_search / SNS 読み取り | XS-READ | FUTURE |
| Obsidian local note 書き込み | OBS-LOCAL | FUTURE |
| 外部 API 書き込み | EXT-WRITE | BLOCKED |
| 投稿 / 返信 / DM / いいね / フォロー | EXT-SOCIAL | BLOCKED |
| 購入 / 予約 / 決済 | EXT-PAYMENT | BLOCKED |

### 物理・メディア系

| 操作 | Gate ID | 現状 |
|---|---|---|
| StackChan 物理動作 | SC-PHYS | FUTURE / 未到着 |
| 音声出力 | VOICE-OUT | HOLD |
| マイク入力 | MIC-IN | HOLD |
| カメラ入力 | CAM-IN | HOLD |

### 状態変更系

| 操作 | Gate ID | 現状 |
|---|---|---|
| productionReady: true に変更 | PROD-GATE | LOCKED_FALSE |
| execution: enabled に変更 | EXEC-GATE | LOCKED_DISABLED |

---

## 現在 Level 5 ブロック中のタスク

### CC-03 — Command Chat 実送信

**状態:** BLOCKED
**ブロック理由:** 外部 AI API への送信 = Level 5

**承認フォーム:**
```yaml
cc03_command_chat_send_go:
  date:
  time_window_start:
  time_window_end:
  test_message_content:
  destination_endpoint:
  approved_ui_action: "UI上のSendボタンを1回クリック"
  max_messages_in_window: 1
  stop_conditions:
    - unexpected_external_request: STOP
    - raw_value_output: STOP
    - productionReady_true: STOP
  shutdown_method: "Ctrl+C または アプリ終了"
  evidence_file: docs/shikishima/CC03_SEND_EVIDENCE_YYYY-MM-DD.md
```

**事後確認:**
- [ ] git status --short → tracked_dirty = 0
- [ ] raw token/secret/path が出力されなかった
- [ ] 意図しない追加送信なし

---

### HB-01 — Hermes Bridge WSL2 接続

**状態:** BLOCKED
**ブロック理由:** WSL2 コマンド実行 + 外部プロセス起動 = Level 5

**承認フォーム:**
```yaml
hb01_hermes_bridge_go:
  date:
  time_window_start:
  time_window_end:
  wsl2_target: "ubuntu or wsl2 distro name"
  approved_command:
  connection_scope: "localhost only / LAN only / etc."
  max_duration_minutes:
  stop_conditions:
    - unexpected_external_network: STOP
    - raw_value_output: STOP
    - productionReady_true: STOP
    - execution_enabled: STOP
  shutdown_method: "Ctrl+C + WSL2 process kill"
  post_run_checks:
    - git status --short
    - port check
  evidence_file: docs/shikishima/HB01_BRIDGE_EVIDENCE_YYYY-MM-DD.md
```

---

### XS-01 — x_search read-only gate

**状態:** BLOCKED / XS-READ gate 未開放
**ブロック理由:** SNS/外部 Web 読み取り = XS-READ gate 必要

**承認フォーム:**
```yaml
xs01_xsread_gate_go:
  date:
  time_window_start:
  time_window_end:
  source: "x.com / web / etc."
  topic:
  query_terms:
  read_only_confirmed: true
  no_write_confirmed: true
  no_post_no_reply_no_dm: true
  no_like_no_follow: true
  no_account_mutation: true
  max_queries_in_window:
  evidence_file: docs/shikishima/XS01_READ_EVIDENCE_YYYY-MM-DD.md
```

---

## 将来 Gate — 準備書類のみ

### OAuth / ログイン (OAUTH-GO)

```yaml
oauth_go_template:
  date:
  time_window:
  provider: "Google / GitHub / etc."
  purpose:
  scopes:
  token_policy: "never store raw token in code/docs"
  evidence_file:
```

### Obsidian ローカルノート書き込み (OBS-LOCAL)

```yaml
obs_local_go_template:
  date:
  time_window:
  vault_scope: "vault name"
  allowed_folders:
  allowed_file_pattern:
  content_rule: "no raw values, no secrets"
  evidence_file:
```

### productionReady / execution 最終 Gate

```yaml
production_ready_gate:
  date:
  human_decision: "productionReady=true を明示的に承認"
  scope:
  acceptance_criteria:
  rollback_plan:

execution_enable_gate:
  date:
  human_decision: "execution=enabled を明示的に承認"
  scope:
  acceptance_criteria:
  rollback_plan:
```

---

## Evidence テンプレート (Level 5 共通)

```yaml
level5_task_evidence:
  task_id:
  result: PASS / PARTIAL / FAIL / STOP
  date:
  time_window_start:
  time_window_end:
  action_performed:
  stop_triggered: false
  raw_value_output: false
  unexpected_external: false
  productionReady_after: false
  execution_after: disabled
  git_status_after: clean
  notes:
```

---

## 絶対安全要件 (全 Level 5 共通)

```
productionReady: false (人間が変更するまで)
execution: disabled (人間が変更するまで)
rawValuesReported: false
外部 write: 明示 GO なしに実行しない
git push: 人間 GO のみ
```

---

> AIは作るところまで。
> 鍵と発射ボタンは人間。
