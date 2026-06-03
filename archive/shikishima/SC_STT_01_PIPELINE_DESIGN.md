# SC-STT-01 STT Pipeline Design

status: DESIGN_COMPLETE
date: 2026-05-24

---

## Overview

StackChan マイク音声をリアルタイムでテキスト化し、Discordおよび音声返答に繋げるパイプライン。

```
StackChan mic
    ↓ WiFi POST (16kHz PCM)
PC:8765/audio (shikishima-stt.mjs HTTP server)
    ↓
WAV変換 → tempファイル
    ↓
WSL Ubuntu / faster-whisper (base model, cpu, int8)
    ↓ テキスト
shikishima-bot.mjs handleMessage()
    ↓ Groq/Claude 返答
VOICEVOX → PCM → WebSocket → StackChan 発話
```

---

## Server Side (already implemented in shikishima-stt.mjs)

### Endpoints

| Path | Method | Content | Action |
|---|---|---|---|
| `/audio` | POST | raw 16kHz PCM (≥1000 bytes) | STT transcription |
| `/event` | POST | JSON `{type:"pat", mode:string}` | Pat event relay |
| `/camera` | POST | raw JPEG/PNG bytes | Vision relay |
| `/ping` | GET | — | Health check |

### Runtime checks (shikishima-bot.mjs startup)

```javascript
const whisperReady = await checkWhisperInstalled();
// checkWhisperInstalled() runs:
// wsl -d Ubuntu -- bash --login -c "python3 -c 'import faster_whisper; ...'"
```

If `whisperReady === false`: STT server is NOT started. Log: `[STT] faster-whisper未インストール — マイク入力は無効`

---

## WSL Setup Required (one-time, human-executed)

```bash
# WSL Ubuntu でのセットアップ
wsl -d Ubuntu

# faster-whisper インストール
pip install faster-whisper

# 動作確認
python3 -c "from faster_whisper import WhisperModel; print('OK')"
```

### Model selection

| Model | Speed | Accuracy | VRAM |
|---|---|---|---|
| `base` | fastest | ★★★ | CPU only |
| `small` | fast | ★★★★ | CPU only |
| `medium` | slower | ★★★★★ | CPU/GPU |

Current config: `WHISPER_MODEL = "base"` in `shikishima-stt.mjs:13`
Change if accuracy improvement needed.

---

## Firmware Side Requirements

StackChan firmware (shikishima_cores3.ino) must:

1. Detect IMU pat gesture (already implemented)
2. POST to `http://<PC_IP>:8765/event` with `{"type":"pat","mode":"<mode>"}`
   - modes: nod / shake / tilt / smile / flee
3. For voice input (future): POST raw 16kHz PCM to `/audio`

### PC IP detection

The firmware uses a hardcoded PC IP or mDNS.
Current: firmware sends to `http://192.168.1.X:8765` (verify in .ino network config).

STT server binds to `0.0.0.0:8765` — accepts all local network connections.

---

## Integration Test

Pre-conditions:
- WSL Ubuntu running
- `pip install faster-whisper` done
- StackChan powered on + WiFi connected
- VOICEVOX running at localhost:50021
- shikishima-bot.mjs running

Test flow:
1. Check `/ping` → `{"ok":true,"running":true}`
2. Send test PAT event: `curl -X POST http://localhost:8765/event -d '{"type":"pat","mode":"nod"}'`
3. Observe: bot logs `[Pat] nod → "ふふ、嬉しい"` + StackChan speaks
4. Verify STT with audio: record 5s Japanese, POST PCM to `/audio`, observe transcript in logs

---

## Status Gate

| Item | Status |
|---|---|
| Server code | DONE (shikishima-stt.mjs) |
| Bot integration | DONE (shikishima-bot.mjs:1429-1463) |
| Pat event handler | DONE |
| WSL faster-whisper | PENDING (human setup required) |
| Firmware /audio POST | PENDING (verify in .ino) |
| Production token | N/A (local network only) |

この範囲では問題を検出していません
