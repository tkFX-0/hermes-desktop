# Shikishima v7 Device Display-Only Readiness Pack — v2.8.4

## Purpose

Complete readiness for v7 display-only device integration.
StackChan NOT connected. G-14 not issued.

- documentVersion: v2.8.4 / decision: HOLD / execution: disabled / productionReady: false / robotMotion: HOLD

---

## v7 Goal

Face terminal display on StackChan LCD (display-only). No servo. No audio. No motion.

## Entry Conditions

- [ ] v6 complete (Hermes confirmed locally)
- [ ] StackChan hardware physically present and powered
- [ ] Hardware safety review: display API ≠ servo API confirmed in firmware
- [ ] Human GO for v7 (G-14)

## Display-Only Scope

| Allowed | Forbidden |
|---|---|
| Expression rendering on LCD | Any servo command |
| Color/shape changes on display | Physical motion |
| Static face patterns | Audio output |
| HOLD/disabled labels on display | Camera input |
| Timer-based expression updates | External API call |

## StackChan Current Status

```
StackChan: purchased — NOT connected
G-14: not issued
robotMotion: HOLD
USB/serial: not connected
Wi-Fi: not connected
Bluetooth: not connected
```

## v7 Exit Conditions

- [ ] Face display confirmed on StackChan LCD
- [ ] No servo motion occurred during display test
- [ ] No audio emitted by StackChan
- [ ] Expression rendering stable
- [ ] V8 Readiness Package created
- [ ] Human GO for v8

## What G-14 Unlocks / Does NOT Unlock

| G-14 UNLOCKS | G-14 does NOT unlock |
|---|---|
| Display-only connection | Servo/motion (G-22) |
| Expression color/shape on LCD | Voice output (G-15) |
| Face pattern rendering | Audio capture (G-16) |
| Static animation timing | Robot control |

この範囲では問題を検出していません。
