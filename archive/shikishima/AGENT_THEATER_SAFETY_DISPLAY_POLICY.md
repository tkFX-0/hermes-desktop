# Agent Theater Safety Display Policy

## Document Status

```
date:            2026-05-18
status:          docs-only display policy
```

---

## Purpose

Define what the Agent Theater UI must always show, must never show, and what
interactive actions are permitted on the display.

This policy ensures the Control Room is a safe, transparent surface.

---

## Always Show

The following must be visible at all times in the Agent Theater page:

```
SAFETY INVARIANTS:
  - decision (HOLD / GO_READY / PASS / PASS_WITH_CAVEAT / STOP)
  - execution (always: "disabled")
  - productionReady (always: false)
  - rawValuesReported (always: false)

HUMAN GUIDANCE:
  - next required human action (NextActionCard)
  - current gate status
  - whether human GO is required for the current state

AGENT STATUS:
  - active agent name per slot
  - current pose label per active agent
  - active slot name
  - current worker (pending / active / none)

SYSTEM HEALTH:
  - stale indicator if snapshot is stale
  - last updated timestamp (display only, no raw path)
```

---

## Never Show

The following must never appear in the Agent Theater UI:

```
RAW SENSITIVE VALUES:
  - raw API key or token (any format)
  - auth.json contents
  - raw LAN IP address (192.168.x.x, 10.x.x.x)
  - raw Windows/Linux path (C:\Users\..., /home/...)
  - OAuth auth codes or state parameters
  - account email or username if sensitive

TECHNICAL INTERNALS:
  - internal prompt text
  - raw JSON response from providers
  - raw Hermes config
  - raw provider API metadata

AGENT-INTERNAL STATE:
  - Codex/ClaudeCode intermediate scratchpad
  - partial commit messages before finalization
  - raw error stacktraces (use redacted error summary instead)
```

---

## Permitted UI Actions

These are the only interactive actions allowed in Agent Theater:

```
COPY:
  - copy GO template to clipboard (via CopyOnlyButton)
  - copy evidence summary to clipboard
  - copy agent status summary to clipboard

VIEW:
  - expand agent card for more detail
  - open evidence doc (local static file viewer)
  - open Inspector page (existing page)
  - switch page via PageTabs

FILTER:
  - filter slot status by active / idle / hold
  - filter agent pose history

REFRESH:
  - refresh snapshot (same as OperatorPage refresh button)
```

---

## Forbidden UI Actions

These buttons must NEVER appear in Agent Theater:

```
EXECUTION:
  - execute / run / start button
  - "push" button (git push from UI is forbidden)
  - "send" button (external send forbidden)
  - "deploy" button

AUTHENTICATION:
  - "OAuth login" button
  - "connect provider" button (must be manual CLI action by human)
  - "enable x_search" button

DEVICE:
  - "activate StackChan" button
  - "start voice" button
  - "open camera" button
  - "enable mic" button

FINANCIAL:
  - "purchase" button
  - "reserve" button
  - "pay" button
```

---

## Safety Chip Requirement

The SafetyStrip must be visible on the Agent Theater page.
Chips must include at minimum:
- execution: disabled
- productionReady: false
- external_write: false
- rawValuesReported: false

Additional chips (runtime, stackchan) shown if data available.

---

## HOLD / STOP Visual Requirements

When the system is in HOLD state:
```
- HOLD badge must be visible on active agent cards
- しずめ must show hold_sign_raise animation
- しきしま must show waiting_human_go pose
- NextActionCard must be prominent (not hidden)
- All "working" animations pause
```

When the system is in STOP state:
```
- All agent animations → freeze
- STOP badge visible on all agent cards
- Large STOP indicator in center stage area
- "Human GO required to release" message prominent
- CopyOnly option for STOP report available
```

---

## Reduced Motion Support

For accessibility and performance:

```
@media (prefers-reduced-motion: reduce):
  - all CSS animations → static pose (no keyframe loops)
  - flag: static position
  - float: static position
  - blink: removed
  - card_slide: instant (no transition)
  - exceptions: none (all animations reduced)
```

---

_Created: 2026-05-18_
_productionReady: false_
_execution: disabled_
