# StackChan GitHub Skill Intake — 2026-05-31

## 0. Purpose

GitHub上のStackChan関連実装・設計を調査し、しきしま内で再利用しやすい「StackChan専用Skill」として取り込む。

この文書は証跡であり、外部コードの取り込み、ファームウェアアップロード、StackChan接続、音声送信、サーボ動作、STT、カメラ利用、外部送信を承認しない。

## 1. Result

Created:

- `skills/shikishima-stackchan-specialist/SKILL.md`
- `.agents/skills/shikishima-stackchan-specialist/SKILL.md`

The skill is designed for:

- StackChan firmware review
- CoreS3 / M5Unified / M5Stack Avatar context
- VOICEVOX / PCM / WebSocket speech bridge review
- Discord read-aloud queue safety
- face/display/motion/touch/STT/camera route separation
- GitHub reference intake with citations
- secret-safe firmware work

## 2. GitHub References Reviewed

| Reference | What Was Absorbed | Local Use |
|---|---|---|
| [m5stack/StackChan](https://github.com/m5stack/StackChan) | Official modern StackChan resource split: firmware, remote, app, server; CoreS3 hardware context; reminder that motors must not be forced by hand when powered/controlled. | Treat official device functions as separate effect routes; keep motion/firmware routes gated. |
| [stack-chan/stack-chan](https://github.com/stack-chan/stack-chan) | Original Stack-chan architecture: face, expression, gaze, speech, servo, firmware, case, schematics. | Skill maps Shikishima work into display/audio/motion/firmware lanes. |
| [stack-chan/m5stack-avatar](https://github.com/stack-chan/m5stack-avatar) | Avatar face rendering, expression, lip sync, palette, movement/zoom/rotation patterns; PlatformIO/Arduino usage. | Use as design reference for face/expression/lip-sync work without copying code. |
| [robo8080/AI_StackChan2](https://github.com/robo8080/AI_StackChan2) | AI StackChan pattern using VOICEVOX and selectable STT; M5Unified/PlatformIO style. | Supports Shikishima's VOICEVOX + StackChan voice route and STT HOLD boundaries. |
| [ronron-gh/AI_StackChan_Ex](https://github.com/ronron-gh/AI_StackChan_Ex) | AI voice assistant expansion, application/mod switching, long-term voice-assistant direction. | Reference for future secretary/agent mode design, still behind gates. |
| [rt-net/stack-chan](https://github.com/rt-net/stack-chan) | RT variant, hardware/servo update references including DYNAMIXEL-oriented direction. | Reference only for motion safety and hardware variant awareness. |

## 3. Safety Boundary

The new skill hard-codes these rules:

- Do not read or report `credentials.h`, `.env*`, tokens, local raw config, Wi-Fi credentials, API keys, or Discord secrets.
- Do not upload firmware without separate StackChan Firmware GO.
- Do not connect to StackChan without separate StackChan Connection GO.
- Do not send StackChan voice/audio without separate scoped voice GO.
- Do not trigger servo/motion without separate scoped motion GO.
- Do not enable STT/microphone or camera/monitoring without separate scoped GO.
- Do not treat display-only, audio, motion, touch, STT, camera, firmware upload, or OTA as one combined approval.

## 4. Shikishima Local Mapping

The skill points future workers to these local files:

- `scripts/shikishima-stackchan.mjs`
- `scripts/lib/stackchan-discord-voice.mjs`
- `scripts/lib/stackchan-operator-notify.mjs`
- `scripts/shikishima-codex-response-complete.mjs`
- `scripts/shikishima-cursor-response-complete.mjs`
- `docs/firmware/shikishima_cores3/src/shikishima_cores3.ino`
- `docs/firmware/shikishima_cores3/platformio.ini`
- `docs/shikishima/STACKCHAN_*`

Sensitive path:

- `docs/firmware/shikishima_cores3/credentials.h`

## 5. Not Performed

- No source behavior changes.
- No firmware upload.
- No StackChan connection.
- No VOICEVOX or audio playback.
- No servo/motion.
- No camera/STT.
- No Discord send.
- No Obsidian write.
- No dependency changes.
- No git push.

## 6. Next Use

When the user asks for StackChan firmware, voice, Discord read-aloud, sensor, motion, LED, face, or CoreS3 work, invoke `shikishima-stackchan-specialist` first, then proceed within the scoped Human GO.
