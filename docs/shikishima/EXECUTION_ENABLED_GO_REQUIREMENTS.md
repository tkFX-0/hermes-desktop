# execution enabled — GO Requirements

**date:** 2026-05-21
**status:** REQUIREMENTS ONLY — not approval
**execution:** disabled

---

## Critical Notice

execution: enabled は productionReady: true の後にのみ検討できます。
現在の状態: execution = disabled / productionReady = false

これは最終の Critical ゲートです。
一度 enabled になると、Shikishima は外部サービスへの自律的な書き込みを実行できる状態になります。

---

## 前提条件

```text
必須 (全て PASS):
  □ productionReady: true (上記 GO 発行済み)
  □ execution enabled precheck PASS (EXE-00)
  □ Kill switch 実装・テスト済み (EXE-01)
  □ Execution scope whitelist 定義済み (EXE-02)
  □ Auto-close gates after run 実装済み (EXE-03)
  □ Per-run evidence requirement 確認済み (EXE-04)
  □ Process supervision 有効
  □ Monitoring / logging 有効
```

---

## GO Form Requirements

```text
execution_go:
  date:
  decision:                   GO
  confirmed_by:               tk
  scope:                      [exact — what actions are enabled, duration, limits]
  allowed_actions:            [explicit whitelist — no wildcards]
  forbidden_actions:          [explicit list]
  duration:                   [e.g. "this session only" / "until manual disable"]
  kill_switch_verified:       true
  kill_switch_method:         [how to stop all execution immediately]
  process_supervision:        [what monitors the process]
  evidence_required:          true (per action)
  prerequisites_verified:     (productionReady GO ref + list)
  this_does_not_approve:      (physical motion / voice / camera / arbitrary write / etc.)
  evidence_file:              docs/shikishima/EXECUTION_ENABLED_APPROVAL_YYYY-MM-DD.md
```

---

## What execution enabled does NOT approve

```text
- StackChan physical motion
- voice / mic / camera
- arbitrary file write outside allowed scope
- OAuth / token creation without separate GO
- external API write beyond explicit whitelist
- removal of safety invariants
- unmonitored background processes
```

---

## Implementation (ClaudeCode が実行)

execution_go 発行後:

```typescript
// execution: "disabled" → "enabled" (TypeScript literal change)
// Kill switch must be tested before this change
// scope must be strictly bounded
```

```text
1. Kill switch テスト完了確認
2. TypeScript literal を変更
3. typecheck PASS 確認
4. commit
5. push readiness review
6. push GO
```
