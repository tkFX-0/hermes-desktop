# StackChan Display Route Device Wiring Boundary

Date: 2026-05-28
Companion: `STACKCHAN_DISPLAY_ROUTE_DEVICE_WIRING_DESIGN.md`

---

## Purpose

Define what may cross the **device wiring** boundary when a future implementation GO is active.

Shared route guard (`evaluateStackChanDisplayRoute`) must PASS before any wiring send is attempted.

---

## Allowed Future Payload

| Field | Source | Notes |
|-------|--------|-------|
| display intent | `StackChanDisplayIntent` enum | Single intent per pilot GO |
| resolved label | `StackChanDisplayPreview.label` | Short string |
| face mood | `StackChanDisplayFaceMood` | Mapped to fixed `face_mode` only |
| short display message | `StackChanDisplayPreview.message` | Log/evidence redacted summary |
| safety flags | route + preview contracts | All active-control flags false |

Wire format (design): one WebSocket JSON message:

```json
{ "type": "face_mode", "value": "<allowlisted_face_mode>" }
```

No other message types in display-only pilot.

---

## Forbidden Payload

```text
Wi-Fi SSID
Wi-Fi password
IP address
MAC address
device ID
control token
private URL
servo angle
motion command
dance command
voice / TTS / PCM payload
mic stream
camera JPEG
firmware binary
state: speaking
led preset: dance
pet mode / touch behavior change
```

---

## Required Guard (Every Future Device Send)

| Guard | Enforced by |
|-------|-------------|
| Explicit Human GO | GO markdown + ledger |
| Active time window | pilot readiness + route request |
| Human present | readiness + route |
| Manual stop confirmed | readiness + route |
| StackChan screen visible | readiness |
| Approved display intent | preview + route |
| Route decision | `READY_FOR_FUTURE_SEND` |
| External action | `createExternalActionGuard` device_display |
| Evidence template | `STACKCHAN_DISPLAY_PILOT_EVIDENCE.md` |
| One-shot | adapter rejects second send in same GO |

---

## Adapter Must Not

```text
import or call stackchanSayLocal
import or call stackchanDanceLocal
import or call stackchanLedLocal with dance preset
start stackchan-stt-service or inbound event loop for pilot
read process.env for host/token into evidence
expose send function on IPC without separate GO
auto-retry on failure
chain face update with voice or motion
```

---

## Transport Boundary

| Transport | Display pilot | Notes |
|-----------|:-------------:|-------|
| Mock (no network) | Default in tests | `websocketSend: false` in evidence |
| Guarded WebSocket | Only with pilot retry GO | One connection open → one message → close |
| HTTP status poll | Optional read-only preflight | Not part of display send |

---

## Failure Handling

```text
Connection failure → HOLD (no retry loop)
Unexpected inbound motion/voice → STOP pilot; manual stop
Guard rejection → BLOCKED; no send
```

---

## Foundation Layer (Implemented)

```text
evaluateStackChanDisplayDeviceRoute — main process; no I/O
transportMode: disabled | mock only
READY_FOR_PILOT_GO ≠ device contacted
```

## Invariants

```text
productionReady: false
execution: disabled
Active_control: HOLD
Actual_display_pilot: HOLD until pilot retry GO
```
