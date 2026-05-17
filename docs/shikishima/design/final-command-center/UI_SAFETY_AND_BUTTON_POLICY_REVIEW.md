# UI Safety and Button Policy Review

## Document Status

```text
roadmapVersion: v3.66.0
date: 2026-05-17
task: UI-01
```

---

## Safety Policy Confirmation

```text
[✓] No UI push button
      PushPage shows push-readiness only. No button triggers git push.

[✓] No UI runtime start button
      GoPage shows GO templates (copy-only). No button starts npm run dev.

[✓] No productionReady true toggle
      SettingsPage has no productionReady toggle. Locked section confirms.

[✓] No execution enable toggle
      SettingsPage locked section: execution enable is non-interactive.

[✓] No external send/post/create/pay/reserve button
      OutboxPage: send/create/pay buttons exist in design but marked inactive.
      QueuePage: approve is copy-label only.
      No active external-write action in any page.

[✓] No StackChan physical operation button
      StackChanPage: physical operation remains HOLD.
      No physical-operate button is interactive.

[✓] No voice/camera/mic enable button
      StackChanPage: voice/camera/mic shows disabled state.
      Settings locked section: voice/camera/mic non-interactive.

[✓] Chat send is local chat only
      ChatInputBar: sends to local-chat-service only.
      No external target. No email/Discord/Slack.

[✓] GO templates are copy-only
      GoPage: copy-go-template button only.
      System does not execute on copy.

[✓] Evidence templates are copy-only
      EvidencePage: copy-evidence-content button.

[✓] Push GO is copy-only
      PushPage: copy-push-readiness-summary only.

[✓] Command palette is copy/read-only
      CommandPalette: quick-copy actions only. No execution.

[✓] Settings cannot unlock risky capabilities
      Locked settings section: productionReady / execution / external write /
      StackChan physical / voice-camera-mic all non-interactive.

[✓] Stale/error states default to HOLD
      All pages: UNKNOWN / STALE / ERROR → HOLD fallback.
      Last-known lamp values preserved on STALE.

[✓] Safety note visible on chat send
      ChatInputBar shows "チャット送信のみ。外部送信・push・実行は行いません。"
```

---

## Required Safety Wording

```text
Chat input:
  "チャット送信のみ。外部送信・push・実行は行いません。"

Outbox copy action:
  "このコピーはシステム外での手動アクション用です。自動送信はしません。"

GO copy action:
  "これはコピー用テンプレートです。自動実行は行いません。"

Push readiness:
  "このページはpush準備状態の表示のみです。pushはClaudeCodeのGOから行います。"
```

---

## GO Interpretation Rule

```text
GO is NOT automatic execution.
GO is a human authorization phrase for the next reviewed step.

When a human copies a GO template from GoPage, they are:
  1. Copying text to their clipboard
  2. Manually pasting it into the ClaudeCode prompt
  3. ClaudeCode receives the GO and acts within approved scope

The UI does not execute the GO. The UI does not send the GO anywhere.
```

---

## Button Classification Summary

```text
ALLOWED buttons in UI:
  copy-*                — copy content to clipboard
  navigate-to-*         — tab/page navigation
  refresh-snapshot      — request fresh snapshot from service
  local-chat-send       — send message to local-chat-service
  view-detail           — expand/collapse detail panel

FORBIDDEN buttons (must not exist or must be non-interactive):
  git-push              — FORBIDDEN
  start-runtime         — FORBIDDEN
  enable-execution      — FORBIDDEN
  set-productionReady   — FORBIDDEN
  send-email            — FORBIDDEN
  create-calendar-event — FORBIDDEN
  create-github-remote  — FORBIDDEN
  post-social           — FORBIDDEN
  pay / reserve         — FORBIDDEN
  operate-stackchan     — FORBIDDEN
  enable-voice          — FORBIDDEN
  enable-camera         — FORBIDDEN
  enable-mic            — FORBIDDEN
```

---

## Locked Settings Visual Spec

```text
Locked settings must:
  1. Show a lock icon (🔒 or equivalent)
  2. Be visually grayed out (ink3 / disabled opacity)
  3. Have cursor: not-allowed
  4. Show tooltip on hover: "この設定はClaudeCodeのGOが必要です"
  5. NOT fire any action on click

Locked items:
  productionReady → true    LOCKED
  execution → enabled       LOCKED
  external write access     LOCKED
  StackChan physical        LOCKED
  voice / camera / mic      LOCKED
```

---

この範囲では問題を検出していません。
