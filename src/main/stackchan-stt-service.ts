// StackChan PC-side Event Server
// Receives all incoming HTTP events from StackChan firmware (shikishima_cores3.ino):
//   POST :8765/audio   — raw 16kHz PCM from mic → Whisper STT → AI response
//   POST :8765/event   — pat/touch events {"type":"pat","mode":"nod|shake|tilt|smile|flee"}
//   POST :8765/camera  — JPEG photo captured on device
//
// Design: docs/shikishima/SC_EVENT_00_PC_TOUCH_DANCE_EVENT_SERVER_DESIGN.md

import * as http from "http";
import { execFile } from "child_process";
import { writeFileSync, unlinkSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { tmpdir, homedir } from "os";

const STT_PORT = 8765;
const WHISPER_MODEL = "base";   // base=高速・軽量 / small=精度↑ / medium=高精度
const TIMEOUT_MS = 30_000;
const STT_SERVER_HOLD = true;

// Pat event modes sent by firmware PAT_VOICE[]
export type PatEventMode = "nod" | "shake" | "tilt" | "smile" | "flee";

// Firmware pat mode → PC stackchanPetMode() mapping
const PAT_MODE_MAP: Record<PatEventMode, 1 | 2 | 3> = {
  nod:   1,  // うなずき → happy + nod
  shake: 2,  // 首振り照れ → shy + head_shake
  tilt:  3,  // 首かしげ甘え → sweet + tilt
  smile: 1,  // 笑顔引きつき → happy + nod (nearest match)
  flee:  2,  // 逃げる → shy + head_shake (nearest match)
};

export interface SttResult {
  success: boolean;
  transcript: string;
  durationMs: number;
  error?: string;
}

export interface SttServiceState {
  running: boolean;
  port: number;
  whisperModel: string;
  lastTranscript: string;
  lastPatMode?: PatEventMode;
  lastCaptureAt?: string;
  lastError?: string;
}

export interface SttServerCallbacks {
  onTranscript: (text: string) => Promise<void>;
  onPatEvent?: (mode: PatEventMode, pcMode: 1 | 2 | 3) => Promise<void>;
  onCameraCapture?: (jpeg: Buffer, savedPath: string) => Promise<void>;
}

let _server: http.Server | null = null;
let _running = false;
let _lastTranscript = "";
let _lastPatMode: PatEventMode | undefined;
let _lastCaptureAt: string | undefined;
let _lastError: string | undefined;

let _callbacks: SttServerCallbacks | null = null;

// ─── Whisper STT via WSL ──────────────────────────────────────────────────────

function runWhisper(audioPath: string): Promise<SttResult> {
  const start = Date.now();
  // faster-whisper or whisper via Python in WSL
  const whisperCmd =
    `python3 -c "` +
    `import sys; sys.path.insert(0, ''); ` +
    `from faster_whisper import WhisperModel; ` +
    `m = WhisperModel('${WHISPER_MODEL}', device='cpu', compute_type='int8'); ` +
    `segs, _ = m.transcribe('${audioPath}', language='ja'); ` +
    `print(' '.join(s.text for s in segs))" 2>&1`;

  return new Promise((resolve) => {
    execFile(
      "wsl",
      ["-d", "Ubuntu", "--", "bash", "--login", "-c", whisperCmd],
      { timeout: TIMEOUT_MS, maxBuffer: 1024 * 1024 },
      (err, stdout) => {
        const durationMs = Date.now() - start;
        if (err) {
          resolve({ success: false, transcript: "", durationMs, error: err.message });
          return;
        }
        const transcript = stdout.trim();
        if (!transcript || transcript.includes("ModuleNotFoundError")) {
          resolve({
            success: false,
            transcript: "",
            durationMs,
            error: "faster-whisper not installed. Run: pip install faster-whisper",
          });
          return;
        }
        resolve({ success: true, transcript, durationMs });
      },
    );
  });
}

// ─── /event handler — pat events from StackChan firmware ────────────────────

function handleEventRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
  const chunks: Buffer[] = [];
  req.on("data", (chunk: Buffer) => chunks.push(chunk));
  req.on("end", async () => {
    res.writeHead(200);
    res.end("ok");

    try {
      const body = JSON.parse(Buffer.concat(chunks).toString("utf8")) as {
        type?: string;
        mode?: string;
      };

      if (body.type !== "pat" || !body.mode) return;

      const mode = body.mode as PatEventMode;
      const pcMode = PAT_MODE_MAP[mode] ?? 1;
      _lastPatMode = mode;

      console.log(`[StackChan Event] pat mode="${mode}" → pcMode=${pcMode}`);

      if (_callbacks?.onPatEvent) {
        await _callbacks.onPatEvent(mode, pcMode);
      }
    } catch (e) {
      console.error("[StackChan Event] parse error:", e instanceof Error ? e.message : e);
    }
  });
}

// ─── /camera handler — JPEG captures from StackChan ─────────────────────────

function handleCameraRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
  const chunks: Buffer[] = [];
  req.on("data", (chunk: Buffer) => chunks.push(chunk));
  req.on("end", async () => {
    const jpeg = Buffer.concat(chunks);
    if (jpeg.length < 100) {
      res.writeHead(400);
      res.end("Image too small");
      return;
    }

    res.writeHead(200);
    res.end("ok");

    try {
      const capturesDir = join(homedir(), "AppData", "Roaming", "hermes-desktop", "captures");
      mkdirSync(capturesDir, { recursive: true });
      const filename = `stackchan-${Date.now()}.jpg`;
      const savePath = join(capturesDir, filename);
      writeFileSync(savePath, jpeg);
      _lastCaptureAt = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });

      console.log(`[StackChan Camera] saved: ${savePath} (${jpeg.length} bytes)`);

      if (_callbacks?.onCameraCapture) {
        await _callbacks.onCameraCapture(jpeg, savePath);
      }
    } catch (e) {
      console.error("[StackChan Camera] save error:", e instanceof Error ? e.message : e);
    }
  });
}

// ─── /audio handler — PCM from StackChan mic ─────────────────────────────────

function handleAudioRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
  const chunks: Buffer[] = [];
  req.on("data", (chunk: Buffer) => chunks.push(chunk));
  req.on("end", async () => {
    const audioBuffer = Buffer.concat(chunks);
    if (audioBuffer.length < 1000) {
      res.writeHead(400);
      res.end("Audio too short");
      return;
    }

    // Write PCM to temp file for Whisper
    const tmpPath = join(tmpdir(), `stackchan-audio-${Date.now()}.wav`);
    try {
      // Assume incoming is 16kHz 16-bit mono PCM — wrap with WAV header
      const wavBuffer = pcmToWav(audioBuffer, 16000, 1, 16);
      writeFileSync(tmpPath, wavBuffer);

      res.writeHead(200);
      res.end("ok");

      // Run STT
      const stt = await runWhisper(tmpPath);
      _lastTranscript = stt.transcript;

      if (stt.success && stt.transcript && _callbacks?.onTranscript) {
        console.log(`[STT] "${stt.transcript}" (${stt.durationMs}ms)`);
        await _callbacks.onTranscript(stt.transcript);
      } else if (!stt.success) {
        _lastError = stt.error;
        console.error("[STT] error:", stt.error);
      }
    } catch (e) {
      _lastError = e instanceof Error ? e.message : "unknown";
      console.error("[STT] processing error:", _lastError);
    } finally {
      if (existsSync(tmpPath)) unlinkSync(tmpPath);
    }
  });
}

// ─── HTTP router — dispatches all StackChan incoming requests ─────────────────

function handleRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
  if (req.method !== "POST") {
    res.writeHead(405);
    res.end("Method not allowed");
    return;
  }

  switch (req.url) {
    case "/audio":   handleAudioRequest(req, res);  break;
    case "/event":   handleEventRequest(req, res);  break;
    case "/camera":  handleCameraRequest(req, res); break;
    default:
      res.writeHead(404);
      res.end("Not found");
  }
}

// Minimal WAV header for PCM data
function pcmToWav(pcm: Buffer, sampleRate: number, channels: number, bitDepth: number): Buffer {
  const dataSize = pcm.length;
  const header = Buffer.alloc(44);
  // RIFF header
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write("WAVE", 8);
  // fmt chunk
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);          // PCM
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * channels * bitDepth / 8, 28);
  header.writeUInt16LE(channels * bitDepth / 8, 32);
  header.writeUInt16LE(bitDepth, 34);
  // data chunk
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);
  return Buffer.concat([header, pcm]);
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function startSttServer(
  callbacks: SttServerCallbacks,
): { ok: boolean; port: number; error?: string } {
  if (STT_SERVER_HOLD) {
    _lastError = "NEEDS_HUMAN";
    return { ok: false, port: STT_PORT, error: "NEEDS_HUMAN" };
  }
  if (_running) return { ok: true, port: STT_PORT };

  _callbacks = callbacks;
  _server = http.createServer(handleRequest);

  // listen()は非同期なのでerrorイベントで捕捉 (try/catchでは取れない)
  _server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      console.warn(`[STT Server] port ${STT_PORT} already in use — STT disabled (bot running?)`);
    } else {
      console.error("[STT Server] error:", err.message);
    }
    _running = false;
    _server = null;
  });

  _server.listen(STT_PORT, "0.0.0.0", () => {
    _running = true;
    console.log(`[STT Server] listening on :${STT_PORT} — waiting for StackChan audio`);
  });

  return { ok: true, port: STT_PORT };
}

export function stopSttServer(): void {
  if (_server) {
    _server.close();
    _server = null;
  }
  _running = false;
  _callbacks = null;
}

export function getSttServiceState(): SttServiceState {
  return {
    running: _running,
    port: STT_PORT,
    whisperModel: WHISPER_MODEL,
    lastTranscript: _lastTranscript,
    lastPatMode: _lastPatMode,
    lastCaptureAt: _lastCaptureAt,
    lastError: _lastError,
  };
}

// Check if faster-whisper is installed in WSL
export function checkWhisperInstalled(): Promise<boolean> {
  return new Promise((resolve) => {
    execFile(
      "wsl",
      ["-d", "Ubuntu", "--", "bash", "--login", "-c",
        "python3 -c 'import faster_whisper' 2>&1"],
      { timeout: 10_000 },
      (err) => resolve(!err),
    );
  });
}
