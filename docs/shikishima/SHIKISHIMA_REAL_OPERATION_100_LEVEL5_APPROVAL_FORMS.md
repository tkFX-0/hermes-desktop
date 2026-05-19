# しきしま実運用100% — Level 5 Approval Forms

**Baseline:** aadea91 | **Prepared:** 2026-05-19

---

## CC-03 — Command Chat 実送信

```yaml
cc03_approval:
  date:
  time_window_start:           # HH:MM JST
  time_window_end:
  endpoint_or_target:          # 送信先エンドポイント
  test_message_content:        # テストメッセージ内容
  max_messages_in_window:      1  # 1回のみ
  allowed_ui_action:           # UI上の操作
  forbidden_actions:
    - autonomous_repeat_send
    - external_unintended_write
    - retry_loop
    - secret_output
  stop_conditions:
    - wrong_endpoint: STOP
    - repeated_sends: STOP
    - raw_value_output: STOP
    - productionReady_true: STOP
    - execution_enabled: STOP
    - unexpected_external_request: STOP
  post_run_checks:
    - git_status_clean: true
    - no_raw_value_in_chat: true
  evidence_file:               # docs/shikishima/CC03_EVIDENCE_YYYY-MM-DD.md
  human_notes:
```

---

## HB-01 — Hermes Bridge WSL2 接続

```yaml
hb01_approval:
  date:
  time_window_start:
  time_window_end:
  wsl2_target:                 # ubuntu / wsl2 distro name
  approved_command:            # 承認するコマンド (1つのみ)
  connection_scope:            # localhost only / LAN only など
  max_duration_minutes:
  forbidden_actions:
    - external_network_unless_approved
    - raw_local_path_in_docs
    - uncontrolled_exec
    - productionReady_flip
    - execution_enable
  stop_conditions:
    - unexpected_external_network: STOP
    - raw_value_output: STOP
    - productionReady_true: STOP
    - execution_enabled: STOP
    - wsl_process_not_stopping: STOP
  post_run_checks:
    - runtime_stopped: true
    - git_status_clean: true
    - port_check: optional
  evidence_file:               # docs/shikishima/HB01_EVIDENCE_YYYY-MM-DD.md
  shutdown_method:             # Ctrl+C + WSL process kill
  human_notes:
```

---

## XS-01 — x_search read-only Gate

```yaml
xs01_approval:
  source:                      # x.com / web / etc.
  topic:
  query_terms:
  read_only_confirmed: true
  no_write_confirmed: true
  no_post: true
  no_reply: true
  no_dm: true
  no_like: true
  no_follow: true
  no_delete: true
  no_account_mutation: true
  max_queries_in_session:
  autonomous_polling_allowed: false
  stop_conditions:
    - write_action_attempted: STOP
    - account_mutation: STOP
    - unexpected_external_write: STOP
  evidence_file:               # docs/shikishima/XS01_EVIDENCE_YYYY-MM-DD.md
  human_notes:
```

---

## productionReady 最終 Gate

```yaml
production_ready_final_gate:
  date:
  reason:                      # なぜ productionReady: true にするか
  all_phases_reviewed:         # true / false
  evidence_reviewed:           # list of evidence files
  rollback_plan:               # どうやって戻すか
  human_decision:              # 「productionReady=true を明示的に承認する」
  evidence_file:
```

---

## execution enable 最終 Gate

```yaml
execution_enable_final_gate:
  date:
  time_window_start:
  time_window_end:
  scope:                       # 何の execution を有効化するか (限定的に)
  allowed_commands:            # 明示的に承認するコマンドのリスト
  forbidden_actions:
    - unscoped_execution
    - external_write_without_gate
    - autonomous_repeat
  stop_conditions:
    - out_of_scope_execution: STOP
    - raw_value_output: STOP
    - unexpected_external: STOP
  rollback_plan:
  human_decision:              # 「execution=enabled を scope=[X] で明示的に承認する」
  evidence_file:
```
