# Static Design Review Package

## Purpose

v1.0.0 is a static design review package for the Shikishima documentation and
static UI work from v0.1.0 through v0.9.1.

This package is not production readiness, not GO approval, not execution
approval, and not connection approval.

## Current Status

- roadmapVersion: v1.0.0
- latestUpdate: Static design review package added
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false
- robotMotion: HOLD
- GO: not approved
- git push: not performed

## Review Scope

The package summarizes these static documentation areas:

- v0.1.0 initial Shikishima roadmap docs.
- v0.2.0 update visibility and review matrices.
- v0.3.0 HOLD-safe phase documentation loop.
- v0.4.0 human documentation review package.
- v0.5.0 Explorer-style static dashboard.
- v0.6.0 minimal dot-line face expression system.
- v0.7.0 voice, mouth-flap, and eye-gaze concept docs.
- v0.8.0 static face preview board.
- v0.8.1 visual review hardening.
- v0.9.0 expression variation set.
- v0.9.1 expression safety review hardening.

## Review-Ready Areas

These areas may be reviewed as documentation and static UI:

- roadmap structure and changelog visibility.
- phase review matrix.
- agent permissions.
- Model Router policy and review matrix.
- Shizume safety gate policy and decision matrix.
- Tsumugi workflow templates.
- Shirube redacted logging templates.
- device boundary docs.
- StackChan expression-only plan as future display planning.
- minimal dot-line face design.
- static face preview board.
- expression variation labels.

## Still Forbidden

These remain forbidden without separate scoped approval:

- WSL execution.
- Hermes execution.
- wrapper or dummy wrapper execution.
- packaged smoke.
- RunPod start.
- StackChan or robot control.
- audio playback.
- recording.
- microphone use.
- camera use.
- external API or network integration.
- install commands.
- git push.
- GO transition.
- productionReady true.

## Static Face And Expression Boundary

Static Face Preview, Expression Variation, and Voice-Mouth-Eye Concept remain
display-only.

- voiceIntent is a label, not audio output.
- mouthPattern is a label, not lip-sync runtime.
- gazePattern is a label, not eye tracking.
- blinkState is a label, not animation runtime.
- expression states are labels, not real-time status.
- `review_ready` means documentation review ready only.
- `completed_static_only` means docs/static-only completion only.

## Review Decision Options

Human review may choose one of these documentation-only outcomes:

- approved_for_static_design_review.
- needs_revision.
- rejected.

No option in this package grants execution, GO, git push, robot motion, device
connection, or production readiness.

## Next Allowed Work

Allowed next work stays documentation/static-only:

- human review notes.
- wording cleanup.
- visual simplification notes.
- static HTML readability review.
- checklist refinement.
- documentation approval record preparation.

## Required Separation

Documentation approval is separate from:

- local commit approval.
- git push approval.
- execution approval.
- RunPod approval.
- StackChan or robot approval.
- productionReady approval.
- GO approval.
