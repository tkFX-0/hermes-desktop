# Shikishima Production Ready Definition — v2.2.0

## Purpose

Defines exactly what `productionReady: true` means, why it is currently false,
and the sole path to setting it true. This document is reference-only.

- documentVersion: v2.2.0
- documentDate: 2026-05-12
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

---

## Current State

```text
productionReady: false
```

This value has been false since the project began and remains false through v2.x and all of v3.x–v9.x planning.

---

## What productionReady: true Means

Setting `productionReady: true` would mean:

1. The application is safe for continuous, unsupervised operation
2. All subsystems (Hermes, WSL, IPC, face terminal, audio, device control) have been fully validated
3. All safety invariants have been verified across all operating conditions
4. Human-in-the-loop requirements have been defined and confirmed
5. Emergency stop and rollback procedures are in place and tested
6. All raw-value / secret / local-path protections are verified
7. Device integration (StackChan, voice, camera) has passed hardware safety review
8. Explicit final human approval has been issued

---

## Why productionReady Is Currently False

| Reason | Detail |
|---|---|
| Tests not committed | tests/ichikishima + tests/hermes not yet committed |
| Validation not run | typecheck/build/eslint/vitest not yet executed |
| Hermes not validated | WSL/Hermes execution not tested |
| Device integration not planned | StackChan/voice/camera not reviewed |
| Pilot not executed | controlled pilot not defined or run |
| Safety audit not complete | final v10 safety audit not performed |
| G-18 not issued | final human approval not issued |

---

## Conditions That Do NOT Set productionReady = true

The following actions do NOT and CANNOT set productionReady to true:

| Action | Result |
|---|---|
| Updating this document | does not change productionReady |
| Completing any docs task | does not change productionReady |
| Completing all v3-v9 stages | still requires explicit G-18 |
| Agent declaring readiness | FORBIDDEN — agent cannot self-approve |
| Automated CI passing | does not change productionReady |
| Passing all tests | does not change productionReady alone |
| Any roadmap version bump | does not change productionReady |

---

## Path to productionReady = true

```
v3 complete + human GO
  ↓
v4 complete + human GO
  ↓
v5 complete + human GO
  ↓
v6 complete + human GO
  ↓
v7 complete + human GO
  ↓
v8 complete + human GO
  ↓
v9 complete + human GO
  ↓
v10 final review
  ↓
G-18: "FINAL GO G-18: Approve productionReady = true. All preconditions confirmed."
  ↓
productionReady: true  ← ONLY HERE
```

---

## productionReady = true: Final Checklist

This checklist must be complete before G-18 can be issued.
Only a human can confirm and issue G-18.

**System Validation:**
- [ ] typecheck:node PASS
- [ ] typecheck:web PASS
- [ ] eslint PASS
- [ ] vitest PASS (full suite)
- [ ] build PASS

**Runtime Validation:**
- [ ] Electron app stable under normal use
- [ ] IPC bridge stable (read-only confirmed)
- [ ] Hermes local execution validated
- [ ] WSL integration stable
- [ ] Research screen iframe stable

**Device Integration:**
- [ ] Face terminal display validated
- [ ] StackChan hardware safety review complete
- [ ] Voice I/O safety review complete (if applicable)
- [ ] robotMotion safety review complete (if applicable)

**Safety:**
- [ ] No raw values in any output path
- [ ] No local paths in committed code
- [ ] No secrets in committed code
- [ ] Redaction policy verified in all output channels
- [ ] Emergency stop procedure defined and tested

**Human Approval:**
- [ ] v10 safety audit PASS
- [ ] Security review PASS
- [ ] G-18 issued: "FINAL GO G-18: Approve productionReady = true."
- [ ] G-19 issued: "FINAL GO G-19: Approve execution = enabled."

---

## productionReady = false: Maintenance Conditions

productionReady remains false if ANY of the following:

- Any HOLD gate from G-01 to G-19 unsatisfied
- Any subsystem not yet validated
- Safety audit incomplete
- G-18 not issued
- Agent self-asserts readiness (never valid)

この範囲では問題を検出していません。
