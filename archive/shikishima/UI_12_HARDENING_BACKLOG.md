# UI-12 Hardening Backlog

## Source

Generated from POST_RUNTIME_UI_HARDENING_REVIEW.md (2026-05-18).

---

## Backlog Items

### HARD-001 — Layout.tsx Command Center Wiring (P1)

```
id:          HARD-001
priority:    P1
source:      CAVEAT-01 (UI-11 runtime observation)
severity:    blocks visual verification of new pages
title:       Wire Command Center pages into Layout.tsx / app routing

description:
  The 12 new Command Center pages (OperatorPage, CommandChatPage,
  StackChanPage, OutboxPage, QueuePage, GoPage, EvidencePage, StopPage,
  PushPage, CommandSettingsPage, CommandHelpPage / OnboardingFlow)
  are implemented but have no entry point in the running Electron app.
  Layout.tsx must be updated to include a Command Center view that
  renders PageShell with the appropriate page component.

target_files:
  - src/renderer/src/screens/Layout/Layout.tsx (primary)
  - possibly src/renderer/src/App.tsx (if routing logic changes needed)

expected_changes:
  - Add "commandCenter" (or equivalent) view to the View type in Layout.tsx
  - Import PageShell and the active Command Center page component
  - Add nav item for the new Command Center entry point
  - Wire snapshot data from IPC to the page components (or use mock data)

test_requirements:
  - typecheck:node PASS
  - typecheck:web PASS
  - vitest PASS (no regression in 806 tests)
  - Visual: new Command Center view accessible via nav

runtime_observation_required_after: yes
implementation_go_required: yes
human_review_required: yes
estimated_files: 1-2
estimated_risk: LOW (additive change; does not remove existing functionality)
```

### HARD-002 — IPC Data Connection for New Pages (P2, depends on HARD-001)

```
id:          HARD-002
priority:    P2
source:      post HARD-001 verification
severity:    pages may show STALE/HOLD without live IPC data
title:       Connect IPC snapshot data to new Command Center pages

description:
  After Layout.tsx wiring (HARD-001), the page components need to
  receive live IPC snapshot data to show real state. Currently they
  are designed to accept props; the parent (Layout.tsx) needs to
  fetch from IPC and pass down.

  Initial wiring can use mock/holdSummary data to confirm rendering.
  Full IPC connection is the second step.

target_files:
  - src/renderer/src/screens/Layout/Layout.tsx (IPC calls)
  - src/renderer/src/utils/snapshot-to-page.ts (already exists)

depends_on: HARD-001
implementation_go_required: yes
```

### HARD-003 — Post-Wiring Visual QA (P2, depends on HARD-001 + HARD-002)

```
id:          HARD-003
priority:    P2
source:      UI-11 CAVEAT-01 — pages never visually verified
title:       Visual QA after wiring fix

description:
  After HARD-001 and HARD-002 are implemented and tested, a new
  controlled runtime observation (Task 14 re-run) is needed to
  confirm all 12 pages render correctly, SafetyStrip is visible,
  productionReady:false is visible, and no raw values appear.

depends_on: HARD-001, HARD-002
runtime_observation_go_required: yes
```

---

## Items Explicitly NOT in Backlog

```
productionReady true:    not in backlog — requires Gate 005 + separate Gate
execution enabled:       not in backlog — requires separate Gate
external write:          not in backlog — requires Gate chain
StackChan physical:      not in backlog — requires dedicated Gate
voice/camera/mic:        not in backlog — requires dedicated Gate
```

---

_Created: 2026-05-18_
_productionReady: false_
_execution: disabled_
