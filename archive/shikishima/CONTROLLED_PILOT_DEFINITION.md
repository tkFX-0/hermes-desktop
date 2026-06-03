# Shikishima Controlled Pilot Definition — v2.2.0

## Purpose

Defines what "controlled pilot" means in the Shikishima context, how it differs
from real operation, and the conditions under which a controlled pilot may occur.
This document is planning-only. Pilot execution requires separate scoped GO.

- documentVersion: v2.2.0
- documentDate: 2026-05-12
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

---

## What Is a Controlled Pilot

A controlled pilot is:

- A **single, scoped, human-supervised** execution of a defined scenario
- Conducted in a **local-only environment** with no external connections unless explicitly approved
- Subject to **immediate human stop** at any point
- Producing **redacted-only output** — no raw values, local paths, or secrets reported
- Defined **before execution** — scenario, scope, stop conditions, and rollback all specified in advance
- **Not repeated automatically** — each run requires a new GO

A controlled pilot is NOT:

- Autonomous or self-repeating operation
- Production operation
- A GO for ongoing use
- Evidence that productionReady = true
- Permission for any subsequent execution without new GO

---

## Controlled Pilot vs Real Operation

| Dimension | Controlled Pilot | Real Operation |
|---|---|---|
| Supervision | Human in-loop at all times | May be autonomous |
| Scope | Single defined scenario | Full operation |
| Duration | One run only | Continuous |
| Stop condition | Immediate stop on any anomaly | Graceful degradation |
| productionReady | false | true |
| GO required | Yes — per run | Yes — G-18/G-19 |
| Raw output | NEVER | Redacted or controlled |
| Device control | Display-only unless separately approved | As designed |
| Rollback | Immediately available | Full incident plan |

---

## Controlled Pilot Preconditions

Before any controlled pilot run:

1. All v9 stage tasks complete
2. Pilot runbook written (scenario, expected output, stop conditions)
3. Rollback procedure confirmed available
4. Human confirmed present and monitoring
5. Environment: local-only (no external network unless explicitly scoped)
6. Explicit scoped GO issued for this specific pilot run
7. Output redaction policy confirmed active

---

## Pilot Scenario Definition (required before each pilot)

A pilot scenario must include:

| Field | Required |
|---|---|
| Scenario name | Yes |
| Input data | Specified (no raw personal data) |
| Expected output | Specified (redacted format) |
| Maximum duration | Specified |
| Stop conditions | Specified (list of anomalies that trigger immediate stop) |
| Rollback procedure | Specified |
| Human monitor | Named (not anonymous) |
| Scoped GO statement | Required before execution |

---

## Immediate Stop Conditions

A controlled pilot must stop IMMEDIATELY if:

- Any raw value, local path, or secret appears in output
- Any unexpected external network connection is attempted
- Any device receives an unexpected command
- Hermes enters an unexpected state
- Human monitor requests stop
- Output deviates significantly from expected
- Any HOLD gate is implicitly violated

---

## Rollback Procedure

After any pilot run (whether successful or stopped):

1. Terminate all pilot processes
2. Verify no state persisted outside defined scope
3. Review output for raw values (redact before reporting)
4. Document what happened (redacted only)
5. Assess whether next pilot run is warranted
6. Each next run requires new GO

---

## Autonomous Execution Prohibition

A controlled pilot NEVER:

- Starts itself automatically
- Continues after the defined scenario completes
- Triggers another pilot run without new GO
- Modifies its own scope or stop conditions
- Overrides human stop signals
- Logs raw values anywhere

---

## Relationship to productionReady

Completing a controlled pilot does NOT set productionReady = true.
Completing 10 controlled pilots does NOT set productionReady = true.
productionReady = true requires G-18 — final separate human approval — after v10 complete.

この範囲では問題を検出していません。
