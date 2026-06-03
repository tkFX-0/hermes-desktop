# Frontend / Backend UI Contract

## Document Status

```text
roadmapVersion: v3.66.0
date: 2026-05-17
task: UI-01
```

---

## Architecture: 3-Layer Rule

```text
Renderer (React/Vite)
  ALLOWED: display, page switching, copy-only actions, local chat input, status lamps
  FORBIDDEN: Node.js API calls, direct IPC, file system access

Preload (IPC bridge)
  ALLOWED: contextBridge.exposeInMainWorld — window.shikishima.*
  FORBIDDEN: exposing raw Node.js / Electron internals

Main (Electron)
  ALLOWED: IPC handlers, service calls, file system (guarded), safe-snapshot
  FORBIDDEN: external API write, execution enable, productionReady mutation
             without explicit gate approval
```

---

## Page → Service Dependencies

### Operator (操作室)

```text
services:
  safe-snapshot-service    — safety state lamps (productionReady, execution, decision)
  local-chat-service       — recent chat summary
required_fields:
  decision, productionReady, execution, rawValuesReported,
  externalWrite flags, komashikiState, phaseProgress
loading_state:   skeleton + preserve last lamp values
error_state:     HOLD fallback; show error badge
stale_state:     STALE badge on lamps; last-known values; refresh button
empty_state:     first-run message
allowed_buttons: refresh-snapshot, open-chat, copy-lamp-summary
forbidden_buttons: push, runtime-start, execution-enable
```

### Chat (チャット)

```text
services:
  local-chat-service       — message history + send (local only)
  safe-snapshot-service    — safety context strip
required_fields:
  message history, current decision
loading_state:   message list skeleton
error_state:     reconnect prompt; HOLD strip
stale_state:     safety strip shows STALE
empty_state:     welcome message + safety note
allowed_buttons: send-to-shikishima (local only)
forbidden_buttons: external-send, attach-file-to-external, push
safety_wording:  "チャット送信のみ。外部送信・push・実行は行いません。"
```

### StackChan (StackChan)

```text
services:
  stackchan-status-service — connection status, face state
  safe-snapshot-service    — safety context
required_fields:
  connection, physical_operation, voice_camera_mic, face_state
loading_state:   connection indicator UNKNOWN
error_state:     HOLD display; cannot connect
stale_state:     STALE + last-known connection state
empty_state:     device not arrived message
allowed_buttons: refresh-status
forbidden_buttons: physical-operate, voice-enable, camera-enable, mic-enable
```

### Outbox (下書き)

```text
services:
  draft-outbox-service     — draft items, approved_for_manual_copy
required_fields:
  items[].id, .category, .state, .content, .externalWrite, .sent
loading_state:   item list skeleton
error_state:     HOLD; cannot display drafts
stale_state:     STALE badge; last-known list
empty_state:     no drafts message
allowed_buttons: copy-draft-content, view-detail
forbidden_buttons: send, create-remote, pay, execute
```

### Queue (承認待ち)

```text
services:
  approval-queue-service   — queue items (display only)
required_fields:
  items[].id, .title, .status, .riskLevel, .requestedAt
loading_state:   queue skeleton
error_state:     HOLD
stale_state:     STALE badge
empty_state:     queue empty message
allowed_buttons: copy-item-summary
forbidden_buttons: approve-execute, auto-approve, batch-process
note:
  Approve/Hold/Reject labels are COPY-LABEL actions only.
  No automated approval from UI.
```

### GO (GO)

```text
services:
  runtime-observation-status-service — current obs status
  evidence-service                   — relevant evidence list
required_fields:
  current observation status, available GO templates
loading_state:   HOLD
error_state:     HOLD
stale_state:     STALE + HOLD fallback
empty_state:     no active observation
allowed_buttons: copy-go-template, copy-evidence-summary
forbidden_buttons: start-runtime, auto-execute-go
note:
  GO is a human authorization phrase (copy-only).
  System does not execute on GO button press.
```

### Evidence (証跡)

```text
services:
  evidence-service         — evidence records list
required_fields:
  records[].id, .gate, .result, .date, .summary
loading_state:   list skeleton
error_state:     HOLD
stale_state:     STALE badge
empty_state:     no evidence yet
allowed_buttons: copy-evidence-content, view-detail
forbidden_buttons: delete-evidence, overwrite-evidence
```

### STOP (STOP)

```text
services:
  stop-history-service     — STOP event history
  audit-incident-service   — audit classification records
required_fields:
  events[].date, .trigger, .resolution
loading_state:   HOLD display
error_state:     HOLD
stale_state:     STALE badge
empty_state:     no STOP events (nominal)
allowed_buttons: copy-stop-event-detail
forbidden_buttons: clear-stop-history, resume-without-review
```

### Push (Push)

```text
services:
  push-readiness-service   — branch, commits_ahead, staged, dirty
required_fields:
  branch, origin_main, head, commits_ahead, staged, tracked_dirty
loading_state:   HOLD
error_state:     HOLD
stale_state:     STALE badge
empty_state:     up to date
allowed_buttons: copy-push-readiness-summary, refresh
forbidden_buttons: git-push (UI must NEVER trigger git push)
```

### Inspector (詳細)

```text
services:
  safe-snapshot-service
  evidence-service
  stackchan-status-service
  push-readiness-service
required_fields:
  full snapshot + all service states
loading_state:   multi-service skeleton
error_state:     HOLD for each failed service
stale_state:     per-service STALE badge
empty_state:     all nominal
allowed_buttons: refresh-all, copy-full-summary
forbidden_buttons: any execution, any write
```

### Settings (設定)

```text
services:
  local-settings-service   — local preferences only
allowed_settings:
  language, theme, safety_strip_density, default_page, default_mode,
  chat_send_label, show_safety_note, auto_copy_template,
  snapshot_refresh_interval, stale_threshold, on_stale,
  toast_enabled, toast_linger
locked_settings (non-interactive):
  productionReady toggle     — LOCKED
  execution enable           — LOCKED
  external write permissions — LOCKED
  StackChan physical         — LOCKED
  voice / camera / mic       — LOCKED
```

### Help (ヘルプ)

```text
services: none (static content)
content:  safety policy summary, operational rules, gate descriptions
allowed_buttons: copy-section, navigate-to-page
forbidden_buttons: none applicable (read-only)
```

---

## Global Rule: UNKNOWN / STALE / ERROR → HOLD

```text
Any page where data cannot be confirmed must display:
  decision: HOLD (fallback)
  lamp: HOLD color (amber)
  badge: STALE or ERROR

Never display GO_READY or PASS if data source is unavailable.
```

---

この範囲では問題を検出していません。
