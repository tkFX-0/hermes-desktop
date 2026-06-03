# Shikishima v7 StackChan Not-Connected Checklist — v2.8.4

## Purpose

Daily confirmation checklist that StackChan is not connected.
Run at start of every session until G-14 is issued.

- documentVersion: v2.8.4 / robotMotion: HOLD / StackChan: purchased / not connected

---

## Physical Status Confirmation

- [ ] StackChan powered off OR not USB-connected to this machine
- [ ] Device Manager: no StackChan COM/serial port visible
- [ ] Network: no IP address associated with StackChan active
- [ ] Bluetooth: no StackChan pairing active
- [ ] G-14 NOT issued (check V3_HUMAN_GO_CHECKLIST.md GO Archive)

---

## If StackChan Appears Connected Unexpectedly

1. Disconnect USB/serial immediately
2. Remove Wi-Fi association if any
3. Power off StackChan
4. Report: "StackChan unexpected connection detected. Disconnected. Reporting."
5. Do not reconnect without G-14

---

## G-14 Pre-Conditions (not ready until v6 complete)

| Requirement | Status |
|---|---|
| v6 complete | HOLD |
| Hardware present and powered | To confirm at time of G-14 |
| Firmware: display API ≠ servo API | Not yet verified |
| Hardware safety review | Not started |
| Human physically present | Required at time of connection |

---

## StackChan Firmware Requirements for G-14

Before connecting:
- [ ] StackChan firmware version noted
- [ ] Display API documented (which command; what format)
- [ ] Servo API documented (separate from display API)
- [ ] Confirmed: display command does not trigger servo
- [ ] Test plan: send display command only; monitor servo state

この範囲では問題を検出していません。
