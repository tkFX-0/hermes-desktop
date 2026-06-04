/**
 * /goal slash routing and CLI capacity error detection (testable, bot-imported).
 */

import { normalizeDiscordUserContent } from "./discord-inbound-filter.mjs";

/** @param {string} content */
export function isGoalSlashCommand(content) {
  const t = normalizeDiscordUserContent(content).trim();
  return /^\/goal(?:\b|$)/i.test(t);
}

/** @param {string} text */
export function isCliCapacityError(text) {
  return /session limit|rate limit|usage limit|too many requests|quota exceeded|limit reached/i.test(
    String(text ?? ""),
  );
}
