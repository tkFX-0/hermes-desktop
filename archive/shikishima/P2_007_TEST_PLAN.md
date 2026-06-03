# P3-003 Test Plan

## Task

P3-003 StackChan face expression glyphs (in P2-007 workday slot)

---

## Expected Tests

### 1. typecheck:node

```
npm run typecheck:node
```

Expected: clean exit (no errors)

### 2. typecheck:web

```
npm run typecheck:web
```

Expected: clean exit (no errors)

### 3. Full vitest suite

```
npx vitest run --reporter=verbose
```

Expected: 806+ passed, 0 failures

---

## Success Criteria

- typecheck:node: PASS
- typecheck:web: PASS
- vitest: all previously-passing tests still pass

---

## No Runtime Claim

This test plan does NOT include runtime visual verification.
Visual confirmation of glyph rendering requires human review after user returns.

---

## No Visual PASS Claim

Implementation PASS is defined as: typecheck clean + vitest green.
Visual PASS requires separate human observation session.

---

_Created: 2026-05-18_
_productionReady: false_
_execution: disabled_
