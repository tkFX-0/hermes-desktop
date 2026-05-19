# AT-14 Runtime Visual Recheck Package

**Baseline commit:** a8ef150
**Prepared:** 2026-05-19
**Worker:** ClaudeCode
**Runtime status:** HOLD — requires explicit human time_window GO

---

## Purpose

AT-14 is the combined human visual recheck for Agent Theater AT-07 through AT-13.

This document does not start runtime.
This document is not runtime approval.
This document is not productionReady approval.
This document is not execution approval.

Runtime remains HOLD until a human explicitly fills in the GO template and says GO.

---

## Package Index

| File | Role |
|---|---|
| `AT_14_RUNTIME_VISUAL_RECHECK_SCOPE.md` | What to check per AT item |
| `AT_14_RUNTIME_VISUAL_RECHECK_GO_TEMPLATE.md` | Human fills this to approve one runtime session |
| `AT_14_RUNTIME_VISUAL_RECHECK_EVIDENCE_TEMPLATE.md` | Human fills this after the session |
| `AT_14_RUNTIME_VISUAL_RECHECK_SELF_AUDIT.md` | ClaudeCode self-audit (docs-only diff check) |

---

## Visual Recheck Scope — AT-07 through AT-13

### AT-07 Control Room Layout

- Five agent zone cards visible (しきしま / しずめ / はじめ / つむぎ / しるべ)
- Zone labels, agent names, pose badges visible per decision state
- Night window panel, dot-grid accent strips visible
- Safety badge strip visible: execution: disabled / productionReady: false / rawValues: hidden / ext.write: false / runtime: human GO / push: human GO
- Handoff lane 6-step flow visible and reflects decision
- HandoffCard floating above active step visible (or position documented if off-screen)
- Reduced-motion: if @media (prefers-reduced-motion) was not tested, record as caveat

### AT-07 Handoff Motion

- At-pulse-glow animation on active step (if reduced-motion not applied)
- at-card-enter / at-card-float animation on HandoffCard (if reduced-motion not applied)
- On prefers-reduced-motion: animations should be disabled (CSS handles this)
- Animation does not trigger any action

### AT-08 Worker Status Panel

- 5 worker cards visible: GPT / ClaudeCode / Codex / Cursor / Human Gate
- Worker statuses match expected display values (READY / BLOCKED / NEEDS_HUMAN)
- Autonomy Level Legend (Lv 1–5) visible
- Level 4 "AI作業OK" badge and Level 5 "人間GO必須" badge visible
- Tagline: "AIは作るところまで。鍵と発射ボタンは人間。" visible

### AT-09 Resume Queue / Cooldown Panel

- 4 sample task cards visible: AT-09 (ACTIVE) / AT-07-RECHECK (NEEDS_HUMAN) / XS-READ-GATE (NEEDS_HUMAN) / CURSOR-WORKER (PAUSED)
- CooldownBadge per card visible
- Level 5 / 人間GO必須 badge on NEEDS_HUMAN cards visible
- Safety badge strip: API auto-use: disabled / runtime: human GO / push: human GO / OAuth: human GO / x_search: read-only GO / Obsidian: local GO / ext. write: blocked
- Taglines visible

### AT-10 Runaway Guard Panel

- Panel header with "RUNAWAY GUARD · 監視境界" label and "AI自動実行禁止" red badge visible
- 9 guarded action cards visible:
  - git push (HUMAN_GO_REQUIRED)
  - runtime 起動 (HUMAN_GO_REQUIRED)
  - OAuth ログイン (HUMAN_GO_REQUIRED)
  - x_search / SNS読み取り (READ_ONLY_GO)
  - Obsidian ローカル記録 (LOCAL_GO_REQUIRED)
  - 外部書き込み (BLOCKED)
  - productionReady (LOCKED_FALSE)
  - execution enabled (LOCKED_DISABLED)
  - API 自動利用 (DISABLED)
- Level 4まで: AI作業候補 / Level 5: 人間GO必須 boundary badges visible
- Taglines: "AIは作るところまで。鍵と発射ボタンは人間。" visible

### AT-11 Worker Routing / Handoff Prompt Panel

- 5 worker route cards visible: GPT / ClaudeCode / Codex / Cursor / Human Gate
- Each card shows autonomy level label, allowed and forbidden badges
- Human Gate card shows "人間GO必須" badge
- 3 handoff prompt preview blocks visible (ClaudeCode / Codex / Human GO)
- Safety badge strip: auto-dispatch: disabled / API auto-use: disabled / push: human GO / runtime: time_window GO / OAuth: human GO / x_search: read-only GO / Obsidian: local GO / 外部write: blocked
- Level 4 / Level 5 boundary row visible
- Taglines visible

### AT-12 Gate Dashboard / Future Gate Panel

- Panel header "GATE DASHBOARD · 未来ゲート" visible
- Summary badge row: productionReady: false / execution: disabled / rawValuesReported: false / runtime: HOLD / external write: blocked / Level 5: human GO
- 12 gate cards visible:
  - PUSH-GO (NEEDS_HUMAN)
  - RUNTIME-GO (NEEDS_HUMAN)
  - OAUTH-GO (HOLD)
  - XS-READ (FUTURE)
  - OBS-LOCAL (FUTURE)
  - EXTERNAL-WRITE (BLOCKED)
  - PRODUCTION-READY (LOCKED_FALSE)
  - EXECUTION-ENABLE (LOCKED_DISABLED)
  - STACKCHAN-PHYSICAL (HOLD)
  - VOICE-CAMERA-MIC (HOLD)
  - SPRITE-ASSET (FUTURE / Lv 4)
  - RUNTIME-VISUAL-RECHECK (NEEDS_HUMAN)
- Each card shows: state / human / evidence fields + ok/no badges + Lv badge
- Footer taglines: "Gateは見える化だけ。ONにする操作はここではしない。" etc.

### AT-13 Final Visual Polish

- Spacing between sections is readable (gap 18px in main column)
- No obvious horizontal overflow at tested width
- All section headings (SLOTS / WORKERS / RESUME QUEUE / RUNAWAY GUARD / ROUTING / GATES) visible
- Long Japanese labels readable (section headings, card labels, taglines)
- Safety badges not hidden by overflow on tested window size
- Card borders and border-left accent stripes visible
- At narrow width (if browser resize tested): record whether content wraps or truncates gracefully

---

## STOP Conditions

Stop the runtime session immediately if:

- App starts unexpected external network connection
- OAuth flow triggers or login prompt appears
- x_search executes (any SNS fetch)
- Obsidian write occurs
- External API write occurs
- `productionReady` appears as `true` in any panel
- `execution` appears as `enabled` in any panel
- Push / deploy / send / post button appears and is functional
- Raw token / secret / API key / local path appears in any panel
- `rawValuesReported` appears as `true`
- Runtime does not stop within 30 seconds of Ctrl+C
- Git status shows unexpected tracked changes after Ctrl+C
- Unexpected write to any file is detected

---

## Shutdown Method

```
1. Press Ctrl+C in the terminal running npm run dev
2. Confirm the process exits (terminal prompt returns)
3. Run: git status --short
4. Confirm: tracked_dirty = 0
5. Optional: check if port 5173 (or Vite default) is released
```

---

## Safety Boundary

- This package does not start runtime
- This package does not approve productionReady
- This package does not approve execution
- This package does not approve OAuth
- This package does not approve x_search
- This package does not approve Obsidian write
- This package does not approve external API write
- This package does not approve git push
- rawValuesReported must remain false throughout

Plain-language rule:

AIは作るところまで。
鍵と発射ボタンは人間。
