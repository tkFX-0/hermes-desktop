# Roadmap Status Schema

This is a human-readable status schema only. It is not executable JSON schema
and does not require tooling.

## Fields

| Field | Meaning | Current value |
|---|---|---|
| roadmapVersion | visible roadmap version | v0.8.1 |
| lastUpdated | visible update date | 2026-05-11 |
| latestUpdate | short update summary | Static face preview review hardening added |
| currentDecision | current project decision | HOLD |
| executionStatus | execution gate state | disabled |
| productionReady | production readiness flag | false |
| rawValuesReported | raw-value reporting status | false |
| updatedPhases | phases changed in latest update | Phase 3, Phase 4, Phase 5, Phase 6, Phase 7, Phase 8, Phase 9, Phase 10 |
| reviewStatuses | human review state by phase | see `PHASE_REVIEW_MATRIX.md` |
| documentationReviewStatus | docs review state | review_ready_for_human_approval or draft_created |
| executionApprovalStatus | execution approval state | not_approved_for_execution |
| approvalScope | scope of approval | documentation_only unless separately approved |
| nextHumanReviewPackage | next review bundle | Human Documentation Review Package |
| separateGoRequired | whether execution requires scoped GO | true |
| protocolStatus | dashboard protocol status | HOLD / disabled / false flags |
| agentDirectoryStatus | agent directory dashboard state | static_display_only |
| humanReviewQueueStatus | human review queue state | pending_review |
| knowledgeIndexStatus | しるべ index state | redacted_static_index |
| developmentTempoStatus | tempo dashboard state | docs_only_summary |
| safeProgressViewStatus | progress view state | non_competitive_static |
| faceDesignStatus | face design state | current_preferred_direction_documented |
| currentFaceDesignDirection | current face design direction | minimal_dot_line_face_parts_only |
| mouthAnimationConceptStatus | mouth animation concept state | design_only |
| eyeGazeAnimationConceptStatus | eye gaze concept state | design_only |
| smartphoneFaceDisplayStatus | smartphone face display state | design_only_display_plan |
| stackchanFaceDisplayStatus | StackChan face display state | future_display_only_plan |
| robotMotionApprovalStatus | robot motion approval state | not_approved |
| voiceConceptStatus | voice concept state | design_only_non_audio |
| agentVoicePatternStatus | agent voice/face pattern state | design_only |
| faceSignalProtocolStatus | non-execution signal protocol state | concept_only_not_device_command |
| faceTerminalConnectionConceptStatus | future terminal connection concept | not_approved_for_execution |
| audioPlaybackApprovalStatus | audio playback approval state | not_approved |
| microphoneApprovalStatus | microphone approval state | not_approved |
| recordingApprovalStatus | recording approval state | not_approved |
| staticFacePreviewBoardStatus | static face preview state | visual_review_only |
| pcWidthPreviewStatus | PC-width preview state | review_ready |
| smartphoneWidthPreviewStatus | smartphone-width preview state | review_ready |
| facePreviewInteractionStatus | preview interaction state | no_input_no_button |
| facePreviewConnectionStatus | preview connection state | no_connection |
| facePreviewBoundaryStatus | preview boundary state | display_only_no_execution_no_device_connection |

## Status Values

| Status | Meaning |
|---|---|
| review_ready_for_human_approval | docs are ready for human review; not execution-approved |
| draft_created | draft document exists for review |
| documentation_only | no runtime or execution effect |
| not_approved_for_execution | execution remains disabled |
| blocked_by_execution_gate | cannot proceed without separate scoped approval |
| human_go_required | explicit human GO is required before any future execution |

## Approval Separation Fields

These fields are human-readable documentation status only. They do not create
runtime behavior, execution permission, or production readiness.

## Rule

This schema describes documentation status. It does not enable execution and is
not GO approval.

この範囲では問題を検出していません。
