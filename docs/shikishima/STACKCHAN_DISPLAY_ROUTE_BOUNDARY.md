# StackChan Display Route Boundary

Date: 2026-05-28
Companion: `STACKCHAN_DISPLAY_ROUTE_DESIGN.md`

---

## Purpose

Define what may cross the display-only boundary vs what must never cross it.

---

## Display-only Allowed Data

| Field | Type | Notes |
|-------|------|-------|
| display intent | `StackChanDisplayIntent` enum | Single intent per pilot GO |
| label | short string | From preview contract |
| face mood | `StackChanDisplayFaceMood` | Mapped to fixed device face_mode table |
| message | short string | On-screen or log redacted summary only |
| safety flags | all false for active control | Must match `StackChanDisplaySafety` |
| pilot metadata | time window active, human present | Enum only in evidence |
| result enums | PASS / HOLD / STOP | Evidence only |

---

## Forbidden Data (Must Not Enter Route or Evidence)

```text
Wi-Fi SSID
Wi-Fi password
IP address
MAC address
device ID
control token
private URL
firmware binary
motion command payload
dance command
servo angle commands
voice / TTS text (except redacted “voice_sent: false”)
PCM / WAV audio
mic stream
camera JPEG
Discord payload
Obsidian vault content
raw stack trace with hostnames
```

---

## Display-only Must Not

```text
start autonomous loop
enable execution
set productionReady true
send Discord
write firmware / erase / serial flash
move servo (dance)
play voice or stream audio
read mic or camera
open inbound STT/event server for pilot
retry automatically outside GO window
chain face + voice + dance in one pilot
expose unguarded stackchanFaceLocal to UI or autonomy zone
record raw network configuration in docs or evidence
```

---

## Allowed Side Effects (Future Implementation, Guarded)

| Effect | Condition |
|--------|-----------|
| Single WebSocket `face_mode` JSON | One-shot; after readiness PASS; within GO window |
| Optional LED preset `hold` / `pass` / `stop` | Only if sub-GO explicitly allows; no `dance` preset |
| Connection probe | Read-only status check only; not part of display send |

---

## Boundary vs Active Control

| Concern | Display-only route | Active control (HOLD) |
|---------|-------------------|------------------------|
| Input | Display intent enum | Natural language, motion scripts, pet mode |
| Output | Face (+ optional status LED) | Voice, dance, touch, firmware |
| Registry effect | `device_display` | `device_audio`, `device_motion`, firmware |
| Human GO | `stackchan_display_go` + pilot retry GO | Separate connection / motion / firmware GOs |
| Evidence | Redacted pilot evidence | Separate evidence per effect class |

---

## Unknown / Invalid Input

```text
Unknown display intent → HOLD preview (contract) → do not send to device
Readiness not ready → do not send
Outside time window → do not send
Second send in same GO → reject (one-shot)
```

---

## Route Guard (Implemented)

```text
evaluateStackChanDisplayRoute — pure shared; no device I/O
READY_FOR_FUTURE_SEND ≠ device contacted
actualDisplaySendPerformed: always false in route result
```

## Invariants (Unchanged)

```text
productionReady: false
execution: disabled
StackChan_connection_command: HOLD (unless separate connection GO)
Active_control: HOLD
Actual_display_send: HOLD
```
