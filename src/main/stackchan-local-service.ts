/**
 * StackChan Local Service
 * Pipeline: VOICEVOX (localhost:50021) -> 16kHz PCM -> WebSocket (ws://stackchan:8080)
 * Firmware: stackchan-pet-fw v0.1.0
 * Confirmed working: 2026-05-22
 */

import * as http from "http";
import * as net from "net";
import * as crypto from "crypto";
import {
  resolveStackChanHost,
  resolveStackChanToken
} from "./stackchan-voice-route/stackchan-voice-env";
import { speakProductionVoiceOnce } from "./stackchan-voice-route/stackchan-voice-production-speak";

const STACKCHAN_WS_PORT = 8080;
const VOICEVOX_URL = "http://localhost:50021";

type StackchanLedPreset = "off" | "blue" | "pass" | "hold" | "stop" | "dance";
let _voicevoxSpeaker = 1;       // Speaker ID (0-100). UI can change this.
let _voicevoxSpeed = 1.2;       // Speech speed. UI can change this.

export function setVoicevoxSpeaker(speakerId: number): void {
  _voicevoxSpeaker = Math.max(0, Math.min(100, Math.round(speakerId)));
}
export function getVoicevoxSpeaker(): number { return _voicevoxSpeaker; }

export function setVoicevoxSpeed(speed: number): void {
  _voicevoxSpeed = Math.max(0.5, Math.min(2.0, speed));
}
export function getVoicevoxSpeed(): number { return _voicevoxSpeed; }
const DEFAULT_FACE = "normal"; // pet-fw face_mode default
const PCM_CHUNK_SAMPLES = 960; // 60ms at 16kHz

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
  const queryUrl = `${VOICEVOX_URL}/audio_query?text=${encodeURIComponent(text)}&speaker=${_voicevoxSpeaker}`;
  const queryBuf = await httpPost(queryUrl, "", "application/json");

  // Adjust speed and pitch
  const query = JSON.parse(queryBuf.toString("utf8")) as Record<string, unknown>;
  query["speedScale"] = _voicevoxSpeed;
  // query["pitchScale"] = 0.05; // Raise pitch slightly when needed.

  const wavBuf = await httpPost(
    `${VOICEVOX_URL}/synthesis?speaker=${_voicevoxSpeaker}`,
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

  // Stereo -> mono
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

function withStackchanToken<T extends Record<string, unknown>>(payload: T): T & { token?: string } {
  const token = resolveStackChanToken();
  return token ? { ...payload, token } : payload;
}

function wsSendJson(sock: net.Socket, payload: Record<string, unknown>): void {
  wsSendText(sock, JSON.stringify(withStackchanToken(payload)));
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
    const host = resolveStackChanHost();
    const key = crypto.randomBytes(16).toString("base64");
    const sock = net.createConnection({ host, port: STACKCHAN_WS_PORT });
    sock.setTimeout(5000);
    sock.on("timeout", () => reject(new Error("WS connect timeout")));
    sock.on("error", reject);
    sock.once("connect", () => {
      sock.write([
        "GET / HTTP/1.1",
        `Host: ${host}:${STACKCHAN_WS_PORT}`,
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
  const result = await speakProductionVoiceOnce(text);
  return result.ok ? { ok: true } : { ok: false, error: result.errorCode };
}

export async function stackchanFaceLocal(emotion: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const sock = await connectWs();
    wsSendJson(sock, { type: "face_mode", value: emotion });
    await new Promise<void>((r) => setTimeout(r, 200));
    sock.destroy();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function stackchanDanceLocal(): Promise<{ ok: boolean; error?: string }> {
  try {
    const sock = await connectWs();
    wsSendJson(sock, { type: "dance" });
    await new Promise<void>((r) => setTimeout(r, 150));
    sock.destroy();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function stackchanLedLocal(
  preset: StackchanLedPreset,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const sock = await connectWs();
    wsSendJson(sock, { type: "led", preset });
    await new Promise<void>((r) => setTimeout(r, 150));
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

  // Check StackChan WebSocket without changing face, state, or servo position.
  let connected = false;
  try {
    const sock = await connectWs();
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
      const statusBuf = await httpGet(`http://${resolveStackChanHost()}/status`);
      const st = JSON.parse(statusBuf.toString("utf8")) as {
        styleId?: string; affectionLevel?: string; batteryLevel?: number;
      };
      styleId = st.styleId;
      affectionLevel = st.affectionLevel;
      battery = st.batteryLevel;
    } catch { /* ignore */ }
  }

  return {
    connected,
    stackchanIp: resolveStackChanHost() !== "127.0.0.1" ? "configured" : "not_configured",
    voicevoxReady: _voicevoxReady,
    styleId,
    affectionLevel,
    battery,
  };
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

// Pet mode implementation (face, motion, voice)
export async function stackchanPetMode(mode: 1 | 2 | 3): Promise<{ ok: boolean; error?: string }> {
  try {
    const sock = await connectWs();
    let text = "";
    let face = "normal";
    let motion = "center";

    if (mode === 1) {
      // Positive nod mode
      text = "\u3075\u3075\u3001\u5b09\u3057\u3044";
      face = "happy";
      motion = "nod";
    } else if (mode === 2) {
      // Ticklish shake mode
      text = "\u3061\u3087\u3063\u3068\u304f\u3059\u3050\u3063\u305f\u3044\u2026";
      face = "shy";
      motion = "shake";
    } else if (mode === 3) {
      // Sweet upward-glance mode
      text = "\u3082\u3063\u3068\u2026\uff1f";
      face = "sweet";
      motion = "look_up";
    }

    wsSendJson(sock, { type: "face_mode", value: face });
    await new Promise<void>((r) => setTimeout(r, 100));
    // Firmware only handles the "move" type. The "motion" type is ignored.
    wsSendJson(sock, { type: "move", action: motion });
    await new Promise<void>((r) => setTimeout(r, 300));

    // Clear previous subtitles before speaking.
    wsSendJson(sock, { type: "subtitle", text: "" });
    await new Promise<void>((r) => setTimeout(r, 30));

    // Voice playback (simplified SayLocal path).
    const wav = await voicevoxSynthesize(text);
    const pcm = wavToPcm16k(wav);
    wsSendJson(sock, { type: "state", value: "speaking" });
    // Display pet speech as subtitle.
    wsSendJson(sock, { type: "subtitle", text: text.slice(0, 20) });
    const chunkBytes = PCM_CHUNK_SAMPLES * 2;
    for (let i = 0; i < pcm.length; i += chunkBytes) {
      wsSendBinary(sock, pcm.slice(i, i + chunkBytes));
      await new Promise<void>((r) => setTimeout(r, 35));
    }
    await new Promise<void>((r) => setTimeout(r, 400));
    wsSendJson(sock, { type: "state", value: "idle" });
    wsSendJson(sock, { type: "face_mode", value: DEFAULT_FACE });
    // Firmware only handles the "move" type. center = servoMove(0,0).
    wsSendJson(sock, { type: "move", action: "center" });
    sock.destroy();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

