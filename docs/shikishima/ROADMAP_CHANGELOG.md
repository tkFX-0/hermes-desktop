# Shikishima Roadmap Changelog

## Purpose

This file records visible roadmap-affecting changes for the Shikishima plan.
Roadmap changes are documentation updates only. They are not execution approval,
not GO, and not production readiness.

## Current Roadmap Version

- roadmapVersion: v1.2.4
- lastUpdated: 2026-05-11
- latestUpdate: ProductName display migration added
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

## v1.2.4 - ProductName Display Migration

- `electron-builder.yml` productName: `Hermes Agent` → `しきしま`.
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

- `package.json` description: `Hermes Agent Desktop — self-improving AI assistant`
  → `Shikishima — desktop application for Hermes Agent`.
- `package.json` name: unchanged (`hermes-desktop`).
- `electron-builder.yml` productName: unchanged (`Hermes Agent`).
- Lockfile, dependencies, scripts, build config: unchanged.
- NAMING_MIGRATION_CANDIDATES.md Phase C split into C-1/C-2/C-3.
- HOLD remains current. execution remains disabled. No git push.

## v1.2.2 - Package Metadata Audit

- Added `PACKAGE_METADATA_AUDIT.md` — audit-only / report-only.
- Key findings:
  - `description` change: SAFE (no cascading effects).
  - `name` change: MEDIUM — affects artifact filenames, lockfile root name, updaterCacheDirName.
  - `productName` in electron-builder.yml is NOT derived from package.json name.
  - External GitHub repo refs in electron-builder.yml and dev-app-update.yml: KEEP.
- Recommended split: description (v1.2.3) / productName (v1.2.x) / name (v1.3.0).
- No package.json changes made. HOLD remains current.
- execution remains disabled.

## v1.2.1 - Low-Risk UI Wording Migration

- `src/renderer/index.html` title: `Hermes Agent` → `しきしま`.
- `src/renderer/src/components/common/HermesLogo.tsx` alt: `Hermes` → `しきしま`.
- File name, component name, and import path unchanged.
- NAMING_MIGRATION_CANDIDATES.md Phase B items 1 and 2 marked DONE.
- HOLD remains current. execution remains disabled. No src rename, no deletion, no GO.

## v1.2.0 - Low-Risk Instruction Naming Migration

- Updated `AGENTS.md` Scope: "Ichikishima / Hermes" → "しきしま (旧名/internal: Ichikishima / Hermes Control Center)".
- Updated `AGENTS.md` Normal Low-Risk Work: added `docs/shikishima/` as current area; retained `docs/ichikishima/` as legacy.
- Updated `AGENTS.md` section heading: "Ichikishima Required Completion Report" → "しきしま Required Completion Report".
- Updated `CLAUDE.md` Scope: same as AGENTS.md.
- Updated `CLAUDE.md` heading: "Ichikishima Required Completion Report" → "しきしま Required Completion Report".
- Updated `CLAUDE.md` heading: "Ichikishima Safety Invariants" → "しきしま Safety Invariants".
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
- Added "not execution approval — HOLD remains current" note after
  `controlledPilotCanRunOnceMeta`.
- Strengthened `controlledPilotHint` i18n: added "— not execution approval".
- Added `readinessSafetyBanner`, `bridgeReadinessHint`, `scenarioSuiteHint`,
  `pilotMetaHint` keys to both en and zh-CN i18n files.
- Updated SECURITY_AND_SAFETY_AUDIT_NOTES.md: ControlCenter readiness risk → LOW (mitigated).
- HOLD remains current.
- execution remains disabled.
- no rename approval.
- no deletion approval.
- no GO issued.

## v1.1.0 - Repository Hygiene Audit

- Added `REPOSITORY_HYGIENE_AUDIT.md` — overall audit report with PASS/HOLD/NG table.
- Added `NAMING_MIGRATION_CANDIDATES.md` — phased naming migration candidate list.
- Added `OBSOLETE_FILE_CANDIDATES.md` — files and directories for future cleanup.
- Added `SECURITY_AND_SAFETY_AUDIT_NOTES.md` — redacted security and safety findings.
- Added `PROJECT_ALIGNMENT_REVIEW.md` — 5-agent and plan alignment review.
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

## v0.9.0 — Expression Variation Set

- Added common static expression variation set.
- Added agent expression state matrix.
- Added neutral, listening, thinking, holding, caution, rejected, review_ready, and completed_static_only display labels.
- Reconfirmed expressions are display labels and visual concepts only.
- Reconfirmed expressions are not real-time status, connection status, robot control preview, GO approval indicators, productionReady indicators, or execution states.
- HOLD remains current.
- execution remains disabled.
- no device connection approval.
- no robot motion approval.

## v0.8.1 — Static Face Preview Review Hardening

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

## v0.8.0 — Static Face Preview Board

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

## v0.7.0 — Voice / Mouth-Flap / Eye-Gaze Concept

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

## v0.6.0 — Minimal Dot-Line Face Expression System

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

## v0.5.0 — Explorer-Style Static Dashboard

- Added Explorer-style Dashboard.
- Added Agent Directory dashboard design.
- Added Human Review Queue design.
- Added しるべ Knowledge Index design.
- Added Development Tempo dashboard design.
- Added Safe Progress Views.
- HOLD remains current.
- execution remains disabled.
- no external API.
- no autonomous execution.

## v0.4.0 — Human Documentation Review Package

- Added human documentation review guide.
- Added Phase 3, Phase 4, and Phase 5 approval checklists.
- Added Phase 6-10 pre-execution review checklist.
- Added documentation approval record template.
- Added execution approval separation policy.
- HOLD remains current.
- execution remains disabled.
- no GO approval.

## v0.3.1 — Status Label Consistency Hardening

- Added visible status legend mapping concise UI labels to canonical phase statuses.
- Added canonical status text for Phase 3-10 in the HTML roadmap.
- Hardened しるべ raw-value storage boundary wording.
- HOLD remains current.
- execution remains disabled.
- no GO approval.

## v0.3.0 — HOLD-Safe Full Phase Implementation Loop

- Added Phase 3 permission review package.
- Added Phase 4 Model Router review package.
- Added Phase 5 しずめ review package.
- Added Phase 6 つむぎ workflow docs.
- Added Phase 7 しるべ logging templates.
- Added Phase 8 device boundary docs.
- Added Phase 9 StackChan expression-only plan.
- Added Phase 10 minimum operation runbook draft.
- HOLD remains current.
- execution remains disabled.
- no GO approval.

## v0.2.0 — Phase 2.5-5 Review Support

- Added roadmap update visibility.
- Added update/changelog section.
- Added Phase Review Matrix references.
- Added しずめ decision matrix references.
- Added Model Router review matrix references.
- Added visible update markers for Phase 3, Phase 4, and Phase 5.
- HOLD remains current.

## v0.1.0 — Initial Shikishima Roadmap Docs

- Added static roadmap HTML.
- Added iPhone/mobile review view.
- Added Phase 0-10 roadmap.
- Added 5-agent map.
- Added Model Router overview.
- Added device role overview.
- Added forbidden actions.
- HOLD remains current.

この範囲では問題を検出していません。
