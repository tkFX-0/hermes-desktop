# Agent Theater Implementation Design

## Document Status

```
date:            2026-05-18
status:          docs-only design — Phase AT-00
decision:        HOLD
execution:       disabled
productionReady: false
source_changed:  false
```

---

## Concept

The Agent Theater (管制室 / Control Room) is the main operational page of Shikishima.
It visualizes the five pixel ghost agents — what each is doing, what state the system is in,
and what the next human action should be.

Each agent occupies a "slot" on screen. Their pose and flag reflect the current work state.
The human always knows what is happening and what requires their GO.

The display is read-only. No agent UI button triggers execution, push, OAuth, or external write.

---

## Core Design Principles

```
1. visibility:    every active process is shown as an agent work-scene
2. human-first:   human GO wait is visually prominent
3. safety-first:  safety invariants (execution/productionReady/etc.) always visible
4. display-only:  no execute/push/send buttons on any agent card
5. copy-only:     only copyable artifacts (templates, summaries) are interactive
6. pause-visible: blocked states (HOLD/STOP/waiting) are visually clear
```

---

## Layout Sketch (desktop ≥900px)

```
┌──────────────────────────────────────────────────────────┐
│  Topbar: しきしま · CONTROL ROOM · Private Console       │
│  SafetyStrip (always visible)                            │
│  PageTabs                                                │
├────────────────────────────┬─────────────────────────────┤
│ Agent Theater Stage        │ PageRightRail               │
│                            │ - NextActionCard            │
│  [しきしま]  [しずめ]      │ - Safety chips              │
│  [はじめ]   [つむぎ]      │ - Copy buttons              │
│  [しるべ]                  │                             │
│                            │                             │
│  ─── Handoff Flow ───      │                             │
│  [Slot Status Bar]         │                             │
└────────────────────────────┴─────────────────────────────┘
│ Footer: しきしま · Private Console | 外部実行なし         │
└──────────────────────────────────────────────────────────┘
```

Mobile: single column, agents stacked, PageRightRail hidden.

---

## Agent Cards

Each agent has a card showing:

```
┌───────────────────────┐
│ [ghost sprite / CSS]  │
│  agent name (text)    │
│  current pose label   │
│  current task / slot  │
│  state badge          │
│  [flag wiggle anim]   │
└───────────────────────┘
```

State badge colors:
- WAITING: amber (hold color)
- WORKING: blue (go color)
- PASS: green
- HOLD: amber
- STOP/BLOCKED: red

---

## Handoff Flow Row

A compact row below the agent cards showing:

```
[しきしま] → [はじめ] → [しずめ] → [つむぎ] → [しずめ] → [しるべ] → [しきしま]
  listen      plan       check       work       recheck     record     await GO
```

Active step is highlighted. Blocked step shows a STOP indicator.

---

## Slot Status Bar

Below the handoff row, a compact table:

| Slot | Current Worker | Status | Gate |
|---|---|---|---|
| CONVERSE | Grok-Hermes (pending) | HOLD | GHG-03+ |
| PLAN | — | idle | — |
| SAFETY | しずめ rule-based | active | — |
| DEV-CODEX | — | HOLD | scoped GO |
| DEV-CLAUDECODE | — | HOLD | scoped GO |
| RECORD | しるべ | active | — |
| SOCIAL-AWARENESS | x_search (pending) | HOLD | XS-03+ |

---

## Technology

```
rendering:     React (same as existing Command Center pages)
animation:     CSS keyframes only (no canvas, no video, no audio)
assets:        placeholder CSS shapes initially; real sprites in AT-03+
layout:        CSS Grid / Flexbox (same as cc-operator-grid pattern)
state:         read from SafeSnapshotData props (same as OperatorPage)
no:            WebGL, Three.js, canvas, audio API, camera, mic
```

---

## Reference Docs

- `PIXEL_GHOST_AGENT_CHARACTER_SPEC.md` — per-agent visual spec
- `AGENT_THEATER_POSE_AND_ACTION_MATRIX.md` — 8-pose matrix
- `AGENT_HANDOFF_FLOW_DESIGN.md` — flow between agents
- `SLOT_WORKER_ROUTING_DESIGN.md` — slot assignment
- `CODEX_CLAUDECODE_WORKER_BOUNDARY.md` — dev worker constraints
- `AGENT_THEATER_SAFETY_DISPLAY_POLICY.md` — what to show/not show
- `AGENT_THEATER_IMPLEMENTATION_PHASES.md` — AT-00 through AT-08

---

_Created: 2026-05-18_
_productionReady: false_
_execution: disabled_
