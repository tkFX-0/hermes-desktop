/**
 * Portfolio + dialogue room test flow (local-only agent lines, no paid API).
 */

import { AGENT_SEQUENCE, buildLocalHumanCheckReply } from "./agent-sequential-human-check.mjs";
import { safeDiscordContent } from "./discord-text-safe.mjs";
import { buildOperatorNotifyContent } from "./discord-human-approval-notify.mjs";
import { isMultiRoomConfigured, readDiscordChannelEnv } from "./discord-channel-config.mjs";

const AGENT_META = {
  shikishima: { label: "🏯 **しきしま**" },
  shizume: { label: "🛡️ **しずめ**" },
  tsumugi: { label: "🪡 **つむぎ**" },
  hajime: { label: "🧭 **はじめ**" },
  shirube: { label: "🕯️ **しるべ**" }
};

/**
 * @param {string} [topic]
 */
export function buildPortfolioTestPost(topic = "マルチルーム接続テスト") {
  const ts = new Date().toISOString().slice(0, 16).replace("T", " ");
  return safeDiscordContent(
    `🕯️ **しるべ** — ポートフォリオ投稿（テスト）\n` +
      `時刻: ${ts}\n` +
      `件名: ${topic}\n` +
      `内容: Phase A–D 配線確認。Hermes バックエンド OFF。API 課金なし。\n` +
      `次: 対話部屋でエージェント読み合い → 許可待ち通知。`
  );
}

/**
 * @param {string} portfolioExcerpt
 */
export function buildDialogueLines(portfolioExcerpt) {
  const excerpt = String(portfolioExcerpt ?? "").slice(0, 120);
  const lines = [];
  let i = 0;
  for (const agentId of AGENT_SEQUENCE) {
    i += 1;
    const base = buildLocalHumanCheckReply(agentId, i, AGENT_SEQUENCE.length, AGENT_META);
    const baseText = typeof base?.text === "string" ? base.text : "";
    lines.push(
      safeDiscordContent(
        `${AGENT_META[agentId]?.label ?? agentId}\n` +
          `【対話】ポートフォリオ要約を確認 (${i}/${AGENT_SEQUENCE.length})\n` +
          `論点: ${excerpt || "（要約なし）"}\n` +
          `経路: local-dialogue（API課金なし）\n` +
          `所見: ${baseText.slice(0, 80)}`
      )
    );
  }
  lines.push(
    safeDiscordContent(
      `🛡️ **しずめ** — 対話完了\n` +
        `判定: decision=HOLD / execution=disabled\n` +
        `次: オペレーター GO が必要なら 1 回のみメンションします。`
    )
  );
  return lines;
}

/**
 * @param {Record<string, string>} env
 */
export function buildOperatorNotifyFromEnv(env = process.env) {
  const cfg = readDiscordChannelEnv(env);
  return buildOperatorNotifyContent(cfg.operatorUserId, "確認しました。");
}

/**
 * @typedef {{ postMessage: (channelId: string, body: string) => Promise<{ ok: boolean, id?: string, error?: string }> }} DiscordPoster
 */

/**
 * @param {DiscordPoster} poster
 * @param {Record<string, string>} env
 */
export async function runMultiRoomDiscordTest(poster, env = process.env) {
  const cfg = readDiscordChannelEnv(env);
  if (!cfg.multiRoomG) {
    return { ok: false, error: "multi_room_g_not_set", step: "gate" };
  }
  if (!isMultiRoomConfigured(cfg)) {
    return { ok: false, error: "channels_not_configured", step: "gate" };
  }

  const portfolioBody = buildPortfolioTestPost();
  const pRes = await poster.postMessage(cfg.portfolioChannelId, portfolioBody);
  if (!pRes.ok) {
    return { ok: false, error: pRes.error ?? "portfolio_post_failed", step: "portfolio" };
  }

  const dialogueLines = buildDialogueLines(portfolioBody);
  const dialogueIds = [];
  for (const line of dialogueLines) {
    const r = await poster.postMessage(cfg.dialogueChannelId, line);
    if (!r.ok) {
      return { ok: false, error: r.error ?? "dialogue_post_failed", step: "dialogue", dialogueIds };
    }
    dialogueIds.push(r.id ?? "");
    await new Promise((res) => setTimeout(res, 600));
  }

  const notify = buildOperatorNotifyFromEnv(env);
  let notifyResult = { ok: false, skipped: true };
  if (notify.ok) {
    const nRes = await poster.postMessage(cfg.dialogueChannelId, notify.content);
    notifyResult = { ok: nRes.ok, skipped: false, mentionSent: nRes.ok };
    if (!nRes.ok) {
      return { ok: false, error: nRes.error ?? "notify_failed", step: "notify", dialogueIds };
    }
  } else {
    const fallback = await poster.postMessage(
      cfg.dialogueChannelId,
      safeDiscordContent(
        `🛡️ **しずめ** — 許可待ち（メンション省略: ${notify.error}）\n` +
          `オペレーターは \`DISCORD_OPERATOR_USER_ID\` を .env.local に設定してください。`
      )
    );
    notifyResult = { ok: fallback.ok, skipped: true, reason: notify.error };
  }

  return {
    ok: true,
    step: "done",
    portfolioMessageId: pRes.id,
    dialogueMessageCount: dialogueIds.length,
    notify: notifyResult
  };
}
