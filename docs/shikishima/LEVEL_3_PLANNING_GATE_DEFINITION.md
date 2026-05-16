# Level 3 Planning Gate Definition

## Document Status

```text
roadmapVersion: v3.25.0
date: 2026-05-16
status: planning_gate_definition — not Level 3 approval
```

---

## 1. Purpose

Level 3 is a planning gate for moving from B3 read-only observation
toward controlled local operation.

This document defines what Level 3 is, what it is not, and what is
required before any Level 3 execution can be approved.

Completing this document is not Level 3 approval.
Reading this document is not Level 3 approval.
Committing this document is not Level 3 approval.

---

## 2. What Level 3 Is

A controlled, time-windowed, locally-scoped operation gate.

Level 3 permits only what is explicitly approved per run:
- a specific command
- a specific time window
- a specific evidence format
- a specific shutdown procedure
- a specific rollback plan

Nothing else is permitted by default.

---

## 3. What Level 3 Is NOT

```text
NOT productionReady
NOT autonomous execution
NOT external deployment
NOT robot operation
NOT voice / camera / mic operation
NOT unrestricted local file operation
NOT Cloudflare / external network integration
NOT approval to push runtime branch
NOT approval to include activation commit 35f02c5 in main
NOT approval to enable execution globally
NOT approval to set productionReady true
NOT approval for StackChan physical motion
NOT approval for any operation outside the approved scope
```

---

## 4. Candidate Level 3 Tracks

These are proposals only. None are approved by this document.

| Track | Description | Status |
|---|---|---|
| Level 3-A | Read-only local app observation continuation | proposal |
| Level 3-B | iPhone same-LAN read-only console stabilization | proposal |
| Level 3-C | Runtime branch / activation commit review | deferred |
| Level 3-D | Limited local-only manual runtime validation | deferred |
| Level 3-E | Approval queue / safe action preview design | deferred |

**Level 3-A is the recommended first candidate.**
It is the narrowest scope and most directly extends the B3 observation record.

---

## 5. Always-Forbidden Until Separate Explicit GO

These actions remain forbidden across all Level 3 tracks
until each receives its own separate human GO:

```text
- autonomous execution
- productionReady true
- execution enabled globally
- secret exposure
- raw token reporting
- raw LAN IP reporting in chat/docs/commit
- StackChan physical motion
- voice output
- camera / mic usage
- external writes
- Cloudflare deployment
- dependency installation
- npm / npx transient execution
- runtime branch push without review
- activation commit 35f02c5 in main without review
```

---

## 6. Required Human Decisions Before Any Level 3 Execution

A human must explicitly provide all of the following before any
Level 3 execution can proceed:

```text
1. approve Level 3 scope (which track, what exactly)
2. approve exact command
3. approve time window (start time, end time, timezone)
4. approve rollback condition
5. approve STOP condition
6. approve evidence format
7. approve shutdown procedure
```

No partial approval is valid.
If any item is missing, the run must not start.

---

## 7. STOP Conditions

STOP immediately and return to HOLD if any of the following occurs:

```text
- src / tests / package changes appear unexpectedly
- runtime starts outside an approved time window
- port 3030 opens unexpectedly
- token or raw local value appears in any output
- raw LAN IP appears in chat, docs, or commit
- productionReady becomes true
- execution becomes enabled
- Level 3 wording implies approval it was not granted
- activation commit 35f02c5 enters main without explicit review
- runtime branch is pushed without explicit review
- shutdown fails or port remains open after shutdown
- evidence doc is not created after a run
```

---

## 8. Safety Boundary at Gate Definition

```text
decision          : HOLD
execution         : disabled
productionReady   : false
rawValuesReported : false
robotMotion       : HOLD
Level 3           : not approved (this document is planning only)
port 3030         : closed
runtime branch    : local only, not pushed
activation commit : 35f02c5 local only, not in main
B3 loop           : COMPLETE
```

---

この範囲では問題を検出していません。
