# Shikishima v3 to v10 Debug Flow — v2.8.0

## Purpose

Defines the debug/investigation flow for each stage when something is blocked or unclear.

- documentVersion: v2.8.0
- documentDate: 2026-05-12
- decision: HOLD / execution: disabled / productionReady: false

---

## v3 Debug Flow

**If tests/ichikishima fails CI guard check**:
```
Find file: tests/ichikishima/sandbox/dummy-hermes-stub-design.process-local.test.ts
Check for: describe.skipIf(!allowDummyProcessEnv)
Not found? → Fix guard before G-01 → re-review → issue G-01
```

**If typecheck fails after G-03**:
```
Capture redacted output → classify errors
Type error in IPC schema? → Review src/preload/ + src/shared/ichikishima/
Import path error? → May be from Phase D rename plan → fix import
Missing @types? → Document; add to remediation list
> 20 errors? → HOLD; triage first
```

**If eslint fails after G-05**:
```
Capture redacted output → classify rules
Blocking rule? → Fix; re-run (new G-05 not required for re-run after GO)
Warning only? → Document; continue
Expected false positive? → Add to expected list
```

---

## v4 Debug Flow

**If vitest fails after G-06**:
```
Capture redacted pass/fail counts
process-local test NOT skipped? → P0: terminate; fix guard; re-review
Failing test name? → Classify: unit failure / integration / fixture issue
> 20% failures? → HOLD; review before continuing
Fix → commit fix → re-run vitest
```

**If build fails after G-07**:
```
Capture redacted build output
Code signing error? → Expected on dev; document; not a blocker
Path error? → Fix import; re-build
Electron-builder config error? → Review electron-builder.yml
```

---

## v5 Debug Flow

**If app crashes on startup**:
```
Terminal output (redacted) → identify crash source
main process error? → Check src/main/index.ts
renderer error? → Check src/renderer/src/
IPC not registered? → Check ichikishimaControlCenter handler in index.ts
Fix → restart dev (G-20 covers session; re-run same GO)
```

**If Research screen iframe blank**:
```
localhost:8765 not running → expected; alive check shows false → display "service unavailable"
Not expected? → Check Research.tsx alive check logic
```

---

## v6 Debug Flow

**If dummy process hangs**:
```
Kill after 30s → report timeout P1
Check: dummy binary path correct?
Check: no external network call?
Fix plan → new G-09 for next attempt
```

**If Hermes not found in WSL**:
```
Report: "Hermes not installed" → HOLD G-12
Hermes install requires separate review → create install plan doc
Do NOT install without GO
```

**If WSL command outputs unexpected data**:
```
Redact output immediately
Does output contain home path? → Replace with [wsl-path]
Does output contain API key? → P0: stop; report
Normal redacted output? → Continue
```

---

## v7 Debug Flow

**If StackChan display shows unexpected content**:
```
Confirm: expression API only (not motion API)
Unexpected motion? → P0: disconnect; report
Unexpected audio? → P0: check speaker; report
```

**If face terminal UI crashes**:
```
No IPC involved? → Fix React component
IPC call added accidentally? → Remove immediately; review change
```

---

## v8 Debug Flow

**If mouth animation timing is off**:
```
Adjust MOUTH_DURATIONS in animation spec
No audio = pure timer; adjust interval
Re-display; confirm no audio device accessed
```

**If eye gaze looks wrong**:
```
Adjust gaze offset values in spec
Confirm: no camera feed accessed
Pure CSS/SVG offset = safe to adjust
```

---

## v9 Debug Flow

**If pilot run hits stop condition**:
```
Terminate all processes immediately
Redact any captured output
Report: "Pilot stopped. [Category]. Waiting for instruction."
Do NOT restart without new G-23
Return to Level 7 or lower as appropriate
```

---

## v10 Debug Flow

**If safety audit finds blocker**:
```
Document blocker (redacted)
Return to appropriate earlier stage
Fix blocker → re-audit
Do NOT issue G-18 with open blockers
```

**If G-18/G-19 issuance is delayed**:
```
Wait for human
No agent action needed
productionReady remains false
```

---

## Universal Debug Rules

1. Any anomaly → STOP first; investigate after
2. Any raw value in output → redact before reporting
3. Any external connection → P0; disconnect; report
4. Any device unexpected behavior → P0; safe state; report
5. Any "should I proceed?" doubt → HOLD; ask human

この範囲では問題を検出していません。
