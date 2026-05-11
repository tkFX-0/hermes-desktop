# Package Metadata Audit — v1.2.2

## Audit Overview

- auditVersion: v1.2.2
- auditDate: 2026-05-11
- auditType: audit-only / report-only
- roadmapVersion: v1.2.2
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

No package.json changes were made in this audit. This document records findings
and impact analysis only.

---

## Current package.json Fields (Relevant Subset)

| Field | Value |
|---|---|
| name | `hermes-desktop` |
| version | `0.2.3` |
| description | `Hermes Agent Desktop — self-improving AI assistant` |
| author | `fathah` (upstream author) |
| homepage | upstream GitHub URL |

---

## Lockfile Inventory

| Lockfile | Present | Notes |
|---|---|---|
| `package-lock.json` | YES | npm-managed; root entry: `"name": "hermes-desktop"` |
| `pnpm-lock.yaml` | NO | not present |
| `yarn.lock` (root) | NO | only in node_modules subtrees |

`package-lock.json` line 2: `"name": "hermes-desktop"` — root package name.
If `package.json name` changes, lockfile root name must be kept in sync
(this happens automatically on next `npm install`, but is a file change).

---

## "hermes-desktop" Reference Map

### A. Build / Packaging Config

| File | Reference | Derived from name? | Impact if name changes |
|---|---|---|---|
| `electron-builder.yml` | `nsis.artifactName: ${name}-${version}-setup.${ext}` | YES — `${name}` = package.name | Windows installer filename changes |
| `electron-builder.yml` | `dmg.artifactName: ${name}-${version}.${ext}` | YES | macOS DMG filename changes |
| `electron-builder.yml` | `appImage.artifactName: ${name}-${version}.${ext}` | YES | Linux AppImage filename changes |
| `electron-builder.yml` | `publish.repo: hermes-desktop` | NO — external GitHub repo URL | KEEP; points to upstream GitHub repo |
| `dev-app-update.yml` | `repo: hermes-desktop` | NO — external GitHub repo URL | KEEP; must match actual GitHub repo name |
| `dev-app-update.yml` | `updaterCacheDirName: hermes-desktop-updater` | NO — hardcoded string | Changes only if updated manually |

**Critical: NOT derived from package.json name:**

| Field | Value | Meaning |
|---|---|---|
| `electron-builder.yml` `appId` | `com.nousresearch.hermes` | macOS/Win app identifier — independent |
| `electron-builder.yml` `productName` | `Hermes Agent` | User-visible app name — independent |
| `electron-builder.yml` `win.executableName` | `hermes-agent` | Windows .exe name — independent |
| `release.yml` release name | `Hermes Desktop ${tag}` | GitHub release title — independent |

### B. CI / Workflow

| File | Reference | Impact |
|---|---|---|
| `.github/workflows/release.yml` | reads `package.json.version` at runtime | NOT reading name — PASS |
| `.github/workflows/release.yml` | no hardcoded `hermes-desktop` references | PASS |

### C. Documentation

| Location | Count | Notes |
|---|---|---|
| `docs/shikishima/` (5 audit files) | reference for audit purposes | Expected; no action needed |
| `docs/ichikishima/` (10+ old docs) | old implementation docs | Legacy; migration in progress |
| `README.md`, `README.zh-CN.md` | upstream GitHub links | External upstream reference; keep |
| `CONTRIBUTING.md`, `CONTRIBUTING.zh-CN.md` | upstream GitHub links | External upstream reference; keep |

### D. Source Code

No `hermes-desktop` string found in `src/**/*.ts` or `src/**/*.tsx`.
The package name is not referenced in application source code.

---

## Impact Analysis: Description Change

| Aspect | Impact | Status |
|---|---|---|
| `electron-builder.yml` uses description | NO | PASS |
| `release.yml` uses description | NO | PASS |
| Any script uses description | NO | PASS |
| Lockfile affected | NO | PASS |
| Source code affected | NO | PASS |

**Conclusion: description change is SAFE.** It is purely informational metadata.
Can be changed in v1.2.3 without any cascading effects.

---

## Impact Analysis: Name Change

| Aspect | Impact | Risk | Notes |
|---|---|---|---|
| `package-lock.json` root name | YES — must sync | LOW | Auto-syncs on `npm install`; or manual 1-line edit |
| artifact filenames (nsis, dmg, AppImage) | YES — filenames change | MEDIUM | Downstream users of release artifacts may need to update links/scripts |
| `updaterCacheDirName` in dev-app-update.yml | indirect | LOW | Hardcoded string; needs manual update |
| `publish.repo` in electron-builder.yml | NO | — | External GitHub repo URL; independent of package name |
| `repo` in dev-app-update.yml | NO | — | External GitHub repo URL; independent of package name |
| `productName` = "Hermes Agent" | NO | — | User-visible name is separate; package name change does NOT change it |
| `appId` = "com.nousresearch.hermes" | NO | — | macOS/Win app ID is separate |
| Source code | NO | — | package name not referenced in src/ |
| docs/shikishima references | YES (audit/naming docs only) | VERY LOW | Update as part of name change |

**Conclusion: name change has MEDIUM scope.** It touches lockfile root name,
artifact filenames, and indirectly updaterCacheDirName. It does NOT change
the user-visible productName or appId. Requires a migration plan.

---

## Important Distinction: package.name vs productName

This is the most critical finding of this audit:

```text
package.json name: "hermes-desktop"
  ↓ used for artifact filenames (${name} in electron-builder.yml)
  ↓ used for lockfile root name
  ↓ NOT shown to users

electron-builder.yml productName: "Hermes Agent"
  ↓ shown in title bar, taskbar, installer
  ↓ shown as app name on macOS/Windows
  ↓ NOT derived from package.json name
```

Changing `package.json name` to `shikishima-desktop` will NOT change the
displayed app name. To change the displayed app name to "しきしま", the
`productName` field in `electron-builder.yml` must also be updated.

This means a full display name migration would require:
1. `package.json name` → `shikishima-desktop`
2. `electron-builder.yml productName` → `しきしま`
3. `electron-builder.yml win.executableName` → `shikishima` (optional)
4. `dev-app-update.yml updaterCacheDirName` → `shikishima-desktop-updater`

---

## Recommended Migration Order (for reference only — not yet approved)

| Step | Target | File | Risk | Version |
|---|---|---|---|---|
| 1 | description | package.json | VERY LOW | v1.2.3 |
| 2 | productName | electron-builder.yml | LOW | v1.2.x |
| 3 | name | package.json + lockfile sync | MEDIUM | v1.3.0 |
| 4 | win.executableName | electron-builder.yml | LOW | optional |
| 5 | updaterCacheDirName | dev-app-update.yml | LOW | alongside step 3 |
| 6 | publish.repo + dev-app-update.yml repo | both | KEEP | when GitHub repo renamed |

Steps 1 and 2 are independent. Step 3 is the main risk point.

---

## Phase C Update: NAMING_MIGRATION_CANDIDATES.md

The Phase C entry in NAMING_MIGRATION_CANDIDATES.md listed:
> `package.json name / description` → rename candidate

This audit clarifies they should be split:
- `description`: SAFE, move to Phase C-1 (v1.2.3)
- `productName` in electron-builder.yml: SAFE, Phase C-2 (v1.2.x)
- `package.json name`: MEDIUM, needs plan — Phase D-prep (v1.2.4) then v1.3.0

---

## Safety Boundary Confirmation

During this audit:
- No package.json was modified
- No lockfile was modified
- No npm install was performed
- No build or test was executed
- No external network connections were made
- No git push was performed
- No raw values were reported

この範囲では問題を検出していません。
