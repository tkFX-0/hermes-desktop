/**
 * Guarded one-shot voice path — fixed phrase only; localhost VOICEVOX + WS PCM.
 * Not for UI/autonomy direct use; invoked only from sendStackChanVoiceOnce.
 */

import * as crypto from "crypto";
import * as http from "http";
import * as net from "net";

const VOICEVOX_URL = "http://localhost:50021";
const PCM_CHUNK_SAMPLES = 960;
const DEFAULT_FACE = "normal";

export type GuardedVoiceSpeakResult = { ok: true } | { ok: false; errorCode: string };

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

async function voicevoxSynthesize(text: string): Promise<Buffer> {
  const speaker = 1;
  const queryUrl = `${VOICEVOX_URL}/audio_query?text=${encodeURIComponent(text)}&speaker=${speaker}`;
  const queryBuf = await httpPost(queryUrl, "", "application/json");
  const query = JSON.parse(queryBuf.toString("utf8")) as Record<string, unknown>;
  query.speedScale = 1.2;
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
  return Buffer.from(mono.buffer);
}

function wsSendText(sock: net.Socket, text: string): void {
  const payload = Buffer.from(text, "utf8");
  const mask = crypto.randomBytes(4);
  const masked = Buffer.alloc(payload.length);
  for (let i = 0; i < payload.length; i++) masked[i] = payload[i] ^ mask[i % 4];
  const n = payload.length;
  const header = n < 126 ? Buffer.from([0x81, 0x80 | n]) : Buffer.alloc(4);
  if (n >= 126) {
    header[0] = 0x81;
    header[1] = 0x80 | 126;
    header.writeUInt16BE(n, 2);
  }
  sock.write(Buffer.concat([header, mask, masked]));
}

function wsSendBinary(sock: net.Socket, data: Buffer): void {
  const mask = crypto.randomBytes(4);
  const masked = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i++) masked[i] = data[i] ^ mask[i % 4];
  const n = data.length;
  const header = n < 126 ? Buffer.from([0x82, 0x80 | n]) : Buffer.alloc(4);
  if (n >= 126) {
    header[0] = 0x82;
    header[1] = 0x80 | 126;
    header.writeUInt16BE(n, 2);
  }
  sock.write(Buffer.concat([header, mask, masked]));
}

function connectWs(host: string, port: number): Promise<net.Socket> {
  return new Promise((resolve, reject) => {
    const key = crypto.randomBytes(16).toString("base64");
    const sock = net.createConnection({ host, port });
    sock.setTimeout(5000);
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

export async function speakGuardedVoiceOnce(phrase: string): Promise<GuardedVoiceSpeakResult> {
  try {
    await httpGet(`${VOICEVOX_URL}/version`);
  } catch {
    return { ok: false, errorCode: "voicevox_unavailable" };
  }

  try {
    const wav = await voicevoxSynthesize(phrase);
    const pcm = wavToPcm16k(wav);
    const host = process.env.STACKCHAN_HOST ?? process.env.STACKCHAN_IP ?? "127.0.0.1";
    const token = process.env.STACKCHAN_CONTROL_TOKEN ?? "";
    const sock = await connectWs(host, 8080);
    const json = (p: Record<string, unknown>) =>
      wsSendText(sock, JSON.stringify(token ? { ...p, token } : p));

    json({ type: "face_mode", value: "happy" });
    await new Promise((r) => setTimeout(r, 50));
    json({ type: "state", value: "speaking" });
    await new Promise((r) => setTimeout(r, 80));

    const chunkBytes = PCM_CHUNK_SAMPLES * 2;
    for (let i = 0; i < pcm.length; i += chunkBytes) {
      wsSendBinary(sock, pcm.slice(i, i + chunkBytes));
      await new Promise((r) => setTimeout(r, 35));
    }
    await new Promise((r) => setTimeout(r, 300));
    json({ type: "state", value: "idle" });
    json({ type: "face_mode", value: DEFAULT_FACE });
    sock.destroy();
    return { ok: true };
  } catch {
    return { ok: false, errorCode: "ws_or_pcm_failed" };
  }
}
