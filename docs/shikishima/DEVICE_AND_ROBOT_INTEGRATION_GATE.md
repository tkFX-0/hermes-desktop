# Shikishima Device and Robot Integration Gate — v2.2.0

## Purpose

Defines discrete gates for every device and robot integration action.
Each integration target has its own gate. No integration carries over from another.
All device integration requires explicit human GO and hardware safety review.

- documentVersion: v2.2.0
- documentDate: 2026-05-12
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false
- robotMotion: HOLD

---

## Device Integration Gate Summary

| Device | Action | Gate | Stage | Current |
|---|---|---|---|---|
| Face terminal | Display only | Docs allowed | v7 | HOLD |
| Android / smartphone | Display only | Docs + separate GO | v7 | HOLD |
| StackChan | Display-only connection | G-14 | v7 | HOLD |
| StackChan | Expression-only (no motion) | G-14 confirmed | v7 | HOLD |
| StackChan | Motion / physical control | G-22 | v9+ | HOLD |
| Voice I/O | Audio output (TTS) | G-15 | v8 | HOLD |
| Voice I/O | Audio input (STT) | G-15 + G-16 | v8 | HOLD |
| Camera | Vision / image capture | G-16 | v8+ | HOLD |
| Microphone | Audio capture | G-16 | v8+ | HOLD |
| robotMotion | Any physical robot motion | G-22 | v9+ | HOLD |

---

## Face Terminal

**What**: Display-only face animation output to a terminal, browser, or embedded display.

| Action | Allowed | GO required |
|---|---|---|
| Face terminal UI code | Yes | No |
| Face terminal docs | Yes | No |
| Display face in local app | Yes (v5+) | G-20 (dev run) |
| Display face on Android/smartphone | Plan only | Device GO |
| Display face via StackChan display | G-14 | G-14 |

**Forbidden**: Sending motion commands to any device via face terminal. Face display ≠ robot control.

---

## Android / Smartphone Display

**What**: Displaying face UI on a smartphone screen (web app or native).

| Action | Allowed | GO required |
|---|---|---|
| Android display plan | Yes (docs) | No |
| Smartphone web URL plan | Yes (docs) | No |
| QR code display | Yes (docs) | No |
| Actual smartphone connection | Separate GO | Device GO |
| Sending data to smartphone | Separate GO | Network + device GO |

**Notes**: Smartphone display is considered display-only. No personal data may transit without privacy review.

---

## StackChan: Display-only Connection (G-14)

**What**: Connecting StackChan hardware for face display purposes only.

**GO condition (G-14)**:
- Hardware physically present and confirmed powered
- Hardware safety review complete (confirm no motion from display data)
- StackChan firmware confirmed: display-only mode available
- No motion command in any data path reviewed
- Explicit GO: "GO G-14: Approve StackChan display-only connection."

**What is allowed at G-14**:
- Face display on StackChan screen
- Expression color changes
- Static face image rendering

**What remains HOLD at G-14**:
- Any servo/motor command
- Any motion pattern
- robotMotion — stays HOLD throughout v7

---

## StackChan: Expression-only (no motion)

**What**: Changing face expressions (colors, features) without any physical movement.

- This is included in G-14 scope — no additional gate required.
- Expression changes may not indirectly trigger servos.
- Confirm with StackChan firmware that expression API ≠ motion API.

---

## StackChan: Motion / Physical Control (G-22)

**What**: Controlling StackChan servos or physical motion.

**GO condition (G-22)**:
- G-14 complete (display-only verified)
- v9 complete (controlled pilot readiness)
- Hardware safety review specifically for motion (separate from display review)
- Motion command API reviewed and scoped
- Emergency stop confirmed available
- Human monitor present during any motion test
- Explicit scoped GO: "GO G-22: Approve StackChan motion. Scope: [specified]."

**robotMotion remains HOLD until G-22 is issued.**

---

## Voice I/O (G-15)

**What**: Audio output (text-to-speech) or audio input (speech-to-text).

**GO condition (G-15)**:
- v8 stage: voice I/O concept plan complete
- Audio safety review: no unintended speaker output
- Scope: local-only output only (no external TTS API unless separately approved)
- Output content reviewed for privacy (no personal data in TTS)
- Explicit GO: "GO G-15: Approve voice I/O. Scope: [output/input/both]."

**Microphone input requires separate G-16.**

---

## Camera / Microphone (G-16)

**What**: Capturing audio or video.

**GO condition (G-16)**:
- v8 stage: concept plan complete
- Privacy review: no personal data captured without consent mechanism
- Storage policy: where does captured data go? (local-only unless approved)
- No cloud upload without separate GO
- Explicit GO: "GO G-16: Approve [camera/microphone]. Scope: [specified]."

---

## robotMotion Gate Summary

| Level | robotMotion Status |
|---|---|
| Level 0–7 | HOLD (display-only does NOT enable motion) |
| Level 8 (pilot) | HOLD unless G-22 issued |
| Level 9 (production) | HOLD unless G-22 issued |
| G-22 issued | Enabled for specified scope only |

**robotMotion = HOLD is the default. It requires explicit G-22 to change.**

---

## Device Integration STOP Conditions

| Condition | Action |
|---|---|
| Device receives unexpected command | STOP; disconnect; report |
| Motion occurs when display-only expected | STOP; hardware safe state; report |
| Audio plays unexpectedly | STOP; mute; report |
| Camera captures without consent mechanism | STOP; revoke access; report |
| Personal data observed in any stream | STOP; redact; report |
| Hardware malfunction | STOP; safe state; human review |

この範囲では問題を検出していません。
