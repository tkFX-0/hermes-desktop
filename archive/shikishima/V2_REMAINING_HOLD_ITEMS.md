# Shikishima v2 Remaining HOLD Items — v2.0

## Purpose

Records all items that remain in HOLD state at v2.0 completion.
This document is reference-only. It does not create GO approval or execution permission.

- documentVersion: v2.0 (see also V3_HOLD_GATE_MATRIX.md for v3.x gate details)
- documentDate: 2026-05-12
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

---

## HOLD Items by Category

### H-1: Test Suite Commit

| Item | HOLD Reason | GO Condition |
|---|---|---|
| tests/ichikishima/ (66 files) | Human review + GO required | Human confirms review package; explicit GO granted |
| tests/hermes/ (12 files) | Human review + GO required | Human confirms review package; explicit GO granted |

Review packages: `TESTS_ICHIKISHIMA_REVIEW_PACKAGE.md`, `TESTS_HERMES_REVIEW_PACKAGE.md`

---

### H-2: Phase D Source Rename

| Item | HOLD Reason | GO Condition |
|---|---|---|
| Phase D-1: src/main/ichikishima/ rename | Explicit human GO required; typecheck needed | Human scoped GO for Phase D; typecheck passes |
| Phase D-2: ichikishimaControlCenter window key rename | Breaking change; separate GO after D-1 | Separate explicit GO after D-1 complete |
| Phase D post-rename audit (v1.8.0) | Deferred until D-1 executes | After D-1 commit |

Plan: `PHASE_D_SRC_RENAME_PLAN.md`, `PHASE_D_RENAME_IMPACT_MATRIX.md`

---

### H-3: Phase E Repo Rename

| Item | HOLD Reason | GO Condition |
|---|---|---|
| GitHub repo rename (external action) | External action — not within repo scope | Human performs GitHub rename |
| electron-builder.yml publish.repo update | Must happen AFTER GitHub rename | After GitHub rename; before redirect expires |
| dev-app-update.yml repo update | Must happen AFTER GitHub rename | Same commit as publish.repo |
| Documentation link updates | Low urgency | Same session as above or follow-up |

Plan: `PHASE_E_REPO_RENAME_PLAN.md`, `PHASE_E_EXTERNAL_REFERENCE_MATRIX.md`

---

### H-4: docs/ichikishima Archive Decision

| Item | HOLD Reason | GO Condition |
|---|---|---|
| docs/ichikishima/ (127 files) archive/merge | Scope decision required | Human selects Option 1, 2, or 3 from DOCS_ICHIKISHIMA_MIGRATION_PLAN.md |
| WSL2 wrapper runbooks | Redaction review required | Human reviews for sensitive paths before any commit |

Plan: `DOCS_ICHIKISHIMA_MIGRATION_PLAN.md`

---

### H-5: Optional / Deferred

| Item | HOLD Reason | Notes |
|---|---|---|
| appId change (com.nousresearch.hermes) | Separate decision required | Changing breaks OS registrations; not required for v3.x |
| win.executableName change | Optional | Not required for any current milestone |

---

## What Is Not HOLD (Already Done)

- Package metadata migration (name, productName, description, HTML title) — DONE v1.2.3–v1.3.0
- Group B feature commit (ControlCenter IPC + Research) — DONE v1.2.11
- .gitignore for sandbox/, .claude/, .cursor/ — DONE v1.4.0
- Post-migration reference audit — DONE v1.3.1
- All v2.0 documentation tasks — DONE v1.3.1–v2.0

---

## Global HOLD Gate

```text
execution:       disabled
productionReady: false
robotMotion:     HOLD
git push:        not approved
WSL/Hermes/RunPod/StackChan/voice: HOLD
```

この範囲では問題を検出していません。
