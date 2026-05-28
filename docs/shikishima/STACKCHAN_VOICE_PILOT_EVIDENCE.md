# StackChan Voice Pilot Evidence

Date: 2026-05-28

---

## Result

```text
status: HOLD
reason: voicevox_unavailable or ws_or_pcm_failed (one attempt; no retry)
```

---

## Execution (latest attempt — goal G2)

```text
intent: STACKCHAN_VOICE_PILOT_ACK
STACKCHAN_VOICE_PILOT_SEND: 1
transportMode: guarded-ws
send_result_ok: false
send_result_sent: false
websocket_send_performed: false
failure_reason_redacted: ws_or_pcm_failed
voicevox_readiness_at_check: PASS
one_shot_only: true
second_send_attempted: false
retry_loop: false
```

---

## VOICEVOX readiness (2026-05-28)

```text
readiness_check: PASS
evidence: STACKCHAN_VOICEVOX_READINESS_CHECK_EVIDENCE.md
voice_pilot_retry: not authorized until separate time-window GO
```

## Next

```text
/goalmacro shikishima.stackchan-voice-one-shot-pilot-retry (new time window GO only)
```

---

## Safety

```text
motion_command_sent: false
free_form_text: false
productionReady: false
execution: disabled
rawValuesReported: false
```
