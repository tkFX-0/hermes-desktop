# Shikishima Roadmap Changelog

## Purpose

This file records visible roadmap-affecting changes for the Shikishima plan.
Roadmap changes are documentation updates only. They are not execution approval,
not GO, and not production readiness.

## Current Roadmap Version

- roadmapVersion: v3.38.0
- lastUpdated: 2026-05-16
- latestUpdate: Shikishima human approval queue design created
- baselineCommit: d6056c812c406014c62a8a7d5e07381e31927783
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

## v3.38.0 - Shikishima Human Approval Queue Design Created

- roadmapVersion: v3.38.0
- lastUpdated: 2026-05-16
- SHIKISHIMA_HUMAN_APPROVAL_QUEUE_DESIGN.md created
- 18-field approval item / 10 action types / GO/HOLD/REJECT flow
- Non-negotiable rule list / future implementation candidates (not approved)

## v3.37.0 - Shikishima Tool Autonomy Levels Defined

- roadmapVersion: v3.37.0
- lastUpdated: 2026-05-16
- SHIKISHIMA_TOOL_AUTONOMY_LEVELS.md created
- L0(suggestion) / L1(draft) / L2(approved assist) / L3(gated API) / L4-5(HOLD)
- Current limit: L0-1 allowed / L2 by GO / L4-5 HOLD

## v3.36.0 - StackChan Role and Expression Policy Created

- roadmapVersion: v3.36.0
- lastUpdated: 2026-05-16
- STACKCHAN_ROLE_AND_EXPRESSION_POLICY.md created
- 11 expression states / speech policy / physical safety boundary all HOLD
- robotMotion: HOLD / voice: HOLD / camera/mic: HOLD

## v3.35.0 - Shikishima + StackChan Assistant Vision Recorded

- roadmapVersion: v3.35.0
- lastUpdated: 2026-05-16
- SHIKISHIMA_STACKCHAN_ASSISTANT_VISION.md created
- Core vision: brain(Shikishima) + face(StackChan) + workers(ClaudeCode/Codex)
- Tool autonomy levels 0-5 defined (current: L0-1, L2 by GO)
- Future roadmap candidates listed (all docs-only, none approved)
- Not execution approval / not Level 3 approval / not productionReady

## v3.34.0 - Level 3-A Final GO Package Draft Created

- roadmapVersion: v3.34.0
- lastUpdated: 2026-05-16
- LEVEL_3_A_FINAL_GO_PACKAGE_DRAFT.md created
- 9-doc reference list / filled GO template / 15-item pre-send checklist
- Level 3-A design package: COMPLETE
- Level 3-A execution: not approved (human must fill and send GO separately)

## v3.33.0 - Level 3-A Human Acceptance Template Created

- roadmapVersion: v3.33.0
- lastUpdated: 2026-05-16
- LEVEL_3_A_HUMAN_ACCEPTANCE_REVIEW_TEMPLATE.md created
- 18-item review checklist / candidate statuses / explicit "does not approve" list

## v3.32.0 - Level 3-A iPhone Same-LAN Protocol Created

- roadmapVersion: v3.32.0
- lastUpdated: 2026-05-16
- LEVEL_3_A_IPHONE_SAME_LAN_PROTOCOL.md created
- Human actions / ClaudeCode actions / required checks table / forbidden list

## v3.31.0 - Level 3-A STOP and Rollback Checklist Created

- roadmapVersion: v3.31.0
- lastUpdated: 2026-05-16
- LEVEL_3_A_STOP_ROLLBACK_CHECKLIST.md created
- 20+ STOP conditions / 6-step rollback / post-STOP verification

## v3.30.0 - Level 3-A Evidence Template Created

- roadmapVersion: v3.30.0
- lastUpdated: 2026-05-16
- LEVEL_3_A_OBSERVATION_EVIDENCE_TEMPLATE.md created
- Blank template: session/pre-run/observation/iPhone/negative/shutdown/post-run/result

## v3.29.0 - Level 3-A Controlled Observation Runbook Created

- roadmapVersion: v3.29.0
- lastUpdated: 2026-05-16
- LEVEL_3_A_CONTROLLED_OBSERVATION_RUNBOOK.md created
- Preconditions / human actions / ClaudeCode actions / procedure / completion criteria
- Level 3-A is design only — not execution approval

## v3.28.0 - Level 3-A GO Wording Draft Created

- roadmapVersion: v3.28.0
- lastUpdated: 2026-05-16
- LEVEL_3_A_GO_WORDING_DRAFT.md created
- Template with all required placeholders (time/command/port/shutdown/evidence/STOP/rollback)
- 12-item GO checklist for human review
- 11-item PASS criteria defined
- Level 3: not approved / productionReady: false / execution: disabled

## v3.27.0 - Level 3 Scope Proposed

- roadmapVersion: v3.27.0
- lastUpdated: 2026-05-16
- LEVEL_3_SCOPE_PROPOSAL.md created
- Level 3-A (read-only observation continuation): recommended, PASS criteria defined
- Level 3-B/C/D/E: deferred
- StackChan / robot / voice / camera: HOLD (no track)
- Level 3: not approved / productionReady: false / execution: disabled

## v3.26.0 - Level 3 Preconditions Audited

- roadmapVersion: v3.26.0
- lastUpdated: 2026-05-16
- LEVEL_3_PRECONDITIONS_AUDIT.md created
- Risk classification: LOW/MEDIUM/HIGH documented
- Level 3-A readiness: scope + GO wording still pending
- 35f02c5 not in main / runtime branch not pushed / port closed
- Level 3: not approved / productionReady: false / execution: disabled

## v3.25.0 - Level 3 Planning Gate Defined

- roadmapVersion: v3.25.0
- lastUpdated: 2026-05-16
- LEVEL_3_PLANNING_GATE_DEFINITION.md created
- Defines what Level 3 is / is not / forbidden / required decisions / STOP conditions
- Candidate tracks: 3-A through 3-E (proposals only, none approved)
- Level 3-A recommended as first candidate (narrowest scope)
- Level 3: not approved by this document
- B3 loop: COMPLETE / productionReady: false / execution: disabled

## v3.24.0 - B3 Observation Loop Officially Complete

- roadmapVersion: v3.24.0
- lastUpdated: 2026-05-16
- B3_OBSERVATION_LOOP_COMPLETION_RECORD.md created
- completion_status: COMPLETE
- origin/main frozen at c4d32df
- Level 3: not approved / productionReady: false / execution: disabled
- next gate: Level 3 planning gate (separate human decision required)

## v3.23.0 - B3 5/5 Accepted

- roadmapVersion: v3.23.0
- lastUpdated: 2026-05-16
- Human acceptance phrase recorded: accepted_as_level_b3_5_of_5_practical_local_mvp_operation_evidence
- B3 5/5: ACCEPTED
- Session-009 (iPhone Phase 2C same-LAN): accepted_as_clean_b3_pass
- B3 observation loop: complete
- Level 3: not approved
- productionReady: false / execution: disabled
- runtime branch: local only, not pushed

## v3.22.0 - B3 5/5 Acceptance Review Created

- roadmapVersion: v3.22.0
- lastUpdated: 2026-05-16
- B3_5_OF_5_ACCEPTANCE_REVIEW.md created
- Acceptance scope: B3 observation loop only
- Session-009 (iPhone Phase 2C same-LAN) accepted as B3 #5
- B3 5/5 acceptance review: pending human acceptance phrase
- Level 3: not approved
- productionReady: false / execution: disabled
- runtime branch: local only, not pushed

## v3.21.0 - Session-009 iPhone Same-LAN Evidence Recorded

- roadmapVersion: v3.21.0
- lastUpdated: 2026-05-16
- LOCAL_MVP_OPERATION_EVIDENCE_2026-05-16-009.md created
- Session-009 result: CLEAN_B3_PASS_CANDIDATE
- B3 status: 5/5 candidate, pending human acceptance
- Evidence records /mobile/health, /mobile/ui, and /mobile/snapshot PASS through Phase 2C same-LAN confirmation
- Evidence records negative checks: no-token and invalid-token snapshot requests rejected; no wildcard CORS; no 0.0.0.0 bind; no execution/write/push endpoints
- Runtime branch and activation commit remain local-only and not pushed
- This is not B3 acceptance, not Level 3 approval, not productionReady true, and not execution enabled

## v3.19.0 - Phase 2C Design Docs + Route to B3 5/5

- roadmapVersion: v3.19.0
- lastUpdated: 2026-05-15
- IPHONE_PRIVATE_CONSOLE_PHASE_2C_DESIGN.md: full design
- IPHONE_PRIVATE_CONSOLE_PHASE_2C_PAIRING_TOKEN.md: token spec
- IPHONE_PRIVATE_CONSOLE_PHASE_2C_SAME_LAN_CHECKLIST.md: pre/impl/session checklists
- IPHONE_PRIVATE_CONSOLE_SESSION_009_IPHONE_GO_DRAFT.md: Session-009 GO template
- Phase 2C implementation: NOT approved (separate GO required)
- Session-009: not countable yet (Phase 2C must complete first)
- RustDesk-less B3 #5 route: fully documented

## v3.18.0 - Shikishima App Independence Architecture Documented

- roadmapVersion: v3.18.0
- lastUpdated: 2026-05-15
- SHIKISHIMA_APP_INDEPENDENCE_ARCHITECTURE.md created
  - Current state: Control Center as extension inside Hermes Agent app
  - Target: しきしまApp independent, Hermes Core as heart/engine
  - Phase A (now): module separation within monorepo
  - Phase B (future): packages/hermes-core + packages/shikishima-*
  - Phase C (future): apps/shikishima-desktop + apps/hermes-worker
  - Prerequisites: B3 5/5 + Level 3 GO + Phase 2C complete
- No source changes. docs-only.

## v3.17.0 - Canonical Agent Naming Aligned (v2)

- roadmapVersion: v3.17.0
- lastUpdated: 2026-05-15
- canonical 7-agent naming confirmed and recorded in docs
  - Hermes Core / しきしま / いちきしま / しずめ / しるべ / むすび / つむぐ
- legacy names deprecated: つむぎ→つむぐ / はじめ→むすび / イツキシマ→いちきしま
- technical ID → canonical mapping table established
- AGENT_NAMES_ROLES_AND_PERMISSIONS.md: complete rewrite (canonical_v2)
- AGENT_DIRECTORY_DASHBOARD.md: updated to canonical structure
- README.md: canonical agent table added
- AGENT_DOT_LINE_FACE_SYSTEM.md: つむぎ→つむぐ / はじめ→むすび
- Source technical IDs (hermes_worker, supervisor, etc.) unchanged
- UI label alignment (MobileAgentTeam, agent-registry labelJa) is separate task
- Phase 2B-2 localhost server (50d414c) unchanged — naming docs are separate commit

## v3.16.0 - iPhone Private Console Phase 2B Design Prepared

- roadmapVersion: v3.16.0
- lastUpdated: 2026-05-15
- iPhone Private Console Phase 1 static UI: implemented + pushed (b4eea34)
- iPhone Private Console Phase 2A redacted snapshot adapter: implemented + pushed (dbb26c7)
- iPhone Private Console Phase 2B design: docs prepared (this commit)
  - IPHONE_PRIVATE_CONSOLE_PHASE_2B_DESIGN.md
  - IPHONE_PRIVATE_CONSOLE_PHASE_2B_API_BOUNDARY.md
  - IPHONE_PRIVATE_CONSOLE_PHASE_2B_SECURITY_REVIEW.md
  - IPHONE_PRIVATE_CONSOLE_PHASE_2B_IMPLEMENTATION_GO_DRAFT.md
  - IPHONE_PRIVATE_CONSOLE_PHASE_2C_SAME_LAN_PREP.md
- Phase 2B implementation: NOT approved
- No src/main, preload, IPC, server, or network changes
- Session-009 still not countable (Phase 2C required for iPhone real-status)
- RustDeskレス検証パス: 設計確立済み
- clean_b3_pass: 4/5
- Level 3: not approved. HOLD maintained.
- Next: Phase 2B design review → Phase 2B-1 IPC GO → Phase 2B-2 localhost GO
  → Phase 2C same-LAN GO → iPhone real-status → Session-009 #5

## v3.15.0 - Operation Loop Stabilized, Session-009 GO Pack Ready

- roadmapVersion: v3.15.0
- lastUpdated: 2026-05-15
- Session-007 CLEAN_B3_PASS #4 accepted (Control Center deep observation)
- Session-008 PASS_WITH_TIMING_CAVEAT recorded (-1s pre-window, duplicate angle)
- clean_b3_pass_for_level3: 4/5
- Created: CURRENT_AHEAD_COMMITS_PUSH_READINESS.md (safe_to_request_push_go)
- Created: PUSH_GO_TEMPLATE_CURRENT_AHEAD_COMMITS.md
- Created: SESSION_009_CLEAN_B3_PASS_GO_PACK.md (+30s buffer rule enforced)
- Created: LEVEL_B3_5_OF_5_ACCEPTANCE_TEMPLATE.md
- Created: JAPANESE_UI_MINIMAL_IMPLEMENTATION_GO_DRAFT.md
- Created: LEVEL_3_GAP_CLOSURE_PLAN.md (~9 prerequisites after B3 5/5)
- Created: FINAL_SHIKISHIMA_PROGRESS_RECALCULATION.md (overall ~16-18%)
- Level 3 remains not approved. HOLD maintained.
- Next: Session-009 CLEAN_B3_PASS #5 (Settings/Models, +30s timing rule).

## v3.14.0 - Final Shikishima 100% Operation Path Defined

- roadmapVersion: v3.14.0
- lastUpdated: 2026-05-14
- Session-006 CLEAN_B3_PASS accepted: main screen status labels confirmed (HOLD/disabled/false)
- clean_b3_pass_for_level3: 3/5
- Created: FINAL_SHIKISHIMA_100_PERCENT_OPERATION_PATH.md (overall ~16-18%; B3 loop 60%)
- Created: FINAL_SHIKISHIMA_PROGRESS_LOOP.md (repeatable loop definition)
- Created: LEVEL_B3_REMAINING_2_SESSION_PLAN.md (Session-007/008 plan)
- Created: JAPANESE_UI_SURFACE_ROADMAP.md (Japanese UI roadmap, not implementation)
- Created: NEXT_CLAUDE_CODE_TASKS.md (10 prioritized tasks to 100%)
- Level 3 remains not approved. execution remains disabled. productionReady remains false.
- Next: Session-007 navigation regression (clean B3 PASS #4).

## v3.13.0 - B3 Daily Loop First Cycle Completed

- roadmapVersion: v3.13.0
- lastUpdated: 2026-05-14
- B3 Session-001→003 loop completed and pushed to origin/main (d6056c8).
  - Session-001: STOP — secret_like_placeholder_visible (STOP correctly detected)
  - Session-002: STOP — build_not_run_after_source_change (root cause resolved)
  - Session-003: PASS — provider masking fix verified; accepted_as_level_b3_session_003_evidence
- source fix 48e2f78 pushed: placeholder "AIza..." → "Paste your API key here"
- Created: LEVEL_B3_DAILY_LOOP_RUNBOOK.md (runbook v1)
- Created: LEVEL_B3_SESSION_HISTORY.md
- Created: LEVEL_3_GAP_AUDIT.md (~11 prerequisites remain before Level 3 can be proposed)
- Created: LEVEL_B3_NEXT_SESSION_PLAN.md (Session-004→007 candidates)
- Level 3 remains not approved. execution remains disabled. productionReady remains false.
- Next: human accepts runbook/gap audit docs; run Session-004 with time_window GO.

## v3.12.0 - Level B3 Operation Rules Accepted

- roadmapVersion: v3.12.0
- lastUpdated: 2026-05-14
- Human reviewer explicitly accepted Level B3 rules as `accepted_as_practical_local_mvp_operation_rules`.
- Added `LOCAL_MVP_OPERATION_ACCEPTANCE_RECORD.md`: 18-item checklist (all PASS); human acceptance statement; what acceptance means/does not mean; HOLD boundary confirmed.
- Updated `PRACTICAL_LOCAL_MVP_ACCEPTANCE_CRITERIA.md`: all docs criteria PASS; evidence criteria PASS; safety criteria PASS.
- This acceptance does not approve Level 3, productionReady, execution, robot/voice/device, deploy, or future git push.
- Next: push 6f0414f + acceptance commit → Level B3 daily operation loop.
- HOLD remains current. execution remains disabled. productionReady remains false.

## v3.11.0 - Level B3 Practical Local MVP Operation Rules Candidate Created

- roadmapVersion: v3.11.0
- lastUpdated: 2026-05-14
- Added `PRACTICAL_LOCAL_MVP_OPERATION_RULES.md`: 13-item pre-run checks; allowed/forbidden actions; 12 STOP conditions; incident handling; next level conditions; Level B3 operation level.
- Added `LOCAL_MVP_SESSION_PROTOCOL.md`: 7 session states; 10-step session flow; session ID format.
- Added `LOCAL_MVP_EVIDENCE_SCHEMA.md`: all required evidence fields with types/formats; 10 validation rules; redacted-only policy.
- Added `LOCAL_MVP_OPERATION_ACCEPTANCE_RECORD_TEMPLATE.md`: ready-to-fill acceptance block; 16-item pre-acceptance checklist; what acceptance means/does not mean.
- Updated `PRACTICAL_LOCAL_MVP_ACCEPTANCE_CRITERIA.md`: criteria_e1-e6 all PASS; B3 docs marked as CANDIDATE pending human acceptance.
- Updated `AUTONOMOUS_LOOP_BOUNDARIES.md`: added Level B3 specific allowed (b3_allow_1-7) and forbidden (b3_forbid_1-9) actions.
- Practical Local MVP Operation Rules: candidate — human acceptance pending.
- HOLD remains current. execution remains disabled. productionReady remains false.

## v3.10.0 - Level B1 Observation Evidence Accepted

- roadmapVersion: v3.10.0
- lastUpdated: 2026-05-14
- Human reviewer explicitly accepted Level B1 evidence as `accepted_as_local_app_observation_evidence`.
- Added `LOCAL_APP_OBSERVATION_ACCEPTANCE_RECORD.md`: 13-item evidence checklist (all PASS); criteria_e1-e6 all PASS; HOLD boundary confirmed.
- This acceptance does not approve Level 3, productionReady, execution, autonomous operation, robot/voice/device, deploy, or future git push.
- Next candidate: Practical Local MVP Operation Rules (Level B3).
- HOLD remains current. execution remains disabled. productionReady remains false.

## v3.9.0 - Level B1 Local App Observation PASS Recorded

- roadmapVersion: v3.9.0
- lastUpdated: 2026-05-14
- Controlled Local App Observation completed: 2026-05-14 (19:15-20:00 JST).
- Command used: .\node_modules\.bin\electron.cmd . (local binary only; npx not used).
- App started: true. Screens observed: 2 (しきしま). No issues reported.
- No stop conditions triggered. No raw values / secrets / local-only values reported.
- Working tree unchanged before/after: staged 0/0, diff 0/0.
- Added `LOCAL_APP_OBSERVATION_EVIDENCE.md`.
- Execution remains disabled. productionReady remains false. Level 3 not approved.
- Next gate: post-observation human acceptance review.

## v3.8.0 - Practical Local MVP Pre-Operation Expansion Package Created

- roadmapVersion: v3.8.0
- lastUpdated: 2026-05-14
- Added `LOCAL_MVP_OPERATOR_RUNBOOK.md`: who/when/pre-open/allowed/forbidden/record/stop/report/HOLD for operators.
- Added `LOCAL_MVP_DAILY_CHECK_TEMPLATE.md`: per-session fill-in template; pre-open/observation/status/safety/stop/result fields; redacted-only policy.
- Added `LOCAL_MVP_INCIDENT_RESPONSE_PLAYBOOK.md`: 9 incident types; immediate actions; what not to record; reopen/commit/push policy per type.
- Added `PRACTICAL_LOCAL_MVP_ACCEPTANCE_CRITERIA.md`: 10 docs criteria + 6 evidence criteria + 8 safety criteria; current status per criterion; Practical Local MVP ≠ Final 100% distinction.
- Added `AUTONOMOUS_LOOP_BOUNDARIES.md`: 12 allowed actions + 18 forbidden actions; 5 gate checks; loop output contract.
- Added `LEVEL_3_CANDIDATE_PRECONDITIONS.md`: 6 observation + 5 operational + 5 human preconditions; Level 3 still HOLD; explicit statement that this doc does not approve Level 3.
- Local App Observation execution not approved. f6ed64c and this commit are local-only until pushed separately.
- HOLD remains current. execution remains disabled. productionReady remains false.

## v3.7.0 - Practical Local MVP Operation Definition Package Created

- roadmapVersion: v3.7.0
- lastUpdated: 2026-05-14
- Added `PRACTICAL_LOCAL_MVP_OPERATION_DEFINITION.md`: 6-tier operation level (B0–B4, C); definition of Practical Local MVP Operation; 13-item session verification matrix; remaining HOLD list; Level 3 candidate conditions.
- Added `LOCAL_OPERATION_AUTONOMOUS_LOOP_PLAN.md`: 7-step allowed loop pattern; forbidden loop pattern; loop termination conditions; per-iteration output format.
- Added `LOCAL_OPERATION_TEST_MATRIX.md`: pre/during/post observation check tables; evidence recording rules; session result criteria.
- Added `LOCAL_OPERATION_STOP_CONDITIONS.md`: pre/during/post/loop stop conditions (12 + 8 + 4 + 7 = 31 total); after-stop procedure.
- Local App Observation execution not approved. GO with concrete time_window required.
- HOLD remains current. execution remains disabled. productionReady remains false.

## v3.6.1 - Local App Observation GO Command Hardened

- roadmapVersion: v3.6.1
- lastUpdated: 2026-05-14
- Hardened `LOCAL_APP_OBSERVATION_FINAL_GO_TEMPLATE.md`: replaced `npx electron .` with `.\node_modules\.bin\electron.cmd .` (local binary only); added npx/npm install/npm update/npm exec/transient package execution to forbidden list; added local binary missing STOP condition; updated placeholder checklist.
- Hardened `LOCAL_APP_OBSERVATION_GO_WORDING_REVIEW.md`: updated proposed command to local binary; marked npx/npm install/npm update/npm exec/transient execution as HOLD; added pre_14 (local binary check); added stop_10 (missing binary); updated forbidden list.
- Reason: `npx` conflicts with established `npx: HOLD / transient package execution: HOLD` safety boundary.
- Local App Observation execution not approved. GO requires human explicit message with filled time_window.
- HOLD remains current. execution remains disabled. productionReady remains false.

## v3.6.0 - Local App Observation GO Wording Review Package Created

- roadmapVersion: v3.6.0
- lastUpdated: 2026-05-14
- Added `LOCAL_APP_OBSERVATION_GO_WORDING_REVIEW.md`: go_wording_review_only status; proposed command (npx electron . — proposed only, not approved); 13-item pre-run checklist; 9 stop conditions; 13-item GO wording checklist; post-observation decision options; safety boundary.
- Added `LOCAL_APP_OBSERVATION_FINAL_GO_TEMPLATE.md`: ready-to-copy GO block (time_window placeholder — not GO); placeholder checklist; local-only scope; allowed/forbidden/stop list.
- Local App Observation execution not approved by this package. GO requires human to fill time_window and send as explicit message.
- Level 3, productionReady, Electron dev-mode, WSL, robot/voice/device, deploy, future git push not approved.
- HOLD remains current. execution remains disabled. productionReady remains false.

## v3.5.0 - Track B Readiness Acceptance Record Created

- roadmapVersion: v3.5.0
- lastUpdated: 2026-05-14
- Human reviewer explicitly accepted Track B readiness package as `accepted_as_track_b_readiness_scope`.
- Added `TRACK_B_READINESS_ACCEPTANCE_RECORD.md`: 17-item review checklist (all PASS); human acceptance statement; readiness package summary; HOLD boundary confirmed.
- This acceptance does not approve Local App Observation execution, Electron dev-mode, Level 3, productionReady, execution enabled, robot/voice/device runtime, deployment, or future git push.
- Next candidate: `/goal shikishima.app-observation-go-wording` (GO wording review).
- HOLD remains current. execution remains disabled. productionReady remains false.

## v3.4.0 - Track B Local App Observation Readiness Package Created

- roadmapVersion: v3.4.0
- lastUpdated: 2026-05-14
- Added `LOCAL_APP_OBSERVATION_READINESS.md`: Track B readiness scope; preconditions; allowed/forbidden activities; stop conditions; human decision options.
- Added `LOCAL_APP_OBSERVATION_SCOPE_PROPOSAL.md`: proposed future scope (not approved); proposed GO wording template (placeholder — not GO); proposed stop conditions; proposed evidence format.
- Added `LOCAL_APP_OBSERVATION_EVIDENCE_TEMPLATE.md`: fill-in template for future observation evidence; redacted-only output policy; working tree before/after fields.
- Local App Observation execution not approved by this package. GO requires separate scope review + human GO with filled time_window.
- Level 3, productionReady, Electron dev-mode, WSL, robot/voice/device, deploy, future git push not approved.
- HOLD remains current. execution remains disabled. productionReady remains false.

## v3.3.0 - Post-Level 2 Human Acceptance Record Created

- roadmapVersion: v3.3.0
- lastUpdated: 2026-05-14
- Human reviewer explicitly accepted Level 2 PASS evidence as `accepted_as_level_2_validation_evidence`.
- Added `POST_LEVEL_2_HUMAN_ACCEPTANCE_RECORD.md`: 18-item review checklist (all PASS); human acceptance statement; accepted result summary; HOLD boundary confirmed.
- This acceptance does not approve Level 3, productionReady, execution enabled, Local App Observation execution, robot/voice/device runtime, deployment, or future git push.
- Next candidate: `/goal shikishima.app-observation-readiness` (Track B preparation).
- HOLD remains current. execution remains disabled. productionReady remains false.

## v3.2.1 - Level 2 Local Controlled Validation PASS Recorded

- Controlled Pilot Level 2 local controlled validation completed: 2026-05-14 (15:00-16:00 JST).
- All five commands passed: typecheck:node (0 errors), typecheck:web (0 errors), lint (0 errors/warnings), test (712 passed / 0 failed), build (successful).
- No regression vs Level 1. Test counts stable. Working tree unchanged before/after.
- Added `LEVEL_2_LOCAL_CONTROLLED_VALIDATION_EVIDENCE.md`.
- Level 3, productionReady, execution enabled, git push, Electron, WSL, devices, voice remain not approved.
- HOLD remains current. execution remains disabled. productionReady remains false.

## v3.2.0-candidate - Level 2 Final GO Package Prepared

- Added `LEVEL_2_FINAL_GO_PACKAGE.md`: ready-to-copy GO block (time window placeholder), exact 5-command scope, structured output policy, stop conditions, pre-run verification, result log format, 15-item checklist.
- Level 2 execution not approved by this package; GO requires human to fill time window and send explicitly.
- No GO, execution, productionReady, push, Electron, WSL, robot/StackChan, voice/camera/mic, secrets approved.
- HOLD remains current. execution remains disabled.

## v3.1.4 - StackChan Not Arrived; Robot Track Clarified As Preparation-Only

- Added `STACKCHAN_NOT_ARRIVED_ROBOT_PREPARATION_ONLY.md`.
- Explicitly states StackChan has not arrived.
- Splits Robot Track into Robot Preparation 100% (allowed now) and Robot Runtime 100% (HOLD until StackChan arrives + separate GO).
- No robot connection, motion, servo, device testing, voice/camera/mic, or runtime behavior approved.
- robotMotion remains HOLD. HOLD remains current. execution remains disabled. productionReady remains false.

## v3.1.3 - Final Shikishima 100% Definition Prepared

- Added `FINAL_SHIKISHIMA_100_PERCENT_DEFINITION.md`: 10-track Final 100% definition; distinguishes Scoped 100% from Final Shikishima 100%; clearly states current progress is not Final 100%.
- Added `FINAL_100_PERCENT_TRACK_MATRIX.md`: 12-track status matrix with target, status, evidence, remaining work, required GO, risk, next action.
- Added `FINAL_100_PERCENT_GOAL_TREE.md`: /goal tree from shikishima.final-100 through all 12 child goals; each with definition, current gate, evidence, required GO, stop conditions, what remains HOLD.
- Track E (voice/external/wrapper/robot) confirmed absolute HOLD.
- No GO, execution, productionReady, push, Electron, WSL, devices, or secrets approved.
- HOLD remains current. execution remains disabled. productionReady remains false.

## v3.1.2 - V3 Goal Roadmap and Claude Code /goal Definitions Prepared

- Added `V3_GOAL_ROADMAP.md`: 5-track roadmap (Validation, App Observation, Local MVP, 5-Agent, External/Device), roadmap sequence v3.0.0–v4.0.0+, current/next gate, STOP gates, human approval rules.
- Added `CLAUDE_CODE_GOAL_DEFINITIONS.md`: 10 /goal definitions (push-readiness through external-device-hold), each with allowed/forbidden scope, human approval, stop conditions, result log, next gate.
- Explicitly states v3.0-v3.1.1 focused on safety/validation infrastructure, not new app features.
- Electron dev-mode observation is Track B, not yet approved.
- All Track E items (external/device/WSL/Hermes/wrapper/robot/voice/camera/mic) remain absolute HOLD.
- HOLD remains current. execution remains disabled. productionReady remains false.

## v3.1.1 - Level 2 GO Wording Review Prepared

- Added `LEVEL_2_GO_WORDING_REVIEW.md`: draft GO template with proposed commands (not approved), structured output policy, stop conditions, pre-run verification, result log format, 15-item checklist.
- Document is wording_review_only / HOLD. Level 2 execution not approved.
- Human must fill in time window and issue GO in a new explicit message.
- No GO, execution, productionReady true, git push, deploy, Cloudflare, WSL/Hermes/wrapper, Electron, devices, robot/StackChan, voice/camera/mic, secrets, raw values, or local-only values were approved.
- HOLD remains current. execution remains disabled. productionReady remains false.

## v3.1.0 - Level 2 Local Controlled Validation Scope Proposal Prepared

- Added `LEVEL_2_LOCAL_CONTROLLED_VALIDATION_SCOPE_PROPOSAL.md`.
- Level 2 scope = Option A: deeper redacted review of same five Level 1 commands.
- Option B (tests/ichikishima commit path) and Option C (Electron dev-mode) deferred.
- Five proposed commands marked proposal_only; no commands were run.
- Level 2 GO requires a separate explicit human approval.
- No GO, execution, productionReady true, git push, deploy, Cloudflare, WSL/Hermes/wrapper, Electron, devices, robot/StackChan, voice/camera/mic, secrets, raw values, or local-only values were approved.
- HOLD remains current. execution remains disabled. productionReady remains false.

## v3.0.0 - Level 1 Local Dry-Run Evidence Recorded

- Controlled Pilot Level 1 local dry-run completed successfully on 2026-05-14 (13:35-14:35 JST).
- All five commands passed: typecheck:node, typecheck:web, lint, test, build.
- Working tree after run: staged 0, actual content diff 0, no unexpected file edits.
- Added `LEVEL_1_LOCAL_DRY_RUN_EVIDENCE.md` as evidence record.
- Level 2, Level 3, execution, productionReady true, git push, deploy, WSL/Hermes/wrapper, devices, robot/StackChan, voice/camera/mic, secrets, raw values, and local-only values remain not approved.
- HOLD remains current. execution remains disabled. productionReady remains false.

## v2.9.9 - Level 1 GO Wording Review Prepared

- Added `LEVEL_1_GO_WORDING_REVIEW.md`: copy-pasteable draft GO wording, exact command scope, output policy, stop conditions, post-run report format, and final review checklist.
- Creating and reviewing this document is not GO. Level 1 execution remains HOLD.
- Human must fill in time window and issue GO in a new explicit message before Level 1 may be executed.
- No GO, execution, productionReady true, git push, deploy, Cloudflare, WSL/Hermes/wrapper, devices, robot/StackChan, voice/camera/mic, secrets, raw values, or local-only values were approved.
- HOLD remains current. execution remains disabled. productionReady remains false.

## v2.9.8 - Level 1 Scope Proposal and Acceptance Clarification Prepared

- Added `LEVEL_1_ACCEPTANCE_CLARIFICATION.md`: clarifies G-05/G-06/G-07 as official PASS for Level 1 review; accepts rollback references as Level 1 prerequisites; does not approve Level 1 GO.
- Added `LEVEL_1_LOCAL_DRY_RUN_SCOPE_PROPOSAL.md`: exact proposed command list, time window placeholder, output policy, stop conditions, and approval requirements; proposal only, not approved.
- All Level 1 entry conditions are now available for human review.
- Level 1 GO still requires a separate explicit human approval with exact scope.
- No GO, execution, productionReady true, git push, deploy, Cloudflare, WSL/Hermes/wrapper, devices, robot/StackChan, voice/camera/mic, secrets, raw values, or local-only values were approved.
- HOLD remains current. execution remains disabled. productionReady remains false.

## v2.9.7 - Remote Push Evidence Recorded

- Recorded first successful remote push of docs-only history to https://github.com/tkFX-0/hermes-desktop.
- Added `REMOTE_PUSH_EVIDENCE.md` as push evidence record only.
- Push scope: committed history only (5 docs-only commits, v2.9.2 through v2.9.6).
- CRLF-only modified files and untracked files were not pushed.
- Push approval for that scope is consumed; any future push requires new explicit human approval.
- No GO, execution, productionReady true, deploy, Cloudflare, WSL/Hermes/wrapper, devices, robot/StackChan, voice/camera/mic, secrets, raw values, or local-only values were approved.
- HOLD remains current. execution remains disabled. productionReady remains false.

## v2.9.6 - Pre-Operation and Controlled Pilot Review Evidence Recorded

- Recorded Human Reviewer Notes in `PRE_OPERATION_READINESS_GATE.md` and `CONTROLLED_PILOT_PLAN.md` as review evidence only.
- Pre-Operation Readiness Gate accepted as review evidence only; not operational GO.
- Controlled Pilot Plan accepted as planning and review evidence only; current level remains Level 0: documentation-only.
- No GO, execution, productionReady true, git push, deploy, Cloudflare, WSL/Hermes/wrapper, devices, robot/StackChan, voice/camera/mic, secrets, raw values, or local-only values were approved.
- HOLD remains current. execution remains disabled. productionReady remains false.

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
