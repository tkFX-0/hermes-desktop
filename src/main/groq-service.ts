// Groq Service — ultra-fast LLaMA3 inference (free tier)
// Cost: 無料 — console.groq.com でアカウント作成→APIキー取得
// Rate: llama-3.3-70b: 6,000 tokens/min (free)
// Speed: 数百tokens/秒 (業界最速クラス)
//
// Setup: GROQ_API_KEY=gsk_... を .env.local に追加
// Used by: しきしま(simple/fast), 高速応答が必要な場合

import * as https from "https";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { homedir } from "os";

const GROQ_API_URL = "api.groq.com";
const GROQ_API_PATH = "/openai/v1/chat/completions";
const TIMEOUT_MS = 30_000;  // Groqは超高速なので短めでいい

// Model選択: 用途別
export type GroqModel =
  | "llama-3.3-70b-versatile"     // 最高精度 (free tier)
  | "llama-3.1-8b-instant"        // 超高速・軽量 (simple tasks)
  | "mixtral-8x7b-32768";         // 長文処理向け

export interface GroqResult {
  success: boolean;
  reply: string;
  durationMs: number;
  model: GroqModel;
  error?: string;
}

const ENV_PATH = join(homedir(), "Desktop", "プロジェクトファイル", "hermes-desktop", ".env.local");

function readGroqKey(): string | null {
  try {
    if (!existsSync(ENV_PATH)) return null;
    const content = readFileSync(ENV_PATH, "utf-8");
    for (const line of content.split("\n")) {
      const t = line.trim();
      if (t.startsWith("GROQ_API_KEY=")) {
        const val = t.substring("GROQ_API_KEY=".length).trim();
        return (val && !val.startsWith("#")) ? val : null;
      }
    }
  } catch { /* ignore */ }
  return null;
}

// ─── Availability ─────────────────────────────────────────────────────────────

export function checkGroqAvailability(): { available: boolean; note: string } {
  const key = readGroqKey();
  if (!key) {
    return {
      available: false,
      note: "GROQ_API_KEY not set. Get free key at console.groq.com → add to .env.local",
    };
  }
  return { available: true, note: "GROQ_API_KEY present" };
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

export function groqChat(
  prompt: string,
  model: GroqModel = "llama-3.3-70b-versatile",
): Promise<GroqResult> {
  const start = Date.now();
  const key = readGroqKey();

  if (!key) {
    return Promise.resolve({
      success: false,
      reply: "",
      durationMs: 0,
      model,
      error: "GROQ_API_KEY not set",
    });
  }

  const body = JSON.stringify({
    model,
    messages: [{ role: "user", content: prompt }],
    max_tokens: 2048,
    temperature: 0.7,
  });

  return new Promise((resolve) => {
    const req = https.request(
      {
        hostname: GROQ_API_URL,
        path: GROQ_API_PATH,
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
        timeout: TIMEOUT_MS,
      },
      (res) => {
        let data = "";
        res.on("data", (chunk: string) => (data += chunk));
        res.on("end", () => {
          const durationMs = Date.now() - start;
          try {
            const parsed = JSON.parse(data) as {
              choices?: Array<{ message?: { content?: string } }>;
              error?: { message?: string };
            };
            if (parsed.error) {
              resolve({ success: false, reply: "", durationMs, model, error: parsed.error.message });
              return;
            }
            const reply = parsed.choices?.[0]?.message?.content?.trim() ?? "";
            resolve({ success: true, reply, durationMs, model });
          } catch {
            resolve({ success: false, reply: "", durationMs, model, error: "parse error" });
          }
        });
      },
    );
    req.on("error", (e) => resolve({ success: false, reply: "", durationMs: Date.now() - start, model, error: e.message }));
    req.on("timeout", () => { req.destroy(); resolve({ success: false, reply: "", durationMs: TIMEOUT_MS, model, error: "timeout" }); });
    req.write(body);
    req.end();
  });
}

// 複雑度でGroqモデルを自動選択
export function selectGroqModel(complexity: "simple" | "medium" | "complex"): GroqModel {
  if (complexity === "simple") return "llama-3.1-8b-instant";   // 超高速
  return "llama-3.3-70b-versatile";                              // 高精度
}
