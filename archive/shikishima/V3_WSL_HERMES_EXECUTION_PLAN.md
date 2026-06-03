# Shikishima v3.x WSL / Hermes Execution Plan — v2.3.0

## Purpose

Documents WSL and Hermes execution requirements, environment checklist,
and execution plan. This document is planning-only. No execution occurs here.

- documentVersion: v2.3.0
- documentDate: 2026-05-12
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

**WSL execution requires G-11. Hermes execution requires G-12.**
**Neither gate is currently issued. This is plan-only.**

---

## WSL Environment Requirements

| Requirement | Verification Method | Status |
|---|---|---|
| WSL 2 installed | `wsl --version` (do not run) | Not verified |
| WSL distribution | `wsl -l -v` (do not run) | Not verified |
| Node.js in WSL | `wsl node --version` (do not run) | Not verified |
| Hermes installed | `wsl ls ~/.hermes/` (do not run) | Not verified |
| External network available in WSL | Check WSL network config | Not verified |

**All verification commands above are NOT to be run until G-11 is issued.**

---

## Hermes Installation Context

Based on `src/main/installer.ts` (read-only review):

- Hermes uses `HERMES_HOME` environment variable for home directory
- Default Hermes home: `~/.hermes/` in the target environment
- Hermes installation directory structure: `[HERMES_HOME]/` containing binary and config
- WSL mount path: not disclosed (local-only value — do not log)

**Hermes home directory is a local-only value. Never include in any report.**

---

## WSL Execution Plan (G-11)

**What happens when G-11 is issued**:

1. Verify WSL is running: `wsl --status` (output redacted)
2. Verify target distribution active (distribution name: local-only, not reported)
3. Run scoped WSL command (command specified in GO statement)
4. Capture output (redacted)
5. Terminate WSL process after capture
6. Report: redacted result only

**STOP conditions**:

| Condition | Action |
|---|---|
| WSL not available | STOP; report: "WSL not available. HOLD G-11." |
| WSL distribution not found | STOP; investigate; report |
| WSL output contains raw path | Redact; continue if safe; report path as [wsl-path] |
| Unexpected external network in WSL | STOP; `wsl --shutdown`; report P0 |
| WSL hangs > 60 seconds | `wsl --terminate [distro]`; report timeout |

**Output format**:
```
WSL execution result (G-11)
exit code: [0 or non-zero]
duration: [N seconds]
command category: [specified in GO]
network access: [none / ALERT: detected]
output summary: [redacted description]
```

---

## Hermes Execution Plan (G-12)

**What happens when G-12 is issued**:

1. Confirm WSL running (G-11 prerequisite)
2. Confirm Hermes installed in WSL (path: local-only, not reported)
3. Invoke Hermes via WSL with scoped command (specified in GO)
4. Capture IPC-style response (redacted)
5. Verify response schema
6. Terminate Hermes process
7. Report: redacted result only

**Hermes Execution Scope**:
- Local-only Hermes instance
- No RunPod endpoint
- No external API key used
- No user data processed
- Single command; exit immediately after response

**STOP conditions**:

| Condition | Action |
|---|---|
| Hermes binary not found | STOP; report: "Hermes not installed. HOLD G-12." |
| Hermes attempts external API call | STOP; kill process; report P0 |
| Hermes response contains raw paths | Redact; report |
| Hermes response contains secrets/tokens | STOP; redact; report P0 |
| Hermes does not exit within 120 seconds | Kill process; report timeout |
| RunPod endpoint detected in config | STOP; do not execute; report P0 |

**Output format**:
```
Hermes execution result (G-12)
exit code: [0 or non-zero]
duration: [N seconds]
response schema: [valid / invalid]
external connections: [none / ALERT: detected]
raw values in response: [none / ALERT: redacted]
```

---

## RunPod Integration (future, not now)

RunPod integration is planned for v6+ (G-13). This plan does NOT cover RunPod.

Requirements when G-13 is later issued:
- RunPod account confirmed
- API key available (stored locally; never committed)
- Execution cost threshold confirmed
- External network explicitly approved in GO

**RunPod execution is NOT approved in any current GO.**

---

## Emergency Stop for WSL/Hermes

If immediate stop is needed during WSL/Hermes execution:

```
# Terminate specific WSL distribution (replace [distro] with actual name at time of run)
wsl --terminate [distro]

# Or shutdown all WSL
wsl --shutdown

# Kill Node.js process spawned by Hermes (if needed)
taskkill /IM node.exe /F   (on Windows host)
```

These commands are documented here for emergency use only. Do not run proactively.

---

## Local-Only Value Policy for WSL/Hermes

The following values must NEVER appear in any report:

| Value Type | Report As |
|---|---|
| WSL username | `[wsl-user]` |
| WSL distribution name | `[wsl-distro]` |
| Hermes home path | `[hermes-home]` |
| WSL mount path | `[wsl-path]` |
| RunPod endpoint | `[runpod-endpoint]` |
| Any API key/token | `[secret]` |
| Windows username | `[redacted-user]` |

この範囲では問題を検出していません。
