# Japanese UI Surface Roadmap

## Document Status

```text
roadmapVersion: v3.14.0
status: roadmap_only — not implementation approval
date_created: 2026-05-14
```

## Important Notice

```text
Japanese UI implementation is not approved by this document.
This document only prepares the roadmap and implementation plan.
Implementation requires a separate explicit GO.
```

## Goal

```text
Make the Shikishima app readable for Japanese daily operation
without breaking internal safety keys, tests, or evidence integrity.
```

---

## Core Principle

```text
Good approach:
  - Keep internal enum/key/schema names unchanged
  - Change only visible UI display strings (i18n values)
  - Use "Japanese label + internal key" side-by-side for safety-critical labels

Bad approach:
  - Mass-replace internal keys in source code
  - Rename enum values used in logic/tests/evidence
  - Translate HOLD / disabled / false as boolean/enum values
```

---

## Priority 1: Control Center Labels

High visibility, high daily-operation value.

| Current label | Proposed Japanese | Internal key | Notes |
|---|---|---|---|
| Control Center (read-only) | 管制センター（読み取り専用） | i18n value | safe to change |
| Snapshot source (read-only) | スナップショット情報（読み取り専用） | i18n value | safe |
| productionReady: false | 本番準備: false（productionReady） | productionReady key intact | show key |
| decision remains HOLD | 判定: HOLD（保留継続） | decision key intact | show key |
| execution remains disabled | 実行状態: disabled（無効） | execution key intact | show key |
| Raw values: hidden | raw値: 非表示 | i18n value | safe |
| Overview | 概要 | i18n value | safe |
| blockers | ブロッカー | i18n value | safe |
| warnings | 警告 | i18n value | safe |
| Next recommended goal | 次の推奨ゴール | i18n value | safe |
| Operational hints | 運用ヒント | i18n value | safe |
| Actions (all disabled) | 操作（すべて無効） | i18n value | safe |
| Scheduler: disabled | スケジューラー: 無効 | scheduler key intact | show key |

## Priority 2: Room Names

| Current label | Proposed Japanese | Notes |
|---|---|---|
| Rooms | ルーム一覧 | safe |
| Hermes Room | Hermesルーム | keep "Hermes" as identifier |
| Ichikishima Room | しきしまルーム | keep internal key |
| Approval Room | 承認ルーム | safe |
| Audit Room | 監査ルーム | safe |
| Memory Room | メモリールーム | safe |
| System Room | システムルーム | safe |
| Agent Team (dry-run) | エージェントチーム（ドライラン） | safe |

## Priority 3: Navigation

| Current label | Proposed Japanese | Notes |
|---|---|---|
| Chat | チャット | safe |
| Sessions | セッション | safe |
| Profiles | プロフィール | safe |
| Office | オフィス | safe |
| Models | モデル | safe |
| Skills | スキル | safe |
| Persona | ペルソナ | safe |
| Memory | メモリー | safe |
| Tools | ツール | safe |
| Schedules | スケジュール | safe |
| Gateway | ゲートウェイ | safe |
| Settings | 設定 | safe |
| Research | リサーチ | safe |

## Do-Not-Translate List

```text
HOLD          — used literally in evidence/tests/docs as string
disabled      — enum value; show as "disabled（無効）" not replace
false         — boolean display; keep as "false"
productionReady — internal key; only translate display label
decision      — internal key; only translate display label
execution     — internal key; only translate display label
CLEAN_B3_PASS — evidence classification string
STOP          — safety classification string
```

---

## Implementation Phases

### Phase 1: ja locale creation (lowest risk)
```text
Create: src/shared/i18n/locales/ja/controlCenter.ts
        src/shared/i18n/locales/ja/navigation.ts
        (and other namespaces as needed)
Register in: src/shared/i18n/index.ts
No enum changes. No logic changes. No test changes.
```

### Phase 2: Default locale switch (medium risk)
```text
Change app default locale from en to ja
Verify: all i18n keys resolve (no raw key strings visible)
Regression: B3 session to confirm labels correct
```

### Phase 3: Safety label side-by-side (optional)
```text
Show: "判定: HOLD（decision）" instead of just "decision: HOLD"
Only for labels used in daily human review
```

---

## Required GO Before Implementation

```text
[ ] This roadmap accepted by human
[ ] B3 5/5 clean PASS completed (recommended before UI change)
[ ] Implementation GO issued for Phase 1
[ ] typecheck passes after i18n changes
[ ] No test failures
[ ] Build completed: npm run build
[ ] Regression B3 session confirms Japanese labels + safety labels correct
```

---

## Recommended Timing

```text
After B3 5/5 clean PASS:
  → Japanese UI Phase 1 implementation GO
  → Build + typecheck
  → B3 regression session (confirms Japanese labels + HOLD/disabled/false correct)
  → Phase 2 if Phase 1 PASS
```

---

この範囲では問題を検出していません
