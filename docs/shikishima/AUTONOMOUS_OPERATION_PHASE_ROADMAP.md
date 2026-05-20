# Autonomous Operation Phase Roadmap

**date:** 2026-05-21
**status:** PLANNING — no phase is approved for execution yet
**productionReady:** false / **execution:** disabled

---

## Phase 0 — Current Stabilization ✓ COMPLETE

**Goal:** Ensure current pushed state is clean and all completed gates are recorded.

**Exit criteria:**
- HEAD == origin/main ✓
- typecheck node/web PASS ✓
- completed Level 5 gates reflected in FINAL_100 ✓
- no dirty source ✓
- productionReady false ✓
- execution disabled ✓

**Status:** COMPLETE as of 2026-05-21

---

## Phase 1 — Controlled Level 5 One-Shot Completion

**Goal:** Complete remaining one-shot gates without recurrence.

**Required:**
```text
□ XS-AUTO-03 one-shot scheduled read-only search (xs_auto_read_go)
□ CC-03 one-shot Command Chat send (cc03_real_send_go)
□ HB-01 controlled Hermes/WSL connection (hb01_hermes_wsl_go)
□ XACC-01 decision: GO or DEFER (xacc01_read_only_auth_go or explicit DEFER)
```

**Exit criteria:**
- All 4 items above completed or explicitly deferred
- All gates restored to HOLD after each action
- Evidence docs committed
- productionReady false
- execution disabled

**Current status:** 0/4 complete

---

## Phase 2 — Repeatable Human-Gated Operation

**Goal:** Turn one-shot gates into repeatable human-GO workflows.

**Required:**
```text
□ Per-gate GO templates (DIS/OB/XS/CC/HB) — all ready-to-fill
□ Per-gate evidence templates — standard format
□ Auto-close pattern enforced after each run
□ No retry loop
□ Cooldown state between runs
□ User-visible status in AgentTheaterPage panels
```

**Exit criteria:**
- Each gate has tested GO → execute → evidence → HOLD cycle
- No gate left open after use
- Push readiness review passes every time

**Current status:** Partially done (DIS/OB one-shot cycles proven)

---

## Phase 3 — Limited Recurring Read-only Automation

**Goal:** Allow read-only recurring tasks only.

**Required:**
```text
□ XS-AUTO recurring read-only patrol (xs_auto_schedule_go)
□ Discord read-only periodic intake (dis01 recurring GO)
□ Obsidian periodic evidence archive (ob recurring GO)
□ No write automation in any recurring path
□ Rate limit / cooldown enforced
□ Evidence per run
```

**Exit criteria:**
- Recurring path proven safe through multiple cycles
- Write actions remain HOLD
- No external service escalation

**Current status:** NOT STARTED

---

## Phase 4 — Limited External Write Automation

**Goal:** Allow only tightly templated external write actions.

**Required:**
```text
□ Discord limited auto-reply templates (whitelist only)
□ Command Chat limited send templates (whitelist only)
□ One-channel / one-target restrictions enforced
□ Send-count cap enforced (max 1 per session default)
□ Kill switch implemented and tested
□ Incident rollback procedure documented
```

**Exit criteria:**
- Template-only writes proven through human-supervised cycles
- Kill switch tested
- No open-ended write automation

**Current status:** NOT STARTED

---

## Phase 5 — productionReady true Candidate

**Goal:** System can be considered productionReady candidate.

**Required:**
```text
□ BLOCKER-005 human review session completed
□ LMO (Limited Manual Operation) period completed
□ Incident response drill conducted
□ Rollback drill conducted
□ All critical gates documented and evidenced
□ productionReady_go form filled and reviewed by tk
```

**Exit criteria:**
- tk issues productionReady_go
- No active critical blockers
- All evidence committed

**Current status:** NOT STARTED

---

## Phase 6 — execution enabled Candidate

**Goal:** Enable limited execution only after productionReady true.

**Required:**
```text
□ productionReady: true (Phase 5 complete)
□ Execution scope whitelist defined
□ Kill switch tested end-to-end
□ Process supervision in place
□ Monitoring and logging active
□ Evidence logs per execution
□ No uncontrolled external write
□ execution_enabled_go form filled and issued by tk
```

**Exit criteria:**
- tk issues execution_enabled_go
- Scope is strictly bounded
- Kill switch verified

**Current status:** NOT STARTED

---

## Phase Summary

| Phase | Name | Status | Completion |
|---|---|---|---|
| 0 | Current Stabilization | COMPLETE | 100% |
| 1 | Controlled Level 5 One-Shot | IN PROGRESS | ~25% |
| 2 | Repeatable Human-Gated Operation | PARTIAL | ~30% |
| 3 | Limited Recurring Read-only | NOT STARTED | 0% |
| 4 | Limited External Write Automation | NOT STARTED | 0% |
| 5 | productionReady Candidate | NOT STARTED | 0% |
| 6 | execution enabled Candidate | NOT STARTED | 0% |
