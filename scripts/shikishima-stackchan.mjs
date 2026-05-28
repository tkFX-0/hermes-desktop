/**
 * Shikishima StackChan Integration — Lv10-E
 * stackchan-local-service.ts の ES module 移植版 + Botフック
 *
 * Pipeline: テキスト → VOICEVOX (localhost:50021) → 16kHz PCM → WebSocket (StackChan WebSocket)
 * Firmware: stackchan-pet-fw v0.1.0
 * Confirmed protocol: 2026-05-22
 */

import * as http from "http";
import * as net from "net";
import * as crypto from "crypto";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import {
  recordTalk, recordPat, getRelationship, checkAbsence,
  shouldKamatte, recordKamatte, getMilestoneReaction, getFamiliarityLevel,
} from "./shikishima-relationship.mjs";
import { prepareSecretarySpeech } from "./shikishima-secretary-filter.mjs";

// ─── 設定 ─────────────────────────────────────────────────────────────────────
const _ENV_PATH = process.env.SHIKISHIMA_ENV_PATH || resolve(process.cwd(), ".env.local");

function _stripEnvQuotes(value) {
  if (value.length < 2) return value;
  const first = value[0];
  const last = value[value.length - 1];
  return (first === last && (first === "\"" || first === "'")) ? value.slice(1, -1) : value;
}

function _readEnvVar(key) {
  try {
    if (!existsSync(_ENV_PATH)) return "";
    for (const line of readFileSync(_ENV_PATH, "utf-8").split("\n")) {
      const t = line.trim();
      if (t.startsWith("#") || !t.includes("=")) continue;
      const i = t.indexOf("=");
      if (t.slice(0, i).trim() === key) return _stripEnvQuotes(t.slice(i + 1).trim());
    }
  } catch { /* ignore */ }
  return "";
}

function _readNumberEnvVar(key, fallback) {
  const raw = process.env[key] || _readEnvVar(key);
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

const STACKCHAN_IP      = process.env.STACKCHAN_HOST || process.env.STACKCHAN_IP || _readEnvVar("STACKCHAN_HOST") || _readEnvVar("STACKCHAN_IP") || "127.0.0.1";
const STACKCHAN_WS_PORT = 8080;
const VOICEVOX_URL      = "http://localhost:50021";
const PCM_CHUNK_SAMPLES = 960;       // 60ms at 16kHz
const DEFAULT_FACE      = "normal";

let _speakerId = 1;
let _speed     = 1.2;
let _enabled   = true;
let _lastStatus = { connected: false, voicevoxReady: false };

export function setSpeakerId(id) { _speakerId = Math.max(0, Math.min(100, Math.round(id))); }
export function setSpeed(s)      { _speed     = Math.max(0.5, Math.min(2.0, s)); }
export function setEnabled(v)    { _enabled   = !!v; }
export function getStatus()      { return { ..._lastStatus }; }

// ─── HTTP ユーティリティ ──────────────────────────────────────────────────────

function httpPost(url, body, contentType) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const data = Buffer.isBuffer(body) ? body : Buffer.from(body);
    const req = http.request({
      hostname: urlObj.hostname,
      port: Number(urlObj.port) || 80,
      path: urlObj.pathname + urlObj.search,
      method: "POST",
      headers: { "Content-Type": contentType, "Content-Length": data.length },
      timeout: 10_000,
    }, res => {
      const chunks = [];
      res.on("data", c => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("httpPost timeout")); });
    req.write(data);
    req.end();
  });
}

function httpGet(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, res => {
      const chunks = [];
      res.on("data", c => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    });
    req.on("error", reject);
    req.setTimeout(8_000, () => { req.destroy(); reject(new Error("httpGet timeout")); });
  });
}

// ─── VOICEVOX TTS ─────────────────────────────────────────────────────────────

async function voicevoxSynthesize(text) {
  const queryUrl = `${VOICEVOX_URL}/audio_query?text=${encodeURIComponent(text)}&speaker=${_speakerId}`;
  const queryBuf = await httpPost(queryUrl, "", "application/json");
  const query = JSON.parse(queryBuf.toString("utf-8"));
  query.speedScale = _speed;
  const minVolume = Math.max(
    0.1,
    Math.min(2.0, _readNumberEnvVar("STACKCHAN_VOICEVOX_VOLUME", _readNumberEnvVar("VOICEVOX_VOLUME", 1.0))),
  );
  query.volumeScale = Math.max(Number(query.volumeScale) || 1.0, minVolume);

  const wavBuf = await httpPost(
    `${VOICEVOX_URL}/synthesis?speaker=${_speakerId}`,
    JSON.stringify(query),
    "application/json",
  );
  return wavBuf;
}

// WAV → 16kHz mono PCM16
function wavToPcm16k(wav) {
  const origRate    = wav.readUInt32LE(24);
  const nChannels   = wav.readUInt16LE(22);
  const bitsPerSample = wav.readUInt16LE(34);

  let dataOffset = 44;
  for (let i = 12; i < 44; i++) {
    if (wav.toString("ascii", i, i + 4) === "data") { dataOffset = i + 8; break; }
  }

  const rawSamples = (wav.length - dataOffset) / (bitsPerSample / 8);
  const samples = new Int16Array(rawSamples);
  if (bitsPerSample === 16) {
    for (let i = 0; i < rawSamples; i++) samples[i] = wav.readInt16LE(dataOffset + i * 2);
  }

  let mono;
  if (nChannels === 2) {
    mono = new Int16Array(rawSamples / 2);
    for (let i = 0; i < mono.length; i++) mono[i] = Math.round((samples[i * 2] + samples[i * 2 + 1]) / 2);
  } else {
    mono = samples;
  }

  if (origRate !== 16000) {
    const ratio  = 16000 / origRate;
    const newLen = Math.floor(mono.length * ratio);
    const resampled = new Int16Array(newLen);
    for (let i = 0; i < newLen; i++) resampled[i] = mono[Math.floor(i / ratio)];
    return Buffer.from(resampled.buffer);
  }
  return Buffer.from(mono.buffer);
}

// ─── WebSocket (生TCP実装 — ws依存なし) ──────────────────────────────────────

function wsSendText(sock, text) {
  const payload = Buffer.from(text, "utf-8");
  const mask = crypto.randomBytes(4);
  const masked = Buffer.alloc(payload.length);
  for (let i = 0; i < payload.length; i++) masked[i] = payload[i] ^ mask[i % 4];
  const n = payload.length;
  let header;
  if      (n < 126)   header = Buffer.from([0x81, 0x80 | n]);
  else if (n < 65536) { header = Buffer.alloc(4); header[0] = 0x81; header[1] = 0xFE; header.writeUInt16BE(n, 2); }
  else                { header = Buffer.alloc(10); header[0] = 0x81; header[1] = 0xFF; header.writeBigUInt64BE(BigInt(n), 2); }
  sock.write(Buffer.concat([header, mask, masked]));
}

function withStackchanToken(payload) {
  const tok = _readEnvVar("STACKCHAN_CONTROL_TOKEN");
  return tok ? { ...payload, token: tok } : payload;
}

function wsSendJson(sock, payload) {
  wsSendText(sock, JSON.stringify(withStackchanToken(payload)));
}

function wsSendBinary(sock, data) {
  const mask = crypto.randomBytes(4);
  const masked = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i++) masked[i] = data[i] ^ mask[i % 4];
  const n = data.length;
  let header;
  if      (n < 126)   header = Buffer.from([0x82, 0x80 | n]);
  else if (n < 65536) { header = Buffer.alloc(4); header[0] = 0x82; header[1] = 0xFE; header.writeUInt16BE(n, 2); }
  else                { header = Buffer.alloc(10); header[0] = 0x82; header[1] = 0xFF; header.writeBigUInt64BE(BigInt(n), 2); }
  sock.write(Buffer.concat([header, mask, masked]));
}

function parseServerFrames(buffer) {
  const frames = [];
  let offset = 0;
  while (buffer.length - offset >= 2) {
    const b0 = buffer[offset];
    const b1 = buffer[offset + 1];
    const opcode = b0 & 0x0f;
    const masked = (b1 & 0x80) !== 0;
    let length = b1 & 0x7f;
    let headerLength = 2;
    if (length === 126) {
      if (buffer.length - offset < 4) break;
      length = buffer.readUInt16BE(offset + 2);
      headerLength = 4;
    } else if (length === 127) {
      if (buffer.length - offset < 10) break;
      const big = buffer.readBigUInt64BE(offset + 2);
      if (big > BigInt(Number.MAX_SAFE_INTEGER)) break;
      length = Number(big);
      headerLength = 10;
    }
    const maskLength = masked ? 4 : 0;
    const frameLength = headerLength + maskLength + length;
    if (buffer.length - offset < frameLength) break;
    const payloadStart = offset + headerLength + maskLength;
    let payload = Buffer.from(buffer.subarray(payloadStart, payloadStart + length));
    if (masked) {
      const frameMask = buffer.subarray(offset + headerLength, offset + headerLength + 4);
      for (let i = 0; i < payload.length; i++) payload[i] ^= frameMask[i % 4];
    }
    frames.push({ opcode, payload });
    offset += frameLength;
  }
  return { frames, rest: buffer.subarray(offset) };
}

function createDeviceErrorWatcher(sock) {
  let buffer = Buffer.alloc(0);
  let errorReason = null;
  const waiters = new Set();
  const notify = () => {
    for (const waiter of waiters) waiter(errorReason);
    waiters.clear();
  };
  const inspect = () => {
    const parsed = parseServerFrames(buffer);
    buffer = Buffer.from(parsed.rest);
    for (const frame of parsed.frames) {
      if (frame.opcode !== 1) continue;
      try {
        const msg = JSON.parse(frame.payload.toString("utf8"));
        if (msg?.type === "error" && typeof msg.reason === "string") {
          errorReason = msg.reason;
          notify();
        }
      } catch { /* ignore non-JSON text frames */ }
    }
  };
  const onData = chunk => {
    buffer = Buffer.concat([buffer, chunk]);
    inspect();
  };
  sock.on("data", onData);
  return {
    wait(ms = 80) {
      if (errorReason) return Promise.resolve(errorReason);
      return new Promise(resolve => {
        const timer = setTimeout(() => {
          waiters.delete(done);
          resolve(errorReason);
        }, ms);
        const done = reason => {
          clearTimeout(timer);
          waiters.delete(done);
          resolve(reason);
        };
        waiters.add(done);
      });
    },
    close() {
      sock.off("data", onData);
      waiters.clear();
    },
  };
}

async function sendJsonChecked(sock, watcher, payload, waitMs = 80) {
  wsSendJson(sock, payload);
  const reason = await watcher.wait(waitMs);
  return reason ? `device_rejected_${reason}` : null;
}

function connectWs() {
  return new Promise((resolve, reject) => {
    const key = crypto.randomBytes(16).toString("base64");
    const sock = net.createConnection({ host: STACKCHAN_IP, port: STACKCHAN_WS_PORT });
    sock.setTimeout(5000);
    sock.on("timeout", () => reject(new Error("WS connect timeout")));
    sock.on("error", reject);
    sock.once("connect", () => {
      sock.write([
        "GET / HTTP/1.1",
        `Host: ${STACKCHAN_IP}:${STACKCHAN_WS_PORT}`,
        "Upgrade: websocket",
        "Connection: Upgrade",
        `Sec-WebSocket-Key: ${key}`,
        "Sec-WebSocket-Version: 13",
        "", "",
      ].join("\r\n"));
    });
    let buf = Buffer.alloc(0);
    const onData = chunk => {
      buf = Buffer.concat([buf, chunk]);
      if (buf.includes(Buffer.from("\r\n\r\n"))) {
        if (buf.toString("ascii", 0, 12).includes("101")) {
          sock.off("data", onData);
          sock.setTimeout(0);
          resolve(sock);
        } else {
          reject(new Error("WS handshake failed"));
        }
      }
    };
    sock.on("data", onData);
  });
}

// ─── テキストから感情を推定 ───────────────────────────────────────────────────

function detectEmotion(text) {
  if (/嬉しい|よかった|ありがとう|おめでとう|素晴らしい|最高|楽し/.test(text)) return "happy";
  if (/ごめん|申し訳|残念|悲しい|難し|できません/.test(text))               return "sad";
  if (/考え|調べ|確認|分析|検討|えーと/.test(text))                         return "thinking";
  if (/驚|びっくり|えっ|まさか/.test(text))                                  return "surprised";
  if (/了解|わかった|はい|承知|OK/.test(text))                               return "agree";
  if (/頑張|やる|絶対|任せて|いくぞ/.test(text))                             return "ganbaru";
  return "normal";
}

// ─── F10: エージェント別身体特性 ─────────────────────────────────────────────

const AGENT_MOTION_PROFILE = {
  shikishima: { panScale: 0.8,  tiltScale: 0.8,  speedFactor: 1.0, quirk: "pre_nod"    },
  shizume:    { panScale: 0.6,  tiltScale: 0.5,  speedFactor: 0.7, quirk: "look_upleft" },
  tsumugi:    { panScale: 1.2,  tiltScale: 1.1,  speedFactor: 1.2, quirk: "post_dance"  },
  hajime:     { panScale: 0.9,  tiltScale: 0.7,  speedFactor: 1.3, quirk: "look_down_num" },
  shirube:    { panScale: 1.4,  tiltScale: 1.3,  speedFactor: 0.9, quirk: "head_tilt_often" },
};

// F10 基準サーボ角度 (panScale/tiltScale=1.0 のとき)
const BASE_PAN_DEG  = 30;
const BASE_TILT_DEG = 25;

// ─── F5: 文節解析ヘルパー ─────────────────────────────────────────────────────

function analyzeText(text) {
  const hasQuestion   = /[？?]/.test(text);
  const hasExclaim    = /[！!]/.test(text);
  const clauseCount   = (text.match(/[、,]/g) || []).length;
  const len           = text.length;
  const motions       = [];

  if (hasQuestion)           motions.push("head_tilt");
  else if (hasExclaim)       motions.push("nod");

  // 長文の途中うなずきタイミング (文字数→ms換算: 約80ms/文字)
  const midPoints = [];
  if (len > 40) {
    const speakMs = len * 80;
    for (let t = 2000; t < speakMs - 1000; t += 2500) midPoints.push(t);
  }
  return { hasQuestion, hasExclaim, clauseCount, len, motions, midPoints };
}

// 感情 → サーボモーション対応表
const EMOTION_MOTION_MAP = {
  happy:     "task_done",   // 喜び → うれしい完了モーション
  agree:     "task_accept", // 了解 → 受け取りモーション
  sad:       "look_down",   // 悲しみ → うつむく
  thinking:  "thinking_scan", // 考え中 → 公式/AIagent風の見回し
  surprised: "shake",       // 驚き → 首振り
  ganbaru:   "spin",        // 頑張る → くるっと回転
  normal:    null,          // 通常 → モーションなし
};

// ─── サーボ/モーション API ────────────────────────────────────────────────────

function normalizeMoveAction(action) {
  const aliases = {
    head_shake: "shake",
    head_tilt: "aiagent_think",
    tilt: "aiagent_think",
    talk: "aiagent_speak",
    speak: "aiagent_speak",
    official: "official_speak",
    aiagent: "aiagent_speak",
  };
  return aliases[action] ?? action;
}

/**
 * サーボモーションを送信 (spin/nod/shake/look_around/dance/center 等)
 */
export async function stackchanMove(action) {
  if (!_enabled) return { ok: true, skipped: "disabled" };
  try {
    const firmwareAction = normalizeMoveAction(action);
    const sock = await connectWs();
    if (firmwareAction === "dance") {
      wsSendJson(sock, { type: "dance" });
    } else {
      wsSendJson(sock, { type: "move", action: firmwareAction });
    }
    await delay(150);
    sock.destroy();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

/**
 * 角度指定サーボ移動 (pan: -90~90, tilt: -30~40)
 */
export async function stackchanServo(pan, tilt) {
  if (!_enabled) return { ok: true, skipped: "disabled" };
  try {
    const sock = await connectWs();
    wsSendJson(sock, { type: "servo", pan, tilt });
    await delay(150);
    sock.destroy();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

/**
 * ダンス発動
 */
export async function stackchanDance() {
  return stackchanMove("dance");
}

/**
 * RGB LED preset command. Firmware keeps the command blocked until the
 * SC-LED-01 hardware gate enables the physical LED driver.
 */
export async function stackchanLed(preset = "blue") {
  if (!_enabled) return { ok: true, skipped: "disabled" };
  try {
    const sock = await connectWs();
    wsSendJson(sock, { type: "led", preset });
    await delay(150);
    sock.destroy();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// ─── コア API ─────────────────────────────────────────────────────────────────

/**
 * テキストを発話 (VOICEVOX → 16kHz PCM → WebSocket)
 * @param {string} text
 * @param {{ skipMotion?: boolean, skipMilestone?: boolean }} [opts]
 *   skipMotion — サーボモーション省略
 *   skipMilestone — recordTalk / 連鎖発話省略 (pilot one-shot 用)
 */
export async function stackchanSay(text, opts = {}) {
  if (!_enabled) return { ok: true, skipped: "disabled" };
  try {
    const speech = prepareSecretarySpeech(text, { maxSpeechChars: opts.maxSpeechChars });
    if (!speech.spokenAllowed) return { ok: false, blockedReason: speech.blockedReason ?? "speech_policy_blocked" };
    const safeText = speech.spokenText;
    const wav = await voicevoxSynthesize(safeText);
    const pcm = wavToPcm16k(wav);
    const emotion = detectEmotion(safeText);
    const sock = await connectWs();
    const watcher = createDeviceErrorWatcher(sock);

    try {
      // 感情に対応するサーボモーションを発話前に送信 (skipMotion=true の場合は省略)
      if (!opts.skipMotion) {
        const motion = EMOTION_MOTION_MAP[emotion] ?? null;
        if (motion) {
          const motionError = await sendJsonChecked(sock, watcher, { type: "move", action: motion }, 120);
          if (motionError) return { ok: false, error: motionError };
          await delay(300);
        }
      }

      let deviceError = await sendJsonChecked(sock, watcher, { type: "face_mode", value: emotion }, 120);
      if (deviceError) return { ok: false, error: deviceError };
      await delay(50);
      deviceError = await sendJsonChecked(sock, watcher, { type: "state", value: "speaking" }, 160);
      if (deviceError) return { ok: false, error: deviceError };
      deviceError = await sendJsonChecked(sock, watcher, { type: "subtitle", text: safeText.slice(0, 28) }, 120);
      if (deviceError) return { ok: false, error: deviceError };
      await delay(80);

      // F9: 長文途中うなずき — PCM送信と並行して別接続で送信 (skipMotion時は省略)
      const analysis = analyzeText(safeText);
      const midNodTimer = (!opts.skipMotion && analysis.midPoints.length > 0)
        ? (async () => {
            for (const ms of analysis.midPoints) {
              await delay(ms);
              try {
                const s2 = await connectWs();
                wsSendJson(s2, { type: "move", action: "nod" });
                await delay(100); s2.destroy();
              } catch { /* ignore */ }
            }
          })()
        : null;

      const chunkBytes = PCM_CHUNK_SAMPLES * 2;
      for (let i = 0; i < pcm.length; i += chunkBytes) {
        wsSendBinary(sock, pcm.slice(i, i + chunkBytes));
        const pcmError = await watcher.wait(5);
        if (pcmError) return { ok: false, error: `device_rejected_${pcmError}` };
        await delay(35);
      }

      if (midNodTimer) await midNodTimer.catch(() => {});
      await delay(300);
      deviceError = await sendJsonChecked(sock, watcher, { type: "state", value: "idle" }, 180);
      if (deviceError) return { ok: false, error: deviceError };
      deviceError = await sendJsonChecked(sock, watcher, { type: "face_mode", value: DEFAULT_FACE }, 120);
      if (deviceError) return { ok: false, error: deviceError };
    } finally {
      watcher.close();
      sock.destroy();
    }

    if (!opts.skipMilestone) {
      const rel = recordTalk(safeText.length * 80);
      for (const ms of rel.triggered) {
        const msg = getMilestoneReaction(ms);
        if (msg) setTimeout(() => stackchanSay(msg, { skipMotion: true, skipMilestone: true }).catch(() => {}), 1500);
      }
    }

    console.log(`[StackChan] 発話完了: "${safeText.slice(0, 30)}"`);
    return { ok: true, speechPolicyChanged: speech.changed };
  } catch (e) {
    console.warn(`[StackChan] 発話失敗: ${e.message}`);
    return { ok: false, error: e.message };
  }
}

/**
 * 表情のみ変更
 */
export async function stackchanFace(emotion) {
  if (!_enabled) return { ok: true, skipped: "disabled" };
  try {
    const sock = await connectWs();
    wsSendJson(sock, { type: "face_mode", value: emotion });
    await delay(200);
    sock.destroy();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

/**
 * ステータス確認 (VOICEVOX + WebSocket)
 */
export async function checkStackchanStatus() {
  // VOICEVOX チェック
  let voicevoxReady = false;
  try { await httpGet(`${VOICEVOX_URL}/version`); voicevoxReady = true; }
  catch { /* offline */ }

  // StackChan WebSocket チェック + デフォルト表情セット
  let connected = false;
  let battery;
  try {
    const sock = await connectWs();
    await delay(100);
    sock.destroy();
    connected = true;
  } catch { /* offline */ }

  // HTTP ステータス (バッテリー等)
  if (connected) {
    try {
      const buf = await httpGet(`http://${STACKCHAN_IP}/status`);
      const st = JSON.parse(buf.toString("utf-8"));
      battery = st.batteryLevel;
    } catch { /* ignore */ }
  }

  _lastStatus = { connected, voicevoxReady, battery, checkedAt: new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }) };
  return _lastStatus;
}

// ─── Bot フック ───────────────────────────────────────────────────────────────

/** 起動時の挨拶 */
export async function hookOnBotStart() {
  const h = new Date(Date.now() + 9 * 60 * 60 * 1000).getUTCHours();
  const greet =
    h < 12 ? "おはようございます。しきしまです。" :
    h < 18 ? "こんにちは。今日もよろしくお願いします。" :
             "お疲れ様です。今夜もサポートします。";
  await stackchanSay(greet);
}

/** タスク完了通知 */
export async function hookOnTaskDone(taskTitle) {
  await stackchanFace("happy");
  await delay(500);
  await stackchanSay(`タスク「${taskTitle}」が完了しました。`);
}

/** アラート通知 */
export async function hookOnAlert(message) {
  await stackchanFace("warning");
  await delay(300);
  await stackchanSay(message.slice(0, 50));
}

/** 朝の挨拶 (8:00 JST) */
export async function hookMorningGreeting() {
  await stackchanSay("おはようございます。今日の計画を確認してください。");
}

/** パイプライン作業中 */
export async function hookOnPipelineStart(goal) {
  await stackchanFace("thinking");
  await stackchanSay(`「${goal.slice(0, 20)}」の分析を開始します。`);
}

/** パイプライン完了 */
export async function hookOnPipelineDone() {
  await stackchanFace("happy");
  await stackchanSay("分析が完了しました。結果をご確認ください。");
}

/** DD警告 */
export async function hookOnDdAlert(ddPercent) {
  await stackchanFace("sad");
  await stackchanSay(`ドローダウンが${ddPercent.toFixed(1)}パーセントです。ご注意ください。`);
}

/** 市場速報 */
export async function hookOnMarketReport(shortSummary) {
  await stackchanSay(shortSummary.slice(0, 60));
}

// ─── 定期ステータス監視 ──────────────────────────────────────────────────────

let _monitorTimer = null;

export function startStackchanMonitor(intervalMs = 15_000) {
  if (_monitorTimer) return;
  _monitorTimer = setInterval(async () => {
    await checkStackchanStatus().catch(() => {});
  }, intervalMs);
  // 初回即実行
  checkStackchanStatus()
    .then(s => console.log(`[StackChan] 状態: ${s.connected ? "接続済" : "未接続"} / VOICEVOX: ${s.voicevoxReady ? "OK" : "未起動"}`))
    .catch(() => {});
  console.log(`🤖 StackChan モニター起動 (${intervalMs / 1000}秒ごと)`);
}

export function stopStackchanMonitor() {
  if (_monitorTimer) { clearInterval(_monitorTimer); _monitorTimer = null; }
}

// ─── SC-1: 5エージェント顔パーソナリティ ────────────────────────────────────

// 各エージェントのデフォルト表情と発話時表情
export const AGENT_FACE_PROFILE = {
  shikishima: { idle: "normal",   speak: "normal",    alert: "thinking", done: "happy"    },
  shizume:    { idle: "thinking", speak: "thinking",  alert: "surprised", done: "normal"  },
  tsumugi:    { idle: "happy",    speak: "happy",     alert: "thinking", done: "happy"    },
  hajime:     { idle: "normal",   speak: "normal",    alert: "thinking", done: "happy"    },
  shirube:    { idle: "bored",    speak: "normal",    alert: "surprised", done: "happy"   },
};

// 時間帯別アイドル表情 (24h サイクル対応)
export function getTimeBasedFace() {
  const h = new Date(Date.now() + 9 * 60 * 60 * 1000).getUTCHours();
  if (h >= 0  && h < 6)  return "sleepy";
  if (h >= 6  && h < 9)  return "normal";
  if (h >= 9  && h < 21) return "normal";
  if (h >= 21 && h < 24) return "bored";
  return "normal";
}

/**
 * エージェントIDに合った表情で発話 (F10: エージェント別身体特性 適用)
 * @param {string} agentId - shikishima/shizume/tsumugi/hajime/shirube
 * @param {string} text    - 発話テキスト
 * @param {"speak"|"alert"|"done"} mood - 表情モード
 */
export async function stackchanSayAsAgent(agentId, text, mood = "speak") {
  const faceProf = AGENT_FACE_PROFILE[agentId]   ?? AGENT_FACE_PROFILE.shikishima;
  const motProf  = AGENT_MOTION_PROFILE[agentId] ?? AGENT_MOTION_PROFILE.shikishima;
  const face     = faceProf[mood] ?? faceProf.speak;
  const { panScale, tiltScale, speedFactor, quirk } = motProf;

  if (!_enabled) return { ok: true, skipped: "disabled" };
  try {
    const speech = prepareSecretarySpeech(text);
    if (!speech.spokenAllowed) return { ok: false, blockedReason: speech.blockedReason ?? "speech_policy_blocked" };
    const safeText = speech.spokenText;
    const wav = await voicevoxSynthesize(safeText);
    const pcm = wavToPcm16k(wav);
    // PCM長から再生時間を推定: samples = pcm.length / 2 (16bit), rate = 16000Hz
    const estimatedPlaybackMs = Math.round((pcm.length / 2) / 16000 * 1000);
    const sock = await connectWs();

    // F10: エージェント別サーボ角度
    wsSendJson(sock, {
      type: "servo",
      pan:  Math.round(BASE_PAN_DEG  * panScale),
      tilt: Math.round(BASE_TILT_DEG * tiltScale),
    });
    await delay(80);

    // F10: quirk — 発話前アクション
    const spd = speedFactor;
    if (quirk === "pre_nod") {
      wsSendJson(sock, { type: "move", action: "nod" });
      await delay(Math.round(400 / spd));
    } else if (quirk === "look_upleft") {
      wsSendJson(sock, { type: "move", action: "look_up" });
      await delay(Math.round(500 / spd));
    } else if (quirk === "look_down_num" && /[0-9０-９]/.test(safeText)) {
      wsSendJson(sock, { type: "move", action: "look_down" });
      await delay(Math.round(300 / spd));
    } else if (quirk === "head_tilt_often") {
      wsSendJson(sock, { type: "move", action: normalizeMoveAction("head_tilt") });
      await delay(Math.round(300 / spd));
    }

    // 感情テキスト解析からモーション自動送信
    const autoEmotion = detectEmotion(safeText);
    const autoMotion  = EMOTION_MOTION_MAP[autoEmotion] ?? null;
    if (autoMotion) {
      wsSendJson(sock, { type: "move", action: autoMotion });
      await delay(Math.round(300 / spd));
    }
    wsSendJson(sock, { type: "face_mode", value: face });
    await delay(60);
    wsSendJson(sock, { type: "state", value: "speaking" });
    wsSendJson(sock, { type: "subtitle", text: safeText.slice(0, 28) });
    await delay(80);

    // F9/F10: 発話中うなずきタイミング
    const { midPoints } = analyzeText(safeText);
    let midIdx = 0;
    const chunkBytes = PCM_CHUNK_SAMPLES * 2;
    let elapsed = 0;
    for (let i = 0; i < pcm.length; i += chunkBytes) {
      wsSendBinary(sock, pcm.slice(i, i + chunkBytes));
      await delay(35);
      elapsed += 35;
      if (midIdx < midPoints.length && elapsed >= midPoints[midIdx] / spd) {
        const midAction = quirk === "head_tilt_often" ? normalizeMoveAction("head_tilt") : "nod";
        wsSendJson(sock, { type: "move", action: midAction });
        midIdx++;
      }
    }

    await delay(Math.round(300 * spd));
    wsSendJson(sock, { type: "state", value: "idle" });
    wsSendJson(sock, { type: "face_mode", value: faceProf.idle });

    // サーボをデフォルト角度に戻す
    await delay(200);
    wsSendJson(sock, { type: "servo", pan: BASE_PAN_DEG, tilt: BASE_TILT_DEG });

    sock.destroy();

    // F10: quirk — done 発話後ミニダンス (つむぎ)
    // state:idle 送信後もファームウェアは非同期再生中 (isSpeaking=true) のため、
    // ダンスコマンドを即送ると startDance() が isSpeaking チェックで弾かれる。
    // 再生完了予測時間 + 余裕800ms 後に新規接続で送信する。
    if (quirk === "post_dance" && mood === "done") {
      const danceDelay = estimatedPlaybackMs + 800;
      setTimeout(async () => {
        try {
          const ds = await connectWs();
          wsSendJson(ds, { type: "dance" });
          await delay(100);
          ds.destroy();
        } catch { /* ignore — StackChan が offline でも問題なし */ }
      }, danceDelay);
    }

    console.log(`[StackChan] ${agentId}(${face}): "${safeText.slice(0, 30)}"`);
    return { ok: true, speechPolicyChanged: speech.changed };
  } catch (e) {
    console.warn(`[StackChan] 発話失敗: ${e.message}`);
    return { ok: false, error: e.message };
  }
}

/**
 * 表情アニメーションシーケンス
 * @param {Array<{face:string, ms:number}>} sequence
 */
export async function stackchanAnimateSequence(sequence) {
  if (!_enabled) return { ok: true, skipped: "disabled" };
  try {
      const sock = await connectWs();
      for (const { face, ms } of sequence) {
      wsSendJson(sock, { type: "face_mode", value: face });
      await delay(ms);
    }
    wsSendJson(sock, { type: "face_mode", value: getTimeBasedFace() });
    sock.destroy();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// 定型アニメーション
export const ANIMATIONS = {
  celebrate:    [{ face:"happy", ms:400 }, { face:"surprised", ms:300 }, { face:"happy", ms:500 }],
  taskDone:     [{ face:"happy", ms:600 }, { face:"normal", ms:400 }],
  alert:        [{ face:"surprised", ms:300 }, { face:"thinking", ms:500 }, { face:"surprised", ms:300 }],
  goodMorning:  [{ face:"sleepy", ms:500 }, { face:"normal", ms:400 }, { face:"happy", ms:600 }],
  thinking:     [{ face:"thinking", ms:800 }, { face:"normal", ms:400 }],
  ddWarning:    [{ face:"sad", ms:400 }, { face:"thinking", ms:600 }],
};

export async function playAnimation(name) {
  const seq = ANIMATIONS[name];
  if (!seq) return { ok: false, error: "unknown animation" };
  return stackchanAnimateSequence(seq);
}

/** 時間帯挨拶 — 朝/昼/夜で異なるモーション付き発話 */
export async function hookTimeGreeting() {
  const h = new Date(Date.now() + 9 * 60 * 60 * 1000).getUTCHours();
  if (h >= 5 && h < 10) {
    await stackchanMove("nod");
    await delay(400);
    await stackchanSay("おはようございます。今日も一緒に頑張りましょう。");
  } else if (h >= 10 && h < 17) {
    await stackchanSay("こんにちは。何かお手伝いできることはありますか？");
  } else if (h >= 17 && h < 21) {
    await stackchanSay("お疲れ様です。今夜もよろしくお願いします。");
  } else {
    await stackchanServo(0, -10);
    await delay(300);
    await stackchanSay("夜が更けてきましたね。無理しないでくださいね。");
  }
}

// ─── F2: 環境アウェアネス ─────────────────────────────────────────────────────

let _lastSeenTimer = null;

/** ユーザー活動を記録 (Discordメッセージ受信時に呼ぶ) */
export function recordUserActivity() {
  // recordSeen はトップレベルでインポート済み (shikishima-relationship.mjs)
  try {
    import("./shikishima-relationship.mjs").then(m => m.recordSeen()).catch(() => {});
  } catch { /* ignore */ }
}

/** 帰着検出 — 久しぶり判定してリアクション */
export async function checkAndGreetAbsence() {
  const absence = checkAbsence();
  if (absence === "days") {
    await stackchanMove("look_up");
    await delay(400);
    await stackchanSay("会いたかったです...。また話せてうれしいです。");
  } else if (absence === "day") {
    await stackchanMove("nod");
    await delay(300);
    await stackchanSay("久しぶりですね！元気でしたか？");
  }
}

/** かまって監視ループ (bot起動時に開始) */
export function startKamatteMonitor(sendToDiscord) {
  if (_lastSeenTimer) return;
  _lastSeenTimer = setInterval(async () => {
    if (!shouldKamatte()) return;
    recordKamatte();
    const rel = getRelationship();
    const lv  = rel.level;
    const msgs = [
      `${lv.emoji} ...なんか寂しいです`,
      `${lv.emoji} ねえ、話しかけてほしいな`,
      `${lv.emoji} ...ひとりはちょっとさみしい`,
    ];
    const msg = msgs[Math.floor(Math.random() * msgs.length)];
    if (sendToDiscord) await sendToDiscord(msg).catch(() => {});
    await stackchanFace("sad").catch(() => {});
    console.log("[Kamatte] 発動:", msg);
  }, 5 * 60 * 1000); // 5分ごとにチェック
}

export function stopKamatteMonitor() {
  if (_lastSeenTimer) { clearInterval(_lastSeenTimer); _lastSeenTimer = null; }
}

/** 在席中かチェックして異なるアイドル顔を返す */
export function getContextualIdleFace() {
  const h = new Date(Date.now() + 9 * 3600 * 1000).getUTCHours();
  if (h >= 0  && h < 5)  return "sleepy";
  if (h >= 21 && h < 24) return "sleepy";
  return "normal";
}

// ─── F7: 音楽反応 ─────────────────────────────────────────────────────────────

let _musicTimer = null;

/**
 * 音楽モード開始 — BPMに合わせてダンスフレームを送信
 * @param {number} bpm - デフォルト120
 */
export function startMusicMode(bpm = 120) {
  if (_musicTimer) stopMusicMode();
  const beatMs  = Math.round(60000 / bpm);
  const actions = ["nod", "look_left", "nod", "look_right", "nod", "shake", "nod", "spin"];
  let beat = 0;

  _musicTimer = setInterval(async () => {
    const action = actions[beat % actions.length];
    await stackchanMove(action).catch(() => {});
    beat++;
    if (beat % 16 === 0) await stackchanDance().catch(() => {});
  }, beatMs * 2); // 2拍ごとに動作

  console.log(`[Music] 開始 BPM=${bpm} beat=${beatMs}ms`);
}

export function stopMusicMode() {
  if (_musicTimer) { clearInterval(_musicTimer); _musicTimer = null; }
  stackchanMove("center").catch(() => {});
  console.log("[Music] 停止");
}

export function isMusicMode() { return !!_musicTimer; }

// ─── F6: パット記録エクスポート (bot から呼ぶ) ───────────────────────────────

export async function onPatEvent(mode) {
  const rel = recordPat();
  for (const ms of rel.triggered) {
    const msg = getMilestoneReaction(ms);
    if (msg) {
      await delay(800);
      await stackchanSay(msg).catch(() => {});
    }
  }
  return rel;
}

// ─── ユーティリティ ───────────────────────────────────────────────────────────
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
