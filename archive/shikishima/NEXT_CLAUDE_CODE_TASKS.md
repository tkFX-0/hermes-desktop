# Next Claude Code Tasks

## Document Status

```text
roadmapVersion: v3.14.0
status: task_list_v1
date_created: 2026-05-14
```

## Priority Order

---

### Task 1: Session-007 Navigation Regression GO Draft

```text
purpose     : Accumulate clean B3 PASS #4 via navigation regression observation
scope       : docs-only GO template preparation + session execution when time_window provided
allowed     : read-only checks, app launch inside time_window, evidence creation, commit
forbidden   : source changes, push without GO, Level 3, execution enabled
evidence    : LOCAL_MVP_OPERATION_EVIDENCE_YYYY-MM-DD-007.md
STOP_criteria:
  - crash on any screen
  - raw value / secret visible
  - execution appears enabled
  - time_window expires
human_GO    : time_window required from human before launch
```

---

### Task 2: Session-008 Final B3 Clean PASS GO Draft

```text
purpose     : Accumulate clean B3 PASS #5 (completes 5/5 prerequisite)
scope       : choose observation angle (Option A/B/C), execute, evidence
allowed     : same as Task 1
forbidden   : same as Task 1
evidence    : LOCAL_MVP_OPERATION_EVIDENCE_YYYY-MM-DD-008.md
human_GO    : time_window + chosen angle required from human
```

---

### Task 3: B3 5/5 Acceptance Record Template

```text
purpose     : After Session-008 PASS, formally close the clean B3 5/5 milestone
scope       : docs-only acceptance record creation
allowed     : create acceptance md, update session history, update gap audit
forbidden   : push without GO, Level 3 approval
evidence    : LOCAL_MVP_OPERATION_ACCEPTANCE_B3_5_OF_5.md
human_GO    : acceptance confirmation from human
```

---

### Task 4: Japanese UI Surface Audit (docs only)

```text
purpose     : Prepare formal audit before implementation
scope       : docs-only, no source changes
allowed     : inspect i18n source, propose labels, create audit doc
forbidden   : edit i18n source files, run build, push without GO
evidence    : CONTROL_CENTER_JAPANESE_UI_SURFACE_AUDIT.md (already created 2026-05-14)
note        : audit doc already created; this task = formal acceptance + next step planning
human_GO    : acceptance of audit, then separate implementation GO
```

---

### Task 5: Japanese UI Minimal Implementation Plan

```text
purpose     : Define exact files to change, risk table, rollback plan
scope       : docs-only plan (no source edits yet)
allowed     : grep i18n source for key structure, create implementation plan doc
forbidden   : edit source, run build, push without GO
output      : JAPANESE_UI_IMPLEMENTATION_PLAN.md
human_GO    : plan acceptance, then implementation GO
```

---

### Task 6: Japanese UI Implementation GO Draft

```text
purpose     : Create exact GO wording for Japanese i18n implementation
scope       : i18n locale files only (ja/ namespace creation)
allowed     : create ja/controlCenter.ts, ja/navigation.ts, register in index.ts
forbidden   : change enum values, change logic, run npm without GO, push without GO
evidence    : typecheck PASS + build complete (requires npm run typecheck and build GO)
human_GO    : explicit implementation GO required
```

---

### Task 7: Japanese UI Regression Session Plan

```text
purpose     : B3 session to confirm Japanese labels visible and safety labels correct
scope       : B3 session (time_window GO required)
success     : Japanese labels visible, HOLD/disabled/false still showing
evidence    : LOCAL_MVP_OPERATION_EVIDENCE_YYYY-MM-DD-009.md
human_GO    : time_window GO after Japanese UI implementation + build
```

---

### Task 8: Level 3 Gap Closure Plan

```text
purpose     : Review LEVEL_3_GAP_AUDIT.md, identify remaining prerequisites, create closure plan
scope       : docs-only, read-only inspection
allowed     : update gap audit doc, create closure timeline
forbidden   : approve Level 3, push without GO
output      : LEVEL_3_GAP_CLOSURE_PLAN.md (update to LEVEL_3_GAP_AUDIT.md)
human_GO    : human reviews gap audit before Level 3 can be proposed
```

---

### Task 9: Level 3 GO Wording Draft

```text
purpose     : Prepare draft GO text for Level 3 controlled local operation
scope       : docs-only
allowed     : create draft, define Level 3 scope/forbidden/STOP conditions
forbidden   : approve Level 3, enable execution
output      : LEVEL_3_GO_WORDING_DRAFT.md
note        : Level 3 remains not approved until human issues the actual GO
human_GO    : human reviews wording, then issues actual Level 3 GO separately
```

---

### Task 10: 5-Agent Orchestration Practical MVP Plan

```text
purpose     : Define how 5-agent system will run in local MVP mode
scope       : docs-only planning
allowed     : inspect agent code structure, create plan doc
forbidden   : run agents, enable execution, push without GO
output      : AGENT_ORCHESTRATION_LOCAL_MVP_PLAN.md
human_GO    : plan acceptance + separate execution GO
```

---

## Execution Rule

```text
Tasks 1-3: execute in order; each needs time_window GO
Tasks 4-7: Japanese UI track; can start after B3 5/5 complete
Tasks 8-9: Level 3 track; start after B3 5/5 + human decision
Task 10  : agent track; independent, can start after Level 3 path is clear
```

---

この範囲では問題を検出していません
