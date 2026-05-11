# Project Alignment Review

## Purpose

This document reviews whether the hermes-desktop repository aligns with the
しきしま plan as documented in docs/shikishima/. It does not approve any
execution or rename.

- auditVersion: v1.1.0
- auditDate: 2026-05-11
- decision: HOLD
- execution: disabled
- productionReady: false

---

## 1. 5-Agent System Alignment

### Expected Agent Names and Roles

| Agent | Nickname | Role |
|---|---|---|
| しきしま | しき | Main orchestrator, user-facing control room |
| しずめ | none | Safety gate |
| つむぎ | つむ | Implementation agent |
| はじめ | none | Planning and first-step agent |
| しるべ | none | Record, navigation, and handoff agent |

### Audit Results

| Check | Status | Notes |
|---|---|---|
| しきしま present in docs | PASS | AGENT_NAMES_ROLES_AND_PERMISSIONS.md ✓ |
| しずめ present in docs | PASS | SHIZUME_SAFETY_GATE_POLICY.md, SHIZUME_DECISION_MATRIX.md ✓ |
| つむぎ present in docs | PASS | TSUMUGI_IMPLEMENTATION_WORKFLOW.md, TSUMUGI_TASK_TEMPLATE.md ✓ |
| はじめ present in docs | PASS | AGENT_NAMES_ROLES_AND_PERMISSIONS.md ✓ |
| しるべ present in docs | PASS | SHIRUBE_LOGGING_POLICY.md, SHIRUBE_HANDOFF_TEMPLATE.md, SHIRUBE_KNOWLEDGE_INDEX_DESIGN.md ✓ |
| Nickname しき only for しきしま | PASS | Confirmed in AGENT_NAMES_ROLES_AND_PERMISSIONS.md |
| Nickname つむ only for つむぎ | PASS | Confirmed in AGENT_NAMES_ROLES_AND_PERMISSIONS.md |
| No nickname for しずめ/はじめ/しるべ | PASS | Confirmed |
| tsumugu typo absent | PASS | grep found no "tsumugu" in any file |

All 5 agents are correctly named and documented. No naming violations found.

---

## 2. しきしま Display Name Migration Progress

### Target State

- Project display name: しきしま (or Shikishima)
- Repository name: hermes-desktop (HOLD — old name)
- Source code: ichikishima (HOLD — old name)
- Docs: docs/shikishima/ (NEW — correct)

### Current State

| Layer | Name Used | Alignment |
|---|---|---|
| docs/shikishima/ | しきしま ✓ | ALIGNED |
| docs/ichikishima/ | いちきしま / ichikishima (old) | NOT ALIGNED |
| src/main/ichikishima/ | ichikishima (old) | NOT ALIGNED |
| index.html | Hermes Agent | NOT ALIGNED |
| package.json | hermes-desktop | NOT ALIGNED |
| AGENTS.md content | Ichikishima / Hermes | NOT ALIGNED |
| CLAUDE.md content | Ichikishima / Hermes | NOT ALIGNED |
| repo directory | hermes-desktop | NOT ALIGNED |

### Assessment

The しきしま renaming is partially complete. Documentation (docs/shikishima/)
has been migrated correctly. Source code and metadata layers retain old names.
This is expected for v1.0.x — the audit correctly identifies the gap.

Recommendation: phase the source code rename as described in
NAMING_MIGRATION_CANDIDATES.md.

---

## 3. docs/static-only vs Execution Boundary

### Expected Boundary

- docs/shikishima/ = docs/static-only, no execution
- src/ = contains both upstream execution features AND shikishima static layer
- The shikishima custom layer should not add new execution capability

### Audit Results

| Check | Status | Notes |
|---|---|---|
| docs/shikishima/ contains no execution code | PASS | All files are .md or .html |
| docs/shikishima/ contains no fetch/WebSocket | PASS | HTML file has no external network calls |
| docs/shikishima/ contains no buttons/forms | PASS | Static display only |
| REAL_OPERATION_ROADMAP.html is static | PASS | No JS event handlers for execution |
| shikishima custom layer (ichikishima/) adds execution | PASS | No new exec capability; audit/approval adds safety only |

---

## 4. Hermes/いちきしま Old Name Compatibility Plan

### Options for Old Names

| Old Name | Usage Context | Recommendation |
|---|---|---|
| Hermes (upstream) | src/main/hermes.ts, installer.ts | KEEP — upstream dependency |
| Hermes Control Center | UI term in i18n | RENAME CANDIDATE → しきしま |
| ichikishima (source dir) | src/main/ichikishima/ | RENAME CANDIDATE → shikishima |
| いちきしま (docs) | docs/ichikishima/ | MERGE CANDIDATE → docs/shikishima/ |

### Timing Recommendation

- Do NOT rename upstream "Hermes" references (hermes.ts, HERMES_HOME, etc.)
- Prioritize cosmetic/docs renames first (Phase A and B in NAMING_MIGRATION_CANDIDATES.md)
- Delay source directory rename (Phase D) until clear scope and test coverage

---

## 5. しきしま Plan Phase Coverage in Docs

| Phase | Coverage | Status |
|---|---|---|
| Phase 0 (Setup) | REAL_OPERATION_ROADMAP.md/html | PASS |
| Phase 1 (Core arch) | SHIKISHIMA_SYSTEM_DIAGRAM.md | PASS |
| Phase 2 (Model routing) | MODEL_ROUTING_POLICY.md | PASS |
| Phase 3 (Agent permissions) | PHASE_3_AGENT_PERMISSION_REVIEW.md | PASS |
| Phase 4 (Model Router) | PHASE_4_MODEL_ROUTER_REVIEW.md | PASS |
| Phase 5 (しずめ gate) | PHASE_5_SHIZUME_POLICY_REVIEW.md | PASS |
| Phase 6 (つむぎ impl) | TSUMUGI_IMPLEMENTATION_WORKFLOW.md | PASS |
| Phase 7 (しるべ logging) | SHIRUBE_LOGGING_POLICY.md | PASS |
| Phase 8 (device roles) | DEVICE_ROLES_AND_BOUNDARIES.md | PASS |
| Phase 9 (StackChan/face) | STACKCHAN_EXPRESSION_ONLY_PLAN.md | PASS |
| Phase 10 (operation) | MINIMUM_OPERATION_RUNBOOK_DRAFT.md | PASS |
| v1.0.0 (static design review) | STATIC_DESIGN_REVIEW_PACKAGE.md | PASS |
| v1.0.1 (human review record) | V1_HUMAN_STATIC_REVIEW_RECORD.md | PASS |
| v1.1.0 (hygiene audit) | this document + REPOSITORY_HYGIENE_AUDIT.md | PASS |

All phases have documentation coverage.

---

## 6. Contradictions and Misalignments Found

| Item | Contradiction | Severity | Recommendation |
|---|---|---|---|
| docs/ichikishima/ exists alongside docs/shikishima/ | Two parallel doc dirs with different naming | MEDIUM | Plan merge; update src references first |
| AGENTS.md says "docs/ichikishima/" as normal work area | Contradicts migration to docs/shikishima/ | LOW | Update to docs/shikishima/ |
| src code "Control Center" UI term | Old term still in i18n files | LOW | Rename as part of Phase B |
| ControlCenterReadinessCard types contain READY_* labels | Could be misread as execution approval | MEDIUM | Add UI safety labeling |
| README.md says "Hermes Desktop" with upstream attribution | Correct for upstream; misaligned for しきしま rebranding | LOW | Add しきしま context note when rebranding |

No blocking contradictions. All items are rename/update candidates.

---

## 7. Overall Alignment Assessment

| Dimension | Alignment | Notes |
|---|---|---|
| 5-agent naming in docs | ALIGNED | All 5 agents correct |
| docs/static-only principle | ALIGNED | shikishima docs are static |
| HOLD / execution disabled state | ALIGNED | Confirmed throughout |
| Source code naming migration | IN PROGRESS | ichikishima → shikishima pending |
| Docs naming migration | IN PROGRESS | docs/ichikishima still exists |
| Safety gate (しずめ) presence | ALIGNED | Documented and src layer exists |
| No raw values | ALIGNED | Confirmed in audit |

---

## Safety Boundary

This review does not approve any execution, rename, or deletion.
All misalignment items remain HOLD pending separate human decisions.

この範囲では問題を検出していません。
