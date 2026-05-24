# StackChan マイク → STT パイプライン (Option B) — Firmware計画

**date:** 2026-05-22
**status:** PC側実装済み / Firmware側: 要追加実装

---

## 全体パイプライン (完成形)

```
StackChan CoreS3 マイク
    ↓ 録音 (16kHz / 16bit / mono PCM)
    ↓ WiFi POST → http://192.168.1.xxx:8765/audio
しきしま (PC側 stackchan-stt-service.ts)
    ↓ WAV変換
    ↓ Whisper STT (WSL: faster-whisper)
    ↓ dispatchToAgent() — 5エージェントルーティング
    ↓ Grok / ClaudeCode / etc.
    ↓ stackchanSayLocal() — VOICEVOX → PCM → WebSocket
StackChan が発話
```

---

## PC側 (実装済み)

| 機能 | ファイル | 状態 |
|---|---|---|
| HTTPサーバー (PORT 8765) | stackchan-stt-service.ts | 実装済み |
| WAVヘッダー追加 | pcmToWav() | 実装済み |
| Whisper STT (WSL) | runWhisper() | 実装済み |
| AI→発話パイプライン | index.ts startSttServer() | 実装済み |

---

## Whisper インストール (未実施)

WSL Ubuntu で実行:
```bash
pip install faster-whisper
# または
pip install openai-whisper
```

確認:
```bash
python3 -c "import faster_whisper; print('OK')"
```

モデル選択 (WHISPER_MODEL定数で変更可):
| model | 速度 | 精度 | VRAM |
|---|---|---|---|
| tiny | 最速 | 低 | ~1GB |
| base | 高速 | 中 | ~1GB |
| small | 中速 | 高 | ~2GB |
| medium | 低速 | 最高 | ~5GB |

現在設定: `base` (CPUで動作可能)

---

## Firmware側 (要実装)

### アプローチA: pet-fw拡張 (推奨)

pet-fw v0.1.0のWebSocketサーバーに録音+送信機能を追加:

```cpp
// M5Stack CoreS3 追加コード概要
#include <M5Unified.h>
#include <HTTPClient.h>

// ボタン長押しで録音開始
void recordAndSend() {
  const int SAMPLE_RATE = 16000;
  const int RECORD_SEC = 3;
  const int BUFFER_SIZE = SAMPLE_RATE * RECORD_SEC * 2; // 16bit

  int16_t* buf = (int16_t*)malloc(BUFFER_SIZE);
  M5.Mic.record(buf, BUFFER_SIZE / 2, SAMPLE_RATE);

  // POSTでPCへ送信
  HTTPClient http;
  http.begin("http://192.168.1.xxx:8765/audio");
  http.addHeader("Content-Type", "application/octet-stream");
  http.POST((uint8_t*)buf, BUFFER_SIZE);
  http.end();
  free(buf);
}
```

### アプローチB: 別スケッチ

pet-fwと並行して動作する別Taskとして実装。
pet-fwのWebSocketは継続、マイク録音は別コア。

### トリガー方法

| 方法 | 難易度 | 説明 |
|---|---|---|
| ボタン押し | 低 | Aボタン長押しで録音 |
| ウェイクワード | 高 | ESP32-S3上の簡易VoiceComm |
| 常時送信 | 中 | 音量閾値で自動開始 |

推奨: まずはボタン押しから。

---

## PCのIPアドレス確認

StackChan側で接続するPCのIPを確認:
```powershell
# Windows
ipconfig
# → 192.168.1.xxx の Wi-Fi アドレス
```

STTサーバーはすべてのIF (0.0.0.0:8765) でLISTEN中。
