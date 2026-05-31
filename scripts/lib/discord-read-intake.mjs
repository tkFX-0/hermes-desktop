/**
 * Phase E5 — Discord channel read (GET only, redacted). No message send.
 */

import * as https from "node:https";
import { existsSync, readFileSync, appendFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

function stripQuotes(v) {
  if (v.length < 2) return v;
  const f = v[0];
  const l = v[v.length - 1];
  return f === l && (f === '"' || f === "'") ? v.slice(1, -1) : v;
}

/**
 * @param {string} projectRoot
 */
export function readDiscordEnv(projectRoot) {
  const path = join(projectRoot, ".env.local");
  const out = { token: process.env.DISCORD_BOT_TOKEN ?? "", channelId: process.env.DISCORD_COMMAND_CHANNEL_ID ?? "" };
  if (!existsSync(path)) return out;
  for (const line of readFileSync(path, "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#") || !t.includes("=")) continue;
    const i = t.indexOf("=");
    const key = t.slice(0, i).trim();
    const val = stripQuotes(t.slice(i + 1).trim());
    if (key === "DISCORD_BOT_TOKEN") out.token = val;
    if (key === "DISCORD_COMMAND_CHANNEL_ID") out.channelId = val;
  }
  return out;
}

/**
 * @param {string} text
 */
export function redactMessagePreview(text) {
  return String(text ?? "")
    .replace(/[A-Za-z0-9_-]{24,}/g, "[redacted]")
    .replace(/\b\d{17,}\b/g, "[id]")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

function discordGet(path, token) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: "discord.com",
        path: `/api/v10${path}`,
        method: "GET",
        headers: {
          Authorization: `Bot ${token}`,
          "User-Agent": "ShikishimaAutonomy/1.0",
        },
        timeout: 15_000,
      },
      (res) => {
        let data = "";
        res.on("data", (c) => { data += c; });
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch {
            resolve({ status: res.statusCode, body: data });
          }
        });
      },
    );
    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("discord_get_timeout"));
    });
    req.end();
  });
}

/**
 * @param {string} projectRoot
 * @param {{ limit?: number }} [opts]
 */
export async function fetchDiscordChannelMessagesRedacted(projectRoot, opts = {}) {
  const limit = Math.min(Math.max(opts.limit ?? 10, 1), 25);
  const { token, channelId } = readDiscordEnv(projectRoot);
  if (!token?.trim()) return { ok: false, error: "discord_token_missing", readCount: 0, messages: [] };
  if (!channelId?.trim()) return { ok: false, error: "discord_channel_missing", readCount: 0, messages: [] };

  const res = await discordGet(`/channels/${channelId}/messages?limit=${limit}`, token);
  if (res.status !== 200 || !Array.isArray(res.body)) {
    return { ok: false, error: `discord_http_${res.status}`, readCount: 0, messages: [] };
  }

  const messages = res.body.map((m) => ({
    id: String(m.id ?? "").slice(-6),
    authorName: String(m.author?.username ?? "unknown").slice(0, 24),
    contentPreview: redactMessagePreview(m.content ?? ""),
    timestamp: String(m.timestamp ?? "").slice(0, 19),
    isBot: Boolean(m.author?.bot),
  }));

  return { ok: true, readCount: messages.length, messages, channelConfigured: true };
}

/**
 * @param {string} projectRoot
 * @param {object} summary
 */
export function appendDiscordReadAudit(projectRoot, summary) {
  const dir = join(projectRoot, ".shikishima-memory", "audit");
  mkdirSync(dir, { recursive: true });
  const line = JSON.stringify({
    at: new Date().toISOString(),
    kind: "discord_read_intake",
    ...summary,
  });
  appendFileSync(join(dir, "discord-read-intake.jsonl"), `${line}\n`, "utf-8");
}
