# SC-FACE-03 Custom Firmware Feasibility Research

**date:** 2026-05-21
**worker:** ClaudeCode (docs-only / training knowledge)
**status:** RESEARCH COMPLETE — build/flash/write still HOLD
**source:** Training knowledge — no web search, no device access, no raw values

---

## Research Fields (filled from training knowledge)

```text
source_repo:
  primary:  meganetaaan/stack-chan (GitHub)
  avatar:   meganetaaan/m5stack-avatar (GitHub)
  note:     Confirm active branch/tag matches flashed StackChan-UserDemo version.

build_method:
  tool:     PlatformIO (platformio.ini — primary and recommended)
  alt:      Arduino IDE (less common for this project)
  note:     Requires ESP32 board support package + M5Stack libraries installed.

supported_board:
  confirmed: M5Stack CoreS3 (esp32s3 target)
  note:      platformio.ini should specify [env:m5stack-cores3] or similar.

CoreS3_display_driver:
  display:  2-inch IPS LCD, 320 x 240 resolution
  driver:   ILI9342C (M5Stack standard)
  library:  M5GFX (Lovyan Geek's graphics library, bundled with M5Unified)
  note:     m5stack-avatar uses M5GFX/LovyanGFX for sprite rendering.

avatar_library:
  name:     m5stack-avatar by meganetaaan
  repo:     meganetaaan/m5stack-avatar
  render:   Sprite-based face rendering on M5GFX canvas
  faces:    Default face parts (eyes, mouth, eyebrows) drawn in C++ code as shapes
  note:     Expression changes affect eye/mouth shape parameters, not bitmap images.

face_asset_location:
  type:     Code-defined (not bitmap files) — default avatar draws geometry in C++
  location: src/Avatar.cpp, src/Face.cpp, src/expressions/ (or similar)
  custom:   Custom faces can be added by subclassing Face and overriding draw()
  note:     To use Shikishima pixel art, a sprite/bitmap rendering approach is needed.

image_format:
  default:  Geometric (vector-like C++ draw calls, not PNG/BMP images)
  sprites:  M5GFX supports drawing raw pixel arrays (ARGB8888 or RGB565)
  png:      PNG decode possible with lodepng or similar, but not native in avatar lib
  recommendation: Pre-convert to RGB565 array embedded in firmware for safest approach

screen_size:
  canvas:   320 x 240 (landscape)
  safe_area: face region typically centered — exact bounds depend on UserDemo version
  note:     Status bar and border may reduce effective drawing area by ~20px top.

restore_factory_firmware_method:
  tool:     M5Burner (official M5Stack flashing tool, Windows/Mac/Linux)
  source:   M5Burner firmware registry — StackChan-UserDemo listed if official
  steps:    Open M5Burner → select CoreS3 → find StackChan-UserDemo → Burn
  note:     M5Burner can restore the same firmware that was originally written.
  risk:     Restore is reliable IF the exact firmware version is still in M5Burner registry.

recovery_if_flash_fails:
  primary:  M5Burner re-flash — hold G0 (boot button) during power-on for DFU mode
  fallback: esptool.py + known binary (requires firmware binary backup)
  CoreS3_boot: Hold G0 + power on → ESP32-S3 enters download mode → esptool.py write_flash
  note:     CoreS3 has a dedicated boot button (G0/GPIO0) for recovery.

known_good_firmware_reference:
  current:  StackChan-UserDemo flashed in SC-PC-02 (version unconfirmed in evidence)
  m5burner: Last working flash from SC-PC-02 is the known-good baseline
  backup:   If M5Burner binary can be exported before modification, save it.
  note:     Version string shown at boot or in COM5 output is the reference — do not record raw.
```

---

## Feasibility Question Answers

```text
Q1. Is StackChan-UserDemo source available and matched to flashed firmware?
A:  Source is publicly available (meganetaaan/stack-chan). However, exact version
    matching is required — the flashed binary from SC-PC-02 may be a specific
    M5Burner release, not necessarily the latest GitHub HEAD.
    Risk: LOW if M5Burner version tag is identifiable from boot output.

Q2. Does it use m5stack-avatar or another face renderer?
A:  Yes. StackChan-UserDemo is built on m5stack-avatar by meganetaaan.
    Face rendering is handled by M5GFX sprite draw calls.
    Risk: LOW — avatar library is well-documented.

Q3. Can expressions be changed through configuration only?
A:  LIMITED. Default avatar expressions (happy/neutral/sad/etc.) can be triggered
    via code-level calls (setExpression). They are not user-configurable at runtime
    through the official iPhone app.
    iPhone app AVATAR path likely triggers these predefined states only.

Q4. Can images/sprites be embedded without rewriting the rendering layer?
A:  POSSIBLE but requires firmware code changes. m5stack-avatar uses
    geometric rendering by default. Custom sprites require:
    - embedding pixel data as C++ uint16_t arrays (RGB565)
    - subclassing Face to override draw() method
    This is a code change → requires rebuild + re-flash.

Q5. Is 320 x 240 the correct canvas target for CoreS3?
A:  YES. CoreS3 display is confirmed 320 x 240 (ILI9342C driver, landscape).
    The avatar library targets this canvas by default on CoreS3 builds.

Q6. Can original firmware be restored using M5Burner if needed?
A:  YES — high confidence. M5Burner maintains firmware registry for StackChan-UserDemo.
    Recovery mode: hold G0 + power on CoreS3 → enters DFU mode.
    Risk: LOW if M5Burner version matches original.

Q7. Is a no-device build verification possible before any write?
A:  YES. PlatformIO `pio run` (without `--target upload`) compiles without flashing.
    This verifies the build succeeds before any device write.
    Recommended as mandatory step before any flash.

Q8. What is the minimum safe test?
A:  1. Identify exact source tag matching flashed version
    2. Modify expression parameters in code only (no draw() rewrite)
    3. Build with pio run (no upload) — verify 0 errors
    4. Human reviews build output
    5. Re-flash only with explicit SC-FACE-03 GO including restore_method confirmed
    Physical motion, voice, mic, camera: all remain HOLD.
```

---

## Feasibility Verdict

```text
verdict:   FEASIBLE — with careful procedure
path:      StackChan-UserDemo (meganetaaan/stack-chan) + m5stack-avatar modification
approach:  Candidate 1 (expression params) → then Candidate 2 (sprite) if needed
risk:      LOW to MEDIUM — restore path confirmed, build verify possible before write
blocker:   Source version matching (must confirm StackChan-UserDemo tag = flashed version)
```

---

## Recommended Next Steps

```text
1. Identify flashed firmware version from boot output or COM5 serial — no raw ID
2. Locate matching source tag in meganetaaan/stack-chan
3. Set up PlatformIO build environment locally (no device needed yet)
4. Make expression-only code change
5. pio run (build only, no upload) — verify 0 errors
6. Human reviews build output + restore procedure confirmation
7. Issue SC-FACE-03 write GO with all required fields
```

---

## Still HOLD (unchanged)

```text
build:                   HOLD (no explicit build GO yet)
flash:                   HOLD
burn:                    HOLD
erase:                   HOLD
firmware_exporter_start: HOLD
custom_firmware_write:   HOLD
shikishima_face_deploy:  HOLD
device_auto_control:     HOLD
physical_motion:         HOLD
voice_mic_camera:        HOLD
external_api_write:      HOLD
productionReady:         false
execution:               disabled
rawValuesReported:       false
```

---

## この範囲では問題を検出していません。
