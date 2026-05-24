/**
 * Claude Code Service
 * Uses claude CLI (claude.ai Pro subscription, no API key)
 * Non-interactive print mode: claude -p "prompt" --output-format text
 *
 * Used by: Discord coding tasks, Electron chat coding requests
 * Auth: claude.ai subscription (tkcho.fx@gmail.com)
 */

import { execFile } from "child_process";

const TIMEOUT_MS = 120_000;

// Claude models — claude-code CLI 対応モデル
//   claude-opus-4    → 最も複雑なタスク・agentic coding・長期設計
//   claude-sonnet-4-6 → 実装・ClaudeCode・日常コーディング (メイン)
//   claude-haiku-4   → 要約・ログ・クイックチェック (最軽量)
// ※ claude-opus-4 は claude-opus-4-7 の短縮エイリアス (Claude CLI解決)
export type ClaudeModel =
  | "claude-opus-4"             // はじめ complex / 重大設計のみ
  | "claude-sonnet-4-6"         // つむぎ実装メイン (delegation推奨)
  | "claude-haiku-4";           // 軽量タスク・しるべ記録

export function selectClaudeModel(complexity: "simple" | "medium" | "complex"): ClaudeModel {
  if (complexity === "simple") return "claude-haiku-4";
  if (complexity === "medium") return "claude-sonnet-4-6";
  return "claude-opus-4"; // complexのみOpus (クォータ節約)
}

export interface ClaudeCodeResult {
  success: boolean;
  output: string;
  durationMs: number;
  error?: string;
}

// Keywords that suggest a coding task → route to Claude Code
const CODING_KEYWORDS = [
  "コードを書", "実装して", "作って", "修正して", "バグ", "TypeScript", "Python",
  "関数", "クラス", "スクリプト", "プログラム", "コード", "デバッグ",
  "write code", "implement", "function", "fix", "bug", "script",
];

export function isCodingTask(text: string): boolean {
  const lower = text.toLowerCase();
  return CODING_KEYWORDS.some((kw) => lower.includes(kw.toLowerCase()));
}

export function claudeCodeTask(
  prompt: string,
  model: ClaudeModel = "claude-sonnet-4-6",
): Promise<ClaudeCodeResult> {
  const start = Date.now();

  return new Promise((resolve) => {
    execFile(
      "wsl",
      ["-d", "Ubuntu", "--", "bash", "-c",
        `claude -p ${JSON.stringify(prompt)} --model ${model} --output-format text 2>&1`],
      { timeout: TIMEOUT_MS, maxBuffer: 1024 * 1024 * 4 },
      (err, stdout) => {
        const durationMs = Date.now() - start;
        if (err) {
          resolve({ success: false, output: "", durationMs, error: err.message });
          return;
        }
        resolve({ success: true, output: stdout.trim(), durationMs });
      },
    );
  });
}
