# Agent Theater Implementation Phases

## Document Status

```
date:            2026-05-18
status:          docs-only phase plan — Phase AT-00 active
current_phase:   AT-00
source_changed:  false
```

---

## Phase Overview

| Phase | Name | Status | Output |
|---|---|---|---|
| AT-00 | Docs-only design | COMPLETE | This document set |
| AT-01 | Page route design | HOLD | Route + component skeleton (no source yet) |
| AT-02 | Static UI with placeholders | HOLD | AgentTheaterPage.tsx — CSS shapes only |
| AT-03 | Pixel ghost asset integration | HOLD | Sprite assets committed after review |
| AT-04 | State binding | HOLD | Read from SafeSnapshotData props |
| AT-05 | CSS-only animation | HOLD | Keyframe animations + reduced-motion |
| AT-06 | Slot worker status display | HOLD | Slot Status Bar wired |
| AT-07 | Handoff animation | HOLD | Card slide + arrow animation |
| AT-08 | Runtime visual recheck | HOLD | Human-supervised observation session |

---

## AT-00 — Docs-Only Design (CURRENT)

```
objective:       Create implementation design docs before any source change
status:          COMPLETE (this document set)
output:
  - AGENT_THEATER_IMPLEMENTATION_DESIGN.md
  - PIXEL_GHOST_AGENT_CHARACTER_SPEC.md
  - AGENT_THEATER_POSE_AND_ACTION_MATRIX.md
  - AGENT_HANDOFF_FLOW_DESIGN.md
  - SLOT_WORKER_ROUTING_DESIGN.md
  - CODEX_CLAUDECODE_WORKER_BOUNDARY.md
  - AGENT_THEATER_SAFETY_DISPLAY_POLICY.md
  - AGENT_THEATER_IMPLEMENTATION_PHASES.md (this file)

no_source_change: true
no_assets:        true
no_runtime:       true
```

---

## AT-01 — Page Route Design

```
objective:       Design the component tree and page route for Agent Theater
                 without modifying source yet.
output:          Design doc: allowed files, component names, route ID, props

allowed_actions:
  - write design doc (docs only)
  - decide: new page ID (e.g., "theater"), component path
  - decide: how AgentTheaterPage receives snapshot data
  - decide: which existing components it reuses (PageShell, SafetyStrip, etc.)

required_GO:     AT-01 design GO (human reviews design before AT-02 impl)

key_decisions:
  - page ID in PageTabs (e.g., "theater" or "control")
  - component location: src/renderer/src/screens/AgentTheater/
  - props: decision, slotStatus, agentPoses (all from snapshot)
  - PageRightRail reuse: yes (same as OperatorPage)

note:            This is still docs-only. No source change.
```

---

## AT-02 — Static UI with Placeholders

```
objective:       Implement AgentTheaterPage with CSS-only placeholder shapes.
                 No pixel art assets required. Functional layout only.

allowed_files:
  - src/renderer/src/screens/AgentTheater/AgentTheaterPage.tsx (NEW)
  - src/renderer/src/screens/AgentTheater/AgentCard.tsx (NEW)
  - src/renderer/src/screens/AgentTheater/SlotStatusBar.tsx (NEW)
  - src/renderer/src/screens/Layout/Layout.tsx (add route)
  - src/renderer/src/assets/command-center-tokens.css (if new CSS vars needed)

placeholder_visual:
  - agent ghost: CSS circle/rounded-rect in ghost-white + blue border
  - flag: CSS small triangle in flag color
  - pose label: text-only badge
  - name: text label below shape
  - handoff row: horizontal flex of agent names with arrows (text only)

allowed_commands:
  - npm run typecheck:node
  - npm run typecheck:web
  - npx vitest run

required_GO:     AT-02 implementation GO + tests pass

safety:
  - no execute button in component
  - SafetyStrip visible via PageShell
  - NextActionCard via PageRightRail
```

---

## AT-03 — Pixel Ghost Asset Integration

```
objective:       Replace CSS placeholders with actual pixel art ghost sprites

preconditions:
  - pixel ghost assets created and reviewed for originality
  - assets are: original artwork OR properly licensed
  - no third-party characters

asset_format:    PNG sprite sheet (64×64 or 64×80 per frame)
                 OR individual PNG per pose per agent

asset_location:  src/renderer/src/assets/agents/ (committed after review)

allowed_actions:
  - add image assets (after originality/license review)
  - update AgentCard to use <img> or background-image
  - keep CSS fallback for accessibility

required_GO:     AT-03 asset review GO (human confirms originality)
```

---

## AT-04 — State Binding

```
objective:       Wire AgentTheaterPage to SafeSnapshotData

data_flow:
  - Layout.tsx passes snapshot to AgentTheaterPage as props
  - decision → affects all agent state badges + poses
  - slotStatus → affects SlotStatusBar
  - stale → shows stale banner, all agents show hold/waiting

no_new_IPC:      read-only snapshot data only (same source as OperatorPage)

required_GO:     AT-04 implementation GO
```

---

## AT-05 — CSS-Only Animation

```
objective:       Add CSS keyframe animations for each pose type

animation_types:
  - @keyframes float (idle)
  - @keyframes blink (idle/waiting)
  - @keyframes flag_wiggle (working)
  - @keyframes card_slide (handoff)
  - @keyframes small_bounce (pass)
  - @keyframes write_loop (recording)
  - @keyframes keyboard_tap (implementing)
  - freeze state = no animation class applied

reduced_motion:
  - @media (prefers-reduced-motion: reduce) → remove all animation classes

required_GO:     AT-05 implementation GO + human visual review
```

---

## AT-06 — Slot Worker Status Display

```
objective:       Implement SlotStatusBar with live slot/worker/gate data

data_source:     snapshot props (slotStatus array or derived from decision)

display:
  - table or card-grid of slots
  - worker name (pending / active / none)
  - status badge (HOLD / active / idle)
  - gate required label

required_GO:     AT-06 implementation GO
```

---

## AT-07 — Handoff Animation

```
objective:       Animate handoff arrows between agent cards

animation:
  - card_slide between active step agents
  - arrow highlight follows flow step
  - HOLD/STOP freezes flow indicator

required_GO:     AT-07 implementation GO + human visual review
```

---

## AT-08 — Runtime Visual Recheck

```
objective:       Human-supervised observation session for Agent Theater page

required:
  - explicit human GO with time_window
  - human present at PC
  - observe all 8 checklist items:
      1. Agent Theater page accessible via PageTabs
      2. Agent cards show correct pose labels for current decision
      3. SlotStatusBar shows correct slot states
      4. SafetyStrip visible, all chips correct
      5. No execute/push/send buttons visible
      6. NextActionCard prominent in PageRightRail
      7. Reduced-motion works (if testable)
      8. No raw values exposed

evidence_file:   docs/shikishima/AT-08_RUNTIME_RECHECK_EVIDENCE.md (created at recheck time)
```

---

## Phase Dependencies

```
AT-00 (DONE) → AT-01 → AT-02 → AT-03
                              ↓
                         AT-04 → AT-05 → AT-06 → AT-07 → AT-08

AT-03 can proceed in parallel with AT-04 if asset review is done.
AT-05 requires AT-02 (CSS class targets must exist).
AT-08 requires AT-04 minimum (state binding).
```

---

_Created: 2026-05-18_
_productionReady: false_
_execution: disabled_
