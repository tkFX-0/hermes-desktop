# Command Center Design Gap Backlog

## Source

Generated from COMMAND_CENTER_DESIGN_CONFORMANCE_AUDIT.md (2026-05-18).

---

## P1 Items

| ID | Title | Impl? | Scope |
|---|---|---|---|
| P1-001 | SafetyStrip: add 5 missing chips | yes | SafetyStrip.tsx |
| P1-002 | PageShell: add footer disclaimer | yes | PageShell.tsx |
| P1-003 | SafetyStrip: add REJECT/UNKNOWN/STALE/ERROR states | yes | SafetyStrip.tsx |

## P2 Items

| ID | Title | Impl? | Scope |
|---|---|---|---|
| P2-001 | OperatorPage: 3-column layout | yes | OperatorPage.tsx (major) |
| P2-002 | CommandChatPage: 3-column layout | yes | CommandChatPage.tsx |
| P2-003 | PageShell: add Topbar | yes | PageShell.tsx + new Topbar.tsx |
| P2-004 | NextActionCard component | yes | new NextActionCard.tsx |
| P2-005 | PageRightRail component | yes | new PageRightRail.tsx |
| P2-006 | InactiveStamp component | yes | new InactiveStamp.tsx |
| P2-007 | Mobile safe-area padding | yes | PageShell.tsx / global CSS |

## P3 Items

| ID | Title | Impl? | Scope |
|---|---|---|---|
| P3-001 | Remove hex fallbacks from components | yes (low) | All page components |
| P3-002 | Language T() wrapper | no (low) | Style preference |
| P3-003 | StackChan face glyphs | yes (low) | StackChanPage.tsx |

---

## Execution Order Recommendation

```
Phase A (P1 — safety visibility):
  P1-001: SafetyStrip chips
  P1-003: SafetyStrip state matrix
  P1-002: PageShell footer

Phase B (P2 — core layout):
  P2-003: Topbar
  P2-004: NextActionCard
  P2-005: PageRightRail
  P2-001: OperatorPage 3-column
  P2-002: CommandChatPage 3-column

Phase C (P2 — supporting):
  P2-006: InactiveStamp
  P2-007: safe-area padding

Phase D (P3 — polish):
  P3-001: CSS token cleanup
  P3-003: StackChan face glyphs
```

---

## AT Items (Agent Theater — new phase)

| ID | Title | Impl? | Scope |
|---|---|---|---|
| AT-01 | Agent Theater page route design | docs (next) | Design doc only |
| AT-02 | Agent Theater static UI | no | AgentTheaterPage.tsx (new) |
| AT-03 | Pixel ghost SVG characters | yes (3d99293 + c214819) | GhostSvg.tsx |
| AT-04 | Visual recheck GO package | yes (docs) | AT_04_VISUAL_RECHECK_*.md |
| AT-04b | AT-04 runtime visual recheck | HOLD | human GO + time_window |
| AT-04c | State binding to snapshot | no | AgentTheaterPage.tsx |
| AT-05 | CSS animation | no | CSS + AgentTheaterPage.tsx |
| AT-06 | Slot worker status display | no | SlotStatusBar.tsx (new) |
| AT-07 | Handoff animation | no | AgentTheaterPage.tsx |
| AT-08 | Runtime visual recheck | pending human | — |
| SLOT-09 | Worker status / cooldown / resume queue design | docs | SLOT_09_*.md |
| AUTO-LEVEL-04 | Autonomous development through local evidence commit | policy | future UI display only |
| AUTO-LEVEL-05 | Human-gated external action boundary | policy | future approval queue / Agent Theater display |
| RUNAWAY-GUARD | Worker runaway prevention | docs | SLOT_09_RUNAWAY_PREVENTION_RULES.md |

---

## Execution Order Recommendation (Updated)

```
Phase A (P1 — done): P1-001/002/003
Phase B (P2 — done): P2-001 through P2-007
Phase C (P3 — in progress):
  P3-003: StackChan face glyphs (DONE — 6b011be)
  P3-001: CSS token cleanup (next P3 item)
Phase E (AT — Agent Theater):
  AT-01: page route design
  AT-02: static UI
  AT-03: pixel ghost assets
  AT-04 → AT-07: state/animation/slot
  AT-08: runtime visual recheck
Phase E2 (Worker autonomy display):
  SLOT-09: worker status enum + resume queue
  AUTO-LEVEL-04: autonomous local worker flow display
  AUTO-LEVEL-05: human-gated boundary display
  RUNAWAY-GUARD: cooldown / NEEDS_HUMAN / stop logic display
Phase F (Provider / Social):
  GHG-01 → GHG-08: Grok-Hermes activation
  XS-01 → XS-08: x_search social awareness
```

---

## Not in Backlog

```
- productionReady change: not in scope
- execution enablement: not in scope
- external write: not in scope
- StackChan physical: not in scope
- voice/camera/mic: not in scope
```

---

_Created: 2026-05-18_
_productionReady: false_
_execution: disabled_
