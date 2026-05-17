# UI-12 Design Alignment Scope Draft

## Purpose

Defines which design gap items to include in the UI-12 implementation GO.

UI-12 has two parts:
- Part A (completed): Layout.tsx wiring (commit 5160608)
- Part B (this document): design alignment fixes

---

## Recommended UI-12 Part B Scope

### Must-include (P1 — safety visibility)

```
P1-001: SafetyStrip — add external_write, rawValues, runtime,
        stackchan_connection chips + "安全境界 · 常時表示" text
        file: src/renderer/src/components/Shell/SafetyStrip.tsx

P1-003: SafetyStrip — add REJECT / UNKNOWN / STALE / ERROR states
        file: src/renderer/src/components/Shell/SafetyStrip.tsx

P1-002: PageShell — add footer bar with canonical disclaimer
        "このUIから外部実行は発生しません"
        file: src/renderer/src/components/Shell/PageShell.tsx
```

### Should-include (P2 — core layout)

```
P2-003: PageShell — add Topbar (mode: OPERATOR / INSPECTOR)
        file: src/renderer/src/components/Shell/PageShell.tsx
        possibly: src/renderer/src/components/Shell/Topbar.tsx (new)
```

### Defer to Phase B (larger scope, own GO)

```
P2-001: OperatorPage 3-column layout (major restructure)
P2-002: CommandChatPage 3-column layout
P2-004: NextActionCard (new component)
P2-005: PageRightRail (new component)
P2-006: InactiveStamp (new component)
P2-007: safe-area padding
```

---

## Allowed Files for UI-12 Part B

```
REQUIRED:
  src/renderer/src/components/Shell/SafetyStrip.tsx
  src/renderer/src/components/Shell/PageShell.tsx

OPTIONAL (only if needed for Topbar):
  src/renderer/src/components/Shell/Topbar.tsx (new file)
```

## Forbidden

```
- src/renderer/src/screens/Layout/Layout.tsx (already done in Part A)
- Any page component (OperatorPage, CommandChatPage, etc.)
- package.json / tsconfig / test files
- External API calls / device connections
```

## Tests Required

```
- npm run typecheck:node
- npm run typecheck:web
- npm test (≥806 PASS)
```

## Expected Commit

```
git commit -m "fix: design-align safetystrip and pageshell (UI-12 part B)"
```

---

## GO Template

```
I approve UI-12 Part B design alignment implementation.
Date:         YYYY-MM-DD
time_window:  HH:MM-HH:MM JST
allowed files:
  - src/renderer/src/components/Shell/SafetyStrip.tsx
  - src/renderer/src/components/Shell/PageShell.tsx
  - src/renderer/src/components/Shell/Topbar.tsx (new, optional)
approved fixes:
  - P1-001: SafetyStrip chips (5 missing chips + wording)
  - P1-003: SafetyStrip states (REJECT/UNKNOWN/STALE/ERROR)
  - P1-002: PageShell footer disclaimer
  - P2-003: PageShell Topbar (optional)
approved commands:
  - npm run typecheck:node / typecheck:web / npm test
push: NOT approved in this GO
runtime: NOT approved in this GO
```

---

_Created: 2026-05-18_
_productionReady: false_
_execution: disabled_
