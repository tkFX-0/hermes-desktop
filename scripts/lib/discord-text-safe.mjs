/**
 * Discord outbound text — UTF-16 safe slice + common mojibake repair.
 */

import { stripClaudeCliNoise } from "./claude-cli-sanitize.mjs";

const MOJIBAKE_FIXES = [
  [/エージント/g, "エージェント"],
  [/ã€/g, ""],
  [/\uFFFD/g, ""]
];

export function sanitizeDiscordText(text) {
  let s = stripClaudeCliNoise(String(text ?? ""));
  for (const [re, rep] of MOJIBAKE_FIXES) {
    s = s.replace(re, rep);
  }
  return s.normalize("NFC");
}

/** Slice by Unicode code point (never splits surrogate pairs). */
export function safeDiscordContent(text, maxLen = 2000) {
  const cleaned = sanitizeDiscordText(text);
  const chars = [...cleaned];
  if (chars.length <= maxLen) return cleaned;
  return chars.slice(0, maxLen).join("");
}
