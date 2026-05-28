/**
 * Production voice path — protocol parity with scripts/shikishima-stackchan.mjs stackchanSay.
 * Guarded: fixed phrase length only; no milestone / recordTalk side effects.
 */

import * as crypto from "crypto";
import * as http from "http";
import * as net from "net";
import { bootstrapStackChanEnvFromLocalFile } from "./stackchan-env-bootstrap";
import {
  readEnvLocal,
  resolveStackChanHost,
  resolveStackChanToken
} from "./stackchan-voice-env";

export type GuardedVoiceSpeakResult = { ok: true } | { ok: false; errorCode: string };

const VOICEVOX_URL = "http://localhost:50021";
const PCM_CHUNK_SAMPLES = 960;
const PCM_CHUNK_DELAY_MS = 35;
const DEFAULT_FACE = "normal";

const EMOTION_MOTION_MAP: Record<string, string | null> = {
  happy: "task_done",
  agree: "task_accept",
  sad: "look_down",
  thinking: "thinking_scan",
  surprised: "shake",
  ganbaru: "spin",
  normal: null
};

function detectEmotion(text: string): string {
  const t = text;
  if (/(?:嬉しい|よかった|ありがとう|おめでとう|素晴らしい|最高|楽しい)/u.test(t)) return "happy";
  if (/(?:ごめん|申し訳|残念|悲しい|難しい|できません)/u.test(t)) return "sad";
  if (/(?:考え|調べ|確認|分析|検証|えーと)/u.test(t)) return "thinking";
  if (/(?:驚|びっくり|えっ|まさか|信じられ)/u.test(t)) return "surprised";
  if (/(?:よろしく|了解|承知|わかり)/u.test(t)) return "agree";
  return "normal";
}

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function httpPost(url: string, body: Buffer | string, contentType: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const data = Buffer.isBuffer(body) ? body : Buffer.from(body);
    const req = http.request(
      {
        hostname: urlObj.hostname,
        port: Number(urlObj.port) || 80,
        path: urlObj.pathname + urlObj.search,
        method: "POST",
        headers: { "Content-Type": contentType, "Content-Length": data.length }
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (c: Buffer) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
        res.on("error", reject);
      }
    );
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

function httpGet(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      res.on("data", () => {});
      res.on("end", () => resolve());
      res.on("error", reject);
    }).on("error", reject);
  });
}

function resolveVoicevoxSpeakerId(): number {
  const raw =
    process.env.VOICEVOX_SPEAKER_ID ??
    readEnvLocal("VOICEVOX_SPEAKER_ID") ??
    readEnvLocal("STACKCHAN_VOICEVOX_SPEAKER");
  const n = Number(raw);
  return Number.isFinite(n) ? Math.max(0, Math.min(100, Math.round(n))) : 1;
}

function resolveVoicevoxSpeed(): number {
  const raw = process.env.VOICEVOX_SPEED ?? readEnvLocal("VOICEVOX_SPEED");
  const n = Number(raw);
  return Number.isFinite(n) ? Math.max(0.5, Math.min(2, n)) : 1.2;
}

function resolveVoicevoxVolumeScale(): number {
  const raw =
    process.env.STACKCHAN_VOICEVOX_VOLUME ??
    process.env.VOICEVOX_VOLUME ??
    readEnvLocal("STACKCHAN_VOICEVOX_VOLUME") ??
    readEnvLocal("VOICEVOX_VOLUME");
  const n = Number(raw);
  return Number.isFinite(n) ? Math.max(0.1, Math.min(2, n)) : 1;
}

async function voicevoxSynthesize(text: string): Promise<Buffer> {
  const speaker = resolveVoicevoxSpeakerId();
  const queryUrl = `${VOICEVOX_URL}/audio_query?text=${encodeURIComponent(text)}&speaker=${speaker}`;
  const queryBuf = await httpPost(queryUrl, "", "application/json");
  const query = JSON.parse(queryBuf.toString("utf8")) as Record<string, unknown>;
  query.speedScale = resolveVoicevoxSpeed();
  query.volumeScale = Math.max(Number(query.volumeScale) || 1, resolveVoicevoxVolumeScale());
  return httpPost(
    `${VOICEVOX_URL}/synthesis?speaker=${speaker}`,
    JSON.stringify(query),
    "application/json"
  );
}

function wavToPcm16k(wav: Buffer): Buffer {
  const origRate = wav.readUInt32LE(24);
  const nChannels = wav.readUInt16LE(22);
  const bitsPerSample = wav.readUInt16LE(34);
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
    for (let i = 0; i < rawSamples; i++) samples[i] = wav.readInt16LE(dataOffset + i * 2);
  }
  let mono: Int16Array;
  if (nChannels === 2) {
    mono = new Int16Array(rawSamples / 2);
    for (let i = 0; i < mono.length; i++) mono[i] = Math.round((samples[i * 2] + samples[i * 2 + 1]) / 2);
  } else mono = samples;
  if (origRate !== 16000) {
    const ratio = 16000 / origRate;
    const newLen = Math.floor(mono.length * ratio);
    const resampled = new Int16Array(newLen);
    for (let i = 0; i < newLen; i++) resampled[i] = mono[Math.floor(i / ratio)];
    return Buffer.from(resampled.buffer);
  }
  return Buffer.from(mono.buffer, mono.byteOffset, mono.byteLength);
}

function withToken(payload: Record<string, unknown>): Record<string, unknown> {
  const token = resolveStackChanToken();
  return token ? { ...payload, token } : payload;
}

function wsSendJson(sock: net.Socket, payload: Record<string, unknown>): void {
  const text = JSON.stringify(withToken(payload));
  const data = Buffer.from(text, "utf8");
  const mask = crypto.randomBytes(4);
  const masked = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i++) masked[i] = data[i] ^ mask[i % 4];
  const n = data.length;
  let header: Buffer;
  if (n < 126) header = Buffer.from([0x81, 0x80 | n]);
  else if (n < 65536) {
    header = Buffer.alloc(4);
    header[0] = 0x81;
    header[1] = 0x80 | 126;
    header.writeUInt16BE(n, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x81;
    header[1] = 0x80 | 127;
    header.writeBigUInt64BE(BigInt(n), 2);
  }
  sock.write(Buffer.concat([header, mask, masked]));
}

function wsSendBinary(sock: net.Socket, data: Buffer): void {
  const mask = crypto.randomBytes(4);
  const masked = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i++) masked[i] = data[i] ^ mask[i % 4];
  const n = data.length;
  let header: Buffer;
  if (n < 126) header = Buffer.from([0x82, 0x80 | n]);
  else if (n < 65536) {
    header = Buffer.alloc(4);
    header[0] = 0x82;
    header[1] = 0x80 | 126;
    header.writeUInt16BE(n, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x82;
    header[1] = 0x80 | 127;
    header.writeBigUInt64BE(BigInt(n), 2);
  }
  sock.write(Buffer.concat([header, mask, masked]));
}

type ServerFrame = { opcode: number; payload: Buffer };

function parseServerFrames(buffer: Buffer): { frames: ServerFrame[]; rest: Buffer } {
  const frames: ServerFrame[] = [];
  let offset = 0;
  while (buffer.length - offset >= 2) {
    const b0 = buffer[offset] ?? 0;
    const b1 = buffer[offset + 1] ?? 0;
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
    const payload = Buffer.from(buffer.subarray(payloadStart, payloadStart + length));
    if (masked) {
      const frameMask = buffer.subarray(offset + headerLength, offset + headerLength + 4);
      for (let i = 0; i < payload.length; i++) payload[i] ^= frameMask[i % 4] ?? 0;
    }
    frames.push({ opcode, payload });
    offset += frameLength;
  }
  return { frames, rest: buffer.subarray(offset) };
}

function createDeviceErrorWatcher(sock: net.Socket): {
  wait: (ms?: number) => Promise<string | null>;
  close: () => void;
} {
  let buffer = Buffer.alloc(0);
  let errorReason: string | null = null;
  const waiters = new Set<(reason: string | null) => void>();
  const notify = (): void => {
    for (const waiter of waiters) waiter(errorReason);
    waiters.clear();
  };
  const inspect = (): void => {
    const parsed = parseServerFrames(buffer);
    buffer = Buffer.from(parsed.rest);
    for (const frame of parsed.frames) {
      if (frame.opcode !== 1) continue;
      try {
        const msg = JSON.parse(frame.payload.toString("utf8")) as { type?: unknown; reason?: unknown };
        if (msg.type === "error" && typeof msg.reason === "string") {
          errorReason = msg.reason;
          notify();
        }
      } catch {
        // Ignore non-JSON text frames such as status greetings.
      }
    }
  };
  const onData = (chunk: Buffer): void => {
    buffer = Buffer.concat([buffer, chunk]);
    inspect();
  };
  sock.on("data", onData);
  return {
    wait(ms = 80) {
      if (errorReason) return Promise.resolve(errorReason);
      return new Promise((resolve) => {
        const done = (reason: string | null): void => {
          clearTimeout(timer);
          waiters.delete(done);
          resolve(reason);
        };
        const timer = setTimeout(() => {
          waiters.delete(done);
          resolve(errorReason);
        }, ms);
        waiters.add(done);
      });
    },
    close() {
      sock.off("data", onData);
      waiters.clear();
    }
  };
}

async function sendJsonChecked(
  sock: net.Socket,
  watcher: ReturnType<typeof createDeviceErrorWatcher>,
  payload: Record<string, unknown>,
  waitMs = 80
): Promise<string | null> {
  wsSendJson(sock, payload);
  const reason = await watcher.wait(waitMs);
  return reason ? `device_rejected_${reason}` : null;
}

function connectWs(host: string, port: number): Promise<net.Socket> {
  return new Promise((resolve, reject) => {
    const key = crypto.randomBytes(16).toString("base64");
    const sock = net.createConnection({ host, port });
    sock.setTimeout(8000);
    sock.on("timeout", () => reject(new Error("timeout")));
    sock.on("error", reject);
    sock.once("connect", () => {
      sock.write(
        [
          "GET / HTTP/1.1",
          `Host: ${host}:${port}`,
          "Upgrade: websocket",
          "Connection: Upgrade",
          `Sec-WebSocket-Key: ${key}`,
          "Sec-WebSocket-Version: 13",
          "",
          ""
        ].join("\r\n")
      );
    });
    let buf = Buffer.alloc(0);
    const onData = (chunk: Buffer): void => {
      buf = Buffer.concat([buf, chunk]);
      if (!buf.includes(Buffer.from("\r\n\r\n"))) return;
      const status = buf.toString("ascii", 0, 12);
      if (status.includes("101")) {
        sock.off("data", onData);
        sock.setTimeout(0);
        resolve(sock);
      } else reject(new Error("handshake"));
    };
    sock.on("data", onData);
  });
}

/** stackchanSay-equivalent sequence (shikishima-stackchan.mjs). */
export async function speakProductionVoiceOnce(phrase: string): Promise<GuardedVoiceSpeakResult> {
  bootstrapStackChanEnvFromLocalFile();
  try {
    await httpGet(`${VOICEVOX_URL}/version`);
  } catch {
    return { ok: false, errorCode: "voicevox_unavailable" };
  }

  try {
    const safeText = phrase.slice(0, 80);
    const wav = await voicevoxSynthesize(safeText);
    const pcm = wavToPcm16k(wav);
    if (pcm.length < 100) return { ok: false, errorCode: "pcm_empty" };

    const emotion = detectEmotion(safeText);
    const host = resolveStackChanHost();
    const sock = await connectWs(host, 8080);
    const watcher = createDeviceErrorWatcher(sock);

    try {
      const motion = EMOTION_MOTION_MAP[emotion] ?? null;
      if (motion) {
        const motionError = await sendJsonChecked(sock, watcher, { type: "move", action: motion }, 120);
        if (motionError) return { ok: false, errorCode: motionError };
        await delay(300);
      }
      let deviceError = await sendJsonChecked(sock, watcher, { type: "face_mode", value: emotion }, 120);
      if (deviceError) return { ok: false, errorCode: deviceError };
      await delay(50);
      deviceError = await sendJsonChecked(sock, watcher, { type: "state", value: "speaking" }, 160);
      if (deviceError) return { ok: false, errorCode: deviceError };
      deviceError = await sendJsonChecked(sock, watcher, { type: "subtitle", text: safeText.slice(0, 28) }, 120);
      if (deviceError) return { ok: false, errorCode: deviceError };
      await delay(80);

      const chunkBytes = PCM_CHUNK_SAMPLES * 2;
      for (let i = 0; i < pcm.length; i += chunkBytes) {
        wsSendBinary(sock, pcm.slice(i, i + chunkBytes));
        const pcmError = await watcher.wait(5);
        if (pcmError) return { ok: false, errorCode: `device_rejected_${pcmError}` };
        await delay(PCM_CHUNK_DELAY_MS);
      }

      await delay(300);
      deviceError = await sendJsonChecked(sock, watcher, { type: "state", value: "idle" }, 180);
      if (deviceError) return { ok: false, errorCode: deviceError };
      deviceError = await sendJsonChecked(sock, watcher, { type: "face_mode", value: DEFAULT_FACE }, 120);
      if (deviceError) return { ok: false, errorCode: deviceError };
    } finally {
      watcher.close();
      sock.destroy();
    }
    return { ok: true };
  } catch {
    return { ok: false, errorCode: "ws_or_pcm_failed" };
  }
}
