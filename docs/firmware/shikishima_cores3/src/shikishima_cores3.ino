/**
 * Shikishima CoreS3 Firmware v5
 *
 * 修正:
 *   - DVDちかちか → スプライトバックバッファで完全解消
 *   - 一定時間操作なし → DVDモード → さらに放置 → ZZZモード
 *
 * モード:
 *   DVD    — dvdモード.png が黒背景をバウンド (ちかちかなし)
 *   FACE   — 顔を全画面表示
 *   SPEAK  — ノーマル↔笑顔パクパク + 字幕オーバーレイ
 *   ZZZ    — zzz.png 全画面 (長時間放置)
 *   CAMERA — カメラ撮影→PC送信
 *
 * ボタン (画面下タッチ):
 *   A 左  3秒長押し → カメラON/OFF
 *   B 中  タップ    → 次の顔
 *   C 右  タップ    → DVD ↔ FACE
 *   ※ ZZZ中は任意タッチでFACEに復帰
 *
 * アイドル設定:
 *   IDLE_TO_DVD_MS  3分 → DVDモードへ
 *   IDLE_TO_ZZZ_MS  8分 → ZZZモードへ
 */

#include <M5Unified.h>
#include <WiFi.h>
#include <ArduinoOTA.h>
#include <WebSocketsServer.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include "esp_camera.h"
#include "faces_data.h"

// ─── 認証情報 — credentials.h (gitignored) から読み込む ────────────────────────
#if __has_include("credentials.h")
  #include "credentials.h"
  #define _WIFI_SSID     SC_WIFI_SSID
  #define _WIFI_PASSWORD SC_WIFI_PASSWORD
  #define _CONTROL_TOKEN SC_CONTROL_TOKEN
#else
  #define _WIFI_SSID     "YOUR_SSID"
  #define _WIFI_PASSWORD "YOUR_PASSWORD"
  #define _CONTROL_TOKEN "CHANGE_ME_BEFORE_FLASH"
#endif

// ─── 設定 ─────────────────────────────────────────────────────────────────────
const char* WIFI_SSID     = _WIFI_SSID;
const char* WIFI_PASSWORD = _WIFI_PASSWORD;
const char* PC_IP         = "0.0.0.0"; // Replace locally before flashing.
const int   PC_PORT       = 8765;
const int   WS_PORT       = 8080;

const char* CONTROL_TOKEN = _CONTROL_TOKEN;
const bool  REQUIRE_CONTROL_TOKEN = true;
const bool  ENABLE_OTA = false;
const bool  ENABLE_BLE_CONTROL = false;
const bool  ENABLE_CAMERA_SEND = false;
const bool  ENABLE_PC_EVENT_POST = true;
const bool  ENABLE_SERVO_CONTROL = true;
const bool  ENABLE_DANCE_CONTROL = true;
const bool  ENABLE_LED_CONTROL = true;
const bool  ENABLE_PCM_AUDIO = true;
const size_t MAX_WS_TEXT_BYTES = 512;
const size_t MAX_PCM_SAMPLES = 16000 * 12; // 12 seconds at 16kHz mono.
const uint32_t PCM_ARM_WINDOW_MS = 15000;
const uint32_t MIN_MOTION_INTERVAL_MS = 500;
const uint32_t MIN_DANCE_INTERVAL_MS = 5000;
const uint8_t LED_MAX_BRIGHTNESS = 64;

// LED driver enabled: SC-LED-01 one-shot test approved 2026-05-24
#define ENABLE_STACKCHAN_BSP_LED_DRIVER 1

const int W = 320, H = 240;

// DVDサイズ
const int DVD_W = 80, DVD_H = 54;

// アイドルタイマー
const unsigned long IDLE_TO_DVD_MS = 2UL * 60 * 1000;   // 2分
const unsigned long IDLE_TO_ZZZ_MS = 8UL * 60 * 1000;   // 8分

// ─── BLE設定 ──────────────────────────────────────────────────────────────────
#define BLE_DEVICE_NAME "StackChan-SC"
#define SVC_UUID  "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define PAN_UUID  "beb5483e-36e1-4688-b7f5-ea07361b26a8"
#define TILT_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a9"
#define CMD_UUID  "beb5483e-36e1-4688-b7f5-ea07361b26aa"

// ─── サーボ設定 ───────────────────────────────────────────────────────────────
// SCS0009 (Feetech フィードバックサーボ): シリアルバス UART 1Mbps 半二重
// TX=GPIO6, RX=GPIO7 / ID1=Pan(左右), ID2=Tilt(上下)
// 位置範囲: 0-1023 = 0-300°, 中央=512
#define SCS_TX_PIN        6
#define SCS_RX_PIN        7
#define SCS_BAUD          1000000
#define SCS_ID_PAN        1
#define SCS_ID_TILT       2
#define SCS_GOAL_POS_ADDR 0x2A   // Goal Position H/L レジスタ (ビッグエンディアン)
const int PAN_LIMIT = 90;    // ±90度
const int TILT_MAX  = 40;    // 上40度
const int TILT_MIN  = -30;   // 下30度

// ─── 型定義 ──────────────────────────────────────────────────────────────────
enum Mode { MODE_DVD, MODE_FACE, MODE_SPEAK, MODE_ZZZ, MODE_CAMERA };

// サーボシーケンスフレーム
struct SvFrame { int pan; int tilt; int ms; };

// ─── サーボ状態 ───────────────────────────────────────────────────────────────
int panTarget  = 0, panCur  = 0;
int tiltTarget = 0, tiltCur = 0;
unsigned long lastSvUpdate = 0;

// サーボシーケンスプレイヤー
const SvFrame* svSeq    = nullptr;
int            svLen    = 0;
int            svIdx    = 0;
unsigned long  svNext   = 0;
bool           svPlaying = false;

// ─── BLE状態 ─────────────────────────────────────────────────────────────────
bool           bleConnected = false;
BLEServer*     pBleServer   = nullptr;
BLECharacteristic* pPanChar  = nullptr;
BLECharacteristic* pTiltChar = nullptr;

// ─── サーボシーケンス定義 ─────────────────────────────────────────────────────
// spin: 左→右→左→中
static const SvFrame SEQ_SPIN[] = {
  {-85,  0, 350}, {85,  0, 500}, {-85, 0, 500}, {0, 0, 400}
};
// nod: 上→下→上→中
static const SvFrame SEQ_NOD[] = {
  {0, 38, 280}, {0,-15, 280}, {0, 38, 280}, {0, 0, 400}
};
// shake: 左右高速
static const SvFrame SEQ_SHAKE[] = {
  {-65, 0,180},{65, 0,180},{-65, 0,180},{65, 0,180},{0, 0,300}
};
// look_around: 四方を見回す
static const SvFrame SEQ_LOOK[] = {
  {-70,20,500},{70,20,500},{70,-20,500},{-70,-20,500},{0,0,500}
};
// dance: StackChan本来の16ステップ本格ダンス
static const SvFrame SEQ_DANCE[] = {
  // フェーズ1: 左右スウィング (リズム感)
  {-50, 15, 280}, { 50, 15, 280},
  {-50, -8, 260}, { 50, -8, 260},
  // フェーズ2: 見回し (生き生き感)
  {-70, 28, 240}, {  0, 28, 180},
  { 70, 28, 240}, {  0, 28, 180},
  // フェーズ3: 上下ボブ (ノリノリ)
  {-20, 35, 280}, { 20,-18, 240},
  {-20, 35, 280}, { 20,-18, 240},
  // フィナーレ: 大きなスウィープ→センター
  {-75, 18, 230}, { 75, 18, 230},
  {  0, 38, 350}, {  0,  0, 460}
};
// 撫でモード別サーボシーケンス (表示アニメと同時に独立再生)
// Mode 0: うなずき (Nod) — 上下リズミカル
static const SvFrame SV_PAT0_NOD[] = {
  {0, -5,100},{0, 33,180},{0, -5,100},{0, 33,180},
  {0, -5,100},{0, 33,180},{0,  0,360}
};
// Mode 1: 首振り照れ (Shake) — 左右照れ振り
static const SvFrame SV_PAT1_SHAKE[] = {
  {-55, 8,130},{55, 8,130},{-55, 8,130},{55, 8,130},
  {-30, 8,140},{30, 8,140},{  0, 0,320}
};
// Mode 2: 首かしげ甘え (Tilt) — 左に傾いてじっと
static const SvFrame SV_PAT2_TILT[] = {
  {-20, 8,120},{-38,18,240},{-40,20,420},{-22,10,280},{0, 0,380}
};
// Mode 3: 笑顔引きつき (Smile approach) — 上を見てキョロキョロ
static const SvFrame SV_PAT3_SMILE[] = {
  {0, 8,200},{0, 28,320},{-18,32,320},{18,32,320},{0,18,260},{0, 0,380}
};
// Mode 4: 逃げる (Flee) — 素早い大きな首振り
static const SvFrame SV_PAT4_FLEE[] = {
  {-72,-12, 85},{72,-12, 85},{-72,-12, 85},{72,-12, 85},
  {-45,-12, 90},{45,-12, 90},{  0,  0,300}
};
// モード別参照テーブル
static const SvFrame* const SV_PAT_SEQ[] = {
  SV_PAT0_NOD, SV_PAT1_SHAKE, SV_PAT2_TILT, SV_PAT3_SMILE, SV_PAT4_FLEE
};
static const int SV_PAT_LEN[] = {7, 7, 5, 6, 7};

// ─── 状態 ────────────────────────────────────────────────────────────────────
WebSocketsServer webSocket(WS_PORT);
M5Canvas canvas(&M5.Display);      // ← スプライトバックバッファ (ちかちか防止)
M5Canvas dvdSprite(&M5.Display);   // DVD画像プリレンダー (毎フレームJPEGデコード排除)
M5Canvas bubbleSpr;                // 吹き出し内テキスト用サブスプライト (テキストクリップ)

Mode   curMode    = MODE_DVD;
int    curFaceIdx = 0;
String subtitle   = "";
bool   camInited  = false;
bool   camOn      = false;

// パクパクアニメ
bool         isSpeaking = false;
int          pakuFrame  = 0;
unsigned long lastPaku   = 0;
const int     PAKU_MS   = 180;

// 吹き出し字幕スクロール
int           subScrollX     = 0;     // テキストのX位置 (0=左端から表示)
bool          subNeedsScroll = false;
unsigned long lastSubScroll  = 0;
const int     SUB_SCROLL_MS  = 35;
// 吹き出しのサイズ・位置
const int BX=14, BY=162, BW=292, BH=58, BUBR=14; // bubble rect
const int BSPR_W = BW-20;   // 内部テキストエリア幅
const int BSPR_H = BH-18;   // 内部テキストエリア高さ

// ─── 撫でモード (5種) ──────────────────────────────────────────────────────────
struct PatFrame { int faceKey; int dx; int dy; int ms; };
// faceKey: 0=normal 1=smile 2=happy 3=panic 4=pakuFrame
static const PatFrame PAT_NOD[][10] = {
  // 0: うなずき — 上下に大きく2回頷く
  {{2,0, 0,80},{2,0,-18,140},{2,0, 4,120},{2,0,-18,140},{2,0, 4,120},{2,0,0,180},{0,0,0,280}},
  // 1: 首振り照れ — 左右に大きく揺れる
  {{1,-26,0,110},{1,26,0,110},{1,-26,0,110},{1,26,0,110},{1,-14,0,130},{1,0,0,180},{0,0,0,220}},
  // 2: 首かしげ甘え — ゆっくり傾いてじっとする
  {{2,-8,-2,100},{2,-22,-6,200},{2,-22,-6,300},{2,-14,-3,200},{2,-6,-1,180},{0,0,0,250}},
  // 3: 笑顔引きつき — 表情がゆっくり変化しふわっと揺れる
  {{0,0,0,180},{1,0,-6,180},{2,0,-8,280},{2,0,0,240},{1,0,0,180},{0,0,0,280}},
  // 4: 逃げる — 大きく素早く揺れて焦り顔
  {{3,-32,0,70},{3,32,0,70},{3,-32,0,70},{3,32,0,70},{3,-18,0,90},{3,0,0,140},{0,0,0,250}},
};
static const int PAT_FRAME_COUNT[] = {7, 7, 6, 6, 7};
static const char* PAT_VOICE[] = {
  "nod", "shake", "tilt", "smile", "flee"
};

int  patMode       = -1;  // -1=なし  0〜4=モード
int  patStep       = 0;
int  patCycle      = 0;   // 次に使うモード番号
unsigned long lastPatStep = 0;

// 撫で方向検出 (「撫でられに来る」モーション用)
float leanX = 0, leanY = 0;   // IMU累積方向ベクトル
SvFrame leanInSeq[5];           // 動的生成するレーンインシーケンス
int normalIdx = 0, smileIdx = 0, pakuIdx = 0, dvdFaceIdx = 0, zzzIdx = 0;

// DVD
float dvdX = 30, dvdY = 20;
float dvdVX = 5.0f, dvdVY = 4.0f;
const uint32_t DVD_COLORS[] = {
  0xFF4444, 0x44FF44, 0x4444FF, 0xFFFF44, 0xFF44FF, 0x44FFFF, 0xFFAA44, 0xFFFFFF
};
int dvdColIdx = 0;
unsigned long lastDvdUpdate = 0;
bool dvdBounced = false;

// アイドルタイマー
unsigned long lastActivityMs = 0;
bool idleChecked = false;

// PCM — チャンクを全受信後に一括再生 (ノンブロッキング)
std::vector<int16_t> pcmBuf;
bool playReq     = false;
bool audioPlaying = false;
bool audioUploadArmed = false;
unsigned long audioUploadDeadlineMs = 0;
unsigned long lastMotionCommandMs = 0;
unsigned long lastDanceCommandMs = 0;
bool ledDriverReady = false;
HardwareSerial SCSSerial(1);  // UART1 — SCS0009 シリアルバスサーボ用

// タッチ
bool prevPress = false;
unsigned long touchStart   = 0;
unsigned long touchPressMs = 0;  // ゾーン問わずタッチ開始時刻
int  touchZone = -1;
int  touchX = 0, touchY = 0;
bool touchDone = false;

// ─── IMU 頭撫で検出 ────────────────────────────────────────────────────────────
float imuPrevX = 0, imuPrevY = 0;
int   imuPatCount   = 0;
unsigned long imuLastHitMs   = 0;
unsigned long imuLastCheckMs = 0;

// ─── リアクション状態 ─────────────────────────────────────────────────────────
bool  inReaction    = false;
unsigned long reactionEndMs = 0;

// ─── ダンス ────────────────────────────────────────────────────────────────────
bool  isDancing    = false;
int   danceStep    = 0;
unsigned long lastDanceMs = 0;
int   ganbaruIdx   = 0;

// ─── ユーティリティ ──────────────────────────────────────────────────────────
int faceByName(const char* n) {
  for (int i = 0; i < FACE_INDEX_COUNT; i++)
    if (strcmp(FACE_INDEX[i].name, n) == 0) return i;
  return 0;
}

int faceByMood(const String& m) {
  if (m == "happy"   || m.indexOf("撫") >= 0) return faceByName("撫でられてうれしい");
  if (m == "smile"   || m.indexOf("笑") >= 0) return faceByName("笑顔");
  if (m == "tongue"  || m.indexOf("あっ") >= 0) return faceByName("あっかんべー");
  if (m == "panic"   || m.indexOf("焦") >= 0) return faceByName("焦り");
  if (m == "ganbaru" || m.indexOf("頑") >= 0) return faceByName("頑張るぞ");
  if (m == "sleepy"  || m == "zzz") return faceByName("zzz");
  return faceByName("ノーマル");
}

void bumpActivity() { lastActivityMs = millis(); }

// ─── スプライトへの描画ヘルパー ─────────────────────────────────────────────

// 顔JPEGをスプライト全画面に描画
void canvasFull(int idx) {
  if (idx < 0 || idx >= FACE_INDEX_COUNT) return;
  canvas.drawJpg(FACE_INDEX[idx].data, *FACE_INDEX[idx].len, 0, 0, W, H);
}

// ─── 吹き出し字幕 ────────────────────────────────────────────────────────────
bool bubbleReady = false;
void initBubble() {
  bubbleSpr.createSprite(BSPR_W, BSPR_H);
  // 日本語対応フォント (ASCII + ひらがな・カタカナ・漢字)
  bubbleSpr.setFont(&fonts::lgfxJapanGothic_16);
  bubbleSpr.setTextSize(1);
  bubbleReady = true;
}

// ─── Breathingアニメ (待機中の生命感) ────────────────────────────────────────
float breathY    = 0;
float breathStep = 0.0f;
unsigned long lastBreath = 0;

void updateBreath() {
  // 発話中・リアクション中・ダンス中は停止
  if (curMode != MODE_FACE || isSpeaking || inReaction || isDancing || patMode >= 0) return;
  if (millis() - lastBreath < 80) return;
  lastBreath = millis();

  breathStep += 0.12f;
  int dy = (int)(4.5f * sinf(breathStep));  // ±4px でふわふわ

  canvas.fillSprite(TFT_BLACK);
  canvas.drawJpg(
    FACE_INDEX[curFaceIdx].data,
    *FACE_INDEX[curFaceIdx].len,
    0, dy, W, H
  );
  canvas.pushSprite(0, 0);
}

// 吹き出しシェル(枠・しっぽ)をcanvasに描画
void drawBubbleShell() {
  // 白塗り + 角丸枠
  canvas.fillRoundRect(BX, BY, BW, BH, BUBR, TFT_WHITE);
  canvas.drawRoundRect(BX, BY, BW, BH, BUBR, 0x444444);
  // しっぽ (上中央から顔へ伸びる三角)
  int tx = BX + BW/2;
  canvas.fillTriangle(tx-9,BY, tx+9,BY, tx,BY-16, TFT_WHITE);
  canvas.drawLine(tx-9, BY, tx, BY-16, 0x444444);
  canvas.drawLine(tx+9, BY, tx, BY-16, 0x444444);
}

// 吹き出し内テキストをサブスプライトで描画 (自動クリップ)
void canvasBubble(const String& text) {
  if (text.length() == 0) return;
  if (!bubbleReady) initBubble();

  drawBubbleShell();

  bubbleSpr.fillSprite(TFT_WHITE);
  bubbleSpr.setFont(&fonts::lgfxJapanGothic_16);
  bubbleSpr.setTextSize(1);
  bubbleSpr.setTextColor(TFT_BLACK, TFT_WHITE);

  int tw = bubbleSpr.textWidth(text);
  subNeedsScroll = (tw > BSPR_W - 4);
  int ty = (BSPR_H - 16) / 2;

  if (!subNeedsScroll) {
    bubbleSpr.setCursor((BSPR_W - tw) / 2, ty);
    bubbleSpr.print(text);
  } else {
    bubbleSpr.setCursor(subScrollX, ty);
    bubbleSpr.print(text);
  }
  bubbleSpr.pushSprite(&canvas, BX+10, BY+9);
}

// スクロール更新 (35msごと・吹き出しエリアのみ再描画)
void updateSubtitleScroll() {
  if (!isSpeaking || subtitle.length() == 0 || !subNeedsScroll) return;
  if (millis() - lastSubScroll < SUB_SCROLL_MS) return;
  lastSubScroll = millis();
  if (!bubbleReady) initBubble();

  int tw = bubbleSpr.textWidth(subtitle);
  subScrollX -= 2;
  if (subScrollX < -(tw + 10)) subScrollX = BSPR_W;  // 右端に折り返し

  // 吹き出しエリアだけ更新 (JPEG再デコード不要)
  drawBubbleShell();
  bubbleSpr.fillSprite(TFT_WHITE);
  bubbleSpr.setFont(&fonts::lgfxJapanGothic_16);
  bubbleSpr.setTextSize(1);
  bubbleSpr.setTextColor(TFT_BLACK, TFT_WHITE);
  bubbleSpr.setCursor(subScrollX, (BSPR_H - 16) / 2);
  bubbleSpr.print(subtitle);
  bubbleSpr.pushSprite(&canvas, BX+10, BY+9);
  canvas.pushSprite(0, 0);
}

// ─── 撫でアニメーション ───────────────────────────────────────────────────────
// faceKeyを実インデックスに変換
int patFaceByKey(int key) {
  switch(key) {
    case 0: return normalIdx;
    case 1: return smileIdx;
    case 2: return faceByName("撫でられてうれしい");
    case 3: return faceByName("焦り");
    default: return normalIdx;
  }
}

// パットイベントをPC(bot)へ送信
void sendPatEvent(int mode) {
  if (!ENABLE_PC_EVENT_POST) return;
  HTTPClient http;
  String url = String("http://") + PC_IP + ":" + PC_PORT + "/event";
  http.begin(url);
  http.addHeader("Content-Type","application/json");
  String body = "{\"type\":\"pat\",\"mode\":\"" + String(PAT_VOICE[mode]) + "\"}";
  http.POST(body);
  http.end();
}

void startPatAnimation(int mode) {
  if (isSpeaking || isDancing || inReaction) return;
  patMode = mode;
  patStep = 0;
  lastPatStep = millis();
  inReaction = true;
  reactionEndMs = millis() + 3500;
  bumpActivity();
  sendPatEvent(mode);
  // サーボシーケンスはtriggerHeadPat()のlean-inが担当するためここでは設定しない
  Serial.printf("[Pat] 表示モード%d 開始\n", mode);
}

void updatePatAnimation() {
  if (patMode < 0) return;
  const PatFrame* frames = PAT_NOD[patMode];
  int total = PAT_FRAME_COUNT[patMode];
  if (patStep >= total) {
    patMode = -1;
    inReaction = false;
    setMode(MODE_FACE);
    return;
  }
  const PatFrame& f = frames[patStep];
  if (f.ms == 0) { patMode = -1; inReaction = false; setMode(MODE_FACE); return; }
  if (millis() - lastPatStep < (unsigned long)f.ms) return;
  lastPatStep = millis();

  // 顔を描画 (オフセット付き)
  canvas.fillSprite(TFT_BLACK);
  canvas.drawJpg(
    FACE_INDEX[patFaceByKey(f.faceKey)].data,
    *FACE_INDEX[patFaceByKey(f.faceKey)].len,
    f.dx, f.dy, W, H
  );
  canvas.pushSprite(0, 0);

  patStep++; // サーボはsvPlay()の独立シーケンスで制御
}

// ─── DVD モード (スプライトで完全ちかちかなし) ───────────────────────────────
void updateDvd() {
  if (millis() - lastDvdUpdate < 28) return;
  lastDvdUpdate = millis();

  dvdX += dvdVX; dvdY += dvdVY;
  dvdBounced = false;
  float maxX = W - DVD_W, maxY = H - DVD_H;
  if (dvdX <= 0)    { dvdX = 0;    dvdVX =  fabs(dvdVX); dvdBounced = true; }
  if (dvdX >= maxX) { dvdX = maxX; dvdVX = -fabs(dvdVX); dvdBounced = true; }
  if (dvdY <= 0)    { dvdY = 0;    dvdVY =  fabs(dvdVY); dvdBounced = true; }
  if (dvdY >= maxY) { dvdY = maxY; dvdVY = -fabs(dvdVY); dvdBounced = true; }
  if (dvdBounced) dvdColIdx = (dvdColIdx + 1) % 8;

  // プリデコード済みスプライトをRAWコピー (JPEGデコードなし → 一定時間)
  canvas.fillSprite(TFT_BLACK);
  dvdSprite.pushSprite(&canvas, (int)dvdX, (int)dvdY);
  canvas.pushSprite(0, 0);
}

// ─── パクパクアニメ ───────────────────────────────────────────────────────────
void updatePaku() {
  if (!isSpeaking) return;
  if (millis() - lastPaku < PAKU_MS) return;
  lastPaku = millis();
  pakuFrame = 1 - pakuFrame;
  int idx = pakuFrame == 0 ? normalIdx : pakuIdx;  // ノーマル↔口パク
  canvas.fillSprite(TFT_BLACK);
  canvasFull(idx);
  canvasBubble(subtitle);
  canvas.pushSprite(0, 0);
}

// ─── モード切替 ──────────────────────────────────────────────────────────────
void setMode(Mode m) {
  curMode = m;
  canvas.fillSprite(TFT_BLACK);
  switch (m) {
    case MODE_FACE:
      canvasFull(curFaceIdx);
      break;
    case MODE_SPEAK:
      canvasFull(curFaceIdx);
      canvasBubble(subtitle);
      break;
    case MODE_ZZZ:
      canvasFull(zzzIdx);
      canvas.setTextSize(3); canvas.setTextColor(0x88AAFF);
      canvas.setCursor(10, 10); canvas.print("z z z...");
      break;
    case MODE_DVD:
    case MODE_CAMERA:
      // DVDはloop内で描画
      break;
  }
  canvas.pushSprite(0, 0);
  Serial.printf("[Mode] → %d\n", (int)m);
}

// ─── ZZZ モード (フルスクリーンzzz.png) ─────────────────────────────────────
void enterZzz() {
  if (curMode == MODE_ZZZ) return;
  Serial.println("[Idle] ZZZモード");
  M5.Display.setBrightness(80);   // 輝度を下げる
  setMode(MODE_ZZZ);
}

void wakeFromZzz() {
  M5.Display.setBrightness(200);
  bumpActivity();
  setMode(MODE_FACE);
}

// ─── カメラ ──────────────────────────────────────────────────────────────────
bool initCam() {
  if (camInited) return true;
  camera_config_t c = {};
  c.ledc_channel=LEDC_CHANNEL_0; c.ledc_timer=LEDC_TIMER_0;
  c.pin_d0=39; c.pin_d1=40; c.pin_d2=41; c.pin_d3=42;
  c.pin_d4=15; c.pin_d5=16; c.pin_d6=48; c.pin_d7=47;
  c.pin_xclk=2; c.pin_pclk=3; c.pin_vsync=46; c.pin_href=38;
  c.pin_sccb_sda=12; c.pin_sccb_scl=11; c.pin_pwdn=-1; c.pin_reset=-1;
  c.xclk_freq_hz=20000000; c.pixel_format=PIXFORMAT_JPEG;
  c.frame_size=FRAMESIZE_QVGA; c.jpeg_quality=10;
  c.fb_count=1; c.fb_location=CAMERA_FB_IN_PSRAM;
  c.grab_mode=CAMERA_GRAB_WHEN_EMPTY;
  camInited = (esp_camera_init(&c) == ESP_OK);
  return camInited;
}

void captureAndSend() {
  if (!ENABLE_CAMERA_SEND) return;
  if (!initCam()) return;
  canvas.fillSprite(TFT_BLACK);
  canvas.setTextColor(TFT_CYAN); canvas.setTextSize(2);
  canvas.setCursor(60, H/2-14); canvas.print("撮影中...");
  canvas.pushSprite(0, 0);

  camera_fb_t* fb = esp_camera_fb_get();
  if (!fb) return;

  HTTPClient http;
  http.begin(String("http://") + PC_IP + ":" + PC_PORT + "/camera");
  http.addHeader("Content-Type", "image/jpeg");
  int code = http.POST(fb->buf, fb->len);
  http.end(); esp_camera_fb_return(fb);

  canvas.fillSprite(TFT_BLACK);
  canvas.setTextColor(code==200?TFT_GREEN:TFT_RED); canvas.setTextSize(2);
  canvas.setCursor(50, H/2-14);
  canvas.print(code==200 ? "送信完了!" : "送信失敗");
  canvas.pushSprite(0, 0);
  delay(1200);
  setMode(MODE_FACE);
}

// ─── WebSocket security helpers ──────────────────────────────────────────────
bool controlTokenConfigured() {
  return CONTROL_TOKEN && CONTROL_TOKEN[0] &&
         strcmp(CONTROL_TOKEN, "CHANGE_ME_BEFORE_FLASH") != 0;
}

bool authorizeControl(JsonDocument& doc) {
  if (!REQUIRE_CONTROL_TOKEN) return true;
  if (!controlTokenConfigured()) {
    Serial.println("[SEC] control token is not configured; command rejected");
    return false;
  }
  const char* token = doc["token"] | "";
  if (strcmp(token, CONTROL_TOKEN) == 0) return true;
  Serial.println("[SEC] invalid control token; command rejected");
  return false;
}

bool allowEvery(unsigned long& lastMs, uint32_t intervalMs) {
  unsigned long now = millis();
  if (now - lastMs < intervalMs) return false;
  lastMs = now;
  return true;
}

void rejectWs(uint8_t num, const char* reason) {
  Serial.printf("[SEC] reject: %s\n", reason);
  webSocket.sendTXT(num, String("{\"type\":\"error\",\"reason\":\"") + reason + "\"}");
}

// ─── WebSocket ───────────────────────────────────────────────────────────────
void onWs(uint8_t num, WStype_t type, uint8_t* payload, size_t length) {
  bumpActivity();
  switch (type) {
    case WStype_CONNECTED:
      audioUploadArmed = false;
      webSocket.sendTXT(num,
        "{\"type\":\"affection.state\",\"affection\":600,\"level\":\"nakayoshi\"}");
      if (curMode == MODE_ZZZ) wakeFromZzz();
      break;
    case WStype_TEXT: {
      if (length > MAX_WS_TEXT_BYTES) {
        rejectWs(num, "text_too_large");
        break;
      }
      if (curMode == MODE_ZZZ) wakeFromZzz();
      JsonDocument doc;
      if (deserializeJson(doc, payload, length) != DeserializationError::Ok) break;
      if (!authorizeControl(doc)) {
        rejectWs(num, "auth_required");
        break;
      }
      String t = doc["type"].as<String>();
      if (t == "servo") {
        if (!ENABLE_SERVO_CONTROL || !allowEvery(lastMotionCommandMs, MIN_MOTION_INTERVAL_MS)) {
          rejectWs(num, "servo_blocked");
          break;
        }
        // {"type":"servo","pan":30,"tilt":-20}
        int p = doc["pan"].as<int>();
        int ti = doc["tilt"].as<int>();
        servoMove(p, ti);
        bumpActivity();
      } else if (t == "move") {
        if (!ENABLE_SERVO_CONTROL || !allowEvery(lastMotionCommandMs, MIN_MOTION_INTERVAL_MS)) {
          rejectWs(num, "move_blocked");
          break;
        }
        // {"type":"move","action":"spin"}
        handleMove(doc["action"].as<String>());
        bumpActivity();
      } else if (t == "dance") {
        if (!ENABLE_DANCE_CONTROL || !allowEvery(lastDanceCommandMs, MIN_DANCE_INTERVAL_MS)) {
          rejectWs(num, "dance_blocked");
          break;
        }
        startDance();
      } else if (t == "led") {
        if (!handleLedCommand(doc)) {
          rejectWs(num, "led_blocked");
          break;
        }
      } else if (t == "face_mode") {
        curFaceIdx = faceByMood(doc["value"].as<String>());
        if (!isSpeaking && curMode != MODE_CAMERA) setMode(MODE_FACE);
      } else if (t == "state") {
        String v = doc["value"].as<String>();
        if (v == "speaking") {
          if (!ENABLE_PCM_AUDIO) {
            rejectWs(num, "audio_blocked");
            break;
          }
          audioUploadArmed = true;
          audioUploadDeadlineMs = millis() + PCM_ARM_WINDOW_MS;
          isSpeaking=true; pakuFrame=0; lastPaku=0;
          if (curMode!=MODE_SPEAK) setMode(MODE_SPEAK);
        } else if (v == "idle") {
          audioUploadArmed = false;
          if (!pcmBuf.empty() && !audioPlaying) {
            // PCMデータあり → 全チャンク受信完了 → 再生開始
            playReq = true;
            // isSpeakingはtrue維持 (再生中もパクパクアニメ継続)
          } else if (!audioPlaying) {
            isSpeaking = false; subtitle = "";
            subScrollX = 0; subNeedsScroll = false;
            if (curMode!=MODE_CAMERA) { bumpActivity(); setMode(MODE_FACE); }
          }
        }
      } else if (t == "subtitle") {
        subtitle = doc["text"].as<String>();
        subScrollX = 0;  // 左端から即表示 (W→0に修正)
        subNeedsScroll = false;
        if (curMode==MODE_SPEAK || curMode==MODE_FACE) {
          canvas.fillSprite(TFT_BLACK);
          canvasFull(isSpeaking ? (pakuFrame==0?normalIdx:pakuIdx) : curFaceIdx);
          canvasBubble(subtitle);
          canvas.pushSprite(0, 0);
        }
      }
      break;
    }
    case WStype_BIN: {
      // 再生中は無視 (playRaw中にpcmBuf変更不可)
      if (audioPlaying) break;
      if (!ENABLE_PCM_AUDIO || !audioUploadArmed || millis() > audioUploadDeadlineMs) break;
      if ((length % 2) != 0) break;
      size_t n = length / 2;
      if (pcmBuf.size() + n > MAX_PCM_SAMPLES) {
        pcmBuf.clear();
        audioUploadArmed = false;
        rejectWs(num, "pcm_too_large");
        break;
      }
      const int16_t* d = (const int16_t*)payload;
      pcmBuf.reserve(pcmBuf.size() + n);
      for (size_t i = 0; i < n; i++) pcmBuf.push_back(d[i]);
      // playReqはstate:idle受信後にセット → 全チャンク揃ってから再生
      break;
    }
    default: break;
  }
}

// ─── タッチゾーン ─────────────────────────────────────────────────────────────
int getZone(int tx, int ty) {
  if (ty < H - H/5) return -1;
  int bW = W/3;
  return tx<bW ? 0 : tx<bW*2 ? 1 : 2;
}
bool isFaceArea(int tx, int ty) {
  return tx > 20 && tx < W-20 && ty > 20 && ty < H - H/5;
}

// --- RGB LED HOLD-front adapter ---
// These functions define the safe command surface before hardware enablement.
// Physical LED writes stay blocked while ENABLE_LED_CONTROL is false.
uint8_t clampLedChannel(int value) {
  return (uint8_t)constrain(value, 0, LED_MAX_BRIGHTNESS);
}

void setupRgbLeds() {
  ledDriverReady = false;
  if (!ENABLE_LED_CONTROL) {
    Serial.println("[LED] control disabled");
    return;
  }

#if ENABLE_STACKCHAN_BSP_LED_DRIVER
  if (M5.Led.isEnabled()) {
    M5.Led.setBrightness(LED_MAX_BRIGHTNESS);
    ledDriverReady = true;
    Serial.println("[LED] M5.Led ready (RGB)");
  } else if (M5.Led.begin()) {
    M5.Led.setBrightness(LED_MAX_BRIGHTNESS);
    ledDriverReady = true;
    Serial.println("[LED] M5.Led begin OK (RGB)");
  } else {
    // Power LED fallback — single brightness only
    ledDriverReady = true;
    Serial.println("[LED] M5.Power.setLed fallback");
  }
#else
  ledDriverReady = false;
#endif
}

bool ledSetAll(uint8_t r, uint8_t g, uint8_t b) {
  if (!ENABLE_LED_CONTROL || !ledDriverReady) return false;

#if ENABLE_STACKCHAN_BSP_LED_DRIVER
  if (M5.Led.isEnabled()) {
    M5.Led.setAllColor(r, g, b);
    M5.Led.display();
  } else {
    // Fallback: power LED on when any channel is non-zero
    M5.Power.setLed((r || g || b) ? LED_MAX_BRIGHTNESS : 0);
  }
  return true;
#else
  (void)r; (void)g; (void)b;
  return false;
#endif
}

bool ledOff() {
  return ledSetAll(0, 0, 0);
}

bool ledPreset(const String& preset) {
  if (preset == "off") return ledOff();
  if (preset == "blue") return ledSetAll(0, 0, LED_MAX_BRIGHTNESS);
  if (preset == "pass") return ledSetAll(0, LED_MAX_BRIGHTNESS, 12);
  if (preset == "hold") return ledSetAll(LED_MAX_BRIGHTNESS, LED_MAX_BRIGHTNESS / 2, 0);
  if (preset == "stop") return ledSetAll(LED_MAX_BRIGHTNESS, 0, 0);
  if (preset == "dance") return ledSetAll(20, 0, LED_MAX_BRIGHTNESS);
  return false;
}

bool handleLedCommand(JsonDocument& doc) {
  if (!ENABLE_LED_CONTROL || !ledDriverReady) return false;

  String preset = doc["preset"].as<String>();
  if (preset.length() > 0) return ledPreset(preset);

  uint8_t r = clampLedChannel(doc["r"].as<int>());
  uint8_t g = clampLedChannel(doc["g"].as<int>());
  uint8_t b = clampLedChannel(doc["b"].as<int>());
  return ledSetAll(r, g, b);
}

// ─── ダンスシーケンス ─────────────────────────────────────────────────────────
void startDance() {
  if (isDancing || isSpeaking || curMode == MODE_CAMERA) return;
  isDancing  = true;
  danceStep  = 0;
  lastDanceMs = 0;
  inReaction  = false;
  bumpActivity();
  ledPreset("dance");
  // 16ステップ本格ダンスシーケンスをサーボで同時再生
  svPlay(SEQ_DANCE, 16);
  Serial.println("[Dance] ダンス開始! (表示+サーボ)");
}

void updateDance() {
  if (!isDancing) return;
  if (millis() - lastDanceMs < 280) return;
  lastDanceMs = millis();

  const int facePat[4] = {0, 0, 0, 0};  // 下で動的セット
  int fi = (danceStep % 4 == 0) ? normalIdx :
           (danceStep % 4 == 1) ? smileIdx  :
           (danceStep % 4 == 2) ? ganbaruIdx : smileIdx;

  canvas.fillSprite(TFT_BLACK);
  canvasFull(fi);
  canvas.setTextColor(TFT_YELLOW);
  canvas.setTextSize(2);
  canvas.setCursor((danceStep%2==0) ? 8 : W-26, (danceStep%4<2) ? 12 : 50);
  canvas.print("J");   // ♪ 代替
  canvas.pushSprite(0, 0);

  const uint16_t mel[] = {523,587,659,698,784,880,988,1047,
                           988,880,784,698,659,587,659,784};
  M5.Speaker.setVolume(160);
  M5.Speaker.tone(mel[danceStep % 16], 250);

  danceStep++;
  if (danceStep >= 16) {
    isDancing = false;
    ledOff();
    setMode(MODE_FACE);
    Serial.println("[Dance] ダンス終了");
  }
}

// ─── 頭撫でリアクション — 「撫でられに来る」モーション ─────────────────────────
void triggerHeadPat() {
  if (isSpeaking || curMode == MODE_CAMERA || isDancing || patMode >= 0) return;

  // ── サーボ: 撫でた方向へ頭が寄ってくる (オリジナルStackChan動作) ──────────────
  // leanX/leanY = IMU累積方向ベクトル
  // 手が右から来た → device が左に揺れ → leanX 負 → サーボは右へ (手に寄る)
  float mag = sqrtf(leanX*leanX + leanY*leanY);
  if (mag < 0.01f) mag = 0.01f;

  // 上方向へのデフォルト傾き (+20°) + 撫でた方向へのPan
  int svPan  = constrain((int)(-leanX / mag * 40), -55, 55);
  int svTilt = constrain((int)(-leanY / mag * 25) + 20, TILT_MIN, TILT_MAX);

  // 動的シーケンス生成: 頭が手の方向へすっと寄って、しばらくキープ、戻る
  leanInSeq[0] = {svPan/3,  svTilt/3, 150};   // そっと動き始める
  leanInSeq[1] = {svPan,    svTilt,   350};    // 手の方向へ寄る
  leanInSeq[2] = {svPan,    svTilt,   700};    // 撫でられている間キープ
  leanInSeq[3] = {svPan/3,  svTilt/3, 280};    // ゆっくり離れる
  leanInSeq[4] = {0,        0,        400};    // センターへ戻る

  svPlay(leanInSeq, 5);

  // leanベクトルリセット
  leanX = leanY = 0;

  // ── 表示アニメ: 5種を循環 ────────────────────────────────────────────────────
  int mode = patCycle % 5;
  patCycle++;
  startPatAnimation(mode);  // サーボシーケンスはsvPlayで上書きしない
}

// ─── 顔タッチリアクション ────────────────────────────────────────────────────
void triggerFaceTouch() {
  if (isSpeaking || curMode == MODE_CAMERA || isDancing || inReaction) return;
  bumpActivity();
  inReaction    = true;
  reactionEndMs = millis() + 1000;
  Serial.println("[Touch] 顔タッチ!");

  canvas.fillSprite(TFT_BLACK);
  canvasFull(smileIdx);
  canvas.setTextColor(TFT_YELLOW);
  canvas.setTextSize(2);
  canvas.setCursor(W/2-16, 10); canvas.print("!?");
  canvas.pushSprite(0, 0);

  M5.Speaker.setVolume(130);
  M5.Speaker.tone(1046, 80);
}

// ─── SCS シリアルバスサーボ制御 ────────────────────────────────────────────────
// 位置変換: 角度 → SCS0009 ポジション値 (0-1023, 中央=512, 300°フルレンジ)
static const float SCS_STEPS_PER_DEG = 1023.0f / 300.0f;
static const int   SCS_POS_CENTER    = 512;

int angleToPosS(int angle) {
  return (int)constrain(SCS_POS_CENTER + angle * SCS_STEPS_PER_DEG,
                        0.0f, 1023.0f);
}

// SCS WRITE_DATA パケット送信: Goal_Position(0x2A,2B) + Time(0x2C,2D) + Speed(0x2E,2F)
void scsWritePos(uint8_t id, uint16_t pos, uint16_t time_ms = 0, uint16_t speed = 0) {
  uint8_t ph = pos >> 8;
  uint8_t pl = pos & 0xFF;
  uint8_t th = time_ms >> 8;
  uint8_t tl = time_ms & 0xFF;
  uint8_t sh = speed >> 8;
  uint8_t sl = speed & 0xFF;
  uint8_t length = 9;  // INST(1)+ADDR(1)+DATA(6)+CHK(1)
  uint8_t chk = ~(uint8_t)(id + length + 0x03 + SCS_GOAL_POS_ADDR
                            + ph + pl + th + tl + sh + sl);
  uint8_t pkt[] = {0xFF, 0xFF, id, length, 0x03, SCS_GOAL_POS_ADDR,
                   ph, pl, th, tl, sh, sl, chk};
  SCSSerial.write(pkt, sizeof(pkt));
  SCSSerial.flush();
}

// 目標角度をセット
void servoMove(int pan, int tilt) {
  panTarget  = constrain(pan,  -PAN_LIMIT, PAN_LIMIT);
  tiltTarget = constrain(tilt,  TILT_MIN,  TILT_MAX);
}

// ループ内で呼ぶ: 目標に向かって滑らかに追従 (7°/20ms)
void updateServos() {
  if (!ENABLE_SERVO_CONTROL) return;
  if (millis() - lastSvUpdate < 20) return;
  lastSvUpdate = millis();

  const int STEP = (isDancing || svPlaying) ? 12 : 7;
  auto ease = [](int cur, int tgt, int step) {
    int diff = tgt - cur;
    if (abs(diff) <= step) return tgt;
    return cur + (diff > 0 ? step : -step);
  };
  int newPan  = ease(panCur,  panTarget,  STEP);
  int newTilt = ease(tiltCur, tiltTarget, STEP);

  if (newPan != panCur || newTilt != tiltCur) {
    panCur  = newPan;
    tiltCur = newTilt;
    scsWritePos(SCS_ID_PAN,  angleToPosS(panCur));
    delayMicroseconds(300);
    scsWritePos(SCS_ID_TILT, angleToPosS(tiltCur));
  }
}

// シーケンス再生
void svPlay(const SvFrame* seq, int len) {
  svSeq    = seq;
  svLen    = len;
  svIdx    = 0;
  svNext   = millis();
  svPlaying = true;
}

void svUpdate() {
  if (!svPlaying || !svSeq) return;
  if (millis() < svNext) return;
  if (svIdx >= svLen) { svPlaying = false; servoMove(0, 0); return; }

  const SvFrame& f = svSeq[svIdx];
  servoMove(f.pan, f.tilt);
  svNext = millis() + f.ms;
  svIdx++;
}

// コマンド名→シーケンス起動
void handleMove(const String& cmd) {
  if      (cmd == "spin")        svPlay(SEQ_SPIN,  4);
  else if (cmd == "nod")         svPlay(SEQ_NOD,   4);
  else if (cmd == "shake")       svPlay(SEQ_SHAKE, 5);
  else if (cmd == "look_around") svPlay(SEQ_LOOK,  5);
  else if (cmd == "dance") {
    if (ENABLE_DANCE_CONTROL && allowEvery(lastDanceCommandMs, MIN_DANCE_INTERVAL_MS)) startDance();
  }
  else if (cmd == "center")      servoMove(0, 0);
  else if (cmd == "look_left")   servoMove(-70, 0);
  else if (cmd == "look_right")  servoMove( 70, 0);
  else if (cmd == "look_up")     servoMove(0,  38);
  else if (cmd == "look_down")   servoMove(0, -25);
}

// ─── BLE サーバー ─────────────────────────────────────────────────────────────
class BleServerCB : public BLEServerCallbacks {
  void onConnect(BLEServer*) override {
    bleConnected = true;
    Serial.println("[BLE] 接続");
  }
  void onDisconnect(BLEServer* s) override {
    bleConnected = false;
    Serial.println("[BLE] 切断 → 再アドバタイズ");
    s->startAdvertising();
  }
};

class PanCharCB : public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic* c) override {
    if (c->getLength() < 1) return;
    int8_t v = (int8_t)c->getValue()[0];
    servoMove(v, tiltTarget);
  }
};

class TiltCharCB : public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic* c) override {
    if (c->getLength() < 1) return;
    int8_t v = (int8_t)c->getValue()[0];
    servoMove(panTarget, v);
  }
};

class CmdCharCB : public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic* c) override {
    String cmd = String(c->getValue().c_str());
    cmd.trim();
    handleMove(cmd);
    Serial.printf("[BLE] cmd: %s\n", cmd.c_str());
  }
};

void setupBLE() {
  BLEDevice::init(BLE_DEVICE_NAME);
  pBleServer = BLEDevice::createServer();
  pBleServer->setCallbacks(new BleServerCB());

  BLEService* svc = pBleServer->createService(SVC_UUID);

  pPanChar = svc->createCharacteristic(PAN_UUID,
    BLECharacteristic::PROPERTY_WRITE | BLECharacteristic::PROPERTY_READ);
  pPanChar->setCallbacks(new PanCharCB());

  pTiltChar = svc->createCharacteristic(TILT_UUID,
    BLECharacteristic::PROPERTY_WRITE | BLECharacteristic::PROPERTY_READ);
  pTiltChar->setCallbacks(new TiltCharCB());

  BLECharacteristic* cmdChar = svc->createCharacteristic(CMD_UUID,
    BLECharacteristic::PROPERTY_WRITE);
  cmdChar->setCallbacks(new CmdCharCB());

  svc->start();

  BLEAdvertising* adv = BLEDevice::getAdvertising();
  adv->addServiceUUID(SVC_UUID);
  adv->setScanResponse(true);
  BLEDevice::startAdvertising();
  Serial.printf("[BLE] %s アドバタイズ中\n", BLE_DEVICE_NAME);
}

void setupServos() {
  if (!ENABLE_SERVO_CONTROL) {
    Serial.println("[Servo] control disabled");
    return;
  }
  // SCS0009: UART1, 1Mbps, TX=GPIO6, RX=GPIO7
  SCSSerial.begin(SCS_BAUD, SERIAL_8N1, SCS_RX_PIN, SCS_TX_PIN);
  delay(100);
  // 中央位置へ移動
  scsWritePos(SCS_ID_PAN,  SCS_POS_CENTER, 0, 200);
  delay(50);
  scsWritePos(SCS_ID_TILT, SCS_POS_CENTER, 0, 200);
  delay(50);
  panCur = panTarget = 0;
  tiltCur = tiltTarget = 0;
  Serial.printf("[Servo] SCS0009 TX=%d RX=%d baud=%d\n",
                SCS_TX_PIN, SCS_RX_PIN, SCS_BAUD);
}

// 起動時の首振りテスト — サーボが動くことを目視確認する
// Pan: 右30°→ 左30°→ 中 / Tilt: 上25°→ 下15°→ 中
void servoStartupTest() {
  if (!ENABLE_SERVO_CONTROL) return;
  Serial.println("[Servo] 起動テスト開始 (SCS)");
  scsWritePos(SCS_ID_PAN,  angleToPosS( 30), 0, 200); delay(700);
  scsWritePos(SCS_ID_PAN,  angleToPosS(-30), 0, 200); delay(700);
  scsWritePos(SCS_ID_PAN,  angleToPosS(  0), 0, 200); delay(500);
  scsWritePos(SCS_ID_TILT, angleToPosS( 25), 0, 200); delay(700);
  scsWritePos(SCS_ID_TILT, angleToPosS(-15), 0, 200); delay(700);
  scsWritePos(SCS_ID_TILT, angleToPosS(  0), 0, 200); delay(500);
  panCur = panTarget = 0;
  tiltCur = tiltTarget = 0;
  Serial.println("[Servo] 起動テスト完了");
}

// ─── OTA セットアップ ─────────────────────────────────────────────────────────
void setupOTA() {
  ArduinoOTA.setHostname("shikishima-cores3");
  ArduinoOTA.onStart([]() {
    canvas.fillSprite(TFT_BLACK);
    canvas.setTextColor(TFT_CYAN); canvas.setTextSize(2);
    canvas.setCursor(20, 100); canvas.print("OTA更新中...");
    canvas.pushSprite(0, 0);
    Serial.println("[OTA] 開始");
  });
  ArduinoOTA.onEnd([]() {
    Serial.println("[OTA] 完了 → 再起動");
  });
  ArduinoOTA.onError([](ota_error_t e) {
    Serial.printf("[OTA] エラー [%u]\n", e);
  });
  ArduinoOTA.begin();
  Serial.println("[OTA] 待機中 — hostname: shikishima-cores3");
}

// ─── アイドル微小動作 (生命感) ────────────────────────────────────────────────
unsigned long lastIdleMicroMs = 0;
int idleMicroStage = 0;

void updateIdleMicro() {
  // 発話中・リアクション中・ダンス中・撫で中は停止
  if (isSpeaking || inReaction || isDancing || patMode >= 0) return;
  if (curMode != MODE_FACE) return;
  if (svPlaying) return;

  // 30〜45秒ごとにランダムな微小首振り
  unsigned long interval = 30000 + (millis() % 15000);
  if (millis() - lastIdleMicroMs < interval) return;
  lastIdleMicroMs = millis();

  // 5種類のアイドル動作をローテーション
  switch (idleMicroStage % 5) {
    case 0: svPlay(SEQ_NOD,  4); break;                        // 小さくうなずく
    case 1: servoMove(-20, 5); break;                          // 少し左を向く
    case 2: servoMove( 20, 5); break;                          // 少し右を向く
    case 3: svPlay(SEQ_LOOK, 5); break;                        // 見回す
    case 4: servoMove(0, 0); break;                            // センターに戻る
  }
  idleMicroStage++;
  Serial.printf("[Idle] 微小動作 %d\n", idleMicroStage);
}

// ─── IMU チェック (頭撫で検出) ───────────────────────────────────────────────
void checkImu() {
  if (millis() - imuLastCheckMs < 80) return;
  imuLastCheckMs = millis();

  float ax, ay, az;
  if (!M5.Imu.getAccel(&ax, &ay, &az)) return;

  float dX = ax - imuPrevX, dY = ay - imuPrevY;
  float delta = fabs(dX) + fabs(dY);
  imuPrevX = ax; imuPrevY = ay;

  if (delta > 0.22f) {
    // 撫でる方向を累積 (「手がどこから来たか」の記録)
    leanX += dX;
    leanY += dY;

    if (millis() - imuLastHitMs < 1000) imuPatCount++;
    else                                imuPatCount = 1;
    imuLastHitMs = millis();

    if (imuPatCount >= 3 && !inReaction) {             // 回数: 4→3回
      imuPatCount = 0;
      triggerHeadPat();
    }
  }
}

// ─── setup ───────────────────────────────────────────────────────────────────
void setup() {
  Serial.begin(115200);
  M5.begin();
  M5.Display.setBrightness(200);

  // スプライト作成 (PSRAM使用)
  canvas.setPsram(true);
  canvas.createSprite(W, H);
  initBubble();  // 吹き出し字幕用サブスプライト初期化
  canvas.fillSprite(TFT_BLACK);

  // 起動画面
  canvas.setTextColor(TFT_WHITE); canvas.setTextSize(2);
  canvas.setCursor(20, 100); canvas.print("Shikishima...");
  canvas.pushSprite(0, 0);

  // 顔インデックスをキャッシュ
  normalIdx  = faceByName("ノーマル");
  pakuIdx    = faceByName("口パク");    // 発話時の口パクアニメ用
  smileIdx   = faceByName("笑顔");
  dvdFaceIdx = faceByName("dvdモード");
  zzzIdx     = faceByName("zzz");
  ganbaruIdx = faceByName("頑張るぞ");

  // IMU初期化 (加速度センサーで頭撫で検出)
  M5.Imu.begin();

  // サーボ初期化 + 起動テスト (目視確認: 右→左→上→下→センター)
  setupServos();
  servoStartupTest();
  setupRgbLeds();

  // BLE control is disabled by default; enable only for a scoped test build.
  if (ENABLE_BLE_CONTROL) setupBLE();

  // DVD画像を起動時に一度だけデコード → 毎フレームはRAWコピーのみ (カクつき防止)
  dvdSprite.setPsram(false);   // 80*54*2=8.6KB → SRAMに収まる
  dvdSprite.createSprite(DVD_W, DVD_H);
  dvdSprite.drawJpg(
    FACE_INDEX[dvdFaceIdx].data, *FACE_INDEX[dvdFaceIdx].len,
    0, 0, DVD_W, DVD_H,
    0, 0,
    (float)DVD_W / W, (float)DVD_H / H
  );

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  for (int i=0; i<20 && WiFi.status()!=WL_CONNECTED; i++) delay(500);
  if (WiFi.status()==WL_CONNECTED) {
    Serial.printf("IP: %s\n", WiFi.localIP().toString().c_str());
    M5.Speaker.setVolume(150);
    M5.Speaker.tone(880, 80); delay(130); M5.Speaker.tone(1200, 80);
  }

  webSocket.begin();
  webSocket.onEvent(onWs);

  // OTA is disabled by default; enable only for a scoped maintenance build.
  if (ENABLE_OTA && WiFi.status() == WL_CONNECTED) setupOTA();

  curFaceIdx = normalIdx;
  bumpActivity();
  setMode(MODE_FACE);
}

// ─── loop ────────────────────────────────────────────────────────────────────
void loop() {
  M5.update();
  if (ENABLE_OTA) ArduinoOTA.handle();   // OTA更新チェック (非ブロッキング)
  webSocket.loop();

  // PCM 再生 — ノンブロッキング (全チャンク揃ってから一括再生)
  if (playReq && !pcmBuf.empty() && !audioPlaying) {
    M5.Speaker.setVolume(220);
    M5.Speaker.playRaw(pcmBuf.data(), pcmBuf.size(), 16000, false, 1, 0);
    playReq     = false;
    audioPlaying = true;
  }
  if (audioPlaying && !M5.Speaker.isPlaying()) {
    // 再生完了
    audioPlaying = false;
    pcmBuf.clear();
    isSpeaking = false; subtitle = "";
    subScrollX = 0; subNeedsScroll = false;  // スクロールリセット
    if (curMode!=MODE_CAMERA) { bumpActivity(); setMode(MODE_FACE); }
  }

  // サーボ・シーケンス更新
  svUpdate();
  updateServos();

  // 字幕スクロール + 撫でアニメーション + Breathing
  updateSubtitleScroll();
  if (patMode >= 0) updatePatAnimation();
  else updateBreath();

  // IMU頭撫で / ダンス / リアクション / アイドル微小動作
  checkImu();
  updateDance();
  updateIdleMicro();
  if (inReaction && millis() > reactionEndMs) {
    inReaction = false;
    if (!isSpeaking && !isDancing) setMode(MODE_FACE);
  }

  // モード別更新 (リアクション・ダンス中は通常描画を止める)
  if (!inReaction && !isDancing) {
    if (curMode==MODE_DVD)   updateDvd();
    if (curMode==MODE_SPEAK) updatePaku();
  }

  // アイドルチェック
  unsigned long idle = millis() - lastActivityMs;
  if (idle > IDLE_TO_ZZZ_MS && curMode != MODE_ZZZ && curMode != MODE_CAMERA && !isSpeaking) {
    enterZzz();
  } else if (idle > IDLE_TO_DVD_MS && curMode == MODE_FACE && !isSpeaking) {
    Serial.println("[Idle] DVDモードへ");
    setMode(MODE_DVD);
  }

  // タッチ
  auto  detail   = M5.Touch.getDetail();
  bool  nowPress = detail.isPressed();
  if (nowPress) {
    int z = getZone(detail.x, detail.y);
    if (!prevPress) {
      touchPressMs = millis();
      touchX = detail.x; touchY = detail.y;  // タッチ座標を記録
      if (z >= 0) { touchZone=z; touchStart=millis(); touchDone=false; }
    }
    // A 3秒長押し → カメラトグル
    // B 1.5秒長押し → ダンス
    if (touchZone==1 && !touchDone && millis()-touchStart>=1500) {
      touchDone=true; startDance();
    }
    if (touchZone==0 && !touchDone && millis()-touchStart>=3000) {
      touchDone=true; bumpActivity();
      camOn=!camOn;
      if (camOn) {
        setMode(MODE_CAMERA);
        canvas.fillSprite(TFT_BLACK);
        canvas.setTextColor(TFT_CYAN); canvas.setTextSize(2);
        canvas.setCursor(30, 90); canvas.print("カメラモード");
        canvas.setTextSize(1); canvas.setTextColor(0xAABBCC);
        canvas.setCursor(20, 120); canvas.print("B/Cタップ:撮影  A3秒:終了");
        canvas.pushSprite(0, 0);
      } else {
        bumpActivity(); setMode(MODE_FACE);
      }
    }
  } else {
    // 80ms未満の接触はゴーストタッチとして無視
    if (prevPress && (millis()-touchPressMs)>=80) {
      if (touchZone>=0 && !touchDone) {
        bumpActivity();
        // ZZZ/DVDなら任意タッチで顔に復帰
        if (curMode==MODE_ZZZ) { wakeFromZzz(); }
        else if (curMode==MODE_DVD) { setMode(MODE_FACE); }
        // カメラ中はB/Cで撮影
        else if (curMode==MODE_CAMERA && touchZone!=0) { captureAndSend(); }
        // B → 次の顔 (長押しダンスでtouchDone=trueなら来ない)
        else if (touchZone==1) {
          curFaceIdx=(curFaceIdx+1)%FACE_INDEX_COUNT;
          setMode(MODE_FACE);
        }
        // C → FACE→DVD
        else if (touchZone==2 && curMode==MODE_FACE) { setMode(MODE_DVD); }
      }
      // 顔エリアタップ (ボタンゾーン外)
      else if (touchZone==-1 && isFaceArea(touchX, touchY) &&
               curMode==MODE_FACE && !inReaction && !isDancing) {
        triggerFaceTouch();
      }
    }
    if (prevPress) { touchZone=-1; touchDone=false; }
  }
  prevPress=nowPress;
  delay(5);
}
