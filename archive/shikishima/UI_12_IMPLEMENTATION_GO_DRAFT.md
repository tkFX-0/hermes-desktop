# UI-12 Implementation GO Draft

## Status: DRAFT — NOT YET APPROVED

This document is a GO template.
It is not implementation approval until a human fills in the placeholders
and explicitly issues the GO statement.

---

## GO Statement Template

```
I approve UI-12 Layout wiring implementation.
Date:         YYYY-MM-DD
time_window:  HH:MM-HH:MM JST

allowed files:
  - src/renderer/src/screens/Layout/Layout.tsx

approved fixes:
  - Add Command Center view to View type and nav
  - Import and render PageShell + active Command Center page
  - Wire holdSummary / IPC snapshot data pass-down

approved commands:
  - npm run typecheck:node
  - npm run typecheck:web
  - npm test

push: NOT approved in this GO
runtime: NOT approved in this GO
productionReady: NOT approved
execution: NOT approved
external write: NOT approved
StackChan physical: NOT approved
voice/camera/mic: NOT approved
```

---

## Pre-Implementation Checks

Before implementation starts:

```
[ ] git branch: main
[ ] git HEAD == origin/main
[ ] commits_ahead: 0
[ ] staged: 0
[ ] tracked_dirty: 0
[ ] Time is within approved time_window
[ ] Human GO received with all fields filled
```

## STOP Conditions During Implementation

```
STOP if:
- Any file outside allowed list is modified
- package.json or tsconfig is changed
- Any safety invariant would be violated by the change
- typecheck or vitest cannot be fixed within Layout.tsx scope
- The fix requires adding external API calls or device connections
```

## Expected Commit

```
git commit -m "feat: wire command center ui into layout (UI-12)"
```

Do not push. Separate push GO required.

---

## This Is Not GO

Until a human fills in date + time_window and issues the statement above,
UI-12 implementation must not start.

---

_Created: 2026-05-18_
_productionReady: false_
_execution: disabled_
