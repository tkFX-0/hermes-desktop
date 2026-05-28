# StackChan Voice Pilot Evidence

Date: 2026-05-28

---

## Result

```text
status: PASS_WITH_CAVEAT
reason: guarded one-shot voice send ok; human audible confirmation pending
prior_attempts: HOLD (voicevox_unavailable, ws_or_pcm_failed)
```

---

## Execution (latest attempt — goal G2 retry)

```text
preflight_jst_at_attempt: 2026-05-28 (within active window)
intent: STACKCHAN_VOICE_PILOT_ACK
STACKCHAN_VOICE_PILOT_SEND: 1
transportMode: guarded-ws
env_local_loaded: true
send_result_ok: true
send_result_sent: true
websocket_send_performed: true
failure_reason_redacted: none
voicevox_readiness: PASS
one_shot_only: true
second_send_attempted: false
retry_loop: false
```

---

## Human observation (pending)

```text
voice_human_visual: pending
voice_audible: unknown
expected_phrase_matched: unknown
unexpected_behavior_visible: false
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
