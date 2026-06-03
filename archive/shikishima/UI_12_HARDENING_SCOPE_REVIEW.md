# UI-12 Hardening Scope Review

## Scope Decision

UI-12 hardening is scoped to **exactly one fix**:

```
Fix CAVEAT-01: Wire Command Center pages into Layout.tsx
```

No other changes are in scope.

---

## In Scope

```
Files allowed to change:
  1. src/renderer/src/screens/Layout/Layout.tsx (required)

Optional (only if needed for Step 1 to compile):
  2. src/renderer/src/screens/Layout/types.ts (if exists and needs View type)
  3. No other files

Purpose:
  - Add Command Center PageId-based view to the View type
  - Import and conditionally render PageShell wrapping active Command Center page
  - Add nav item pointing to Command Center
  - Wire minimal IPC data (use holdSummary / mock for initial wiring)
```

## Out of Scope

```
- New UI features
- productionReady change
- execution enablement
- external write
- StackChan physical
- voice/camera/mic
- package.json changes
- tsconfig changes
- New test files (typecheck/existing vitest sufficient)
- Modifying existing pages (Chat, Settings, Research, etc.)
- Modifying App.tsx (unless Layout.tsx alone is insufficient)
```

## Success Criteria

```
[ ] typecheck:node PASS
[ ] typecheck:web PASS
[ ] vitest: ≥806 PASS, 0 new failures
[ ] Command Center view accessible from Layout nav (visual check at next runtime)
[ ] SafetyStrip renders (visible in new view)
[ ] No regression in existing Hermes pages
```

---

_Created: 2026-05-18_
_productionReady: false_
_execution: disabled_
