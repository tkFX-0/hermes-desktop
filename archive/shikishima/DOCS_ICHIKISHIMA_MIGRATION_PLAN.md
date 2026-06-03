# docs/ichikishima Migration Plan 窶・v1.6.0

## Plan Overview

- planVersion: v1.6.0
- planDate: 2026-05-12
- planType: plan-only / docs-static-only
- roadmapVersion: v1.6.0
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

No files in `docs/ichikishima/` were moved, renamed, deleted, or committed.

---

## Current State

`docs/ichikishima/` contains 127 files 窶・legacy implementation documentation
written during development of the ichikishima/shikishima system.

---

## Content Classification

### Category A 窶・Architecture Decision Records (ADRs)

| Pattern | Count (est.) | Disposition |
|---|---|---|
| `ADR_*.md` | 2 | Archive 窶・valuable historical decisions |

Files: `ADR_CONTROL_CENTER_IPC_VS_LOCAL_HTTP.md`, `ADR_REAL_HERMES_WSL2_CONNECTION.md`

**Recommendation: Archive in docs/ichikishima/ or merge summary into docs/shikishima/**

---

### Category B 窶・ControlCenter Specifications

| Pattern | Count (est.) | Disposition |
|---|---|---|
| `CONTROL_CENTER_*.md` | ~20 | Partially superseded by implementation |

These specs describe the ControlCenter system that is now implemented in
`src/main/ichikishima/control-center/`. Most specs are superseded by actual code
and tests. Key specs may still be referenced for future development.

**Recommendation: Keep as legacy archive; do not merge into docs/shikishima/**

---

### Category C 窶・Hermes Bridge / WSL2 Wrapper Specs

| Pattern | Count (est.) | Disposition |
|---|---|---|
| `HERMES_BRIDGE_*.md` | ~10 | Superseded by implementation |
| `HERMES_WSL2_WRAPPER_*.md` | ~8 | Contains human value fill-in runbooks |
| `HERMES_REAL_*.md` | ~5 | Execution pilot specs |

**Special note on `HERMES_WSL2_WRAPPER_LOCAL_VALUE_FILL_IN_RUNBOOK.md`
and `HERMES_WSL2_WRAPPER_VALUE_CONFIRMATION.md`:**
These may contain human action checklists for filling in local values.
They reference the sandbox/ human value packet workflow.
These should be reviewed before moving 窶・they may reference local paths.

**Recommendation: Keep as legacy archive; human-value runbooks need redaction review**

---

### Category D 窶・Implementation Plans and Handoffs

| Pattern | Count (est.) | Disposition |
|---|---|---|
| `IMPLEMENTATION_*.md` | 3 | Historical plans |
| `*_HANDOFF.md` | 1 | Handoff notes |
| `GOAL_COMPLETION_REPORT.md` | 1 | Milestone record |
| `FINAL_READINESS_MATRIX.md` | 1 | Pre-implementation gate check |

**Recommendation: Archive 窶・historical context only**

---

### Category E 窶・Autonomy Zone and Safety Docs

| Pattern | Count (est.) | Disposition |
|---|---|---|
| `AUTONOMY_AND_SAFETY.md` | 1 | May still be relevant |
| `HERMES_AUTONOMY_ZONE_*.md` | ~3 | Zone runbook/checklist |
| `HERMES_ALLOWED_EXECUTABLE_TEMPLATE.md` | 1 | Allowed executable policy |

**Recommendation: Review for ongoing relevance; possibly merge summary into docs/shikishima/**

---

### Category F 窶・Agent and Visualization Specs

| Pattern | Count (est.) | Disposition |
|---|---|---|
| `AGENT_TEAM_*.md` | 3 | Agent architecture specs |
| `AGENT_SCHEDULER_CONTRACT.md` | 1 | Contract spec |
| `AGENT_VISUALIZATION_*.md` | 3 | Visualization concept |
| `SUPPRESSIVE_AGENT_ARCHITECTURE.md` | 1 | Architecture doc |

**Recommendation: Archive 窶・superseded by actual implementation**

---

### Category G 窶・Operation Protocols and Reviews

| Pattern | Count (est.) | Disposition |
|---|---|---|
| `CURSOR_*.md` | 3 | Cursor IDE operation protocols |
| `MORNING_REVIEW_*.md` | 2 | Daily review logs |
| `OBSIDIAN_PROGRESS_*.md` | 1 | Progress log |
| `GO_POLICY_REVIEW_REPORT.md` | 1 | GO policy review |
| `DATE_CONSISTENCY_NOTES.md` | 1 | Date tracking notes |

**Recommendation: Archive 窶・operation logs; delete candidate after archival**

---

### Category H 窶・Memory and Orchestrator Specs

| Pattern | Count (est.) | Disposition |
|---|---|---|
| `MEMORY_*.md` | 4 | Memory design/spec |
| `ICHIKISHIMA_*.md` | 4 | Core concept/orchestrator/review/shadow specs |

**Recommendation: Archive 窶・superseded by implementation**

---

### Category I 窶・mockups/ subdirectory

Mockups (images or diagrams) for UI design.

**Recommendation: Archive 窶・historical design materials**

---

### Category J 窶・Other / Miscellaneous

`NEXT_GOALS.md`, `APP_ONLY_OPERATION_*.md`, `LOCAL_CLOUD_ESCALATION_POLICY.md`,
`WINDOWS_APP_PACKAGING_PLAN.md`, `SPEAK_VALUE_SCORE_SPEC.md`, `MEMORY_CANDIDATE_SPEC.md`

**Recommendation: Archive individually; `NEXT_GOALS.md` may have some relevance**

---

## Migration Options

### Option 1: Keep as Legacy Archive (Recommended)

- Leave `docs/ichikishima/` as-is, untracked
- Commit to repo with a single "archive" commit
- No content is moved or deleted
- Accessible for reference but not merged into docs/shikishima/

**Risk: LOW 窶・straightforward, no content changes**
**Note: Committing 127 files is a large commit**

---

### Option 2: Selective Merge into docs/shikishima/

- Move ADRs and key safety docs to docs/shikishima/
- Archive or delete the rest
- Rename references from "ichikishima" to "shikishima" where appropriate

**Risk: MEDIUM 窶・requires careful selection and review**
**Note: Content moves should be coordinated with Phase D src rename**

---

### Option 3: Delete entirely

- All specs are superseded by implementation and tests
- Delete docs/ichikishima/ without committing

**Risk: LOW 窶・but loses historical context**
**Note: Requires explicit human approval**

---

## Recommended Approach

**Recommended: Option 1 (Legacy Archive)**

1. Commit `docs/ichikishima/` as a single archive commit with subject:
   `docs: archive ichikishima legacy implementation docs`
2. Keep all content as-is 窶・no merging, no renaming
3. The directory remains accessible for historical reference
4. Phase D src rename can proceed independently

**Pre-commit review for option 1:**
- Review `HERMES_WSL2_WRAPPER_LOCAL_VALUE_FILL_IN_RUNBOOK.md` for redacted content
- Review `HERMES_WSL2_WRAPPER_VALUE_CONFIRMATION.md` for local values
- If any file contains unredacted local-only values, redact or exclude before committing

---

## Phase D Relationship

`docs/ichikishima/` migration does NOT need to wait for Phase D src rename.
However, if Phase D renames `src/main/ichikishima/` 竊・`src/main/shikishima/`,
some docs may reference old source paths. This is acceptable in a legacy archive 窶・the docs describe historical implementation.

---

## HOLD Status

This plan is docs-only. Execution (committing docs/ichikishima/) is HOLD pending:
1. Human scope decision (Option 1 / 2 / 3)
2. Brief review of WSL wrapper human-value runbooks for redacted content

縺薙・遽・峇縺ｧ縺ｯ蝠城｡後ｒ讀懷・縺励※縺・∪縺帙ｓ縲・
