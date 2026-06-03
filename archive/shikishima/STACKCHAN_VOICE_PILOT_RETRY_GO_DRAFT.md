# StackChan Voice Pilot Retry — GO Draft (not approved)

Date: 2026-05-28
Status: **DRAFT** — do not run until Human GO + VOICEVOX up

---

## Prerequisites

```text
- VOICEVOX readiness: PASS (see STACKCHAN_VOICEVOX_READINESS_CHECK_EVIDENCE.md)
- VOICEVOX responding at localhost:50021 (redacted health check only)
- STACKCHAN_HOST configured (.env.local; values not in evidence)
- Display-only ACCEPTED unchanged (fb86fee)
- Motion visual confirmation recorded (recommended before voice retry)
```

---

## Example Time Window (fill at GO time)

```text
START: ____-__-__ __:__ JST
END:   ____-__-__ __:__ JST
```

---

## Authorized (one shot only)

```text
intent: STACKCHAN_VOICE_PILOT_ACK
STACKCHAN_VOICE_PILOT_SEND=1
transportMode: guarded-ws
actualDeviceSendEnabled: true
one_shot_only: true
```

---

## Forbidden

```text
motion / dance / display resend / firmware / mic / camera
retry loop / second send
git push (unless separate push GO)
raw SSID/IP/token in evidence
```

---

## Prior Attempt

```text
status: HOLD
reason: voicevox_unavailable (redacted)
evidence: STACKCHAN_VOICE_PILOT_EVIDENCE.md
```
