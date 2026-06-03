# Shikishima V3 Goal Roadmap

## Document Status

- roadmapVersion: v3.1.2
- status: goal_roadmap_redefinition / HOLD
- execution: disabled
- productionReady: false
- Level 2: not approved
- Level 3: not approved
- date: 2026-05-14

## Purpose

This document redefines the Shikishima v3 roadmap as a set of forward-moving
goals organized into tracks. Each track has a clear current position, next gate,
and hard STOP conditions.

This document does not approve execution of any track or gate.

## Current State

| Item | Value |
|---|---|
| Latest local commit | a7cce7d docs: prepare level 2 go wording review |
| Latest remote commit | 9c55a19 docs: prepare level 2 scope proposal |
| Level 1 local dry-run | PASS (2026-05-14) |
| Level 2 GO wording review | created locally, not yet pushed |
| Level 2 execution | not approved |
| Level 3 | not approved |
| decision | HOLD |
| execution | disabled |
| productionReady | false |

## Why The Roadmap Is Being Redefined

The project has moved from individual task-by-task instructions toward larger
goals. The v2.9.x through v3.1.1 work established safety infrastructure, evidence
records, and review docs. The next phase uses goal-oriented progression where
larger goal definitions can be invoked while hard STOP gates remain intact.

This redefinition does not change the safety boundary. HOLD, execution disabled,
and productionReady false remain in effect.

---

## Track A — Validation Gate Track

**Purpose:** Continue and complete the Level 2 local controlled validation path.

**Current position:**
- Level 2 GO wording review exists at a7cce7d (not yet pushed)
- Level 2 execution not approved

**Actions in order:**
1. push readiness check for a7cce7d
2. explicit human push GO
3. Level 2 final GO (human must issue with filled time window)
4. Level 2 local controlled validation execution
5. Level 2 evidence record
6. post-Level 2 human acceptance review

**What Track A does not include:**
- Electron dev-mode launch
- external services
- WSL/Hermes/wrapper
- device/robot/voice/camera/mic
- productionReady true
- autonomous escalation to Level 3

**Next gate:** Level 2 push readiness check

---

## Track B — Local App Observation Track

**Purpose:** Prepare to observe the project as one running local app.

**What "Local App Observation" means:**
Local App Observation means checking the project as one local app through a
separately approved local UI observation path. It may include Electron dev-mode
only if separately scoped and approved. It does not include external service
access, deploy, WSL/Hermes/wrapper, StackChan/robot, voice/camera/mic,
raw/local-only values, productionReady true, or autonomous execution.

**Current position:** HOLD — not yet approved.

**When Track B may begin:** Only after Level 2 validation evidence is recorded
and accepted, OR after a separate explicit human GO for Track B.

**What Track B does not include:**
- External services
- WSL/Hermes/wrapper
- Device/robot/voice/camera/mic
- productionReady true
- Cloudflare/deploy
- raw/local-only values

**Next gate:** App observation readiness review (after Track A completion)

---

## Track C — Practical Local MVP Operation Track

**Purpose:** Define how the human uses Shikishima locally for real work.

Includes: review logs, Obsidian-ready records, human decisions, daily checklists,
local operation planning.

Does not include: autonomous execution, external services, productionReady true.

**Current position:** planning-ready after validation gates.

**Next gate:** Begin after Level 2 validation evidence and human acceptance.

---

## Track D — 5-Agent System Track

**Purpose:** Organize しきしま / しずめ / つむぎ / はじめ / しるべ roles into
practical local operation with safety gate separation.

**Current position:** conceptual / docs-ready. Implementation gated behind
validation and app observation tracks.

**What Track D does not include:** autonomous execution, external services,
productionReady true without separate GO.

**Next gate:** Begin after Track B (app observation) is at least partially
established.

---

## Track E — External / Device / Voice / Robot Track

**Purpose:** Define future path for Cloudflare, WSL/Hermes/wrapper, StackChan,
robot, voice, camera, mic, and external services.

**Current position:** absolute HOLD. Not part of current v3 local validation goals.

**When Track E may begin:** Only after Tracks A, B, and C are established AND
after a separate explicit human GO with exact scope per component.

**What Track E requires:**
- Separate GO per component (WSL separate, Hermes separate, StackChan separate, etc.)
- Separate rollback plan per component
- Explicit human monitor per run

---

## Current Gate

```
Track A: push readiness check for a7cce7d
  → push GO
  → Level 2 final GO
  → Level 2 execution
  → Level 2 evidence
```

All other tracks: HOLD.

## Next Gate

After Track A Level 2 evidence is recorded and accepted:
- Begin Track B readiness review (app observation)
- Begin Track C planning

## STOP Gates

The following are hard STOP gates that apply to every track:

| Condition | Action |
|---|---|
| productionReady true requested | STOP → HOLD |
| execution enabled requested | STOP → HOLD |
| git push without separate GO | STOP → HOLD |
| external service required | STOP → HOLD |
| WSL/Hermes/wrapper required | STOP → HOLD |
| Electron dev-mode without separate GO | STOP → HOLD |
| StackChan/robot/voice/camera/mic | STOP → HOLD |
| secrets/raw/local-only values in output | STOP → HOLD → redact |
| scope expands beyond approved list | STOP → HOLD |
| human cannot monitor | STOP → HOLD |

## Human Approval Rules

1. Every execution requires a separate explicit human GO with exact command list
   and time window.
2. Git push always requires a separate explicit human approval per push.
3. productionReady true is never inferred from validation success.
4. External services, deploy, Cloudflare, WSL/Hermes/wrapper, Electron dev-mode,
   StackChan, robot, voice, camera, mic, secrets, raw values, and local-only values
   remain HOLD unless the specific goal explicitly scopes and receives separate
   human GO.
5. No track auto-escalates to the next track. Each gate requires independent GO.

## What Is Implemented Now

The current v3.0-v3.1.1 work has not primarily added new app features.

It has validated and documented the safety, validation, build/test/lint/typecheck,
evidence, and GO/HOLD process required before practical app observation.

Specifically:

- All five local validation commands pass (typecheck:node, typecheck:web, lint,
  test, build)
- Level 1 local dry-run evidence is recorded and pushed
- Level 2 scope proposal is created and pushed
- Level 2 GO wording review is created (local)
- Safety gate infrastructure, evidence records, and review docs are established
- Remote push is established at github.com/tkFX-0/hermes-desktop

The app baseline has passed local validation commands, but Electron dev-mode app
observation has not yet been approved or performed in this v3 track.

## What Is Not Implemented Yet

| Item | Status |
|---|---|
| Level 2 controlled validation | pending separate GO |
| Electron dev-mode observation | not approved in v3 track |
| Local app UI observation | HOLD — Track B |
| StackChan/robot/voice/camera | absolute HOLD — Track E |
| External services / Cloudflare | absolute HOLD — Track E |
| WSL / Hermes / wrapper | absolute HOLD — Track E |
| 5-agent practical integration | gated — Track D |
| productionReady true | absolute HOLD until G-18/G-19 |

## Roadmap Sequence

| Version | Event | Status |
|---|---|---|
| v3.0.0 | Level 1 local dry-run evidence recorded | DONE |
| v3.1.0 | Level 2 scope proposal prepared | DONE |
| v3.1.1 | Level 2 GO wording review prepared | DONE (local) |
| v3.1.2 | V3 goal roadmap and /goal definitions prepared | DONE (this doc) |
| v3.2.0 | Level 2 local controlled validation | pending separate GO |
| v3.2.1 | Level 2 evidence record | pending result |
| v3.3.0 | Post-Level 2 human acceptance package | pending Level 2 result |
| v3.4.0 | Local App Observation readiness proposal | pending Track B |
| v3.4.1 | Local App Observation GO wording review | pending Track B |
| v3.5.0 | Local App Observation execution | pending separate GO |
| v3.6.0 | Practical Local MVP operation rules | pending Track C |
| v3.7.0+ | 5-agent practical integration track | pending Track D |
| v4.0.0+ | External/device/voice/robot tracks | absolute HOLD — Track E |

These versions are planning targets only. They are not automatically approved.
Each version requires the preceding gate to be completed and accepted.

## Safety Boundary

- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false
- robotMotion: HOLD
- Level 2: not approved
- Level 3: not approved
- future_git_push: not approved
