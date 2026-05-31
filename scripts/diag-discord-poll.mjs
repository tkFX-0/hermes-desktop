#!/usr/bin/env node
/**
 * Discord intake diagnostic — shows exactly what the bot's poll() sees.
 * Redacted: prints no token, only message metadata + filter decision.
 *
 *   node scripts/diag-discord-poll.mjs
 */

import * as https from "node:https";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const ENV_PATH = join(homedir(), "Desktop", "プロジェクトファイル", "hermes-desktop", ".env.local");

function readEnv() {
  const out = {};
  if (!existsSync(ENV_PATH)) return out;
  for (const line of readFileSync(ENV_PATH, "utf-8").split("\n")) {
    const t = line.trim();
    if (t.startsWith("#") || !t.includes("=")) continue;
    const i = t.indexOf("=");
    out[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return out;
}

function discordGet(path, token) {
  return new Promise((resolve) => {
    const req = https.request(
      {
        hostname: "discord.com",
        path: `/api/v10${path}`,
        method: "GET",
        headers: { Authorization: `Bot ${token}`, "User-Agent": "shikishima-diag/1.0" },
        timeout: 10_000
      },
      (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(d) });
          } catch {
            resolve({ status: res.statusCode, body: d });
          }
        });
      }
    );
    req.on("error", (e) => resolve({ status: 0, body: e.message }));
    req.on("timeout", () => {
      req.destroy();
      resolve({ status: 408, body: "timeout" });
    });
    req.end();
  });
}

function isIncomingUserMessage(msg) {
  if (!msg?.id) return { ok: false, why: "no_id" };
  if (msg.webhook_id) return { ok: false, why: "webhook_id" };
  if (msg.author?.bot) return { ok: false, why: "author_bot" };
  return { ok: true, why: "user" };
}

const env = readEnv();
const token = env["DISCORD_BOT_TOKEN"];
const channelId = env["DISCORD_COMMAND_CHANNEL_ID"];

if (!token || !channelId) {
  console.log(JSON.stringify({ error: "missing_token_or_channel", tokenSet: Boolean(token), channelSet: Boolean(channelId) }, null, 2));
  process.exit(1);
}

const me = await discordGet("/users/@me", token);
const gw = await discordGet("/gateway/bot", token);
const msgs = await discordGet(`/channels/${channelId}/messages?limit=10`, token);

const report = {
  botUser: me.status === 200 ? { id: me.body.id, username: me.body.username } : { status: me.status, body: me.body },
  channelReadStatus: msgs.status,
  channelReadOk: msgs.status === 200,
  channelReadError: msgs.status === 200 ? null : msgs.body,
  intentsHint: "MESSAGE CONTENT INTENT must be ON in Developer Portal to read content",
  messages: []
};

if (msgs.status === 200 && Array.isArray(msgs.body)) {
  report.messages = msgs.body.map((m) => {
    const verdict = isIncomingUserMessage(m);
    return {
      id: m.id,
      author: m.author?.username ?? "?",
      authorBot: Boolean(m.author?.bot),
      webhook: Boolean(m.webhook_id),
      contentLen: (m.content ?? "").length,
      contentPreview: (m.content ?? "").slice(0, 30),
      wouldProcess: verdict.ok,
      filteredBy: verdict.ok ? null : verdict.why,
      ts: m.timestamp
    };
  });
  report.userMessagesVisible = report.messages.filter((m) => m.wouldProcess).length;
  report.contentEmptyOnUserMsgs = report.messages.filter((m) => m.wouldProcess && m.contentLen === 0).length;
}

console.log(JSON.stringify(report, null, 2));
