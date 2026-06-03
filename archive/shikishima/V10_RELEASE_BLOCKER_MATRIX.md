# Shikishima v10 Release Blocker Matrix — v2.8.7

## Purpose

All release blockers that must be resolved before G-18 can be issued.

- documentVersion: v2.8.7 / productionReady: false

---

## Blocker Categories

### Category A: Stage Completion (all HOLD)

| Blocker | Stage | Current State |
|---|---|---|
| tests not committed | v3 | HOLD — G-01/G-02 |
| typecheck not run | v3–v4 | HOLD — G-03/G-04 |
| eslint not run | v4 | HOLD — G-05 |
| vitest not run | v4 | HOLD — G-06 |
| build not run | v4 | HOLD — G-07 |
| app not dev-run | v5 | HOLD — G-20 |
| Hermes not validated | v6 | HOLD — G-12 |
| StackChan not connected | v7 | HOLD — G-14 |
| Animation not validated | v8 | HOLD |
| Controlled pilot not run | v9 | HOLD — G-23 |

### Category B: Safety (requires action)

| Blocker | Status |
|---|---|
| Emergency stop not tested | HOLD |
| Rollback procedure not tested | HOLD |
| Raw value audit not complete | HOLD |
| Security review not complete | HOLD |
| Final safety audit not complete | HOLD |

### Category C: Approval (human only)

| Blocker | Status |
|---|---|
| G-18 not issued | HOLD — human only |
| G-19 not issued | HOLD — human only |

---

## Non-Blockers for v10

The following are NOT required before G-18:

| Item | Why Not a Blocker |
|---|---|
| Phase D src rename | Cosmetic; ichikishima names work |
| Phase E repo rename | External; GitHub action only |
| docs/ichikishima archive | Legacy; no functional impact |
| appId change | Optional separate decision |
| win.executableName change | Optional |

---

## Release Blocker Resolution Order

```
1. G-01 + G-02 (tests commit)
2. G-03–G-05 (typecheck/eslint)
3. Fix any blockers found
4. G-06 (vitest)
5. G-07 (build)
6. G-20 (dev run)
7. G-09–G-12 (WSL/Hermes)
8. G-14 (StackChan display)
9. G-23 (pilot run)
10. v10 final review
11. G-18 + G-19
```

この範囲では問題を検出していません。
