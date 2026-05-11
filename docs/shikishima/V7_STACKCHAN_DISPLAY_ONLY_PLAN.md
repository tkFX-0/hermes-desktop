# Shikishima v7 StackChan Display-Only Plan — v2.5.0

## Purpose

Documents the plan for connecting StackChan in display-only mode.
This is planning-only. No connection occurs without G-14.

- documentVersion: v2.5.0
- documentDate: 2026-05-12
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false
- robotMotion: HOLD

**StackChan status: purchased — NOT connected.**
**G-14 has NOT been issued.**

---

## StackChan Overview

StackChan is a small robot platform by Shinya Ishikawa (Stack-chan project).
It has:
- A small LCD display (face display target)
- Servo motors (robotMotion — HOLD throughout v7)
- Wi-Fi connectivity (requires separate GO)
- USB serial port (requires separate GO)

**In v7 scope**: display only — expression rendering on LCD screen.
**NOT in v7 scope**: servo control, motion, sound, Wi-Fi API calls.

---

## Display-Only Mode Definition

Display-only for StackChan means:

| Allowed | Forbidden |
|---|---|
| Send face expression image/command to LCD | Send any servo command |
| Update expression display | Control motion/tilt/pan |
| Change expression colors/shapes | Use microphone |
| Show HOLD/disabled labels | Use speaker |
| Static animation (display timing only) | Connect to external API |

**Expression display API ≠ motion API.** This must be verified in StackChan firmware before G-14.

---

## StackChan Connection Methods (future, after G-14)

| Method | Type | Requires |
|---|---|---|
| USB serial | Wired | G-14; port confirmed |
| Wi-Fi HTTP | Network | G-14; local network only; no external |
| Bluetooth | Wireless | G-14; local only |

Connection method to be confirmed at time of G-14 issuance.

---

## G-14 Preconditions

Before issuing G-14:

- [ ] StackChan hardware physically present and powered
- [ ] StackChan firmware confirmed: display-only API available
- [ ] StackChan firmware confirmed: servo commands NOT triggered by display API
- [ ] Hardware safety review: confirm no unintended motion from display data
- [ ] Connection method selected (USB/Wi-Fi/Bluetooth)
- [ ] No external API involved (local-only connection)
- [ ] Human physically present during connection test

---

## Expression-to-StackChan Mapping (concept)

| expressionId | StackChan display concept |
|---|---|
| `neutral` | Neutral face pattern on LCD |
| `thinking` | Thinking face pattern |
| `pleased` | Pleased face pattern |
| `hold` | HOLD label on LCD |
| `disabled` | Dim pattern with disabled label |

Exact mapping to StackChan face format (M5Stack face library) to be defined after G-14.

---

## Android / Smartphone Display (separate from StackChan)

Displaying the face terminal on a smartphone is a separate integration:

- Method: Local web server serving face HTML page
- Access: Smartphone on same local Wi-Fi
- QR code: Displayed in app for easy URL access
- No external network involved
- No personal data transmitted
- Requires: v5 complete (dev run stable); separate device GO

This is NOT part of G-14. It requires its own GO.

---

## robotMotion Boundary (critical)

**robotMotion = HOLD at ALL times in v7.**

Display-only connection does NOT unlock motion in any way:

| G-14 issued | robotMotion |
|---|---|
| Yes | Still HOLD |
| Yes + display working | Still HOLD |
| Yes + expressions working | Still HOLD |

robotMotion can only be changed by G-22, which is deferred to v9+.

---

## Hardware Incident Response for StackChan

If StackChan moves unexpectedly during display-only test:

1. **STOP immediately** — disconnect USB/Wi-Fi/Bluetooth
2. Power off StackChan
3. Report: "P0 incident: unexpected motion during display-only test."
4. Do NOT reconnect without new hardware safety review and new G-14 issuance
5. Return to Level 6 (no device connection)

この範囲では問題を検出していません。
