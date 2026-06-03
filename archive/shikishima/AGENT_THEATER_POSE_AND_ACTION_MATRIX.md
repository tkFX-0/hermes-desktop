# Agent Theater Pose and Action Matrix

## Document Status

```
date:            2026-05-18
status:          docs-only pose design
animation:       CSS-only (AT-05); sprite sheet (AT-03+)
```

---

## Pose States (8 per agent)

Each agent has 8 named pose states. Each state maps to:
- a visual action description
- a UI state label
- the UI meaning for the human observer
- what NOT to imply
- a recommended CSS animation type

---

## Animation Type Reference

```
float:           gentle vertical oscillation (idle)
blink:           eye blink loop (idle/waiting)
flag_wiggle:     flag waves left-right (working/active)
card_slide:      card extends forward (handoff)
small_bounce:    single gentle bounce (pass/complete)
hold_sign_raise: sign lifts into view (HOLD/STOP)
write_loop:      pen moves in small circle (recording)
keyboard_tap:    keyboard bobs slightly (typing)
freeze:          no movement, alarmed expression (STOP/blocked)
```

---

## しきしま Pose Matrix

| Pose | Visual Action | State Label | UI Meaning | Do NOT Imply | Animation |
|---|---|---|---|---|---|
| idle | floating, headset on, calm | WAITING | system is calm, waiting | autonomous decision | float + blink |
| thinking | head tilted, eyes up-left | CLASSIFYING | processing user request | executing code | blink |
| working | slight forward lean, listening | ROUTING | routing to appropriate agent | executing external action | flag_wiggle |
| handoff_send | points toward はじめ | DELEGATING | passing task to planner | autonomous delegation | card_slide |
| handoff_receive | turns toward しるべ, receives card | RECEIVING | receiving completed record | auto-approval | card_slide |
| waiting_human_go | holds GO? flag, patient | AWAITING_HUMAN_GO | human decision required | auto-proceed | float + flag_wiggle |
| pass | small nod, blue card shown | PASS | task completed, gate passed | auto-execute | small_bounce |
| hold_stop_blocked | sad face, HOLD badge | HOLD | system held, human review needed | system failure | freeze |

---

## しずめ Pose Matrix

| Pose | Visual Action | State Label | UI Meaning | Do NOT Imply | Animation |
|---|---|---|---|---|---|
| idle | standing firm, baton resting | MONITORING | safety gate active | blocking user | float |
| thinking | reads checklist closely | REVIEWING | checking safety conditions | delaying arbitrarily | blink |
| working | examines task card | CHECKING | verifying safety invariants | automated gating | flag_wiggle |
| handoff_send | nods, PASS card extended | APPROVED | safety check passed | unconditional approval | card_slide |
| handoff_receive | receives card from つむぎ | RECEIVING | receiving review request | auto-approve | card_slide |
| waiting_human_go | holds HOLD sign, waiting | AWAITING_HUMAN | human must review | ignoring human | hold_sign_raise |
| pass | lowers sign, small nod | PASS | safe to proceed | auto-execute | small_bounce |
| hold_stop_blocked | raises STOP sign, arms crossed | HOLD/STOP | action blocked for safety | system crash | hold_sign_raise + freeze |

---

## はじめ Pose Matrix

| Pose | Visual Action | State Label | UI Meaning | Do NOT Imply | Animation |
|---|---|---|---|---|---|
| idle | floating, map tucked | IDLE | no current task | inactive permanently | float + blink |
| thinking | spreads map, studying | PLANNING | designing task breakdown | autonomous execution | blink |
| working | arranges task cards | DECOMPOSING | breaking task into steps | starting without GO | flag_wiggle |
| handoff_send | extends memo toward つむぎ | SENDING_TASK | passing plan to dev | auto-dispatch | card_slide |
| handoff_receive | turns toward しきしま, listening | RECEIVING | receiving instruction | independent decision | card_slide |
| waiting_human_go | map closed, patient | WAITING | awaiting human to confirm plan | autonomous planning loop | float |
| pass | small checkmark gesture | PLAN_COMPLETE | plan ready for safety check | plan auto-executed | small_bounce |
| hold_stop_blocked | map closed, question mark | BLOCKED | task unclear or blocked | error/failure | freeze |

---

## つむぎ Pose Matrix

| Pose | Visual Action | State Label | UI Meaning | Do NOT Imply | Animation |
|---|---|---|---|---|---|
| idle | helmet on, keyboard in lap | READY | standing by for task | doing nothing permanently | float + blink |
| thinking | stares at keyboard, head tilt | ANALYZING | reading task requirements | autonomous analysis | blink |
| working | keyboard tap loop | IMPLEMENTING | writing code or docs | executing without GO | keyboard_tap |
| handoff_send | extends PASS card toward しずめ | REVIEW_READY | work ready for safety review | auto-merge | card_slide |
| handoff_receive | receives memo from はじめ | RECEIVING | getting task plan | auto-start | card_slide |
| waiting_human_go | keyboard still, waiting | AWAITING_GO | waiting for scoped GO | stalled indefinitely | float |
| pass | sparkle or small OK gesture | COMPLETE | implementation done | auto-push | small_bounce |
| hold_stop_blocked | frozen mid-type, alarmed | STOPPED | emergency STOP triggered | crash | freeze |

---

## しるべ Pose Matrix

| Pose | Visual Action | State Label | UI Meaning | Do NOT Imply | Animation |
|---|---|---|---|---|---|
| idle | headphones on, logbook closed | MONITORING | passive observation | not paying attention | float + blink |
| thinking | reads logbook quietly | REVIEWING | cross-checking evidence | auditing autonomously | blink |
| working | pen moving in logbook | RECORDING | writing evidence doc | fabricating records | write_loop |
| handoff_send | extends recorded card toward しきしま | EVIDENCE_READY | evidence recorded, returned | auto-approval | card_slide |
| handoff_receive | reaches out to つむぎ | RECEIVING | getting completion report | auto-merge records | card_slide |
| waiting_human_go | logbook closed, waiting | AWAITING_PUSH_GO | waiting for push GO | auto-push | float |
| pass | places paper in archive box | ARCHIVED | evidence committed | auto-complete | small_bounce |
| hold_stop_blocked | logbook closed, pen down | HOLD | recording paused, issue detected | data corruption | freeze |

---

## State → Agent Mapping

| System State | しきしま | しずめ | はじめ | つむぎ | しるべ |
|---|---|---|---|---|---|
| idle (no task) | idle | idle | idle | idle | idle |
| user request received | working | idle | idle | idle | idle |
| task planning | handoff_send | thinking | working | idle | idle |
| safety check | handoff_receive | working | waiting | idle | idle |
| implementation | pass | idle | pass | working | idle |
| review | waiting | handoff_receive | idle | handoff_send | idle |
| evidence recording | handoff_receive | pass | idle | pass | working |
| awaiting human GO | waiting_human_go | waiting | waiting | waiting | waiting |
| HOLD | hold_stop_blocked | hold_stop_blocked | hold_stop_blocked | hold_stop_blocked | hold_stop_blocked |
| STOP | hold_stop_blocked | hold_stop_blocked | hold_stop_blocked | hold_stop_blocked | hold_stop_blocked |

---

_Created: 2026-05-18_
_productionReady: false_
_execution: disabled_
