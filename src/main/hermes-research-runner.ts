// Hermes Research Runner
// Calls ~/.hermes/research-runner.sh via WSL2 to execute x_search with Grok.
// Cost: X Premium subscription quota only — no separate API billing.

import { execFile } from "child_process";

export interface HermesResearchResult {
  success: boolean;
  content: string;
  error?: string;
  durationMs: number;
}

const WSL_RUNNER = "/root/.hermes/research-runner.sh";
const TIMEOUT_MS = 180_000; // 3 min — x_search can take 60-120s

export function runHermesResearch(query: string): Promise<HermesResearchResult> {
  const start = Date.now();

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

// Daily research topics — rotated through or run all on demand
export const DAILY_RESEARCH_TOPICS = [
  "x_searchで XAUUSD gold EA prop firm ATFunded 2026 の最新情報を5件取得して日本語で要約して",
  "x_searchで StackChan VOICEVOX ttsQuestV3 音声統合 2026 の最新情報を5件取得して日本語で要約して",
  "x_searchで FX prop firm challenge XAUUSD kill zone scalping 2026 の最新ツイートを5件日本語で要約して",
  "x_searchで gold trading EA Silver Bullet funded account 2026 の最新情報を5件取得して日本語で要約して",
];
