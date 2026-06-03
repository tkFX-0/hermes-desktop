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
- [ ] Expression variation labels remain display-only.
- [ ] No expression reads as real-time status.
- [ ] No expression reads as connection status.
- [ ] No expression reads as robot control preview.
- [ ] No expression reads as GO approval.
- [ ] No expression reads as productionReady.
- [ ] Each card clearly says display-only.
- [ ] Each card clearly says no execution.
- [ ] Each card clearly says no device connection.

## PC-Width Review

- [ ] Cards scan as visual review items, not control panels.
- [ ] Labels do not look like connection status.
- [ ] Status text does not imply readiness to run.
- [ ] Whitespace keeps the faces small and quiet.
- [ ] The page still reads as documentation/static UI.

## Smartphone-Width Review

- [ ] Cards stack cleanly.
- [ ] Face glyphs do not crowd labels.
- [ ] No label resembles a tappable command.
- [ ] No line suggests audio, camera, device, or robot activation.
- [ ] HOLD / disabled status remains visible enough for review.

## Safety Review

- [ ] No button is present.
- [ ] No input, textarea, select, or form is present.
- [ ] No audio or video element is present.
- [ ] No microphone or camera wording suggests activation.
- [ ] No external API, fetch, WebSocket, or sendBeacon is present.
- [ ] No StackChan connection is implied.
- [ ] No robot control is implied.
- [ ] No speaker test is implied.
- [ ] No device connection status is shown.
- [ ] No label says ready, connected, running, playing, recording, or testing.
- [ ] HOLD remains current.
- [ ] execution remains disabled.
- [ ] productionReady remains false.
- [ ] rawValuesReported remains false.

## Misread Review

- [ ] `listening` reads as conversational posture only, not microphone input.
- [ ] `listening` does not imply recording, speech detection, or audio standby.
- [ ] `thinking` reads as a static thinking expression only, not live reasoning.
- [ ] `thinking` does not imply active processing, streaming inference, or
      runtime state.
- [ ] `holding` reads as a safety HOLD display concept only, not a pause button.
- [ ] `holding` does not imply stop control or execution gate operation.
- [ ] `rejected` reads as a safety decision label only, not a crash or failure.
- [ ] `rejected` does not imply an automated rejection engine.
- [ ] `review_ready` reads as documentation review ready only.
- [ ] `review_ready` does not imply GO-ready, execution-ready, device-ready, or
      production-ready.
- [ ] `completed_static_only` reads as docs/static-only completion only.
- [ ] `completed_static_only` does not imply productionReady, runtime
      completion, deployment completion, or operation approval.
- [ ] Every expression still reads as not a runtime status.
- [ ] Every expression still reads as not a device signal.
- [ ] Every expression still reads as not a GO indicator.
- [ ] Every expression still reads as not production readiness.

## Human Review Result

- reviewed_by: `<manual placeholder>`
- reviewed_at: `<manual placeholder>`
- decision: `<approved_for_visual_direction / needs_revision / rejected>`
- notes: `<manual placeholder>`

Documentation approval is not execution approval.
