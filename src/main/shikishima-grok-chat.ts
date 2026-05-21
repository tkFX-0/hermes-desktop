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

// Persona is set in ~/.hermes/SOUL.md — no need to include in prompt.
// -Q (quiet): suppresses banner/spinner/TUI so only response + session info is printed.
export function grokChat(userMessage: string): Promise<GrokChatResult> {
  const start = Date.now();

  return new Promise((resolve) => {
    execFile(
      "wsl",
      ["-d", "Ubuntu", "--", "bash", "-c",
        `~/.local/bin/hermes chat -Q -q ${JSON.stringify(userMessage)} -m grok-4.3 --provider xai-oauth --yolo 2>&1`],
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
        const body = clean
          .split("\n")
          .filter((l) => !l.trim().match(/^(session_id:|Session:|Duration:|Messages:|Resume this session|Initializing|────)/))
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
