# Shikishima Tool Autonomy Levels

## Document Status

```text
roadmapVersion: v3.37.0
date: 2026-05-16
status: policy_design_only — not execution approval
```

---

## Purpose

This document defines the autonomy levels for Shikishima tool actions.

It prevents the "cute proactive assistant" from becoming unsafe autonomous execution.

**Current project limit: Level 0–1 allowed. Level 2 requires separate GO. Level 3+ are gated. Level 4–5 are HOLD.**

---

## Level 0 — Suggestion Only

**Execution: none.**

Shikishima may:

```text
- explain
- summarize
- propose options
- warn about risks
- organize information
- prepare comparison
- create priority list
- draft agenda
```

Human decides all next actions manually.

---

## Level 1 — Draft Creation Only

**Human manually executes. No automated send/submit/write.**

Shikishima may draft:

```text
- X posts and replies
- calendar entries
- reservation details
- shopping comparison and list
- task plan
- development task description
- StackChan speech script
- reminder text
- report template
```

Human copies, reviews, and manually executes.

---

## Level 2 — Human-Approved Execution Assistance

**Requires exact human GO per action.**

Allowed only after user confirms each step:

```text
- create a calendar entry (human confirms before save)
- prepare an approved message (human confirms before send)
- open an approved local workflow (human approves exact path)
- assist approved reservation flow (human confirms each field)
- assist approved posting flow (human reads and manually posts)
```

Still forbidden at Level 2 without further approval:

```text
- final payment / purchase
- autonomous send
- external API writes
- secrets handling
```

---

## Level 3 — Limited API Execution After Exact GO

**Requires all of:**

```text
- exact API endpoint
- exact time window
- exact command
- STOP conditions defined
- rollback plan defined
- evidence file path
- risk level reviewed
```

Current use: Level 3-A controlled local runtime observation.

Level 3 does not approve:

```text
- productionReady true
- execution enabled globally
- autonomous external operations
- Level 3-B/C/D/E without separate approval
```

---

## Level 4 — Low-Risk Autonomous Execution

**Status: HOLD — future policy required.**

May eventually include:

```text
- automated reminder notification (pre-approved, low-risk)
- calendar summary push (pre-approved format)
- scheduled report generation (redacted only)
```

Requires a separate safety policy before activation.

---

## Level 5 — High-Risk Autonomous Execution

**Status: HOLD — prohibited.**

Examples:

```text
- autonomous purchase
- autonomous reservation
- autonomous payment
- autonomous X posting
- autonomous DM
- external deployment
- robot / StackChan physical motion
- productionReady true
- execution enabled globally
- continuous surveillance (camera/mic)
- autonomous secrets handling
```

---

## Current Project Limit Summary

| Level | Name | Status |
|---|---|---|
| 0 | Suggestion | allowed |
| 1 | Draft | allowed |
| 2 | Approved assist | separate GO per action |
| 3 | Limited API execution | separate controlled gate |
| 4 | Low-risk autonomous | HOLD |
| 5 | High-risk autonomous | HOLD / prohibited |

---

## Safety Boundary

```text
execution         : disabled
productionReady   : false
Level 3           : not approved (current L3-A is controlled observation only)
autonomous_action : HOLD
```

---

この範囲では問題を検出していません。
