# Cursor Session Bootstrap — Shikishima Full Autonomy

Date: 2026-05-28

新規 Cursor セッション開始時、Composer は **この順で読む**。

```text
1. docs/shikishima/SHIKISHIMA_AUTONOMOUS_SELF_RUN_OPERATIONS.md
2. docs/shikishima/AUTONOMY_GOAL_LEDGER.md (Active Goal)
3. docs/shikishima/SHIKISHIMA_FULL_AUTONOMOUS_OPERATION_DESIGN.md (§1 現在地)
4. 実行中 macro の EVIDENCE / GO_DRAFT
```

## Quick invariants

```text
主語: しきしま（司令塔） / StackChan（身体）
目視必要 → HOLD or STOP（自動PASS禁止）
/goal まで全GO / push・device send は macro 明示時のみ
```

## Active baseline

```text
origin/main: b98d3e6 (+ local docs may be ahead)
Display-only: ACCEPTED @ fb86fee
```
