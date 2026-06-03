# UI-02 Implementation Scope Review

## Document Status

```text
roadmapVersion: v3.69.0
date: 2026-05-17
task: UI-02 scope review (Task 03)
status: SCOPE_DEFINED — awaiting human GO for source implementation
```

---

## Purpose

UI-02 は Final Command Center Design の型定義・インターフェース契約のみを実装する。
React コンポーネントは作成しない。ランタイム動作は変更しない。

---

## Exact Implementation Objective

```text
Add TypeScript type definitions and interface contracts for:
  1. Page ID union and page-level contracts (12 pages)
  2. Lamp/state type unions (14 canonical states)
  3. Button policy type guards (copy-only / locked / forbidden)
  4. CSS variable key types and theme types
  5. Per-page service data shape types

These types will serve as the shared source of truth for UI-03 and beyond.
They are import-only; they do not add runtime behavior.
```

---

## Files to Create (new files only)

```text
src/shared/ichikishima/ui-page-types.ts
  — PageId union (12 pages)
  — PageContract interface
  — LampState type union (all canonical states)
  — ButtonPolicy type
  — FallbackBehavior type

src/shared/ichikishima/ui-safety-types.ts
  — ButtonCategory discriminated union (copy-only / navigate / refresh / local-chat-send / locked / forbidden)
  — LockedSetting union (productionReady | execution | externalWrite | stackChanPhysical | voiceCameraMic)
  — SafetyFallback type (stale / unknown / error all map to HOLD)

src/renderer/src/types/design-tokens.ts  [new directory + file]
  — CSSVar type (union of all --* variable names from index.html)
  — ThemeMode type ('light' | 'dark' | 'auto')
  — FontFamily type ('jp' | 'sans' | 'mono')
  — BreakpointKey type ('mobile' | 'tablet' | 'desktop' | 'wide')

src/renderer/src/types/service-contracts.ts  [new directory + file]
  — SafeSnapshotData interface (decision: LampState, productionReady: false, ...)
  — LocalChatMessage interface
  — DraftOutboxItem interface (externalWrite: false, sent: false, ...)
  — ApprovalQueueItem interface
  — EvidenceRecord interface
  — PushReadinessData interface
  — StackChanStatusData interface
  — LocalSettingsData interface
```

---

## Files NOT to Touch

```text
src/renderer/src/App.tsx                   — do not modify
src/renderer/src/screens/**               — no new components
src/main/**                               — main process untouched
src/preload/**                            — IPC surface untouched; no new channels
src/shared/ichikishima/control-center-readonly-ipc-channel.ts  — do not touch
src/shared/ichikishima/control-center-shell-ui-contract.ts     — do not touch
package.json / package-lock.json          — no dependency changes
```

---

## Type Design Constraints

```text
Aligned with existing patterns in src/shared/ichikishima/:
  — use readonly properties throughout
  — use literal types for safety invariants (false, "disabled", "copy-only")
  — no class definitions
  — no runtime imports (types only; no React, no Electron)
  — no default exports (named exports only)
  — no any[] or unknown without comment

Aligned with Gate 007 wording policies:
  — LampState must include all 14 canonical states
  — ButtonCategory must express copy-only as the safe default
  — LockedSetting must cover all 5 locked capability types
  — SafetyFallback must express HOLD as the universal fallback
  — SafeSnapshotData.productionReady must be typed as: false (literal)
  — SafeSnapshotData.execution must be typed as: 'disabled' (literal)
```

---

## Expected User-Visible Result

```text
After UI-02:
  — TypeScript compiler has shared vocabulary for all 12 pages
  — All future component files import from these 4 type files
  — No runtime behavior changes
  — No visual changes to the running app
  — typecheck:node + typecheck:web pass with new types
  — vitest run passes (existing tests unaffected)
```

---

## Non-Scope

```text
React components:             NOT in UI-02
PageShell / PageTabs:         NOT in UI-02 (UI-03)
Service implementations:      NOT in UI-02
IPC channel changes:          NOT in UI-02
CSS / token files:            NOT in UI-02 (types reference tokens; no CSS files)
New npm packages:             NOT in UI-02
Runtime-connected logic:      NOT in UI-02
```

---

## Safety Boundary

```text
productionReady: false (unchanged)
execution: disabled (unchanged)
rawValuesReported: false (unchanged)
runtime_started: false (type files have no runtime effect)
port_3030_closed: true (unchanged)
No external writes, no package changes, no push (separate GO required)
```

---

この範囲では問題を検出していません。
