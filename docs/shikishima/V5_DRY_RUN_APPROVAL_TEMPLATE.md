# Shikishima v5 Dry-Run Approval Template — v2.8.2

## Purpose

Template for issuing G-20 (local dev run). Human only.

- documentVersion: v2.8.2 / decision: HOLD / execution: disabled / productionReady: false

---

## G-20 Approval Template

```
=== G-20: LOCAL DEV RUN APPROVAL ===
Date: [YYYY-MM-DD]
Issued by: [human name — cannot be agent]

Pre-conditions confirmed:
  ✓ v4 all validation PASS (typecheck/eslint/vitest/build)
  ✓ Local-only value boundary checklist reviewed
  ✓ No external network active
  ✓ StackChan NOT connected
  ✓ No WSL running
  ✓ Human monitor: [name] present

Scope:
  Run: npm run dev (or electron-forge start)
  Duration: [N minutes]
  Stop conditions: crash / external network / raw value in UI

GO statement:
  "GO G-20: Approve local dev run. [date]. Monitor: [name]."
```

---

## After G-20 Run

- [ ] App terminated cleanly
- [ ] No external connections observed
- [ ] No raw values in UI
- [ ] Result recorded (redacted)
- [ ] Next action: v5 exit conditions → issue v6 GO

この範囲では問題を検出していません。
