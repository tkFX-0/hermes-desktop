# Japanese UI Minimal Implementation GO Draft

## Document Status

```text
roadmapVersion: v3.14.0
date_created: 2026-05-15
status: go_draft_only — not approved
```

## Important Notice

```text
This document is a GO draft only.
Source code must NOT be changed until a human issues the actual GO.
This draft does not approve any implementation.
```

## Minimal Source Scope

```text
Allowed files (candidate):
  src/shared/i18n/locales/ja/controlCenter.ts  (create new)
  src/shared/i18n/locales/ja/navigation.ts     (create new)
  src/shared/i18n/locales/ja/setup.ts          (create new)
  src/shared/i18n/locales/ja/common.ts         (create new)
  src/shared/i18n/index.ts                     (add ja locale registration)
```

## Forbidden Files

```text
src/main/**                    — no logic changes
src/renderer/src/screens/**   — no component changes
src/**/*.test.*               — no test changes
package.json                  — no dependency changes
package-lock.json             — no lockfile changes
Any enum / type definitions   — no type changes
Any safety boundary values    — no safety changes
```

## Implementation Rules

```text
1. Create ja/ locale files with Japanese display strings
2. Register ja locale in index.ts
3. Do NOT change any key names
4. Do NOT change any enum values
5. Do NOT change any logic or component files
6. HOLD / disabled / false must remain as-is in value display
7. Safety-critical labels: use Japanese + internal key side-by-side
   Example: "判定: HOLD（decision）" not just "判定: HOLD"
```

## Test Expectations

```text
- typecheck: 0 errors
- lint: 0 errors
- existing tests: all PASS (no test changes made)
- new tests: not required (display strings only)
```

## Build Expectations

```text
- npm run build: complete without errors
- new build entry: out/renderer/assets/index-*.js
- verification: grep new index-*.js for Japanese strings
- verification: grep confirms HOLD/disabled/false not replaced in internal logic
```

## Rollback Plan

```text
If regression detected in B3 session after implementation:
  1. revert ja locale files (git revert or manual delete)
  2. revert index.ts registration
  3. re-run npm run build
  4. re-run B3 regression session
  5. diagnose which label caused regression
```

## Post-Implementation Regression Session

```text
After implementation + build:
  Run a B3 session to confirm:
    - Japanese labels visible in Control Center
    - HOLD / disabled / false still correct in safety labels
    - no raw values exposed
    - actions still disabled
  If PASS: accept as Japanese UI regression PASS
  If STOP: classify cause, rollback if needed
```

## Human GO Template (when ready)

```text
I explicitly approve this one Japanese UI minimal implementation task only.

Approved scope:
  - create src/shared/i18n/locales/ja/*.ts (new files only)
  - update src/shared/i18n/index.ts (register ja locale)
  - run npm run typecheck (read-only verification)
  - run npm run build (compile only)
  - create one local commit: fix: add japanese locale for control center ui
  - do not push without separate push GO

Forbidden:
  - change src/main/**
  - change any component files
  - change any test files
  - change package.json / package-lock.json
  - change any enum / type definitions
  - translate HOLD / disabled / false as boolean/enum values
  - git push
  - Level 3 approval
  - productionReady true
  - execution enabled
```

---

この範囲では問題を検出していません
