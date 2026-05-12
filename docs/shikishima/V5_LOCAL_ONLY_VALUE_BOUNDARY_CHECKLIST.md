# Shikishima v5 Local-Only Value Boundary Checklist — v2.8.2

## Purpose

Defines and verifies local-only value boundaries before v5 dry-run.

- documentVersion: v2.8.2 / decision: HOLD / execution: disabled / productionReady: false

---

## Local-Only Values — Definition

A "local-only value" is any value that:
1. Is specific to the local development machine
2. Must not appear in any report, log, or committed file
3. Varies between machines and must not be hardcoded

| Value Type | Example | Report As |
|---|---|---|
| Windows username | `C:\Users\[name]\` | `[redacted-path]` |
| WSL username | `/home/[name]/` | `[redacted-path]` |
| Local port | `localhost:8765` | `[local-endpoint]` |
| Hermes home path | `~/.hermes/` | `[hermes-home]` |
| WSL distribution name | distro name | `[wsl-distro]` |
| Local IP address | `192.168.x.x` | `[local-ip]` |
| Machine hostname | hostname | `[hostname]` |

---

## Pre-Dry-Run Boundary Checklist

**In committed source code (check before G-20)**:
- [ ] No absolute Windows path (`C:\Users\...`) in any src/ file
- [ ] No absolute Linux path (`/home/...`) in any src/ file
- [ ] localhost:8765 in Research.tsx: display use only (not hardcoded as production URL)
- [ ] No API key or secret in any committed file
- [ ] No machine-specific config hardcoded

**In .env or config files (check before G-20)**:
- [ ] .env files: gitignored (confirm in .gitignore)
- [ ] No secrets in electron-builder.yml
- [ ] dev-app-update.yml: contains no secrets

---

## During Dry-Run Value Check

When the app is running (after G-20):

- [ ] ControlCenter panel: shows only schema-compliant fields
- [ ] No raw path displayed in any UI element
- [ ] Console output: no user paths visible
- [ ] Research screen URL field: shows `localhost:[port]` — acceptable (local display)
- [ ] DevTools Network: no external requests

---

## If Raw Value Found in Dry-Run

| Discovery | Action |
|---|---|
| Raw path displayed in UI | Stop; fix display component; re-run |
| Raw path in console | Redact console capture; investigate source |
| Secret in console | P0: stop immediately; investigate |
| External network in DevTools | P0: stop app; disconnect; report |

この範囲では問題を検出していません。
