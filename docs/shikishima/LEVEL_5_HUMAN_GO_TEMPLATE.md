# Level 5 Human GO Templates

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** TEMPLATE LIBRARY — copy and fill for each gate

---

## Usage

Copy the relevant template, fill all fields, and send as your GO message.
**All fields must be filled. Empty fields = STOP.**

---

## 1. Obsidian Local Write GO

```text
ob01_local_write_go:
  date:
  time_window_jst:
  vault_path:              [local path — do not include raw path in evidence]
  allowed_folders:         (e.g. 30_Evidence/ only)
  allowed_note_types:      (Evidence / Handoff / Research)
  note_template:           (from LIB_02_NOTE_TEMPLATES.md)
  rawValues_check:         true
  stop_if:                 (token appears / path outside root / overwrite)
  evidence_file:           docs/shikishima/OB01_WRITE_EVIDENCE_YYYY-MM-DD.md
```

---

## 2. Discord Read-Only Intake GO

```text
dis01_read_only_go:
  date:
  time_window_jst:
  discord_server_id:
  approved_channel_id:
  approved_user_id:        (optional)
  read_count_or_range:
  allowed_run_count:       1
  stop_if:                 (token / write action / wrong channel / loop)
  evidence_file:           docs/shikishima/DIS01_READ_EVIDENCE_YYYY-MM-DD.md
```

---

## 3. Discord One-Shot Reply GO

```text
dis03_reply_go:
  date:
  time_window_jst:
  approved_server_id:
  approved_channel_id:
  exact_message_content:   [verbatim — no deviation]
  allowed_send_count:      1
  dry_run_completed:       true/false
  stop_if:                 (content deviation / >1 send / loop / token)
  rollback_or_disable:     (how to revoke token or stop bot)
  evidence_file:           docs/shikishima/DIS03_REPLY_EVIDENCE_YYYY-MM-DD.md
```

---

## 4. XS-AUTO One-Shot Read-Only GO

```text
xs_auto_read_go:
  date:
  time_window_jst:
  watchlist_id:            (WI-001 to WI-005)
  query:                   (exact query string)
  allowed_run_count:       1
  source_scope:            public web search only
  read_only_confirmation:  true
  stop_if:                 (token / write action / 429 / private data)
  evidence_file:           docs/shikishima/XS_AUTO_RUN_YYYY-MM-DD.md
```

---

## 5. HB-01 Hermes/WSL GO

```text
hb01_hermes_wsl_go:
  date:
  time_window_jst:
  purpose:
  allowed_environment:     (WSL2 distro name)
  allowed_commands:        (explicit list — no wildcards)
  forbidden_commands:      (explicit list)
  token_policy:            (no token printed to output)
  expected_result:
  stop_if:                 (unexpected process / token / scope expansion)
  shutdown:                (how to stop WSL process)
  evidence_file:           docs/shikishima/HB01_WSL_EVIDENCE_YYYY-MM-DD.md
```

---

## 6. CC-03 Command Chat One-Shot GO

```text
cc03_real_send_go:
  date:
  time_window_jst:
  exact_target:            (endpoint / model / service)
  allowed_message:         [verbatim — human-approved content]
  command_or_ui_path:
  dry_run_completed:       true/false
  allowed_send_count:      1
  stop_if:                 (loop / wrong target / content deviation)
  rollback_or_disable:     (how to disable send endpoint)
  evidence_file:           docs/shikishima/CC03_SEND_EVIDENCE_YYYY-MM-DD.md
```

---

## 7. StackChan Display-Only GO

```text
stackchan_display_go:
  date:
  time_window_jst:
  connection_type:         (USB serial / Wi-Fi local only)
  allowed_actions:         (expression change / display only)
  forbidden_actions:       (physical motion / sound / camera)
  stop_if:                 (unexpected motion / wrong device / token)
  shutdown:                (how to disconnect)
  evidence_file:           docs/shikishima/SC_DISPLAY_EVIDENCE_YYYY-MM-DD.md
```

---

## 8. StackChan Physical / Motion GO

```text
stackchan_motion_go:
  date:
  time_window_jst:
  allowed_motion:          (exact motion sequence — no wildcards)
  max_motion_count:        (integer)
  safety_area:             (clear area confirmed)
  stop_if:                 (unexpected range / collision risk / wrong device)
  emergency_stop:          (how to power off immediately)
  evidence_file:           docs/shikishima/SC_MOTION_EVIDENCE_YYYY-MM-DD.md
```

---

## 9. X Account Read-Only OAuth GO

```text
xacc01_read_only_auth_go:
  date:
  time_window_jst:
  account_type:            (sub-account recommended / main)
  requested_scopes:        tweet.read users.read
  token_storage_method:    (local ignored file / env var)
  callback_url:            (local only)
  stop_if:                 (write scope requested / token exposed / OAuth fails)
  evidence_file:           docs/shikishima/XACC01_AUTH_EVIDENCE_YYYY-MM-DD.md
```

---

## 10. X Write GO

```text
xacc_write_go:
  date:
  time_window_jst:
  account_type:            (sub-account recommended / main)
  action_type:             post / reply
  target_post_id:          (if reply — exact post ID)
  exact_content:           [verbatim — no deviation allowed]
  allowed_send_count:      1
  dry_run_completed:       true/false
  stop_if:                 (content deviation / >1 send / loop / token)
  rollback_or_disable:     (revoke token or manual delete path)
  evidence_file:           docs/shikishima/XACC_WRITE_EVIDENCE_YYYY-MM-DD.md
```

---

## 11. productionReady True GO

```text
productionReady_go:
  date:
  decision:                GO
  confirmed_by:            tk
  scope:                   [exact description of what this approves]
  prerequisites_verified:  (all Level 5 gates passed / list)
  this_does_not_approve:   (list)
  evidence_file:           docs/shikishima/PRODUCTION_READY_APPROVAL_YYYY-MM-DD.md
```

---

## 12. Execution Enabled GO

```text
execution_go:
  date:
  decision:                GO
  confirmed_by:            tk
  scope:                   [exact description]
  prerequisites_verified:  (productionReady true + all gates + list)
  this_does_not_approve:   (list)
  evidence_file:           docs/shikishima/EXECUTION_ENABLED_APPROVAL_YYYY-MM-DD.md
```

---

## General Rules

```text
- Every field must be filled
- "any" is not an acceptable value for scope fields
- exact_content / exact_message must be verbatim
- evidence_file path must be set before GO is issued
- stop_if must include at minimum: token appears / scope expands / loop starts
```
