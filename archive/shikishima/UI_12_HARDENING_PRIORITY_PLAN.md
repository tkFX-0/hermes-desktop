# UI-12 Hardening Priority Plan

## Execution Order

```
Step 1: HARD-001 — Layout.tsx wiring
  files:  src/renderer/src/screens/Layout/Layout.tsx
  type:   implementation (separate GO required)
  tests:  typecheck:node + typecheck:web + vitest
  output: Command Center view accessible from nav

Step 2: HARD-002 — IPC data connection
  files:  Layout.tsx (IPC calls + data pass-down)
  type:   implementation (can combine with Step 1 in single GO)
  tests:  same as above
  output: pages receive snapshot data (HOLD state when no live IPC)

Step 3: HARD-003 — Visual QA runtime observation
  type:   new runtime observation GO (separate time_window required)
  output: evidence that all 12 pages render with SafetyStrip + HOLD
```

## What UI-12 Does NOT Include

```
- productionReady change
- execution enablement
- external write activation
- StackChan physical wiring
- voice/camera/mic activation
- new UI features beyond wiring gap fix
```

## GO Template for Step 1+2 (UI-12 Implementation)

```
I approve UI-12 Layout wiring implementation.
Date:         YYYY-MM-DD
time_window:  HH:MM-HH:MM JST
allowed files:
  - src/renderer/src/screens/Layout/Layout.tsx
approved commands:
  - npm run typecheck:node
  - npm run typecheck:web
  - npm test
approved fixes:
  - Add Command Center view type and nav entry
  - Import and render PageShell with active page component
  - Wire IPC snapshot data pass-down
push: not approved in this GO (separate push GO)
runtime: not approved in this GO (separate runtime observation GO)
```

---

_Created: 2026-05-18_
_productionReady: false_
_execution: disabled_
