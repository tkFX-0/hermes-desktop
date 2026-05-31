/**
 * Redacted reply capability report — no secrets, no raw keys.
 */

import { existsSync } from "node:fs";
import { isLocalHumanCheckEnv } from "./dispatch-agent-reply.mjs";

/**
 * @param {{ groqKeyPresent?: boolean, wslClaudeProbe?: boolean, localOnlyEnv?: boolean }} input
 */
export function buildReplyCapabilityReport(input) {
  const localOnly = input.localOnlyEnv === true;
  const groq = input.groqKeyPresent === true;
  const wsl = input.wslClaudeProbe === true;

  const lines = [
    "**しきしま — 応答経路の説明**",
    "",
    "エージェント個別の「ログイン権限」は **付与していません**。",
    "実際の経路は次のとおりです:",
    "",
    "| 経路 | 使うもの | あなたの操作 |",
    "|------|----------|--------------|",
    "| Groq | `.env.local` の `GROQ_API_KEY` | PCにキーを置いた場合のみ |",
    "| Claude | このPCの **WSL + `claude` CLI** ログイン | WSLでログイン済みの場合のみ |",
    "| Codex/GPT/Cursor | **SideBotからは未接続** | Cursor/Codexは別途・手動 |",
    "| Human Check | `!agent-test` 固定文 | **API課金なし** |",
    "",
    `現在: Groqキー=${groq ? "あり" : "なし"} / WSL-Claude=${wsl ? "応答可" : "未確認または不可"} / 全員ローカル強制=${localOnly ? "ON" : "OFF"}`,
    "",
    "ChatGPT・Codex・Cursor の **ブラウザログイン** は Bot が勝手には使いません。",
    "通常チャットで返らないときは `!reply-status` を送ってください。"
  ];
  return lines.join("\n");
}

/**
 * @param {string} envPath
 * @param {(name: string) => string | undefined} readEnvFn
 */
export function groqKeyConfigured(readEnvFn) {
  const key = readEnvFn("GROQ_API_KEY");
  return Boolean(key && key.length > 8 && key !== "your_key_here");
}

export function isLocalOnlyMode(readEnvFn) {
  return isLocalHumanCheckEnv({ SHIKISHIMA_DISCORD_HUMAN_CHECK_LOCAL: readEnvFn("SHIKISHIMA_DISCORD_HUMAN_CHECK_LOCAL") });
}
