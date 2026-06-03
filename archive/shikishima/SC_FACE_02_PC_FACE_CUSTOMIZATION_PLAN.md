# SC-FACE-02 PC Face Customization Plan

date: 2026-05-20
status: PLAN
decision: HOLD
execution: disabled
productionReady: false
rawValuesReported: false

This document defines the PC-side investigation plan for putting a Shikishima
face on StackChan / CoreS3.

This is a planning document only. It does not approve custom firmware build,
additional Burn, Erase, Firmware Exporter Start, physical motion, voice, mic,
camera, or Shikishima automatic control.

---

## Purpose

Investigate and design the safest PC-side route for Shikishima face
customization after SC-FACE-01 found the iPhone app path to be partial only.

Target areas:

- StackChan-UserDemo
- m5stack-avatar
- StackChan firmware face rendering
- CoreS3 display constraints
- future Shikishima expression assets

---

## Display Canvas Assumption

Initial display target:

```text
canvas: 320 x 240
orientation: landscape
safe_area: confirm in SC-FACE-02 implementation research
raw_device_id: do not record
serial_id: do not record
```

Safe-area planning should reserve space for:

- face center
- expression changes
- status label if official firmware provides one
- no raw device state
- no local-only path

---

## Expression States

The first Shikishima expression set should cover:

```text
normal
smile
thinking
hold
pass
stop
sleepy
working
```

Mapping draft:

| State | Meaning | Safety Boundary |
|---|---|---|
| normal | idle / connected | display-only |
| smile | friendly ready | no GO approval implied |
| thinking | planning / review | no execution |
| hold | human decision required | Level 5 remains HOLD |
| pass | evidence check passed | not productionReady |
| stop | stop condition or unsafe | no automation |
| sleepy | offline / waiting | no runtime |
| working | local work in progress | no external action |

---

## Implementation Candidates

### Candidate 1 - Adjust Existing Avatar Expressions

Use the existing avatar/face expression mechanism if StackChan-UserDemo exposes
it in source form.

Pros:

- likely closest to official behavior
- may preserve Factory Firmware assumptions
- less custom rendering risk

Risks:

- source/build path may be unclear
- expression assets may be code-defined

Gate:

```text
SC-FACE-02 research only
```

### Candidate 2 - Image Sprite Display

Prepare 320 x 240 or smaller face sprites and render them through the existing
display layer.

Pros:

- direct visual control
- easier to match Shikishima design

Risks:

- may require custom firmware or build
- asset format and memory constraints unknown

Gate:

```text
SC-FACE-ASSET future GO
```

### Candidate 3 - Custom Firmware

Modify or build a firmware image that includes the Shikishima face assets.

Pros:

- full control if build path is known

Risks:

- highest recovery risk
- requires firmware restore procedure before any write
- cannot proceed without explicit human GO

Gate:

```text
SC-FACE-03 custom firmware feasibility
```

### Candidate 4 - StackChan-UserDemo Modification

Locate the exact StackChan-UserDemo source or configuration path and determine
whether face assets can be replaced without a full custom firmware workflow.

Pros:

- may match the currently installed firmware

Risks:

- source may not match flashed binary
- still likely requires build/write to test

Gate:

```text
SC-FACE-02 research, then SC-FACE-03 if write is required
```

---

## Still HOLD

```text
custom_firmware_build: HOLD
custom_firmware_write: HOLD
additional_burn: HOLD
erase: HOLD
firmware_exporter_start: HOLD
shikishima_face_actual_deployment: HOLD
shikishima_auto_control: HOLD
physical_motion: HOLD
voice_mic_camera: HOLD
```

---

## Next Gate

Proceed to:

```text
SC-FACE-03 Custom Firmware Feasibility Gate
```

Only after this plan is reviewed and a separate human GO defines the research
scope. Any build, flash, Burn, Erase, or live device write remains excluded.

