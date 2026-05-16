# Shikishima + StackChan Assistant Vision

## Document Status

```text
roadmapVersion: v3.35.0
date: 2026-05-16
status: vision_record — north star for all future design decisions
        not execution approval / not Level 3 approval / not productionReady
```

---

## Purpose

This document records the user's long-term ideal for the Shikishima system.

When future design decisions arise — especially at Level 3 and beyond —
this document answers the question:

**"Is this work moving toward the ideal, or is it just technical exercise?"**

---

## 1. Core Vision

```text
Shikishima is the brain, judge, safety gate, planner, memory, and record keeper.

StackChan is the face, voice, expression, presence, and room-side terminal.

ClaudeCode / Codex are execution workers under human-approved scope.

External tools (X, calendar, reservations, sensors, ToDo, finance, product research)
are future integrations under explicit safety policy.

The human remains the final GO / HOLD / REJECT authority at all times.
```

**One-line summary:**

> 安全に制御された、かわいくて先回りする実用AI秘書。その身体がStackChan。その判断中枢がしきしま。

---

## 2. Desired Assistant Capabilities (future goals)

These are direction markers, not approved features.
Each requires its own design doc and GO before implementation.

### Daily Life Support

```text
- real-time secretary support
- event / order aggregation
- bill splitting and tax calculation
- ToDo detection from conversation
- reminder and schedule support
- calendar planning
- reservation support
```

### Research and Product Support

```text
- product research and recommendation
- StackChan parts and hardware research
- sensor explanations and sensor-linked awareness
```

### Content and Communication

```text
- X / Note content drafting
- X reply / post drafting (human reviews before sending)
```

### Finance

```text
- trading / finance support (suggestion / analysis only by default)
```

### Development

```text
- development support (ClaudeCode / Codex worker under approved scope)
```

### Presence (StackChan)

```text
- cute proactive speech and reactions
- daily priority announcements
- STOP / HOLD warnings
- friendly encouragement
```

---

## 3. StackChan Role

StackChan is Shikishima's embodied room-side terminal.

### Eventually should

```text
- speak Shikishima's summaries and alerts
- show facial expressions in response to state
- react to user context
- announce reminders and schedule highlights
- read daily priorities
- warn about STOP / HOLD conditions
- give friendly encouragement
- behave as Shikishima's physical presence
```

### Must not (initially, without separate physical safety gate)

```text
- autonomously purchase
- autonomously reserve
- autonomously post to X
- autonomously execute commands on the PC
- autonomously control the PC
- autonomously access secrets
- autonomously operate physical motion without a physical safety gate
```

---

## 4. Shikishima Safety Model (core rule)

```text
Shikishima MAY:
  - proactively propose
  - organize and structure information
  - draft content
  - warn and alert
  - summarize
  - prepare approval packages

Shikishima MUST NOT execute high-risk actions without explicit human GO.
```

### High-risk actions (require explicit GO)

```text
- posting to X or external platforms
- sending messages
- purchases
- payments
- reservations
- external API writes
- local file writes outside approved scope
- dependency installation
- Cloudflare / deployment
- robot / StackChan physical motion
- voice / camera / mic activation
- secret / token handling
- productionReady true
- execution enabled globally
```

---

## 5. Tool Autonomy Levels

| Level | Name | Description | Current Status |
|---|---|---|---|
| 0 | Suggestion only | Shikishima proposes, human decides | allowed |
| 1 | Draft creation | Shikishima drafts, human manually executes | allowed |
| 2 | Approved execution assistance | human approves each action before execution | separate GO per action |
| 3 | Limited API execution | after exact scoped GO with STOP conditions | each run requires GO |
| 4 | Low-risk autonomous execution | future policy required | HOLD |
| 5 | High-risk autonomous execution | HOLD / not approved | HOLD |

**Current target: Level 0–1. Level 2 by separate GO only.**

---

## 6. Inspiration Boundary

The ideal captures the spirit of proactive, helpful AI assistants:

```text
- cute proactive behavior
- bright practical responses
- helpful event / task / product support
- social presence through StackChan
```

But Shikishima must not blindly copy any external account's behavior,
and must not grant autonomous authority without the safety model in Section 4.

---

## 7. Future Roadmap Candidates

These are future docs-only candidates. None are approved.

```text
- STACKCHAN_ROLE_AND_EXPRESSION_POLICY.md
- SHIKISHIMA_TOOL_AUTONOMY_LEVELS.md
- SHIKISHIMA_HUMAN_APPROVAL_QUEUE_DESIGN.md
- SHIKISHIMA_X_OPERATION_POLICY.md
- SHIKISHIMA_CALENDAR_RESERVATION_POLICY.md
- SHIKISHIMA_SENSOR_AWARENESS_ROADMAP.md
```

---

## 8. What This Document Does NOT Approve

```text
- Level 3 execution
- productionReady true
- execution enabled
- StackChan physical connection
- voice / camera / mic
- X posting / sending messages
- purchases / payments / reservations
- external API writes
- autonomous operation
- any of the future roadmap candidates above
```

---

## Safety Boundary

```text
decision          : HOLD
execution         : disabled
productionReady   : false
rawValuesReported : false
Level 3           : not approved
```

---

この範囲では問題を検出していません。
