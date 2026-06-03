# StackChan Voice Silent Debug — 2026-05-28

## Human observation

```text
voice_after_real_device_go: silent
transport_result: ok
acceptance: HOLD
```

## Confirmed

```text
PC wired LAN + StackChan Wi-Fi: OK if same router/LAN
connected: true
voicevoxReady: true
tcpPort8080: true
tokenPresent: true
authProbe: accepted_or_no_error
VOICEVOX synthesized audio: non-silent / strong peak
```

## Interpretation

The current failure is no longer the LAN/IP issue and is not a local VOICEVOX
silence issue. The remaining likely layer is:

```text
PC sends PCM -> firmware accepts/queues PCM -> M5.Speaker.playRaw actually plays
```

Before this fix, the PC side treated a WebSocket send as success even if the
device returned an error frame such as `auth_required`, `audio_blocked`, or
`pcm_too_large`.

## PC-side fix

- `scripts/shikishima-stackchan.mjs`
  - Reads device WebSocket error frames after JSON commands.
  - Fails the pilot if the device returns a rejection.
  - Applies pilot volume floor via `STACKCHAN_VOICEVOX_VOLUME`.
  - Strips optional quotes from `.env.local` values.
- `scripts/shikishima-voice-pilot-once.mjs`
  - Sets pilot volume floor to `1.6` unless already configured.
- `src/main/stackchan-voice-route/stackchan-voice-production-speak.ts`
  - Same device-error watcher for guarded voice path.
  - Adds `STACKCHAN_VOICEVOX_VOLUME` / `VOICEVOX_VOLUME` support.
- `src/main/stackchan-local-service.ts`
  - Routes `stackchanSayLocal` through the production voice path.

## Firmware design fix (requires flash)

`docs/firmware/shikishima_cores3/src/shikishima_cores3.ino` now includes:

```text
audio_test command: plays a short 880Hz tone
audio.state armed: firmware armed PCM upload
audio.state queued: PCM samples queued after state=idle
audio.state play_start: playRaw requested
audio.state play_done: speaker playback completed
```

This is required to distinguish:

```text
speaker hardware muted/broken
PCM was never accepted
PCM accepted but playRaw did not produce audible sound
```

## Attempt after PC fix (2026-05-28, human 許可GO)

```text
preflight: connected=true, voicevoxReady=true, tcpPort8080=true
phrase: よろしく。更新後のテストです。
transport: ok=true, blocked=null
device_rejection: none reported by PC watcher
human_audible: PASS (operator; two plays on first updated send)
follow_up: PASS on second 許可GO send; milestone skip added for future one-shots
```

## Next safe action

Do not loop retries automatically.

1. Run the updated one-shot only after a new human `許可GO`.
2. If still silent and no device rejection is reported, flash the updated
   firmware and run `audio_test` before another PCM voice test.
3. Human reports one of:
   - `audible_clear`
   - `still_faint`
   - `silent`

## Safety

```text
productionReady: false
execution: disabled
rawValuesReported: false
voice_acceptance: HOLD
```
