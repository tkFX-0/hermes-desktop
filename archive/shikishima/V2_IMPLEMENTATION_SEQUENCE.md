# V2 Implementation Sequence — v1.3.1

## Purpose

Linear task sequence from v1.3.1 to v2.0, with HOLD gates explicitly marked.

- sequenceVersion: v1.3.1
- sequenceDate: 2026-05-12
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

---

## Sequence

```text
[DONE] v1.2.0 — Instruction naming migration (AGENTS.md/CLAUDE.md)
[DONE] v1.2.1 — Low-risk UI wording migration (HTML title, logo alt)
[DONE] v1.2.2 — Package metadata audit
[DONE] v1.2.3 — Package description migration
[DONE] v1.2.4 — ProductName display migration
[DONE] v1.2.5 — Package name migration plan
[DONE] v1.2.6 — Package-lock dirty state classification
[DONE] v1.2.7 — Src dirty files classification
[DONE] v1.2.8 — Group A safety hardening commit
[DONE] v1.2.9 — Group B untracked source audit
[DONE] v1.2.10 — Group B pre-feature cleanup
[DONE] v1.2.11 — Group B feature commit
[DONE] v1.3.0 — Package name migration (EXECUTED)
[CURRENT] v1.3.1 — Post-migration reference audit + V2 goal task pack

──── HOLD GATE: untracked inventory decisions ────────────────────────

v1.4.0 — Sandbox .gitignore audit
  - Safe: audit-only + .gitignore update
  - No staging of sandbox content
  - Deliverable: .gitignore rule additions, SANDBOX_GITIGNORE_AUDIT.md

──── HOLD GATE: test content review ─────────────────────────────────

v1.5.0 — tests/ichikishima Review Package (HUMAN GO REQUIRED)
  - Audit: dummy-hermes-path.ts, process-local test review
  - Decision: commit all / commit partial / HOLD
  - Deliverable: TESTS_ICHIKISHIMA_REVIEW.md + commit if approved

v1.5.1 — tests/hermes Review and Commit (depends on v1.5.0)
  - 12 autonomy-zone tests
  - Deliverable: test commit if approved

──── HOLD GATE: legacy docs scope decision ───────────────────────────

v1.6.0 — docs/ichikishima Migration Plan (HUMAN GO REQUIRED for execution)
  - 127 legacy docs; merge or archive scope
  - Plan-only task is safe; execution needs GO
  - Deliverable: DOCS_ICHIKISHIMA_MIGRATION_PLAN.md

──── HOLD GATE: Phase D src rename ──────────────────────────────────

v1.7.0 — Phase D src Rename Plan (plan-only, safe)
  - Document all import paths, file counts, risk matrix
  - Deliverable: PHASE_D_SRC_RENAME_PLAN.md
  - DOES NOT execute rename

v1.7.1 — Phase D src Rename Execution (EXPLICIT HUMAN GO REQUIRED)
  - ichikishima → shikishima rename across src/main, src/shared, src/preload
  - All imports must be updated
  - Must run typecheck after rename (typecheck is unblocked for this specific task)
  - Deliverable: rename commits + post-rename typecheck verification

v1.8.0 — Phase D Post-Rename Reference Audit
  - Verify no broken imports, no residual ichikishima references in src
  - Deliverable: POST_PHASE_D_REFERENCE_AUDIT.md

──── HOLD GATE: Phase E repo rename ─────────────────────────────────

v1.9.0 — Phase E GitHub Repo Rename Plan (plan-only, safe)
  - Plan: publish.repo, dev-app-update.yml repo, external URLs
  - Requires GitHub repo rename as external action
  - Deliverable: PHASE_E_REPO_RENAME_PLAN.md

v1.9.1 — Phase E Rename Execution (EXTERNAL ACTION + EXPLICIT GO)
  - GitHub repo rename (external)
  - electron-builder.yml publish.repo update
  - dev-app-update.yml repo update
  - Deliverable: post-rename verification

──── v2.0 READINESS ────────────────────────────────────────────────

v2.0 — Shikishima v2 Readiness Package
  - Consolidate all v1.3.x decisions
  - Document what is complete, what is deferred, what is the next phase
  - NOT productionReady
  - NOT GO approval
  - Deliverable: V2_READINESS_PACKAGE.md
```

---

## HOLD Gate Decision Points

| Gate | Location in sequence | Condition to proceed |
|---|---|---|
| Untracked inventory | between v1.3.1 and v1.4.0+ | decisions documented |
| Test content review | v1.5.0 | human reviews dummy-hermes-path.ts |
| Phase D execution | v1.7.1 | explicit human GO after v1.7.0 plan |
| Phase E execution | v1.9.1 | explicit human GO + GitHub repo rename |
| v2.0 completion | v2.0 | all prior tasks done or formally deferred |

---

## Typecheck/Build Gate

`typecheck`, `eslint`, and `build` are currently HOLD.
Exception: typecheck may be unblocked specifically for v1.7.1 post-rename
verification. This exception requires explicit approval in the v1.7.1 task.

---

## git push Gate

All commits in v1.3.x are local-only. git push requires separate explicit
approval per push. No sequence step auto-approves push.

この範囲では問題を検出していません。
