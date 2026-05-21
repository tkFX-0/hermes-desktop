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

// Persona is set in ~/.hermes/SOUL.md — no need to include in prompt
export function grokChat(userMessage: string): Promise<GrokChatResult> {
  const start = Date.now();
  const prompt = userMessage;

  return new Promise((resolve) => {
    execFile(
      "wsl",
      ["-d", "Ubuntu", "--", "bash", "-c",
        `~/.local/bin/hermes chat -q ${JSON.stringify(prompt)} -m grok-4.3 --provider xai-oauth --yolo 2>&1`],
      { timeout: TIMEOUT_MS, maxBuffer: 1024 * 1024 * 2 },
      (err, stdout) => {
        const durationMs = Date.now() - start;
        if (err) {
          resolve({ success: false, reply: "", durationMs, error: err.message });
          return;
        }

        const clean = stdout
          .replace(/\x1B\[[0-9;]*[mGKHF]/g, "")
          .replace(/[╭╮╰╯│─┊⚕]/g, "")
          .trim();

        const lines = clean.split("\n");
        const resumeIdx = lines.findIndex((l) => l.includes("Resume this session"));
        const body = (resumeIdx > 0 ? lines.slice(0, resumeIdx) : lines)
          .filter((l) => !l.match(/^(Query:|Session:|Duration:|Messages:|Initializing|tip\)|────)/))
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
