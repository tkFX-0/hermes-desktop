# Shikishima v4 Local Validation Preparation Package — v2.8.1

## Purpose

Complete preparation for v4 local test / static validation.
No command is executed in this document.

- documentVersion: v2.8.1 / decision: HOLD / execution: disabled / productionReady: false

---

## v4 Goal

Run typecheck/eslint/vitest/build locally; capture redacted results; fix blockers; confirm clean.

## Entry Conditions (from v3)

- [ ] tests/ichikishima committed (G-01)
- [ ] tests/hermes committed (G-02)
- [ ] typecheck:node result reviewed (G-03 + redacted output)
- [ ] typecheck:web result reviewed (G-04 + redacted output)
- [ ] V4 Validation Command Matrix reviewed
- [ ] Human GO for v4

## Validation Order

| # | Command | Gate | Dependency |
|---|---|---|---|
| 1 | typecheck:node | G-03 | None (or override) |
| 2 | typecheck:web | G-04 | None |
| 3 | eslint | G-05 | None |
| 4 | vitest run | G-06 | G-01+G-02+G-03+G-04 |
| 5 | build | G-07 | G-03+G-04 PASS |

## Remediation Priority

After validation results:

| Error Type | Priority | Action |
|---|---|---|
| typecheck blocker | High | Fix before v4 exit |
| eslint error | High | Fix before v4 exit |
| vitest failure | High (unless expected skip) | Fix or classify |
| build error | High | Fix before v4 exit |
| eslint warning | Low | Document; fix if easy |
| Expected skip | None | Verify CI guard correct |

## v4 Exit Conditions

- [ ] typecheck:node PASS (0 errors)
- [ ] typecheck:web PASS (0 errors)
- [ ] eslint: 0 blocking errors
- [ ] vitest: PASS (or failures classified/fixed)
- [ ] build: PASS
- [ ] V5 Readiness Package created
- [ ] Human GO for v5

この範囲では問題を検出していません。
