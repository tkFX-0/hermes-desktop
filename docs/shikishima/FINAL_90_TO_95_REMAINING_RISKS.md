# Final 90→95 Remaining Risks

## Purpose

Documents known risks and unknowns that remain between current state
(UI-10 complete, runtime not yet observed) and 90→95 readiness.

---

## Risk Register

### RISK-01: Runtime Observation Not Completed

```
risk:       Runtime has not been observed with actual IPC data
severity:   HIGH (blocking)
likelihood: certain (observation pending)
impact:     Unknown rendering behavior with live data
mitigation: Execute UI-11 controlled runtime observation
status:     OPEN
```

### RISK-02: IPC Snapshot Not Tested Live

```
risk:       ui-snapshot-helpers.ts and snapshot-to-page.ts have 45 unit tests
            but live IPC flow (main → preload → renderer) not verified
severity:   MEDIUM
likelihood: possible
impact:     HOLD fallback may not trigger correctly; pages may show stale data
            without expected STALE badge
mitigation: Runtime observation checklist includes STALE badge verification
status:     OPEN — pending runtime observation
```

### RISK-03: CSS Variables Not Applied in Actual Electron Build

```
risk:       command-center-tokens.css was added but not verified in Electron build
severity:   LOW
likelihood: low (fallback values exist in all components)
impact:     Visual inconsistency; colors may fall back to inline defaults
mitigation: Runtime observation includes visual inspection of all pages
status:     OPEN — pending runtime observation
```

### RISK-04: Gate 005 Blockers

```
risk:       Gate 005 (productionReady precondition) has active blockers
severity:   HIGH (for productionReady path only)
likelihood: certain (documented)
impact:     productionReady true cannot be approved until resolved
mitigation: 90→95 does not require Gate 005 resolution
            Gate 005 is a separate path blocker for productionReady
status:     HOLD — does not block 90→95
```

### RISK-05: Post-Runtime Hardening Scope Unknown

```
risk:       Runtime observation may reveal UI issues not visible in unit tests
severity:   MEDIUM
likelihood: possible
impact:     UI-12 hardening may be needed before 95 candidate
mitigation: POST_RUNTIME_UI_HARDENING_REVIEW.md will be created after observation
status:     OPEN — depends on runtime observation result
```

### RISK-06: Mobile Layout Not Live-Tested

```
risk:       StackChanMobilePage and mobile Console screens not tested at 393px in Electron
severity:   LOW
likelihood: low (component designed for 393px)
impact:     Layout may overflow or clip on narrow viewport
mitigation: Runtime observation should include iPhone viewport check if GO approved
status:     OPEN
```

### RISK-07: CommandPalette Ctrl+K Not Verified

```
risk:       CommandPalette keyboard shortcut not tested in Electron environment
severity:   LOW
likelihood: medium (Electron may intercept Ctrl+K)
impact:     Command palette may not open; workaround: direct tab navigation
mitigation: Runtime observation includes keyboard navigation check
status:     OPEN
```

---

## Non-Risks (explicitly NOT risks)

```
- productionReady: false — this is correct and expected
- execution: disabled — this is correct and expected
- external write false — this is correct and expected
- Gate 005 HOLD — acceptable for 90→95
- No live StackChan connection — acceptable for 90→95
```

---

_Created: 2026-05-17_
_productionReady: false_
_execution: disabled_
