# Mouth-Flap Animation Concept

## Purpose

This document describes a future mouth-flap concept for a smartphone face UI.
It is design-only and does not implement lip sync, audio wiring, speech
synthesis, or runtime animation.

## Mouth States

| State | Shape | Intended use |
| --- | --- | --- |
| mouth_closed | short line or tiny curve | idle/listening |
| mouth_small | tiny open line | calm speaking |
| mouth_mid | small open shape | explaining |
| mouth_open | wider but still simple | emphasis, used sparingly |
| mouth_round_o | small round o | surprise or thinking aloud |
| mouth_smile_talk | soft smile variant | friendly speech |
| mouth_flat | flat line | しずめ HOLD / safety check |

## Speaking Loop Concepts

Calm loop:

- mouth_closed
- mouth_small
- mouth_mid
- mouth_small
- mouth_closed

Explaining loop:

- mouth_closed
- mouth_round_o
- mouth_mid
- mouth_round_o
- mouth_closed

## Agent-Specific Notes

| Agent | Mouth movement style |
| --- | --- |
| しきしま / しき | soft and balanced while organizing |
| しずめ | minimal, controlled, low amplitude |
| つむぎ / つむ | slightly bouncy while explaining work |
| はじめ | a little brighter when proposing a next step |
| しるべ | small and quiet, archival tone |

## Safety Boundary

This concept is not runtime lip sync. It does not create code, wire audio, use a
microphone, infer emotion, or send commands to a device.
