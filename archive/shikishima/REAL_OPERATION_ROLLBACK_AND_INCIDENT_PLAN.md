# Shikishima Real Operation Rollback and Incident Plan — v2.2.0

## Purpose

Defines the rollback procedures, incident response, and emergency stop concepts
for every stage from v3 through production. This document is planning-only.
No emergency stop mechanism is implemented here.

- documentVersion: v2.2.0
- documentDate: 2026-05-12
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

---

## Core Principles

1. **HOLD is always the safe state.** Any uncertainty → return to HOLD.
2. **Human override is always valid.** Human stop signal overrides any agent action.
3. **Raw values must never appear in reports.** If they do, stop and redact before continuing.
4. **No autonomous recovery.** Agent must not auto-retry or self-heal after incident.
5. **Rollback beats remediation.** When in doubt, roll back to last known safe state.

---

## Rollback Level Definitions

| From Level | Rollback To | Action |
|---|---|---|
| Level 1 (static UI) | Level 0 (docs) | Revert commits; return to docs-only |
| Level 2 (tests run) | Level 1 (committed) | Stop test runner; review output |
| Level 3 (validation) | Level 2 (tests) | Stop validation; redact output; review |
| Level 4 (dev run) | Level 3 (validated) | Terminate dev process; review state |
| Level 5 (dummy/wrapper) | Level 4 (dev run) | Kill dummy process; confirm no state leak |
| Level 6 (WSL/Hermes) | Level 5 (dummy) | Terminate WSL session; confirm no persistence |
| Level 7 (device display) | Level 6 (Hermes) | Disconnect device; safe state |
| Level 8 (pilot) | Level 7 (display) | Terminate pilot; rollback procedure |
| Level 9 (production) | Level 8 (pilot) | Revert deployment; restore prior state |

---

## GO → HOLD Revert Conditions

A previously issued GO can be reverted to HOLD if:

| Condition | Revert Action |
|---|---|
| New safety risk discovered | Issue: "REVERT G-XX: Return to HOLD. Reason: [reason]." |
| Raw value appears in output | Issue: "REVERT G-XX: Raw value detected. Return to HOLD." |
| Human requests HOLD | Issue: "REVERT all active GOs. Return to HOLD." |
| Device malfunction | Issue: "REVERT G-14 (or G-22). Disconnect hardware." |
| Unexpected external connection | Issue: "REVERT G-11/G-12. WSL/Hermes shutdown." |
| CI system reports failure | Issue: "REVERT G-06. HOLD vitest." |

GO revert does NOT require the same checklist as original GO. Human word is sufficient.

---

## Incident Severity Classification

| Severity | Description | Response |
|---|---|---|
| P0 | Raw value / secret exposed | Immediate STOP; redact; audit; notify human |
| P0 | External connection unauthorized | Immediate STOP; disconnect; audit |
| P0 | Device receives motion command without G-22 | STOP; hardware safe state; emergency report |
| P1 | Test/validation produces unexpected output | STOP test runner; review; return to HOLD |
| P1 | Build failure with sensitive output | STOP; redact output; return to HOLD |
| P2 | Unexpected state in dev run | Stop dev process; document; review |
| P3 | Documentation inconsistency | Flag; update docs; no stop required |

---

## P0 Response Procedure

For all P0 incidents:

1. **STOP all execution immediately** — kill all processes
2. **Do not report raw values** — review output before any report
3. **Redact any captured output** — replace paths/secrets with `[redacted]`
4. **Inform human** — report: "P0 incident. [category]. All execution stopped. Output redacted."
5. **Do not restart** — wait for explicit human instruction
6. **Audit scope** — what was running; what data was accessed; what was output
7. **Document** (redacted) — incident timeline; redacted output summary

**No agent may restart execution after a P0 without new explicit GO.**

---

## Raw Value Incident Response

If a raw value (local path, home directory, secret, token) appears in any output:

1. STOP — do not continue execution
2. Do NOT include raw value in any report
3. Replace with `[redacted-path]` / `[redacted-secret]` / `[local-endpoint]`
4. Report: "Raw value detected in [category] output. Redacted. Waiting for human instruction."
5. Identify source: which file, which function, which command produced the raw value
6. Fix source before restarting (with new GO)

---

## Device Incident Response

If a device (StackChan, smartphone, any hardware) receives an unexpected command or behaves unexpectedly:

1. **Disconnect device immediately** — cut USB/serial/network connection
2. Confirm device is in safe state (no motion, no output)
3. Report: "Device incident. [device name]. Disconnected. Waiting for human."
4. Do not reconnect without explicit human instruction and new G-14/G-22 GO
5. Review what command was sent (audit logs; redacted)

---

## Emergency Stop Concept

An emergency stop mechanism should be implemented as part of controlled pilot preparation (v9):

| Component | Concept |
|---|---|
| Process kill | `taskkill /PID [pid]` or `kill -9 [pid]` — documented in pilot runbook |
| WSL shutdown | `wsl --shutdown` — documented in WSL execution plan |
| Device disconnect | Physical disconnect or software safe state command |
| Human key | Defined keyboard shortcut or button to stop all execution |
| Log output | All process output captured to local file (redacted before reporting) |

**Emergency stop is a concept at v2.x stage. Implementation deferred to v9.**

---

## Rollback Archive

Record all rollback events here when they occur:

| Date | From Level | To Level | Reason | Initiated By |
|---|---|---|---|---|
| — | — | — | (none) | — |

---

## Never-Automatic Recovery Rules

The following must NEVER happen automatically:

| Forbidden | Why |
|---|---|
| Auto-restart after P0 | May re-expose the same raw value |
| Auto-retry after device disconnect | May cause unexpected motion |
| Auto-escalate level after success | Each level requires independent GO |
| Auto-issue GO after checklist complete | Only human can issue GO |
| Auto-report raw values | Raw values must be redacted first |

この範囲では問題を検出していません。
