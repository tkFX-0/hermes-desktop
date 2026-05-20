# Shikishima Roadmap Docs
date_updated: 2026-05-18

This directory contains static documentation for the Shikishima plan.

---

## Canonical Agent Names (v2 — 確定版)

| canonical | 役割 | technical IDs |
|---|---|---|
| Hermes Core | 心臓・脳 | hermes_worker |
| しきしま | 顔・管制塔 | supervisor |
| いちきしま | 審判 | ichikishima_reviewer |
| しずめ | ブレーキ | approval_guardian, suppressive_agent |
| しるべ | 記録と道標 | audit_keeper, visualization_observer |
| むすび | 接続と編成 | execution_planner, research_agent |
| つむぐ | 記憶と文脈 | memory_curator |

Legacy names (deprecated):
- つむぎ → つむぐ
- はじめ → むすび
- イツキシマ表記 → いちきしま

See `AGENT_NAMES_ROLES_AND_PERMISSIONS.md` for full permission model.

---

Current state:

- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

These documents are not execution approval. They do not enable WSL, Hermes,
wrapper, dummy wrapper, RunPod, StackChan, packaged smoke, or any external
network flow.

## Files

- `REAL_OPERATION_ROADMAP.html` - static browser roadmap.
- `REAL_OPERATION_ROADMAP.md` - Markdown roadmap.
- `ROADMAP_CHANGELOG.md` - visible roadmap update history.
- `PHASE_45_TO_60_APPROVAL_QUEUE_UI_EVIDENCE.md` - Phase 45 to 60 Approval Queue UI evidence and safety boundary.
- `PHASE_60_TO_75_STACKCHAN_DISPLAY_PREPARATION_EVIDENCE.md` - Phase 60 to 75 StackChan / Face Terminal display preparation evidence.
- `PHASE_75_TO_90_DRAFT_OUTBOX_SAFETY_EVIDENCE.md` - Phase 75 to 90 Draft Outbox / external action safety evidence.
- `PHASE_REVIEW_MATRIX.md` - Phase 0-10 documentation/execution review state.
- `SHIKISHIMA_FINAL_VISION.md` - final vision draft.
- `AGENT_NAMES_ROLES_AND_PERMISSIONS.md` - agent names, roles, and permission boundaries.
- `MODEL_ROUTING_POLICY.md` - model routing policy.
- `MODEL_ROUTER_REVIEW_MATRIX.md` - review matrix for model routing cases.
- `GROK_HERMES_PROVIDER_ARCHITECTURE_REVIEW.md` - Grok-Hermes xai-oauth integration research (docs-only, HOLD).
- `GROK_HERMES_PROVIDER_GATE.md` - GHG-00 through GHG-09 gate sequence for Grok-Hermes activation.
- `GROK_HERMES_TOKEN_AND_AUTH_BOUNDARY.md` - auth.json token boundary rules.
- `GROK_HERMES_TOOL_HOLD_REGISTRY.md` - all Hermes tool HOLD registry including web/messaging/cron/memory/computer_use(REJECT).
- `SLOT_09_WORKER_STATUS_AND_AUTONOMY_BOUNDARY.md` - SLOT_WORKER_STATUS enum, Level 1-5 autonomy boundary, resume queue schema, and Level 5 human gate.
- `SLOT_09_RUNAWAY_PREVENTION_RULES.md` - max-step, cooldown, NEEDS_HUMAN, and runaway prevention rules.
- `HUMAN_GATED_ACTIONS_PLAIN_LANGUAGE_GUIDE.md` - simple Japanese guide for AUTO OK / HUMAN GO / READ-ONLY GO / HARD STOP.
- `OBSIDIAN_LOCAL_NOTE_GATE_PLAN.md` - future OBS-LOCAL local Markdown note write gate.
- `SOCIAL_AWARENESS_READ_ONLY_GATE_PLAN.md` - future XS-READ x_search/social read-only awareness gate.
- `AT_REMAINING_IMPLEMENTATION_DESIGN_PACKAGE.md` - consolidated design package for remaining Agent Theater items after AT-09.
- `AT_10_RUNAWAY_GUARD_PANEL_DESIGN.md` - Human-Gated Action Panel design for Level 5 boundaries.
- `AT_11_WORKER_ROUTING_HANDOFF_PROMPT_PANEL_DESIGN.md` - Worker Routing / copy-only Handoff Prompt Panel design.
- `AT_12_GATE_DASHBOARD_DESIGN.md` - Future Gate Dashboard design for RUNTIME/OAUTH/XS/OBS/external gates.
- `AT_12_GATE_DASHBOARD_PANEL_EVIDENCE.md` - AT-12 Gate Dashboard implementation evidence and safety boundary.
- `AT_13_FINAL_VISUAL_POLISH_PLAN.md` - Agent Theater final responsive visual polish plan.
- `AT_05_SPRITE_ASSET_PLAN.md` - optional sprite/image asset policy and future gate plan.
- `AT_14_RUNTIME_VISUAL_RECHECK_PACKAGE.md` - AT-14 main package: scope, STOP conditions, shutdown method, safety boundary.
- `AT_14_RUNTIME_VISUAL_RECHECK_GO_TEMPLATE.md` - human GO form: fill date/time_window and say GO to approve one runtime session.
- `AT_14_RUNTIME_VISUAL_RECHECK_EVIDENCE_TEMPLATE.md` - post-session evidence template: copy, rename with date, fill after recheck.
- `AT_14_RUNTIME_VISUAL_RECHECK_SCOPE.md` - per-section observation points and expected element values.
- `AT_14_RUNTIME_VISUAL_RECHECK_SELF_AUDIT.md` - ClaudeCode self-audit confirming docs-only diff; runtime HOLD.
- `AT_13_FINAL_VISUAL_POLISH_EVIDENCE.md` - AT-13 implementation evidence and responsive check results.
- `SHIKISHIMA_FINAL_VERIFICATION_PROCESS_TO_100.md` - final verification process from current near-complete state to real-operation readiness 100%.
- `PXR_POST_100_DEFER_RECORD.md` - records Pixel Room / character-design polish as post-100 deferred work.
- `POST_100_CANDIDATE_GATE_PROCESS_DESIGN.md` - post-100 candidate process for PXR polish, AT-14 runtime visual confirmation, CC-03, HB-01, and XS-01 gates.
- `FINAL_100_ACCEPTANCE_RECORD.md` - Shikishima real-operation readiness 100% acceptance record (PASS_WITH_CAVEAT, tk 2026-05-20).
- `AT_14_ROOM_VISUAL_EVIDENCE.md` - AT-14 runtime visual confirmation PASS evidence (tk 2026-05-20).
- `XS_01_GATE_READINESS.md` - XS-01 x_search read-only gate readiness (HOLD — not implemented, prerequisites listed).
- `HB_01_GATE_READINESS.md` - HB-01 Hermes/WSL gate readiness (HOLD — designReadyNoExecution, activation prerequisites listed).
- `CC_03_GATE_READINESS.md` - CC-03 Command Chat real-send gate readiness (HOLD — local-only, real-send prerequisites listed).
- `XS_01_READ_ONLY_EXECUTION_EVIDENCE_2026-05-20.md` - XS-01 read-only execution PASS evidence 2026-05-20 (1/1 run, gate closed; Android Halo design signal confirmed).
- `DIS_00_DISCORD_BRIDGE_GATE_DESIGN.md` - DIS-00 Discord Bridge gate design: phase sequence DIS-00 to DIS-04, one-channel policy, core rule.
- `DIS_01_DISCORD_READ_ONLY_INTAKE_PLAN.md` - DIS-01 read-only intake plan (HOLD — read channel only, no send).
- `DIS_02_DISCORD_DRAFT_RESPONSE_PLAN.md` - DIS-02 draft response plan (Level 1-4, no Discord write).
- `DIS_03_DISCORD_HUMAN_GO_REPLY_PLAN.md` - DIS-03 human GO reply plan (Level 5, one message, verbatim).
- `DIS_04_DISCORD_LIMITED_AUTO_REPLY_DEFERRED.md` - DIS-04 limited auto-reply (DEFERRED — Level 5+, future candidate).
- `DISCORD_TOKEN_AND_PERMISSION_POLICY.md` - Discord token never-commit policy, minimum permissions, channel restriction.
- `DISCORD_BRIDGE_STOP_CONDITIONS.md` - Discord Bridge universal + phase-specific STOP conditions.
- `DISCORD_BRIDGE_SELF_AUDIT.md` - DIS-00 docs-only diff self audit (all safety checks false).
- `XACC_00_X_ACCOUNT_INTEGRATION_GATE_DESIGN.md` - XACC-00 X account integration gate design: XACC-00 to XACC-05 sequence, sub-account recommendation, OAuth 2.0 PKCE policy.
- `XACC_01_READ_ONLY_AUTH_SCOPE_PLAN.md` - XACC-01 read-only scope plan (HOLD — tweet.read/users.read, no connection).
- `XACC_02_READ_ONLY_EXECUTION_PLAN.md` - XACC-02 one controlled read-only execution plan (HOLD).
- `XACC_03_DRAFT_ONLY_POST_PLAN.md` - XACC-03 draft-only post/reply plan (Level 1-4, no X write).
- `XACC_04_HUMAN_GO_WRITE_PLAN.md` - XACC-04 human GO write plan (Level 5, one post/reply, verbatim).
- `X_ACCOUNT_TOKEN_AND_SCOPE_POLICY.md` - X account password-never policy, token storage, scope table, rate limit, rotation.
- `X_ACCOUNT_STOP_CONDITIONS.md` - X account universal + phase-specific STOP conditions.
- `X_ACCOUNT_SELF_AUDIT.md` - XACC-00 docs-only diff self audit.
- `WK_00_CONTROLLED_WORKER_ENVIRONMENT_DESIGN.md` - WK-00 controlled worker environment design: copy-only/human-bridge, Level 4 max AI, Level 5 human gate.
- `WK_01_CODEX_WORKER_BOUNDARY.md` - WK-01 Codex worker boundary (human-mediated only, remote control HOLD).
- `WK_02_CLAUDECODE_WORKER_BOUNDARY.md` - WK-02 ClaudeCode worker boundary (human-mediated only, MCP/hooks/daemon HOLD).
- `WK_03_WORKER_TASK_QUEUE_PLAN.md` - WK-03 worker task queue states and transitions.
- `WK_04_WORKER_PROMPT_EXPORT_PLAN.md` - WK-04 copy-only prompt export plan and safety statement.
- `WK_WORKER_AUTOMATION_HOLD_POLICY.md` - full automation HOLD policy (auto-launch/remote control/MCP/hooks/daemon).
- `WK_CONTROLLED_WORKER_ENVIRONMENT_EVIDENCE.md` - WK-00 implementation evidence (typecheck PASS, display-only, all safety flags false).
- `XS_AUTO_00_READ_ONLY_AUTOMATION_GATE_DESIGN.md` - XS-AUTO-00 read-only automation gate design (XS-AUTO-00 to XS-AUTO-05 phases, core rule, all HOLD).
- `XS_AUTO_01_WATCHLIST_AND_QUERY_POLICY.md` - XS-AUTO-01 watchlist definition (5 items, schema, forbidden query types, all HOLD).
- `XS_AUTO_02_PATROL_SCHEDULER_HOLD_PLAN.md` - XS-AUTO-02 scheduler HOLD plan (future modes, required GO fields).
- `XS_AUTO_03_EVIDENCE_AND_RATE_LIMIT_POLICY.md` - XS-AUTO-03 per-run evidence schema and 429 rate limit policy.
- `XS_AUTO_04_STOP_CONDITIONS.md` - XS-AUTO-04 universal + phase-specific STOP conditions.
- `XS_AUTO_SELF_AUDIT.md` - XS-AUTO-00 implementation self audit (typecheck PASS, all safety flags false).
- `LIB_00_EXTERNAL_LIBRARY_DESIGN.md` - LIB-00 external library design: Obsidian Vault as 正本, 5フェーズ展開, agent 役割分担.
- `LIB_01_MARKDOWN_VAULT_STRUCTURE.md` - LIB-01 shikishima-library/ vault structure plan (10 folders, naming rules).
- `LIB_02_NOTE_TEMPLATES.md` - LIB-02 note templates: Research / Development / Evidence / Decision / Handoff (5 types with rawValues policy).
- `LIB_03_OBSIDIAN_LOCAL_WRITE_GATE.md` - LIB-03 Obsidian local write gate (HOLD — OB-01 GO required, rawValues pre-write checklist).
- `LIB_04_INDEX_AND_RAG_PLAN.md` - LIB-04 vault index display + RAG search plan (both HOLD — future phases).
- `LIB_SELF_AUDIT.md` - LIB-00 docs-only self audit (obsidian_connected false, local_write HOLD).
- `OBS_LIB_00_OBSIDIAN_LOCAL_LIBRARY_DESIGN.md` - OBS-LIB-00 Obsidian local library design (管制室/記録庫/証跡分離, phase plan).
- `OBS_LIB_01_LOCAL_VAULT_CONNECTION_PLAN.md` - OBS-LIB-01 local vault path policy (redacted display, no cloud, OB-01 gate).
- `OBS_LIB_02_MARKDOWN_EXPORT_PLAN.md` - OBS-LIB-02 Markdown export schema, frontmatter, categories, rawValues rules.
- `OBS_LIB_03_REPORT_IMAGE_EXPORT_PLAN.md` - OBS-LIB-03 article-style PNG plan (HTML/React now; PNG via Electron capturePage HOLD).
- `OBS_LIB_04_LOCAL_WRITE_GATE_POLICY.md` - OBS-LIB-04 dry-run vs real write, ob01_local_write_go, no automatic background write.
- `OBS_LIB_STOP_CONDITIONS.md` - OBS-LIB universal + category-specific STOP conditions.
- `OBS_LIB_IMPLEMENTATION_EVIDENCE.md` - OBS-LIB-00 implementation evidence (typecheck PASS, local write HOLD, all safety false).
- `LEVEL_4_FINAL_CONFIRMATION_RECORD.md` - Level 4 final confirmation PASS (Level 1–4 evidence chain, Level 5 HOLD).
- `LEVEL_5_TRANSITION_READINESS_PACKAGE.md` - Level 5 transition readiness (14-action catalog, pre-conditions, key principles).
- `LEVEL_5_GATE_OPENING_ORDER.md` - Recommended Level 5 gate opening order #1–#13 with risk classification.
- `A_LIMITED_OPERATION_TO_LEVEL5_RUNBOOK.md` - 10-step A限定運用→Level 5 daily runbook (one gate per session).
- `LEVEL_5_STOP_CONDITIONS_MASTER.md` - Master STOP conditions (universal + gate-specific + post-STOP procedure).
- `LEVEL_5_HUMAN_GO_TEMPLATE.md` - 12 ready-to-fill GO templates for all Level 5 gates.
- `LEVEL_4_TO_LEVEL_5_SELF_AUDIT.md` - L4→L5 transition self audit (docs-only, all safety false).
- `SHIKISHIMA_100_PERCENT_ROADMAP_DESIGN.md` - Phase 1–10 フェーズ設計書; 100%までの全計画.
- `SHIKISHIMA_REMAINING_TASK_REGISTRY_TO_100.md` - DONE/HOLD/BLOCKED/FUTURE 全Task表.
- `SHIKISHIMA_LEVEL5_GATE_PLAN_TO_100.md` - Level 5 全操作一覧 + 承認フォームテンプレート.
- `SHIKISHIMA_100_PERCENT_DEFINITION_OF_DONE.md` - 100% の定義と最終チェックリスト.
- `SHIKISHIMA_NEXT_SESSION_HANDOFF_TO_100.md` - 次セッション引き継ぎ + Option A-E.
- `SHIKISHIMA_100_PERCENT_ROADMAP_SELF_AUDIT.md` - ClaudeCode 自己監査記録 (docs-only diff確認).
- `LEVEL5_BLOCKED_TASKS.md` - Level 5 ブロック中タスク (CC-03/HB-01/XS-01) 承認フォーム.
- `2026-05-19_DAILY_WORK_SUMMARY.md` - 2026-05-19 全作業サマリー.
- `AT_REMAINING_IMPLEMENTATION_PUSH_READINESS.md` - docs-only push readiness checklist for remaining AT design package.
- `PROVIDER_ROUTER_UPDATED_DESIGN.md` - updated provider routing design (primary/fallback/escalation).
- `HERMES_SOCIAL_AWARENESS_FEATURE_CATALOG.md` - Social Awareness Layer feature catalog with XS stage gates.
- `X_SEARCH_SHIKISHIMA_INTEGRATION_PLAN.md` - x_search read-only integration plan and Draft Outbox design.
- `X_SEARCH_HOLD_GO_MATRIX.md` - XS-00 through XS-09 gate sequence for x_search activation.
- `HERMES_TOOL_EXPANSION_CATALOG.md` - complete Hermes tool catalog (HOLD/CANDIDATE/REJECT).
- `NARUEBI_STYLE_REFERENCE_BOUNDARY.md` - what Shikishima adopts vs rejects from Naruebi social pattern.
- `AGENT_THEATER_IMPLEMENTATION_DESIGN.md` - Agent Theater (Control Room) main design, layout, and tech stack.
- `PIXEL_GHOST_AGENT_CHARACTER_SPEC.md` - pixel ghost character spec for 5 agents (visual, pose, flag color).
- `AGENT_THEATER_POSE_AND_ACTION_MATRIX.md` - 8-pose matrix per agent with animation types and state mapping.
- `AGENT_HANDOFF_FLOW_DESIGN.md` - 8-step handoff flow + HOLD/STOP visual behavior.
- `SLOT_WORKER_ROUTING_DESIGN.md` - 8 Slot definitions with worker/gate/allowed/forbidden rules.
- `CODEX_CLAUDECODE_WORKER_BOUNDARY.md` - dev worker constraint policy (allowed/forbidden commands).
- `AGENT_THEATER_SAFETY_DISPLAY_POLICY.md` - what must/must not show in Agent Theater UI.
- `AGENT_THEATER_IMPLEMENTATION_PHASES.md` - AT-00 through AT-08 phase plan.
- `AT_04_VISUAL_RECHECK_GO_PACKAGE.md` - AT-04 runtime visual recheck GO package (runtime GO not yet issued).
- `AT_04_VISUAL_RECHECK_CHECKLIST.md` - visual checklist for AT-04 runtime observation.
- `AT_04_VISUAL_RECHECK_EVIDENCE_TEMPLATE.md` - evidence template for AT-04 runtime observation.
- `AT_07_CONTROL_ROOM_ENVIRONMENT_LAYOUT_EVIDENCE.md` - AT-07 dark control room implementation evidence.
- `SHIZUME_SAFETY_GATE_POLICY.md` - Shizume safety gate policy.
- `SHIZUME_DECISION_MATRIX.md` - GO / HOLD / REJECT decision matrix.
- `SHIKISHIMA_SYSTEM_DIAGRAM.md` - system diagrams in Mermaid and ASCII.
- `ROADMAP_STATUS_SCHEMA.md` - human-readable status schema.
- `PHASE_3_AGENT_PERMISSION_REVIEW.md` - Phase 3 human review package.
- `PHASE_4_MODEL_ROUTER_REVIEW.md` - Phase 4 Model Router review package.
- `PHASE_5_SHIZUME_POLICY_REVIEW.md` - Phase 5 縺励★繧・policy review package.
- `TSUMUGI_IMPLEMENTATION_WORKFLOW.md` - Phase 6 non-execution workflow (legacy: つむぎ → canonical: つむぐ).
- `TSUMUGI_TASK_TEMPLATE.md` - 縺､繧縺・task intake template.
- `TSUMUGI_SAFE_PATCH_CHECKLIST.md` - safe patch checklist.
- `SHIRUBE_LOGGING_POLICY.md` - redacted logging policy.
- `SHIRUBE_HANDOFF_TEMPLATE.md` - handoff template.
- `DAILY_WORKLOG_TEMPLATE.md` - daily worklog template.
- `OBSIDIAN_READY_NOTE_TEMPLATE.md` - manual Obsidian-ready note template.
- `DEVICE_ROLES_AND_BOUNDARIES.md` - device role policy.
- `DEDICATED_DEVICE_PLAN.md` - optional dedicated device plan.
- `IPHONE_REVIEW_DEVICE_POLICY.md` - iPhone review-only policy.
- `ANDROID_FACE_TERMINAL_PLAN.md` - Android face terminal plan.
- `STACKCHAN_EXPRESSION_ONLY_PLAN.md` - StackChan expression-only plan.
- `STACKCHAN_SAFETY_BOUNDARY.md` - robot safety boundary.
- `FACE_TERMINAL_EXPRESSION_PROTOCOL_DRAFT.md` - non-executable expression protocol draft.
- `AGENT_DOT_LINE_FACE_SYSTEM.md` - current minimal dot-line face system.
- `MINIMAL_FACE_EXPRESSION_STATES.md` - design-only expression states.
- `MOUTH_FLAP_ANIMATION_CONCEPT.md` - future mouth-flap concept.
- `EYE_GAZE_ANIMATION_CONCEPT.md` - future gaze and blink concept.
- `AGENT_TINY_SYMBOLS.md` - tiny symbol identity system.
- `SMARTPHONE_FACE_DISPLAY_PLAN.md` - smartphone display-only face plan.
- `STACKCHAN_FACE_DISPLAY_ADAPTATION.md` - future StackChan display-only adaptation.
- `FACE_DESIGN_SAFETY_BOUNDARY.md` - face design approval boundary.
- `VOICE_MOUTH_EYE_CONCEPT.md` - voice, mouth, and gaze concept.
- `AGENT_FACE_VOICE_PATTERN_GUIDE.md` - agent-specific voice/face pattern guide.
- `NON_EXECUTION_FACE_SIGNAL_PROTOCOL.md` - non-execution face signal vocabulary.
- `FACE_TERMINAL_CONNECTION_CONCEPT.md` - future display terminal connection concept.
- `STATIC_FACE_PREVIEW_BOARD.md` - static five-agent face preview board.
- `FACE_PREVIEW_REVIEW_CHECKLIST.md` - visual and safety checklist for face preview.
- `FACE_PREVIEW_VISUAL_STATES.md` - static visual state mapping for face preview.
- `EXPRESSION_VARIATION_SET.md` - common static expression variation set.
- `AGENT_EXPRESSION_STATE_MATRIX.md` - expression application matrix by agent.
- `STATIC_DESIGN_REVIEW_PACKAGE.md` - v1.0.0 static design review package.
- `V1_STATIC_REVIEW_CHECKLIST.md` - v1 static review checklist.
- `V1_NOT_PRODUCTION_READY_NOTICE.md` - v1 not-production-ready notice.
- `V1_HUMAN_STATIC_REVIEW_RECORD.md` - human static review record template.
- `MINIMUM_OPERATION_RUNBOOK_DRAFT.md` - Phase 10 runbook draft.
- `HUMAN_GO_APPROVAL_CHECKLIST.md` - future scoped GO checklist.
- `NO_GO_CHECKLIST.md` - stop/no-go checklist.
- `FIRST_SUPERVISED_OPERATION_LOG_TEMPLATE.md` - first supervised operation log template.
- `HUMAN_DOCUMENTATION_REVIEW_GUIDE.md` - safe human documentation review guide.
- `PHASE_3_APPROVAL_CHECKLIST.md` - Phase 3 documentation approval checklist.
- `PHASE_4_APPROVAL_CHECKLIST.md` - Phase 4 documentation approval checklist.
- `PHASE_5_APPROVAL_CHECKLIST.md` - Phase 5 documentation approval checklist.
- `PHASE_6_TO_10_PRE_EXECUTION_REVIEW_CHECKLIST.md` - pre-execution review checklist.
- `DOCUMENTATION_APPROVAL_RECORD_TEMPLATE.md` - manual documentation approval record.
- `EXECUTION_APPROVAL_SEPARATION_POLICY.md` - approval separation policy.
- `EXPLORER_DASHBOARD_DESIGN.md` - Explorer-style static dashboard design.
- `AGENT_DIRECTORY_DASHBOARD.md` - Agent Directory dashboard design.
- `HUMAN_REVIEW_QUEUE_DESIGN.md` - Human Review Queue design.
- `SHIRUBE_KNOWLEDGE_INDEX_DESIGN.md` - 縺励ｋ縺ｹ Knowledge Index design.
- `DEVELOPMENT_TEMPO_DASHBOARD.md` - Development Tempo dashboard design.
- `SAFE_PROGRESS_VIEWS.md` - safe non-competitive progress views.
- `REPOSITORY_HYGIENE_AUDIT.md` - v1.1.0 overall hygiene audit report.
- `NAMING_MIGRATION_CANDIDATES.md` - naming migration candidate list.
- `OBSOLETE_FILE_CANDIDATES.md` - obsolete/deprecated file candidates.
- `SECURITY_AND_SAFETY_AUDIT_NOTES.md` - redacted security and safety findings.
- `PROJECT_ALIGNMENT_REVIEW.md` - 5-agent and plan alignment review.
- `PACKAGE_METADATA_AUDIT.md` - v1.2.2 package metadata audit (description/name/productName).
- `PACKAGE_NAME_MIGRATION_PLAN.md` - package name migration plan + v1.3.0 execution record.
- `PACKAGE_LOCK_DIRTY_STATE_CLASSIFICATION.md` - v1.2.6 package-lock dirty state audit.
- `SRC_DIRTY_FILES_CLASSIFICATION.md` - v1.2.7 src dirty file classification (Group A/B).
- `GROUP_B_UNTRACKED_SOURCE_AUDIT.md` - v1.2.9 Group B untracked source audit.
- `POST_V1_3_0_REFERENCE_AUDIT.md` - v1.3.1 post-migration hermes-desktop reference audit.
- `UNTRACKED_WORKTREE_INVENTORY.md` - v1.3.1 untracked worktree classification.
- `V2_GOAL_AND_TASK_PACK.md` - v2.0 goal definition + task pack v1.3.1竊致2.0.
- `V2_HOLD_GATE_MATRIX.md` - all HOLD gates with GO conditions.
- `V2_IMPLEMENTATION_SEQUENCE.md` - linear task sequence v1.3.1竊致2.0 with HOLD gates.
- `SANDBOX_GITIGNORE_AUDIT.md` - v1.4.0 sandbox/.cursor/.claude gitignore audit.
- `TESTS_ICHIKISHIMA_REVIEW_PACKAGE.md` - v1.5.0 tests/ichikishima review (66 files classified).
- `TESTS_HERMES_REVIEW_PACKAGE.md` - v1.5.1 tests/hermes review (12 zone tests classified).
- `DOCS_ICHIKISHIMA_MIGRATION_PLAN.md` - v1.6.0 docs/ichikishima migration plan (127 files classified).
- `PHASE_D_SRC_RENAME_PLAN.md` - v1.7.0 Phase D src rename plan (execution HOLD).
- `PHASE_D_RENAME_IMPACT_MATRIX.md` - v1.7.0 Phase D import path impact matrix.
- `PHASE_E_REPO_RENAME_PLAN.md` - v1.9.0 Phase E GitHub repo rename plan (execution HOLD).
- `PHASE_E_EXTERNAL_REFERENCE_MATRIX.md` - v1.9.0 Phase E external reference matrix.
- `V2_READINESS_PACKAGE.md` - v2.0 Shikishima v2 readiness assessment (all v2.0 tasks done).
- `V2_REMAINING_HOLD_ITEMS.md` - v2.0 remaining HOLD items classified (H-1 through H-5).
- `V3_EXECUTION_VALIDATION_PRECONDITIONS.md` - v2.0 minimum preconditions for v3.x execution validation.
- `V3_GOAL_AND_TASK_PACK.md` - v2.1.0 v3.x goal definition + task list v3.0–v3.9 (docs-only, no execution).
- `V3_EXECUTION_VALIDATION_ROADMAP.md` - v2.1.0 staged execution validation path S-0 to S-12.
- `V3_HOLD_GATE_MATRIX.md` - v2.1.0 19 HOLD gates G-01 through G-19 with GO conditions.
- `V3_IMPLEMENTATION_SEQUENCE.md` - v2.1.0 linear v3.0–v3.9 sequence with HOLD gates.
- `REAL_OPERATION_PATH_TO_PRODUCTION.md` - v2.1.0 real operation path v3 through v10.
- `V3_TEST_COMMIT_DECISION_MATRIX.md` - v2.1.0 test commit decisions (no staging performed).
- `V3_HUMAN_GO_CHECKLIST.md` - v2.1.0 19 independent GO checklists for human approval.
- `REAL_OPERATION_MASTER_ROADMAP.md` - v2.2.0 authoritative v3–v10 master roadmap with productionReady conditions.
- `V3_TO_V10_TASK_TREE.md` - v2.2.0 hierarchical task breakdown v3–v10; docs/code/cmd/hw classification.
- `REAL_OPERATION_HOLD_GATE_MATRIX.md` - v2.2.0 comprehensive G-01–G-24 gate matrix with rollback conditions.
- `HUMAN_REVIEW_DAY_RUNBOOK.md` - v2.2.0 step-by-step human review runbook for GO decisions.
- `PRODUCTION_READY_DEFINITION.md` - v2.2.0 productionReady true definition; G-18 only path; final checklist.
- `CONTROLLED_PILOT_DEFINITION.md` - v2.2.0 controlled pilot definition; single-run; human-in-loop; stop conditions.
- `SAFE_AUTONOMY_LADDER.md` - v2.2.0 Level 0–9 autonomy ladder; current level 0; downgrade policy.
- `DEVICE_AND_ROBOT_INTEGRATION_GATE.md` - v2.2.0 device integration gates (StackChan/voice/camera/robotMotion).
- `V3_IMPLEMENTATION_BACKLOG.md` - v2.2.0 READY/AFTER-GO/AFTER-STAGE classified backlog with priority order.
- `REAL_OPERATION_ROLLBACK_AND_INCIDENT_PLAN.md` - v2.2.0 P0–P3 incident response; rollback; emergency stop concept.
- `V3_STATIC_VALIDATION_PLAN.md` - v2.3.0 typecheck/eslint/vitest/build plan; GO/STOP conditions; redacted output format.
- `V3_DUMMY_WRAPPER_EXECUTION_PLAN.md` - v2.3.0 dummy process and wrapper plan; G-09/G-10 conditions.
- `V3_WSL_HERMES_EXECUTION_PLAN.md` - v2.3.0 WSL/Hermes execution plan; G-11/G-12; emergency stop.
- `V3_REDACTED_RESULT_REVIEW_TEMPLATE.md` - v2.3.0 fill-in result templates; incident report format.
- `V3_TOMORROW_DEBUG_RUNBOOK.md` - v2.3.0 tomorrow debug session step-by-step; GO/HOLD decision tree.
- `V7_FACE_TERMINAL_DISPLAY_ONLY_SPEC.md` - v2.5.0 face terminal state model; expression/mouth/gaze sets; safety labels.
- `V7_STACKCHAN_DISPLAY_ONLY_PLAN.md` - v2.5.0 G-14 preconditions; display-only definition; robotMotion HOLD boundary.
- `V7_FACE_TERMINAL_STATIC_PREVIEW.md` - v2.5.0 ASCII previews of all expressions; mouth/gaze patterns.
- `V8_MOUTH_EYE_ANIMATION_SPEC.md` - v2.5.0 mouth frame animation; gaze transitions; display-only notes.
- `V8_VOICE_MOUTH_EYE_NON_IO_PLAN.md` - v2.5.0 TTS/STT concept plans (no execution); G-15/G-16 boundaries.
- `V9_CONTROLLED_PILOT_RUNBOOK.md` - v2.6.0 G-23 runbook; pre-flight; scenario; stop conditions; post-run record.
- `V9_SINGLE_RUN_APPROVAL_TEMPLATE.md` - v2.6.0 G-23 template; one-run-only policy.
- `V10_PRODUCTION_READINESS_REVIEW_PACKAGE.md` - v2.6.0 sections A–H review package; all HOLD until v10.
- `V10_FINAL_HUMAN_APPROVAL_TEMPLATE.md` - v2.6.0 G-18 + G-19 templates; human-only.
- `PRODUCTION_READY_FALSE_GUARD.md` - v2.6.0 productionReady guard; sole path to true = G-18.
- `TOMORROW_DEBUG_AND_REVIEW_PACKAGE.md` - v2.7.0 tomorrow session entry point; quick status; review order.
- `TOMORROW_GO_HOLD_DECISION_SHEET.md` - v2.7.0 G-01 through G-07 decision questions.
- `TOMORROW_COMMAND_EXECUTION_BOUNDARY.md` - v2.7.0 allowed/GO-required/forbidden command reference.
- `TOMORROW_STACKCHAN_BOUNDARY_CHECK.md` - v2.7.0 StackChan physical status; daily boundary confirmation.
- `TOMORROW_TEST_COMMIT_REVIEW_SHEET.md` - v2.7.0 test file review checklist; pre-stage final check.
- `HUMAN_REVIEW_READY_PACKAGE.md` - v2.9.2 local validation review-ready candidate package.
- `VALIDATION_PASS_CANDIDATE_SUMMARY.md` - v2.9.2 G-05/G-06/G-07 PASS candidate summary.
- `HUMAN_REVIEW_DECISION_SHEET.md` - v2.9.3 human decision sheet for accepting or holding validation candidates.
- `PRE_OPERATION_READINESS_GATE.md` - v2.9.6 pre-operation gate and STOP conditions; human reviewer notes recorded.
- `CONTROLLED_PILOT_PLAN.md` - v2.9.6 design-only controlled pilot plan; Level 0 remains current; human reviewer notes recorded.
- `REMOTE_PUSH_EVIDENCE.md` - v2.9.7 evidence record of first remote push to tkFX-0/hermes-desktop; docs-only scope; future push requires new approval.
- `LEVEL_1_ACCEPTANCE_CLARIFICATION.md` - v2.9.8 clarifies G-05/G-06/G-07 as official PASS for Level 1 review; accepts rollback references; Level 1 GO not approved.
- `LEVEL_1_LOCAL_DRY_RUN_SCOPE_PROPOSAL.md` - v2.9.8 proposed exact Level 1 scope; commands, output policy, stop conditions; proposal only, not approved.
- `LEVEL_1_GO_WORDING_REVIEW.md` - v2.9.9 draft GO wording template with exact command scope, output policy, stop conditions, post-run report format, and review checklist; wording review only, not GO.
- `LEVEL_1_LOCAL_DRY_RUN_EVIDENCE.md` - v3.0.0 evidence record of Controlled Pilot Level 1 local dry-run PASS (2026-05-14); all 5 commands passed; Level 2 requires separate GO.
- `LEVEL_2_LOCAL_CONTROLLED_VALIDATION_SCOPE_PROPOSAL.md` - v3.1.0 Level 2 scope proposal; Option A selected (deeper redacted review of same 5 commands); proposal only, not approved.
- `LEVEL_2_GO_WORDING_REVIEW.md` - v3.1.1 draft GO wording template for Level 2; structured output policy; 15-item checklist; wording review only, not GO.
- `V3_GOAL_ROADMAP.md` - v3.1.2 5-track goal roadmap (A–E), roadmap sequence v3.0.0–v4.0.0+, STOP gates, human approval rules.
- `CLAUDE_CODE_GOAL_DEFINITIONS.md` - v3.1.2 10 /goal definitions for Claude Code task invocation; allowed/forbidden scope, human approval, stop conditions per goal.
- `FINAL_SHIKISHIMA_100_PERCENT_DEFINITION.md` - v3.1.3 10-track Final Shikishima 100% definition; Scoped vs Final 100% distinction; current progress is not Final 100%.
- `FINAL_100_PERCENT_TRACK_MATRIX.md` - v3.1.3 12-track status matrix; Track E absolute HOLD; current status per track.
- `FINAL_100_PERCENT_GOAL_TREE.md` - v3.1.3 /goal tree from shikishima.final-100 through 12 child goals; definition, gate, GO, stop conditions per goal.
- `STACKCHAN_NOT_ARRIVED_ROBOT_PREPARATION_ONLY.md` - v3.1.4 explicit record that StackChan has not arrived; robot preparation-only allowed; robot runtime/connection/motion HOLD.
- `LEVEL_2_FINAL_GO_PACKAGE.md` - v3.2.0-candidate final Level 2 GO package; ready-to-copy GO block (time window blank); 5-command scope; result format; 15-item checklist; Level 2 GO not approved by this doc.
- `LEVEL_2_LOCAL_CONTROLLED_VALIDATION_EVIDENCE.md` - v3.2.1 evidence record of Level 2 local controlled validation PASS (2026-05-14); 712 tests passed; no regression; Level 3 requires separate GO.
- `POST_LEVEL_2_HUMAN_ACCEPTANCE_RECORD.md` - v3.3.0 official human acceptance record; 18-item review checklist (all PASS); accepted_as_level_2_validation_evidence; HOLD boundary confirmed; next candidate Track B.
- `LOCAL_APP_OBSERVATION_READINESS.md` - v3.4.0 Track B readiness scope; preconditions (10 items); allowed observation activities; forbidden activities; stop conditions; human decision options; Local App Observation execution not approved.
- `LOCAL_APP_OBSERVATION_SCOPE_PROPOSAL.md` - v3.4.0 proposed future Local App Observation scope (not approved); proposed GO wording template (placeholder — not GO); proposed stop conditions; proposed evidence format; time_window required.
- `LOCAL_APP_OBSERVATION_EVIDENCE_TEMPLATE.md` - v3.4.0 fill-in evidence template for future observation; redacted-only output policy; screens/result/issues/stop-conditions/working-tree fields; template use policy.
- `TRACK_B_READINESS_ACCEPTANCE_RECORD.md` - v3.5.0 official human acceptance record for Track B readiness; 17-item review checklist (all PASS); accepted_as_track_b_readiness_scope; HOLD boundary confirmed; next candidate GO wording review.
- `LOCAL_APP_OBSERVATION_GO_WORDING_REVIEW.md` - v3.6.1 GO wording review only (not GO); hardened command .\node_modules\.bin\electron.cmd . (local binary only); 14-item pre-run checklist; 10 stop conditions; 13-item GO wording checklist; post-observation decision options.
- `PRACTICAL_LOCAL_MVP_OPERATION_DEFINITION.md` - v3.7.0 6-tier operation level (B0-B4, C); definition of Practical Local MVP Operation; 13-item session verification; remaining HOLD list; Level 3 candidate conditions.
- `LOCAL_OPERATION_AUTONOMOUS_LOOP_PLAN.md` - v3.7.0 7-step allowed autonomous loop pattern; forbidden loop pattern; loop termination conditions; per-iteration output format.
- `LOCAL_OPERATION_TEST_MATRIX.md` - v3.7.0 pre/during/post observation check tables; evidence recording rules; session result criteria (PASS/HOLD/NG).
- `LOCAL_OPERATION_STOP_CONDITIONS.md` - v3.7.0 pre/during/post/loop stop conditions (31 total); after-stop procedure; safety boundary.
- `LOCAL_MVP_OPERATOR_RUNBOOK.md` - v3.8.0 operator guide: who/when/pre-open checks/allowed/forbidden/record/stop/report/HOLD; local MVP is human-supervised only.
- `LOCAL_MVP_DAILY_CHECK_TEMPLATE.md` - v3.8.0 per-session fill-in template; pre-open/observation/status/safety/stop/result fields; redacted-only policy; one per session.
- `LOCAL_MVP_INCIDENT_RESPONSE_PLAYBOOK.md` - v3.8.0 9 incident types; immediate actions per type; what not to record; reopen/commit/push policy per type.
- `PRACTICAL_LOCAL_MVP_ACCEPTANCE_CRITERIA.md` - v3.8.0 24 criteria (10 docs + 6 evidence + 8 safety); Practical Local MVP ≠ Final 100% distinction; current status per criterion.
- `AUTONOMOUS_LOOP_BOUNDARIES.md` - v3.8.0 12 allowed + 18 forbidden autonomous loop actions; 5 gate checks; loop output contract.
- `LEVEL_3_CANDIDATE_PRECONDITIONS.md` - v3.8.0 16 preconditions for Level 3 candidate; Level 3 remains HOLD; explicit statement this doc does not approve Level 3.
- `LOCAL_APP_OBSERVATION_EVIDENCE.md` - v3.9.0 Level B1 observation evidence (2026-05-14 19:15-20:00 JST); app started; 2 screens PASS; no stop conditions; no raw values; working tree unchanged.
- `LOCAL_APP_OBSERVATION_ACCEPTANCE_RECORD.md` - v3.10.0 official human acceptance record; accepted_as_local_app_observation_evidence; 13-item checklist (all PASS); criteria_e1-e6 PASS; next: Level B3 Operation Rules.
- `PRACTICAL_LOCAL_MVP_OPERATION_RULES.md` - v3.11.0 Level B3 operation rules; 13 pre-run checks; allowed/forbidden actions; 12 STOP conditions; incident handling; next level conditions; human acceptance pending.
- `LOCAL_MVP_SESSION_PROTOCOL.md` - v3.11.0 7 session states; 10-step flow (pre-check → GO → binary → open → observe → stop-check → close → working-tree → evidence → acceptance); session ID format.
- `LOCAL_MVP_EVIDENCE_SCHEMA.md` - v3.11.0 all evidence fields with types and formats; 10 validation rules; redacted-only policy.
- `LOCAL_MVP_OPERATION_ACCEPTANCE_RECORD_TEMPLATE.md` - v3.11.0 ready-to-fill acceptance block; 16-item pre-acceptance checklist; what acceptance means / does not mean.
- `LOCAL_MVP_OPERATION_ACCEPTANCE_RECORD.md` - v3.12.0 official human acceptance record; accepted_as_practical_local_mvp_operation_rules; 18-item checklist (all PASS); HOLD boundary confirmed; next: Level B3 daily operation loop.
- `LOCAL_MVP_OPERATION_EVIDENCE_2026-05-16-009.md` - v3.21.0 Session-009 iPhone same-LAN evidence; CLEAN_B3_PASS_CANDIDATE; no Level 3, productionReady, execution, or runtime branch push approval.
- `B3_5_OF_5_ACCEPTANCE_REVIEW.md` - v3.22.0 B3 5/5 acceptance review; Sessions 003/005/006/007/009 recorded; Session-009 first RustDesk-less iPhone Phase 2C confirmation; pending human acceptance phrase; Level 3 not approved; productionReady false; execution disabled.
- `LOCAL_APP_OBSERVATION_FINAL_GO_TEMPLATE.md` - v3.6.1 ready-to-copy GO block template (time_window placeholder — not GO until human fills and sends); hardened command (local binary only, npx removed); placeholder checklist; allowed/forbidden/stop list.
- `V3_TO_V10_IMPLEMENTATION_COMPLETION_PACK.md` - v2.8.0 DONE/READY/AFTER-GO/HOLD status per stage v3–v10.
- `V3_TO_V10_READY_CHECKLIST.md` - v2.8.0 entry/exit conditions per stage; current readiness status.
- `V3_TO_V10_HUMAN_DECISION_MAP.md` - v2.8.0 all human GO decisions mapped by stage; agent cannot issue GO.
- `V3_TO_V10_DEBUG_FLOW.md` - v2.8.0 per-stage debug flows; universal debug rules.
- `V4_LOCAL_VALIDATION_PREP_PACKAGE.md` - v2.8.1 v4 entry/exit; validation order; remediation priority.
- `V4_VALIDATION_COMMAND_MATRIX.md` - v2.8.1 typecheck/eslint/vitest/build command matrix with GO/STOP.
- `V4_REDACTED_RESULT_CHECKLIST.md` - v2.8.1 per-command redaction checklist; classification table.
- `V4_FAILURE_TO_HOLD_RUNBOOK.md` - v2.8.1 automatic HOLD conditions; return procedure; fix guidelines.
- `V5_LOCAL_ONLY_DRY_RUN_PREP.md` - v2.8.2 v5 entry/exit; verification; stop conditions.
- `V5_LOCAL_ONLY_VALUE_BOUNDARY_CHECKLIST.md` - v2.8.2 local-only value definitions; pre-run and during-run checks.
- `V5_DRY_RUN_APPROVAL_TEMPLATE.md` - v2.8.2 G-20 template; human-only; run scope and duration.
- `V5_DRY_RUN_ROLLBACK_RUNBOOK.md` - v2.8.2 rollback triggers; P0/P1 actions; re-run conditions.
- `V6_WRAPPER_HERMES_WSL_READINESS_PACK.md` - v2.8.3 entry/exit; gate sequence G-09→G-12; safety rules.
- `V6_WRAPPER_EXECUTION_GATE_CHECKLIST.md` - v2.8.3 G-09/G-10/G-11/G-12 checklists with GO templates.
- `V6_WSL_HERMES_STOP_CONDITIONS.md` - v2.8.3 universal and per-process stop conditions; timeouts; emergency stop.
- `V6_REDACTED_EXECUTION_REPORT_TEMPLATE.md` - v2.8.3 fill-in templates for dummy/wrapper/WSL/Hermes results.
- `V7_DEVICE_DISPLAY_ONLY_READINESS_PACK.md` - v2.8.4 entry/exit; display-only allowed/forbidden; StackChan NOT connected.
- `V7_STACKCHAN_NOT_CONNECTED_CHECKLIST.md` - v2.8.4 daily physical status check; G-14 pre-conditions.
- `V7_FACE_TERMINAL_STATIC_UI_REVIEW.md` - v2.8.4 component review; safety labels; before/after G-14 tests.
- `V7_DISPLAY_ONLY_ROLLBACK_PLAN.md` - v2.8.4 P0/P1/P2 triggers; rollback steps; re-run conditions.
- `V8_NON_IO_EXPRESSION_IMPLEMENTATION_PACK.md` - v2.8.5 entry/exit; implementation status; what can be coded now.
- `V8_MOUTH_PATTERN_REVIEW_SHEET.md` - v2.8.5 frame sequence; timer vs audio modes; review checklist.
- `V8_EYE_GAZE_REVIEW_SHEET.md` - v2.8.5 gaze offsets; blink cycle; camera HOLD confirmed.
- `V8_VOICE_INTENT_LABEL_REVIEW_SHEET.md` - v2.8.5 labels as display-only; label != real state; safety disclaimer.
- `V8_AUDIO_CAMERA_MIC_HOLD_POLICY.md` - v2.8.5 G-15/G-16 HOLD table; code-level forbidden list.
- `V9_CONTROLLED_PILOT_FINAL_PREP.md` - v2.8.6 prep status; what remains; before G-23 conditions.
- `V9_ONE_RUN_ONLY_CHECKLIST.md` - v2.8.6 before/during/after checklist; auto-repeat prohibition.
- `V9_HUMAN_MONITORING_CHECKLIST.md` - v2.8.6 monitor role; 30s cadence; after-run checklist.
- `V9_PILOT_STOP_AND_ROLLBACK_CARD.md` - v2.8.6 stop triggers; how to stop; P0/P1/P2 rollback levels.
- `V10_PRODUCTION_READINESS_FINAL_REVIEW_PACK.md` - v2.8.7 sections A–F all HOLD; G-18 decision criteria.
- `V10_PRODUCTION_READY_FALSE_CONFIRMATION.md` - v2.8.7 explicit false confirmation; history table.
- `V10_FINAL_APPROVAL_NOT_YET_GRANTED_NOTICE.md` - v2.8.7 G-18/G-19 not issued; what they require.
- `V10_RELEASE_BLOCKER_MATRIX.md` - v2.8.7 categories A–C; non-blockers; resolution order.
- `V10_PRE_PRODUCTION_AUDIT_TEMPLATE.md` - v2.8.7 6-section fill-in audit; PASS/FAIL; G-18-gated conclusion.
- `openspec-lite/README.md` - no-install Markdown-only development note templates for HOLD-safe task handoffs.

## Human Review Ready Candidate

v2.9.2 adds a Human Review Ready Candidate package for the local validation
road. Recommended review order:

1. `VALIDATION_PASS_CANDIDATE_SUMMARY.md`
2. `HUMAN_REVIEW_READY_PACKAGE.md`
3. Recent local validation commits from Batch A through scoped vitest fix
4. `TOMORROW_GO_HOLD_DECISION_SHEET.md`

This review package is not GO approval. git push, execution, Cloudflare,
productionReady true, device operation, and raw-value handling remain separate
human-only decisions.

## Pre-Operation Readiness Candidate

v2.9.3 adds the next review gate:

1. `HUMAN_REVIEW_DECISION_SHEET.md`
2. `PRE_OPERATION_READINESS_GATE.md`
3. `CONTROLLED_PILOT_PLAN.md`

These documents prepare the human review path toward a future scoped GO. They
do not approve operation, execution, git push, Cloudflare, device access, raw
values, or productionReady true.

v2.9.4 clarifies the Human Review Decision Sheet wording: `--quiet` suppresses
warnings, no blocking ESLint errors were reported, and operational gates beyond
accepted validation evidence remain HOLD unless individually approved.

v2.9.5 records human acceptance of validation evidence only. It accepts G-05,
G-03/G-04, G-06, and G-07 evidence for review purposes and allows
Pre-Operation Readiness Gate review to continue. It does not approve GO,
execution, productionReady true, git push, deploy, Cloudflare,
WSL/Hermes/wrapper, robot/voice/camera/mic, secrets, raw values, local-only
values, or repo-external writes.

## How To Review

1. Open `REAL_OPERATION_ROADMAP.html`.
2. Check `roadmapVersion`, `lastUpdated`, and `latestUpdate`.
3. Read `ROADMAP_CHANGELOG.md`.
4. Review `PHASE_REVIEW_MATRIX.md`.
5. Review `SHIZUME_DECISION_MATRIX.md`.
6. Review `MODEL_ROUTER_REVIEW_MATRIX.md`.
7. Review the Phase 3-10 packages added in v0.3.0.
8. Review `HUMAN_DOCUMENTATION_REVIEW_GUIDE.md`.
9. Use the Phase 3/4/5 approval checklists.
10. Use `EXECUTION_APPROVAL_SEPARATION_POLICY.md` to avoid scope confusion.

Explorer dashboard review order:

1. Open `REAL_OPERATION_ROADMAP.html`.
2. Check v0.5.0 Explorer-style Dashboard.
3. Review `EXPLORER_DASHBOARD_DESIGN.md`.
4. Review `AGENT_DIRECTORY_DASHBOARD.md`.
5. Review `HUMAN_REVIEW_QUEUE_DESIGN.md`.
6. Review `SHIRUBE_KNOWLEDGE_INDEX_DESIGN.md`.
7. Review `DEVELOPMENT_TEMPO_DASHBOARD.md`.
8. Review `SAFE_PROGRESS_VIEWS.md`.

Minimal dot-line face system review order:

1. Review `AGENT_DOT_LINE_FACE_SYSTEM.md`.
2. Review `MINIMAL_FACE_EXPRESSION_STATES.md`.
3. Review `MOUTH_FLAP_ANIMATION_CONCEPT.md`.
4. Review `EYE_GAZE_ANIMATION_CONCEPT.md`.
5. Review `AGENT_TINY_SYMBOLS.md`.
6. Review `SMARTPHONE_FACE_DISPLAY_PLAN.md`.
7. Review `STACKCHAN_FACE_DISPLAY_ADAPTATION.md`.
8. Review `FACE_DESIGN_SAFETY_BOUNDARY.md`.

Voice / mouth / eye concept review order:

1. Review `VOICE_MOUTH_EYE_CONCEPT.md`.
2. Review `AGENT_FACE_VOICE_PATTERN_GUIDE.md`.
3. Review `NON_EXECUTION_FACE_SIGNAL_PROTOCOL.md`.
4. Review `FACE_TERMINAL_CONNECTION_CONCEPT.md`.
5. Re-check `MOUTH_FLAP_ANIMATION_CONCEPT.md`.
6. Re-check `EYE_GAZE_ANIMATION_CONCEPT.md`.
7. Re-check `FACE_TERMINAL_EXPRESSION_PROTOCOL_DRAFT.md`.

Static face preview review order:

1. Open `REAL_OPERATION_ROADMAP.html`.
2. Check the v0.8.0 Static Face Preview Board.
3. Review `STATIC_FACE_PREVIEW_BOARD.md`.
4. Review `FACE_PREVIEW_REVIEW_CHECKLIST.md`.
5. Review `FACE_PREVIEW_VISUAL_STATES.md`.
6. Check PC-width readability.
7. Check smartphone-width readability.

Expression variation review order:

1. Review `EXPRESSION_VARIATION_SET.md`.
2. Review `AGENT_EXPRESSION_STATE_MATRIX.md`.
3. Check the Expression Set section in `REAL_OPERATION_ROADMAP.html`.
4. Confirm each expression is display-only.
5. Confirm no expression reads as real-time status, connection status, GO approval, production readiness, or robot control.

v1.0.0 static design review order:

1. Review `STATIC_DESIGN_REVIEW_PACKAGE.md`.
2. Review `V1_STATIC_REVIEW_CHECKLIST.md`.
3. Review `V1_NOT_PRODUCTION_READY_NOTICE.md`.
4. Check `REAL_OPERATION_ROADMAP.html` for `roadmapVersion: v1.0.0`.
5. Confirm v1.0.0 is not productionReady.
6. Confirm v1.0.0 is not GO approval.
7. Confirm v1.0.0 is not execution approval.
8. Confirm Static Face Preview, Expression Variation, and Voice-Mouth-Eye
   Concept remain display-only.

v1.0.1 human static review record order:

1. Review `V1_HUMAN_STATIC_REVIEW_RECORD.md`.
2. Fill only docs/static-only review results.
3. Use `approved_for_static_design_review`, `needs_revision`, or `rejected`.
4. Confirm the record explicitly does not approve GO.
5. Confirm the record explicitly does not approve execution, connection,
   productionReady, voice I/O, camera, microphone, StackChan control, robot
   motion, WSL/Hermes/wrapper/dummy/RunPod, or git push.

v1.1.0 repository hygiene audit review order:

1. Review `REPOSITORY_HYGIENE_AUDIT.md` 窶・overall audit findings.
2. Review `NAMING_MIGRATION_CANDIDATES.md` 窶・decide rename scope and phasing.
3. Review `OBSOLETE_FILE_CANDIDATES.md` 窶・decide delete/archive scope.
4. Review `SECURITY_AND_SAFETY_AUDIT_NOTES.md` 窶・confirm safety signals.
5. Review `PROJECT_ALIGNMENT_REVIEW.md` 窶・confirm alignment decisions.
6. Confirm v1.1.0 is audit-only; no renames or deletions approved.
7. Confirm HOLD remains current after audit review.

If the roadmap is updated, the HTML must visibly show that it was updated.
Every roadmap-affecting change must update the visible HTML changelog and
`ROADMAP_CHANGELOG.md`.

v0.6.0 adds the minimal dot-line face expression system. It supersedes the
costume-heavy bust-up avatar direction for current face design. It is
documentation/design only, not runtime implementation, not StackChan control,
not robot motion approval, not GO, and not production readiness.

v0.7.0 adds voice intent, mouth-flap pattern, and eye-gaze pattern concepts.
They are display labels and review vocabulary only. They do not approve audio
playback, recording, microphone use, camera tracking, external API use,
StackChan control, robot motion, GO, or production readiness.

v0.8.0 adds a static face preview board. It is visual review only. It does not
add buttons, inputs, audio, video, microphone, camera, external API, StackChan
connection, robot control, GO, or production readiness.

v0.8.1 hardens the visual review boundary. Each preview card must remain
display-only, no execution, and no device connection. PC-width and
smartphone-width review are visual checks only.

v0.9.0 adds static expression variations for visual review. Expression states
are display labels only. They are not real-time status, connection status, robot
control preview, GO approval indicators, productionReady indicators, or
execution states.

v0.9.1 hardens expression safety review wording before v1.0. In this version:

- `listening` is conversational posture only, not microphone input, recording,
  or audio standby.
- `thinking` is a static thinking expression only, not live reasoning or active
  processing.
- `holding` is a safety HOLD display concept only, not a pause button or stop
  control.
- `rejected` is a safety decision label only, not a crash or runtime failure.
- `review_ready` is documentation review ready only, not GO-ready or
  execution-ready.
- `completed_static_only` is docs/static-only completion only, not
  productionReady.
- Every expression remains not a runtime status, not a device signal, not a GO
  indicator, and not production readiness.

v1.0.0 adds the Static Design Review Package. It packages v0.1.0 through
v0.9.1 for human static design review only. It is not productionReady, not GO
approval, not execution approval, not device connection approval, not robot
motion approval, and not runtime readiness.

v1.0.1 adds `V1_HUMAN_STATIC_REVIEW_RECORD.md` so the human review result for
v1.0.0 can be recorded without changing scope. The record is docs/static-only
and remains separate from GO, execution approval, connection approval,
productionReady, voice I/O, camera, microphone, StackChan control, robot
motion, WSL/Hermes/wrapper/dummy/RunPod, and git push.

v1.1.0 adds a repository hygiene audit. It is audit-only / report-only. No
files were renamed, deleted, or modified in src/. No execution, no GO, no
productionReady change. The audit records naming candidates, obsolete file
candidates, security/safety signals, and project alignment findings. All
candidates remain HOLD pending separate human decisions.

Next work that may proceed remains documentation/static-only: review notes,
wording cleanup, static HTML readability review, checklist refinement, and
documentation approval record preparation.

## Naming Rules

- `縺励″縺励∪` may use nickname `縺励″`.
- `縺､繧縺餐 may use nickname `縺､繧`.
- `縺励★繧～, `縺ｯ縺倥ａ`, and `縺励ｋ縺ｹ` have no nicknames.
- The old code name `縺・■縺阪＠縺ｾ` is internal historical context only.

## Static-Only Verification Scope

Allowed:

- Reading these docs.
- Editing these docs.
- Reviewing static HTML.
- Checking for external URLs, fetch/API calls, command inputs, and execution buttons.

Forbidden in this documentation task:

- WSL execution.
- Hermes execution.
- wrapper or dummy wrapper execution.
- RunPod startup.
- StackChan or robot control.
- package installation.
- external network.
- git push without separate human approval.
- GO transition.
- `productionReady: true`.

縺薙・遽・峇縺ｧ縺ｯ蝠城｡後ｒ讀懷・縺励※縺・∪縺帙ｓ縲・
