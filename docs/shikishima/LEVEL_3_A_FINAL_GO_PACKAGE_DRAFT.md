# Level 3-A Final GO Package Draft

## Document Status

```text
roadmapVersion: v3.41.0
date: 2026-05-17
status: filled_draft — not execution / requires separate final human GO after review
```

---

## CRITICAL NOTICE

**This filled GO package draft does not execute Level 3-A by itself.**  
**Execution requires a separate final human GO after review.**

This does NOT approve:

```text
- productionReady true
- execution enabled
- autonomous operation
- Level 3-B / 3-C / 3-D / 3-E
- runtime branch push
- activation commit 35f02c5 merge
- robot / voice / camera / mic
- external deployment / Cloudflare
- X posting
- reservation / payment / purchase
- any action outside the approved scope below
```

---

## Scope

```text
scope: B — Phase 2C iPhone same-LAN observation
observation_type: read-only redacted status only
```

---

## Design Package Reference

Human should confirm all have been read before issuing final GO:

```text
[x] LEVEL_3_PLANNING_GATE_DEFINITION.md
[x] LEVEL_3_PRECONDITIONS_AUDIT.md
[x] LEVEL_3_SCOPE_PROPOSAL.md
[x] LEVEL_3_A_GO_WORDING_DRAFT.md
[x] LEVEL_3_A_CONTROLLED_OBSERVATION_RUNBOOK.md
[x] LEVEL_3_A_STOP_ROLLBACK_CHECKLIST.md
[x] LEVEL_3_A_IPHONE_SAME_LAN_PROTOCOL.md
[x] LEVEL_3_A_OBSERVATION_EVIDENCE_TEMPLATE.md
[x] LEVEL_3_A_HUMAN_ACCEPTANCE_REVIEW_TEMPLATE.md
```

---

## Filled GO Package

```text
I approve Level 3-A controlled observation only for the approved
time window and exact command below.

approved_time_window:
  date:             2026-05-17
  start:            00:15 JST
  end:              00:45 JST
  duration:         30 minutes

exact_command (Scope B — Phase 2C iPhone same-LAN):
  Source: Task 22 Candidate B reviewed command
  
  This is a multi-step procedure:
  
  Step 1 (src change — local only):
    Edit src/main/mobile-console/mobile-console-phase2c.ts
    Change: MOBILE_CONSOLE_PHASE_2C_ENABLED = false as const
    To:     MOBILE_CONSOLE_PHASE_2C_ENABLED = true as const
  
  Step 2 (verify):
    npm run typecheck:node  → must be 0 errors
    npm run typecheck:web   → must be 0 errors
  
  Step 3 (local commit — NOT pushed to main):
    git commit -m "chore: enable phase 2c runtime [LOCAL-ONLY / NOT FOR MAIN PUSH]"
    Note: This commit stays local. Do not push to main without separate GO.
  
  Step 4 (launch):
    npm run dev
    (Scope B reviewed command per Task 22)

expected_port_behavior:
  during_runtime:   listening on LAN IP port 3030 (Phase 2C server active)
  after_shutdown:   closed (verified before session closes)

iPhone_confirmation_required: yes

evidence_file:
  docs/shikishima/LEVEL_3_A_OBSERVATION_EVIDENCE_2026-05-17-001.md

STOP_conditions_confirmed: yes
rollback_plan_confirmed:   yes

human_GO_phrase:
  I approve Level 3-A controlled observation only for the
  approved time window and exact command above.
```

---

## Pre-GO Checklist (human confirms before sending final GO)

```text
[ ] All 9 design docs reviewed (list above)
[ ] date = 2026-05-17 confirmed
[ ] start = 00:15 JST confirmed
[ ] end = 00:45 JST confirmed
[ ] exact command steps reviewed (4 steps above)
[ ] ENABLED=true change is local-only, NOT pushed to main
[ ] typecheck:node and typecheck:web will be run before launch
[ ] port 3030 expected to open on LAN IP during runtime
[ ] iPhone_confirmation_required = yes understood
[ ] evidence_file path confirmed
[ ] STOP_conditions reviewed (LEVEL_3_A_STOP_ROLLBACK_CHECKLIST.md)
[ ] rollback plan reviewed (LEVEL_3_A_STOP_ROLLBACK_CHECKLIST.md)
[ ] repo is clean (staged=0, dirty=0) before starting
[ ] port 3030 confirmed not listening before start
[ ] Level 3 not currently approved
[ ] productionReady: false
[ ] execution: disabled
```

---

## Rollback After Session

After the approved window ends:

```text
1. Close Electron app (shutdown runtime)
2. Confirm port 3030 closed
3. Revert ENABLED=true change:
   Either: git revert the local commit
   Or: edit src back to ENABLED = false as const
4. Run typecheck to confirm no regression
5. Confirm repo is clean
6. Do NOT push ENABLED=true commit to main
```

---

## What This Session Counts As (if PASS)

```text
- Level 3-A Scope B controlled observation run
- iPhone same-LAN read-only confirmation
- Separate from B3 — this is Level 3 territory
- Requires Level 3-A Human Acceptance Review after
- Does NOT count toward B3 (B3 is already 5/5 ACCEPTED)
```

---

## Safety Boundary at Draft

```text
decision          : HOLD
execution         : disabled (enabled only within approved window if GO is issued)
productionReady   : false
rawValuesReported : false
Level 3           : not approved (this draft requires separate final GO)
port 3030         : closed (opens only during approved runtime)
ENABLED=true commit: local only, not pushed to main
activation commit : 35f02c5 local only, not in main
```

---

この範囲では問題を検出していません。
