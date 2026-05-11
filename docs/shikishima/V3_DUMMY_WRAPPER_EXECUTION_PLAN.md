# Shikishima v3.x Dummy / Wrapper Execution Plan — v2.3.0

## Purpose

Documents the plan for dummy process and wrapper execution.
This document is planning-only. No execution occurs here.

- documentVersion: v2.3.0
- documentDate: 2026-05-12
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

**Dummy and wrapper execution requires G-09 and G-10 respectively.**
**Neither gate is currently issued.**

---

## What Is the Dummy Hermes Process

The dummy Hermes process is a stub that simulates Hermes behavior without invoking
the real Hermes binary. It is used in tests to verify IPC bridge behavior.

- Location (do not expose absolute path): `tests/ichikishima/sandbox/`
- Key files:
  - `dummy-hermes-path.ts` — path constant pointing to dummy bridge payload
  - `dummy-hermes-stub-design.process-local.test.ts` — process-local test (CI-guarded)

**Important**: The dummy process must NEVER point to a real Hermes binary or WSL endpoint.

---

## Dummy Process: What It Does

When invoked (not yet; requires G-09):

1. Spawns a local Node.js process using the dummy path
2. Outputs a predefined JSON payload
3. Exits after one message exchange
4. Does NOT connect to WSL, Hermes, or any external service

**Expected behavior**: Single payload exchange; clean exit; no side effects.

---

## Dummy Process: Environment Requirements

| Requirement | Value |
|---|---|
| Node.js | Available locally |
| External network | NOT required; must be absent |
| Hermes binary | NOT required |
| WSL | NOT required |
| RUN_DUMMY_HERMES_LOCAL_PROCESS | Must be `1` AND `CI` must NOT be `true` |

---

## Dummy Process: GO Conditions (G-09)

- [ ] tests/ichikishima committed (G-01 satisfied)
- [ ] vitest run confirmed safe (G-06 or pre-check)
- [ ] No external network active during run
- [ ] Environment: local dev only
- [ ] Dummy path confirmed: NOT a real Hermes binary
- [ ] Process isolation confirmed: no state leak to real Hermes
- [ ] Explicit scoped GO: "GO G-09: Approve dummy process execution."

---

## Dummy Process: STOP Conditions

| Condition | Action |
|---|---|
| Process does not exit within 30 seconds | Kill process; report timeout |
| Output contains raw file paths | Kill; redact output; report P1 |
| Process attempts network connection | Kill immediately; report P0 |
| Output references real Hermes endpoint | Kill; report P0 |

---

## Wrapper Execution: What It Does

The wrapper is a thin shell/script that wraps Hermes invocation for IPC purposes.
It abstracts the actual Hermes binary path and provides a controlled interface.

- Location: `src/main/ichikishima/` (review before executing)
- Behavior: Accepts IPC call → invokes backend → returns response → exits

**Requires G-10.**

---

## Wrapper Execution: Environment Requirements

| Requirement | Value |
|---|---|
| Dummy hermes binary | Available locally (not real Hermes) |
| External network | NOT required |
| WSL | NOT required (wrapper-only scope) |
| Path to dummy | Configured in wrapper (review config before run) |

---

## Wrapper Execution: GO Conditions (G-10)

- [ ] G-09 satisfied (dummy process confirmed safe)
- [ ] Wrapper code reviewed: no real Hermes path
- [ ] No external network in wrapper execution path
- [ ] Explicit scoped GO: "GO G-10: Approve wrapper execution."

---

## Wrapper Execution: STOP Conditions

Same as dummy process STOP conditions. Additionally:

| Condition | Action |
|---|---|
| Wrapper invokes real WSL | Kill immediately; report P0 |
| Wrapper creates persistent files outside expected location | Kill; investigate |

---

## Execution Sequence (after all GOs issued)

```
[G-09 issued]
1. Set environment: RUN_DUMMY_HERMES_LOCAL_PROCESS=1, CI=false (local only)
2. Run dummy process test (single run)
3. Capture output (redacted)
4. Verify: exit clean; no network; no real Hermes

[G-10 issued]
5. Run wrapper (pointing to dummy, not real Hermes)
6. Capture IPC response (redacted)
7. Verify: response format matches expected schema
8. Terminate wrapper; confirm no state persisted
```

---

## Redacted Output Format

```
dummy/wrapper execution result
gate: G-09 [or G-10]
exit code: [0 or non-zero]
duration: [N seconds]
network connections: [none / ALERT: detected]
output summary: [schema valid / schema invalid]
raw value detected: [no / ALERT: yes]
```

---

## Pre-Execution Safety Check (required before G-09 or G-10)

- [ ] No real Hermes binary accessible from test environment
- [ ] No WSL running
- [ ] No external network
- [ ] Dummy path: confirmed local test fixture only
- [ ] Process isolation: confirmed (no shared state with production)

この範囲では問題を検出していません。
