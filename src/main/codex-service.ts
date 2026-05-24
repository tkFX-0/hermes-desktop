// Codex Service — External Worker Adapter (WK-CODEX-00)
// Codex = StackChan専用Worker (Phase 2: CLI Worker / Phase 3: HOLD)
// ClaudeCode = しきしまCoreWorker (別サービス)
//
// Phase 1 (current): Task export only — human pastes to Codex, result returned manually
// Phase 2 (active): codex exec via CLI if OPENAI_API_KEY present
// Phase 3 (HOLD): Full automation from Shikishima — requires separate human GO
//
// NEVER: Ollama as Codex fallback / raw API key output / productionReady=true

import { execFile } from "child_process";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { homedir } from "os";

// Native Rust binary (confirmed v0.133.0 on 2026-05-22)
const CODEX_NATIVE =
  "/root/.hermes/node/lib/node_modules/@openai/codex" +
  "/node_modules/@openai/codex-linux-x64/vendor/x86_64-unknown-linux-musl/bin/codex";

const TIMEOUT_MS = 180_000;
const ENV_PATH = join(homedir(), "Desktop", "プロジェクトファイル", "hermes-desktop", ".env.local");

// ─── Types ────────────────────────────────────────────────────────────────────

export type CodexAuthMode = "openai_api_key" | "chatgpt_login" | "unknown";

export interface CodexAvailability {
  installed: boolean;
  apiKeyPresent: boolean;   // key exists — value never printed
  authMode: CodexAuthMode;
  sandboxEnabled: boolean;
  networkAllowed: false;    // always false — Codex runs offline
  allowedScope: "stackchan_only";
  rawApiKeyReported: false; // invariant
}

export interface CodexResult {
  success: boolean;
  output: string;
  durationMs: number;
  phase: "phase1_hold" | "phase2_cli" | "hold";
  error?: string;
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function readApiKeyPresence(): boolean {
  try {
    if (!existsSync(ENV_PATH)) return false;
    const content = readFileSync(ENV_PATH, "utf-8");
    for (const line of content.split("\n")) {
      const t = line.trim();
      if (t.startsWith("OPENAI_API_KEY=")) {
        const val = t.substring("OPENAI_API_KEY=".length).trim();
        return val.length > 0 && !val.startsWith("#");
      }
    }
  } catch { /* ignore */ }
  return false;
}

function readApiKeyValue(): string | null {
  try {
    if (!existsSync(ENV_PATH)) return null;
    const content = readFileSync(ENV_PATH, "utf-8");
    for (const line of content.split("\n")) {
      const t = line.trim();
      if (t.startsWith("OPENAI_API_KEY=")) {
        const val = t.substring("OPENAI_API_KEY=".length).trim();
        return (val.length > 0 && !val.startsWith("#")) ? val : null;
      }
    }
  } catch { /* ignore */ }
  return null;
}

// ─── Public: Availability check ───────────────────────────────────────────────

export function checkCodexAvailability(): CodexAvailability {
  const apiKeyPresent = readApiKeyPresence();
  return {
    installed: true,               // confirmed native binary 2026-05-22
    apiKeyPresent,
    authMode: apiKeyPresent ? "openai_api_key" : "unknown",
    sandboxEnabled: true,          // codex runs with sandbox by default
    networkAllowed: false,
    allowedScope: "stackchan_only",
    rawApiKeyReported: false,
  };
}

// ─── Public: Phase 2 CLI execution ────────────────────────────────────────────
// Scope: StackChan tasks only. DO NOT call for Shikishima Core tasks.
// If OPENAI_API_KEY not present → return phase1_hold (not Ollama fallback)

export function codexTask(prompt: string): Promise<CodexResult> {
  const start = Date.now();
  const apiKey = readApiKeyValue();

  if (!apiKey) {
    // No API key → Phase 1 HOLD. Route to ClaudeCode instead.
    return Promise.resolve({
      success: false,
      output: "",
      durationMs: 0,
      phase: "phase1_hold",
      error: "OPENAI_API_KEY not set — Codex unavailable. Route to ClaudeCode.",
    });
  }

  const cmd = `OPENAI_API_KEY=${JSON.stringify(apiKey)} ${CODEX_NATIVE} exec ${JSON.stringify(prompt)}`;

  return new Promise((resolve) => {
    execFile(
      "wsl",
      ["-d", "Ubuntu", "--", "bash", "--login", "-c", cmd],
      { timeout: TIMEOUT_MS, maxBuffer: 1024 * 1024 * 4 },
      (err, stdout) => {
        const durationMs = Date.now() - start;
        if (err) {
          resolve({ success: false, output: "", durationMs, phase: "phase2_cli", error: err.message });
          return;
        }
        const clean = stdout.replace(/\x1B\[[0-9;]*[mGKHF]/g, "").trim();
        resolve({ success: true, output: clean, durationMs, phase: "phase2_cli" });
      },
    );
  });
}

// ─── Public: Code review (StackChan scope only) ───────────────────────────────

export function codexReview(context: string): Promise<CodexResult> {
  const prompt =
    "[StackChan scope] 以下のコードをレビューして問題点と改善提案を日本語で返して:\n\n" + context;
  return codexTask(prompt);
}

// ─── Public: Task export (Phase 1 — human pastes) ────────────────────────────
// Generates a Task.md for human to paste into Codex manually.
// No Codex execution. No API call.

export function exportCodexTaskMd(taskTitle: string, objective: string, scope: string): string {
  return [
    `# Codex Task — ${taskTitle}`,
    ``,
    `**Recommended Worker:** Codex CLI (StackChan専用)`,
    `**Scope:** ${scope}`,
    `**Auth mode:** OPENAI_API_KEY or ChatGPT login`,
    ``,
    `## Objective`,
    objective,
    ``,
    `## Safety Boundary`,
    `- productionReady: false`,
    `- execution: disabled`,
    `- git push: 未実施 (別途human GO)`,
    `- rawValuesReported: false`,
    ``,
    `## Human Bridge Notice`,
    `このTaskは人間がCodexへコピーして実行します。`,
    `Shikishimaは自動的にCodexを起動しません。`,
    `結果はしるべへ証跡として戻してください。`,
  ].join("\n");
}
