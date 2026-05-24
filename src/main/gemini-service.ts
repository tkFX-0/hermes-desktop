// Gemini Service — Google AI Studio HTTP API
// 無料APIキー: aistudio.google.com → "Get API key" → 無料
// Free tier: gemini-2.5-flash 15RPM / 1500req/day, gemini-2.5-pro 2RPM / 50req/day
// Setup: .env.local に GEMINI_API_KEY=AIza... を追加

import * as https from "https";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { homedir } from "os";

const GEMINI_BASE = "generativelanguage.googleapis.com";
const TIMEOUT_MS = 60_000;
const ENV_PATH = join(homedir(), "Desktop", "プロジェクトファイル", "hermes-desktop", ".env.local");

export type GeminiModel =
  | "gemini-2.5-flash"    // 高速・高頻度向け (15RPM/1500day 無料)
  | "gemini-2.5-pro"      // 最高精度・複雑タスク (2RPM/50day 無料)
  | "gemini-1.5-flash"    // 安定・汎用 (15RPM 無料)
  | "gemini-1.5-pro";     // 安定・高精度 (2RPM 無料)

export interface GeminiResult {
  success: boolean;
  reply: string;
  durationMs: number;
  model: GeminiModel;
  error?: string;
}

export interface GeminiAvailability {
  available: boolean;
  note: string;
}

// ─── Key management ───────────────────────────────────────────────────────────

function readGeminiKey(): string | null {
  try {
    if (!existsSync(ENV_PATH)) return null;
    const content = readFileSync(ENV_PATH, "utf-8");
    for (const line of content.split("\n")) {
      const t = line.trim();
      if (t.startsWith("GEMINI_API_KEY=")) {
        const val = t.substring("GEMINI_API_KEY=".length).trim();
        return val && !val.startsWith("#") ? val : null;
      }
    }
  } catch { /* ignore */ }
  return null;
}

export function checkGeminiAvailability(): GeminiAvailability {
  const key = readGeminiKey();
  if (!key) return {
    available: false,
    note: "GEMINI_API_KEY未設定 → aistudio.google.com で無料取得 → .env.local に追加",
  };
  return { available: true, note: "GEMINI_API_KEY設定済み" };
}

// ─── HTTP call ────────────────────────────────────────────────────────────────

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
  error?: { message?: string };
}

function callGeminiApi(model: GeminiModel, prompt: string, apiKey: string): Promise<string> {
  const body = JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
  });
  const path = `/v1beta/models/${model}:generateContent?key=${apiKey}`;

  return new Promise((resolve, reject) => {
    const req = https.request(
      { hostname: GEMINI_BASE, path, method: "POST",
        headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) },
        timeout: TIMEOUT_MS },
      (res) => {
        let data = "";
        res.on("data", (c: string) => (data += c));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(data) as GeminiResponse;
            if (parsed.error) { reject(new Error(parsed.error.message ?? "Gemini API error")); return; }
            const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
            resolve(text || "(応答なし)");
          } catch { reject(new Error("parse error")); }
        });
      },
    );
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("timeout")); });
    req.write(body);
    req.end();
  });
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function geminiChat(
  prompt: string,
  model: GeminiModel = "gemini-2.5-flash",
): Promise<GeminiResult> {
  const start = Date.now();
  const key = readGeminiKey();
  if (!key) {
    return { success: false, reply: "", durationMs: 0, model,
      error: "GEMINI_API_KEY未設定" };
  }
  try {
    const reply = await callGeminiApi(model, prompt, key);
    return { success: true, reply, durationMs: Date.now() - start, model };
  } catch (e) {
    return { success: false, reply: "", durationMs: Date.now() - start, model,
      error: e instanceof Error ? e.message : "unknown" };
  }
}

// 複雑度でモデルを自動選択
export function selectGeminiModel(complexity: "simple" | "medium" | "complex"): GeminiModel {
  if (complexity === "complex") return "gemini-2.5-pro";
  return "gemini-2.5-flash"; // simple/medium → Flash (高頻度無料枠)
}
