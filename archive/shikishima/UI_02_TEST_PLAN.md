# UI-02 Test Plan

## Document Status

```text
roadmapVersion: v3.69.0
date: 2026-05-17
task: UI-02
status: DEFINED
```

---

## Test Objective

UI-02 adds type-only files. Tests verify:
1. TypeScript compilation succeeds with new types
2. Existing tests are unaffected
3. No runtime behavior was introduced

---

## Required Tests (run in this order)

### Step 1: Pre-implementation baseline

```text
Command: npm run typecheck:node
Expected: 0 errors (baseline — run before any file changes)

Command: npm run typecheck:web
Expected: 0 errors (baseline)

Command: npm test
Expected: all pass (baseline)
```

### Step 2: After creating type files

```text
Command: npm run typecheck:node
Expected:
  0 errors
  new files src/shared/ichikishima/ui-page-types.ts and ui-safety-types.ts
  are type-checked without errors

Command: npm run typecheck:web
Expected:
  0 errors
  new files src/renderer/src/types/design-tokens.ts and service-contracts.ts
  are type-checked without errors
  Note: if src/renderer/src/types/ is not in tsconfig scope, report — do not silently fix

Command: npm test
Expected:
  all existing tests pass
  no test regressions from type-only additions
  (UI-02 adds no logic; existing tests should be unaffected)
```

---

## Explicit Non-Tests

```text
Do NOT run:
  npm run dev            — no runtime
  npm run build          — not needed for type-only
  electron *             — no Electron launch
  port 3030 tests        — no port involvement
  iPhone integration     — no runtime observation
  external API tests     — no external calls
  StackChan tests        — no device involvement
```

---

## Failure Handling

```text
typecheck:node fails:
  → report exact error(s) and affected file(s)
  → do NOT push failing types
  → do NOT suppress with @ts-ignore without comment

typecheck:web fails due to tsconfig scope:
  → report the exact error
  → STOP — do not modify tsconfig without explicit GO
  → wait for human decision on tsconfig change

typecheck:web fails due to type error in new file:
  → fix the type error in the new file
  → re-run typecheck:web
  → report resolution

vitest fails:
  → report which test failed and why
  → if test file is unrelated to type additions, note it as pre-existing issue
  → do NOT proceed to commit if any test fails
```

---

## Expected Typecheck Output (success)

```text
typecheck:node:
  tsc --noEmit -p tsconfig.node.json --composite false
  → exit 0, no output

typecheck:web:
  tsc --noEmit -p tsconfig.web.json --composite false
  → exit 0, no output

npm test (vitest run):
  → all existing tests pass
  → 0 new failures
```

---

この範囲では問題を検出していません。
