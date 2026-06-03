# Final Command Center Design Package — Intake Report

## Document Status

```text
roadmapVersion: v3.66.0
date: 2026-05-17
task: UI-01 Design Package Intake
status: COMPLETE
```

---

## Package Info

```text
package_name:  しきしま計画 (2).zip
intake_date:   2026-05-17
files_detected: 17 (+ scraps/ directory)
files_extracted: 17
```

---

## Files Detected

```text
shikishima.jsx         — design tokens + language context + state definitions
pages-shell.jsx        — PageShell / PageTabs / SafetyStrip / ChatInputBar
desktop.jsx            — Desktop Operator View
mobile.jsx             — Mobile Operator View
pages-chat.jsx         — Chat page
pages-suite.jsx        — Outbox / Queue / GO / Evidence / STOP / Push pages
pages-final.jsx        — Settings / Help / Onboarding / IA Map / Flows
pages-states.jsx       — State matrix / empty-loading-error-stale / toasts / command palette
stackchan.jsx          — Desktop StackChan Control Room
stackchan-mobile.jsx   — Mobile StackChan Control Room
backend.jsx            — Backend integration design (3-layer architecture)
policy.jsx             — State lamps / button safety policy
handoff.jsx            — Design tokens / A11y / Responsive / QA / ClaudeCode handoff
ios-frame.jsx          — iOS device frame component
design-canvas.jsx      — Design canvas wrapper
index.html             — CSS variable definitions (theme tokens source of truth)
.design-canvas.state.json — Canvas layout state
scraps/                — Additional design assets
```

---

## Design Scope Confirmed

### Pages (12 primary)

```text
operator    — 操作室 / Operator View (desktop + mobile)
chat        — チャット / Chat page
stackchan   — StackChan Control Room (desktop + mobile)
outbox      — 下書き / Draft Outbox
queue       — 承認待ち / Approval Queue
go          — GO page (copy-only GO template)
evidence    — 証跡 / Evidence
stop        — STOP page
push        — Push page (push-readiness display)
inspector   — 詳細 / Inspector
settings    — 設定 / Settings (local only)
help        — ヘルプ / Help
```

### Shell Components

```text
PageShell       — outer wrapper (topbar + tabs + safetystrip + body)
PageTabs        — 12-tab navigation
SafetyStrip     — always-visible safety summary bar
ChatInputBar    — local chat input (no external send)
MiniLampRow     — compact status lamps
StatusKVList    — KV status bar
```

### States

```text
HOLD          — amber   / 人間GOが必要
GO_READY      — blue    / 人間判断待ち / system will not execute
PASS          — green   / Gate通過
PASS_WITH_CAVEAT — yellow-green
STOP          — red     / 停止 / 人間解除が必要
REJECT        — dark red / 却下
STALE         — amber   / データ古い
UNKNOWN       — gray
DISABLED      — gray
CONNECTED     — green
```

### Design Tokens

```text
Colors:   --paper / --paper2 / --paper3 / --ink / --ink2 / --ink3 / --rule / --bar / --bar-text / --bar-text-2
State:    --hold / --go / --pass / --stop / --reject (+ soft variants)
Fonts:    jp (Noto Sans JP) / sans (IBM Plex Sans) / mono (IBM Plex Mono)
Spacing:  4-36px scale
Radius:   2px / 4px
Theme:    light / dark via html[data-theme]
```

### Breakpoints

```text
mobile:   393px  — iPhone 15 Pro target
tablet:   768px  — portrait tablets (future)
desktop: 1200px  — PC operator base
wide:    1400px  — Inspector / Workflow
```

### Backend Contracts

```text
3-layer:  renderer (React/Vite) → preload (IPC bridge) → main (Electron)
Services: safe-snapshot / local-chat / draft-outbox / approval-queue /
          evidence / push-readiness / stackchan-status / stop-history /
          audit-incident / runtime-observation-status / local-settings
```

### Safety Policy

```text
Button safety:  copy-only / no push / no runtime / no external write
State lamp:     color + code + text (never color alone)
Chat:           local-chat-service only / no external send
Settings:       local preferences only / risky toggles LOCKED
Stale/error:    default to HOLD
```

---

## Expected Coverage Confirmed

```text
[✓] Desktop Operator View
[✓] Mobile Operator View
[✓] PageShell / PageTabs
[✓] Chat page
[✓] ChatInputBar (local only)
[✓] SafetyStrip
[✓] Outbox page
[✓] Queue page
[✓] GO page
[✓] Evidence page
[✓] STOP page
[✓] Push page
[✓] Inspector concept
[✓] Settings page (local only, risky locked)
[✓] Help page
[✓] Onboarding flow
[✓] State matrix
[✓] empty/loading/error/stale states
[✓] toast/notification patterns
[✓] StackChan Control Room (desktop + mobile)
[✓] backend service map
[✓] preload/API policy
[✓] button safety policy
[✓] design tokens
[✓] accessibility
[✓] responsive rules
[✓] QA checklist
[✓] ClaudeCode implementation handoff
```

---

## Missing Items

```text
None critical. All expected coverage confirmed.
```

---

## Implementation Readiness

```text
design_scope:             COMPLETE ✓
token_definitions:        COMPLETE ✓ (index.html is source of truth)
component_contracts:      COMPLETE ✓
backend_service_map:      COMPLETE ✓
safety_policy:            COMPLETE ✓
a11y_requirements:        COMPLETE ✓
responsive_rules:         COMPLETE ✓
qa_checklist:             COMPLETE ✓
implementation_handoff:   COMPLETE ✓

implementation_readiness: READY FOR UI-02 TYPE CONTRACT SCAFFOLD
```

---

この範囲では問題を検出していません。
