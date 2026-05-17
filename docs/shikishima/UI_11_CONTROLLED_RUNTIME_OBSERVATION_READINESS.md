# UI-11 Controlled Runtime Observation Readiness

## Purpose

This document records the readiness state after UI-03 through UI-10
implementation completion, and defines the preconditions for conducting a
controlled runtime observation.

This document is **not** runtime approval.
This document is **not** productionReady approval.
This document is **not** execution approval.
This document is **not** external-write approval.
This document is **not** StackChan physical approval.
This document is **not** voice/camera/mic approval.

---

## UI-03 to UI-10 Completed State

### Commit Range

| Phase | Commit | Subject |
|---|---|---|
| UI-03 impl | dc80ebe | feat: add ui 03 snapshot helpers and freshness utilities |
| UI-03 docs | 68cdb19 | docs: record ui 03 implementation evidence |
| UI-04 impl | 93109a8 | feat: add command center shell components |
| UI-04 docs | e4f767c | docs: record ui 04 shell components evidence |
| UI-05 | fb7db4c | feat: add operator and chat pages |
| UI-06 | a08e31d | feat: add operational suite pages |
| UI-07 | e3fb17a | feat: add stackchan control room pages |
| UI-08 | 821ca6e | feat: add Settings, Help, and Onboarding pages |
| UI-09 | 8989acf | feat: add state, toast, and command palette components |
| UI-10 | 35befd7 | fix: visual QA — inject command-center CSS tokens and fix hardcoded color |

Latest pushed commit: `35befd7`
Branch: main
HEAD == origin/main: confirmed

### Test Summary (at UI-10)

```
typecheck:node: PASS
typecheck:web:  PASS
vitest:         806 passed / 1 skipped (807)
```

### Files Delivered (UI-03 to UI-10)

```
36 files changed, +4,864 lines, -10 lines
```

Key files:
- `src/shared/ichikishima/ui-freshness-helpers.ts` — staleness detection
- `src/shared/ichikishima/ui-snapshot-helpers.ts` — checkRedaction / snapshotToSafeSummary
- `src/renderer/src/utils/snapshot-to-page.ts` — 5 page mappers (all HOLD fallback)
- `src/renderer/src/components/Shell/SafetyStrip.tsx` — always-visible safety bar
- `src/renderer/src/components/Shell/PageTabs.tsx` — 12-tab navigation
- `src/renderer/src/screens/Operator/OperatorPage.tsx` — main lamp grid
- `src/renderer/src/screens/CommandChat/CommandChatPage.tsx` — local chat only
- `src/renderer/src/screens/Outbox/OutboxPage.tsx`, Queue, GO, Evidence, Stop, Push
- `src/renderer/src/screens/StackChan/StackChanPage.tsx` + StackChanMobilePage
- `src/renderer/src/screens/CommandSettings/CommandSettingsPage.tsx`
- `src/renderer/src/screens/CommandHelp/CommandHelpPage.tsx` + OnboardingFlow
- `src/renderer/src/components/State/` — EmptyState / LoadingState / ErrorState / StaleWarning
- `src/renderer/src/components/Toast/ToastContainer.tsx`
- `src/renderer/src/components/CommandPalette/CommandPalette.tsx`
- `src/renderer/src/assets/command-center-tokens.css` — CSS variable definitions
- `tests/ui-snapshot-helpers.test.ts` — 45 tests

### Safety Invariant Summary

| Invariant | Status |
|---|---|
| productionReady | false (TypeScript literal, all pages) |
| execution | "disabled" (TypeScript literal, all pages) |
| rawValuesReported | false (snapshot helpers only, checkRedaction enforced) |
| externalWrite | false (OutboxPage + contracts) |
| physicalOperation | false (StackChan both pages) |
| voiceActive | false |
| cameraActive | false |
| micActive | false |

---

## Why Runtime Observation Requires Separate GO

UI-03 to UI-10 being complete does **not** mean:
- The runtime has been tested with actual data
- The IPC connections are verified live
- STALE fallbacks have been visually confirmed with real data
- The SafetyStrip has been seen by a human observer in live state
- All pages have been rendered with real IPC snapshot responses
- No unexpected raw values appear at display time
- The app shuts down cleanly

Runtime observation is a **separate boundary** that requires:
1. Clean git state (HEAD == origin/main, 0 staged, 0 dirty)
2. Port 3030 closed before start
3. An explicit human-issued GO with time_window
4. A defined approved command (e.g., `npm run dev`)
5. A defined observation scope
6. A defined shutdown method
7. Post-shutdown port verification
8. Evidence recording

---

## Preconditions for Runtime Observation

All must be true before runtime observation can proceed:

```
[ ] git: HEAD == origin/main
[ ] git: commits_ahead == 0
[ ] git: staged == 0
[ ] git: tracked_dirty == 0
[ ] port 3030: closed before start (verified)
[ ] runtime command: explicitly approved by human
[ ] time_window: explicitly provided by human
[ ] observation scope: explicitly approved by human
[ ] shutdown method: defined
[ ] evidence file path: defined
```

---

## Next Required Human Action

```
next_required_human_action: issue_runtime_observation_go_with_time_window
not_approved_yet:
  - runtime start
  - productionReady true
  - execution enabled
  - external write
  - StackChan physical
  - voice/camera/mic
```

---

_Created: 2026-05-17_
_Status: HOLD — runtime GO not yet issued_
_productionReady: false_
_execution: disabled_
