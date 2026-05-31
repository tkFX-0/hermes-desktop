/**
 * 指示部屋の Discord 履歴取得 + スレッド hydrate + !部屋状況
 */

import * as https from "node:https";
import { redactMessagePreview } from "./discord-read-intake.mjs";
import {
  buildRoomStatusReport,
  mergeDiscordSnapshotIntoThread,
  loadChannelThreads
} from "./discord-agent-thread-store.mjs";
import { readDiscordChannelEnv } from "./discord-channel-config.mjs";
import { buildAgentLogContext } from "../shikishima-memory.mjs";

function discordGet(path, token) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: "discord.com",
        path: `/api/v10${path}`,
        method: "GET",
        headers: {
          Authorization: `Bot ${token}`,
          "User-Agent": "ShikishimaThread/1.0"
        },
        timeout: 15_000
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
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("discord_get_timeout"));
    });
    req.end();
  });
}

/** Bot 投稿からエージェント推定 */
function inferAgentFromBotContent(content) {
  const t = String(content ?? "");
  if (/しきしま|🏯/.test(t)) return "shikishima";
  if (/しずめ|🛡️/.test(t)) return "shizume";
  if (/つむぎ|🪡/.test(t)) return "tsumugi";
  if (/はじめ|🧭/.test(t)) return "hajime";
  if (/しるべ|🕯️/.test(t)) return "shirube";
  if (/ちはや|📈/.test(t)) return "chihaya";
  return "shikishima";
}

/**
 * @param {string} channelId
 * @param {string} token
 * @param {{ limit?: number }} [opts]
 */
export async function fetchChannelMessagesForThread(channelId, token, opts = {}) {
  const limit = Math.min(Math.max(opts.limit ?? 20, 1), 50);
  if (!token?.trim() || !channelId?.trim()) {
    return { ok: false, error: "missing_token_or_channel", messages: [] };
  }
  const res = await discordGet(`/channels/${channelId}/messages?limit=${limit}`, token);
  if (res.status !== 200 || !Array.isArray(res.body)) {
    return { ok: false, error: `discord_http_${res.status}`, messages: [] };
  }
  const messages = res.body
    .map((m) => ({
      id: String(m.id ?? ""),
      authorName: String(m.author?.username ?? "unknown").slice(0, 24),
      contentPreview: redactMessagePreview(m.content ?? ""),
      timestamp: String(m.timestamp ?? "").slice(0, 19),
      isBot: Boolean(m.author?.bot),
      agentId: m.author?.bot ? inferAgentFromBotContent(m.content) : null
    }))
    .reverse();
  return { ok: true, messages };
}

/**
 * @param {string} channelId
 * @param {string} token
 * @param {{ limit?: number }} [opts]
 */
export async function hydrateCommandRoomThread(channelId, token, opts = {}) {
  const fetched = await fetchChannelMessagesForThread(channelId, token, opts);
  if (!fetched.ok) return { ok: false, error: fetched.error, added: 0 };
  const added = mergeDiscordSnapshotIntoThread(channelId, fetched.messages);
  return { ok: true, added, readCount: fetched.messages.length };
}

/**
 * @param {string} channelId
 * @param {string} token
 * @param {Record<string, string>} [env]
 */
export async function buildFullRoomStatusMessage(channelId, token, env = process.env) {
  await hydrateCommandRoomThread(channelId, token, { limit: 25 }).catch(() => ({
    ok: false,
    added: 0
  }));

  const threadReport = buildRoomStatusReport(channelId);
  const agentLog = buildAgentLogContext();
  const cfg = readDiscordChannelEnv(env);
  const role =
    channelId === cfg.commandChannelId
      ? "司令部"
      : channelId === cfg.dialogueChannelId
        ? "対話"
        : channelId === cfg.portfolioChannelId
          ? "ポートフォリオ"
          : "その他";

  const state = loadChannelThreads(channelId);
  const parts = [
    threadReport,
    "",
    `部屋ロール: ${role}`,
    `スレッドファイル: discord-threads（${state.sharedLog.length} 共有）`
  ];
  if (agentLog) {
    parts.push("", agentLog);
  }
  parts.push(
    "",
    "※ 各エージェントは部屋×担当の JSON スレッドを常時参照します（Hermes SessionStore 相当）。",
    "本番反映・execution は引き続き **HOLD**。"
  );
  return parts.join("\n").slice(0, 1900);
}
