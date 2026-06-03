# SC-FACE-04 320x240 Face Asset Spec

date: 2026-05-21
status: SPEC
decision: HOLD
execution: disabled
productionReady: false
rawValuesReported: false

This document defines the face asset specification for future Shikishima face
display work on StackChan / CoreS3.

This is a design/specification document only. It does not approve build, flash,
Burn, Erase, Firmware Exporter Start, custom firmware write, physical motion,
voice, mic, camera, or Shikishima automatic control.

---

## Purpose

Prepare a safe face asset target before any firmware or display implementation
work begins.

The goal is to make future assets small-LCD readable and recoverable:

- define the 320 x 240 canvas
- define safe areas
- define expression states
- define design direction
- define implementation candidates
- prevent copyrighted or over-detailed designs

---

## Canvas

```text
canvas_width: 320
canvas_height: 240
center_x: 160
center_y: 120
safe_area_width: 300
safe_area_height: 220
safe_area_left: 10
safe_area_top: 10
safe_area_right: 310
safe_area_bottom: 230
```

Assumption:

- CoreS3 display target is treated as 320 x 240 until confirmed by a future
  no-write build/source review.
- No raw device ID, raw serial value, local path, Wi-Fi value, or token should
  be stored in face asset metadata.

---

## Background Policy

Preferred:

- transparent background when firmware/display pipeline supports it
- otherwise solid dark navy or very soft blue-black
- no busy detail behind the eyes or mouth
- avoid UI text inside the face asset unless specifically required

Forbidden:

- raw network/device values
- QR codes containing live secrets
- personal identifiers
- high-detail photo-like backgrounds that collapse on a small LCD

---

## Expression States

Initial required expression set:

| State | Visual Direction | Shikishima Meaning |
|---|---|---|
| normal | calm eyes, tiny mouth | connected / idle |
| smile | soft cheeks, simple smile | friendly ready |
| thinking | eyes slightly up or dot bubble | planning / review |
| hold | cautious eyes, small HOLD cue if readable | human GO required |
| pass | bright eyes, small check cue | evidence passed, not productionReady |
| stop | clear stop eyes or red cue | stop condition / unsafe |
| sleepy | closed eyes | offline / waiting |
| working | focused eyes, small tool/light cue | local work in progress |

All expressions are display-only. No expression implies approval to execute,
push, run firmware, move hardware, or enable production.

---

## Design Direction

```text
theme: cute ghost / spirit-like
accent: blue glow
face: readable eyes
mouth: simple and thick enough for small LCD
silhouette: soft and rounded
style: original Shikishima design, not copied from existing characters
```

Small-LCD rules:

- eyes must be readable at reduced size
- mouth must not depend on thin lines
- status symbols should be optional, large, and sparse
- avoid complex line art
- test at 100%, 75%, and 50% preview scale before any firmware work

---

## Asset Options

### Option A - SVG-like Simple Face

Description:

- draw simple expressions from primitives
- later convert to firmware-compatible rendering if needed

Good for:

- early iteration
- avoiding large sprite assets
- preserving original design flexibility

Risk:

- exact StackChan rendering support may differ

### Option B - PNG Sprite

Description:

- prepare one PNG per expression or a sprite sheet
- use 320 x 240 canvas with consistent safe area

Good for:

- direct visual control
- predictable artist workflow

Risk:

- firmware memory/format constraints unknown
- requires source/build confirmation before use

### Option C - m5stack-avatar Adjustment

Description:

- map Shikishima states to existing avatar primitives or expression settings

Good for:

- likely smallest firmware change
- may preserve official library behavior

Risk:

- may not support full custom ghost styling

### Option D - Custom Firmware Display

Description:

- custom render path or asset embedding in firmware

Good for:

- full control

Risk:

- highest write/recovery risk
- requires SC-RESTORE-01 and SC-FACE-03 GO before any build/write

---

## Copyright / Originality Policy

The face asset must be original to Shikishima.

Forbidden:

- copying existing copyrighted character faces
- tracing third-party pixel sprites
- using generated image output as final firmware asset without separate asset
  review
- overly detailed faces that become unreadable on 320 x 240

Allowed:

- original cute ghost/spirit direction
- simple expression primitives
- internally generated drafts treated as reference only until approved

---

## Acceptance Before Next Step

Before any display test GO:

```text
asset_canvas_confirmed: true
restore_plan_available: true
factory_restore_path_known: true
custom_firmware_need_reviewed: true
burn_erase_write_still_hold: true
motion_voice_camera_still_hold: true
```

