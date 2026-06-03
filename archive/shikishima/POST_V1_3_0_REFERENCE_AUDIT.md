# Post v1.3.0 Reference Audit — v1.3.1

## Audit Overview

- auditVersion: v1.3.1
- auditDate: 2026-05-12
- auditType: audit-only / report-only / redacted-only
- roadmapVersion: v1.3.1
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

---

## v1.3.0 Migration Result Confirmation

| Field | Expected | Confirmed |
|---|---|---|
| `package.json name` | `shikishima-desktop` | PASS |
| `package-lock.json` root name | `shikishima-desktop` | PASS |
| `dev-app-update.yml updaterCacheDirName` | `shikishima-desktop-updater` | PASS |
| `electron-builder.yml productName` | `しきしま` | PASS (unchanged) |
| `electron-builder.yml appId` | `com.nousresearch.hermes` | PASS (unchanged) |
| `electron-builder.yml win.executableName` | `hermes-agent` | PASS (unchanged) |
| `publish.repo` | `hermes-desktop` | PASS (KEEP — external GitHub URL) |
| `dev-app-update.yml repo` | `hermes-desktop` | PASS (KEEP — external GitHub URL) |

---

## `hermes-desktop` Reference Classification

### A. DONE — migrated in v1.2.x / v1.3.0

| Reference | Location | Status |
|---|---|---|
| Package name | `package.json name` | DONE (v1.3.0) |
| Lockfile root name | `package-lock.json` | DONE (v1.3.0) |
| Updater cache dir | `dev-app-update.yml updaterCacheDirName` | DONE (v1.3.0) |
| Package description | `package.json description` | DONE (v1.2.3) |
| Displayed app name | `electron-builder.yml productName` | DONE (v1.2.4) |
| HTML title | `src/renderer/index.html` | DONE (v1.2.1) |
| Logo alt text | `HermesLogo.tsx alt` | DONE (v1.2.1) |
| Instruction files | `AGENTS.md`, `CLAUDE.md` scope | DONE (v1.2.0) |
| zh-CN nav label | `navigation.ts research label` | DONE (v1.2.10) |

---

### B. KEEP — must not change (external references)

| Reference | Location | Reason |
|---|---|---|
| `publish.repo: hermes-desktop` | `electron-builder.yml` | External GitHub repo URL — changing requires actual GitHub repo rename |
| `repo: hermes-desktop` | `dev-app-update.yml` | Same — must match actual GitHub repo name |
| Upstream hermes-agent URLs | `README.md`, `CONTRIBUTING.md` | Upstream project attribution — keep |
| `~/.hermes/` directory paths | `src/main/installer.ts` | Upstream tool directory structure — keep |
| `src/main/hermes.ts` | source | Adapter to upstream hermes-agent backend |
| `src/main/ichikishima/hermes/` | source | Bridge to upstream hermes-agent |
| `window.hermesAPI.*` | renderer IPC bridge | Upstream IPC bridge name |

---

### C. HOLD — separate decision required

| Reference | Location | Reason | Phase |
|---|---|---|---|
| `appId: com.nousresearch.hermes` | `electron-builder.yml` | macOS/Win app identifier — changing affects OS-level registration | Phase C-later |
| `win.executableName: hermes-agent` | `electron-builder.yml` | Windows .exe name — separate user-visible decision | Phase C-later |
| `hermes-desktop/` directory name | repo root | Highest risk — git remote, all scripts | Phase E |
| `src/main/ichikishima/` | source tree | High-risk source rename — all imports must update | Phase D |
| `src/shared/ichikishima/` | source tree | Aligned with main rename | Phase D |
| `src/preload/ichikishima-control-center.ts` | preload | Medium risk — preload registration | Phase D |
| `HermesLogo.tsx` component | renderer | Component rename — separate decision | Phase C-later |
| `hermes.png` asset | renderer assets | Asset rename + import update | Phase C-later |
| `docs/ichikishima/` | legacy docs | 127 files — merge candidate | Phase E-prep |
| `.cursor/rules/ichikishima-*.mdc` | Cursor rules | Low-risk rule rename | Phase F |

---

### D. Current State Summary

```text
Naming migration progress:
  Phase C-1 (description)    : DONE (v1.2.3)
  Phase C-2 (productName)    : DONE (v1.2.4)
  Phase C-3 (package name)   : DONE (v1.3.0)
  Phase D (src directories)  : HOLD
  Phase E (repo rename)      : HOLD

User-visible name: しきしま (correct, via productName)
Technical package: shikishima-desktop (correct, via package.json name)
Artifact filenames: shikishima-desktop-* (auto via ${name})
Upstream bridge: hermes-agent (intentionally preserved)
External GitHub: hermes-desktop (intentionally preserved until repo rename)
```

---

## Safety Boundary Confirmation

- No files were modified during this audit
- No raw values, secrets, or local paths reported
- No build, test, or external network executed

この範囲では問題を検出していません。
