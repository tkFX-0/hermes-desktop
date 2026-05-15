# iPhone Private Console — UI Spec
date: 2026-05-15
status: design_draft — not implemented
target: iPhone Safari / PWA (portrait, 390px width)

---

## Design Principles

- Japanese-first labels
- Large readable text (minimum 14px body, 18px headings)
- Safety banner always visible at top of every screen
- Red / orange for HOLD boundaries
- Green for confirmed-safe states
- No tiny desktop-like enum walls
- Single-column layout (portrait-first)
- Tap-friendly touch targets (minimum 44px)

---

## Safety Banner (persistent, all screens)

Appears at the very top of every screen. Cannot be dismissed.

```
┌─────────────────────────────────────────────┐
│ ⚠ しきしま 安全境界                         │
│ 判定:      HOLD                             │
│ 実行状態:  disabled                         │
│ 本番準備:  false                            │
│ raw値:     非表示                           │
│ Level 3:   未承認                           │
└─────────────────────────────────────────────┘
```

Color: orange border (#fb923c) on dark background (#161b22)
Font: monospace for values, 13px

---

## Screen 1 — Home / Safety Status

**Purpose:** At-a-glance Shikishima health.

```
┌─────────────────────────────────────────────┐
│ [Safety Banner — always]                    │
├─────────────────────────────────────────────┤
│  しきしま 状態                              │
│  ─────────────────────────────────────────  │
│  appStatus:        [enum label]             │
│  bridgeReadiness:  [label]                  │
│  nextGoal:         [redacted summary]       │
│  ─────────────────────────────────────────  │
│  ブロッカー: [count]  警告: [count]         │
│  ─────────────────────────────────────────  │
│  最終更新: [HH:MM]                          │
└─────────────────────────────────────────────┘
```

Forbidden fields: raw values, absolute paths, API keys

---

## Screen 2 — B3 Session Progress

**Purpose:** Track clean B3 PASS progress toward Level 3 gate.

```
┌─────────────────────────────────────────────┐
│ [Safety Banner]                             │
├─────────────────────────────────────────────┤
│  B3 セッション進捗                          │
│  ─────────────────────────────────────────  │
│  CLEAN PASS: ████░  4 / 5                  │
│                                             │
│  次のセッション: Session-009                │
│  タイミングルール: 時間窓開始 +30秒以降     │
│                                             │
│  最近のセッション:                          │
│  ✓ Session-007  CLEAN_PASS                 │
│  ✓ Session-006  CLEAN_PASS                 │
│  △ Session-008  PASS_WITH_TIMING_CAVEAT    │
│  ✗ Session-002  STOP                       │
│  ─────────────────────────────────────────  │
│  Level 3: 未承認 (5/5 完了後に人間GO必要)  │
└─────────────────────────────────────────────┘
```

---

## Screen 3 — GO Drafts

**Purpose:** Show pre-generated GO templates that the human can copy and
paste into ClaudeCode or GPT. No automatic execution.

```
┌─────────────────────────────────────────────┐
│ [Safety Banner]                             │
├─────────────────────────────────────────────┤
│  GO テンプレート (コピーのみ — 実行なし)    │
│  ─────────────────────────────────────────  │
│  ▼ Session-009 GO                          │
│  ┌──────────────────────────────────────┐  │
│  │ 2026-05-15 HH:MM-HH:MM JST           │  │
│  │ Approved session: ...                │  │
│  │ Approved purpose: ...                │  │
│  └──────────────────────────────────────┘  │
│  [コピー]                                  │
│  ─────────────────────────────────────────  │
│  ▼ Push GO テンプレート                    │
│  ┌──────────────────────────────────────┐  │
│  │ I explicitly approve git push for    │  │
│  │ commit [HEAD] only.                  │  │
│  │ ...                                  │  │
│  └──────────────────────────────────────┘  │
│  [コピー]                                  │
└─────────────────────────────────────────────┘
```

Copy button calls navigator.clipboard.writeText() only.
No submission. No execution. Text only.

---

## Screen 4 — Evidence / Audit Summary

**Purpose:** Quick summary of recent session evidence.

```
┌─────────────────────────────────────────────┐
│ [Safety Banner]                             │
├─────────────────────────────────────────────┤
│  証跡サマリー                               │
│  ─────────────────────────────────────────  │
│  最近の操作 (最大10件):                     │
│  ─────────────────────────────────────────  │
│  2026-05-15 11:07  Session-009 STOP         │
│  2026-05-15 01:48  CC redesign commit       │
│  2026-05-14 23:47  Session-007 CLEAN_PASS   │
│  ...                                        │
│  ─────────────────────────────────────────  │
│  承認キュー待ち: [count]                    │
│  監査ログ件数:   [count]                    │
└─────────────────────────────────────────────┘
```

No raw values. Timestamps and labels only.

---

## Screen 5 — Push Readiness

**Purpose:** Show whether a push is ready without exposing raw state.

```
┌─────────────────────────────────────────────┐
│ [Safety Banner]                             │
├─────────────────────────────────────────────┤
│  Push 準備状態                              │
│  ─────────────────────────────────────────  │
│  branch:          main                      │
│  HEAD:            2e41032                   │
│  origin/main:     2e41032                   │
│  commits_ahead:   0                         │
│  staged:          0                         │
│  dirty_tracked:   0                         │
│  ─────────────────────────────────────────  │
│  推奨: 現在pushするものなし                 │
│                                             │
│  ⚠ push GO は別途発行が必要               │
│    (このUIからpushは実行できません)         │
└─────────────────────────────────────────────┘
```

---

## Screen 6 — Agent Team Overview

**Purpose:** Show all 10 agents and their status.

```
┌─────────────────────────────────────────────┐
│ [Safety Banner]                             │
├─────────────────────────────────────────────┤
│  エージェントチーム                         │
│  スケジューラー: 無効                       │
│  ─────────────────────────────────────────  │
│  [紫] 統括スーパーバイザ                   │
│       無効化中 / ドライランのみ / 承認必須  │
│  [青] Hermes 作業                          │
│       無効化中 / ドライランのみ / 承認必須  │
│  [緑] イツキシマ審査                       │
│       ...                                   │
│  (10 agents, same card pattern)             │
└─────────────────────────────────────────────┘
```

---

## Screen 7 — Settings / Access Status

**Purpose:** Show current connection info and pairing status.

```
┌─────────────────────────────────────────────┐
│ [Safety Banner]                             │
├─────────────────────────────────────────────┤
│  アクセス設定                               │
│  ─────────────────────────────────────────  │
│  接続元: [LAN / Tailscale / --]             │
│  認証:   ペアリング済み / 未接続            │
│  セッション期限: [HH:MM] まで              │
│  ─────────────────────────────────────────  │
│  アクセスログ:                              │
│  11:07 接続 [device fingerprint hash]       │
│  ─────────────────────────────────────────  │
│  ⚠ トークンはWindowsアプリにのみ表示       │
│    このUIにはトークンを表示しない           │
└─────────────────────────────────────────────┘
```

Pairing token is NEVER shown on iPhone. Only on Windows Electron UI.

---

## Navigation (bottom tab bar)

```
[状態] [B3] [GO] [証跡] [push] [AG] [設定]
```

Icons: lucide-react compatible
Active tab: highlighted in #58a6ff
Safety banner: sticky, above tab bar content

---

## Responsive Breakpoints

| Width | Layout |
|---|---|
| < 430px (iPhone) | Single column, large text |
| 430-768px (iPad mini) | Single column, slightly wider cards |
| > 768px (desktop) | Not the primary target; must still render safely |

---

この範囲では問題を検出していません
