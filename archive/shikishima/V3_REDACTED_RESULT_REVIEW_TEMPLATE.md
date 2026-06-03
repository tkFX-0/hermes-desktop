# Shikishima v3.x Redacted Result Review Template — v2.3.0

## Purpose

Provides templates for reporting validation results in redacted form.
Use this template when reporting any command output after GO is issued.
Raw values MUST be replaced before any report is written.

- documentVersion: v2.3.0
- documentDate: 2026-05-12
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

---

## Redaction Rules (always apply before reporting)

| Raw Pattern | Replace With |
|---|---|
| `C:\Users\[name]\...` | `[redacted-path]` |
| `/home/[name]/...` | `[redacted-path]` |
| `~/.hermes/...` | `[hermes-home]` |
| WSL distribution name | `[wsl-distro]` |
| `localhost:8765` | `[local-endpoint]` |
| Any port number that may be sensitive | `[local-port]` |
| API key / token / secret pattern | `[secret]` |
| RunPod endpoint URL | `[runpod-endpoint]` |
| Username in any path | `[redacted-user]` |

---

## Template: typecheck result

```
=== VALIDATION RESULT: typecheck ===
Date: [YYYY-MM-DD]
Gate: G-03 (typecheck:node) / G-04 (typecheck:web)
Command: npm run typecheck:[scope]
Exit code: [0 / non-zero]

--- Summary ---
Total errors: [N]
Total warnings: [N]

--- Error Categories ---
[error category]: [count]
[error category]: [count]

--- Sample Errors (redacted) ---
[redacted-path]([line],[col]): TS[####]: [error message — paths removed]

--- Classification ---
Blockers: [N] — must fix before v4
Warnings: [N] — review; fix if possible
Expected: [N] — known false positives (describe)

--- Next Action ---
[ ] Fix blockers
[ ] Review warnings
[ ] Confirm expected items documented

--- GO/HOLD ---
Result: [PASS / HOLD]
Reason (if HOLD): [brief description]

rawValuesReported: false
```

---

## Template: eslint result

```
=== VALIDATION RESULT: eslint ===
Date: [YYYY-MM-DD]
Gate: G-05
Command: npx eslint src/ --ext .ts,.tsx
Exit code: [0 / non-zero]

--- Summary ---
Total errors: [N]
Total warnings: [N]
Files checked: [N]

--- Rules Triggered ---
[rule-id]: [count] [error/warning]
[rule-id]: [count] [error/warning]

--- Classification ---
Blockers (errors): [N]
Warnings: [N]
Expected / allowed: [N]

--- Next Action ---
[ ] Fix blocker rules
[ ] Review warning rules

--- GO/HOLD ---
Result: [PASS / HOLD]
Reason (if HOLD): [brief description]

rawValuesReported: false
```

---

## Template: vitest result

```
=== VALIDATION RESULT: vitest ===
Date: [YYYY-MM-DD]
Gate: G-06
Command: npx vitest run [flags]
Exit code: [0 / non-zero]

--- Summary ---
Total tests: [N]
Passed: [N]
Failed: [N]
Skipped: [N]

--- process-local test status ---
dummy-hermes-stub-design.process-local.test.ts: [SKIPPED (expected) / ALERT: NOT SKIPPED]

--- Failed Tests ---
[test suite name (no path)]: [failure reason category]

--- Classification ---
Blockers: [N] — must fix before v4
Expected failures: [N]
Skipped (expected): [N]

--- GO/HOLD ---
Result: [PASS / HOLD]
Reason (if HOLD): [brief description]

rawValuesReported: false
```

---

## Template: build result

```
=== VALIDATION RESULT: build ===
Date: [YYYY-MM-DD]
Gate: G-07
Command: npm run build
Exit code: [0 / non-zero]

--- Summary ---
Build duration: [N seconds]
Output files: [N]
Errors: [N]
Warnings: [N]

--- Error Categories ---
[error category]: [message without path]

--- Expected Issues ---
Code signing: [N/A on dev / skipped / signed] (expected on dev machine)

--- GO/HOLD ---
Result: [PASS / HOLD]
Reason (if HOLD): [brief description]

rawValuesReported: false
```

---

## Template: WSL/Hermes result

```
=== VALIDATION RESULT: WSL/Hermes ===
Date: [YYYY-MM-DD]
Gate: G-11 (WSL) / G-12 (Hermes)
Command: [command category — no raw command shown]
Exit code: [0 / non-zero]
Duration: [N seconds]

--- Summary ---
WSL status: [available / not available]
Hermes status: [available / not available]
External connections: [none / ALERT: detected]

--- Response Schema ---
Valid: [yes / no]
Expected fields: [list field names only — no values]

--- Raw Value Check ---
Paths in output: [none / ALERT: redacted]
Secrets in output: [none / ALERT: redacted]

--- GO/HOLD ---
Result: [PASS / HOLD]
Reason (if HOLD): [brief description]

rawValuesReported: false
```

---

## Incident Report Template

If a P0/P1 incident occurs during validation:

```
=== INCIDENT REPORT ===
Date: [YYYY-MM-DD HH:MM]
Severity: P[0/1/2/3]
Category: [raw-value / external-network / device-command / unexpected-output]

--- What happened ---
[Brief description — no raw values]

--- Immediate action taken ---
[Process killed / Disconnected / Stopped]

--- Output status ---
Raw values: [none observed / detected and redacted before this report]

--- Rollback state ---
Returned to: Level [N] — HOLD

--- Next action ---
Awaiting human instruction.

rawValuesReported: false
```

この範囲では問題を検出していません。
