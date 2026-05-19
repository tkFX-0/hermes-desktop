# AT-12 Gate Dashboard / Future Gate Panel Evidence

## Purpose

AT-12 adds a display-only Gate Dashboard to Agent Theater. The panel makes
future and human-gated capabilities visible without enabling any of them.

## Worker Used

- worker: ClaudeCode-compatible implementation task executed by Codex in this thread
- review worker recommended next: Codex push readiness

## Changed Files

- `src/renderer/src/types/agent-theater-types.ts`
- `src/renderer/src/screens/AgentTheater/GateStatusBadge.tsx`
- `src/renderer/src/screens/AgentTheater/GateStatusCard.tsx`
- `src/renderer/src/screens/AgentTheater/GateDashboardPanel.tsx`
- `src/renderer/src/screens/AgentTheater/AgentTheaterPage.tsx`
- `docs/shikishima/AT_12_GATE_DASHBOARD_PANEL_EVIDENCE.md`
- `docs/shikishima/ROADMAP_CHANGELOG.md`
- `docs/shikishima/DEVELOPMENT_TEMPO_DASHBOARD.md`
- `docs/shikishima/README.md`

## Gate Dashboard Panel

Added `GateDashboardPanel.tsx`, a static display-only panel that shows:

- productionReady: false
- execution: disabled
- rawValuesReported: false
- runtime: HOLD
- external write: blocked
- Level 5: human GO

Required plain-language copy is included:

- Gateは見える化だけ。ONにする操作はここではしない。
- AIは作るところまで。
- 鍵と発射ボタンは人間。

## Gate Items Displayed

| Gate | Status | Boundary |
|---|---|---|
| PUSH-GO | NEEDS_HUMAN | git push は人間GO |
| RUNTIME-GO | NEEDS_HUMAN | runtime起動はtime_window付きGO |
| OAUTH-GO | HOLD | provider/scope/token policy付きGO |
| XS-READ | FUTURE | read-only GO |
| OBS-LOCAL | FUTURE | local GO |
| EXTERNAL-WRITE | BLOCKED | explicit GOなし禁止 |
| PRODUCTION-READY | LOCKED_FALSE | productionReady=false 維持 |
| EXECUTION-ENABLE | LOCKED_DISABLED | execution=disabled 維持 |
| STACKCHAN-PHYSICAL | HOLD | 物理動作は別Gate |
| VOICE-CAMERA-MIC | HOLD | voice/camera/micは別Gate |
| SPRITE-ASSET | FUTURE | AT-05後 |
| RUNTIME-VISUAL-RECHECK | NEEDS_HUMAN | time_window GO |

## Type Model

Added display-only types:

- `GateStatus`
- `GateDashboardCategory`
- `GateDashboardItem`

The model is static display data only:

- no persistence
- no IPC
- no API
- no runtime state source

## Safety Confirmation

```text
source_changed: true
docs_changed: true
package_changed: false
dependency_changed: false
runtime_started: false
npm_run_dev: false
oauth_started: false
x_search_executed: false
obsidian_written: false
external_api_write: false
productionReady: false
execution: disabled
rawValuesReported: false
git_push_performed: false
```

## Forbidden UI Confirmation

No controls were added for:

- enable gate
- approve
- push
- runtime start
- OAuth login
- x_search run
- Obsidian write
- external API
- execute
- productionReady toggle
- execution toggle
- send/post/purchase/reservation

## Human Visual Recheck

Runtime visual recheck remains HOLD. A separate human GO with date, time
window, command, observation scope, stop conditions, and shutdown method is
still required before running `npm run dev`.

