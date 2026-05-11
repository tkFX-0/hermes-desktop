# 縺励″縺励∪險育判 窶・螳滄°逕ｨ繝ｭ繝ｼ繝峨・繝・・

## Update Status

- roadmapVersion: v1.6.0
- lastUpdated: 2026-05-12
- latestUpdate: docs/ichikishima migration plan added
- baselineCommit: 181389df175d8db7241ebc13d4d3b20d66812b76
- changelog: `ROADMAP_CHANGELOG.md`
- phase review: `PHASE_REVIEW_MATRIX.md`
- human review guide: `HUMAN_DOCUMENTATION_REVIEW_GUIDE.md`

Every future roadmap-affecting change must visibly update
`REAL_OPERATION_ROADMAP.html`, `ROADMAP_CHANGELOG.md`, `roadmapVersion`,
`lastUpdated`, and `latestUpdate`.

## Current State

- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false
- base machine: RTX 4070 12GB PC
- mini PC: deferred / optional
- model direction: local-first
- cloud budget target: approximately 10 USD per month
- RunPod: on-demand only, explicit approval required

This roadmap is static documentation only. It is not execution approval.

v1.0.0 is a Static Design Review Package. It is not productionReady, not GO
approval, not execution approval, not device connection approval, and not
runtime readiness.

v0.4.0 adds human documentation review checklists and approval separation
policy. Documentation approval is not execution approval.

Execution approval requires a separate scoped GO decision.

## Explorer-Style Dashboard

v0.5.0 adds a static dashboard section inspired only by high-level information
architecture patterns. It includes:

- Protocol Status.
- Agent Directory.
- Human Review Queue.
- 縺励ｋ縺ｹ Knowledge Index.
- Current Tempo.
- Safe Progress Views.

It adds no wallet, no token system, no marketplace mechanics, no reward
mechanics, no earning mechanics, no autonomous task execution, and no external
API integration.

## Minimal Dot-Line Face System

v0.6.0 adds the current preferred face expression direction for the Shikishima
agents.

The current direction is:

- dot-and-line based.
- face-parts only.
- no face outline.
- no torso.
- no costume.
- no full body or bust-up avatar.
- lots of whitespace.
- tiny optional color accents only.
- smartphone display-only for future UI planning.
- future StackChan display-only adaptation only.

v0.6.0 supersedes the costume-heavy bust-up avatar direction for current face
design. Mouth-flap and eye-gaze concepts are design-only and are not runtime
implementation. This update does not approve StackChan control, robot motion,
GO, or production readiness.

## Voice / Mouth-Flap / Eye-Gaze Concept

v0.7.0 adds a non-execution concept layer for voice intent, mouth patterns, eye
gaze patterns, and future display terminal connection planning.

This includes:

- `VOICE_MOUTH_EYE_CONCEPT.md`
- `AGENT_FACE_VOICE_PATTERN_GUIDE.md`
- `NON_EXECUTION_FACE_SIGNAL_PROTOCOL.md`
- `FACE_TERMINAL_CONNECTION_CONCEPT.md`

Voice intent is a display label only. It does not approve audio playback,
recording, microphone use, speech synthesis, external API use, camera tracking,
StackChan control, robot motion, GO, or production readiness.

## Static Face Preview Board

v0.8.0 adds a static face preview board for visual review.

It includes:

- five agent face previews.
- PC-width and smartphone-width visual review guidance.
- display-only labels for voiceIntent, mouthPattern, gazePattern, and blinkState.
- `STATIC_FACE_PREVIEW_BOARD.md`
- `FACE_PREVIEW_REVIEW_CHECKLIST.md`
- `FACE_PREVIEW_VISUAL_STATES.md`

It does not add buttons, inputs, forms, audio, video, microphone, camera,
external API, StackChan connection, robot control, GO, or production readiness.

v0.8.1 hardens the review boundary by requiring each face preview card to show:

- display-only.
- no execution.
- no device connection.

It also adds PC-width and smartphone-width review checks to prevent the preview
from reading like an operational control surface.

## Expression Variation Set

v0.9.0 adds a common static expression variation set:

- neutral.
- listening.
- thinking.
- holding.
- caution.
- rejected.
- review_ready.
- completed_static_only.

Each expression defines an expressionId, Japanese label, purpose, allowed use,
forbidden interpretation, voiceIntent display label, mouthPattern display label,
gazePattern display label, blinkState display label, and safety note.

The expressions are static display labels only. They are not real-time status,
connection status, robot control preview, GO approval indicator, productionReady
indicator, or execution readiness.

v0.9.1 hardens the expression safety review wording:

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

## Static Design Review Package

v1.0.0 packages v0.1.0 through v0.9.1 for human static design review:

- roadmap and changelog visibility.
- phase review matrix.
- human documentation review package.
- Explorer-style static dashboard.
- minimal dot-line face system.
- Voice-Mouth-Eye Concept.
- Static Face Preview Board.
- Expression Variation Set.
- Expression Safety Review Hardening.

v1.0.0 does not approve:

- productionReady.
- GO.
- execution.
- device connection.
- audio playback, microphone, recording, or camera.
- StackChan or robot control.
- WSL, Hermes, wrapper, dummy wrapper, RunPod, install, external network, or
  git push.

Next allowed work remains documentation/static-only: review notes, wording
cleanup, static HTML readability review, checklist refinement, and
documentation approval record preparation.

## Human Static Review Record

v1.0.1 adds `V1_HUMAN_STATIC_REVIEW_RECORD.md` for recording the human review
result for v1.0.0.

The record is docs/static-only. It can record:

- reviewTargetVersion: v1.0.0.
- reviewDecision: approved_for_static_design_review / needs_revision /
  rejected.
- reviewer: human.
- reviewDate.
- scope: docs/static-only.
- notes.
- requiredRevisions.
- nextAllowedAction.
- stillForbiddenActions.

The record explicitly does not approve GO, execution, productionReady,
connection, voice I/O, camera, microphone, StackChan control, robot motion,
WSL/Hermes/wrapper/dummy/RunPod, or git push.

## Human Review Package

v0.4.0 adds:

- `HUMAN_DOCUMENTATION_REVIEW_GUIDE.md`
- `PHASE_3_APPROVAL_CHECKLIST.md`
- `PHASE_4_APPROVAL_CHECKLIST.md`
- `PHASE_5_APPROVAL_CHECKLIST.md`
- `PHASE_6_TO_10_PRE_EXECUTION_REVIEW_CHECKLIST.md`
- `DOCUMENTATION_APPROVAL_RECORD_TEMPLATE.md`
- `EXECUTION_APPROVAL_SEPARATION_POLICY.md`

## Phase 0 窶・Current HOLD Baseline

Goal: clarify the HOLD baseline and document what is not ready.

Outputs:

- HOLD declaration.
- Redacted current snapshot.
- Static roadmap docs.

Forbidden:

- execution.
- WSL.
- Hermes.
- GO transition.

## Phase 1 窶・Naming and Final Vision

Goal: finalize agent names, roles, and nickname rules.

Outputs:

- `SHIKISHIMA_FINAL_VISION.md`
- `AGENT_NAMES_ROLES_AND_PERMISSIONS.md`

Completion condition: names and roles are human approved.

## Phase 2 窶・Static HTML Roadmap

Goal: provide a static HTML roadmap with no execution features.

Outputs:

- `REAL_OPERATION_ROADMAP.html`
- `REAL_OPERATION_ROADMAP.md`
- `SHIKISHIMA_SYSTEM_DIAGRAM.md`

Rules:

- no external CDN.
- no Google Fonts.
- no fetch/API calls.
- no command input.
- no execution buttons.

## Phase 3 窶・Agent Roles and Permissions

Goal: define agent permissions, communication routes, and safety boundaries.

Completion condition: permission matrix is human approved.

Review support added in v0.3.0:

- `PHASE_REVIEW_MATRIX.md`
- `AGENT_NAMES_ROLES_AND_PERMISSIONS.md` approval matrix
- `PHASE_3_AGENT_PERMISSION_REVIEW.md`
- `PHASE_3_APPROVAL_CHECKLIST.md`

## Phase 4 窶・Model Router Policy

Goal: define which model tier may be used for each class of task.

Review support added in v0.3.0:

- `MODEL_ROUTER_REVIEW_MATRIX.md`
- explicit rule that model selection is not execution approval
- `PHASE_4_MODEL_ROUTER_REVIEW.md`
- `PHASE_4_APPROVAL_CHECKLIST.md`

Default:

- local-first.
- private/local-only data does not go to cloud.
- high-risk tasks go through `縺励★繧～.
- RunPod requires explicit approval.

## Phase 5 窶・縺励★繧・Safety Gate Policy

Goal: define GO / HOLD / REJECT behavior.

This is a core blocker before any real operation.

Review support added in v0.3.0:

- `SHIZUME_DECISION_MATRIX.md`
- explicit default HOLD and scoped human approval rules
- `PHASE_5_SHIZUME_POLICY_REVIEW.md`
- `PHASE_5_APPROVAL_CHECKLIST.md`

## Phase 6 窶・縺､繧縺・Implementation Workflow

Goal: define how implementation work is accepted, checked, tested, and handed off.

Draft docs added in v0.3.0:

- `TSUMUGI_IMPLEMENTATION_WORKFLOW.md`
- `TSUMUGI_TASK_TEMPLATE.md`
- `TSUMUGI_SAFE_PATCH_CHECKLIST.md`

Result: documentation_only / not_approved_for_execution.

## Phase 7 窶・縺励ｋ縺ｹ Logs and Obsidian-Compatible Templates

Goal: prevent context loss by standardizing handoff and summary logs.

Draft docs added in v0.3.0:

- `SHIRUBE_LOGGING_POLICY.md`
- `SHIRUBE_HANDOFF_TEMPLATE.md`
- `DAILY_WORKLOG_TEMPLATE.md`
- `OBSIDIAN_READY_NOTE_TEMPLATE.md`

Direct Obsidian automation remains HOLD.

## Phase 8 窶・Device Role Plan

Goal: finalize roles for RTX 4070 PC, Lenovo TAB6, Redmi 12, StackChan, iPhone,
and optional mini PC.

Draft docs added in v0.3.0:

- `DEVICE_ROLES_AND_BOUNDARIES.md`
- `DEDICATED_DEVICE_PLAN.md`
- `IPHONE_REVIEW_DEVICE_POLICY.md`
- `ANDROID_FACE_TERMINAL_PLAN.md`

No device settings or connections are changed.

## Phase 9 窶・StackChan Expression-Only Plan

Goal: keep StackChan limited to expression/face output with safety gate approval.

Draft docs added in v0.3.0:

- `STACKCHAN_EXPRESSION_ONLY_PLAN.md`
- `STACKCHAN_SAFETY_BOUNDARY.md`
- `FACE_TERMINAL_EXPRESSION_PROTOCOL_DRAFT.md`

Forbidden:

- autonomous physical movement.
- safety-gate-free control.
- robot control without separate approval.

## Phase 10 窶・Minimum Human-Supervised Operation

Goal: start the smallest possible real operation only after all prior phases are
approved.

Current result: HOLD remains.

Draft docs added in v0.3.0:

- `MINIMUM_OPERATION_RUNBOOK_DRAFT.md`
- `HUMAN_GO_APPROVAL_CHECKLIST.md`
- `NO_GO_CHECKLIST.md`
- `FIRST_SUPERVISED_OPERATION_LOG_TEMPLATE.md`
- `PHASE_6_TO_10_PRE_EXECUTION_REVIEW_CHECKLIST.md`

Phase 10 remains not approved for execution and requires separate explicit
human GO approval.

縺薙・遽・峇縺ｧ縺ｯ蝠城｡後ｒ讀懷・縺励※縺・∪縺帙ｓ縲・
