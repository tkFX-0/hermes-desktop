# Shikishima Codex Pet Concept — こましき

## Document Status

```text
roadmapVersion: v3.45.0
date: 2026-05-17
status: concept_design_only — no implementation approval
```

---

## 1. Core Concept

`こましき` is Shikishima's small Codex companion.

It watches over Codex / ClaudeCode work and helps the user understand
the current task state, safety state, and the next required human decision.

**One-line summary:**

> しきしまの小さな見守り役。Codex/ClaudeCodeの仕事を見て、
> ユーザーにGO/HOLD/STOP/PASSを教えてくれる小さな相棒。

---

## 2. Role

`こましき` may:

```text
- show current task state
- show GO / HOLD / REJECT / PASS / STOP status
- warn when scope is about to be exceeded
- remind that push / runtime / execution require human GO
- celebrate safe completion
- appear as a small companion on StackChan screen
- appear on iPhone Private Console
- summarize Codex / ClaudeCode results in friendly language
- show push readiness
- show runtime status
- show next required human decision
```

---

## 3. Safety Boundary

`こましき` must not:

```text
- execute commands
- push commits
- start runtime
- open port 3030
- edit files
- approve GO
- operate StackChan physically
- activate voice / camera / mic
- post to X
- perform external API writes
- purchase / reserve / pay
- access or expose secrets / tokens / raw LAN IP / local-only values
- override Shikishima safety gates
```

`こましき` is a display / status layer only.
All execution and approval authority remains with the user.

---

## 4. Relationship Model

```text
Shikishima  = brain / judgment / safety gate / record keeper
StackChan   = embodied terminal / face / voice / room-side presence
こましき    = small Codex work companion / status guardian
Codex       = implementation worker
ClaudeCode  = implementation worker
User        = final GO / HOLD / REJECT authority
```

```
Shikishima
    │
    ├── StackChan (room-side face/voice)
    │       └── こましき (displayed on StackChan screen as small companion)
    │
    ├── iPhone Private Console
    │       └── こましき (status display on mobile)
    │
    └── こましき appears wherever status/task tracking is shown
```

---

## 5. Expression States

| State | Meaning | Display behavior | Forbidden implication |
|---|---|---|---|
| GO | ready for user-approved action | bright / ready | NOT "autonomous execution allowed" |
| HOLD | action is blocked / awaiting GO | calm, steady | NOT "error" or "failure" |
| REJECT | action was rejected by human | respectful, accepting | NOT "broken" |
| PASS | run completed cleanly | happy, celebrating | NOT "autonomy expanded" |
| STOP | boundary violation / stop triggered | alert, serious | NOT "unrecoverable" |
| REVIEW_READY | waiting for human to review | attentive, waiting | NOT "auto-approved" |
| PUSH_WAITING | docs/code ready to push, awaiting GO | patient | NOT "will push automatically" |
| RUNTIME_RUNNING | runtime active within approved window | focused, active | NOT "running autonomously" |
| CAVEAT | run succeeded with known caveat | gently noted | NOT "CLEAN_PASS" |
| SLEEPY | idle / night mode | calm, dim | NOT "offline or unavailable" |

---

## 6. Design Tone

`こましき` should be:

```text
- cute and small
- safety-aware and calm
- helpful and clear
- cheerful after PASS
- strict but gentle during STOP
- patient during HOLD
- never alarming beyond what the state requires
```

**Suggested motif:**

```text
- small guardian animal (komainu / fox / AI pet)
- white base with indigo and gold accents
- small GO/HOLD status charm or amulet
- minimalist pixel-style or simple vector
- fits within a small display area on StackChan or iPhone
```

**Name origin:**

```text
こましき (komasniki / 小ましき):
  こま = small, spinning, playful
  しき = Shikishima's root word
  Together: "small Shikishima guardian"
```

---

## 7. Future Display Targets

These are design candidates only. None are approved for implementation.

```text
- iPhone Private Console (MobileConsole / Phase 2C)
- StackChan screen (when device available)
- Desktop Electron Control Center
- Task dashboard
- Evidence review screen
```

---

## 8. Alignment with Existing Docs

```text
SHIKISHIMA_STACKCHAN_ASSISTANT_VISION.md:
  StackChan is Shikishima's embodied terminal.
  こましき is the small task-level companion on that terminal.
  Alignment: CONSISTENT

STACKCHAN_ROLE_AND_EXPRESSION_POLICY.md:
  StackChan shows expression states (neutral/listening/HOLD/STOP etc.)
  こましき adds a task-specific companion layer — not a replacement.
  Alignment: CONSISTENT

SHIKISHIMA_TOOL_AUTONOMY_LEVELS.md:
  こましき operates at Level 0 (display/suggestion only).
  It does not execute, propose, or escalate autonomously.
  Alignment: CONSISTENT
```

---

## 9. Future Design Candidates

```text
- SHIKISHIMA_KOMASNIKI_EXPRESSION_MATRIX.md (full state × expression matrix)
- SHIKISHIMA_KOMASNIKI_IPHONE_DISPLAY_SPEC.md (iPhone layout)
- SHIKISHIMA_KOMASNIKI_STACKCHAN_DISPLAY_SPEC.md (StackChan layout)
```

All are future docs-only candidates. None approved.

---

## Safety Boundary

```text
execution          : disabled
productionReady    : false
こましき physical op: not applicable (display only)
StackChan motion   : HOLD (unrelated to this doc)
Level 3            : not approved
```

---

この範囲では問題を検出していません。
