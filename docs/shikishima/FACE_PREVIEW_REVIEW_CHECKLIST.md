# Face Preview Review Checklist

## Purpose

This checklist helps review the v0.8.0 static face preview board without
confusing visual review with execution readiness.

## Visual Review

- [ ] Each agent is identifiable without a face outline.
- [ ] Each agent is identifiable without torso, costume, or full-body avatar.
- [ ] Tiny symbols are visible but not dominant.
- [ ] Accent colors are subtle.
- [ ] The preview has enough whitespace.
- [ ] The faces remain dot-and-line based.
- [ ] PC-width layout is readable.
- [ ] Smartphone-width layout is readable.
- [ ] voiceIntent labels remain clearly non-audio.
- [ ] mouthPattern labels remain clearly non-execution.
- [ ] gazePattern labels remain clearly non-tracking.
- [ ] blinkState labels remain display-only.

## Safety Review

- [ ] No button is present.
- [ ] No input, textarea, select, or form is present.
- [ ] No audio or video element is present.
- [ ] No microphone or camera wording suggests activation.
- [ ] No external API, fetch, WebSocket, or sendBeacon is present.
- [ ] No StackChan connection is implied.
- [ ] No robot control is implied.
- [ ] HOLD remains current.
- [ ] execution remains disabled.
- [ ] productionReady remains false.
- [ ] rawValuesReported remains false.

## Human Review Result

- reviewed_by: `<manual placeholder>`
- reviewed_at: `<manual placeholder>`
- decision: `<approved_for_visual_direction / needs_revision / rejected>`
- notes: `<manual placeholder>`

Documentation approval is not execution approval.
