# Shikishima Roadmap Changelog

## Purpose

This file records visible roadmap-affecting changes for the Shikishima plan.
Roadmap changes are documentation updates only. They are not execution approval,
not GO, and not production readiness.

## Current Roadmap Version

- roadmapVersion: v2.9.5
- lastUpdated: 2026-05-14
- latestUpdate: Validation evidence accepted for review only
- baselineCommit: 181389df175d8db7241ebc13d4d3b20d66812b76
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

## Update Policy

Every future roadmap-affecting change must update:

- `roadmapVersion`
- `lastUpdated`
- `latestUpdate`
- `ROADMAP_CHANGELOG.md`
- the visible HTML changelog section in `REAL_OPERATION_ROADMAP.html`

Roadmap updates are not execution approval. Changelog updates are not GO.

## v2.9.5 - Validation Evidence Accepted For Review Only

- Recorded human acceptance of G-05 ESLint, G-03/G-04 typecheck, G-06 vitest, and G-07 local build evidence as review evidence only.
- Clarified that Pre-Operation Readiness Gate review may continue.
- No GO, execution, productionReady true, git push, deploy, Cloudflare, WSL/Hermes/wrapper, robot/voice/camera/mic, secret, raw value, local-only value, or repo-external write was approved.
- HOLD remains current. execution remains disabled. productionReady remains false.

## v2.9.4 - Human Review Decision Sheet Wording Clarification

- Clarified that `--quiet` suppresses ESLint warnings and that no blocking ESLint errors were reported.
- Clarified that operational gates beyond accepted validation evidence remain HOLD unless individually approved.
- HOLD remains current. execution remains disabled. productionReady remains false.
- git push, Cloudflare, OpenSpec CLI, npm install, npx, device operation, and production readiness remain not approved.

## v2.9.3 - Pre-Operation Readiness Candidate Package

- Added `HUMAN_REVIEW_DECISION_SHEET.md` for explicit human review decisions.
- Added `PRE_OPERATION_READINESS_GATE.md` to define the pre-operation gate and STOP conditions.
- Added `CONTROLLED_PILOT_PLAN.md` as a design-only pilot plan.
- Pre-Operation Readiness Candidate may be reviewed by a human, but it is not operation approval.
- HOLD remains current. execution remains disabled. productionReady remains false.
- git push, Cloudflare, OpenSpec CLI, npm install, npx, device operation, and production readiness remain not approved.

## v2.9.2 - Human Review Ready Candidate Package

- Added `HUMAN_REVIEW_READY_PACKAGE.md` to summarize the reviewable local validation candidate state.
- Added `VALIDATION_PASS_CANDIDATE_SUMMARY.md` to record G-05/G-06/G-07 PASS candidate evidence.
- Updated roadmap/status docs so Human Review Ready Candidate is visible as review support only.
- G-05 ESLint, typecheck reconfirmation, G-06 vitest, and G-07 local build are PASS candidates for human review.
- HOLD remains current. execution remains disabled. productionReady remains false.
- git push, Cloudflare, OpenSpec CLI, npm install, npx, device operation, and production readiness are not approved.

## v2.9.1 - Tomorrow Review Package Sync

- Synced Tomorrow review package docs (`TOMORROW_DEBUG_AND_REVIEW_PACKAGE.md`, `TOMORROW_GO_HOLD_DECISION_SHEET.md`, `TOMORROW_TEST_COMMIT_REVIEW_SHEET.md`) to reflect the current top roadmapVersion: v2.9.0.
- Clarified that G-01/G-02/G-03 are not approved, and operational gates beyond accepted validation evidence remain HOLD unless individually approved.
- DocumentVersion of those sheets remains v2.7.0, but the current v2.9.0 state is authoritative.
- execution remains disabled, productionReady is false, and no git push was performed.

## v2.9.0 - V10 Preparation Package Completed

- Task A (v2.8.0): V3_TO_V10_IMPLEMENTATION_COMPLETION_PACK.md + READY_CHECKLIST + HUMAN_DECISION_MAP + DEBUG_FLOW. Full DONE/READY/AFTER-GO/HOLD status per stage.
- Task B (v2.8.1): V4 local validation prep — command matrix; redacted result checklist; failure-to-HOLD runbook.
- Task C (v2.8.2): V5 dry-run prep — local-only value boundary; G-20 approval template; rollback runbook.
- Task D (v2.8.3): V6 WSL/Hermes/wrapper readiness — gate checklists G-09–G-12; stop conditions; redacted report templates.
- Task E (v2.8.4): V7 device display-only — StackChan not-connected checklist; face terminal static UI review; rollback plan.
- Task F (v2.8.5): V8 non-I/O expressions — mouth/eye/voice intent review sheets; audio/camera/mic HOLD policy.
- Task G (v2.8.6): V9 pilot — final prep; one-run-only checklist; human monitoring checklist; stop and rollback card.
- Task H (v2.8.7): V10 — final review pack; false confirmation; not-yet-granted notice; release blocker matrix; audit template.
- Task I (v2.9.0): HTML v10 readiness board + new nav section; roadmap v2.9.0; 37 docs total across v2.8.x.
- Renderer src: HOLD — not modified; all HTML additions are static display-only.
- productionReady: false. G-18/G-19: not issued. Current Level: 0.

## v2.7.0 - Non-Execution Implementation Package Completed

- Task A (v2.3.0): V3_STATIC_VALIDATION_PLAN.md + V3_DUMMY_WRAPPER_EXECUTION_PLAN.md + V3_WSL_HERMES_EXECUTION_PLAN.md + V3_REDACTED_RESULT_REVIEW_TEMPLATE.md + V3_TOMORROW_DEBUG_RUNBOOK.md
- Task B (v2.4.0): REAL_OPERATION_ROADMAP.html: 4 new sections (Operation Path v3→v10, HOLD Gate Board G-01–G-24, Autonomy Ladder Level 0–9, Human Review Checklist)
- Task C (v2.5.0): V7_FACE_TERMINAL_DISPLAY_ONLY_SPEC.md + V7_STACKCHAN_DISPLAY_ONLY_PLAN.md + V7_FACE_TERMINAL_STATIC_PREVIEW.md + V8_MOUTH_EYE_ANIMATION_SPEC.md + V8_VOICE_MOUTH_EYE_NON_IO_PLAN.md
- Task D (v2.6.0): V9_CONTROLLED_PILOT_RUNBOOK.md + V9_SINGLE_RUN_APPROVAL_TEMPLATE.md + V10_PRODUCTION_READINESS_REVIEW_PACKAGE.md + V10_FINAL_HUMAN_APPROVAL_TEMPLATE.md + PRODUCTION_READY_FALSE_GUARD.md
- Task E (v2.7.0): TOMORROW_DEBUG_AND_REVIEW_PACKAGE.md + TOMORROW_GO_HOLD_DECISION_SHEET.md + TOMORROW_COMMAND_EXECUTION_BOUNDARY.md + TOMORROW_STACKCHAN_BOUNDARY_CHECK.md + TOMORROW_TEST_COMMIT_REVIEW_SHEET.md
- Renderer src: HOLD — not modified (display-only addition deferred; no main/preload/IPC changes)
- No commands executed; no tests staged; HOLD maintained throughout

## v2.2.0 - Real Operation Path Fully Defined

- Added `REAL_OPERATION_MASTER_ROADMAP.md` — authoritative v3–v10 master roadmap; productionReady false at every stage; G-18 only path to true.
- Added `V3_TO_V10_TASK_TREE.md` — hierarchical task breakdown v3–v10; docs/code/cmd/hw classified.
- Added `REAL_OPERATION_HOLD_GATE_MATRIX.md` — comprehensive G-01–G-24 matrix; GO/STOP/rollback for each.
- Added `HUMAN_REVIEW_DAY_RUNBOOK.md` — step-by-step runbook for human reviewer; G-01/G-02/G-03 decision guidance.
- Added `PRODUCTION_READY_DEFINITION.md` — productionReady true definition; sole path = G-18; what does NOT set it.
- Added `CONTROLLED_PILOT_DEFINITION.md` — controlled pilot vs real operation; single-run; immediate stop; no auto-repeat.
- Added `SAFE_AUTONOMY_LADDER.md` — Level 0–9 with GO conditions; current level = 0; downgrade always allowed.
- Added `DEVICE_AND_ROBOT_INTEGRATION_GATE.md` — face terminal / StackChan / voice / camera / robotMotion as separate gates.
- Added `V3_IMPLEMENTATION_BACKLOG.md` — READY/AFTER-GO/AFTER-STAGE classified backlog; priority order for next session.
- Added `REAL_OPERATION_ROLLBACK_AND_INCIDENT_PLAN.md` — P0/P1/P2/P3 incident response; GO→HOLD revert; emergency stop concept.
- v2.2.0 is NOT productionReady, NOT GO approval, NOT execution approval.

## v2.1.0 - V3 Goal and Real Operation Path

- Added `V3_GOAL_AND_TASK_PACK.md` — v3.x goal statement + task list (v3.0–v3.9) with HOLD gates.
  - v3.x is NOT productionReady, NOT GO approval, NOT execution approval.
  - v3.x is "execution validation readiness stage."
- Added `V3_EXECUTION_VALIDATION_ROADMAP.md` — staged execution path (S-0 to S-12) with GO/STOP conditions + redaction policy.
- Added `V3_HOLD_GATE_MATRIX.md` — 19 HOLD gates (G-01 through G-19) with GO conditions and human confirmation items.
- Added `V3_IMPLEMENTATION_SEQUENCE.md` — linear sequence v3.0–v3.9 with HOLD gates.
- Added `REAL_OPERATION_PATH_TO_PRODUCTION.md` — v3 through v10 staged roadmap; productionReady false at every stage until final separate approval.
- Added `V3_TEST_COMMIT_DECISION_MATRIX.md` — commit/HOLD/split decisions for tests/ichikishima/ + tests/hermes/; no staging performed.
- Added `V3_HUMAN_GO_CHECKLIST.md` — 19 discrete GO checklists; each independent; no agent can issue GO.
- v3.x tasks not started. tests not staged. validation not executed. HOLD maintained.

## v2.0 - Shikishima v2 Readiness Package

- Added `V2_READINESS_PACKAGE.md` — v2.0 goal completion assessment. All v2.0 tasks DONE.
  - Naming: package.json name, productName, description, HTML title, instruction files, zh-CN label — all complete.
  - ControlCenter + Research: committed in v1.2.11. IPC read-only confirmed.
  - Test candidates: review packages created (v1.5.0–v1.5.1). Commit HOLD — human GO required.
  - Untracked files: classified + mitigated (v1.3.1–v1.4.0). sandbox/ gitignored.
  - Migration plans: Phase D (v1.7.0) + Phase E (v1.9.0) plans created. Execution HOLD.
- Added `V2_REMAINING_HOLD_ITEMS.md` — all HOLD items classified (H-1 through H-5).
- Added `V3_EXECUTION_VALIDATION_PRECONDITIONS.md` — 4 minimum preconditions for v3.x.
- v2.0 is NOT productionReady. NOT GO approval. NOT execution approval.
- v2.0 closes the v2.0 goal: v3.x execution validation prerequisites documented.
- Remaining HOLD: tests commit (H-1), Phase D (H-2), Phase E (H-3), docs archive (H-4), appId (H-5).

## v1.9.0 - Phase E repo Rename Plan

- Added `PHASE_E_REPO_RENAME_PLAN.md` — plan-only / no-external-action.
  - Targets: `electron-builder.yml publish.repo`, `dev-app-update.yml repo`.
  - External action required: GitHub repo rename (must happen first).
  - `appId` must remain unchanged — changing breaks existing OS installations.
  - Recommended order: Phase D first, then Phase E.
- Added `PHASE_E_EXTERNAL_REFERENCE_MATRIX.md` — all hermes-desktop external refs classified.
- v1.7.1 (Phase D execution): HOLD / deferred — not executed in this session.
- v1.8.0 (post Phase D audit): deferred until Phase D executes.
- Phase E execution (v1.9.1) remains HOLD — explicit human GO + external GitHub action required.

## v1.7.0 - Phase D src Rename Plan

- Added `PHASE_D_SRC_RENAME_PLAN.md` — plan-only / no-rename-executed.
  - Targets: src/main/ichikishima/(82) → shikishima/, src/shared/ichikishima/(2), preload/ichikishima-control-center.ts.
  - Import paths: ~304 updates across src/ and tests/.
  - `ichikishimaControlCenter` window key: UNCHANGED in Phase D-1 (breaking change deferred to D-2).
  - Typecheck exception: allowed specifically for v1.7.1 pre-flight and post-rename verification.
- Added `PHASE_D_RENAME_IMPACT_MATRIX.md` — import path matrix + identifiers KEEP/RENAME.
- Phase D execution (v1.7.1) remains HOLD — explicit human GO required. No rename executed.

## v1.6.0 - docs/ichikishima Migration Plan

- Added `DOCS_ICHIKISHIMA_MIGRATION_PLAN.md` — plan-only / no-move-delete.
- 127 legacy docs classified: ADRs(2), ControlCenter specs(~20), Hermes specs(~23), impl plans(3), autonomy-zone(~4), agent/visualization(~7), operation logs(~7), memory/orchestrator(~5), mockups, misc.
- WSL2 wrapper human-value runbooks flagged for redaction review before commit.
- Recommended: Option 1 (legacy archive) — commit as-is without moving/deleting.
- docs/ichikishima/ not staged. No move/delete/rename. HOLD pending scope decision.

## v1.5.1 - tests/hermes Review Package

- Added `TESTS_HERMES_REVIEW_PACKAGE.md` — audit-only / no-test-execution.
- 12 test files in `tests/hermes/zone/`: config, denylist, path-guard, read/write policy, wrappers, delete-wrapper, operation-blocks, approval-request, smoke, pilot.
- Subsystem: autonomy-zone (hermes-zone) — separate from tests/ichikishima/.
- All 12 tests: LOW to LOW-MEDIUM risk. Smoke and pilot tests: review CI guard before commit.
- Can be committed independently of tests/ichikishima/ or in same session.
- No tests executed. No test files staged. HOLD remains current.

## v1.5.0 - tests/ichikishima Review Package

- Added `TESTS_ICHIKISHIMA_REVIEW_PACKAGE.md` 窶・audit-only / no-test-execution.
- 66 test files classified by subsystem: agent-team(7), approval(5), audit(2), control-center(14), core(3), hermes(21), memory(1), orchestrator(1), pilot(1), review(2), sandbox(3), visualization(3).
- `sandbox/dummy-hermes-path.ts`: fixture 窶・SAFE to commit (path constant only).
- `sandbox/dummy-hermes-stub-design.process-local.test.ts`: SAFE 窶・always skipped in CI; `RUN_DUMMY_HERMES_LOCAL_PROCESS=1` required + `CI!=true`.
- `hermes-real-pilot-minimal.test.ts` and `hermes-real-process-adapter.test.ts`: MEDIUM 窶・brief review recommended before commit.
- Overall verdict: tests/ichikishima/ is commit-ready as a unit pending human GO.
- No tests executed. No test files staged. HOLD remains current.

## v1.4.0 - Sandbox .gitignore Audit

- Added `SANDBOX_GITIGNORE_AUDIT.md`.
- Updated `.gitignore`: added `sandbox/`, `.cursor/`, `.claude/scripts/`, `.claude/settings.json`, `.claude/settings.local.json`.
- `sandbox/` (~4,553 files) now fully ignored 窶・prevents accidental stage.
- `.cursor/` and `.claude/` tool config dirs now ignored.
- No sandbox or tool config files staged/committed.
- HOLD remains current. No git push.

## v1.3.1 - V2 Goal and Task Pack

- Added `POST_V1_3_0_REFERENCE_AUDIT.md` 窶・post-migration reference audit.
  - hermes-desktop: DONE (package/lockfile/updater), KEEP (publish.repo/dev-app-update repo), HOLD (appId/executableName/Phase D-E).
- Added `UNTRACKED_WORKTREE_INVENTORY.md` 窶・untracked worktree classification.
  - tests/ichikishima/ (69): HOLD (human review). tests/hermes/ (12): HOLD.
  - docs/ichikishima/ (127): legacy docs HOLD. sandbox/ (~4,553): local-only HOLD.
  - .claude/, .cursor/: local tool config 窶・never commit.
- Added `V2_GOAL_AND_TASK_PACK.md` 窶・v2.0 goal definition + task list v1.3.1竊致2.0.
- Added `V2_HOLD_GATE_MATRIX.md` 窶・all HOLD gates with GO conditions.
- Added `V2_IMPLEMENTATION_SEQUENCE.md` 窶・linear task sequence with HOLD gates.
- v2.0 goal: naming/ControlCenter/Research/tests/untracked organized; v3.x-ready.
- v2.0 is NOT productionReady, NOT GO approval, NOT execution approval.
- Phase D (src rename) and Phase E (repo rename) remain HOLD.
- HOLD remains current. execution remains disabled. No git push.

## v1.3.0 - Package Name Migration

- `package.json` name: `hermes-desktop` 竊・`shikishima-desktop`.
- `package-lock.json` root name: synced via `npm install --package-lock-only`.
  - Also resolved pre-existing version stamp drift (`0.2.2` 竊・`0.2.3`).
  - 6 `inBundle+dev+optional` sub-entries added (reconciliation, no new deps).
- `dev-app-update.yml` updaterCacheDirName: `hermes-desktop-updater` 竊・`shikishima-desktop-updater`.
- `publish.repo` and `dev-app-update.yml repo`: UNCHANGED (`hermes-desktop` 窶・external GitHub URL).
- `electron-builder.yml productName`: UNCHANGED (`縺励″縺励∪`).
- `appId`: UNCHANGED (`com.nousresearch.hermes`).
- `dependencies`, `scripts`, `build config`: UNCHANGED.
- Artifact filenames (`${name}`): now resolve to `shikishima-desktop-*`.
- NAMING_MIGRATION_CANDIDATES.md Phase C-3 marked DONE.
- PACKAGE_NAME_MIGRATION_PLAN.md: execution record added.
- PACKAGE_METADATA_AUDIT.md: name field updated to reflect migration.
- HOLD remains current. execution remains disabled. productionReady: false. No git push.

## v1.2.11 - Group B Feature Commit

- Committed Group B feature (commit `1f168b9`):
  - Subject: `feat(cc): add ControlCenter IPC bridge and Research screen navigation`
  - 92 files changed: 6 tracked modifications + 86 new source files
  - src/main/ichikishima/ (82 files): full ichikishima agent system
  - src/preload/ichikishima-control-center.ts: read-only IPC bridge (1 method)
  - src/renderer/src/screens/Research/Research.tsx: local dashboard iframe screen
  - src/shared/ichikishima/ (2 files): IPC channel constant + UI contract
  - Tracked modified: index.ts (main+preload), index.d.ts, Layout.tsx, i18n/index.ts, en/navigation.ts
- ControlCenter IPC: read-only only; no execution channels; secrets excluded from snapshot payload.
- tests/ichikishima/ (69 files): excluded 窶・separate commit candidate.
- Remaining dirty (post-commit): `package-lock.json` version stamp only (non-blocker for v1.3.0).
- Remaining untracked: tests/ichikishima/, tests/hermes/, docs/ichikishima/, sandbox/, .claude/, .cursor/.
- v1.3.0 Package Name Migration: tracked working tree is now clean (package-lock auto-resolves).
- v1.3.0 GO: NOT YET approved. Requires separate human GO decision.
- HOLD remains current. execution remains disabled. No git push.

## v1.2.10 - Group B Pre-Feature Cleanup

- Fixed zh-CN `navigation.ts` `research` label: `"繝ｪ繧ｵ繝ｼ繝・` 竊・`"Research"`.
  Consistent with `controlCenter: "Control Center"` pattern.
- Confirmed `tests/ichikishima/` exists with 69 test files (all untracked).
  Decision: commit tests separately from Group B feature commit (v1.2.11).
  Note: `dummy-hermes-path.ts` and `dummy-hermes-stub-design.process-local.test.ts`
  contain "process-local" in names 窶・review before committing tests.
- `GROUP_B_UNTRACKED_SOURCE_AUDIT.md` updated: zh-CN finding PASS; tests caveat added.
- `SRC_DIRTY_FILES_CLASSIFICATION.md` updated: zh-CN CAUTION 竊・PASS.
- Group B feature commit itself: NOT performed. Proceeds in v1.2.11.
- Untracked source not staged. tests/ichikishima/ not staged.
- HOLD remains current. execution remains disabled. No git push.

## v1.2.9 - Group B Untracked Source Audit

- Added `GROUP_B_UNTRACKED_SOURCE_AUDIT.md` 窶・audit-only / report-only / redacted-only.
- Confirmed already-tracked (no staging needed): `ControlCenterAppShell.tsx`,
  `controlCenter.ts` i18n locale files (en + zh-CN).
- Untracked source required for Group B commit:
  - `src/main/ichikishima/` (~72 files) 窶・core agent system
  - `src/preload/ichikishima-control-center.ts` (20 lines) 窶・read-only IPC bridge
  - `src/renderer/src/screens/Research/Research.tsx` (47 lines) 窶・local dashboard screen
  - `src/shared/ichikishima/` (2 files) 窶・IPC channel + type contract
- control-center-readonly-ipc.ts confirmed: read-only only, no execution channels.
- control-center-app-snapshot.ts confirmed: excludes raw keys/secrets/paths.
- Research.tsx: standalone, depends on local web server, graceful degradation.
- **zh-CN `research: "繝ｪ繧ｵ繝ｼ繝・` confirmed placeholder** 窶・fix to `"Research"` before commit.
- Recommended: single feature commit after zh-CN fix; tests/ichikishima/ separate.
- `SRC_DIRTY_FILES_CLASSIFICATION.md` Group B section updated with v1.2.9 findings.
- No source files modified. No commit/revert. No build/test. No git push.
- HOLD remains current. execution remains disabled.

## v1.2.8 - Group A Safety Hardening Committed

- Committed Group A safety hardening files (commit `0b5e3fa`):
  - `.gitignore`: add local-only WSL wrapper config paths, add `.task-start-time.local.txt`, fix missing newline.
  - `src/main/claw3d.ts`: add `windowsHide: true` to 5 spawn/execFile calls.
  - `src/main/installer.ts`: add `windowsHide: true` to 4 spawn/execFile calls; BOM (EF BB BF) removed before commit.
- Commit subject: `chore: harden local safety process spawning`.
- `SRC_DIRTY_FILES_CLASSIFICATION.md` Group A entries updated to DONE.
- `PACKAGE_NAME_MIGRATION_PLAN.md` Step 0 updated: Group A DONE; Group B remains BLOCK.
- v1.3.0 blocker status: Group A PASS; Group B (7 files + untracked) remains BLOCK.
- Group B files not staged/committed. Untracked source not staged/committed.
- HOLD remains current. execution remains disabled. No git push.

## v1.2.7 - Src Dirty Files Classification

- Added `SRC_DIRTY_FILES_CLASSIFICATION.md` 窶・audit-only / report-only / redacted-only.
- 11 dirty tracked files classified into two groups:
  - Group A (safety hardening, no untracked deps): `.gitignore`, `claw3d.ts`, `installer.ts`
    窶・recommended: commit separately. Caveat: BOM character on `installer.ts` line 1.
  - Group B (ControlCenter + Research feature, has untracked deps): 7 files
    窶・recommended: commit together with untracked `ichikishima/`, `Research/`, etc.
- `Layout.tsx` adds `research` and `controlCenter` navigation. zh-CN `research` label is
  a Japanese-language placeholder 窶・may need correction before commit.
- Untracked source directories noted (not audited in this task):
  `src/main/ichikishima/`, `src/preload/ichikishima-control-center.ts`,
  `src/renderer/src/screens/Research/`, `src/shared/ichikishima/`.
- v1.3.0 blockers: Group A + Group B + untracked source must all be resolved.
- No source files modified. No commit/revert. No build/test. No git push.
- HOLD remains current. execution remains disabled.

## v1.2.6 - Package-lock Dirty State Classification

- Added `PACKAGE_LOCK_DIRTY_STATE_CLASSIFICATION.md` 窶・audit-only / report-only / redacted-only.
- Classification: package-lock dirty is version stamp drift only (2 lines ﾃ・2 locations).
  - Root `name` field: unchanged (remains `hermes-desktop`) 窶・no pre-existing drift.
  - Root `version` field: stale by one minor version 窶・auto-corrects in v1.3.0.
  - No dependency, integrity, or lockfileVersion changes.
- Recommended handling: Keep HOLD 窶・version stamp auto-resolves in v1.3.0 migration step.
- v1.3.0 blocker clarified: src/ dirty files (10 files) and `.gitignore` dirty state
  are the actual blockers; package-lock version stamp is NOT a blocker.
- `PACKAGE_NAME_MIGRATION_PLAN.md` Step 0 caveat updated to reflect reclassification.
- No `package-lock.json` was modified. No npm install. No commit/revert.
- HOLD remains current. execution remains disabled. No git push.

## v1.2.5 - Package Name Migration Plan

- Added `PACKAGE_NAME_MIGRATION_PLAN.md` 窶・plan-only / docs-static-only / report-only.
- Candidate: `package.json name` `hermes-desktop` 竊・`shikishima-desktop`.
- Impact analysis: artifact filenames, lockfile root name, updaterCacheDirName documented.
- Pre-migration caveat: existing `package-lock.json` unrelated dirty state noted (redacted-only).
- Safe migration steps, rollback plan, and verification checklist added.
- Risk table: artifact filename change = MEDIUM; all other steps = LOW.
- `publish.repo` and `dev-app-update.yml repo` confirmed KEEP (external GitHub URL).
- Target execution version: v1.3.0.
- No `package.json` was modified. No lockfile was modified. No npm install.
- HOLD remains current. execution remains disabled. No git push.

## v1.2.4 - ProductName Display Migration

- `electron-builder.yml` productName: `Hermes Agent` 竊・`縺励″縺励∪`.
- `package.json` name: unchanged (`hermes-desktop`).
- `package.json` description: unchanged (v1.2.3 content preserved).
- artifactName `${name}` references: unchanged.
- `dev-app-update.yml` updaterCacheDirName: unchanged.
- `publish.repo` / GitHub repo references: unchanged.
- Lockfile, dependencies, scripts, build config: unchanged.
- NAMING_MIGRATION_CANDIDATES.md Phase C-2 productName item marked DONE.
- PACKAGE_METADATA_AUDIT.md migration order table updated to reflect steps 1 and 2 DONE.
- HOLD remains current. execution remains disabled. No git push.

## v1.2.3 - Package Description Migration

- `package.json` description: `Hermes Agent Desktop 窶・self-improving AI assistant`
  竊・`Shikishima 窶・desktop application for Hermes Agent`.
- `package.json` name: unchanged (`hermes-desktop`).
- `electron-builder.yml` productName: unchanged (`Hermes Agent`).
- Lockfile, dependencies, scripts, build config: unchanged.
- NAMING_MIGRATION_CANDIDATES.md Phase C split into C-1/C-2/C-3.
- HOLD remains current. execution remains disabled. No git push.

## v1.2.2 - Package Metadata Audit

- Added `PACKAGE_METADATA_AUDIT.md` 窶・audit-only / report-only.
- Key findings:
  - `description` change: SAFE (no cascading effects).
  - `name` change: MEDIUM 窶・affects artifact filenames, lockfile root name, updaterCacheDirName.
  - `productName` in electron-builder.yml is NOT derived from package.json name.
  - External GitHub repo refs in electron-builder.yml and dev-app-update.yml: KEEP.
- Recommended split: description (v1.2.3) / productName (v1.2.x) / name (v1.3.0).
- No package.json changes made. HOLD remains current.
- execution remains disabled.

## v1.2.1 - Low-Risk UI Wording Migration

- `src/renderer/index.html` title: `Hermes Agent` 竊・`縺励″縺励∪`.
- `src/renderer/src/components/common/HermesLogo.tsx` alt: `Hermes` 竊・`縺励″縺励∪`.
- File name, component name, and import path unchanged.
- NAMING_MIGRATION_CANDIDATES.md Phase B items 1 and 2 marked DONE.
- HOLD remains current. execution remains disabled. No src rename, no deletion, no GO.

## v1.2.0 - Low-Risk Instruction Naming Migration

- Updated `AGENTS.md` Scope: "Ichikishima / Hermes" 竊・"縺励″縺励∪ (譌ｧ蜷・internal: Ichikishima / Hermes Control Center)".
- Updated `AGENTS.md` Normal Low-Risk Work: added `docs/shikishima/` as current area; retained `docs/ichikishima/` as legacy.
- Updated `AGENTS.md` section heading: "Ichikishima Required Completion Report" 竊・"縺励″縺励∪ Required Completion Report".
- Updated `CLAUDE.md` Scope: same as AGENTS.md.
- Updated `CLAUDE.md` heading: "Ichikishima Required Completion Report" 竊・"縺励″縺励∪ Required Completion Report".
- Updated `CLAUDE.md` heading: "Ichikishima Safety Invariants" 竊・"縺励″縺励∪ Safety Invariants".
- Safety invariant content unchanged: HOLD / disabled / false / humanGoApprovalRequired=true all preserved.
- All filesystem paths kept as-is (directories not yet renamed).
- NAMING_MIGRATION_CANDIDATES.md Phase A items 1 and 2 marked DONE.
- No src renames. No deletions. No GO. HOLD remains current.
- execution remains disabled.

## v1.1.1 - Readiness Safety Labels Hardened

- Added orange safety banner to ControlCenterAppShell header: explicitly states
  READY_* values do not approve execution, GO, or productionReady.
- Added "(non-execution design label)" inline note after `bridgeReadinessLabel`.
- Added "(non-execution label)" inline note after `scenarioSuiteLabel`.
- Added "not execution approval 窶・HOLD remains current" note after
  `controlledPilotCanRunOnceMeta`.
- Strengthened `controlledPilotHint` i18n: added "窶・not execution approval".
- Added `readinessSafetyBanner`, `bridgeReadinessHint`, `scenarioSuiteHint`,
  `pilotMetaHint` keys to both en and zh-CN i18n files.
- Updated SECURITY_AND_SAFETY_AUDIT_NOTES.md: ControlCenter readiness risk 竊・LOW (mitigated).
- HOLD remains current.
- execution remains disabled.
- no rename approval.
- no deletion approval.
- no GO issued.

## v1.1.0 - Repository Hygiene Audit

- Added `REPOSITORY_HYGIENE_AUDIT.md` 窶・overall audit report with PASS/HOLD/NG table.
- Added `NAMING_MIGRATION_CANDIDATES.md` 窶・phased naming migration candidate list.
- Added `OBSOLETE_FILE_CANDIDATES.md` 窶・files and directories for future cleanup.
- Added `SECURITY_AND_SAFETY_AUDIT_NOTES.md` 窶・redacted security and safety findings.
- Added `PROJECT_ALIGNMENT_REVIEW.md` 窶・5-agent and plan alignment review.
- This version is audit-only / report-only.
- No files were renamed, deleted, or modified in src/.
- No execution was approved.
- No GO was issued.
- No productionReady change.
- HOLD remains current.
- execution remains disabled.
- no rename approval.
- no deletion approval.

## v1.0.1 - Human Static Review Record Template

- Added `V1_HUMAN_STATIC_REVIEW_RECORD.md`.
- Added a docs/static-only template for recording human review of v1.0.0.
- Added `reviewDecision` values: `approved_for_static_design_review`,
  `needs_revision`, and `rejected`.
- Explicitly separated the record from GO, execution approval, connection
  approval, productionReady, voice I/O, camera, microphone, StackChan control,
  robot motion, WSL/Hermes/wrapper/dummy/RunPod, and git push.
- HOLD remains current.
- execution remains disabled.
- no production readiness approval.

## v1.0.0 - Static Design Review Package

- Added Static Design Review Package.
- Added v1 static review checklist.
- Added v1 not-production-ready notice.
- Organized v0.1.0 through v0.9.1 static docs and static UI design for human
  review.
- Clarified v1.0.0 is not productionReady.
- Clarified v1.0.0 is not GO approval.
- Clarified v1.0.0 is not execution approval.
- Clarified v1.0.0 is not device connection approval.
- Reconfirmed Static Face Preview, Expression Variation, and Voice-Mouth-Eye
  Concept are display-only.
- HOLD remains current.
- execution remains disabled.
- no audio I/O approval.
- no camera approval.
- no robot motion approval.
- no WSL, Hermes, wrapper, RunPod, install, external network, or git push
  approval.

## v0.9.1 - Expression Safety Review Hardening

- Hardened expression wording so labels cannot be read as runtime status,
  device signals, GO indicators, or production readiness.
- Clarified `listening` is not microphone input, recording, or audio standby.
- Clarified `thinking` is not live reasoning, active processing, or streaming
  inference.
- Clarified `holding` is not a pause button, stop control, or execution gate
  operation.
- Clarified `rejected` is not a crash, test failure, or runtime failure.
- Clarified `review_ready` is documentation review ready only, not GO-ready or
  execution-ready.
- Clarified `completed_static_only` is docs/static-only completion only, not
  productionReady.
- Added expression misread review checklist items.
- HOLD remains current.
- execution remains disabled.
- no device connection approval.
- no robot motion approval.

## v0.9.0 窶・Expression Variation Set

- Added common static expression variation set.
- Added agent expression state matrix.
- Added neutral, listening, thinking, holding, caution, rejected, review_ready, and completed_static_only display labels.
- Reconfirmed expressions are display labels and visual concepts only.
- Reconfirmed expressions are not real-time status, connection status, robot control preview, GO approval indicators, productionReady indicators, or execution states.
- HOLD remains current.
- execution remains disabled.
- no device connection approval.
- no robot motion approval.

## v0.8.1 窶・Static Face Preview Review Hardening

- Added display-only / no execution / no device connection boundary text to each face preview card.
- Added PC-width review guidance.
- Added smartphone-width review guidance.
- Reconfirmed voiceIntent, mouthPattern, gazePattern, and blinkState are display labels only.
- HOLD remains current.
- execution remains disabled.
- no audio playback approval.
- no microphone approval.
- no camera approval.
- no device connection approval.
- no robot motion approval.

## v0.8.0 窶・Static Face Preview Board

- Added static face preview board for five agents.
- Added PC-width and smartphone-width visual review guidance.
- Added face preview review checklist.
- Added static visual state mapping.
- HOLD remains current.
- execution remains disabled.
- no audio playback approval.
- no recording approval.
- no microphone approval.
- no camera approval.
- no external API approval.
- no StackChan connection approval.
- no robot motion approval.

## v0.7.0 窶・Voice / Mouth-Flap / Eye-Gaze Concept

- Added voice concept as non-audio display intent.
- Added agent-specific face and voice pattern guidance.
- Added non-execution face signal protocol vocabulary.
- Added future face terminal connection concept.
- Updated mouth-flap and eye-gaze concept docs.
- Updated Android, smartphone, and StackChan display-only planning notes.
- HOLD remains current.
- execution remains disabled.
- no audio playback approval.
- no recording approval.
- no microphone approval.
- no external API approval.
- no StackChan control approval.
- no robot motion approval.

## v0.6.0 窶・Minimal Dot-Line Face Expression System

- Added minimal dot-line face system.
- Replaced current preferred direction away from costume-heavy bust-up avatar design.
- Added mouth-flap animation concept.
- Added eye gaze / blink animation concept.
- Added tiny symbol system.
- Added smartphone face display plan.
- Added future StackChan display adaptation notes.
- HOLD remains current.
- execution remains disabled.
- no StackChan control approval.
- no robot motion approval.

## v0.5.0 窶・Explorer-Style Static Dashboard

- Added Explorer-style Dashboard.
- Added Agent Directory dashboard design.
- Added Human Review Queue design.
- Added 縺励ｋ縺ｹ Knowledge Index design.
- Added Development Tempo dashboard design.
- Added Safe Progress Views.
- HOLD remains current.
- execution remains disabled.
- no external API.
- no autonomous execution.

## v0.4.0 窶・Human Documentation Review Package

- Added human documentation review guide.
- Added Phase 3, Phase 4, and Phase 5 approval checklists.
- Added Phase 6-10 pre-execution review checklist.
- Added documentation approval record template.
- Added execution approval separation policy.
- HOLD remains current.
- execution remains disabled.
- no GO approval.

## v0.3.1 窶・Status Label Consistency Hardening

- Added visible status legend mapping concise UI labels to canonical phase statuses.
- Added canonical status text for Phase 3-10 in the HTML roadmap.
- Hardened 縺励ｋ縺ｹ raw-value storage boundary wording.
- HOLD remains current.
- execution remains disabled.
- no GO approval.

## v0.3.0 窶・HOLD-Safe Full Phase Implementation Loop

- Added Phase 3 permission review package.
- Added Phase 4 Model Router review package.
- Added Phase 5 縺励★繧・review package.
- Added Phase 6 縺､繧縺・workflow docs.
- Added Phase 7 縺励ｋ縺ｹ logging templates.
- Added Phase 8 device boundary docs.
- Added Phase 9 StackChan expression-only plan.
- Added Phase 10 minimum operation runbook draft.
- HOLD remains current.
- execution remains disabled.
- no GO approval.

## v0.2.0 窶・Phase 2.5-5 Review Support

- Added roadmap update visibility.
- Added update/changelog section.
- Added Phase Review Matrix references.
- Added 縺励★繧・decision matrix references.
- Added Model Router review matrix references.
- Added visible update markers for Phase 3, Phase 4, and Phase 5.
- HOLD remains current.

## v0.1.0 窶・Initial Shikishima Roadmap Docs

- Added static roadmap HTML.
- Added iPhone/mobile review view.
- Added Phase 0-10 roadmap.
- Added 5-agent map.
- Added Model Router overview.
- Added device role overview.
- Added forbidden actions.
- HOLD remains current.

縺薙・遽・峇縺ｧ縺ｯ蝠城｡後ｒ讀懷・縺励※縺・∪縺帙ｓ縲・
