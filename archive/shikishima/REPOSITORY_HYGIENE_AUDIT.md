# Repository Hygiene Audit — v1.1.0

## Audit Overview

- auditVersion: v1.1.0
- auditDate: 2026-05-11
- auditType: audit-only / report-only
- roadmapVersion: v1.1.0
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

This document is a static repository audit. No files were deleted, renamed,
executed, or pushed. It records findings and candidates only.

---

## Audit Scope

Targets audited:

1. Naming (旧名/新名 一覧)
2. Directory and file inventory
3. Security and safety signals
4. Project alignment

---

## Overall Status Table

| Category | Status | Notes |
|---|---|---|
| Naming — repo dir | HOLD | hermes-desktop → rename candidate |
| Naming — package.json | HOLD | hermes-desktop → rename candidate |
| Naming — src/main/ichikishima/ | HOLD | dir rename candidate; code intact |
| Naming — docs/ichikishima/ | HOLD | old name docs dir exists; merge candidate |
| Naming — ControlCenter UI | HOLD | internal term; rename scope TBD |
| Naming — index.html title | HOLD | "Hermes Agent" → rename candidate |
| Naming — HermesLogo component | HOLD | rename candidate (cosmetic) |
| Naming — AGENTS.md/CLAUDE.md | HOLD | reference old ichikishima paths |
| Naming — .cursor/rules/ | HOLD | ichikishima-*.mdc → rename candidates |
| Naming — .agents/.claude skills | HOLD | hermes-agent skill → rename candidate |
| Security — installer.ts | HOLD | execFile/spawn present; execution is upstream feature |
| Security — Gateway.tsx | HOLD | start/stop buttons present; upstream feature |
| Security — WSL2 wrapper | PASS | willInvokeWsl: false hardcoded |
| Security — CSP | PASS | default-src 'self'; no external load |
| Security — .gitignore | PASS | local-only values protected |
| Security — secrets in src | PASS | no raw API keys found in src |
| Project alignment — 5 agents | PASS | all 5 named correctly in docs/shikishima/ |
| Project alignment — tsumugu typo | PASS | not found |
| Project alignment — docs/static-only | PASS | docs/shikishima/ is docs-only |
| Project alignment — execution mixed | HOLD | installer/gateway are upstream features |

---

## Summary Diagram

```
hermes-desktop/                       ← dir name HOLD (rename candidate)
├── docs/
│   ├── ichikishima/                  ← OLD NAME dir (rename/merge candidate)
│   └── shikishima/                   ← NEW NAME dir (current docs home)
├── src/
│   ├── main/
│   │   ├── ichikishima/              ← OLD NAME dir (rename candidate)
│   │   │   ├── hermes/               ← "hermes" = upstream backend name
│   │   │   ├── control-center/       ← OLD INTERNAL TERM
│   │   │   └── orchestrator/
│   │   │       └── ichikishima-orchestrator.ts  ← OLD NAME in filename
│   │   └── installer.ts              ← execFile/spawn present (upstream)
│   ├── preload/
│   │   └── ichikishima-control-center.ts  ← OLD NAME in filename
│   ├── renderer/
│   │   ├── index.html                ← title "Hermes Agent" (rename candidate)
│   │   └── src/
│   │       ├── assets/hermes.png     ← OLD NAME asset
│   │       ├── components/common/
│   │       │   └── HermesLogo.tsx    ← OLD NAME component (rename candidate)
│   │       └── screens/
│   │           └── ControlCenterAppShell/  ← OLD INTERNAL TERM dir
│   └── shared/
│       └── ichikishima/              ← OLD NAME dir (rename candidate)
├── tests/
│   └── ichikishima/                  ← OLD NAME dir (rename candidate)
├── sandbox/
│   └── hermes-autonomy-zone/         ← sandbox test area (HOLD)
├── AGENTS.md                         ← references docs/ichikishima (update candidate)
├── CLAUDE.md                         ← references Ichikishima/Hermes (update candidate)
├── .cursor/rules/
│   └── ichikishima-*.mdc             ← OLD NAME rules (rename candidates)
├── .agents/skills/hermes-agent/      ← OLD NAME skill (rename candidate)
└── .claude/skills/hermes-agent/      ← OLD NAME skill (rename candidate)
```

---

## Naming Findings

### 1. Repository Directory Name

- Current: `hermes-desktop`
- Source: originally forked from upstream hermes-desktop (Nous Research)
- Project display name moving to: しきしま
- Rename candidate: `shikishima-desktop` or `しきしま-desktop`
- Risk: breaking local links, git remote URLs, any path references in scripts
- Decision: HOLD — rename requires coordinated update of all path references

### 2. package.json

- `name`: `hermes-desktop` → rename candidate: `shikishima-desktop`
- `description`: `Hermes Agent Desktop — self-improving AI assistant`
  → update candidate: should reflect しきしま context
- `author`: `fathah` — upstream author; leave as-is or blank
- `homepage`: upstream GitHub URL — leave as-is or update to local repo

### 3. src/renderer/index.html

- `<title>Hermes Agent</title>` → rename candidate: `しきしま` or `Shikishima`
- Low-risk, isolated change

### 4. src/renderer/src/components/common/HermesLogo.tsx

- Component name: `HermesLogo`
- `alt="Hermes"` → rename candidate: `alt="しきしま"`
- Component rename: `HermesLogo` → `ShikishimaLogo` or `AppLogo`
- Low-risk cosmetic change

### 5. src/main/ichikishima/ — Source Directory

- Contains all custom しきしま control-layer code
- Subdirectories: hermes/, control-center/, agent-team/, orchestrator/,
  approval/, audit/, memory/, review/, autonomy-zone/, visualization/, pilot/
- "hermes" subdirectory name: refers to the Hermes bridge adapter
  (connection to Nous Research's hermes-agent backend)
  → IMPORTANT: this "hermes" is upstream dependency name, not this project's name
- Rename candidate for root: `ichikishima/` → `shikishima/`
- HOLD — mass rename requires full import path update across all files

### 6. docs/ichikishima/ — Old Docs Directory

- EXISTS alongside docs/shikishima/
- Contains: IMPLEMENTATION_HANDOFF.md, CONTROL_CENTER_*.md, HERMES_*.md, mockups/
- Referenced from: AGENTS.md, CLAUDE.md, src/*.ts files
- Merge candidate: content should eventually move into docs/shikishima/impl/ or similar
- HOLD — referenced from src code (control-center-status.ts: ICHIKISHIMA_READONLY_DOC_PATHS)

### 7. src/preload/ichikishima-control-center.ts

- OLD NAME in filename
- Rename candidate: `shikishima-control-center.ts`
- HOLD — imports and preload registration depend on this name

### 8. tests/ichikishima/ — Test Directory

- Rename candidate: `tests/shikishima/`
- Contains: control-center/, approval/
- HOLD — rename alongside src/main/ichikishima/

### 9. src/shared/ichikishima/ — Shared Types Directory

- Contains: control-center-shell-ui-contract.ts, control-center-readonly-ipc-channel.ts
- Rename candidate: `src/shared/shikishima/`
- HOLD — rename alongside src/main/ichikishima/

### 10. ControlCenterAppShell Screen

- `src/renderer/src/screens/ControlCenterAppShell/`
- "Control Center" is old internal term for what is now しきしま
- Rename candidate: `ShikishimaShell/` or keep as implementation name
- HOLD — cosmetic, no urgency

### 11. AGENTS.md and CLAUDE.md at Root

- AGENTS.md line 7: `For Ichikishima / Hermes work, also follow...`
- AGENTS.md line 29: `docs/ichikishima/` documentation.
- CLAUDE.md: `For Ichikishima / Hermes work, also follow...`
- Update candidate: change "Ichikishima" to "しきしま"
- HOLD — low-risk update, can be done as docs-only change

### 12. .cursor/rules/ Files

- `ichikishima-workflow.mdc`
- `ichikishima-safety.mdc`
- Rename candidates: `shikishima-workflow.mdc`, `shikishima-safety.mdc`
- HOLD — rename alongside other ichikishima→shikishima changes

### 13. .agents/.claude Skills

- `.agents/skills/hermes-agent/SKILL.md`
- `.claude/skills/hermes-agent/SKILL.md`
- Content: upstream Hermes Agent project guide (Nous Research hermes-agent)
- The skill name "hermes-agent" refers to the upstream dependency, not this project
- Decision: keep as-is; this is an upstream reference skill, not a project identity file

### 14. Verified Absent — No "tsumugu" Typo

- Searched: `tsumugu`
- Result: no matches in any file
- Confirmed: only `tsumugi` (correct spelling) exists

---

## Naming: "Hermes" vs "ichikishima" Distinction

IMPORTANT DISTINCTION for rename decisions:

| Occurrence | What it refers to | Rename? |
|---|---|---|
| `src/main/hermes.ts` | Nous Research hermes-agent backend adapter | KEEP |
| `src/main/installer.ts` HERMES_HOME | Upstream ~/.hermes directory | KEEP |
| `src/main/ichikishima/hermes/` dir | Bridge to hermes-agent backend | KEEP name (upstream ref) |
| `src/renderer/src/assets/hermes.png` | Branding asset (upstream logo) | RENAME candidate |
| `HermesLogo.tsx` alt="Hermes" | App branding | RENAME candidate |
| index.html `<title>Hermes Agent</title>` | App branding | RENAME candidate |
| `src/main/ichikishima/` root dir | This project's custom layer | RENAME candidate |
| `docs/ichikishima/` | This project's old docs | RENAME/MERGE candidate |
| `.cursor/rules/ichikishima-*.mdc` | This project's rules | RENAME candidate |

The word "Hermes" in source code is predominantly upstream dependency references.
Renaming them would break the app. Only branding-level occurrences (title, logo,
asset name) are rename candidates without breaking functionality.

---

## Recommended Rename Priority

| Priority | Item | Risk | Scope |
|---|---|---|---|
| LOW | index.html title | very low | 1 line |
| LOW | HermesLogo.tsx alt | very low | 1 line |
| LOW | AGENTS.md "Ichikishima" refs | very low | 2 lines |
| LOW | CLAUDE.md "Ichikishima" refs | very low | 2 lines |
| MEDIUM | .cursor/rules/ filenames | low | 2 files + references |
| MEDIUM | src/renderer/src/assets/hermes.png | low | asset + 1 import |
| HIGH | src/main/ichikishima/ → shikishima/ | high | all imports |
| HIGH | docs/ichikishima/ → docs/shikishima/ merge | medium | src code references |
| HIGH | package.json name/description | low | isolated |
| HIGH | repo dir hermes-desktop | high | git remote, scripts |

---

## Safety Boundary

- This audit document does not approve any rename.
- All rename decisions remain HOLD.
- No files were modified, deleted, or renamed during this audit.
- This file is docs/static-only.

この範囲では問題を検出していません。
