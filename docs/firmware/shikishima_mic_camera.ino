/**
 * shikishima_mic_camera.ino
 * SC-2 + SC-3: マイク録音送信 + カメラキャプチャ送信
 *
 * pet-fw v0.1.0 の追加タスクとして動作
 * M5Stack CoreS3 (ESP32-S3)
 *
 * ─── 使い方 ───────────────────────────────────────────────────────────────────
 * 1. Arduino IDE で M5Stack CoreS3 ボードを選択
 * 2. 必要ライブラリ:
 *    - M5Unified (Board Manager: M5Stack)
 *    - ArduinoJson
 * 3. PC_IP を自分のPCのIPに変更 (<PC_HOST>)
 * 4. pet-fw の setup() の最後にこのファイルの setupShikishima() を追加
 * 5. pet-fw の loop() に loopShikishima() を追加
 * 6. コンパイル → CoreS3 へフラッシュ
 *
 * ─── PCのIPアドレス確認 ───────────────────────────────────────────────────────
 * PowerShell: (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -like "192.168.*" }).IPAddress
 * → 例: <PC_HOST>
 */

#include <M5Unified.h>
#include <HTTPClient.h>
#include <WiFiClient.h>

// ─── 設定 ─────────────────────────────────────────────────────────────────────
const char* PC_IP         = "0.0.0.0";        // Replace locally before flashing.
const int   STT_PORT      = 8765;
const int   CAM_PORT      = 8765;
const int   SAMPLE_RATE   = 16000;
const int   RECORD_SEC    = 3;               // 録音秒数
const int   MIC_THRESHOLD = 800;            // マイク音量閾値 (自動録音用)
const bool  ENABLE_MIC_RECORDING = false;   // one-shot GO まで既定OFF
const bool  ENABLE_CAMERA_CAPTURE = false;  // one-shot GO まで既定OFF
const bool  ENABLE_BUTTON_TRIGGERS = false; // 誤操作防止。明示GOビルドのみ true
const size_t MAX_CAMERA_BYTES = 200 * 1024; // 想定外の大きい画像送信を拒否

// ─── 状態変数 ──────────────────────────────────────────────────────────────────
static bool  s_micStreaming   = false;
static bool  s_cameraEnabled  = false;
static unsigned long s_lastCamSend = 0;
static const int CAM_INTERVAL_MS = 5000;  // カメラ送信間隔 (5秒)

// ─── SC-3: マイク録音 → PC送信 ───────────────────────────────────────────────

bool recordAndSendAudio() {
  if (!ENABLE_MIC_RECORDING) {
    Serial.println("[Mic] disabled by safety gate");
    return false;
  }

  const int BUFFER_SAMPLES = SAMPLE_RATE * RECORD_SEC;
  const int BUFFER_BYTES   = BUFFER_SAMPLES * 2;  // 16bit

  int16_t* buf = (int16_t*)ps_malloc(BUFFER_BYTES);
  if (!buf) {
    Serial.println("[Mic] メモリ不足");
    return false;
  }

  Serial.println("[Mic] 録音開始...");
  M5.Mic.config().sample_rate = SAMPLE_RATE;
  M5.Mic.config().stereo      = false;
  M5.Mic.begin();

  size_t readBytes = 0;
  M5.Mic.record(buf, BUFFER_SAMPLES, SAMPLE_RATE);
  M5.Mic.end();

  Serial.println("[Mic] 録音完了 → PC送信中...");

  HTTPClient http;
  String url = String("http://") + PC_IP + ":" + STT_PORT + "/audio";
  http.begin(url);
  http.addHeader("Content-Type", "application/octet-stream");
  http.addHeader("X-Sample-Rate", String(SAMPLE_RATE));
  http.addHeader("X-Channels", "1");
  http.addHeader("X-Bits-Per-Sample", "16");

  int code = http.POST((uint8_t*)buf, BUFFER_BYTES);
  http.end();
  free(buf);

  if (code == 200) {
    Serial.println("[Mic] 送信成功 → しきしまが処理中");
    return true;
  } else {
    Serial.printf("[Mic] 送信失敗: HTTP %d\n", code);
    return false;
  }
}

// ─── SC-2: カメラキャプチャ → PC送信 ─────────────────────────────────────────

bool captureAndSendCamera() {
  if (!ENABLE_CAMERA_CAPTURE) {
    Serial.println("[Camera] disabled by safety gate");
    return false;
  }

  if (!M5.Camera.isEnabled()) {
    Serial.println("[Camera] 初期化中...");
    if (!M5.Camera.begin()) {
      Serial.println("[Camera] 初期化失敗");
      return false;
    }
    s_cameraEnabled = true;
  }

  // JPEGキャプチャ
  camera_fb_t* fb = M5.Camera.get();
  if (!fb) {
    Serial.println("[Camera] キャプチャ失敗");
    return false;
  }
  if (fb->len > MAX_CAMERA_BYTES) {
    Serial.printf("[Camera] frame too large: %u bytes\n", (unsigned)fb->len);
    M5.Camera.free(fb);
    return false;
  }

  Serial.printf("[Camera] キャプチャ: %d bytes → PC送信中\n", fb->len);

  HTTPClient http;
  String url = String("http://") + PC_IP + ":" + CAM_PORT + "/camera";
  http.begin(url);
  http.addHeader("Content-Type", "image/jpeg");
  http.addHeader("X-Width",  String(fb->width));
  http.addHeader("X-Height", String(fb->height));

  int code = http.POST(fb->buf, fb->len);
  M5.Camera.free(fb);
  http.end();

  if (code == 200) {
    Serial.println("[Camera] 送信成功");
    return true;
  } else {
    Serial.printf("[Camera] 送信失敗: HTTP %d\n", code);
    return false;
  }
}

// ─── ボタン制御 ───────────────────────────────────────────────────────────────
// CoreS3: タッチパネルの左/中/右ゾーン
//   左ゾーン長押し  → マイク録音開始
//   中ゾーンタップ  → カメラ撮影送信

// ─── 公開API (pet-fwから呼び出す) ─────────────────────────────────────────────

void setupShikishima() {
  Serial.println("[Shikishima] SC-2/SC-3 初期化完了");
  s_micStreaming  = false;
  s_cameraEnabled = false;
}

void loopShikishima() {
  M5.update();

  // ── マイク録音 (Aボタン長押し or タッチ左ゾーン長押し) ──
  if (ENABLE_BUTTON_TRIGGERS && M5.BtnA.pressedFor(500)) {
    M5.Speaker.tone(1000, 100);  // ビープ音で録音開始を通知
    recordAndSendAudio();
  }

  // ── カメラ撮影 (Bボタンタップ or タッチ中ゾーン) ──
  if (ENABLE_BUTTON_TRIGGERS && M5.BtnB.wasPressed()) {
    captureAndSendCamera();
  }

  // ── 自動マイク (音量閾値超えで録音開始) ──
  // ※ CPU負荷が高いので必要時のみ有効化
  // if (M5.Mic.isEnabled()) {
  //   int16_t sample;
  //   if (M5.Mic.record(&sample, 1, SAMPLE_RATE)) {
  //     if (abs(sample) > MIC_THRESHOLD && !s_micStreaming) {
  //       s_micStreaming = true;
  //       recordAndSendAudio();
  //       s_micStreaming = false;
  //     }
  //   }
  // }

  // ── 定期カメラ送信 (5秒ごと) ──
  // ※ 無効化中。有効化する場合は以下のコメントを解除
  // if (millis() - s_lastCamSend > CAM_INTERVAL_MS) {
  //   s_lastCamSend = millis();
  //   captureAndSendCamera();
  // }
}
