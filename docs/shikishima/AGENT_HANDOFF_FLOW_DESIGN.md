# Agent Handoff Flow Design

## Document Status

```
date:            2026-05-18
status:          docs-only handoff flow design
```

---

## Core Handoff Flow

The main Control Room operational loop:

```
Step 1:  User sends message / instruction
         └── しきしま listens and classifies

Step 2:  しきしま delegates to はじめ
         └── はじめ creates task plan

Step 3:  はじめ submits plan to しずめ for safety check
         └── しずめ reviews plan against safety invariants

Step 4a: [PASS] しずめ approves → task card passes to つむぎ
Step 4b: [HOLD] しずめ blocks → task returns to はじめ for revision
Step 4c: [STOP] しずめ raises STOP → all agents freeze, しきしま notifies human

Step 5:  つむぎ prepares implementation / draft / test
         └── can be: code, doc, commit, draft text, evidence

Step 6:  つむぎ submits to しずめ for re-check
         └── しずめ verifies output (redaction check, safety boundary)

Step 7:  しずめ approves → しるべ receives output for recording
         └── しるべ writes evidence doc, logs result

Step 8:  しるべ returns complete record to しきしま
         └── しきしま waits for next human GO

Human GO required:
  - After Step 8 before pushing commits
  - Before any runtime start
  - Before any OAuth / external action
  - For any scoped implementation task
```

---

## Flow Diagram (text)

```
User
  │
  ▼
しきしま [listen/classify]
  │ delegate
  ▼
はじめ [plan/decompose]
  │ submit
  ▼
しずめ [safety check]
  ├── HOLD ──► はじめ [revise]
  ├── STOP ──► ALL AGENTS FREEZE ──► Human notified
  └── PASS
        │
        ▼
     つむぎ [implement/draft/test]
        │ submit for review
        ▼
     しずめ [re-check]
        ├── HOLD ──► つむぎ [revise]
        └── PASS
              │
              ▼
           しるべ [record/evidence]
              │ return
              ▼
           しきしま [await human GO]
              │ ← human GO
              ▼
           next cycle or push
```

---

## Handoff Artifacts

| From | To | Artifact | Contains |
|---|---|---|---|
| しきしま | はじめ | instruction card | task description, scope |
| はじめ | しずめ | plan card | task steps, files, risk level |
| しずめ | つむぎ | approved plan | confirmed safe scope |
| はじめ | つむぎ | (via しずめ) | same as above |
| つむぎ | しずめ | review card | output summary, changed files |
| しずめ | しるべ | approval record | safety confirmation |
| つむぎ | しるべ | completion report | changed files, test results |
| しるべ | しきしま | evidence card | evidence doc hash, summary |

---

## STOP Trigger Behavior

When STOP is triggered (at any step):

```
1. All agent animations → freeze pose
2. STOP badge appears on all active agents
3. しずめ holds STOP sign (center stage)
4. しきしま shows sad face + STOP banner
5. Next required human action card appears prominently
6. No new handoff arrows shown
7. Human must review reason → provide STOP release GO
```

---

## HOLD Behavior

When HOLD is triggered:

```
1. Blocked agent(s) show amber HOLD badge
2. しずめ holds HOLD sign
3. しきしま shows waiting_human_go pose
4. Flow arrow pauses at the blocked step (greyed out)
5. Human sees: "HOLD — review required before continuing"
6. Flow resumes only after human GO
```

---

## Safety Rules for Flow Display

```
- Never animate an agent "executing" or "pushing" without human GO shown
- Never animate handoff past しずめ without a check pause visual
- The "awaiting human GO" state must always be the visual resting state
- Any commit or push action must be preceded by a visible GO badge
- "push" word must never appear without a HOLD or GO-required indicator nearby
```

---

## Visual Handoff Arrow Design

Arrows between agent cards:

```
- Active handoff: solid colored arrow with card_slide animation
- Completed step: faded green arrow
- Blocked step: greyed-out dashed arrow with HOLD/STOP badge
- Waiting step: pulsing amber arrow
```

---

_Created: 2026-05-18_
_productionReady: false_
_execution: disabled_
