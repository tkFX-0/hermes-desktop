# UI-03 — Implementation GO Draft

## Document Status

```text
roadmapVersion: v3.71.0
date: 2026-05-17
task: UI-03
name: Implementation GO Draft
status: DRAFT — NOT an approval. Reading this file is NOT GO.
```

---

## CRITICAL: This Is Not Approval

```text
Reading this file is NOT GO.
Creating this file is NOT GO.
UI-03 design completion is NOT implementation approval.

UI-03 implementation requires a SEPARATE, EXPLICIT human GO
with concrete scope, date, and time_window.

Git push requires a SEPARATE, EXPLICIT human GO.
Runtime requires a SEPARATE, EXPLICIT human GO.
```

---

## UI-03 Implementation Objective

```text
Implement safe/redacted snapshot helpers and per-page data alignment utilities.

Specifically:
  - HOLD fallback helper (returns HOLD for stale/missing/error/unknown)
  - SafeSnapshotData builder (maps existing getAppSnapshot() to SafeSnapshotData)
  - Freshness detector (compares generatedAtUnixMs to stale threshold)
  - Stale badge helper (returns "STALE" when threshold exceeded)
  - Redaction checker (detects forbidden raw value patterns in summary strings)
  - Per-page summary builders (maps snapshot fields to per-page display data)
  - Tests for: raw value prevention / stale fallback / HOLD fallback
```

---

## GO Template (FILL IN PLACEHOLDERS BEFORE SENDING)

```text
I approve UI-03 backend snapshot / data contract alignment implementation.
date: [YYYY-MM-DD]
time_window: [YYYY-MM-DD HH:MM-HH:MM JST]

Approved scope:
  helper utilities only
  no rendered React components
  no IPC channel changes (read-only helpers only)
  no runtime start
  no external write
  no productionReady change
  no execution enablement
  no push (separate GO required)

Allowed new files:
  src/shared/ichikishima/ui-snapshot-helpers.ts
  src/shared/ichikishima/ui-freshness-helpers.ts
  src/renderer/src/utils/snapshot-to-page.ts
  tests/ui-snapshot-helpers.test.ts

Allowed commands:
  npm run typecheck:node
  npm run typecheck:web
  npm test -- ui-snapshot-helpers
  npm test -- mobile-console

Forbidden:
  npm install / npx / npm run dev / Electron runtime
  port 3030 / external write / push
  React components / IPC changes

STOP conditions:
  - raw value appears in any helper output
  - HOLD fallback not triggered for stale/missing/error/unknown input
  - tests fail
  - source outside allowed scope modified
  - package.json modified
  - runtime started
```

---

## Expected Implementation Files

### `src/shared/ichikishima/ui-snapshot-helpers.ts`

```text
Purpose:
  Convert existing ControlCenterShellSnapshot to SafeSnapshotData.
  Apply redaction check to summary strings.
  Enforce productionReady: false and rawValuesReported: false invariants.

Key functions:
  snapshotToSafeData(snapshot: ControlCenterShellSnapshot): SafeSnapshotData
  checkRedaction(lines: readonly string[]): "clean" | "redacted" | "omit"
  isSnapshotFresh(generatedAtUnixMs: number, thresholdSec: number): boolean

Safety:
  Must never return a SafeSnapshotData with raw value in any field.
  Uses summaryLineLooksLikeLeakedAbsolutePath() pattern.
  Returns HOLD decision if productionReady is not false.
```

### `src/shared/ichikishima/ui-freshness-helpers.ts`

```text
Purpose:
  Stale detection and HOLD fallback logic.

Key functions:
  isStale(generatedAtUnixMs: number | undefined, thresholdSec: number): boolean
  getHoldFallback(reason: DataUnavailableReason): "HOLD"
  getStaleBadge(): "STALE"

Safety:
  Returns "HOLD" for all unavailable/unknown/error inputs.
  Never returns GO_READY or PASS for stale data.
```

### `src/renderer/src/utils/snapshot-to-page.ts`

```text
Purpose:
  Map SafeSnapshotData to per-page display fields.
  Apply page-specific fallbacks per UI_03_PAGE_DATA_REQUIREMENTS.md.

Key functions:
  toOperatorPageData(snap: SafeSnapshotData | null): OperatorPageDisplayData
  toChatPageData(snap: SafeSnapshotData | null): ChatPageDisplayData
  toStackChanPageData(status: StackChanStatusData | null): StackChanDisplayData
  ... (one per page)

Safety:
  All functions return HOLD fallback when input is null/stale/error.
  No function returns raw values.
```

### `tests/ui-snapshot-helpers.test.ts`

```text
Required tests:
  - snapshotToSafeData: raw value in summary → REDACTED
  - snapshotToSafeData: productionReady true input → throw or return HOLD
  - isSnapshotFresh: timestamp 61s ago → isStale: true
  - isSnapshotFresh: timestamp 29s ago → isStale: false
  - isSnapshotFresh: missing timestamp → isStale: true
  - getHoldFallback: all DataUnavailableReason values → "HOLD"
  - toOperatorPageData: null input → HOLD decision
  - toOperatorPageData: stale input → HOLD decision + STALE badge
```

---

## Human Instructions Before Sending GO

```text
1. Read this draft.
2. Verify UI-03 design commit is pushed to origin/main.
3. Fill in [YYYY-MM-DD] and [time_window].
4. Review the allowed files list — add/remove if needed.
5. Send the GO explicitly.

Do not send GO if:
  UI-03 design commit is not pushed
  Any design doc is incomplete or unreviewed
  You are uncertain about the scope
```

---

## Sequence After UI-03 Implementation

```text
UI-03 implementation → tests pass → commit
→ push GO → UI-03 pushed
→ UI-04 GO → Operator page shell / LampGrid
→ UI-05 GO → Chat page
→ ... (per UI_IMPLEMENTATION_PHASE_PLAN.md)
```

---

この範囲では問題を検出していません。
