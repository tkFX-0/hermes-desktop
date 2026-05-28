# StackChan Voice Pilot Evidence

Date: 2026-05-28

---

## Result

```text
status: HOLD
reason: send path reported ok; human reports mouth motion without audible speech
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

## Human observation (reported)

```text
voice_human_visual: HOLD
mouth_motion_visible: true
voice_audible: false
expected_phrase_matched: false
unexpected_behavior_visible: false
operator_note_redacted: mouth moving; no audible output heard
pilot_stopped_cleanly: true
```

## Diagnosis (redacted, no retry)

```text
likely_class: pcm_or_audio_path_not_audible
ws_send_reported_ok: true
voicevox_readiness: PASS
next: audio path debug GO (read-only checks + one-shot retry with new window only)
forbidden: automatic retry; second send without GO
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
