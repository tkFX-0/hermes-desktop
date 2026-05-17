# UI-12 Test Plan

## Required Tests

```
1. npm run typecheck:node
   expected: PASS (exit 0, no errors)

2. npm run typecheck:web
   expected: PASS (exit 0, no errors)

3. npm test
   expected: ≥806 passed, 0 new failures, 1 skipped (unchanged)
```

## Failure Handling

```
typecheck:node fails:
  - Fix type errors in Layout.tsx only
  - Do not modify type definition files

typecheck:web fails:
  - Fix import paths or missing types in Layout.tsx
  - Do not modify tsconfig

vitest fails:
  - Investigate: is any existing test broken by the Layout change?
  - Layout.tsx likely has no unit tests — existing tests should not be affected
  - If affected: fix must stay within Layout.tsx scope
  - If new test needed: flag for human decision before adding
```

## Not Required in UI-12

```
- New unit tests for Layout.tsx (existing vitest suite is sufficient)
- E2E tests (visual verification is done in runtime observation)
- Manual browser testing (deferred to next runtime observation GO)
```

---

_Created: 2026-05-18_
_productionReady: false_
_execution: disabled_
