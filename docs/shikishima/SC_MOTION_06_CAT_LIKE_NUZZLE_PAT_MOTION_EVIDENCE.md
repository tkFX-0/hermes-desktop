# SC-MOTION-06 Cat-Like Nuzzle Pat Motion Evidence

date: 2026-05-25
result: PASS_CANDIDATE
scope: StackChan firmware motion

## Purpose

Implement the cat-like nuzzle motion requested for normal pat/touch operation.

Target behavior:

- light pat: happy face, green LED, lean into the hand, small rub, slow release
- too much pat: ganbaru face, red LED, firmer "enough / back to work" shake

## Implementation Summary

Changed firmware:

- `docs/firmware/shikishima_cores3/src/shikishima_cores3.ino`

Implemented in:

- `triggerHeadPatV2()`

Behavior:

- normal pat now generates a dynamic nuzzle sequence from `leanX` / `leanY`
- nuzzle moves toward the detected hand direction
- nuzzle briefly holds close
- nuzzle adds a small left-right rub
- nuzzle slowly returns to center
- over-pat behavior remains separate and stronger
- over-pat threshold remains `5` pats within `6000ms`
- normal pat LED uses `pass` / green
- over-pat LED uses `stop` / red

## Checks Run

```text
python -m platformio run -e cores3_noflash
```

Result:

```text
PASS
```

```text
python -m platformio run -e cores3_noflash -t upload --upload-port COM5
```

Result:

```text
PASS
```

Post-flash connection check:

```text
connected: true
voicevoxReady: true
led_off: ok
```

## Human Visual / Touch Check

Still required:

```text
1. gently pat once
2. confirm green LED
3. confirm soft nuzzle toward hand
4. confirm small rub rather than jitter
5. pat repeatedly five times within six seconds
6. confirm red LED
7. confirm ganbaru / stronger over-pat reaction
8. confirm return to center
```

## Safety

- burn_performed: firmware upload only under user GO
- erase_performed: false
- firmware_exporter_start_performed: false
- custom_firmware_written: current project firmware only
- stackchan_controlled: firmware flash and local status check only
- motion_dance_used: false during verification
- camera_monitoring_started: false
- microphone_used: false
- voice_loop_started: false
- external_api_write: false
- productionReady: false
- execution: disabled
- rawValuesReported: false
- git_push_performed: false

## Result Candidate

```text
SC-MOTION-06:
  cat_like_nuzzle_motion: PASS_CANDIDATE
  firmware_build: PASS
  firmware_upload: PASS
  connection_after_upload: PASS
  human_visual_touch_check: REQUIRED
```
