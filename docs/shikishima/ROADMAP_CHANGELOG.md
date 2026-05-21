# Shikishima Roadmap Changelog

## Purpose

This file records visible roadmap-affecting changes for the Shikishima plan.
Roadmap changes are documentation updates only. They are not execution approval,
not GO, and not production readiness.

## Current Roadmap Version

- roadmapVersion: v4.36.0
- lastUpdated: 2026-05-21
- latestUpdate: Discord Bot local setup (DIS-BOT-00/01/02) PASS. Naming correction: XACC-01 Discord → DIS-BOT series. XACC-01 remains HOLD.
- baselineCommit: 86b8381
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

## v4.36.0 - Discord Bot Local Setup PASS + Naming Correction (DIS-BOT series)

- `DIS_BOT_00_LOCAL_TOKEN_SETUP_EVIDENCE_2026-05-21.md`: Bot Token ローカル保存 PASS。token_committed=false / env_file_gitignored=true。
- `DIS_BOT_01_CHANNEL_ACCESS_EVIDENCE_2026-05-21.md`: しきしま指示・しきしまレポート 両チャンネルアクセス PASS。
- `DIS_BOT_02_TEST_MESSAGE_EVIDENCE_2026-05-21.md`: しきしまレポートへテスト送信 PASS (msg_id: 1506871078742528072)。gate restored to HOLD。
- `FUTURE_GATE_REGISTRY.md`: DIS-BOT-00〜04 シリーズ追加。DIS-03 HOLD復帰。命名修正。
- `LEVEL5_BLOCKED_TASKS.md`: DIS-BOT エントリ PASS に更新。次ステップ DIS-BOT-03 poll GO。
- `src/main/discord-intake.ts`: トークンソース `.env.local` / `sendDiscordMessage()` / `getDiscordChannelIds()` 追加。
- `src/main/discord-bot-service.ts`: 新規作成 — polling loop / command routing / sendReport()。
- typecheck:node PASS / typecheck:web PASS。
- **命名修正:** `XACC-01 Discord` という誤った名称を `DIS-BOT-*` に修正。XACC-01 (X Account OAuth) は HOLD 維持。
- DIS01_HOLD=true 維持。productionReady: false。execution: disabled。rawValuesReported: false。

## v4.35.0 - StackChan X Issue Reference Intake / AI Voice + Camera Roadmaps

- `SC_REF_01_STACKCHAN_X_ISSUE_REFERENCE_INTAKE.md`: records the user-provided X issue summary as reference intake only. No X browsing, login, or API use.
- `SC_AI_VOICE_INTEGRATION_ROADMAP.md`: plans SC-AI-00/01 voice route checks and fixed-text one-shot speech. Cron, mic always-on, STT conversation, cloud TTS, Discord Bot speech push, and firmware write remain HOLD.
- `SC_AI_CAMERA_COMMENT_ROADMAP.md`: plans SC-CAM-00/01 one still image to one AI comment. Continuous monitoring, identity recognition, stream recording, and cloud vision routes remain HOLD.
- `SC_STACKCHAN_DO_NOT_OPEN_YET.md`: records the StackChan capabilities that must not open yet.
- Burn, Erase, Firmware Exporter Start, custom firmware write, servo motion, motion/dance, camera monitoring, microphone, external API, productionReady true, and execution enabled remain HOLD.

## v4.34.0 - Autonomous Operation Readiness Panel + Overnight Gate Package

- `AutonomousOperationPanel.tsx`: display-only Agent Theater readiness panel for Level 5 gates and production readiness.
- `autonomous-gate-state.ts`: static gate state model. No runtime, IPC, persistence, or external calls.
- GO forms prepared for XS-AUTO-03, CC-03, HB-01, XACC-01, BLOCKER-005, LMO, productionReady, and execution enabled.
- Evidence templates prepared for each gate and pre-GO review path.
- Dry-run plans prepared for XS-AUTO-03, CC-03, HB-01, and the autonomous operation matrix.
- Estimated completion remains 35-40% risk-weighted. Human-supervised v1 may be possible after review; limited autonomous v2 is not ready.
- productionReady remains false. execution remains disabled. rawValuesReported remains false.
- No runtime, x_search, Discord action, Obsidian write, Hermes/WSL, Command Chat, X OAuth, StackChan operation, external API, or push was performed.

## v4.33.0 - Full Autonomous Operation Task Inventory

- `AUTONOMOUS_OPERATION_MASTER_TASK_INVENTORY.md`: ~70 tasks across 10 categories (A-J). Completion ~30% overall.
- `AUTONOMOUS_OPERATION_PHASE_ROADMAP.md`: Phase 0 COMPLETE. Phase 1–6 defined with exit criteria.
- `AUTONOMOUS_OPERATION_GATE_DEPENDENCY_GRAPH.md`: productionReady / execution / DIS / XS-AUTO / HB-01 / CC-03 dependency trees.
- `AUTONOMOUS_OPERATION_RISK_REGISTER.md`: 15 risks identified. 5 mitigations already implemented.
- `AUTONOMOUS_OPERATION_ACCEPTANCE_CRITERIA.md`: v1 (human-supervised) through v5 (execution enabled) defined.
- `AUTONOMOUS_OPERATION_REMAINING_BLOCKERS.md`: 6 critical blockers. Resolution order: XS-AUTO-03 → CC-03 → HB-01 → XACC-01 → BLOCKER-005 → LMO.
- `AUTONOMOUS_OPERATION_NEXT_10_TASKS.md`: Next 10 tasks in order. Task 1 = push current commits.
- `PRODUCTION_READY_TRUE_GO_REQUIREMENTS.md`: Full checklist + GO form requirements.
- `EXECUTION_ENABLED_GO_REQUIREMENTS.md`: Full checklist + GO form requirements. Requires productionReady true first.
- productionReady: false (unchanged). execution: disabled (unchanged).

## v4.32.0 - SC-FACE-05 PASS + Shikishima Core Level 5 Priority Review

- `SC_FACE_05_DISPLAY_ONLY_TEST_EVIDENCE_2026-05-21.md`: SC-FACE-05 Option A (iPhone AVATAR menu) confirmed PASS by tk. Direction + expression change confirmed. Firmware write not required. Gate restored to HOLD.
- `SHIKISHIMA_CORE_NEXT_GATE_REVIEW_2026-05-21.md`: Shikishima core next gate review. Recommended: productionReady precheck before HB-01/CC-03/XACC.
- `LEVEL5_CORE_GATE_PRIORITY_2026-05-21.md`: Gate priority order — XS-AUTO-03 → CC-03 → HB-01 → XACC-01 → productionReady GO. Completion estimate: ~70%.
- StackChan work deferred. Shikishima core focus from here.

## v4.31.0 - StackChan Face Asset Spec / Restore Plan / Display Test Draft

- `SC_FACE_04_320X240_FACE_ASSET_SPEC.md`: defines 320x240 canvas, 300x220 safe area, expression states, asset options, and original/copyright-safe face direction.
- `SC_RESTORE_01_FACTORY_RESTORE_ROLLBACK_PLAN.md`: records the factory restore / rollback plan required before any future firmware/display test.
- `SC_FACE_05_DISPLAY_ONLY_TEST_GO_DRAFT.md`: prepares a future one-shot display-only test GO form; no approval is granted.
- Burn, Erase, Firmware Exporter Start, custom firmware build/write, StackChan control, MOTION/DANCE, monitoring camera, voice/mic/camera remain HOLD.
- Docs-only. No runtime. No firmware operation. No external API. No push.

## v4.30.0 - DIS-01 ONE_SHOT_PASS + SC-FACE-03 Research + FINAL_100 Updated

- `DIS01_READ_EVIDENCE_2026-05-21.md`: DIS-01 one-shot Discord read PASS. 10 messages from channel 1498670816366428208. DIS01_HOLD restored to true.
- `SC_FACE_03_FEASIBILITY_RESEARCH_2026-05-21.md`: SC-FACE-03 research complete. Source: meganetaaan/stack-chan + m5stack-avatar. Build via PlatformIO. Restore via M5Burner. Verdict: FEASIBLE. Build/flash remains HOLD.
- `FINAL_100_ACCEPTANCE_RECORD.md`: Post-100 completions updated — OB-01, DIS-01, AT-15, SC-PC-02, SC-FACE-03 added.
- Baseline: origin/main = 310ccbe. All safety flags unchanged.

## v4.29.0 - StackChan Face Capability PARTIAL / PC Face Customization Plan

- `SC_FACE_01_OFFICIAL_FACE_CAPABILITY_CHECK.md`: records iPhone app connection as PASS, observed iPhone menus as AVATAR / MONITORING CAMERA / MOTION / DANCE, and official face capability as PARTIAL_HOLD.
- `SC_FACE_02_PC_FACE_CUSTOMIZATION_PLAN.md`: defines PC-side Shikishima face customization plan, 320 x 240 canvas assumption, expression states, and implementation candidates.
- `SC_FACE_03_CUSTOM_FIRMWARE_FEASIBILITY_GATE.md`: defines the future custom firmware feasibility gate and required recovery/build checks.
- iPhone app is treated as simple operation / avatar confirmation only; full Shikishima face replacement moves to PC-side research.
- Additional Burn, Erase, Firmware Exporter Start, custom firmware write, motion/dance, camera, voice/mic, and Shikishima auto-control remain HOLD.
- Docs-only. No runtime. No firmware operation. No external API. No push.

## v4.28.0 - OB-01 / DIS-01 IPC + GO Forms + AT-10 Human Gate Panel

- `src/main/library-export.ts`: OB-01 IPC handler. `OB01_DRY_RUN=true` (dry-run until explicit GO). 30_Evidence/ only with path containment check.
- `src/main/discord-intake.ts`: DIS-01 IPC handler. `DIS01_HOLD=true` (no API call until explicit GO). Channel 1498670816366428208. Token read from env, never logged.
- `DiscordInboxPanel.tsx`: DIS-01 UI panel (HOLD status, Read button returns HOLD).
- `LibraryMarkdownPreview.tsx`: "Export dry-run (OB-01)" button added.
- `RoomChatInline.tsx`: prettier formatting fix (display-only).
- `OB01_LOCAL_WRITE_GO_FORM_2026-05-20.md`: OB-01 GO form template prepared.
- `DIS01_READ_ONLY_GO_FORM_2026-05-20.md`: DIS-01 GO form template prepared.
- `SC_FACE_01_CONFIRMATION_FORM_2026-05-20.md`: iPhone face check form.
- `AT-10 HumanGateStatusPanel.tsx`: Level 5 gate status display panel (display-only).
- typecheck:web PASS / typecheck:node PASS on all source changes.
- No runtime. No external API. No push without explicit GO.

## v4.27.0 - StackChan PC Setup Evidence / Face Capability Check

- `SC_PC_02_FIRMWARE_WRITE_EVIDENCE.md`: records StackChan / CoreS3 M5Burner, COM5, StackChan-UserDemo, baud 1500000, firmware write, reboot, screen visible, iPhone reconnect, and COM5 still visible as PASS candidate evidence.
- `SC_FACE_01_OFFICIAL_FACE_CAPABILITY_CHECK.md`: records official app / Factory Firmware face capability check as HOLD until iPhone face-menu confirmation.
- `FUTURE_GATE_REGISTRY.md`: adds SC-PC-02 and SC-FACE-01 gate records.
- Additional Burn, Erase, Firmware Exporter Start, custom firmware, Shikishima auto-control, physical motion automation, voice/mic/camera remain HOLD.
- Docs-only. No runtime. No additional firmware operation. No external API. No push.

## v4.26.0 - Level 4 Confirmed / Level 5 Transition Package

- `LEVEL_4_FINAL_CONFIRMATION_RECORD.md`: Level 1–4 all PASS. Evidence chain documented. Level 5 HOLD.
- `LEVEL_5_TRANSITION_READINESS_PACKAGE.md`: All Level 5 action catalog (14 items), pre-conditions, key principles.
- `LEVEL_5_GATE_OPENING_ORDER.md`: Recommended order #1–#13, risk classification (Low→Critical), usage guide.
- `A_LIMITED_OPERATION_TO_LEVEL5_RUNBOOK.md`: 10-step A限定運用 daily flow. One gate per session. Rules. Checklist.
- `LEVEL_5_STOP_CONDITIONS_MASTER.md`: Universal + gate-specific STOP conditions. Post-STOP procedure.
- `LEVEL_5_HUMAN_GO_TEMPLATE.md`: 12 ready-to-fill GO templates (OB-01/DIS-01/DIS-03/XS-AUTO/HB-01/CC-03/StackChan×2/XACC×2/productionReady/execution).
- `LEVEL_4_TO_LEVEL_5_SELF_AUDIT.md`: docs-only diff confirmed. All safety flags false.
- StackChan setup: delegated to Codex. Shikishima core only.
- docs-only. No runtime. No push.

## v4.25.0 - OBS-LIB-00 Obsidian Local Library Export (Library Tab)

- New sidebar tab: 記録庫 / Library (BookOpen icon, i18n ja/en/zh-CN added).
- `LibraryExportPage.tsx`: full-page layout — safety strip, vault settings, 2-col (queue + preview).
- `LibrarySettingsPanel.tsx`: redacted vault path, dry-run: ON, local write: HOLD, category folders.
- `LibraryExportQueuePanel.tsx` + `LibraryItemCard.tsx`: 5 example items (research/evidence×2/dev/handoff).
- `LibraryMarkdownPreview.tsx`: generated frontmatter + body (dry-run). File name preview.
- `LibraryReportPreview.tsx`: article-style HTML/React — category badge, title, summary card, safety footer. PNG: OBS-LIB-03.
- `libraryExportTemplates.ts`: generateMarkdown() + generateFilename().
- `libraryReportTemplate.ts`: generateReportData() for report preview.
- `library-export-types.ts`: all types. localWriteEnabled: false and dryRunOnly: true are literal types.
- `Layout.tsx`: library view + BookOpen icon + i18n key.
- `OBS_LIB_00–04`, `OBS_LIB_STOP_CONDITIONS`, `OBS_LIB_IMPLEMENTATION_EVIDENCE`: 7 design docs.
- typecheck:web PASS. No package changes. No local write. No cloud sync. No push.

## v4.24.0 - LIB-00 External Library Design Package

- `LIB_00_EXTERNAL_LIBRARY_DESIGN.md`: Obsidian/Markdown as 正本、GitHub docs as 証跡、app as 管制室。5フェーズ展開。Agent 役割分担。
- `LIB_01_MARKDOWN_VAULT_STRUCTURE.md`: shikishima-library/ 10フォルダ構成。Naming規則。Phase 1-3 vault creation policy。
- `LIB_02_NOTE_TEMPLATES.md`: 5テンプレート (Research / Development / Evidence / Decision / Handoff)。各 frontmatter + rawValues policy。
- `LIB_03_OBSIDIAN_LOCAL_WRITE_GATE.md`: OB-01 gate plan。前提フェーズ。rawValues pre-write checklist。STOP conditions。
- `LIB_04_INDEX_AND_RAG_PLAN.md`: Phase 4 vault index display design + Phase 5 RAG search concept。all HOLD。
- `LIB_SELF_AUDIT.md`: docs-only confirmed。obsidian_connected/local_write_performed false。
- `FUTURE_GATE_REGISTRY.md`: LIB-00 to LIB-05 gate series added。
- `LEVEL5_BLOCKED_TASKS.md`: LIB-03 / LIB-05 blocked task entries added。
- docs-only diff。No runtime。No Obsidian connection。No push。

## v4.23.0 - XS-AUTO-00 Read-only Patrol Display

- `XSearchAutomationPanel.tsx`: status summary row (XS-01 PASS/closed, next HOLD, scheduler/OAuth/write-actions), 5 watchlist cards, gate sequence, evidence notice. No search/connect/OAuth/post buttons.
- `XSearchWatchlistCard.tsx`: watchlist item card with status, risk, run count, required GO form.
- `XSearchPatrolQueuePanel.tsx`: XS-AUTO-00 to XS-AUTO-05 gate sequence display.
- `x-search-automation-types.ts`: XSearchWatchlistStatus / XSearchScheduleMode / XSearchGatePhase / XSearchWatchlistItem / XSearchPatrolSummary.
- `AgentTheaterPage.tsx`: XSearchAutomationPanel added below WorkerEnvironmentPanel.
- `XS_AUTO_00_READ_ONLY_AUTOMATION_GATE_DESIGN.md`: gate sequence, core rule, all phases HOLD.
- `XS_AUTO_01_WATCHLIST_AND_QUERY_POLICY.md`: 5 watch items, schema, forbidden query types.
- `XS_AUTO_02_PATROL_SCHEDULER_HOLD_PLAN.md`: scheduler HOLD, allowed future modes, required GO fields.
- `XS_AUTO_03_EVIDENCE_AND_RATE_LIMIT_POLICY.md`: per-run evidence schema, 429 STOP policy, gate auto-close.
- `XS_AUTO_04_STOP_CONDITIONS.md`: universal + phase-specific STOP conditions.
- `XS_AUTO_SELF_AUDIT.md`: typecheck PASS, all safety flags false.
- typecheck:web PASS. No package changes. No x_search. No OAuth. No push.

## v4.22.0 - Controlled Worker Environment Display (WK-00)

- `WorkerEnvironmentPanel.tsx`: 4 worker environments (ClaudeCode/Codex/Human Gate/Future Adapter), execution mode chips, human-bridge notice. Display-only.
- `WorkerTaskQueuePanel.tsx`: 5 example tasks with provider/level/status/mode. Display-only.
- `WorkerPromptPreview.tsx`: copy-only prompt block. No send. Human bridge.
- `WorkerEnvironmentCard.tsx`: individual environment card with status/mode/notes.
- `worker-environment-types.ts`: WorkerProvider / WorkerEnvironmentStatus / WorkerExecutionMode / ControlledWorkerTask / ControlledWorkerEnvironment types.
- `AgentTheaterPage.tsx`: WorkerEnvironmentPanel added below PixelRoomStage.
- `WK_00_CONTROLLED_WORKER_ENVIRONMENT_DESIGN.md`: copy-only/human-bridge model, Level 4 max AI, Level 5 human gate.
- `WK_01_CODEX_WORKER_BOUNDARY.md`: Codex human-mediated only, remote control HOLD.
- `WK_02_CLAUDECODE_WORKER_BOUNDARY.md`: ClaudeCode human-mediated only, MCP/hooks/daemon HOLD.
- `WK_03_WORKER_TASK_QUEUE_PLAN.md`: task states, transitions, no auto-retry, no auto-escalation.
- `WK_04_WORKER_PROMPT_EXPORT_PLAN.md`: copy-only prompt contents, safety statement, human bridge.
- `WK_WORKER_AUTOMATION_HOLD_POLICY.md`: full HOLD list — auto-launch/remote control/MCP/hooks/daemon/API tokens.
- `WK_CONTROLLED_WORKER_ENVIRONMENT_EVIDENCE.md`: typecheck PASS, display-only verified, all safety flags false.
- typecheck:web PASS. No package changes. No runtime. No push.

## v4.21.0 - X Account Integration Gate Design Package (XACC-00)

- `XACC_00_X_ACCOUNT_INTEGRATION_GATE_DESIGN.md`: XACC-00 to XACC-05 gate sequence, OAuth 2.0 PKCE policy, dedicated sub-account recommendation, core rule (passwordは渡さない).
- `XACC_01_READ_ONLY_AUTH_SCOPE_PLAN.md`: minimum read-only scopes (tweet.read / users.read), PKCE flow design, token storage design, GO form.
- `XACC_02_READ_ONLY_EXECUTION_PLAN.md`: one controlled read-only run, rate limit policy, evidence format.
- `XACC_03_DRAFT_ONLY_POST_PLAN.md`: Level 1-4 draft generation, no X write, content policy.
- `XACC_04_HUMAN_GO_WRITE_PLAN.md`: Level 5 one-shot write, verbatim content policy, pre-send checklist.
- `X_ACCOUNT_TOKEN_AND_SCOPE_POLICY.md`: password NEVER policy, token storage, scope table, rate limit, rotation policy, developer guidelines compliance.
- `X_ACCOUNT_STOP_CONDITIONS.md`: universal + phase-specific STOP conditions, post-STOP procedure.
- `X_ACCOUNT_SELF_AUDIT.md`: docs-only diff confirmed.
- `FUTURE_GATE_REGISTRY.md`: XACC-00 to XACC-05 gate series added.
- `LEVEL5_BLOCKED_TASKS.md`: XACC-04 and XACC-OAUTH blocked task entries added.
- No token created. No OAuth. No X connection. No runtime. push pending GO.

## v4.20.0 - Discord Bridge Gate Design Package (DIS-00)

- `DIS_00_DISCORD_BRIDGE_GATE_DESIGN.md`: DIS-00 through DIS-04 gate sequence, one-channel policy, core rule (AIは作るところまで／鍵と発射ボタンは人間).
- `DIS_01_DISCORD_READ_ONLY_INTAKE_PLAN.md`: read-only intake, required GO fields, MESSAGE_CONTENT privileged intent policy.
- `DIS_02_DISCORD_DRAFT_RESPONSE_PLAN.md`: local draft response, Level 1-4 candidate, no Discord write.
- `DIS_03_DISCORD_HUMAN_GO_REPLY_PLAN.md`: Level 5 one-shot reply plan, verbatim content policy, pre-send checklist.
- `DIS_04_DISCORD_LIMITED_AUTO_REPLY_DEFERRED.md`: DEFERRED — future template-only auto-reply concept, preconditions listed.
- `DISCORD_TOKEN_AND_PERMISSION_POLICY.md`: token never-commit policy, minimum permission table, channel restriction, MESSAGE_CONTENT intent requirements.
- `DISCORD_BRIDGE_STOP_CONDITIONS.md`: universal + phase-specific STOP conditions, post-STOP procedure.
- `DISCORD_BRIDGE_SELF_AUDIT.md`: docs-only diff confirmed, all safety checklist items false.
- `FUTURE_GATE_REGISTRY.md`: DIS-00 to DIS-04 gate series added.
- `LEVEL5_BLOCKED_TASKS.md`: DIS-03/DIS-BOT/DIS-CON/DIS-04 blocked task entries added.
- No bot created. No token. No Discord connection. No runtime. No push (pending push GO).

## v4.19.0 - Post-100 Gate Completions: AT-14 PASS / XS-01 Read-Only PASS

- `AT_14_ROOM_VISUAL_EVIDENCE.md`: AT-14 runtime visual confirmation PASS (tk 2026-05-20).
- `XS_01_READ_ONLY_EXECUTION_EVIDENCE_2026-05-20.md`: XS-01 read-only execution PASS. Query: Google I/O 2026 agent status Android Halo Antigravity Gemini Spark. Android Halo design signal confirms Shikishima SafetyStrip alignment. 1/1 run consumed, gate closed.
- `XS_01_GATE_READINESS.md`, `HB_01_GATE_READINESS.md`, `CC_03_GATE_READINESS.md`: gate readiness docs for all three post-100 candidates — all HOLD, prerequisites documented.
- `FINAL_100_ACCEPTANCE_RECORD.md`: updated to reflect AT-14 PASS, XS-01 PASS, Post-100 Gate Completions section added, T7 added.
- `DEVELOPMENT_TEMPO_DASHBOARD.md`: updated HEAD baseline, XS-01 status, next action.
- baseline commit: 2af99cf. HB-01 and CC-03 remain HOLD.
- No runtime start, no autonomous polling, no OAuth, no external write, no productionReady true, no execution enabled.

## v4.18.0 - Post-100 Candidate Gate Process

- `POST_100_CANDIDATE_GATE_PROCESS_DESIGN.md`: defines post-100 candidate process for Pixel Room polish, AT-14 runtime visual confirmation, CC-03 Command Chat real-send gate, HB-01 Hermes/WSL gate, and XS-01 x_search read-only gate.
- Records recommended order: AT-14 first, then Pixel Room polish, XS-01, HB-01, and CC-03.
- Confirms each gate needs explicit human GO and separate evidence.
- No runtime start, no x_search, no Hermes/WSL, no Command Chat send, no external write, no productionReady true, no execution enabled.

## v4.17.0 - Final Verification Process / PXR Post-100 Defer

- `SHIKISHIMA_FINAL_VERIFICATION_PROCESS_TO_100.md`: defines the remaining process to real-operation readiness 100%.
- `PXR_POST_100_DEFER_RECORD.md`: records Pixel Room / character-design polish as post-100 deferred work.
- Final critical path is now evidence and acceptance: AT-14 visual evidence, Control Center live snapshot evidence, UI/UX evidence, Phase 9 gate docs, final acceptance.
- Level 5 gates remain HOLD and are not required to claim pre-operation readiness 100%.
- No runtime start, no external action, no productionReady true, no execution enabled.

## v4.16.0 - PXR-05A 3D タブ設計書

- `PXR_05A_3D_TAB_DESIGN.md`: Three.js/R3F 方針確定 (Approach A / OrthographicCamera)。
- 依存追加計画: `three ^0.177` / `@react-three/fiber ^9` / `@react-three/drei ^10` / `@types/three ^0.177`。
- コンポーネント構成: `PixelRoom3D/` 8 ファイル設計。
- 3D シーン座標・ライティング・マテリアル設計。
- タブ統合設計: TheaterView に `"3d"` 追加。
- フェーズ計画: PXR-05A(設計) → 05B(package GO) → 05C(ジオメトリ) → 05D(HUD/状態) → 06(自由視点)。
- docs-only。runtime 未起動。package 変更なし。push 未実施。

## v4.15.0 - 3D Pixel Room Vision Design Package (PXR-00)

- `PXR_00_3D_PIXEL_ROOM_VISION.md`: しきしま 3D Pixel Room ビジョン。コンセプト・各エージェント座席・安全ガード融合・実装フェーズ。
- `PXR_01_ISOMETRIC_ROOM_IMPLEMENTATION_PLAN.md`: PXR-01 CSS isometric 実装計画。Option A/B 比較・部屋レイアウト設計・ファイル構成。
- `PXR_AGENT_MOTION_STATE_DESIGN.md`: エージェントモーション & ステート設計。全7状態・Pose・CSS アニメーション定義。
- `PXR_SAFETY_GATE_VISUAL_MAPPING.md`: 安全ゲート → ビジュアル要素マッピング。レイヤー構造・HUD 設計。
- `PXR_ASSET_AND_LICENSE_POLICY.md`: アセット & ライセンスポリシー。PXR-04 Gate 条件・代替手段・ライセンスチェックリスト。
- docs-only。runtime 未起動。push 未実施。
- canonical names 確定: むすび (旧: はじめ) / つむぐ (旧: つむぎ)。

## v4.14.0 - Final Goal Lock Package

- `SHIKISHIMA_FINAL_GOAL_LOCK.md`: Goal A/B/C 定義。「設計書のための設計書」の終止符。
- `SHIKISHIMA_FINAL_IMPLEMENTATION_COMPLETION_MAP.md`: 実装済み/evidence残/BLOCKED/FUTURE 全マップ。
- `SHIKISHIMA_FINAL_REMAINING_TASK_CHECKLIST.md`: Goal別残Task一覧表。
- `SHIKISHIMA_FINAL_GO_HOLD_DECISION_SHEET.md`: Decision 1–4 人間判断シート。
- `SHIKISHIMA_FINAL_LEVEL5_GATE_RUNBOOK.md`: Level 5 全操作 + 共通 GO 文フィールド。
- `SHIKISHIMA_FINAL_100_ACCEPTANCE_TEMPLATE.md`: 最終受け入れ記録テンプレート。
- docs-only。runtime 未起動。push 未実施。

## v4.13.0 - 実運用100% Master Design Package

- `SHIKISHIMA_REAL_OPERATION_100_MASTER_DESIGN.md`: Master design, Goal A/B/C, 安全不変条件。
- `SHIKISHIMA_REAL_OPERATION_100_PHASE_ROADMAP.md`: Phase 0–10 詳細 roadmap。
- `SHIKISHIMA_REAL_OPERATION_100_TASK_REGISTRY.md`: 全Task表 (DONE/HOLD/BLOCKED/FUTURE)。
- `SHIKISHIMA_REAL_OPERATION_100_GO_HOLD_MATRIX.md`: Phase別 GO/HOLD 判断基準。
- `SHIKISHIMA_REAL_OPERATION_100_DEFINITION_OF_DONE.md`: 100% の DoD + 受け入れ区分。
- `SHIKISHIMA_REAL_OPERATION_100_HUMAN_REVIEW_CHECKLIST.md`: 人間レビュー用チェックシート。
- `SHIKISHIMA_REAL_OPERATION_100_LEVEL5_APPROVAL_FORMS.md`: Level 5 承認フォーム全種。
- `SHIKISHIMA_REAL_OPERATION_100_RUNTIME_VISUAL_RECHECK_PLAN.md`: runtime 観察計画。
- `SHIKISHIMA_REAL_OPERATION_100_COMMAND_CHAT_PLAN.md`: CC-03 実送信計画。
- `SHIKISHIMA_REAL_OPERATION_100_HERMES_BRIDGE_PLAN.md`: HB-01 WSL2 接続計画。
- `SHIKISHIMA_REAL_OPERATION_100_X_SEARCH_READ_ONLY_PLAN.md`: XS-01 read-only 計画。
- `SHIKISHIMA_REAL_OPERATION_100_STACKCHAN_VOICE_MIC_CAMERA_PLAN.md`: Phase 9 物理/音声計画。
- `SHIKISHIMA_REAL_OPERATION_100_FINAL_ACCEPTANCE_PLAN.md`: 最終受け入れフロー。
- docs-only。runtime 未起動。push 未実施。

## v4.12.0 - 100% Roadmap Design Package

- `SHIKISHIMA_100_PERCENT_ROADMAP_DESIGN.md`: Phase 1–10 フェーズ設計書
- `SHIKISHIMA_REMAINING_TASK_REGISTRY_TO_100.md`: DONE/HOLD/BLOCKED/FUTURE 全Task表
- `SHIKISHIMA_LEVEL5_GATE_PLAN_TO_100.md`: Level 5 全操作一覧 + 承認フォーム
- `SHIKISHIMA_100_PERCENT_DEFINITION_OF_DONE.md`: 100% の定義と最終チェックリスト
- `SHIKISHIMA_NEXT_SESSION_HANDOFF_TO_100.md`: 次セッション引き継ぎ + Option A-E
- `SHIKISHIMA_100_PERCENT_ROADMAP_SELF_AUDIT.md`: ClaudeCode 自己監査記録
- docs-only。ソース変更なし。runtime 未起動。push 未実施。

## v4.11.0 - Nav Reorder

- `Layout.tsx`: Control Center / Mobile Console をサイドバー先頭に移動。
- 変更 1 ファイル。typecheck PASS。

## v4.10.0 - Ctrl+Wheel Zoom

- `main.tsx`: 全ページ Ctrl+wheel zoom 追加 (0.5x〜2.5x、Ctrl+0 リセット)。
- localStorage でズームレベル永続化 (key: cc-zoom)。
- 変更 1 ファイル。typecheck PASS。

## v4.09.0 - AT-15 UI Scale-Up

- 全 AgentTheater コンポーネント (22ファイル) フォントサイズ約 1.3x スケールアップ。
- fontSize 7→10 / 8→11 / 9→12 / 10→13 / 11→14。
- card padding +4px / panel padding 12→16px / grid minmax +30〜50px。
- HandoffLane step circles 20→26px / GhostSvg 42→52px。
- AT-14 runtime visual recheck PASS evidence を記録。
- typecheck PASS。

## v4.08.0 - AT-14 Runtime Visual Recheck Package

- Created `AT_14_RUNTIME_VISUAL_RECHECK_PACKAGE.md`: expanded full scope, per-AT checklist, STOP conditions, shutdown method, safety boundary.
- Created `AT_14_RUNTIME_VISUAL_RECHECK_GO_TEMPLATE.md`: human GO form with pre-flight checklist and invocation instructions.
- Created `AT_14_RUNTIME_VISUAL_RECHECK_EVIDENCE_TEMPLATE.md`: post-session evidence template covering AT-07 through AT-13 + safety invariants.
- Created `AT_14_RUNTIME_VISUAL_RECHECK_SCOPE.md`: per-section observation points, element-level expected values, time budget.
- Created `AT_14_RUNTIME_VISUAL_RECHECK_SELF_AUDIT.md`: ClaudeCode self-audit confirming docs-only diff; runtime remains HOLD.
- Docs-only commit. No source changes. No runtime started. No push performed.
- productionReady: false / execution: disabled / rawValuesReported: false.
- Runtime remains HOLD; human time_window GO required to proceed.

## v4.07.0 - AT-13 Final Visual Polish / Responsive Pass

- Modified `AgentTheaterPage.tsx`: Phase AT-13; SECTION_BLOCK style; overflowX: hidden; gap 18; DEFAULT_SLOTS workerLabels corrected.
- Modified `ControlRoomLayout.tsx`: minWidth: 0 + overflow: hidden; flexWrap on header.
- Modified `GateDashboardPanel.tsx`: minWidth: 0; padding cleanup.
- Modified `GateStatusCard.tsx`: overflowWrap: "anywhere" on text; overflow: hidden on card.
- Modified `ResumeQueuePanel.tsx`: grid auto-fit min(100%, 200px); 外部write badge color #f85149 (unified red).
- Modified `RunawayGuardPanel.tsx`: minWidth: 0 + overflow: hidden; flexWrap on header; grid auto-fit min(100%, 200px).
- Modified `SlotStatusBar.tsx`: workerLabel flexShrink; explicit return type (pre-existing ESLint fix).
- Modified `WorkerRouteCard.tsx`: overflowWrap: "anywhere"; overflow: hidden.
- Modified `WorkerRoutingPanel.tsx`: grids auto-fit min(100%, 180px/200px).
- Modified `WorkerStatusPanel.tsx`: grid auto-fit min(100%, 150px).
- Added `AT_13_FINAL_VISUAL_POLISH_EVIDENCE.md`.
- typecheck PASS / ESLint 0 errors. Runtime recheck HOLD.
- productionReady: false / execution: disabled / rawValuesReported: false.

## v4.06.0 - AT-12 Gate Dashboard / Future Gate Panel

- Added `GateStatusBadge.tsx`: compact display-only badge for GateStatus.
- Added `GateStatusCard.tsx`: display-only card per future/human-gated capability.
- Added `GateDashboardPanel.tsx`: 12 gate items + safety summary badges + plain-language boundary copy.
- Added `GateStatus`, `GateDashboardCategory`, and `GateDashboardItem` types to agent-theater-types.ts.
- Modified `AgentTheaterPage.tsx`: GATES section added below ROUTING.
- Added `AT_12_GATE_DASHBOARD_PANEL_EVIDENCE.md`.
- Displays PUSH-GO, RUNTIME-GO, OAUTH-GO, XS-READ, OBS-LOCAL, EXTERNAL-WRITE, PRODUCTION-READY, EXECUTION-ENABLE, STACKCHAN-PHYSICAL, VOICE-CAMERA-MIC, SPRITE-ASSET, and RUNTIME-VISUAL-RECHECK.
- No gate toggles, no buttons, no runtime, no OAuth, no x_search, no Obsidian write, no external API.
- productionReady: false / execution: disabled / rawValuesReported: false.

## v4.05.0 - AT-11 Worker Routing / Handoff Prompt Panel

- Added `RouteWorkerBadge.tsx`: worker name badge with accent color.
- Added `HandoffPromptPreview.tsx`: display-only prompt preview block (no auto-send, no copy).
- Added `WorkerRouteCard.tsx`: card per worker with allowed/forbidden badges.
- Added `WorkerRoutingPanel.tsx`: 5 worker routes + 3 prompt previews + safety strip + taglines.
- Added `WorkerRouteKind` type + `WorkerRoute` interface to agent-theater-types.ts.
- Modified `AgentTheaterPage.tsx`: ROUTING section added.
- No auto-dispatch, no API calls. Static display data.
- typecheck PASS / vitest 806/807; runtime recheck HOLD.
- productionReady: false / execution: disabled.

## v4.04.0 - AT-10 Runaway Guard / Human-Gated Action Panel

- Added `GuardrailBadge.tsx`: compact badge for GuardedActionStatus (7 variants).
- Added `HumanGateActionCard.tsx`: display-only card per guarded action.
- Added `RunawayGuardPanel.tsx`: 9 guarded actions + Level 4/5 boundary + plain language taglines.
- Added `GuardedActionStatus` type to agent-theater-types.ts.
- Modified `AgentTheaterPage.tsx`: RUNAWAY GUARD section added.
- No push/runtime/OAuth/execute buttons. Display-only.
- typecheck PASS / vitest 806/807; runtime recheck HOLD.
- productionReady: false / execution: disabled.

## v4.03.0 - Remaining Agent Theater Implementation Design Package

- Added `AT_REMAINING_IMPLEMENTATION_DESIGN_PACKAGE.md`.
- Added `AT_10_RUNAWAY_GUARD_PANEL_DESIGN.md`.
- Added `AT_11_WORKER_ROUTING_HANDOFF_PROMPT_PANEL_DESIGN.md`.
- Added `AT_12_GATE_DASHBOARD_DESIGN.md`.
- Added `AT_13_FINAL_VISUAL_POLISH_PLAN.md`.
- Added `AT_05_SPRITE_ASSET_PLAN.md`.
- Added `AT_14_RUNTIME_VISUAL_RECHECK_PACKAGE.md`.
- Added `AT_REMAINING_IMPLEMENTATION_PUSH_READINESS.md`.
- Recorded priority order: AT-10 -> AT-11 -> AT-12 -> AT-13 -> AT-14 -> AT-05.
- Confirmed ClaudeCode as likely UI implementation worker and Codex as push-readiness/review worker.
- Confirmed Level 5 actions remain human-gated: push, runtime, OAuth, x_search, Obsidian write, external write, productionReady, execution.
- Docs-only. No source changes, no runtime, no npm run dev, no OAuth, no x_search, no Obsidian write, no external API, no git push.
- productionReady: false / execution: disabled / rawValuesReported: false.

## v4.02.0 - AT-09 Resume Queue and Cooldown Panel

- Added `CooldownBadge.tsx`: compact status badge for ResumeTaskStatus.
- Added `ResumeTaskCard.tsx`: display-only card per paused/active/gated task.
- Added `ResumeQueuePanel.tsx`: 4 sample task cards + safety badge strip + 5 plain language taglines.
- Added `ResumeTaskStatus` type + `ResumeTask` interface to agent-theater-types.ts.
- Modified `AgentTheaterPage.tsx`: new RESUME QUEUE section added below WORKERS.
- No execute/push/send/OAuth buttons. Static sample data only.
- typecheck PASS / vitest 806/807; runtime recheck HOLD.
- productionReady: false / execution: disabled / rawValuesReported: false.

## v4.01.0 - AT-08 Slot Worker Status Panel

- Added `WorkerStatusCard.tsx`: display-only card per worker (GPT / ClaudeCode / Codex / Cursor / Human Gate).
- Added `AutonomyLevelLegend.tsx`: Level 1-5 boundary with Level 4 AI OK / Level 5 human GO badges.
- Added `WorkerStatusPanel.tsx`: panel container with 5 worker cards + autonomy legend.
- Modified `AgentTheaterPage.tsx`: new WORKERS section added below SLOTS.
- Added `SlotWorkerStatus` type: READY / BUSY / COOLDOWN / DEGRADED / BLOCKED / FAILED / NEEDS_HUMAN.
- No execute buttons, no push buttons, no external API calls.
- typecheck PASS / vitest 806/807; runtime recheck HOLD.
- productionReady: false / execution: disabled / rawValuesReported: false.

## v4.00.0 - SLOT-09 Worker Status and Human-Gated Autonomy Boundary

- Added `SLOT_09_WORKER_STATUS_AND_AUTONOMY_BOUNDARY.md`.
- Added `SLOT_09_RUNAWAY_PREVENTION_RULES.md`.
- Added `HUMAN_GATED_ACTIONS_PLAIN_LANGUAGE_GUIDE.md`.
- Added `OBSIDIAN_LOCAL_NOTE_GATE_PLAN.md`.
- Added `SOCIAL_AWARENESS_READ_ONLY_GATE_PLAN.md`.
- Recorded `SLOT_WORKER_STATUS`: READY / BUSY / COOLDOWN / DEGRADED / BLOCKED / FAILED / NEEDS_HUMAN.
- Confirmed autonomy target: Level 1-4 can be designed as autonomous worker flow; Level 5 is always human-gated.
- Reserved gates: SLOT-09, AUTO-LEVEL-04, AUTO-LEVEL-05, OAUTH-GO, XS-READ, RUNTIME-GO, OBS-LOCAL, RUNAWAY-GUARD.
- OAuth, runtime, x_search/social read, Obsidian local note write, git push, provider/external connection remain HOLD by default and need explicit human GO.
- Docs-only. No source changes, no runtime, no OAuth, no x_search, no Obsidian write, no external API, no git push.
- productionReady: false / execution: disabled / rawValuesReported: false.

## v3.99.0 - AT-07 Control Room Environment Layout

- roadmapVersion: v3.99.0
- lastUpdated: 2026-05-19
- commits: local (push pending)
- ControlRoomZone.tsx: 5 agent zone cards with CSS ambient decorations
- HandoffLane.tsx: 6-step flow (依頼→計画→安全確認→作業準備→記録→GO待ち)
- ControlRoomLayout.tsx: dark navy room with safety badge strip + dot grid
- AgentTheaterPage.tsx: uses ControlRoomLayout
- typecheck PASS / vitest 806/807; runtime recheck HOLD

## v3.98.0 - AT-04 Visual Recheck GO Package

- roadmapVersion: v3.98.0
- lastUpdated: 2026-05-19
- commit: local (push pending)
- AT-04 visual recheck GO package + checklist + evidence template created
- runtime GO not yet issued; awaiting human date/time_window
- next: AT-04 runtime visual recheck → AT-06 Slot Worker Status polish

## v3.97.0 - AT-01 Agent Theater Page Route Design

- roadmapVersion: v3.97.0
- lastUpdated: 2026-05-18
- commit: local (push pending)
- page_id: "theater" / tab: 管制室 / position: index 0
- 6 files defined: ui-page-types.ts, Layout.tsx, AgentTheaterPage/AgentCard/SlotStatusBar.tsx, agent-theater-types.ts
- types: AgentId, PoseState, SlotStatus, AgentPoseMap
- pose derivation from decision (no new IPC)
- AT-02 auto-proceed approved in design

## v3.96.0 - Agent Theater and Slot Worker Routing Design

- roadmapVersion: v3.96.0
- lastUpdated: 2026-05-18
- commits: docs-only (local, push pending)
- AGENT_THEATER_IMPLEMENTATION_DESIGN.md: main design + layout sketch
- PIXEL_GHOST_AGENT_CHARACTER_SPEC.md: 5 agents with poses, flags, expressions
- AGENT_THEATER_POSE_AND_ACTION_MATRIX.md: 8-pose matrix per agent + state mapping
- AGENT_HANDOFF_FLOW_DESIGN.md: 8-step control room flow + HOLD/STOP behavior
- SLOT_WORKER_ROUTING_DESIGN.md: 8 slots with worker/gate definitions
- CODEX_CLAUDECODE_WORKER_BOUNDARY.md: dev worker constraint policy
- AGENT_THEATER_SAFETY_DISPLAY_POLICY.md: what to show/not show/not allow
- AGENT_THEATER_IMPLEMENTATION_PHASES.md: AT-00 through AT-08
- FUTURE_GATE_REGISTRY.md: AT series added
- FINAL_HOLD_AND_FUTURE_GO_REGISTRY.md: AT-02/03, XS-03 items added
- COMMAND_CENTER_DESIGN_GAP_BACKLOG.md: AT items added, execution order updated
- source_changed: false / runtime_started: false / assets_added: false

## v3.95.0 - x_search Social Awareness + Hermes Tool Catalog

- roadmapVersion: v3.95.0
- lastUpdated: 2026-05-18
- commits: docs-only (local, push pending)
- HERMES_SOCIAL_AWARENESS_FEATURE_CATALOG.md: observe/summarize/draft/GO pipeline stages
- X_SEARCH_SHIKISHIMA_INTEGRATION_PLAN.md: read-only → draft outbox integration plan
- X_SEARCH_HOLD_GO_MATRIX.md: XS-00 through XS-09 gate sequence
- HERMES_TOOL_EXPANSION_CATALOG.md: all Hermes tools with HOLD/CANDIDATE/REJECT status
- NARUEBI_STYLE_REFERENCE_BOUNDARY.md: what to adopt vs reject from Naruebi pattern
- GROK_HERMES_TOOL_HOLD_REGISTRY.md: added web_search/browser/LINE/Teams/SimpleX/cron/memory/multi-agent/goal/proxy/computer_use(REJECT)
- FUTURE_GATE_REGISTRY.md: GHG-00-09 and XS-00-09 gates added
- autonomous_posting: REJECT / oauth_performed: false / runtime_started: false

## v3.94.0 - Grok-Hermes Provider Architecture Review

- roadmapVersion: v3.94.0
- lastUpdated: 2026-05-18
- commits: docs-only (local, push pending)
- GROK_HERMES_PROVIDER_ARCHITECTURE_REVIEW.md: official xai-oauth integration recorded
- GROK_HERMES_PROVIDER_GATE.md: GHG-00 through GHG-09 gate sequence defined
- GROK_HERMES_TOKEN_AND_AUTH_BOUNDARY.md: auth.json boundary rules defined
- GROK_HERMES_TOOL_HOLD_REGISTRY.md: x_search/TTS/image/video/transcription/messaging all HOLD
- PROVIDER_ROUTER_UPDATED_DESIGN.md: primary/fallback/escalation routing design
- FINAL_HOLD_AND_FUTURE_GO_REGISTRY.md: GHG items 17-19 added
- EXTERNAL_ACTION_GATE_REGISTRY.md: x_search/TTS/image/video/messaging gates added
- oauth_performed: false / runtime_started: false / source_changed: false

## v3.93.0 - P3-003 StackChan Face Glyphs Implemented

- roadmapVersion: v3.93.0
- lastUpdated: 2026-05-18
- commit: 6b011be (local, push pending)
- FACE_GLYPH map: HOLD/GO_READY/PASS/STOP/REJECT → ASCII art face
- typecheck×2 PASS / vitest 806/807
- push pending human GO; visual recheck pending after user returns

## v3.92.0 - P3-003 StackChan Face Glyphs Scope Prepared

- roadmapVersion: v3.92.0
- lastUpdated: 2026-05-18
- P2-007 confirmed resolved (UI-13); P3-003 selected as next item
- scope docs: P2_007_SCOPE_REVIEW.md + ALLOWED_FILES + TEST_PLAN + GO_DRAFT
- P2-005/P2-006 runtime recheck PASS recorded + pushed (15f1c5c)
- all P2 items complete; P3-001/P3-003 remaining

## v3.91.0 - UI-14 Operator/Chat Mobile Layout Evidence

- roadmapVersion: v3.91.0
- lastUpdated: 2026-05-18
- commit: 5055b6d (pushed)
- P2-001 OperatorPage: 2-col grid (>=900px sidebar) + mobile 1-col
- P2-002 CommandChatPage: 2-panel (>=900px left panel) + mobile vertical stack
- CSS classes: cc-operator-grid/main/side + cc-chat-outer/status-panel/main
- typecheck×2 PASS / mobile-console 37/37 / ui-snapshot-helpers 45/45
- remaining: P2-004 NextActionCard / P2-005 PageRightRail / runtime recheck

## v3.90.0 - UI-14 Operator/Chat Mobile Layout Scope

- roadmapVersion: v3.90.0
- lastUpdated: 2026-05-18
- scope docs created; actual paths recorded (differ from Night Task B spec)
- P2-001 + P2-002 defined; implementation done as 5055b6d

## v3.89.0 - UI-13 Mobile Layout Foundation Evidence

- roadmapVersion: v3.89.0
- lastUpdated: 2026-05-18
- commit: c48675c (pushed)
- 14 files: PageShell/Topbar/command-center-tokens.css + 11 page files
- mobile breakpoint 600px; compact chrome; CSS var padding; safe-area
- typecheck×2 PASS / mobile-console 37/37 / ui-snapshot-helpers 45/45
- remaining P2: Operator 3-col mobile (P2-001), Chat 3-col mobile (P2-002)

## v3.88.0 - UI-12 Part B Runtime Observation PASS

- roadmapVersion: v3.88.0
- lastUpdated: 2026-05-18
- Topbar / SafetyStrip 6chips / Footer all visible; 12 pages PASS
- CAVEAT-MOBILE-01 noted; mobile layout deferred to UI-13
- no STOP conditions; clean shutdown

## v3.87.0 - UI-12 Part B SafetyStrip + PageShell Design Alignment

- roadmapVersion: v3.87.0
- lastUpdated: 2026-05-18
- P1-001 SafetyStrip 6 chips; P1-003 9 states; P1-002 footer; P2-003 Topbar
- typecheck×2 PASS / mobile-console 37 / ui-snapshot-helpers 45

## v3.86.0 - UI-12 Layout Wiring + Task 17A Design Conformance

- roadmapVersion: v3.86.0
- lastUpdated: 2026-05-18
- UI-12: Layout.tsx wired; 12 pages accessible from Control Center nav
- Task 17A: P0×0 / P1×3 / P2×7 / P3×3 gap backlog recorded

## v3.85.0 - UI-11 Runtime Observation PASS_WITH_CAVEAT

- roadmapVersion: v3.85.0
- lastUpdated: 2026-05-18
- runtime observation executed: 2026-05-18 00:37-01:00 JST
- result: PASS_WITH_CAVEAT
- CAVEAT-01: new Command Center pages (UI-05〜UI-10) not wired into Layout.tsx
  - components compile/test correctly (806 tests PASS)
  - not reachable from running app
  - fix required: UI-12 Layout wiring (separate GO)
- no safety violations: productionReady false / execution disabled / no raw values
- evidence: UI_11_RUNTIME_OBSERVATION_EVIDENCE.md + UI_11_RUNTIME_OBSERVATION_CAVEAT_01.md

## v3.84.0 - Task 24 Future Gate Registry and HOLD Boundary

- roadmapVersion: v3.84.0
- lastUpdated: 2026-05-17
- 6 docs created (FUTURE_GATE_REGISTRY / DEVICE_AND_SENSOR / EXTERNAL_ACTION / STACKCHAN_HOLD / VOICE_CAMERA_MIC_HOLD / EXTERNAL_WRITE_HOLD)
- 16 future gates registered; all HOLD
- productionReady: false / execution: disabled — not changing

## v3.83.0 - Task 23 productionReady Precondition Audit

- roadmapVersion: v3.83.0
- lastUpdated: 2026-05-17
- 5 docs: audit (11 categories) + not-approved notice + GO draft + risk register (8) + rollback plan
- 3 active blockers: RUNTIME-01 / TEST-01 / Gate-005
- productionReady: false — not approved

## v3.82.0 - Task 22 Final 95→100 Limited Manual Operation Package

- roadmapVersion: v3.82.0
- lastUpdated: 2026-05-17
- 5 docs: LMO package + rules + daily checklist + STOP playbook + human approval matrix
- autonomous execution not approved; external write not approved

## v3.81.0 - Task 21 Final 90→95 Readiness Package

- roadmapVersion: v3.81.0
- lastUpdated: 2026-05-17
- 4 docs: readiness package + acceptance criteria (15 ACs) + remaining risks (7) + not-production-ready notice
- runtime observation still pending; Gate 005 HOLD acceptable for 90→95

## v3.80.0 - UI-11 Controlled Runtime Observation Readiness Package

- roadmapVersion: v3.80.0
- lastUpdated: 2026-05-17
- 5 docs created:
  - UI_11_CONTROLLED_RUNTIME_OBSERVATION_READINESS.md
  - UI_11_RUNTIME_OBSERVATION_GO_DRAFT.md
  - UI_11_RUNTIME_OBSERVATION_CHECKLIST.md
  - UI_11_RUNTIME_OBSERVATION_EVIDENCE_TEMPLATE.md
  - UI_11_STOP_CONDITIONS.md
- preconditions defined; runtime GO not yet issued
- productionReady: false / execution: disabled / rawValuesReported: false

## v3.79.0 - UI-10 Visual QA PASS

- roadmapVersion: v3.79.0
- lastUpdated: 2026-05-17
- command-center-tokens.css created: light/dark CSS variable definitions
- main.tsx updated: CSS token import added
- MessageBubble.tsx: #ffffff → var(--paper, #ffffff) dark mode fix
- typecheck:node PASS / typecheck:web PASS / vitest 806 PASS
- commit: 35befd7 (pushed)

## v3.78.0 - UI-09 State/Toast/CommandPalette Components PASS

- roadmapVersion: v3.78.0
- lastUpdated: 2026-05-17
- 6 new components:
  - EmptyState / LoadingState / ErrorState / StaleWarning
  - ToastContainer (4 variants, auto-dismiss)
  - CommandPalette (Ctrl+K, keyboard-driven, navigation-only)
- typecheck:node PASS / typecheck:web PASS / vitest 806 PASS
- commit: 8989acf (pushed)

## v3.77.0 - UI-08 Settings/Help/Onboarding Pages PASS

- roadmapVersion: v3.77.0
- lastUpdated: 2026-05-17
- 3 new pages:
  - CommandSettingsPage (6 interactive settings + 5 locked capabilities)
  - CommandHelpPage (safety policy reference)
  - OnboardingFlow (5-step wizard, navigation only)
- tests/ipc-handlers.test.ts: also scan preload/mobile-console.ts
- typecheck:node PASS / typecheck:web PASS / vitest 806 PASS
- commit: 821ca6e (pushed)

## v3.76.0 - UI-07 StackChan Control Room PASS

- roadmapVersion: v3.76.0
- lastUpdated: 2026-05-17
- 2 new pages: StackChanPage + StackChanMobilePage (393px mobile)
- physicalOperation/voiceActive/cameraActive/micActive: all false (literal)
- typecheck:node PASS / typecheck:web PASS / vitest PASS
- commit: e3fb17a (pushed)

## v3.75.0 - UI-06 Operational Suite Pages PASS

- roadmapVersion: v3.75.0
- lastUpdated: 2026-05-17
- 6 new pages: Outbox / Queue / GoPage / Evidence / Stop / Push
- externalWrite: false / displayOnly: true / pushIsExternalOnly: confirmed
- typecheck:node PASS / typecheck:web PASS / vitest PASS
- commit: a08e31d (pushed)

## v3.74.0 - UI-05 Operator and Chat Pages PASS

- roadmapVersion: v3.74.0
- lastUpdated: 2026-05-17
- 4 new files: LampGrid / OperatorPage / CommandChatPage / MessageBubble
- OperatorPage: 9-lamp grid, safety invariant section
- CommandChatPage: local chat only, no external connection
- typecheck:node PASS / typecheck:web PASS / vitest PASS
- commit: fb7db4c (pushed)

## v3.73.0 - UI-04 Shell Components PASS

- roadmapVersion: v3.73.0
- lastUpdated: 2026-05-17
- 5 new components in src/renderer/src/components/Shell/:
  - MiniLampRow.tsx (color + label lamps; all 14 LampState values)
  - SafetyStrip.tsx (always-visible; STALE badge; role=status; productionReady:false literal)
  - PageTabs.tsx (12-tab nav; navigation-only; keyboard focus; aria-selected)
  - ChatInputBar.tsx (local chat only; safety note always visible; tap targets >= 44px)
  - PageShell.tsx (SafetyStrip + PageTabs + body slot)
- no IPC; no rendered pages wired; no runtime
- typecheck:node PASS / typecheck:web PASS / mobile-console 37/37 PASS
- docs-only evidence + push pending

## v3.72.0 - UI-03 Snapshot Helpers PASS — Evidence Recorded

- roadmapVersion: v3.72.0
- lastUpdated: 2026-05-17
- UI_03_IMPLEMENTATION_EVIDENCE.md created
  - dc80ebe feat: add ui 03 snapshot helpers and freshness utilities
  - ui-freshness-helpers: isStale / getHoldFallback / resolveDecision
  - ui-snapshot-helpers: SafeSnapshotSummary / checkRedaction / snapshotToSafeSummary / holdSummary
  - snapshot-to-page: 5 page mappers (Operator/Chat/StackChan/Push/SafetyStrip)
  - tests: 45/45 PASS; typecheck×2 PASS; mobile-console 37/37 PASS
  - key: all mappers return HOLD for null/stale; physicalOperation:false literal
- docs-only evidence; no push

## v3.71.0 - UI-03 Backend Snapshot Contract Design Prepared

- roadmapVersion: v3.71.0
- lastUpdated: 2026-05-17
- 4 docs created:
  - UI_03_BACKEND_SNAPSHOT_CONTRACT_REVIEW.md (purpose / risks / STOP conditions)
  - UI_03_PAGE_DATA_REQUIREMENTS.md (12 pages; field tables; fallback rules)
  - UI_03_REDACTION_AND_FRESHNESS_POLICY.md (severity table; 11 raw value categories)
  - UI_03_IMPLEMENTATION_GO_DRAFT.md (3 helper files + test; NOT approval)
- key policy:
    HOLD is universal fallback for stale/missing/error/unknown
    redaction happens in main/preload, not renderer
    rawValuesReported: false must be provable at IPC boundary
- implementation: NOT started; separate GO required
- docs-only; no push

## v3.70.0 - UI-02 Contract Scaffold PASS — Evidence Recorded

- roadmapVersion: v3.70.0
- lastUpdated: 2026-05-17
- UI_02_CONTRACT_SCAFFOLD_EVIDENCE.md created
  - 6eac036 feat: add command center ui contract types confirmed
  - 4 type files; no existing files modified; no components
  - 14 safety literal types encoded (productionReady:false / execution:"disabled" /
    physicalOperation:false / displayOnly:true / target:"local-chat-service" etc.)
  - typecheck:node PASS / typecheck:web PASS / mobile-console 37/37 PASS
  - rendered UI: not implemented (UI-03+)
  - status: PASS
- docs-only evidence; no push

## v3.69.0 - UI-02 Implementation Scope Review Prepared

- roadmapVersion: v3.69.0
- lastUpdated: 2026-05-17
- 4 UI-02 scope docs created:
  - UI_02_IMPLEMENTATION_SCOPE_REVIEW.md
      (4 allowed files; type-only; no components; no runtime)
  - UI_02_ALLOWED_FILES_AND_COMMANDS.md
      (exact allowed/forbidden files + commands; tsconfig edge case noted)
  - UI_02_TEST_PLAN.md
      (typecheck:node + typecheck:web + vitest; failure handling)
  - UI_02_STOP_CONDITIONS.md
      (source scope / safety / runtime / TypeScript / git / test violations)
- source implementation: NOT started; awaiting separate human GO
- docs-only; no src changes; no push

## v3.68.0 - Gate 007 Accepted and Pushed Evidence Recorded

- roadmapVersion: v3.68.0
- lastUpdated: 2026-05-17
- GATE_007_ACCEPTED_AND_PUSHED_EVIDENCE.md created
  - 474c928 UI-01 design package intake: PUSHED ✓
  - 2729d04 Gate 007 wording hardening: PUSHED ✓
  - origin/main 2729d04 confirmed by CLI ✓
  - commits_ahead 0 confirmed ✓
  - all safety invariants maintained ✓
  - UI-02 approval: NOT included
- docs-only; no push (this evidence commit pending push GO)

## v3.67.0 - Gate 007 Command Center Wording Hardening

- roadmapVersion: v3.67.0
- lastUpdated: 2026-05-17
- 5 docs created in docs/shikishima/:
  - GATE_007_WORDING_HARDENING_PLAN.md (scope / non-scope / STOP conditions)
  - COMMAND_CENTER_UI_BUTTON_WORDING_POLICY.md
      (16-area wording table: unsafe → safe / approved label list / locked control spec)
  - COMMAND_CENTER_UI_STATE_LABEL_POLICY.md
      (14 canonical states / fallback rules / display rules)
  - COMMAND_CENTER_DESIGN_TO_IMPLEMENTATION_SAFETY_CHECKLIST.md
      (15 sections A-O / sign-off format for each UI phase)
  - GATE_007_CLAUDECODE_UI02_GO_DRAFT.md
      (UI-02 GO template / explicit NOT-approval notice)
- docs-only; no src changes; no push
- status: Gate 007 wording hardening complete; UI-02 blocked until push + human GO

## v3.66.0 - UI-01 Final Command Center Design Package Ingested

- roadmapVersion: v3.66.0
- lastUpdated: 2026-05-17
- docs/shikishima/design/final-command-center/ created
  - source/: 15 design JSX files + index.html + .design-canvas.state.json
  - DESIGN_PACKAGE_INTAKE_REPORT.md: 12 pages / 5 states / full coverage confirmed
  - DESIGN_TO_IMPLEMENTATION_MAPPING.md: file → src target mapping
  - FRONTEND_BACKEND_UI_CONTRACT.md: per-page service deps + button policy
  - UI_SAFETY_AND_BUTTON_POLICY_REVIEW.md: all safety checks PASS
  - UI_IMPLEMENTATION_PHASE_PLAN.md: UI-01 through UI-10 phases
  - CLAUDECODE_IMPLEMENTATION_HANDOFF.md: UI-02 first; rollback plan
- source implementation: NOT started
- productionReady: false / execution: disabled
- docs-only; no src changes; no push

## v3.65.0 - Gate 006 Controlled Runtime Observation PASS

- roadmapVersion: v3.65.0
- lastUpdated: 2026-05-17
- POST_100_GATE_006_CONTROLLED_RUNTIME_OBSERVATION_EVIDENCE.md created
  - session_id: gate006-session-001
  - time_window: 2026-05-17 17:05-18:00 JST
  - runtime_command: npm run dev
  - iPhone Private Console: connected; read-only; redacted ✓
  - productionReady: false displayed ✓ / execution: disabled displayed ✓
  - external writes: all inactive ✓ / Draft Outbox: draft-only ✓
  - Approval Queue: display-only ✓ / StackChan: display-only ✓
  - shutdown: completed ✓ / port_3030_closed: true ✓
  - ENABLED flag reverted: false as const ✓
  - UI snapshot version note: a0ffa2a is stale snapshot metadata (known behavior; not a safety concern)
  - BLOCKER-002 resolved: Gate 006 observation PASS ✓
  - result: CONTROLLED_RUNTIME_OBSERVATION_PASS
- docs-only; no code; no push
- status: 80〜85% candidate

## v3.64.0 - Gate 006 Runtime Observation GO Wording Reviewed

- roadmapVersion: v3.64.0
- lastUpdated: 2026-05-17
- POST_100_GATE_006_RUNTIME_OBSERVATION_GO_REVIEW_EVIDENCE.md created
  - 9 required GO elements reviewed against existing template
  - present: Elements 1-6, 8 (7/9 fully; Elements 7 and 9 partial)
  - 4 minor gaps identified (runtime command, shutdown failure, port close confirm, STOP conditions in GO)
  - annotated sample GO created covering all 9 elements with gap hardening
  - verdict: GO_WORDING_REVIEWED; first session can proceed with annotated sample form
  - runtime_started: false (docs-only review)
- docs-only; no code; no push
- status: GO_WORDING_REVIEWED; 75% candidate

## v3.63.0 - Gate 005 productionReady Precheck Reviewed

- roadmapVersion: v3.63.0
- lastUpdated: 2026-05-17
- POST_100_GATE_005_PRODUCTION_READY_PRECHECK_REVIEW_EVIDENCE.md created
  - Section A: 1/5 (STARTED done; 3 actual sessions not yet run)
  - Section B: 1/5 (ENABLED flag confirmed; per-session verification pending)
  - Section C: 0/3 (Gate 006 not yet executed)
  - Section D: 0/3 partial (Gate 007 not yet executed)
  - Section E: deferred (re-verify at productionReady final review)
  - Section F: 2/4 (changelog + dashboard current; registry + blockers pending)
  - Section G: 0/3 (final review and GO template pending)
  - active_blockers: 6 (all open; resolution paths defined)
  - BLOCKER-004 partial credit: HOLD/REJECT paths confirmed usable via dry-run
  - productionReady: false — reasons explicit and documented
- docs-only; no code; no push
- status: productionReady_precheck: reviewed; 70% candidate

## v3.62.0 - Gate 004 Audit Dry-Run PASS: PASS/HOLD/REJECT Classification Confirmed

- roadmapVersion: v3.62.0
- lastUpdated: 2026-05-17
- POST_100_GATE_004_AUDIT_DRY_RUN_EVIDENCE.md created
  - samples_total: 3 / samples_classified: 3
  - sample-001: general_text_draft → PASS (work note; no sensitive data; manual_copy_only clear)
  - sample-002: calendar_event_draft → HOLD (ambiguous schedule target; external calendar implied)
  - sample-003: external_send_request → REJECT ("自動送信" explicitly requests forbidden external write)
  - classification_rules_usable: true
  - operation_log_compatibility: confirmed for all 3 paths
  - result: AUDIT_CLASSIFICATION_CONFIRMED
- docs-only; no code; no push
- status: Gate 004 classification confirmed; 65% candidate

## v3.61.0 - Gate 004 Audit Readiness Evidence PASS

- roadmapVersion: v3.61.0
- lastUpdated: 2026-05-17
- POST_100_GATE_004_AUDIT_READINESS_EVIDENCE.md created
  - Gate 004 design docs presence check: all 3 present ✓ (fbb4558)
  - Dry-run pre-operation checklist against current baseline: PASS
  - Dry-run post-operation checklist (nominal): PASS
  - Per-draft checklist practical assessment vs Gate 003 evidence: all 10 items USABLE
  - Incident response rules completeness: COMPLETE
  - Operation log template completeness: COMPLETE
  - Internal consistency check: all 3 docs mutually consistent ✓
  - result: PASS — readiness_status: READY_FOR_FIRST_ACTUAL_SESSION
- docs-only; no code changes; no push
- status: first actual session may proceed with separate human GO

## v3.60.0 - Post-100 Gates 004–007 Design Package

- roadmapVersion: v3.60.0
- lastUpdated: 2026-05-17
- docs_created: 14 (docs-only; no code changes)
- Gate 004 files:
  - POST_100_GATE_004_MANUAL_OPERATION_AUDIT_CHECKLIST.md
  - POST_100_GATE_004_INCIDENT_RESPONSE_RULES.md
  - POST_100_GATE_004_OPERATION_LOG_TEMPLATE.md
- Gate 005 files:
  - POST_100_GATE_005_PRODUCTION_READY_PRECHECKLIST.md
  - POST_100_GATE_005_PRODUCTION_READY_BLOCKERS.md (6 active blockers)
  - POST_100_GATE_005_PRODUCTION_READY_FINAL_GO_TEMPLATE.md
- Gate 006 files:
  - POST_100_GATE_006_RUNTIME_OBSERVATION_PLAN.md
  - POST_100_GATE_006_RUNTIME_OBSERVATION_GO_TEMPLATE.md
  - POST_100_GATE_006_RUNTIME_OBSERVATION_EVIDENCE_TEMPLATE.md
- Gate 007 files:
  - POST_100_GATE_007_LIMITED_MANUAL_OPERATION_USE_CASE_EXPANSION_PLAN.md
  - POST_100_GATE_007_USE_CASE_POLICY_MATRIX.md (3 approved / 6 pending)
  - POST_100_GATE_007_EXPANDED_OPERATION_EVIDENCE_TEMPLATE.md
- Cross-gate files:
  - POST_100_GATES_004_TO_007_DESIGN_SUMMARY.md
  - POST_100_GATES_004_TO_007_DESIGN_PACKAGE_EVIDENCE.md
- status: design_ready — no sessions executed; no push performed
- safety invariants: all maintained

## v3.59.0 - Limited Manual Operation STARTED

- roadmapVersion: v3.59.0
- lastUpdated: 2026-05-17
- LIMITED_MANUAL_OPERATION_START_EVIDENCE.md created
  - status: STARTED
  - basis: Gate 001 + Gate 002 + Gate 003 all ACCEPTED/PUSHED
  - allowed: draft creation / human review / approved_for_manual_copy / human manual copy
  - not approved: productionReady / execution / runtime / external writes / StackChan / voice
  - progress: 50〜55%
- next: push GO for STARTED evidence → Task 8

## v3.58.0 - Post-100 Gate 003 PASS: Manual Operation Repeatability Test

- roadmapVersion: v3.58.0
- lastUpdated: 2026-05-17
- POST_100_GATE_003_MANUAL_OPERATION_REPEATABILITY_EVIDENCE.md created
  - samples_total: 3 / samples_passed: 3 / samples_hold: 0 / samples_rejected: 0
  - sample-002: general_text_draft — PASS
  - sample-003: github_issue_draft — PASS (no remote creation, external_service: none)
  - sample-004: social_post_draft — PASS (no social API, external_service: none)
  - repeatability_confirmed: true
  - limited_manual_operation_candidate: true
- result: PASS
- next: push GO for evidence → Task 7 Limited Manual Operation STARTED evidence

## v3.57.0 - Post-100 Gate 003: Manual Operation Repeatability Test Plan

- roadmapVersion: v3.57.0
- lastUpdated: 2026-05-17
- POST_100_GATE_003_MANUAL_OPERATION_REPEATABILITY_PLAN.md created
  - 3 planned samples: work_note / github_issue_draft / social_post_draft
  - all samples: external_service none / manual_copy_only
  - approved_for_manual_copy definition per sample
  - success criteria: 3 samples PASS / repeatability_confirmed
- POST_100_GATE_003_MANUAL_OPERATION_REPEATABILITY_EVIDENCE_TEMPLATE.md created
  - per-sample: state_flow / 8-item checklist / decision
  - summary: samples_total / samples_passed / repeatability_confirmed
  - safety invariants / non-approval boundary
- next: human review + push GO for plan commit → Task 5 repeatability execution

## v3.56.0 - Post-100 Gate 002 PASS: Initial Limited Manual Operation Test

- roadmapVersion: v3.56.0
- lastUpdated: 2026-05-17
- POST_100_GATE_002_INITIAL_LIMITED_MANUAL_OPERATION_EVIDENCE.md created
  - test_id: post100-gate002-sample-001
  - category: general_text_draft / external_service: none
  - 8-item checklist: all PASS
  - state_flow: draft_created → review_requested → approved_for_manual_copy
  - approved_for_manual_copy semantics confirmed
  - all safety invariants: false/disabled/true ✓
- result: PASS
- workflow validation: Draft Outbox → approved_for_manual_copy confirmed functional
- next: human acceptance + push GO → Gate 003 repeatability test (optional)

## v3.55.0 - Post-100 Gate 002: Initial Limited Manual Operation Test Plan

- roadmapVersion: v3.55.0
- lastUpdated: 2026-05-17
- POST_100_GATE_002_INITIAL_LIMITED_MANUAL_OPERATION_PLAN.md created
  - non-sensitive general_text_draft test case defined
  - 6-step flow (draft_created → approved_for_manual_copy)
  - 10-state state machine with approved_for_manual_copy explicitly defined
  - 8-item checklist instance for the test case
  - success criteria defined
- POST_100_GATE_002_INITIAL_LIMITED_MANUAL_OPERATION_EVIDENCE_TEMPLATE.md created
  - all safety invariant fields present
  - decision field with approved_for_manual_copy semantic note
  - next action guidance
- non-approval boundary explicitly stated
- next: human reviews plan, approves test execution, fills evidence template

## v3.54.0 - Post-100 Gate 001 ACCEPTED_AND_PUSHED

- roadmapVersion: v3.54.0
- lastUpdated: 2026-05-17
- POST_100_GATE_001_ACCEPTED_AND_PUSHED_EVIDENCE.md created
- accepted_as_draft_outbox_operation_rules: true
- pushed commits: cd289fe + 248c94e → origin/main (248c94e)
- next recommended gate: Gate 002 Initial Limited Manual Operation Test
- Gate 002 scope: non-sensitive text proposal → manual copy only → evidence

## v3.53.0 - Post-100 Gate 001: Draft Outbox Operation Rulebook (hardened)

- roadmapVersion: v3.53.0
- lastUpdated: 2026-05-17
- DRAFT_OUTBOX_OPERATION_RULEBOOK.md created and hardened
  - Draft-only policy enforced (type-level literals confirmed)
  - 7 external action categories with risk levels
  - 8-item manual review checklist
  - State machine: 10 states including approved_for_manual_copy (explicitly defined)
  - approved_for_manual_copy: manual copy only; system/AI cannot send/create/pay
  - Forbidden actions enumerated per category (email/calendar/github/social/payment/API)
  - Future GO requirements per category
- POST_100_GATE_001_DRAFT_OUTBOX_OPERATION_EVIDENCE.md created
  - Safety boundary confirmed (all external writes false)
  - result_candidate: COMPLETE_PASS
- next: human acceptance (accepted_as_draft_outbox_operation_rules) + push GO

## v3.52.0 - Phase 90→100 Final Safety Review

- roadmapVersion: v3.52.0
- lastUpdated: 2026-05-17
- FINAL_SAFETY_REVIEW_LIMITED_OPERATION_READINESS.md created
- FINAL_HOLD_AND_FUTURE_GO_REGISTRY.md created (16 items, all HOLD)
- PHASE_90_TO_100_FINAL_SAFETY_REVIEW_EVIDENCE.md created
- Evidence chain 20→90% confirmed: all COMPLETE_PASS or PASS_WITH_CAVEAT
- Safety invariants confirmed by source scan + 49 tests
- result_candidate: COMPLETE_PASS
- 100% safety-readiness candidate — NOT productionReady true
- next: human acceptance + push GO

## v3.51.0 - Phase 75 to 90 Draft Outbox / External Action Safety Layer

- roadmapVersion: v3.51.0
- lastUpdated: 2026-05-17
- DraftOutboxItem / DraftOutboxSummary redacted snapshot model added
- Default draft-only outbox items added for email, GitHub follow-up, calendar checkpoint, and purchase/reservation HOLD
- iPhone `/mobile/ui` now displays Draft Outbox cards after authenticated redacted snapshot fetch
- Desktop Mobile Console now includes an Outbox tab
- Outbox controls are inactive / draft-only / no external write
- Tests added for no send, no remote creation, no payment/reservation, and no external API behavior
- evidence: PHASE_75_TO_90_DRAFT_OUTBOX_SAFETY_EVIDENCE.md
- result_candidate: COMPLETE_PASS
- next: human review + push GO for Phase 75 to 90 commits

## v3.50.0 - Phase 60 to 75 StackChan / Face Terminal Display Preparation

- roadmapVersion: v3.50.0
- lastUpdated: 2026-05-17
- DisplayTerminalPreviewState / DisplayTerminalSummary redacted snapshot model added
- Default display preview state: StackChan not arrived, display preview only, physical operation false
- Expression mapping added for Komashiki and Approval Queue state
- iPhone `/mobile/ui` now displays Display Terminal Preview after authenticated redacted snapshot fetch
- Desktop Mobile Console now includes a Face tab for StackChan / Face Terminal Preview
- Tests added for display terminal safety, non-connection policy, and expression mapping
- evidence: PHASE_60_TO_75_STACKCHAN_DISPLAY_PREPARATION_EVIDENCE.md
- result_candidate: COMPLETE_PASS
- physical_test_status: deferred
- next: human review + push GO for Phase 60 to 75 commits

## v3.49.0 - Phase 45 to 60 Approval Queue UI Foundation

- roadmapVersion: v3.49.0
- lastUpdated: 2026-05-17
- latestUpdate: Phase 45 to 60 Approval Queue UI foundation COMPLETE_PASS candidate
- ApprovalQueueItem / ApprovalQueueSummary redacted snapshot model added
- Default approval queue items added for source change review, future runtime observation, git push, and StackChan physical operation
- iPhone `/mobile/ui` now displays Approval Queue cards after authenticated redacted snapshot fetch
- Desktop Mobile Console now includes an Approval Queue tab
- Queue controls are inactive / display-only / no execution
- Komashiki default state remains HOLD while high or critical held approval items exist
- stale Session-009 display wording removed from mobile GO drafts and B3 progress copy
- evidence: PHASE_45_TO_60_APPROVAL_QUEUE_UI_EVIDENCE.md
- result_candidate: COMPLETE_PASS
- next: human review + push GO for Phase 45 to 60 commits

## v3.48.0 - Phase 30→45% iPhone Console UX + こましき Display Implemented

- roadmapVersion: v3.48.0
- lastUpdated: 2026-05-17
- KomashikiDisplayState type added (10 states)
- MobileConsoleSnapshot: komashikiState / caveats / nextHumanAction / phaseProgress / currentSession
- iPhone HTML (buildMobileUiHtml): こましき section / caveat section / next action / phase progress
- Default snapshot: updated from stale Phase 2A/B3 to current 30% / L3-A state
- MobileKomashikiCard.tsx: new display-only Desktop component
- MobileStatusCard: stale text removed, KomashikiCard integrated
- 19 new tests (31 total PASS)
- typecheck: node=0 / web=0
- result_candidate: COMPLETE_PASS
- next: human acceptance + push GO → 45→60% Approval Queue UI

## v3.47.0 - Level 3-A Session 004 PASS_WITH_CAVEAT — Phase 20→30% Complete

- roadmapVersion: v3.47.0
- lastUpdated: 2026-05-17
- LEVEL_3_A_OBSERVATION_EVIDENCE_2026-05-17-004.md created
  - result: PASS_WITH_CAVEAT
  - caveat: windows_manual_installer_required_non_blocking
  - iPhone observation: completed ✓ (mobile UI reachable, redacted snapshot visible)
  - rawValuesReported in app content: false ✓
  - Electron window open during report: true ✓
- phase_20_to_30_status: COMPLETE_PASS_WITH_CAVEAT
- progress: ~30%
- source fixes landed: 060f67c (windows classifier) / 7f98c78 (non-blocking)
- next phase: 30→45% (iPhone Private Console UX improvement)
- human_accepted: true (Session 004 PASS_WITH_CAVEAT accepted as 30% milestone)

## v3.46.0 - Level 3-A Session 002 HOLD Evidence Recorded; Session 003 GO Package Created

- roadmapVersion: v3.46.0
- lastUpdated: 2026-05-17
- LEVEL_3_A_OBSERVATION_EVIDENCE_2026-05-17-002.md created
  - result: HOLD — app closed before iPhone observation was confirmed
  - stop_trigger: app_closed_before_observation_reported
  - ENABLED reverted: true → false as const (commit 1bd1b69)
  - backup_branch: session-002-runtime-local-backup (bae8db4)
- LEVEL_3_A_SESSION_003_GO_PACKAGE_DRAFT.md created
  - session_003_observation_note added: keep Electron window open; report before closing
  - Option B caveat policy carried over
  - awaiting human time_window and final GO

## v3.45.0 - Shikishima Codex Pet こましき Concept Defined

- roadmapVersion: v3.45.0
- lastUpdated: 2026-05-17
- SHIKISHIMA_CODEX_PET_CONCEPT.md created
- こましき: small Codex companion / status guardian / display-only
- 10 expression states / relationship model / design tone / name origin
- Level 0 autonomy only (display/suggestion) / no execution authority

## v3.44.0 - Level 3-A Session 002 GO Package Draft Created

- roadmapVersion: v3.44.0
- lastUpdated: 2026-05-17
- LEVEL_3_A_SESSION_002_GO_PACKAGE_DRAFT.md created
- Updated result classification: CLEAN_PASS / PASS_WITH_CAVEAT / HOLD
- Option B caveat acknowledged in GO template
- 15-item pre-GO checklist updated for Session 002
- Awaiting human time_window and final GO

## v3.43.0 - Level 3-A Installer Dialog Caveat Policy Defined

- roadmapVersion: v3.43.0
- lastUpdated: 2026-05-17
- LEVEL_3_A_INSTALLER_DIALOG_CAVEAT_POLICY.md created
- Option B: dismiss dialog / PASS_WITH_CAVEAT / no install / no elevation / no download
- Root cause: Hermes CLI not installed → recurring startup behavior
- Applies to all future Level 3-A Scope B runs

## v3.42.0 - Level 3-A Session 001 HOLD Evidence Recorded

- roadmapVersion: v3.42.0
- lastUpdated: 2026-05-17
- LEVEL_3_A_OBSERVATION_EVIDENCE_2026-05-17-001.md created
- Session 001 result: HOLD (Hermes Installer dialog appeared before iPhone check)
- STOP correctly triggered / rollback correctly executed
- Option B retry policy: dismiss installer dialog / PASS_WITH_CAVEAT
- Temp ENABLED=true commit kept in local backup branch only (not pushed to main)

## v3.41.0 - Level 3-A Final GO Package Filled (Scope B)

- roadmapVersion: v3.41.0
- lastUpdated: 2026-05-17
- LEVEL_3_A_FINAL_GO_PACKAGE_DRAFT.md filled with human-provided values
  scope: B / Phase 2C iPhone same-LAN / date: 2026-05-17 / window: 00:15-00:45 JST
  exact_command: npm run dev (with ENABLED=true local commit, NOT pushed to main)
  iPhone_confirmation_required: yes
  evidence_file: LEVEL_3_A_OBSERVATION_EVIDENCE_2026-05-17-001.md
- This draft does not approve execution — separate final human GO required

## v3.40.0 - Vision and Level 3-A Alignment Review Complete

- roadmapVersion: v3.40.0
- lastUpdated: 2026-05-16
- SHIKISHIMA_VISION_LEVEL_3A_ALIGNMENT_REVIEW.md created
- All 6 design docs reviewed: CONSISTENT
- No contradictions detected
- Core rule confirmed: propose/draft/warn YES / high-risk execution requires GO
- Level 3-A: controlled observation only (CONFIRMED)

## v3.39.0 - External Tool Integration Policy Map Created

- roadmapVersion: v3.39.0
- lastUpdated: 2026-05-16
- SHIKISHIMA_EXTERNAL_TOOL_INTEGRATION_POLICY_MAP.md created
- 8 tool categories: X/Note / Calendar / Reservation / Shopping / Sensors / ToDo / Finance / Dev
- Each: allowed(draft/research) vs forbidden(write/execute without GO)

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
