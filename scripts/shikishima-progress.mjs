/**
 * shikishima-progress.mjs
 * Discord progress gauge — task実行中にゲージ表示、完了で自動削除
 *
 * Usage:
 *   const p = createProgress({ channelId, token, webhookUrl, agentId, label });
 *   p.start();                         // 2s後にゲージ出現 (遅い処理のみ表示)
 *   p.update(50, "AI処理中...");        // 手動更新
 *   await p.done("完了");              // 100%表示 → 1.2s後に自動削除
 */

import * as https from "https";

const AGENT_EMOJI = {
  shikishima: "🏯", shizume: "🛡️", tsumugi: "🪡",
  hajime: "🧭", shirube: "🕯️", chihaya: "⚔️",
};

// ─── Gauge rendering ──────────────────────────────────────────────────────────

export function buildGauge(pct, label, detail, agentId = "shikishima") {
  const width = 20;
  const filled = Math.round(Math.min(100, Math.max(0, pct)) / 100 * width);
  const bar = "█".repeat(filled) + "░".repeat(width - filled);
  const emoji = AGENT_EMOJI[agentId] ?? "🏯";
  const lines = [`${emoji} \`[${bar}]\` **${pct}%** ${label}`];
  if (detail) lines.push(`*${detail}*`);
  return lines.join("\n");
}

// ─── HTTP helper ──────────────────────────────────────────────────────────────

function req(options, body) {
  return new Promise(resolve => {
    const r = https.request(options, res => {
      let d = "";
      res.on("data", c => d += c);
      res.on("end", () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(d) }); }
        catch { resolve({ status: res.statusCode, body: d }); }
      });
    });
    r.on("error", () => resolve({ status: 0, body: null }));
    r.on("timeout", () => { r.destroy(); resolve({ status: 408, body: null }); });
    if (body) r.write(body);
    r.end();
  });
}

// ─── Discord send / edit / delete ─────────────────────────────────────────────

function whSend(webhookUrl, text) {
  const b = JSON.stringify({ content: text.slice(0, 2000), allowed_mentions: { parse: [] } });
  const u = new URL(webhookUrl);
  return req({ hostname: u.hostname, path: u.pathname + "?wait=true", method: "POST",
    headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(b) }, timeout: 8000 }, b);
}

function whEdit(webhookUrl, msgId, text) {
  const b = JSON.stringify({ content: text.slice(0, 2000) });
  const u = new URL(webhookUrl);
  return req({ hostname: u.hostname, path: `${u.pathname}/messages/${msgId}`, method: "PATCH",
    headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(b) }, timeout: 8000 }, b);
}

function whDelete(webhookUrl, msgId) {
  const u = new URL(webhookUrl);
  return req({ hostname: u.hostname, path: `${u.pathname}/messages/${msgId}`, method: "DELETE", timeout: 5000 }, null);
}

function botSend(channelId, token, text) {
  const b = JSON.stringify({ content: text.slice(0, 2000) });
  return req({ hostname: "discord.com", path: `/api/v10/channels/${channelId}/messages`, method: "POST",
    headers: { Authorization: `Bot ${token}`, "Content-Type": "application/json", "Content-Length": Buffer.byteLength(b) }, timeout: 8000 }, b);
}

function botEdit(channelId, token, msgId, text) {
  const b = JSON.stringify({ content: text.slice(0, 2000) });
  return req({ hostname: "discord.com", path: `/api/v10/channels/${channelId}/messages/${msgId}`, method: "PATCH",
    headers: { Authorization: `Bot ${token}`, "Content-Type": "application/json", "Content-Length": Buffer.byteLength(b) }, timeout: 8000 }, b);
}

function botDelete(channelId, token, msgId) {
  return req({ hostname: "discord.com", path: `/api/v10/channels/${channelId}/messages/${msgId}`, method: "DELETE",
    headers: { Authorization: `Bot ${token}` }, timeout: 5000 }, null);
}

// ─── Progress tracker ─────────────────────────────────────────────────────────

const DEFER_MS = 2000;  // 2秒以上かかる処理のみゲージ表示

// 自動ステージ進行 (秒単位・開始から)
const AUTO_STAGES = [
  [2500, 25, "AI処理中..."],
  [7000, 50, "応答生成中..."],
  [14000, 75, "仕上げ中..."],
];

export function createProgress({ channelId, token, webhookUrl, agentId = "shikishima", label = "処理中" }) {
  let msgId = null;
  let finished = false;
  let deferTimer = null;
  const stageTimers = [];

  async function sendOrEdit(pct, detail) {
    const text = buildGauge(pct, label, detail, agentId);
    if (webhookUrl) {
      if (!msgId) { const r = await whSend(webhookUrl, text); msgId = r.body?.id ?? null; }
      else await whEdit(webhookUrl, msgId, text);
    } else {
      if (!msgId) { const r = await botSend(channelId, token, text); msgId = r.body?.id ?? null; }
      else await botEdit(channelId, token, msgId, text);
    }
  }

  async function remove() {
    if (!msgId) return;
    if (webhookUrl) await whDelete(webhookUrl, msgId).catch(() => {});
    else await botDelete(channelId, token, msgId).catch(() => {});
    msgId = null;
  }

  return {
    // 遅延起動: 2s後に初回表示、その後自動ステージ進行
    // 60s経過で自動削除 (例外で done() が呼ばれなかった場合の保護)
    start() {
      deferTimer = setTimeout(async () => {
        if (finished) return;
        await sendOrEdit(0, "受信中...").catch(() => {});
        for (const [delay, pct, detail] of AUTO_STAGES) {
          stageTimers.push(setTimeout(async () => {
            if (finished) return;
            await sendOrEdit(pct, detail).catch(() => {});
          }, delay));
        }
        // 60s安全タイムアウト: 未完了のゲージを強制削除
        stageTimers.push(setTimeout(async () => {
          if (!finished) { finished = true; await remove().catch(() => {}); }
        }, 60_000));
      }, DEFER_MS);
    },

    // 手動更新 (ステップ数が明確な場合)
    async update(pct, detail = "") {
      if (msgId) await sendOrEdit(pct, detail).catch(() => {});
    },

    // 完了: 100%表示 → 1.2s → 削除
    async done(finalDetail = "完了") {
      finished = true;
      clearTimeout(deferTimer);
      stageTimers.forEach(t => clearTimeout(t));
      if (msgId) {
        await sendOrEdit(100, finalDetail).catch(() => {});
        await new Promise(r => setTimeout(r, 1200));
        await remove();
      }
    },
  };
}
