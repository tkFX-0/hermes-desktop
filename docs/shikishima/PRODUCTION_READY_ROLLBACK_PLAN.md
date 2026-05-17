# productionReady Rollback Plan

## Purpose

Defines how to roll back if productionReady is changed to true and
a problem is discovered.

This plan is speculative — productionReady has not been changed.
This plan is recorded in advance for readiness.

---

## Rollback Trigger Conditions

Roll back productionReady to false if:

```
- Any STOP event occurs after productionReady is set to true
- Raw value exposure occurs
- Unexpected external write occurs
- Unexpected execution occurs
- Any safety invariant violation is detected
- Any security audit fails post-change
- Human requests rollback for any reason
```

---

## Rollback Procedure

```
1. Human issues: "I approve rolling back productionReady to false"
2. Create a new commit reverting the productionReady type change
3. Run: typecheck:node + typecheck:web + vitest
4. All tests must pass before push
5. Push only after human GO with rollback scope
6. Notify all relevant parties of rollback
```

---

## Rollback Does NOT Require

```
- Reverting UI implementation (UI-03–UI-10 remain valid)
- Reverting safety infrastructure (helpers, tests remain)
- Reverting Limited Manual Operation rules
```

---

## Post-Rollback Actions

```
[ ] Identify what went wrong
[ ] Update PRODUCTION_READY_RISK_REGISTER.md
[ ] Update PRODUCTION_READY_PRECONDITION_AUDIT.md with new blocker
[ ] Determine if new Gate is needed
[ ] Await human decision on next steps
```

---

_Created: 2026-05-17_
_productionReady: false_
_execution: disabled_
