// Shikishima Grok Chat — Grok 4.3 as conversation base
// Used for: Discord command responses, Command Chat, StackChan dialogue.
// Cost: X Premium subscription quota only.

import { execFile } from "child_process";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { homedir } from "os";

const TIMEOUT_MS = 120_000;

export interface GrokChatResult {
  success: boolean;
  reply: string;
  durationMs: number;
  error?: string;
}

// Grok models — xai-oauth (X Premium サブスク内、追加課金なし)
//   grok-4.3       → しきしまメイン会話・FX分析・Xリサーチ (最高精度)
//   grok-3         → 軽量タスク・要約・シンプルな会話 (クォータ節約)
//   grok-build-0.1 → Web系/agentic coding補助 (将来)
// ※ grok-3は廃止ではなくhermes/OpenRouter経由で現役
// grok-3はOpenRouter経由では現役だがxai-oauth(X Premium)では未確認
// 安全のため xai-oauth では grok-4.3 に統一
export type GrokModel = "grok-4.3" | "grok-build-0.1";

export function selectGrokModel(
  _complexity: "simple" | "medium" | "complex",
): GrokModel {
  return "grok-4.3"; // xai-oauth で確実に動作するモデルに固定
}

export function grokChat(
  userMessage: string,
  model: GrokModel = "grok-4.3",
): Promise<GrokChatResult> {
  const start = Date.now();

  return new Promise((resolve) => {
    execFile(
      "wsl",
      ["-d", "Ubuntu", "--", "bash", "-c",
        `~/.local/bin/hermes chat -Q -q ${JSON.stringify(userMessage)} -m ${model} --provider xai-oauth --yolo 2>&1`],
      { timeout: TIMEOUT_MS, maxBuffer: 1024 * 1024 * 2 },
      (err, stdout) => {
        const durationMs = Date.now() - start;
        if (err) {
          resolve({ success: false, reply: "", durationMs, error: err.message });
          return;
        }

        // -Q stdout: response text only.
        // 2>&1 merges stderr (session_id:, model name, etc.) with stdout.
        // Strip ANSI, then filter out all metadata lines.
        const clean = stdout.replace(/\x1B\[[0-9;]*[mGKHF]/g, "");

        // Detect hard failure patterns in output (403, quota exhausted, etc.)
        const isHardError =
          /HTTP\s+40[34]/.test(clean) ||
          /Non-retryable.*error/i.test(clean) ||
          /run out of credits/i.test(clean) ||
          /PermissionDeniedError/i.test(clean) ||
          /You have run out of credits/i.test(clean) ||
          /Aborting\./i.test(clean);

        if (isHardError) {
          const errorLine = clean.split("\n").find((l) => l.includes("403") || l.includes("credit") || l.includes("Aborting")) ?? "grok quota exhausted";
          resolve({ success: false, reply: "", durationMs, error: `grok_403: ${errorLine.trim().slice(0, 120)}` });
          return;
        }

        const body = clean
          .split("\n")
          .filter((l) => !l.trim().match(/^(session_id:|Session:|Duration:|Messages:|Resume this session|Initializing|────|⚠️|❌|🔌|🌐|📝|📋|💡)/))
          .map((l) => l.trimEnd())
          .join("\n")
          .trim();

        resolve({ success: true, reply: body || "(応答なし)", durationMs });
      },
    );
  });
}

// X Premium subscription quota check (non-blocking)
export async function checkXPremiumQuota(): Promise<{ available: boolean; note: string }> {
  const authPath = join(homedir(), ".hermes", "auth.json");
  if (!existsSync(authPath)) {
    return { available: false, note: "auth.json not found" };
  }
  try {
    const data = JSON.parse(readFileSync(authPath, "utf-8")) as {
      credential_pool?: { "xai-oauth"?: Array<{ last_status?: string }> };
    };
    const creds = data?.credential_pool?.["xai-oauth"];
    if (!creds || creds.length === 0) return { available: false, note: "xai-oauth not found" };
    const status = creds[0]?.last_status ?? "unknown";
    return { available: status !== "error", note: `xai-oauth status: ${status}` };
  } catch {
    return { available: false, note: "auth.json parse error" };
  }
}
