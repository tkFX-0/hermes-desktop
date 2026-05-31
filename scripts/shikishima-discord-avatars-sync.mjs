#!/usr/bin/env node
/**
 * 6体エージェント専用 Webhook + アバター同期
 * Usage: node scripts/shikishima-discord-avatars-sync.mjs
 */

import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import https from "node:https";
import { readDiscordChannelEnv } from "./lib/discord-channel-config.mjs";
import {
  AGENT_AVATAR_IDS,
  ensurePerAgentWebhooks
} from "./lib/discord-agent-avatars.mjs";

const ENV_PATH = join(homedir(), "Desktop", "プロジェクトファイル", "hermes-desktop", ".env.local");

function readEnvLocal() {
  const out = {};
  if (!existsSync(ENV_PATH)) return out;
  for (const line of readFileSync(ENV_PATH, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#") || !t.includes("=")) continue;
    const i = t.indexOf("=");
    out[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return out;
}

function discordRequest(method, path, token, body) {
  return new Promise((resolve, reject) => {
    const bodyStr = body ? JSON.stringify(body) : null;
    const req = https.request(
      {
        hostname: "discord.com",
        path: `/api/v10${path}`,
        method,
        headers: {
          Authorization: `Bot ${token}`,
          "Content-Type": "application/json",
          ...(bodyStr ? { "Content-Length": Buffer.byteLength(bodyStr) } : {})
        },
        timeout: 30_000
      },
      (res) => {
        let data = "";
        res.on("data", (c) => {
          data += c;
        });
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch {
            resolve({ status: res.statusCode, body: data });
          }
        });
      }
    );
    req.on("error", reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

const env = readDiscordChannelEnv({ ...process.env, ...readEnvLocal() });
if (!env.token || !env.commandChannelId) {
  console.error(JSON.stringify({ ok: false, error: "DISCORD_BOT_TOKEN or command channel missing" }));
  process.exit(1);
}

const urls = await ensurePerAgentWebhooks(env.commandChannelId, env.token, discordRequest);
const summary = AGENT_AVATAR_IDS.map((id) => ({ id, ok: Boolean(urls[id]) }));
console.log(JSON.stringify({ ok: summary.every((s) => s.ok), summary }, null, 2));
