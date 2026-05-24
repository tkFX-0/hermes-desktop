/**
 * Shikishima STT Server — StackChan音声入力
 * stackchan-stt-service.ts の ES module 移植版
 *
 * Pipeline:
 *   StackChan マイク → WiFi → POST http://PC:8765/audio (16kHz PCM)
 *   → faster-whisper (WSL) → テキスト → bot handleMessage()
 *   → Grok/Claude → 返答テキスト → VOICEVOX → StackChan 発話
 *
 * StackChan firmware要件:
 *   pet-fw が POST /audio エンドポイントにPCMを送信する設定が必要
 *   → docs/shikishima/STACKCHAN_MIC_FIRMWARE_PLAN.md 参照
 */

import * as http from "http";
import { execFile } from "child_process";
import { writeFileSync, unlinkSync, existsSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

const STT_PORT      = 8765;
const WHISPER_MODEL = "base";   // base=高速 / small=精度↑ / medium=高精度
const TIMEOUT_MS    = 30_000;

let _server     = null;
let _running    = false;
let _onTranscript = null;
let _lastTranscript = "";
let _lastError  = null;
let _reqCount   = 0;

// ─── WAVヘッダー生成 (16kHz 16bit mono PCM用) ─────────────────────────────────

function pcmToWav(pcm, sampleRate, channels, bitDepth) {
  const dataSize = pcm.length;
  const header   = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * channels * bitDepth / 8, 28);
  header.writeUInt16LE(channels * bitDepth / 8, 32);
  header.writeUInt16LE(bitDepth, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);
  return Buffer.concat([header, pcm]);
}

// ─── faster-whisper (WSL) でSTT ──────────────────────────────────────────────

function runWhisper(audioPath) {
  const start = Date.now();
  const wslPath = audioPath.replace(/\\/g, "/").replace("C:", "/mnt/c");
  const cmd =
    `python3 -c "` +
    `from faster_whisper import WhisperModel; ` +
    `m = WhisperModel('${WHISPER_MODEL}', device='cpu', compute_type='int8'); ` +
    `segs, _ = m.transcribe('${wslPath}', language='ja'); ` +
    `print(' '.join(s.text for s in segs).strip())" 2>&1`;

  return new Promise(resolve => {
    execFile("wsl", ["-d", "Ubuntu", "--", "bash", "--login", "-c", cmd],
      { timeout: TIMEOUT_MS, maxBuffer: 512 * 1024 },
      (err, stdout) => {
        const ms = Date.now() - start;
        if (err) { resolve({ ok: false, text: "", ms, error: err.message }); return; }
        const text = stdout.trim();
        if (!text || text.includes("ModuleNotFoundError") || text.includes("Error")) {
          resolve({ ok: false, text: "", ms, error: text });
          return;
        }
        resolve({ ok: true, text, ms });
      });
  });
}

// ─── HTTP サーバー (StackChanからの音声を受信) ───────────────────────────────

async function handleRequest(req, res) {
  // ヘルスチェック
  if (req.method === "GET" && req.url === "/ping") {
    res.writeHead(200);
    res.end(JSON.stringify({ ok: true, running: true, lastTranscript: _lastTranscript }));
    return;
  }

  // SC-2: カメラ画像受信 → Claude vision に転送
  if (req.method === "POST" && req.url === "/camera") {
    const chunks = [];
    req.on("data", c => chunks.push(c));
    req.on("end", async () => {
      const imgBuf = Buffer.concat(chunks);
      res.writeHead(200); res.end("ok");
      console.log(`[Camera] 受信: ${imgBuf.length} bytes`);
      // base64エンコードしてコールバックに渡す
      if (_onTranscript) {
        const b64 = imgBuf.toString("base64");
        await _onTranscript(`[camera_image:${b64.slice(0, 50)}...${imgBuf.length}bytes]`);
      }
    });
    return;
  }

  // SC-PAT: StackChanからの撫でイベント受信
  if (req.method === "POST" && req.url === "/event") {
    const chunks = [];
    req.on("data", c => chunks.push(c));
    req.on("end", async () => {
      res.writeHead(200); res.end("ok");
      try {
        const body = JSON.parse(Buffer.concat(chunks).toString("utf-8"));
        if (body.type === "pat" && _onTranscript) {
          await _onTranscript(`[pat_event:${body.mode}]`);
        }
      } catch { /* ignore */ }
    });
    return;
  }

  // 音声受信
  if (req.method === "POST" && req.url === "/audio") {
    const chunks = [];
    req.on("data", c => chunks.push(c));
    req.on("end", async () => {
      const audio = Buffer.concat(chunks);
      if (audio.length < 1000) {
        res.writeHead(400); res.end("too short");
        return;
      }
      _reqCount++;
      console.log(`[STT] 音声受信 #${_reqCount} (${audio.length} bytes)`);

      // 即座に200を返す (StackChanをブロックしない)
      res.writeHead(200); res.end("ok");

      // 一時WAVファイルに保存
      const tmp = join(tmpdir(), `sc-audio-${Date.now()}.wav`);
      try {
        writeFileSync(tmp, pcmToWav(audio, 16000, 1, 16));
        const result = await runWhisper(tmp);
        if (result.ok && result.text) {
          _lastTranscript = result.text;
          console.log(`[STT] "${result.text}" (${result.ms}ms)`);
          if (_onTranscript) await _onTranscript(result.text);
        } else {
          _lastError = result.error;
          console.warn(`[STT] 失敗: ${result.error}`);
        }
      } catch (e) {
        _lastError = e.message;
      } finally {
        if (existsSync(tmp)) unlinkSync(tmp);
      }
    });
    return;
  }

  res.writeHead(404); res.end("not found");
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * STTサーバーを起動
 * @param {function} onTranscript - (text: string) => Promise<void>
 */
export function startSttServer(onTranscript) {
  if (_running) return { ok: true, port: STT_PORT };
  _onTranscript = onTranscript;
  _server = http.createServer((req, res) => {
    handleRequest(req, res).catch(e => {
      console.error("[STT] req error:", e.message);
      if (!res.writableEnded) { res.writeHead(500); res.end(); }
    });
  });
  _server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.warn(`[STT] port ${STT_PORT} already in use — STT disabled`);
    } else {
      console.error("[STT] server error:", err.message);
    }
    _running = false; _server = null;
  });
  _server.listen(STT_PORT, "0.0.0.0", () => {
    _running = true;
    console.log(`🎙️ STTサーバー起動 — StackChanの音声を受付中 (port ${STT_PORT})`);
  });
  return { ok: true, port: STT_PORT };
}

export function stopSttServer() {
  if (_server) { _server.close(); _server = null; }
  _running = false;
}

export function getSttState() {
  return { running: _running, port: STT_PORT, lastTranscript: _lastTranscript, reqCount: _reqCount };
}

/** faster-whisperがWSLにインストール済みか確認 */
export function checkWhisperInstalled() {
  return new Promise(resolve => {
    execFile("wsl", ["-d", "Ubuntu", "--", "bash", "--login", "-c",
      "python3 -c 'import faster_whisper; print(faster_whisper.__version__)' 2>&1"],
      { timeout: 10_000 },
      (err, stdout) => resolve(!err && !stdout.includes("Error")));
  });
}
