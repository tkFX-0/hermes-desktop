# Smartphone Face Display Plan

## Purpose

This plan describes a future smartphone display-only face surface for the
minimal dot-line agent faces.

It is not runtime implementation and does not enable microphone, camera,
automation, execution, or device control.

## Display Principles

- one active agent at a time.
- large whitespace.
- face-parts only.
- no face outline.
- no torso.
- no costume.
- no full-body or bust-up avatar.
- optional five-agent mini strip for context.
- tiny accent color only.

## Future Interaction Concept

Expression changes may be triggered only by approved UI state in a future
implementation. Examples:

- active agent changed.
- message is being displayed.
- safety state changed to HOLD.
- documentation review item selected.

This plan does not include autonomous behavior.

## v0.7.0 Voice / Mouth / Eye Concept

Future smartphone display planning may show:

- voiceIntent as a non-audio display label.
- mouthPattern as a small mouth-state sequence.
- gazePattern as a small eye-state sequence.
- blinkState as a display-only state.

This is not audio playback, recording, microphone use, camera use, face
recognition, external API use, or runtime implementation.

## Forbidden Until Separate Approval

- microphone automation.
- camera upload.
- face recognition.
- no face recognition.
- user emotion inference.
- autonomous expression control.
- robot or StackChan control.
- execution buttons.

## Review Status

- smartphoneFaceDisplayStatus: design_only
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false
