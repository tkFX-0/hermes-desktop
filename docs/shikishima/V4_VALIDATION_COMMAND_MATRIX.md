# Shikishima v4 Validation Command Matrix — v2.8.1

## Purpose

Complete matrix of validation commands, GO conditions, STOP conditions, and output format.
No commands are executed here.

- documentVersion: v2.8.1 / decision: HOLD / execution: disabled / productionReady: false

---

## typecheck:node — G-03

| Field | Value |
|---|---|
| Script | `npm run typecheck:node` (likely: `tsc -p tsconfig.node.json --noEmit`) |
| Success exit | 0; no output |
| Failure exit | non-zero; error lines |
| GO condition | G-03 issued |
| STOP: absolute path in output | Redact; continue |
| STOP: > 50 errors | HOLD; triage first |
| STOP: hangs > 2min | Kill; report timeout |
| Report format | Use V3_REDACTED_RESULT_REVIEW_TEMPLATE.md typecheck template |

---

## typecheck:web — G-04

| Field | Value |
|---|---|
| Script | `npm run typecheck:web` (likely: `tsc -p tsconfig.web.json --noEmit`) |
| Success exit | 0 |
| GO condition | G-04 issued |
| STOP conditions | Same as typecheck:node |

---

## eslint — G-05

| Field | Value |
|---|---|
| Script | `npx eslint src/ --ext .ts,.tsx` |
| Success exit | 0 or 1 (warnings only) |
| Failure exit | 1+ (errors) |
| GO condition | G-05 issued |
| STOP: absolute paths | Redact before report |
| Expected output size | Can be large; classify by rule |

---

## vitest — G-06

| Field | Value |
|---|---|
| Script | `npx vitest run --reporter=verbose` |
| CI guard required | `CI=true` or `RUN_DUMMY_HERMES_LOCAL_PROCESS` not set |
| process-local test | Must show SKIPPED |
| GO condition | G-06; G-01+G-02 done; G-03+G-04 PASS |
| STOP: process-local not skipped | Kill immediately; P0 |
| STOP: external connection | Kill; P0 |
| Report format | Use vitest template in V3_REDACTED_RESULT_REVIEW_TEMPLATE.md |

---

## npm run check — (if available)

| Field | Value |
|---|---|
| Script | `npm run check` (if defined in package.json) |
| Purpose | Runs multiple checks in sequence |
| GO condition | Appropriate gate per sub-command |
| Note | Check package.json scripts before issuing GO |

---

## build — G-07

| Field | Value |
|---|---|
| Script | `npm run build` |
| GO condition | G-07; G-03+G-04 PASS |
| Expected issues | Code signing (dev machine; expected; not a blocker) |
| Output size | Large; check for errors only |

この範囲では問題を検出していません。
