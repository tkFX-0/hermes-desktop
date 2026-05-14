# Control Center Japanese UI Surface Audit

## Document Status

```text
roadmapVersion: v3.13.0
status: audit_only — not implementation approval
date_created: 2026-05-14
```

## Important Notice

```text
This document is a docs-only audit.
It does not approve any source code changes.
It does not approve execution, Level 3, or productionReady.
Implementation requires a separate explicit GO.
```

## Audit Principle

```text
Good approach:
  - Keep internal enum / key / schema names unchanged
  - Change only the visible UI display string (i18n value)
  - If needed, show "Japanese label + internal key" side by side

Bad approach:
  - Replace internal keys (productionReady → 本番準備 in code)
  - Mass-rename enum values used in logic/tests/evidence
```

## Audit Table

| # | Current visible label | Proposed Japanese label | Internal key preserved | Risk | Safe to implement |
|---|---|---|---|---|---|
| 1 | Control Center | 管制センター | controlCenter (i18n ns) | low | yes |
| 2 | read-only | 読み取り専用 | display string only | low | yes |
| 3 | Snapshot source (read-only) | スナップショット情報（読み取り専用） | display string | low | yes |
| 4 | productionReady: false | 本番準備: false | productionReady key intact | low | yes |
| 5 | decision remains HOLD | 判定: HOLD（保留継続） | decision key intact | low | yes |
| 6 | execution remains disabled | 実行: disabled（無効） | execution key intact | low | yes |
| 7 | Raw values: hidden | raw値: 非表示 | display string | low | yes |
| 8 | Overview | 概要 | i18n value only | low | yes |
| 9 | blockers | ブロッカー | i18n value only | low | yes |
| 10 | warnings | 警告 | i18n value only | low | yes |
| 11 | Next recommended goal | 次の推奨ゴール | i18n value only | low | yes |
| 12 | Operational hints | 運用ヒント | i18n value only | low | yes |
| 13 | Rooms | ルーム一覧 | i18n value only | low | yes |
| 14 | Actions (all disabled) | 操作（すべて無効） | i18n value only | low | yes |
| 15 | Hermes Room | Hermesルーム | room key intact | low | yes |
| 16 | Ichikishima Room | しきしまルーム | room key intact | low | yes |
| 17 | Approval Room | 承認ルーム | room key intact | low | yes |
| 18 | Audit Room | 監査ルーム | room key intact | low | yes |
| 19 | Memory Room | メモリールーム | room key intact | low | yes |
| 20 | System Room | システムルーム | room key intact | low | yes |
| 21 | Agent Team (dry-run) | エージェントチーム（ドライラン） | display string | low | yes |
| 22 | Scheduler: disabled | スケジューラー: 無効 | scheduler key intact | low | yes |

## High-Risk Items (do not change without careful review)

| Label | Risk reason | Recommendation |
|---|---|---|
| HOLD | Used in evidence / safety docs / tests as literal string | Do not translate; keep as-is |
| disabled | Part of enum value checked in logic | Do not translate; show in UI as "disabled（無効）" |
| false | Boolean display | Do not translate; show as "false" |
| productionReady | Internal key used in code/tests | Do not rename; change only i18n display value |
| decision | Internal key | Do not rename; change only i18n display value |
| execution | Internal key | Do not rename; change only i18n display value |

## Implementation Scope (when approved separately)

```text
Allowed files:
  src/shared/i18n/locales/ja/controlCenter.ts  (create if not exists)
  src/shared/i18n/locales/en/controlCenter.ts  (update English labels if needed)
  src/shared/i18n/index.ts                     (add ja locale if not registered)

Not allowed:
  src/main/**  (no logic changes)
  src/**/*.test.*  (no test changes)
  package.json / package-lock.json
  Any enum / type definitions
  Any safety boundary values
```

## Recommended Implementation GO Conditions

```text
Before implementation GO:
  [ ] This audit accepted by human
  [ ] Targeted typecheck passes after change
  [ ] No test failures introduced
  [ ] Verification: Control Center i18n keys resolve correctly in new build
  [ ] B3 session re-observation confirms Japanese labels visible + HOLD/disabled/false still correct
```

## Safety Boundary

```text
decision         : HOLD (do not translate this value)
execution        : disabled (do not translate this value)
productionReady  : false (do not translate this value)
Level 3          : not approved
This document does not approve any code changes.
```

---

この範囲では問題を検出していません
