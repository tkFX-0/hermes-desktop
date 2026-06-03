/**
 * Multi-room Discord layout (portfolio / dialogue / command).
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const DEFAULT_PORTFOLIO_CHANNEL_ID = "1510129430100709407";

/**
 * @param {Record<string, string>} [env]
 */
export function readDiscordChannelEnv(env = process.env) {
  const fileEnv = {};
  const path = env.SHIKISHIMA_ENV_LOCAL_PATH;
  if (path && existsSync(path)) {
    for (const line of readFileSync(path, "utf-8").split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#") || !t.includes("=")) continue;
      const i = t.indexOf("=");
      fileEnv[t.slice(0, i).trim()] = t.slice(i + 1).trim();
    }
  }
  const g = (k) => String(env[k] ?? fileEnv[k] ?? "").trim();
  return {
    token: g("DISCORD_BOT_TOKEN"),
    commandChannelId: g("DISCORD_COMMAND_CHANNEL_ID"),
    portfolioChannelId: g("DISCORD_PORTFOLIO_CHANNEL_ID") || DEFAULT_PORTFOLIO_CHANNEL_ID,
    dialogueChannelId: g("DISCORD_DIALOGUE_CHANNEL_ID"),
    operatorUserId: g("DISCORD_OPERATOR_USER_ID"),
    multiRoomG: g("SHIKISHIMA_DISCORD_MULTI_ROOM_G") === "1" || g("SHIKISHIMA_DISCORD_MULTI_ROOM_G") === "true"
  };
}

/**
 * @param {string} channelId
 * @param {ReturnType<typeof readDiscordChannelEnv>} cfg
 */
export function resolveChannelRole(channelId, cfg) {
  if (!channelId) return "unknown";
  if (channelId === cfg.commandChannelId) return "command";
  if (channelId === cfg.portfolioChannelId) return "portfolio";
  if (channelId === cfg.dialogueChannelId) return "dialogue";
  return "unknown";
}

export function isMultiRoomConfigured(cfg) {
  return Boolean(
    cfg.token &&
      cfg.portfolioChannelId &&
      cfg.dialogueChannelId &&
      (cfg.commandChannelId || cfg.dialogueChannelId)
  );
}
