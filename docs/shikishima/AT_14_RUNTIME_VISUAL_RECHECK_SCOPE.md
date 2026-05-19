# AT-14 Runtime Visual Recheck — Scope

**Prepared:** 2026-05-19
**Baseline:** a8ef150 — chore: polish agent theater visual layout
**Runtime status:** HOLD — time_window GO required

---

## Scope Summary

One human visual recheck session covers AT-07 through AT-13.
The observer navigates to the Agent Theater / 管制室 screen and verifies each item below.

Runtime must be started only within the approved time_window.
Shutdown must be Ctrl+C with git status verification after.

---

## Section Navigation

The Agent Theater screen renders sections in this order (top to bottom):

1. Page header: `管制室 · THEATER`
2. **ControlRoomLayout** — dark control room with 5 agent zones + handoff lane (AT-07)
3. **SlotStatusBar** — slot/worker/gate status table (AT-08 / AT-13)
4. **WorkerStatusPanel** — worker cards + autonomy level legend (AT-08)
5. **ResumeQueuePanel** — resume queue / cooldown panel (AT-09)
6. **RunawayGuardPanel** — runaway guard / human-gated action panel (AT-10)
7. **WorkerRoutingPanel** — worker routing + handoff prompt preview + safety strip (AT-11)
8. **GateDashboardPanel** — gate dashboard / future gate panel (AT-12)
9. **PageRightRail** — sidebar (visible at >= 900px desktop width)

---

## Observation Points Per Section

### 1. Page header

- `管制室 · THEATER` heading visible
- Font: IBM Plex Mono monospace
- No buttons, no action controls

### 2. ControlRoomLayout (AT-07)

| Element | Expected |
|---|---|
| Section background | #0d1117 dark |
| Room header | `🌙 CONTROL ROOM · 管制室` in blue (#58a6ff) |
| NightWindow | 2×2 grid, dark panels with colored dots |
| Safety badge strip | execution: disabled / productionReady: false / rawValues: hidden / ext.write: false / runtime: human GO / push: human GO |
| decision badge | reflects current decision (color-coded) |
| DotGridStrip | dot-grid accent above and below agent zones |
| Agent zone grid | 5 cards, auto-fit responsive |
| HandoffLane | 6 steps visible, active step highlighted |
| HandoffCard | floating above active step |
| "引き渡しフロー" label | visible above handoff lane |

### 3. SlotStatusBar (AT-08 / AT-13)

| Element | Expected |
|---|---|
| Section heading | `スロット` (Japanese) or `SLOTS` (English) |
| 7 rows | CONVERSE / PLAN / SAFETY / DEV-CODEX / DEV-CC / RECORD / SOCIAL |
| Status badges | active (green) / idle (gray) / HOLD (amber) |
| Worker labels | Grok-Hermes / GPT / しずめ / Codex / ClaudeCode / しるべ / x_search |
| Gate required | GHG-03 / scoped GO / XS-03 visible for HOLD slots |
| No horizontal overflow | row items visible without clipping critical labels |

### 4. WorkerStatusPanel (AT-08)

| Element | Expected |
|---|---|
| Section heading | `ワーカー` |
| 5 worker cards | GPT (green) / ClaudeCode (purple) / Codex (blue) / Cursor (gray) / Human Gate (orange) |
| Status badges | READY / BLOCKED / NEEDS_HUMAN per card |
| Level legend | Lv 1–5 rows |
| Lv 4 badge | `AI作業OK` green |
| Lv 5 badge | `人間GO必須` orange |
| Level 5 actions | push / runtime / OAuth / x_search / Obsidian write / external write listed |
| Tagline | `AIは作るところまで。鍵と発射ボタンは人間。` |

### 5. ResumeQueuePanel (AT-09)

| Element | Expected |
|---|---|
| Section heading | `再開キュー` |
| 4 task cards | AT-09 (ACTIVE) / AT-07-RECHECK (NEEDS_HUMAN) / XS-READ-GATE (NEEDS_HUMAN) / CURSOR-WORKER (PAUSED) |
| Level badges | Lv 4 (green) / Lv 5 (orange) per card |
| Human GO badge | visible on NEEDS_HUMAN cards |
| Safety badge strip | API auto-use: disabled / runtime: human GO / push: human GO / OAuth: human GO / x_search: read-only GO / Obsidian: local GO / 外部write: blocked (red) |

### 6. RunawayGuardPanel (AT-10)

| Element | Expected |
|---|---|
| Panel header | `RUNAWAY GUARD · 監視境界` + red `AI自動実行禁止` badge |
| 9 action cards | all visible, left-border colored per status |
| Lv 4 / Lv 5 boundary | both badges visible |
| Taglines | `AIは作るところまで。` / `鍵と発射ボタンは人間。` |

### 7. WorkerRoutingPanel (AT-11)

| Element | Expected |
|---|---|
| Section heading | `ルーティング` |
| 5 route cards | GPT / ClaudeCode / Codex / Cursor / Human Gate |
| Lv labels | Lv 1–2 / Lv 2–4 / Lv 3–4 / optional / Lv 5 |
| Human GO badge | on Cursor and Human Gate cards |
| 3 prompt preview blocks | ClaudeCode / Codex / Human |
| Safety badge strip | auto-dispatch: disabled / API auto-use: disabled / push: human GO / runtime: time_window GO / OAuth: human GO / x_search: read-only GO / Obsidian: local GO / 外部write: blocked (red) |
| Level 4/5 boundary | `Level 4まで: AI作業候補` / `Level 5: 人間GO必須` |

### 8. GateDashboardPanel (AT-12)

| Element | Expected |
|---|---|
| Panel header | `GATE DASHBOARD · 未来ゲート` |
| Summary badges | productionReady: false / execution: disabled / rawValuesReported: false / runtime: HOLD / external write: blocked / Level 5: human GO |
| 12 gate cards | all visible |
| PUSH-GO | NEEDS_HUMAN, orange |
| RUNTIME-GO | NEEDS_HUMAN, orange |
| OAUTH-GO | HOLD, purple |
| XS-READ | FUTURE, yellow |
| OBS-LOCAL | FUTURE, blue |
| EXTERNAL-WRITE | BLOCKED, red |
| PRODUCTION-READY | LOCKED_FALSE, gray |
| EXECUTION-ENABLE | LOCKED_DISABLED, gray |
| STACKCHAN-PHYSICAL | HOLD, yellow |
| VOICE-CAMERA-MIC | HOLD, yellow |
| SPRITE-ASSET | FUTURE / Lv 4, purple |
| RUNTIME-VISUAL-RECHECK | NEEDS_HUMAN, green |
| Footer taglines | all 3 lines visible |

### 9. PageRightRail

- Visible at >= 900px window width
- Contains decision display and safety summary
- No action buttons

---

## Responsive Observation (optional)

If browser resize is tested:

| Width | Expected behavior |
|---|---|
| < 599px | reduced padding; sidebar hidden; grids wrap to 1 column |
| 600–899px | single column; grids wrap; no sidebar |
| >= 900px | 2-column grid (main + 260px sidebar); sidebar visible |

---

## Time Budget Estimate

| Section | Estimated observation time |
|---|---|
| ControlRoomLayout + HandoffLane | 3–5 min |
| SlotStatusBar + WorkerStatusPanel | 2–3 min |
| ResumeQueuePanel | 2 min |
| RunawayGuardPanel | 2 min |
| WorkerRoutingPanel | 3 min |
| GateDashboardPanel | 3–5 min |
| AT-13 polish check | 2 min |
| Safety invariant final check | 2 min |
| **Total estimate** | **~20 min** |

A 1-hour time_window is more than sufficient.
