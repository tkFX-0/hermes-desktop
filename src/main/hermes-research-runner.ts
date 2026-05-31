// Hermes Research Runner
// Calls ~/.hermes/research-runner.sh via WSL2 to execute x_search with Grok.
// Cost: X Premium subscription quota only — no separate API billing.

import { execFile } from "child_process";
import { holdHermesResearch, isGlobalGrokResearchHold } from "./shikishima-agent-backend-policy";

export interface HermesResearchResult {
  success: boolean;
  content: string;
  error?: string;
  durationMs: number;
}

const WSL_RUNNER = "/root/.hermes/research-runner.sh";
const TIMEOUT_MS = 180_000; // 3 min — x_search can take 60-120s

export function runHermesResearch(
  query: string,
  agentId: "shikishima" | "shirube" = "shikishima"
): Promise<HermesResearchResult> {
  const start = Date.now();

  if (isGlobalGrokResearchHold()) {
    return Promise.resolve(holdHermesResearch(agentId, Date.now() - start));
  }

  return new Promise((resolve) => {
    execFile(
      "wsl",
      ["-d", "Ubuntu", "--", "bash", WSL_RUNNER, query],
      { timeout: TIMEOUT_MS, maxBuffer: 1024 * 1024 * 4 },
      (err, stdout, stderr) => {
        const durationMs = Date.now() - start;
        if (err) {
          resolve({
            success: false,
            content: "",
            error: stderr || err.message,
            durationMs,
          });
          return;
        }

        // Strip ANSI escape codes from hermes TUI output
        const clean = stdout
          .replace(/\x1B\[[0-9;]*[mGKHF]/g, "")
          .replace(/[╭╮╰╯│─┊⚕]/g, "")
          .replace(/^\s*[─-╿]+.*$/gm, "")
          .trim();

        // Extract the assistant response block
        const lines = clean.split("\n").filter((l) => l.trim());
        const resumeIdx = lines.findIndex((l) => l.includes("Resume this session"));
        const body = resumeIdx > 0 ? lines.slice(0, resumeIdx) : lines;

        // Skip tool-call display lines and metadata
        const content = body
          .filter((l) => !l.match(/^(Query:|Session:|Duration:|Messages:|Initializing|tip\))/))
          .join("\n")
          .trim();

        resolve({ success: true, content, durationMs });
      },
    );
  });
}

// Daily research topics — Grok analyzes X and produces structured report
export const DAILY_RESEARCH_TOPICS = [
  // FX / EA / Prop firm
  "x_searchで XAUUSD gold EA prop firm ATFunded 2026 の最新動向を5件調査し、トレード戦略上の示唆とともに日本語でレポートして",
  "x_searchで FX kill zone scalping Silver Bullet NY London 2026 のトレーダー投稿を5件取得し、市場動向を日本語で分析して",
  "x_searchで gold XAUUSD 相場分析 週次トレンド 2026 を5件調査し、テクニカル・ファンダメンタル両面から日本語でレポートして",
  "x_searchで prop firm challenge rule change FTMO ATFunded 2026 の最新情報を5件取得して日本語で要約して",
  // StackChan / AI
  "x_searchで StackChan VOICEVOX ttsQuestV3 音声統合 MCP 2026 の最新実装情報を5件取得して日本語で要約して",
  "x_searchで StackChan CoreS3 LLM 音声対話 Discord Bot 2026 の最新開発動向を5件日本語でレポートして",
  // 日本・世界トレンド
  "x_searchで 日本トレンド AI LLM エージェント 2026 の今週の注目トピックを5件取得して日本語で要約して",
  "x_searchで global AI agent news breakthrough 2026 の今週の重要ニュースを5件取得して日本語で要約して",
];
