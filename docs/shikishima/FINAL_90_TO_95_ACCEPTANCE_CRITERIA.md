# Final 90→95 Acceptance Criteria

## Purpose

Defines the exact criteria that must be met before the project is considered
a 90→95 readiness candidate.

These criteria do not approve productionReady. They are readiness gate items
for the next phase of controlled operation.

---

## Criteria Table

| # | Criterion | Required Evidence | Status |
|---|---|---|---|
| AC-01 | UI-11 runtime observation: PASS | UI_11_RUNTIME_OBSERVATION_EVIDENCE.md | PENDING |
| AC-02 | All 12 pages render without crash | evidence file, human observation | PENDING |
| AC-03 | SafetyStrip visible on every page | evidence file / screenshots | PENDING |
| AC-04 | productionReady: false in all observations | evidence file | PENDING |
| AC-05 | execution: disabled in all observations | evidence file | PENDING |
| AC-06 | No raw Windows path visible in UI | evidence file | PENDING |
| AC-07 | No LAN IP visible in UI | evidence file | PENDING |
| AC-08 | No API key / token visible in UI | evidence file | PENDING |
| AC-09 | No active external action button | evidence file | PENDING |
| AC-10 | Shutdown clean (port closed, git clean) | evidence file | PENDING |
| AC-11 | UI-12 hardening complete (if post-runtime issues found) | UI-12 commit | PENDING |
| AC-12 | typecheck:node PASS after UI-12 | CI / local run | PENDING |
| AC-13 | typecheck:web PASS after UI-12 | CI / local run | PENDING |
| AC-14 | vitest 800+ PASS after UI-12 | CI / local run | PENDING |
| AC-15 | Human reviewed evidence and issued acceptance | human statement | PENDING |

---

## Criteria NOT in Scope for 90→95

The following are explicitly **not** required for 90→95:

```
- productionReady: true — NOT required (remains false)
- execution: enabled — NOT required (remains disabled)
- external write approval — NOT required
- StackChan physical operation — NOT required
- voice / camera / mic — NOT required
- autonomous agent operation — NOT required
- Gate 005 full resolution — NOT required (HOLD is acceptable for 90→95)
```

---

## How Acceptance Is Granted

90→95 acceptance requires:
1. All AC-01 through AC-15 confirmed PASS
2. Human explicitly states: `I accept the 90→95 readiness milestone.`
3. A final evidence document is created and pushed

---

_Created: 2026-05-17_
_productionReady: false_
_execution: disabled_
