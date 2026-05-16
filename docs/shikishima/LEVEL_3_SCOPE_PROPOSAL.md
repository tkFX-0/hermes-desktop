# Level 3 Scope Proposal

## Document Status

```text
roadmapVersion: v3.27.0
date: 2026-05-16
status: proposal_only — not Level 3 approval
```

---

## Important

This document is a scope proposal only.
No Level 3 execution is approved by this document.
Each option requires separate human GO before any execution.

---

## Option A — Recommended First Candidate

### Level 3-A: Read-Only Local App / Mobile Console Observation Continuation

**Scope:** Controlled, time-windowed local runtime observation.  
**Risk level:** LOW-MEDIUM  
**Dependency on B3:** Extends B3 directly.

### Allowed in future with separate scoped GO only

```text
- start runtime during an approved time window
- observe redacted status via Electron UI
- observe iPhone Private Console if required
- confirm port 3030 opens only during runtime
- confirm port 3030 closes after shutdown
- create evidence doc after run
```

### Forbidden in Level 3-A

```text
- execution enabled
- productionReady true
- secret display
- raw token display
- raw LAN IP in chat/docs/commit
- robot / StackChan motion
- voice / camera / mic
- external deployment
- Cloudflare
- dependency installation
- operation outside approved time window
- port remaining open after shutdown
```

### PASS Criteria for a Level 3-A run

All of the following must be true to count a run as PASS:

```text
1. runtime started only within the approved time window
2. port 3030 opened only during runtime
3. redacted status visible (decision/execution/productionReady/rawValuesReported)
4. productionReady = false confirmed
5. execution = disabled confirmed
6. no raw values visible
7. no secret / token / raw LAN IP in output
8. runtime shutdown completed
9. port 3030 closed after shutdown
10. evidence doc created
```

---

## Option B — Deferred

### Level 3-B: iPhone Same-LAN Console Stabilization

**Scope:** Repeat iPhone Phase 2C confirmation runs for reliability.  
**Status:** Deferred. Session-009 already confirmed. Repeat runs may be scheduled separately.  
**Dependency:** Requires ENABLED=true, pairing token flow, same-LAN.

No action required now.

---

## Option C — Deferred

### Level 3-C: Runtime Branch / Activation Commit Review

**Scope:** Review diff of runtime/phase2c-iphone-confirmation branch and 35f02c5.  
**Status:** Deferred. Not pushed. Diff review can proceed separately when needed.

Steps when approved:
1. `git diff main...runtime/phase2c-iphone-confirmation` (read-only)
2. human reviews diff
3. decide whether to merge, squash, or keep local-only

No merge or push without explicit GO.

---

## Option D — Deferred

### Level 3-D: Limited Local-Only Manual Runtime Validation

**Scope:** Single manual local run of Shikishima runtime, within approved conditions.  
**Status:** Deferred. Requires Level 3-A PASS first as prerequisite.

---

## Option E — Deferred

### Level 3-E: Approval Queue / Safe Action Preview Design

**Scope:** Design phase for approval queue and safe-action-preview UI.  
**Status:** Deferred. docs/design only. No execution.

---

## HOLD Items (no track covers these)

```text
StackChan / robot: HOLD until device arrives + separate physical safety plan
voice output: HOLD
camera / mic: HOLD
external deployment: HOLD
autonomous execution: HOLD
productionReady true: HOLD
```

---

## Safety Boundary at Proposal

```text
decision          : HOLD
execution         : disabled
productionReady   : false
rawValuesReported : false
Level 3           : not approved
port 3030         : closed
runtime branch    : local only, not pushed
activation commit : 35f02c5 local only, not in main
```

---

この範囲では問題を検出していません。
