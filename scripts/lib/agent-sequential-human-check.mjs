/**
 * Sequential all-agent Human Check — fixed local replies, no paid API calls.
 */

import { AGENT_TEAM_IDS } from "./dispatch-agent-reply.mjs";
import { safeDiscordContent } from "./discord-text-safe.mjs";

export const AGENT_SEQUENCE = AGENT_TEAM_IDS;

const ROLE_JA = {
  shikishima: "管制・全体俯瞰",
  shizume: "安全ゲート（HOLD維持）",
  tsumugi: "実装・EA/MT5/MQL5（Worker）",
  hajime: "設計・次の一手",
  shirube: "証跡・記録・調査"
};

const STEP_DELAY_MS = 1400;

/**
 * @param {string} content
 */
/** Bot自身の順番テスト返信を再トリガーしない */
export function isBotGeneratedHumanCheckMessage(content) {
  return /local-human-check|起動テスト\s*\(\d+\/5\)|全エージェント順番応答を開始|全\d+エージェント.*起動テスト完了/.test(
    String(content ?? "")
  );
}

/**
 * ユーザー明示コマンドのみ（Bot返信の「順番応答」文言では発火しない）
 * @param {string} content
 */
export function detectSequentialHumanCheck(content) {
  const c = String(content ?? "").trim();
  if (!c || isBotGeneratedHumanCheckMessage(c)) return false;
  if (/^!agent-test\b/i.test(c)) return true;
  if (/^!(起動テスト|回答テスト)\b/i.test(c)) return true;
  if (/^(起動テスト|回答テスト)$/i.test(c)) return true;
  if (/^順番での回答$/i.test(c)) return true;
  if (/^全員順番(回答|応答)$/i.test(c)) return true;
  return false;
}

/**
 * @param {string} agentId
 * @param {number} index 1-based
 * @param {number} total
 * @param {Record<string, { label?: string, webhookName?: string }>} agentsMeta
 */
export function buildLocalHumanCheckReply(agentId, index, total, agentsMeta) {
  const meta = agentsMeta[agentId] ?? {};
  const label = meta.label ?? `**${agentId}**`;
  const role = ROLE_JA[agentId] ?? "エージェント";
  return safeDiscordContent(
    `${label}\n` +
      `**起動テスト** (${index}/${total})\n` +
      `経路: \`local-human-check\`（**API課金なし**・Groq/Claude未使用）\n` +
      `役割: ${role}\n` +
      `状態: OK — 応答経路はローカル固定文です。`
  );
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * @param {{
 *   channelId: string,
 *   token: string,
 *   sendReply: (channelId: string, token: string, agentId: string, text: string) => Promise<{ id?: string } | null | undefined>,
 *   agentsMeta: Record<string, { label?: string, webhookName?: string }>,
 *   auditLog?: (obj: object) => void,
 *   onStep?: (agentId: string, index: number) => void
 * }} opts
 */
export async function runAgentSequentialHumanCheck(opts) {
  const total = AGENT_SEQUENCE.length;
  const { channelId, token, sendReply, agentsMeta, auditLog, onStep } = opts;

  const intro = safeDiscordContent(
    `${agentsMeta.shikishima?.label ?? "🏯 **しきしま**"}\n` +
      `**全エージェント順番応答**を開始します（${total}件）。\n` +
      `経路: \`local-human-check\`（API課金なし）`
  );
  await sendReply(channelId, token, "shikishima", intro);
  await sleep(STEP_DELAY_MS);

  for (let i = 0; i < AGENT_SEQUENCE.length; i++) {
    const agentId = AGENT_SEQUENCE[i];
    const index = i + 1;
    const text = buildLocalHumanCheckReply(agentId, index, total, agentsMeta);
    onStep?.(agentId, index);
    auditLog?.({
      kind: "agent_reply",
      agent: agentId,
      detail: "local-human-check/none",
      riskLevel: "low",
      metadata: {
        modelTrace: {
          backend: "local-human-check",
          model: "none",
          grokResearchHeld: true,
          sequentialHumanCheck: true,
          step: `${index}/${total}`
        }
      }
    });
    await sendReply(channelId, token, agentId, text);
    if (i < AGENT_SEQUENCE.length - 1) {
      await sleep(STEP_DELAY_MS);
    }
  }

  const footer = safeDiscordContent(
    `${agentsMeta.shirube?.label ?? "🕯 **しるべ**"}\n` +
      `✅ **全${total}エージェント**の起動テスト完了（local-human-check / API未使用）`
  );
  await sleep(STEP_DELAY_MS);
  await sendReply(channelId, token, "shirube", footer);

  if (typeof opts.refreshLastMessageId === "function") {
    await opts.refreshLastMessageId();
  }

  return { ok: true, steps: total, backend: "local-human-check" };
}
