# productionReady true — GO Requirements

**date:** 2026-05-21
**status:** REQUIREMENTS ONLY — not approval
**productionReady:** false

---

## Critical Notice

productionReady: true は通常のタスクではありません。
これはアプリの運用姿勢を根本的にシフトする最終ゲートです。
一度 true になると、全てのユーザー対向コードが「本番状態」として扱われます。

**現在の状態: productionReady = false (TypeScript literal type — コード変更なしでは変更不可)**

---

## 前提条件チェックリスト

以下が全て PASS/完了でなければ productionReady_go は発行できません。

### Level 5 Gates

```text
□ XS-01 x_search read-only:         PASS (DONE)
□ OB-01 Obsidian local write:        ONE_SHOT_PASS (DONE)
□ DIS-01 Discord read-only:          ONE_SHOT_PASS (DONE)
□ DIS-03 Discord one-shot reply:     ONE_SHOT_PASS (DONE)
□ SC-FACE-05 StackChan display:      ONE_SHOT_PASS (DONE)
□ XS-AUTO-03 one-shot search:        HOLD — 要実施
□ CC-03 Command Chat one-shot:       HOLD — 要実施
□ HB-01 Hermes/WSL controlled:       HOLD — 要実施
□ XACC-01 decision:                  HOLD — GO or DEFER
```

### System Checks

```text
□ typecheck:node PASS (最新 commit で確認)
□ typecheck:web PASS (最新 commit で確認)
□ Runtime observation: AT-14/AT-15 PASS (DONE) + 最新確認
□ All safety literals unchanged (productionReady/execution/rawValues)
□ No active critical blockers
```

### Human Review

```text
□ BLOCKER-005 human review session completed
□ LMO (Limited Manual Operation) session completed
□ Incident response drill conducted
□ Rollback drill conducted
```

---

## GO Form Requirements

productionReady_go には以下の全フィールドが必要:

```text
productionReady_go:
  date:
  decision:                GO
  confirmed_by:            tk
  scope:                   [exact — "productionReady: true for Shikishima core v___"]
  prerequisites_verified:  (全前提条件のリスト)
  accepted_residual_risks: (残リスクの明示的受け入れ)
  rollback_plan:           (どうやって false に戻すか)
  incident_response:       (STOP時の対応手順参照)
  lmo_session_ref:         (LMO session 証跡)
  blocker_005_ref:         (BLOCKER-005 resolution 証跡)
  this_does_not_approve:   (execution enabled / external write auto / etc.)
  evidence_file:           docs/shikishima/PRODUCTION_READY_APPROVAL_YYYY-MM-DD.md
```

---

## What productionReady true does NOT approve

```text
- execution: enabled (別途 execution_enabled_go が必要)
- arbitrary external write
- Discord auto-reply without template whitelist
- X account write without separate GO
- StackChan physical motion
- voice / mic / camera
- removal of any safety literal
- automated Level 5 actions
```

---

## Implementation (ClaudeCode が実行)

productionReady_go 発行後:

```typescript
// src/renderer/src/components/SafetyStrip.tsx (or equivalent)
// productionReady: false → true (literal type change requires explicit code change)
```

```text
1. TypeScript literal を変更
2. typecheck PASS 確認
3. commit
4. push readiness review (Codex)
5. push GO
```
