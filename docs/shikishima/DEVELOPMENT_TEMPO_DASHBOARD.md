# Development Tempo Dashboard

## Purpose

The Development Tempo dashboard summarizes documentation progress without
creating productivity pressure or autonomous acceleration.

## Tempo Fields

| Field | Meaning |
|---|---|
| roadmapVersion | current roadmap version |
| latestUpdate | latest documentation update |
| docsCreated | count or summary of docs added |
| reviewsCompleted | completed human reviews |
| commitsCreated | local docs-only commits |
| currentHoldReason | why HOLD remains |
| nextAction | next human action |
| cadence | daily or weekly summary label |

## Current Static Values

- roadmapVersion: v4.11.0
- latestUpdate: 2026-05-19 - Agent Theater UI series complete; Ctrl+wheel zoom added; nav reorder done
- canonical naming: Hermes Core / しきしま / いちきしま / しずめ / しるべ / むすび / つむぐ (confirmed)
- legacy deprecated: つむぎ→つむぐ / はじめ→むすび
- current HEAD: origin/main=574131b
- validation road: Gate 001-007 ✓; AT-07〜AT-14 PASS; AT-15 UI scale PASS; zoom PASS; nav PASS
- current next human action: define next feature scope
- HOLD reason: productionReady false; execution disabled; Level 5 actions require explicit human GO

## Agent Theater — 完了済み

| Task | 内容 | 状態 |
|---|---|---|
| AT-07 | Control Room Layout + HandoffLane | DONE |
| AT-08 | Worker Status Panel + Slot Status Bar | DONE |
| AT-09 | Resume Queue / Cooldown Panel | DONE |
| AT-10 | Runaway Guard / Human-Gated Action Panel | DONE |
| AT-11 | Worker Routing / Handoff Prompt Panel | DONE |
| AT-12 | Gate Dashboard / Future Gate Panel | DONE |
| AT-13 | Final Visual Polish / Responsive Pass | DONE |
| AT-14 | Runtime Visual Recheck Package + 目視確認 PASS | DONE |
| AT-15 | UI Scale-Up (font ×1.3、padding、grid) | DONE |

## その他完了済み

| 作業 | 内容 | commit |
|---|---|---|
| Ctrl+wheel zoom | 全ページ zoom 0.5x〜2.5x、localStorage 永続 | a1defa1 |
| Nav reorder | Control Center / Mobile Console を先頭に | 574131b |

## 残TASK候補

| ID | 内容 | 優先度 | Gate |
|---|---|---|---|
| AT-05 | Sprite / 画像アセット計画 | 低 (optional) | AT-05 asset gate |
| CC-01 | Control Center live data 接続 (snapshot → 実データ) | 中 | Level 4 |
| CC-02 | PageShell IPC 接続 (hermes snapshot 購読) | 中 | Level 4 |
| CC-03 | Command Chat 実送信 (現在display-only) | 高 | Level 5 (human GO) |
| UI-01 | ウィンドウサイズ記憶 / zoom 初期値設定 | 低 | Level 4 |
| UI-02 | ダークモード / ライトモード切り替え完全対応 | 低 | Level 4 |
| HB-01 | Hermes Bridge 接続 (WSL2 → desktop) | 高 | Level 5 |
| XS-01 | x_search read-only Gate (XS-READ) 実装 | 低 | XS-READ GO |

## 次アクション

- 残TASK から優先順位を決めて着手
- Level 4 以下は ClaudeCode で実装可能
- Level 5 / Gate 付きは人間 GO が必要

## SLOT-09 Worker Autonomy Update

- SLOT_WORKER_STATUS: READY / BUSY / COOLDOWN / DEGRADED / BLOCKED / FAILED / NEEDS_HUMAN
- autonomy target: Level 4 max for AI worker flow
- Level 5: git push / runtime / OAuth / x_search / external connection / productionReady / execution enabled require human GO
- OAuth: not permanently forbidden; OAUTH-GO required
- x_search/social reading: future XS-READ read-only GO required
- Obsidian local note write: future OBS-LOCAL GO required
- runaway prevention: RUNAWAY-GUARD recorded

## Boundaries

## Phase 45 to 60 Update

- latestUpdate: 2026-05-17 - Phase 45 to 60 Approval Queue UI foundation COMPLETE_PASS candidate
- current HEAD baseline: origin/main=a0ffa2a before local Phase 45 to 60 commits
- validation road: Level 1+2 PASS; Phase 2C same-LAN PASS; B3 5/5 ACCEPTED; Phase 30 to 45 COMPLETE_PASS; overall approximately 45%
- current next human action: review Phase 45 to 60 Approval Queue UI evidence and decide push GO
- Approval Queue status: display-only, no execution, no push, no runtime start
- HOLD reason: productionReady false; execution disabled; Level 3-B/C/D/E not approved; device and external actions HOLD

## Phase 60 to 75 Update

- latestUpdate: 2026-05-17 - StackChan / Face Terminal display preparation COMPLETE_PASS candidate
- current HEAD baseline: origin/main=305e8db before local Phase 60 to 75 commits
- StackChan arrival status: not_arrived
- physical test status: deferred
- Display Terminal Preview: display-only model + iPhone UI + desktop Face tab
- current next human action: review Phase 60 to 75 evidence and decide push GO
- HOLD reason: StackChan physical operation false; connection not attempted; voice/camera/mic disabled

## Phase 75 to 90 Update

- latestUpdate: 2026-05-17 - Draft Outbox / External Action Safety Layer COMPLETE_PASS candidate
- current HEAD baseline: origin/main=85d183c before local Phase 75 to 90 commits
- Draft Outbox: display-only, no send, no remote creation, no payment/reservation
- external action status: all writes HOLD
- current next human action: review Phase 75 to 90 evidence and decide push GO
- HOLD reason: productionReady false; execution disabled; external actions require separate future approval

- No autonomous acceleration.
- No reward or earning mechanics.
- No external API.
- No execution scheduling.

この範囲では問題を検出していません。
