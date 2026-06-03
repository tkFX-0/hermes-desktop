# Shikishima v10 Pre-Production Audit Template — v2.8.7

## Purpose

Template for the final pre-production audit before G-18.
Fill each section. All must show PASS before G-18.

- documentVersion: v2.8.7 / productionReady: false

---

## Audit Header

```
Audit date: [YYYY-MM-DD]
Auditor: [name — human; cannot be agent]
Audit type: Pre-production (v10)
productionReady at start: false
G-18 at start: not issued
```

---

## Section 1: Code Audit

| Item | Result | Notes |
|---|---|---|
| No absolute paths in src/ | [ ] PASS / [ ] FAIL | |
| No secrets in src/ | [ ] PASS / [ ] FAIL | |
| No API keys in src/ | [ ] PASS / [ ] FAIL | |
| IPC bridge read-only confirmed | [ ] PASS / [ ] FAIL | |
| productionReady false guard in code | [ ] PASS / [ ] FAIL | |
| No execution affordance in UI | [ ] PASS / [ ] FAIL | |

---

## Section 2: Test Audit

| Item | Result | Notes |
|---|---|---|
| tests/ichikishima committed | [ ] PASS / [ ] FAIL | |
| tests/hermes committed | [ ] PASS / [ ] FAIL | |
| process-local test CI guard verified | [ ] PASS / [ ] FAIL | |
| No raw paths in test fixtures | [ ] PASS / [ ] FAIL | |
| vitest all PASS | [ ] PASS / [ ] FAIL | |

---

## Section 3: Validation Audit

| Item | Result | Notes |
|---|---|---|
| typecheck:node PASS | [ ] PASS / [ ] FAIL | |
| typecheck:web PASS | [ ] PASS / [ ] FAIL | |
| eslint 0 errors | [ ] PASS / [ ] FAIL | |
| build PASS | [ ] PASS / [ ] FAIL | |

---

## Section 4: Runtime Audit

| Item | Result | Notes |
|---|---|---|
| App starts without crash | [ ] PASS / [ ] FAIL | |
| ControlCenter IPC read-only | [ ] PASS / [ ] FAIL | |
| No external connections observed | [ ] PASS / [ ] FAIL | |
| Hermes responds locally | [ ] PASS / [ ] FAIL | |

---

## Section 5: Device Audit

| Item | Result | Notes |
|---|---|---|
| Face terminal displays correctly | [ ] PASS / [ ] FAIL | |
| StackChan display confirmed safe | [ ] PASS / [ ] FAIL | |
| No unexpected servo motion | [ ] PASS / [ ] FAIL | |
| Audio I/O scope confirmed | [ ] PASS / [ ] FAIL | |

---

## Section 6: Safety Audit

| Item | Result | Notes |
|---|---|---|
| Emergency stop tested | [ ] PASS / [ ] FAIL | |
| Rollback tested | [ ] PASS / [ ] FAIL | |
| Human-in-loop confirmed | [ ] PASS / [ ] FAIL | |
| Raw value audit complete | [ ] PASS / [ ] FAIL | |

---

## Audit Conclusion

```
All sections PASS: [ ] YES / [ ] NO
Blockers remaining: [N]
Blocker details: [list or none]

Auditor confirmation:
  "All sections reviewed. [N] blockers remain. 
   Ready for G-18: [YES / NO — NO if any FAIL]"

Signed: [auditor name]
Date: [YYYY-MM-DD]
```

**G-18 may only be issued after all sections show PASS.**

この範囲では問題を検出していません。
