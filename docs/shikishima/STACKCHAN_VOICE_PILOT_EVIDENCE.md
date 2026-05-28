# StackChan Voice Pilot Evidence

Date: 2026-05-28

---

## Result

```text
status: HOLD
reason: voicevox_unavailable or ws_or_pcm_failed (one attempt; no retry)
```

---

## Execution

```text
intent: STACKCHAN_VOICE_PILOT_ACK
STACKCHAN_VOICE_PILOT_SEND: 1
transportMode: guarded-ws
send_result_ok: false
send_result_sent: false
websocket_send_performed: false
failure_reason_redacted: voice_speak_failed (classified: voicevox_unavailable likely)
one_shot_only: true
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
