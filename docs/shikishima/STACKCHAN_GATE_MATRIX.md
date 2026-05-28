# StackChan Gate Matrix

Date: 2026-05-28
Applies after Rally 11 Safety Readiness

---

| Gate | Status | Requires Human GO | Notes |
|------|--------|------------------:|-------|
| Baseline observation | PASS | done | read-only human observation (retry) |
| Safety readiness | PREPARED | yes | Rally 11 — this package |
| Display-only preview | PREPARED | yes | Rally complete; pilot still HOLD |
| Display pilot | HOLD | yes | separate GO after preview PASS |
| Face/state mapping | HOLD | yes | display only |
| Motion command | HOLD | yes | separate active-control GO |
| Dance command | HOLD | yes | separate active-control GO |
| Touch behavior modification | HOLD | yes | separate behavior GO |
| Firmware write | HOLD | yes | separate firmware GO |
| Firmware erase | HOLD | yes | separate firmware recovery GO |
| Serial flash | HOLD | yes | separate recovery GO |
| Voice output | HOLD | yes | separate voice GO |
| Mic input | HOLD | yes | separate mic GO |
| Camera input | HOLD | yes | separate camera GO |
| Autonomous Shikishima control | HOLD | yes | separate autonomy GO |
| productionReady true | HOLD | yes | not part of StackChan baseline |
| execution enabled | HOLD | yes | not approved |

---

## Legend

```text
PASS      — completed with evidence
PREPARED  — docs/readiness only; not execution approval
HOLD      — blocked until explicit Human GO
```

---

## Baseline Context (redacted)

```text
custom_firmware: confirmed (visual, read-only)
official_app_ui: not reachable without command
active_control: HOLD
```
