# UI-03 — Backend Snapshot / Data Contract Alignment Design Review

## Document Status

```text
roadmapVersion: v3.71.0
date: 2026-05-17
task: UI-03 backend snapshot contract review
status: design_ready — not implementation approval
```

---

## CRITICAL: This Is Not Approval

```text
This document is not implementation approval.
This document is not runtime approval.
This document is not UI rendering approval.
This document is not productionReady approval.
This document is not execution approval.

UI-03 implementation requires a SEPARATE, EXPLICIT human GO.
```

---

## Purpose

UI-02 で型契約（4 ファイル）を定義した。
UI-03 では、これらの型を実際のバックエンドスナップショットに接続するための
データ契約と安全ポリシーを設計する。

Goal: レンダリング前に「何のデータを、どう安全に見せるか」を固定する。

---

## Scope

```text
ALLOWED:
  design: per-page data requirements
  design: safe/redacted snapshot contract alignment
  design: stale/freshness policy
  design: HOLD fallback helpers
  design: redaction status helpers
  docs: 4 design docs under docs/shikishima/
  docs: ROADMAP_CHANGELOG + DEVELOPMENT_TEMPO_DASHBOARD update
  commit: docs-only

NOT ALLOWED (separate GO required):
  source implementation
  new React components
  IPC channel changes
  runtime start
  push
  productionReady change
  execution enablement
  external writes
```

---

## Relationship to UI-02

```text
UI-02 defined:
  type contracts (what shape data takes in the renderer)
  safety invariant types (productionReady:false, execution:"disabled", etc.)
  service contract interfaces (SafeSnapshotData, UIDraftOutboxItem, etc.)

UI-03 defines:
  per-page data requirements (which fields each page needs)
  redaction policy (what cannot appear in the renderer)
  freshness policy (when data is considered stale / HOLD)
  HOLD fallback helpers (how components respond to missing/stale/error data)

UI-03 is the bridge between type contracts and rendered components.
Without UI-03, rendered components may expose raw values or fail to HOLD.
```

---

## Why UI-03 Must Happen Before Rendered UI

```text
1. Raw value leakage risk:
   Without a redaction policy, a rendered component may accidentally display
   a pairing token, LAN IP, or local path from the snapshot.

2. Missing fallback risk:
   Without a HOLD fallback contract, a stale or unavailable snapshot
   would cause components to show blank, "unknown", or potentially
   GO_READY/PASS when the data source is actually down.

3. Freshness risk:
   Without a stale threshold policy, the UI may show cached data as
   current, hiding the true state from the operator.

4. Data shape mismatch:
   UI-02 types define shapes but not where data comes from.
   UI-03 maps shapes to actual IPC sources, confirming alignment.
```

---

## Current Baseline

```text
UI-02 types pushed: beba654 ✓
Rendered UI: not implemented ✓
IPC channels: unchanged (reads from existing getAppSnapshot) ✓
Runtime: not started ✓
productionReady: false ✓
execution: disabled ✓
```

---

## Expected Backend Snapshot Role

```text
The existing backend (src/main/ichikishima/) provides:
  getAppSnapshot() → ControlCenterShellSnapshot (safety-validated)
  Mobile Console snapshot → MobileConsoleSnapshot (redacted)

UI-03 aligns these with the new UI-02 service contracts:
  ControlCenterShellSnapshot fields → SafeSnapshotData fields
  MobileConsoleSnapshot fields → per-page display fields
  DraftOutboxItem → UIDraftOutboxItem (redaction applied before renderer)
  ApprovalQueueItem → UIApprovalQueueItem (display-only flag asserted)
```

---

## Safe/Redacted Snapshot Principle

```text
Rule 1: The renderer NEVER receives raw values.
  Raw tokens, LAN IPs, local paths, credentials → always redacted before IPC.

Rule 2: Redaction happens in main or preload, not in the renderer.
  The renderer trusts that values it receives are safe.
  The renderer MUST NOT perform its own redaction by hiding values —
  values must be redacted before the IPC boundary.

Rule 3: If a field cannot be safely redacted, it must be omitted.
  An omitted field triggers the missing-data HOLD fallback.
  Never substitute a raw value with a partial value.

Rule 4: rawValuesReported: false must be provably true.
  Any IPC message that could expose a raw value fails validation.
```

---

## Fallback Principle

```text
HOLD is the universal fallback.
No page may show GO_READY or PASS without confirmed, fresh, redacted data.

Missing snapshot:          → HOLD lamp + "データ取得中" / "Loading"
Stale snapshot:            → HOLD lamp + STALE badge + last-known values
Error from IPC:            → HOLD lamp + error badge
Redaction uncertainty:     → HOLD lamp + REDACTED placeholder
Device connection unknown: → HOLD lamp + DISPLAY_ONLY
External write uncertain:  → HOLD lamp + HOLD explanation
```

---

## Implementation Risks

```text
Risk 1: Type mismatch between existing snapshot and UI-02 types.
  Mitigation: UI-03 alignment map identifies mismatches before implementation.

Risk 2: Missing fields in existing snapshot for some UI-03 pages.
  Mitigation: UI-03 page data requirements doc lists missing fields.
  Resolution: either add safe field to snapshot or use HOLD/REDACTED fallback.

Risk 3: Stale threshold too aggressive or too lenient.
  Mitigation: UI-03 defines placeholder values to be confirmed by human at GO time.

Risk 4: IPC handler not yet mapped to new service contracts.
  Mitigation: UI-03 design doc specifies required IPC alignment changes.
  These changes require separate source GO.
```

---

## STOP Conditions

```text
STOP during UI-03 design if:
  source files must be modified to answer a design question
    → document the question; do not modify source
  raw values are needed in the docs for examples
    → use placeholder examples only; do not include real raw values
  a page's required fields conflict with safety policy
    → document the conflict; do not resolve by weakening policy
```

---

## Next Task After UI-03 Design

```text
1. Push UI-03 design commit (separate push GO)
2. Review UI_03_IMPLEMENTATION_GO_DRAFT.md
3. Issue UI-03 implementation GO (separate explicit GO)
4. Implement:
   - safe/redacted snapshot helpers
   - per-page summary builders
   - freshness/stale detection
   - HOLD fallback utilities
5. Run tests
6. Record UI-03 implementation evidence
7. Push UI-03 implementation
```

---

この範囲では問題を検出していません。
