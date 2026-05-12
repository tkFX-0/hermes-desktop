# Shikishima v3 to v10 Human Decision Map — v2.8.0

## Purpose

Maps all decisions that require human action across v3–v10.
Agent cannot make these decisions. Human only.

- documentVersion: v2.8.0
- documentDate: 2026-05-12
- decision: HOLD / execution: disabled / productionReady: false

---

## Decision Map

### v3 Decisions

| Decision | When | Reference |
|---|---|---|
| Issue G-01 (tests/ichikishima commit) | After review | TOMORROW_TEST_COMMIT_REVIEW_SHEET.md |
| Issue G-02 (tests/hermes commit) | After review | TOMORROW_TEST_COMMIT_REVIEW_SHEET.md |
| Issue G-03 (typecheck:node) | After tests committed | TOMORROW_GO_HOLD_DECISION_SHEET.md |
| Issue G-04 (typecheck:web) | After G-03 | TOMORROW_GO_HOLD_DECISION_SHEET.md |
| Issue G-05 (eslint) | Anytime | TOMORROW_GO_HOLD_DECISION_SHEET.md |
| Issue G-08 (local-only value check) | After validation plan reviewed | V3_STATIC_VALIDATION_PLAN.md |
| Approve v4 entry | After v3 exit conditions met | V3_TO_V10_READY_CHECKLIST.md |

---

### v4 Decisions

| Decision | When | Reference |
|---|---|---|
| Issue G-06 (vitest) | After typecheck PASS | TOMORROW_GO_HOLD_DECISION_SHEET.md |
| Issue G-07 (build) | After typecheck PASS | V4_VALIDATION_COMMAND_MATRIX.md |
| Classify errors as blocker/warning | After validation results | V4_REDACTED_RESULT_CHECKLIST.md |
| Decide remediation scope | After classification | V4_FAILURE_TO_HOLD_RUNBOOK.md |
| Approve v5 entry | After v4 exit conditions | V3_TO_V10_READY_CHECKLIST.md |

---

### v5 Decisions

| Decision | When | Reference |
|---|---|---|
| Issue G-20 (local dev run) | After v4 complete | V5_DRY_RUN_APPROVAL_TEMPLATE.md |
| Confirm local-only boundary OK | After run | V5_LOCAL_ONLY_VALUE_BOUNDARY_CHECKLIST.md |
| Approve v6 entry | After v5 exit conditions | V3_TO_V10_READY_CHECKLIST.md |

---

### v6 Decisions

| Decision | When | Reference |
|---|---|---|
| Issue G-09 (dummy process) | After v5 complete | V6_WRAPPER_EXECUTION_GATE_CHECKLIST.md |
| Issue G-10 (wrapper) | After G-09 | V6_WRAPPER_EXECUTION_GATE_CHECKLIST.md |
| Issue G-11 (WSL) | After G-10 | V6_WSL_HERMES_STOP_CONDITIONS.md |
| Issue G-12 (Hermes) | After G-11 | V6_WSL_HERMES_STOP_CONDITIONS.md |
| Issue G-13 (RunPod) — if needed | After G-12 | REAL_OPERATION_HOLD_GATE_MATRIX.md |
| Approve v7 entry | After v6 exit conditions | V3_TO_V10_READY_CHECKLIST.md |

---

### v7 Decisions

| Decision | When | Reference |
|---|---|---|
| Hardware safety review (display-only) | Before G-14 | V7_STACKCHAN_NOT_CONNECTED_CHECKLIST.md |
| Issue G-14 (StackChan display) | After safety review | V7_DEVICE_DISPLAY_ONLY_READINESS_PACK.md |
| Confirm display-only (no motion) | During connection | V7_DISPLAY_ONLY_ROLLBACK_PLAN.md |
| Approve v8 entry | After v7 exit conditions | V3_TO_V10_READY_CHECKLIST.md |

---

### v8 Decisions

| Decision | When | Reference |
|---|---|---|
| Issue G-15 (voice I/O) — if needed | After v7 complete | V8_AUDIO_CAMERA_MIC_HOLD_POLICY.md |
| Issue G-16 (camera/mic) — if needed | After G-15 | V8_AUDIO_CAMERA_MIC_HOLD_POLICY.md |
| Validate animation concepts | After display | V8_MOUTH_PATTERN_REVIEW_SHEET.md |
| Approve v9 entry | After v8 exit conditions | V3_TO_V10_READY_CHECKLIST.md |

---

### v9 Decisions

| Decision | When | Reference |
|---|---|---|
| Approve pilot scenario definition | Before G-23 | V9_CONTROLLED_PILOT_RUNBOOK.md |
| Issue G-23 (single pilot run) | After scenario defined | V9_SINGLE_RUN_APPROVAL_TEMPLATE.md |
| Stop pilot if anomaly | During run | V9_PILOT_STOP_AND_ROLLBACK_CARD.md |
| Issue G-23 again for next run | After each run | One-run-only policy |
| Approve v10 entry | After v9 exit conditions | V3_TO_V10_READY_CHECKLIST.md |

---

### v10 Decisions

| Decision | When | Reference |
|---|---|---|
| Confirm all v3–v9 complete | Before G-18 | V10_PRODUCTION_READINESS_REVIEW_PACKAGE.md |
| Final safety audit | Before G-18 | V10_PRE_PRODUCTION_AUDIT_TEMPLATE.md |
| Issue G-18 (productionReady = true) | After all confirmed | V10_FINAL_HUMAN_APPROVAL_TEMPLATE.md |
| Issue G-19 (execution = enabled) | After G-18 | V10_FINAL_HUMAN_APPROVAL_TEMPLATE.md |

**G-18 and G-19 cannot be issued by any agent. Human only.**

---

## Summary: Decisions Agent Cannot Make

- Any GO issuance (G-01 through G-24)
- Any productionReady change
- Any execution enabled change
- Any stage entry approval
- Any pilot run approval
- Any hardware safety review conclusion
- Any final audit PASS conclusion

この範囲では問題を検出していません。
