# Shikishima v3.x Static Validation Plan — v2.3.0

## Purpose

Documents exact commands, GO conditions, STOP conditions, and expected
redacted output format for each static validation step.
This document is planning-only. No command is executed here.

- documentVersion: v2.3.0
- documentDate: 2026-05-12
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

**All commands in this document are NOT YET EXECUTED.**
**Each command requires its own GO gate before running.**

---

## Command Inventory

| # | Command | npm script | Gate |
|---|---|---|---|
| 1 | TypeScript check (main) | `npm run typecheck:node` | G-03 |
| 2 | TypeScript check (renderer) | `npm run typecheck:web` | G-04 |
| 3 | ESLint | `npm run lint` or `npx eslint src/` | G-05 |
| 4 | Vitest (CI mode) | `npm run test` or `npx vitest run` | G-06 |
| 5 | Build | `npm run build` | G-07 |

---

## Command Details

### Command 1: typecheck:node (G-03)

**Purpose**: Type-check the main process (Electron main + preload).

**Likely script** (do not run until G-03):
```
tsc -p tsconfig.node.json --noEmit
```

**Environment**: Local dev only. No network access needed.

**Expected output on success**: No output, exit code 0.
**Expected output on failure**: Error lines in format `file.ts(line,col): error TS####: message`

**STOP conditions**:
- Exit code non-zero → classify errors before continuing
- Output contains absolute path like `C:\Users\...` → redact before reporting
- Process hangs for more than 120 seconds → terminate; report timeout

**GO condition**: G-03 issued; tests committed (G-01 + G-02 or override confirmed).

**Redacted output format**:
```
typecheck:node result
exit code: [0 or non-zero]
error count: [N]
errors:
  - [redacted-path]([line],[col]): TS[####]: [message without path]
  ...
```

---

### Command 2: typecheck:web (G-04)

**Purpose**: Type-check the renderer process (React + Electron renderer).

**Likely script** (do not run until G-04):
```
tsc -p tsconfig.web.json --noEmit
```

**Environment**: Local dev only.

**STOP conditions**: Same as Command 1.

**GO condition**: G-04 issued.

**Redacted output format**: Same structure as Command 1, labeled `typecheck:web`.

---

### Command 3: ESLint (G-05)

**Purpose**: Lint all source files for style/safety violations.

**Likely script** (do not run until G-05):
```
npx eslint src/ --ext .ts,.tsx
```

**Environment**: Local dev only.

**Expected output on success**: No output or `0 problems`, exit code 0.
**Expected output on failure**: Lines in format `path/to/file.ts  line:col  level  rule-id  message`

**STOP conditions**:
- Output contains `error` severity items → classify before continuing
- Output contains absolute paths → redact
- Unexpected plugin crash → report as P2 incident

**GO condition**: G-05 issued.

**Redacted output format**:
```
eslint result
exit code: [0 or non-zero]
error count: [N]
warning count: [N]
rules triggered (top):
  - [rule-id]: [N occurrences]
  ...
```

---

### Command 4: Vitest (G-06)

**Purpose**: Run all unit/integration tests.

**Likely script** (do not run until G-06):
```
npx vitest run --reporter=verbose
```

**Critical pre-check**:
- Confirm `CI=true` or `RUN_DUMMY_HERMES_LOCAL_PROCESS` is NOT set
- `dummy-hermes-stub-design.process-local.test.ts` must be skipped
- Do NOT run with `RUN_DUMMY_HERMES_LOCAL_PROCESS=1`

**Environment**: Local dev only; no external services running.

**STOP conditions**:
- process-local test does NOT skip → immediately terminate; do not continue
- Any test attempts external network connection → terminate
- Output contains raw file paths or secrets → redact before reporting
- More than 20% test failures → HOLD; do not continue to next command

**GO condition**: G-06 issued; G-03 + G-04 complete; local-only policy confirmed.

**Redacted output format**:
```
vitest result
exit code: [0 or non-zero]
total tests: [N]
passed: [N]
failed: [N]
skipped: [N]
process-local test: [skipped / ALERT: NOT skipped]
failures (if any):
  - [test name without path]: [failure category]
  ...
```

---

### Command 5: Build (G-07)

**Purpose**: Build Electron app distribution packages.

**Likely script** (do not run until G-07):
```
npm run build
```

**Environment**: Local dev only. Produces output in `dist/` or `out/` directory.

**STOP conditions**:
- Build error containing secrets or local paths → redact before reporting
- Build produces file larger than expected → investigate before continuing
- Code signing fails (expected on dev machine without cert) → classify as expected

**GO condition**: G-07 issued; G-03 + G-04 PASS.

**Redacted output format**:
```
build result
exit code: [0 or non-zero]
output directory: [redacted-path]
files produced: [N]
errors (if any):
  - [category]: [message without path]
```

---

## Pre-Execution Checklist (run before ANY command)

Before running any command after GO is issued:

- [ ] Confirm no external service is running (Hermes, WSL, RunPod)
- [ ] Confirm no StackChan connected
- [ ] Confirm no voice/camera/microphone active
- [ ] Confirm output capture is ready (log file or terminal)
- [ ] Confirm redaction policy is understood
- [ ] Note start time for elapsed tracking

---

## Post-Execution Redaction Procedure

After any command completes:

1. Review full output before reporting
2. Replace `C:\Users\[username]\...` with `[redacted-path]`
3. Replace `/home/[username]/...` with `[redacted-path]`
4. Replace `localhost:8765` with `[local-endpoint]`
5. Replace any token/key pattern with `[secret]`
6. Report only: exit code, error counts, error categories, rule names

---

## Error Classification Guide

| Error Type | Category | Next Action |
|---|---|---|
| TS2xxx type error | BLOCKER | Fix before v4 |
| TS1xxx syntax error | BLOCKER | Fix before v4 |
| eslint error | BLOCKER | Fix before v4 |
| eslint warning | WARNING | Review; fix if possible |
| Test failure | BLOCKER or WARNING | Classify per test |
| Build signing error | EXPECTED | Document; do not block |
| Build path error | BLOCKER | Fix before v4 |

この範囲では問題を検出していません。
