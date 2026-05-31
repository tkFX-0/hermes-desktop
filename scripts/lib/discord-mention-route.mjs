/**
 * Discord @mention → agent routing (snowflake + テキスト @しきしま).
 */

import {
  normalizeDiscordUserContent,
  stripAllDiscordMentions
} from "./discord-inbound-filter.mjs";

export { stripAllDiscordMentions };

/**
 * env: DISCORD_AGENT_MENTION_IDS=shikishima:123,tsumugi:456
 * @param {Record<string, string>} env
 */
export function parseAgentMentionIdMap(env = {}) {
  const raw = env.DISCORD_AGENT_MENTION_IDS ?? process.env.DISCORD_AGENT_MENTION_IDS ?? "";
  const out = {};
  if (!raw.trim()) return out;
  for (const part of raw.split(",")) {
    const [agent, id] = part.split(":").map((s) => s.trim());
    if (agent && id) out[agent] = id.replace(/\D/g, "");
  }
  return out;
}

/**
 * @param {Array<{ id?: string }>} mentions
 * @param {Record<string, string>} idMap agentId → snowflake
 */
export function resolveAgentIdFromMentionIds(mentions, idMap) {
  if (!mentions?.length || !Object.keys(idMap).length) return null;
  const ids = new Set(mentions.map((m) => String(m.id ?? "").replace(/\D/g, "")));
  for (const [agentId, snowflake] of Object.entries(idMap)) {
    if (ids.has(snowflake)) return agentId;
  }
  return null;
}

/**
 * テキスト @ 名（routeAgent と同じ規則の抜粋）
 * @param {string} text
 */
export function resolveAgentIdFromTextMention(text) {
  const t = normalizeDiscordUserContent(text);
  if (/@(しきしま|shikishima)/i.test(t)) return "shikishima";
  if (/@(しずめ|shizume)/i.test(t)) return "shizume";
  if (/@(つむぎ|tsumugi)/i.test(t)) return "tsumugi";
  if (/@(はじめ|hajime)/i.test(t)) return "hajime";
  if (/@(しるべ|shirube)/i.test(t)) return "shirube";
  return null;
}

/**
 * @param {object} input
 * @param {string} input.content
 * @param {Array<{ id?: string }>} [input.mentions]
 * @param {string} [input.botUserId]
 * @param {string} [input.operatorUserId]
 * @param {Record<string, string>} [input.env]
 * @param {(msg: string) => string} [input.routeAgentFn] — bot の routeAgent
 */
export function resolveInboundAgentRoute(input) {
  const env = input.env ?? process.env;
  const raw = String(input.content ?? "");
  const mentions = input.mentions ?? [];
  const botId = String(input.botUserId ?? env.DISCORD_BOT_USER_ID ?? "").replace(/\D/g, "");
  const operatorId = String(input.operatorUserId ?? env.DISCORD_OPERATOR_USER_ID ?? "").replace(/\D/g, "");

  const textAfterSnowflake = stripAllDiscordMentions(raw);
  const textNorm = normalizeDiscordUserContent(textAfterSnowflake);

  const idMap = parseAgentMentionIdMap(env);
  const fromSnowflakeMap = resolveAgentIdFromMentionIds(mentions, idMap);
  const fromText = resolveAgentIdFromTextMention(raw);

  const mentionIds = new Set(mentions.map((m) => String(m.id ?? "").replace(/\D/g, "")));
  const botMentioned = botId && mentionIds.has(botId);
  const operatorMentioned = operatorId && mentionIds.has(operatorId);

  let agentId =
    fromSnowflakeMap ??
    fromText ??
    (input.routeAgentFn ? input.routeAgentFn(raw) : "shikishima");

  const mentionOnly = botMentioned && textNorm.length === 0 && !fromText && !fromSnowflakeMap;

  let userText = textNorm;
  if (mentionOnly) {
    agentId = fromSnowflakeMap ?? fromText ?? "shikishima";
    userText =
      "（Botメンションのみ）直近の指示部屋の文脈を踏まえ、要約と次の一手を短く返答してください。";
  } else if (!userText && raw.trim()) {
    userText = stripAllDiscordMentions(raw) || raw.trim().slice(0, 500);
  }

  return {
    agentId,
    userText: userText.slice(0, 2000),
    mentionOnly,
    botMentioned,
    operatorMentioned,
    routedVia: fromSnowflakeMap
      ? "mention_id_map"
      : fromText
        ? "text_mention"
        : botMentioned
          ? "bot_mention"
          : "keyword_route"
  };
}
