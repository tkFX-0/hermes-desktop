#!/usr/bin/env node
/**
 * G: SHIKISHIMA_DISCORD_MULTI_ROOM_G=1 — portfolio + dialogue test posts.
 * Run: node scripts/shikishima-discord-multi-room-test.mjs
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { resolveProjectRoot } from "./lib/project-root.mjs";
import { patchEnvLocal, defaultEnvLocalPath } from "./lib/env-local-patch.mjs";
import { runMultiRoomDiscordTest } from "./lib/discord-multi-room.mjs";
import { readDiscordChannelEnv } from "./lib/discord-channel-config.mjs";

const root = resolveProjectRoot();
const envPath = defaultEnvLocalPath(root);
process.env.SHIKISHIMA_ENV_LOCAL_PATH = envPath;

function loadEnvFile() {
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#") || !t.includes("=")) continue;
    const i = t.indexOf("=");
    const k = t.slice(0, i).trim();
    const v = t.slice(i + 1).trim();
    if (!process.env[k]) process.env[k] = v;
  }
}

async function discordPost(channelId, content, token) {
  const res = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bot ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ content: content.slice(0, 2000) })
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { ok: false, error: body?.message ?? `http_${res.status}` };
  }
  return { ok: true, id: body.id };
}

async function main() {
  const applyEnv = process.argv.includes("--apply-env");
  if (applyEnv) {
    patchEnvLocal(envPath, {
      DISCORD_PORTFOLIO_CHANNEL_ID: "1510129430100709407",
      DISCORD_DIALOGUE_CHANNEL_ID: "1510127716207296693",
      SHIKISHIMA_DISCORD_MULTI_ROOM_G: "1"
    });
    console.log("[multi-room] .env.local patched (channel ids + MULTI_ROOM_G)");
  }

  loadEnvFile();
  const cfg = readDiscordChannelEnv(process.env);
  if (!cfg.token) {
    console.error(JSON.stringify({ ok: false, error: "DISCORD_BOT_TOKEN missing" }));
    process.exit(1);
  }

  const poster = {
    postMessage: (channelId, body) => discordPost(channelId, body, cfg.token)
  };

  const result = await runMultiRoomDiscordTest(poster, process.env);
  console.log(JSON.stringify({ ok: result.ok, ...result }, null, 2));
  process.exit(result.ok ? 0 : 1);
}

main().catch((e) => {
  console.error(JSON.stringify({ ok: false, error: String(e.message ?? e) }));
  process.exit(1);
});
