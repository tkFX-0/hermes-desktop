/**
 * StackChan Local Service
 * Pipeline: VOICEVOX (localhost:50021) → 16kHz PCM → WebSocket (ws://stackchan:8080)
 * Firmware: stackchan-pet-fw v0.1.0
 * Confirmed working: 2026-05-22
 */

import * as http from "http";
import * as net from "net";
import * as crypto from "crypto";

const STACKCHAN_IP = "192.168.1.75";
const STACKCHAN_WS_PORT = 8080;
const VOICEVOX_URL = "http://localhost:50021";
const VOICEVOX_SPEAKER = 1;     // 話者ID。変更: .env.local に STACKCHAN_SPEAKER=N
let _voicevoxSpeed = 1.2;       // 話す速度（UI から変更可能）

export function setVoicevoxSpeed(speed: number): void {
  _voicevoxSpeed = Math.max(0.5, Math.min(2.0, speed));
}
export function getVoicevoxSpeed(): number { return _voicevoxSpeed; }
const DEFAULT_FACE = "normal"; // pet-fw face_mode デフォルト
const PCM_CHUNK_SAMPLES = 960; // 60ms at 16kHz

// Grok返答のテキストから感情を推定してpet-fwのface_modeを返す
function detectEmotion(text: string): string {
  const t = text;
  if (/嬉しい|よかった|ありがとう|おめでとう|素晴らしい|最高|楽し/.test(t)) return "happy";
  if (/ごめん|申し訳|残念|悲しい|難し|できません/.test(t)) return "sad";
  if (/考え|調べ|確認|分析|検討|えーと/.test(t)) return "thinking";
  if (/驚|びっくり|えっ|まさか|信じられ/.test(t)) return "surprised";
  return "normal";
}

export interface StackchanLocalStatus {
  connected: boolean;
  stackchanIp: string;
  voicevoxReady: boolean;
  styleId?: string;
  affectionLevel?: string;
  battery?: number;
}

let _voicevoxReady = false;
let _statusCheckTimer: ReturnType<typeof setInterval> | null = null;

function httpPost(url: string, body: Buffer | string, contentType: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const data = Buffer.isBuffer(body) ? body : Buffer.from(body);
    const req = http.request({
      hostname: urlObj.hostname,
      port: Number(urlObj.port) || 80,
      path: urlObj.pathname + urlObj.search,
      method: "POST",
      headers: { "Content-Type": contentType, "Content-Length": data.length },
    }, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (c: Buffer) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    });
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

function httpGet(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (c: Buffer) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    }).on("error", reject);
  });
}

async function voicevoxSynthesize(text: string): Promise<Buffer> {
  const queryUrl = `${VOICEVOX_URL}/audio_query?text=${encodeURIComponent(text)}&speaker=${VOICEVOX_SPEAKER}`;
  const queryBuf = await httpPost(queryUrl, "", "application/json");

  // Adjust speed and pitch
  const query = JSON.parse(queryBuf.toString("utf8")) as Record<string, unknown>;
  query["speedScale"] = _voicevoxSpeed;
  // query["pitchScale"] = 0.05; // 声のピッチ上げたい場合

  const wavBuf = await httpPost(
    `${VOICEVOX_URL}/synthesis?speaker=${VOICEVOX_SPEAKER}`,
    JSON.stringify(query),
    "application/json",
  );
  return wavBuf;
}

function wavToPcm16k(wav: Buffer): Buffer {
  // WAV header: 44 bytes standard
  const origRate = wav.readUInt32LE(24);
  const nChannels = wav.readUInt16LE(22);
  const bitsPerSample = wav.readUInt16LE(34);

  // Find data chunk
  let dataOffset = 44;
  for (let i = 12; i < 44; i++) {
    if (wav.toString("ascii", i, i + 4) === "data") {
      dataOffset = i + 8;
      break;
    }
  }

  const rawSamples = (wav.length - dataOffset) / (bitsPerSample / 8);
  const samples = new Int16Array(rawSamples);

  if (bitsPerSample === 16) {
    for (let i = 0; i < rawSamples; i++) {
      samples[i] = wav.readInt16LE(dataOffset + i * 2);
    }
  }

  // Stereo → mono
  let mono: Int16Array;
  if (nChannels === 2) {
    mono = new Int16Array(rawSamples / 2);
    for (let i = 0; i < mono.length; i++) {
      mono[i] = Math.round((samples[i * 2] + samples[i * 2 + 1]) / 2);
    }
  } else {
    mono = samples;
  }

  // Resample to 16kHz
  if (origRate !== 16000) {
    const ratio = 16000 / origRate;
    const newLen = Math.floor(mono.length * ratio);
    const resampled = new Int16Array(newLen);
    for (let i = 0; i < newLen; i++) {
      resampled[i] = mono[Math.floor(i / ratio)];
    }
    return Buffer.from(resampled.buffer);
  }

  return Buffer.from(mono.buffer);
}

function wsSendText(sock: net.Socket, text: string): void {
  const payload = Buffer.from(text, "utf8");
  const mask = crypto.randomBytes(4);
  const masked = Buffer.alloc(payload.length);
  for (let i = 0; i < payload.length; i++) masked[i] = payload[i] ^ mask[i % 4];
  const n = payload.length;
  let header: Buffer;
  if (n < 126) header = Buffer.from([0x81, 0x80 | n]);
  else if (n < 65536) { header = Buffer.alloc(4); header[0] = 0x81; header[1] = 0x80 | 126; header.writeUInt16BE(n, 2); }
  else { header = Buffer.alloc(10); header[0] = 0x81; header[1] = 0x80 | 127; header.writeBigUInt64BE(BigInt(n), 2); }
  sock.write(Buffer.concat([header, mask, masked]));
}

function wsSendBinary(sock: net.Socket, data: Buffer): void {
  const mask = crypto.randomBytes(4);
  const masked = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i++) masked[i] = data[i] ^ mask[i % 4];
  const n = data.length;
  let header: Buffer;
  if (n < 126) header = Buffer.from([0x82, 0x80 | n]);
  else if (n < 65536) { header = Buffer.alloc(4); header[0] = 0x82; header[1] = 0x80 | 126; header.writeUInt16BE(n, 2); }
  else { header = Buffer.alloc(10); header[0] = 0x82; header[1] = 0x80 | 127; header.writeBigUInt64BE(BigInt(n), 2); }
  sock.write(Buffer.concat([header, mask, masked]));
}

function connectWs(): Promise<net.Socket> {
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
    const onData = (chunk: Buffer): void => {
      buf = Buffer.concat([buf, chunk]);
      if (buf.includes(Buffer.from("\r\n\r\n"))) {
        const status = buf.toString("ascii", 0, 12);
        if (status.includes("101")) {
          sock.off("data", onData);
          sock.setTimeout(0);
          resolve(sock);
        } else {
          reject(new Error(`WS handshake failed: ${status}`));
        }
      }
    };
    sock.on("data", onData);
  });
}

export async function stackchanSayLocal(text: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const wav = await voicevoxSynthesize(text);
    const pcm = wavToPcm16k(wav);
    const emotion = detectEmotion(text);

    const sock = await connectWs();

    // 表情を先に設定してから発話
    wsSendText(sock, JSON.stringify({ type: "face_mode", value: emotion }));
    await new Promise<void>((r) => setTimeout(r, 50));
    wsSendText(sock, JSON.stringify({ type: "state", value: "speaking" }));
    await new Promise<void>((r) => setTimeout(r, 80));

    const chunkBytes = PCM_CHUNK_SAMPLES * 2;
    for (let i = 0; i < pcm.length; i += chunkBytes) {
      wsSendBinary(sock, pcm.slice(i, i + chunkBytes));
      await new Promise<void>((r) => setTimeout(r, 35));
    }

    await new Promise<void>((r) => setTimeout(r, 300));
    wsSendText(sock, JSON.stringify({ type: "state", value: "idle" }));
    wsSendText(sock, JSON.stringify({ type: "face_mode", value: DEFAULT_FACE }));
    sock.destroy();

    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function stackchanFaceLocal(emotion: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const sock = await connectWs();
    wsSendText(sock, JSON.stringify({ type: "face_mode", value: emotion }));
    await new Promise<void>((r) => setTimeout(r, 200));
    sock.destroy();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function checkStackchanLocalStatus(): Promise<StackchanLocalStatus> {
  // Check VOICEVOX
  try {
    await httpGet(`${VOICEVOX_URL}/version`);
    _voicevoxReady = true;
  } catch {
    _voicevoxReady = false;
  }

  // Check StackChan WebSocket — set normal face + center pose (suppresses autonomous dance)
  let connected = false;
  try {
    const sock = await connectWs();
    wsSendText(sock, JSON.stringify({ type: "face_mode", value: DEFAULT_FACE }));
    wsSendText(sock, JSON.stringify({ type: "state", value: "idle" }));
    wsSendText(sock, JSON.stringify({ type: "motion", name: "center" }));
    await new Promise<void>((r) => setTimeout(r, 100));
    sock.destroy();
    connected = true;
  } catch { /* offline */ }

  // Fetch StackChan status info (face style, affection, battery)
  let styleId: string | undefined;
  let affectionLevel: string | undefined;
  let battery: number | undefined;
  if (connected) {
    try {
      const statusBuf = await httpGet(`http://${STACKCHAN_IP}/status`);
      const st = JSON.parse(statusBuf.toString("utf8")) as {
        styleId?: string; affectionLevel?: string; batteryLevel?: number;
      };
      styleId = st.styleId;
      affectionLevel = st.affectionLevel;
      battery = st.batteryLevel;
    } catch { /* ignore */ }
  }

  return { connected, stackchanIp: STACKCHAN_IP, voicevoxReady: _voicevoxReady, styleId, affectionLevel, battery };
}

export function startStackchanLocalStatusCheck(): void {
  if (_statusCheckTimer) return;
  _statusCheckTimer = setInterval(() => {
    checkStackchanLocalStatus().catch(() => {/* ignore */});
  }, 15_000);
}

export function stopStackchanLocalStatusCheck(): void {
  if (_statusCheckTimer) { clearInterval(_statusCheckTimer); _statusCheckTimer = null; }
}
