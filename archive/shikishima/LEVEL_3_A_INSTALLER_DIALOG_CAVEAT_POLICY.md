# Level 3-A Installer Dialog Caveat Policy

## Document Status

```text
roadmapVersion: v3.43.0
date: 2026-05-17
status: policy_doc — applies to all future Level 3-A Scope B runs
```

---

## Background

### Session-008 (2026-05-15)

NousResearch Hermes Installer dialog appeared during Electron startup.
Classified as STOP_HANDLED_CORRECTLY. Session not counted.

### Session 001 — Level 3-A Scope B (2026-05-17)

Same installer dialog appeared again before iPhone observation could begin.
STOP correctly triggered. Result: HOLD.
ENABLED=true commit kept in local backup branch only. Not pushed to main.

---

## Root Cause

The Electron app checks for Hermes CLI at startup.
If the CLI is not installed, it displays an installer dialog.

```text
Hermes Agent Installer
✗ Windows detected. Please use the PowerShell installer.
```

This dialog is a recurring known behavior, not a new unknown anomaly.
Installation fails (exit code 1 on Windows) so no install actually occurs.
The dialog does not affect the MobileConsole / Phase 2C part of the app.

---

## Option B Caveat Policy

For Level 3-A Scope B retry, the installer dialog may be treated as a known caveat.

### Allowed Actions When Dialog Appears

```text
- dismiss / close the dialog without installing
- continue to MobileConsole observation if:
  * no install occurred
  * no admin elevation occurred
  * no external download occurred
  * no dependency or package change occurred
  * runtime scope remains within the approved Scope B
```

### Forbidden When Dialog Appears

```text
- do not install Hermes CLI
- do not click any install or approve button
- do not enter credentials
- do not allow admin elevation
- do not allow external component download
- do not modify package.json or lock files
- do not treat installer dialog completion as a positive sign
```

### Result Classification

```text
If dialog appeared AND dismissed AND observation succeeds:
  result: PASS_WITH_CAVEAT (not CLEAN_PASS)

If dialog appeared AND blocks observation or requires install/elevation/download:
  result: HOLD (STOP)

A run where the installer dialog appeared MAY NOT be classified as CLEAN_PASS.
```

---

## Confirmation Sequence When Dialog Appears

During the run, after dismissing the dialog, confirm:

```text
[ ] no install occurred
[ ] no admin elevation occurred
[ ] no external download occurred
[ ] package.json unchanged
[ ] package-lock.json unchanged
[ ] MobileConsole tab accessible
[ ] Phase 2C "接続" tab shows LAN URL and pairing token
[ ] ready to proceed to iPhone observation
```

If all confirmed: continue with iPhone protocol.
If any failed: STOP as HOLD.

---

## Updates to Related Documents

This policy applies to:

```text
- LEVEL_3_A_CONTROLLED_OBSERVATION_RUNBOOK.md (add to preconditions section)
- LEVEL_3_A_STOP_ROLLBACK_CHECKLIST.md (add caveat note to installer STOP condition)
- Future Level 3-A GO packages (include caveat acknowledgment)
```

The GO template should include:

```text
known_caveat_acknowledged:
  NousResearch Hermes Installer dialog may appear at startup.
  If it appears, dismiss without installing and continue per Option B policy.
  Result will be PASS_WITH_CAVEAT if observation succeeds.
```

---

## Safety Boundary

```text
This policy does NOT approve:
  - Hermes CLI installation
  - dependency changes
  - package changes
  - admin elevation
  - external downloads
  - productionReady true
  - execution enabled
  - Level 3 globally approved
```

---

この範囲では問題を検出していません。
