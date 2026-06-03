# Command Center UI Button Wording Policy

## Document Status

```text
roadmapVersion: v3.67.0
date: 2026-05-17
gate: Post-100 Gate 007
name: UI Button Wording Policy
status: POLICY_DEFINED — applies to UI-02 and all subsequent implementation phases
```

---

## Core Rules

```text
1. Dangerous or side-effect actions must never use direct execution wording.
   Bad:  "Execute" "Run" "Send" "Post" "Create" "Pay" "Connect"
   Good: "Copy template" "Copy draft" "Copy GO phrase" "View detail"

2. UI must avoid words that imply autonomous execution.
   Bad:  "Auto-approve" "Auto-send" "Auto-post" "Auto-create"
   Good: "Copy for manual review" "View approval status"

3. Buttons must be copy-only, draft-only, preview-only, or request-review-only
   unless a later explicit GO approves otherwise.

4. Disabled buttons must visually AND textually communicate disabled/HOLD state.
   Bad:  grayed out with no label change
   Good: grayed out + label says "HOLD — ClaudeCode GO required"
         or cursor:not-allowed + tooltip "この操作はClaudeCodeのGOが必要です"

5. Approval Queue buttons must remain display-only
   unless future explicit GO changes this.
   Reason: displaying "Approve" could mislead user into thinking it executes.
   Safe form: "Copy approval record" / "View queue item"

6. Draft Outbox buttons must not send, create remote resources, pay, reserve, or post.
   Safe form: "Copy draft text" / "Mark reviewed (local only)"

7. Push-related UI must not imply git push can happen from UI.
   Safe form: "Copy push-readiness summary" / "View commit list"
   Tooltip: "pushはClaudeCodeのGOから行います"

8. StackChan controls must not imply physical motion or real device connection.
   Safe form: "View connection status" / "Copy status summary"
   Not: "Connect" "Move" "Activate"

9. Voice/camera/mic controls must not imply activation.
   Safe form: "View sensor status" (display-only)
   Not: "Start voice" "Enable camera" "Activate mic"
```

---

## Wording Policy Table

| Area | Unsafe wording | Safe wording | Reason |
|---|---|---|---|
| Send email | "Send" / "メール送信" | "Copy draft text" / "下書きをコピー" | email_sent must remain false |
| Create calendar event | "Create event" / "予定を作成" | "Copy event template" / "テンプレートをコピー" | calendar_event_created must remain false |
| Create GitHub issue | "Create issue" / "Issueを作成" | "Copy issue draft" / "下書きをコピー" | github_remote_created must remain false |
| Create GitHub PR | "Create PR" / "PRを作成" | "Copy PR template" / "テンプレートをコピー" | github_remote_created must remain false |
| Push to remote | "Push" / "プッシュ" | "Copy push-readiness summary" / "push準備状況をコピー" | git push must not happen from UI |
| Approve task (queue) | "Approve" / "承認する" | "Copy approval record" / "承認記録をコピー" | approval is human action outside system |
| Reject task (queue) | "Reject" / "却下する" | "Copy rejection record" / "却下記録をコピー" | same as approve |
| Start runtime | "Start" / "起動する" | "View runtime status" / "ランタイム状態を表示" | runtime start requires explicit GO |
| Open port 3030 | "Open port" / "ポートを開く" | N/A — button must not exist | port_3030 must not open from UI |
| StackChan connect | "Connect" / "接続する" | "View connection status" / "接続状態を表示" | physical operation remains HOLD |
| StackChan move | "Move" / "動かす" / "操作する" | N/A — button must not exist | StackChan_physical_operation must remain false |
| Start voice | "Start voice" / "音声開始" | "View voice status" / "音声状態を表示" | voice activation remains HOLD |
| Start camera | "Start camera" / "カメラ開始" | "View camera status" / "カメラ状態を表示" | camera activation remains HOLD |
| Start microphone | "Start mic" / "マイク開始" | "View mic status" / "マイク状態を表示" | mic activation remains HOLD |
| Purchase/reservation | "Purchase" / "予約する" / "決済する" | N/A — button must not exist | purchase_or_reservation_made must remain false |
| Execute command | "Execute" / "実行する" / "Run" | "Copy command template" / "コマンドをコピー" | execution: disabled |
| GO (approval phrase) | "GO" as a clickable action button | "Copy GO phrase" / "GOフレーズをコピー" | GO is a human phrase, not a button action |
| Deploy | "Deploy" / "デプロイ" | N/A — must not appear | deployment not approved |
| productionReady toggle | any toggle label | N/A — must be LOCKED with lock icon | productionReady: false permanent until Gate 005 |
| execution enable | any toggle label | N/A — must be LOCKED with lock icon | execution: disabled permanent until explicit GO |

---

## Chat Send Special Rule

```text
Chat send IS allowed but must be labeled precisely:
  Label:   "しきしまへ送信" or "Send to Shikishima"
  Tooltip: "チャット送信のみ。外部送信・push・実行は行いません。"
  Target:  local-chat-service ONLY
  Never:   send to email / Discord / Slack / any external service
```

---

## Approved Button Labels (reference)

```text
copy-*:             "コピー" / "Copy" / "テンプレートをコピー" / "Copy template"
view-*:             "表示" / "View" / "詳細を見る" / "View detail"
refresh-*:          "更新" / "Refresh" / "スナップショットを更新"
navigate-*:         tab labels (navigation only)
local-chat-send:    "しきしまへ送信" (local only, with safety note)
mark-reviewed:      "確認済み（ローカル）" (local state only, no external effect)
```

---

## Locked Control Visual Spec

```text
All locked controls must:
  display: lock icon (🔒 equivalent SVG or text marker)
  color: sk.ink3 (tertiary / gray)
  cursor: not-allowed
  pointer-events: none
  tooltip: "この設定はClaudeCodeのGOが必要です"
  aria-disabled: true
  aria-label: include "HOLD" or "locked"

Never:
  hide locked controls entirely (invisible = confusing)
  use the same visual as enabled buttons
  allow any interaction
```

---

この範囲では問題を検出していません。
