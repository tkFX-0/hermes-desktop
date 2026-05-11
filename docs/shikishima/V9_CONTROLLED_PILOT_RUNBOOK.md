# Shikishima v9 Controlled Pilot Runbook — v2.6.0

## Purpose

Step-by-step runbook for executing a controlled pilot in v9.
This runbook must be read and confirmed BEFORE any pilot run.
Execution requires G-23 (per run). G-23 has NOT been issued.

- documentVersion: v2.6.0
- documentDate: 2026-05-12
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

**This runbook is planning-only. No pilot is executed here.**
**Each pilot run requires a new G-23.**

---

## Pilot Definition

A controlled pilot is:
- A **single** defined scenario run
- With a **human monitor** present throughout
- In a **local-only** environment
- Producing **redacted-only** output
- Terminated immediately on any STOP condition
- Subject to rollback at any time

It is NOT:
- Autonomous operation
- Repeated operation
- A GO for ongoing use
- Evidence of productionReady

---

## Pre-Pilot Checklist (required before each run)

**Environment**:
- [ ] All v3–v8 stages complete and reviewed
- [ ] No external network active
- [ ] No RunPod connected (unless G-13 issued)
- [ ] StackChan: display-only mode only (G-14 issued; G-22 NOT issued)
- [ ] No voice I/O (unless G-15 issued)
- [ ] productionReady = false (unchanged)

**Scenario**:
- [ ] Pilot scenario #[N] defined (name, input, expected output)
- [ ] Expected output format specified (redacted)
- [ ] Maximum duration specified
- [ ] Stop conditions listed
- [ ] Rollback procedure confirmed available

**Human monitor**:
- [ ] Human monitor is present and named
- [ ] Human monitor understands stop conditions
- [ ] Human monitor has control to stop at any time
- [ ] G-23 has been explicitly issued for this specific run

---

## Scenario Template

Fill before each pilot run:

```
=== PILOT SCENARIO ===
Scenario name: [name]
Run number: [N]
Date: [YYYY-MM-DD]
Human monitor: [name or alias]
Gate: G-23 issued: [yes / no — must be yes before starting]

Input:
  [describe input — no raw personal data]

Expected output:
  [describe expected response in redacted format]

Maximum duration: [N minutes]

Stop conditions:
  - [condition 1]
  - [condition 2]
  - [any unexpected output]

Rollback procedure:
  1. [step 1]
  2. [step 2]
  3. Terminate all processes
```

---

## Pilot Execution Steps

When G-23 is issued and all pre-flight checks pass:

**Step 1: Environment verify** (5 minutes)
- Confirm no external network
- Confirm all expected services running locally
- Confirm Hermes state (if applicable)
- Confirm StackChan display-only (if connected)

**Step 2: Start pilot** (human confirms "start")
- Launch defined scenario
- Start timer
- Human monitor watches actively

**Step 3: Monitor**
- Human watches for any stop condition
- Agent captures output (do NOT log raw values)
- Any anomaly → immediate STOP (Step 4)

**Step 4: Stop or complete**
- If scenario completes: terminate all processes; go to Step 5
- If stop condition triggered: terminate immediately; report P-level incident; go to Step 6

**Step 5: Post-run review** (success)
- Review output against expected (redacted format)
- Classify any deviations
- Document result (use V3_REDACTED_RESULT_REVIEW_TEMPLATE.md)
- Confirm rollback not needed

**Step 6: Incident response** (if stopped early)
- Use REAL_OPERATION_ROLLBACK_AND_INCIDENT_PLAN.md
- Report incident level
- Do NOT restart without new G-23

---

## Stop Conditions (always apply)

| Condition | Action |
|---|---|
| Raw value in output | STOP; redact; P0 incident |
| Unexpected external connection | STOP; disconnect; P0 |
| Device receives unexpected command | STOP; safe state; P0 |
| Human says "stop" | STOP immediately; no argument |
| Duration exceeded | STOP; report timeout |
| Output significantly different from expected | STOP; investigate; P1 |

---

## Post-Pilot Record

After each pilot run (regardless of outcome):

```
=== PILOT RESULT ===
Scenario: [name]
Run number: [N]
Date: [YYYY-MM-DD]
Duration: [N minutes]
Outcome: [completed / stopped-early]
Stop reason (if applicable): [category — no raw values]
Output match: [as-expected / deviation — describe category]
Raw values detected: [none / ALERT: redacted]
Rollback needed: [no / yes — describe]
Next action: [new G-23 / further review / HOLD]

Human monitor confirmation: [name / alias]
rawValuesReported: false
```

---

## One-Run Policy

Each run requires a NEW G-23. After a completed run:
- DO NOT start another run automatically
- Human reviews pilot result
- Human decides whether new G-23 is warranted
- New G-23 = new entry in GO Statement Archive

この範囲では問題を検出していません。
