/**
 * Portfolio post → dialogue room handoff (local summary, no paid API).
 */

import { buildDialogueLines } from "./discord-multi-room.mjs";
import { safeDiscordContent } from "./discord-text-safe.mjs";

/**
 * @param {string} rawUserContent
 */
export function buildPortfolioHandoffPreview(rawUserContent) {
  const excerpt = String(rawUserContent ?? "")
    .replace(/<@\d+>/g, "")
    .replace(/https?:\/\/\S+/g, "[link]")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
  return safeDiscordContent(
    `📎 **しきしま** — ポートフォリオ→対話 転送\n` +
      `要約: ${excerpt || "（本文なし）"}\n` +
      `経路: portfolio-dialogue-bridge（読取のみ）`
  );
}

/**
 * @param {string} portfolioExcerpt
 */
export function buildPortfolioDialoguePack(portfolioExcerpt) {
  const preview = buildPortfolioHandoffPreview(portfolioExcerpt);
  const lines = [preview, ...buildDialogueLines(preview)];
  return lines;
}

/**
 * @param {(name: string) => string|undefined} readEnv
 */
export function isPortfolioDialogueBridgeEnabled(readEnv = (k) => process.env[k]) {
  const v = readEnv("SHIKISHIMA_PORTFOLIO_DIALOGUE_G");
  return v === "1" || v === "true";
}
