# Final Shikishima Progress Loop

## Document Status

```text
roadmapVersion: v3.14.0
status: progress_loop_v1
date_created: 2026-05-14
```

## Core Rule

```text
Progress percent can only increase when evidence exists.
Plans alone do not increase percent.
Docs-only preparation may increase readiness, but not runtime completion.
```

---

## 1. Session Loop

```text
Step 1: Human provides time_window GO (AI cannot choose time_window)
Step 2: AI runs pre-run checks (branch / HEAD / staged / binary / build currency)
Step 3: AI launches app only after time_window has started
Step 4: Human observes and reports
Step 5: AI closes app
Step 6: AI runs post-run checks (staged=0 / diff=0 / commits_ahead unchanged)
Step 7: AI creates evidence file
Step 8: Human reviews and accepts/rejects
Step 9: AI creates acceptance record
Step 10: Push readiness check → Push GO → Push
```

---

## 2. Evidence Loop

```text
Every session produces:
  LOCAL_MVP_OPERATION_EVIDENCE_YYYY-MM-DD-NNN.md

Every acceptance produces:
  LOCAL_MVP_OPERATION_ACCEPTANCE_YYYY-MM-DD-NNN.md

Evidence classification:
  CLEAN_B3_PASS            → counts toward Level 3 prerequisites
  PASS_WITH_TIMING_CAVEAT  → does not count
  STOP_HANDLED_CORRECTLY   → evidence of working STOP detection
  STOP_ROOT_CAUSE_RESOLVED → evidence of self-resolution loop working
```

---

## 3. STOP Self-Resolution Loop

```text
When STOP is triggered:
  1. Close the app immediately
  2. Classify the STOP cause (from defined STOP_TYPE list)
  3. Check: is this resolvable within current docs/source scope?
  4. If docs-only fix: create remediation docs, commit
  5. If source fix: create implementation GO draft, commit docs
  6. If execution/push/Level3/device needed: stop at human GO boundary
  7. Create STOP evidence (no raw values)
  8. Generate next GO template with missing fields explicit
  9. Do not claim PASS on a STOP session
```

STOP is not failure. STOP is the safety gate working correctly.

---

## 4. Human GO Boundary Loop

```text
Human GO is required for:
  - any app launch (time_window GO)
  - any source code change
  - any npm/build/test run
  - any git push
  - Level 3 approval
  - robot/voice/device activation
  - external deploy

At each human GO boundary:
  - AI prepares the GO template with all known fields
  - AI leaves the ambiguous field (time_window / scope) for human to fill
  - Human fills in and sends
  - AI validates all fields before acting
  - AI does not proceed if any required field is missing or ambiguous
```

---

## 5. Progress Percentage Update Rule

```text
Percent increases only when:
  - Evidence file exists for the completed work
  - Evidence has been accepted by human
  - Acceptance record has been committed and pushed
  - The completed work maps to a defined phase gate

Percent does NOT increase when:
  - Plans are written
  - Docs are created but not accepted
  - Sessions are completed but evidence not accepted
  - STOP sessions occur (even if handled correctly)
```

---

## 6. Acceptance Record Rule

```text
Every session needs:
  human_acceptance_status: accepted_as_clean_b3_pass
                         OR accepted_with_timing_caveat
                         OR accepted_as_local_mvp_operation_evidence
                         OR rejected
                         OR needs_revision

Acceptance record is only created after human explicitly approves.
AI does not self-accept evidence.
```

---

## 7. Push Readiness Rule

```text
Before any push:
  1. Confirm branch = main
  2. Confirm HEAD = expected commit hash
  3. Confirm commits_ahead = expected count
  4. Confirm staged_files = 0
  5. Confirm actual_content_diff = 0
  6. Confirm changed files = docs-only scope
  7. Confirm no src/package/test changes
  8. Confirm no raw values in commits
  9. Confirm git_push_not_performed = true (pre-check)

If any check fails: STOP, classify cause, do not push.
```

---

## 8. Next-Session Planning Rule

```text
After each accepted session:
  1. Update cumulative session record
  2. Update clean_b3_pass_for_level3 count
  3. Check if next phase gate is reachable
  4. Prepare GO template for next session type
  5. Do not auto-schedule next session
  6. Wait for human to provide time_window
```

---

この範囲では問題を検出していません
