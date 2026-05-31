/**
 * エージェント別 Discord Webhook アバター（assets/discord-agents/*.png）
 * 各エージェント専用 Webhook を作成し PATCH で画像を設定（CDN 削除問題を回避）
 */

import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { resolveProjectRoot } from "./project-root.mjs";
import { AGENT_TEAM_IDS } from "./dispatch-agent-reply.mjs";

export const AGENT_AVATAR_IDS = [...AGENT_TEAM_IDS];

const AVATAR_DIR = join(resolveProjectRoot(), "assets", "discord-agents");
const WEBHOOK_MAP_FILE = join(
  resolveProjectRoot(),
  ".shikishima-memory",
  "discord-agent-webhook-map.json"
);

/** @param {string} agentId */
export function webhookNameForAgent(agentId) {
  return `shiki-agent-${agentId}`;
}

function sha256File(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function loadWebhookMap() {
  if (!existsSync(WEBHOOK_MAP_FILE)) return {};
  try {
    const data = JSON.parse(readFileSync(WEBHOOK_MAP_FILE, "utf8"));
    return typeof data === "object" && data ? data : {};
  } catch {
    return {};
  }
}

function saveWebhookMap(map) {
  mkdirSync(join(resolveProjectRoot(), ".shikishima-memory"), { recursive: true });
  writeFileSync(WEBHOOK_MAP_FILE, JSON.stringify(map, null, 2), "utf8");
}

/**
 * @param {string} agentId
 */
export function localAvatarPath(agentId) {
  return join(AVATAR_DIR, `${agentId}.png`);
}

/**
 * Discord Modify Webhook は avatar に data URI (base64) を要求する
 * @param {string} filePath
 */
export function avatarDataUriFromFile(filePath) {
  const buf = readFileSync(filePath);
  return `data:image/png;base64,${buf.toString("base64")}`;
}

/**
 * @param {string} webhookId
 * @param {string} webhookToken
 * @param {string} filePath
 */
export async function patchWebhookAvatarFromFile(webhookId, webhookToken, filePath) {
  const avatar = avatarDataUriFromFile(filePath);
  const res = await fetch(`https://discord.com/api/v10/webhooks/${webhookId}/${webhookToken}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ avatar })
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`PATCH webhook avatar: HTTP ${res.status} ${body?.message ?? ""}`);
  }
  return body;
}

/**
 * @param {string} channelId
 * @param {string} botToken
 * @param {string} agentId
 * @param {(m: string, p: string, t: string, b?: object) => Promise<{status: number, body: unknown}>} discordRequest
 */
async function getOrCreateAgentWebhook(channelId, botToken, agentId, discordRequest) {
  const name = webhookNameForAgent(agentId);
  const path = localAvatarPath(agentId);
  const map = loadWebhookMap();
  const channelEntry = map[channelId] ?? {};
  const cached = channelEntry[agentId];

  if (cached?.url && cached?.id && cached?.token) {
    if (existsSync(path)) {
      const hash = sha256File(path);
      if (cached.sha256 !== hash) {
        await patchWebhookAvatarFromFile(cached.id, cached.token, path);
        channelEntry[agentId] = { ...cached, sha256: hash, at: new Date().toISOString() };
        map[channelId] = channelEntry;
        saveWebhookMap(map);
        console.log(`[Avatar] ${agentId} webhook avatar updated`);
      }
    }
    return cached.url;
  }

  const list = await discordRequest("GET", `/channels/${channelId}/webhooks`, botToken);
  let hook = null;
  if (list.status === 200 && Array.isArray(list.body)) {
    hook = list.body.find((w) => w.name === name);
  }

  if (!hook) {
    const createBody = { name };
    if (existsSync(path)) {
      createBody.avatar = avatarDataUriFromFile(path);
    }
    const created = await discordRequest("POST", `/channels/${channelId}/webhooks`, botToken, createBody);
    if (created.status !== 200 && created.status !== 201) {
      throw new Error(`create webhook ${agentId}: HTTP ${created.status}`);
    }
    hook = created.body;
  }

  if (existsSync(path)) {
    try {
      await patchWebhookAvatarFromFile(hook.id, hook.token, path);
    } catch (e) {
      console.warn(`[Avatar] PATCH ${agentId}:`, e.message);
    }
  }

  const url = `https://discord.com/api/webhooks/${hook.id}/${hook.token}`;
  channelEntry[agentId] = {
    id: hook.id,
    token: hook.token,
    url,
    sha256: existsSync(path) ? sha256File(path) : undefined,
    at: new Date().toISOString()
  };
  map[channelId] = channelEntry;
  saveWebhookMap(map);
  console.log(`[Avatar] ${agentId} dedicated webhook ready`);
  return url;
}

/**
 * チャンネルごとに6体分の Webhook（専用アバター付き）を用意
 * @param {string} channelId
 * @param {string} botToken
 * @param {(m: string, p: string, t: string, b?: object) => Promise<{status: number, body: unknown}>} discordRequest
 * @returns {Promise<Record<string, string>>}
 */
export async function ensurePerAgentWebhooks(channelId, botToken, discordRequest) {
  /** @type {Record<string, string>} */
  const urls = {};
  const results = [];

  for (const agentId of AGENT_AVATAR_IDS) {
    try {
      urls[agentId] = await getOrCreateAgentWebhook(channelId, botToken, agentId, discordRequest);
      results.push({ agentId, ok: true });
    } catch (e) {
      results.push({ agentId, ok: false, reason: e.message });
      console.warn(`[Avatar] webhook ${agentId} failed:`, e.message);
    }
  }

  const okN = results.filter((r) => r.ok).length;
  console.log(`[Avatar] per-agent webhooks ${okN}/${AGENT_AVATAR_IDS.length} for channel …${String(channelId).slice(-6)}`);
  return urls;
}

/**
 * @param {string} channelId
 * @param {Record<string, string>} urls
 */
export function getAgentWebhookUrl(channelId, agentId, urls) {
  if (urls?.[agentId]) return urls[agentId];
  const map = loadWebhookMap();
  return map[channelId]?.[agentId]?.url ?? null;
}

export { AVATAR_DIR, WEBHOOK_MAP_FILE };
