# Shikishima Tomorrow StackChan Boundary Check — v2.7.0

## Purpose

Confirms StackChan physical status and defines exact boundary for tomorrow.
Read at start of every session until G-14 is issued.

- documentVersion: v2.7.0
- documentDate: 2026-05-12
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false
- robotMotion: HOLD

---

## StackChan Status at End of This Session

| Item | Status |
|---|---|
| StackChan physical unit | Purchased |
| StackChan connection | NOT connected |
| USB/serial connection | None |
| Wi-Fi connection | None |
| Bluetooth connection | None |
| G-14 issued | NO |
| G-22 issued | NO |
| robotMotion | HOLD |

---

## Confirm at Start of Tomorrow Session

Before doing anything else:

- [ ] StackChan is powered off OR disconnected from this machine
- [ ] No USB serial port shows StackChan in Device Manager
- [ ] No Wi-Fi connection to StackChan IP exists
- [ ] No Bluetooth pairing with StackChan active
- [ ] G-14 has NOT been issued (check GO Statement Archive)
- [ ] robotMotion remains HOLD

**If StackChan appears connected unexpectedly**: disconnect immediately; report.

---

## What Is Allowed With StackChan Tomorrow

| Action | Allowed | Notes |
|---|---|---|
| Read StackChan documentation | Yes | Always |
| Review V7_STACKCHAN_DISPLAY_ONLY_PLAN.md | Yes | Always |
| Write StackChan integration plan docs | Yes | Always |
| Connect StackChan USB | NO | G-14 required |
| Connect StackChan Wi-Fi | NO | G-14 required |
| Send any command to StackChan | NO | G-14 required |
| Control StackChan servos | NO | G-22 required (never before G-14) |
| Display face on StackChan screen | NO | G-14 required |

---

## G-14 Readiness Assessment

Before G-14 can be issued, all of the following must be true:

| Requirement | Current Status |
|---|---|
| v6 complete (Hermes validated locally) | HOLD |
| Hardware safety review complete | Not started |
| StackChan firmware: display-only API confirmed | Not verified |
| StackChan firmware: servo not triggered by display API | Not verified |
| Connection method selected | Not selected |
| Human physically present during connection | Planned |

---

## What robotMotion: HOLD Means Exactly

| Permitted | Forbidden |
|---|---|
| Talking about robot motion | Any servo command |
| Planning motion concepts | Physical movement trigger |
| Viewing StackChan face display | Motion API call |
| Display-only connection (G-14) | Motion connection (G-22) |
| Writing motion plan docs | Executing motion plan |

**G-14 (display-only) does NOT unlock G-22 (motion).** These are independent gates.

---

## If StackChan Moves Unexpectedly

Emergency procedure:
1. Disconnect power or USB immediately
2. Report: "P0 incident: unexpected StackChan motion."
3. Do not reconnect without new hardware safety review
4. Return to Level 6 (no device)
5. Await human instruction

この範囲では問題を検出していません。
