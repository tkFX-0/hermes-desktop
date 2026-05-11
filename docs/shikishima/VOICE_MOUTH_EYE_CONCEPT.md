# Voice / Mouth-Flap / Eye-Gaze Concept

## Purpose

This document defines the v0.7.0 design concept for connecting a future voice
presence, mouth-flap states, and eye-gaze states to the minimal dot-line face
system.

This is documentation and concept design only. It does not play audio, record
audio, use a microphone, call an external API, move a robot, or implement
runtime behavior.

It does not approve audio playback, recording, microphone use, external API
use, StackChan control, robot motion, or execution.

## Concept Layers

| Layer | Meaning | Current status |
| --- | --- | --- |
| voice concept | tone and presence language for a future speaking state | design_only |
| mouth-flap concept | small mouth state changes during future speaking display | design_only |
| eye-gaze concept | small gaze and blink changes during future face display | design_only |
| signal protocol | redacted non-execution display labels | concept_only |
| terminal connection | future display-only surfaces | not_approved_for_execution |

## Voice Presence Rules

- Voice is a future concept, not a playback system.
- No audio file is created.
- No speech synthesis is wired.
- No microphone or recording is used.
- No external voice API is connected.
- No user emotion is inferred.
- Voice labels can only describe display intent, such as calm, quiet, focused,
  or proposing.

## Mouth and Eye Coupling

Future UI may pair voice intent with simple display states:

- calm voice intent -> small mouth movement and centered eyes.
- explaining voice intent -> small/mid mouth loop and gentle gaze.
- safety voice intent -> minimal mouth and fixed eyes.
- planning voice intent -> brighter mouth and upward gaze.
- logging voice intent -> quiet mouth and side/down gaze.

These are display planning notes only.

## Required Current Status

- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false
- audioPlaybackApprovalStatus: not_approved
- microphoneApprovalStatus: not_approved
- robotMotionApprovalStatus: not_approved
