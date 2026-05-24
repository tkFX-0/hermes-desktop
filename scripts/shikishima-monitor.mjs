/**
 * Shikishima Self-Monitor — Lv8
 * しずめ担当: 30分ごとAPIヘルスチェック・異常検知・自動アラート
 */

import * as https from "https";

// ─── 状態追跡 ─────────────────────────────────────────────────────────────────

const _state = {
  startTime: Date.now(),
  apiCalls:   { groq: 0, grok: 0, claude: 0, discord: 0 },
  apiFails:   { groq: 0, grok: 0, claude: 0, discord: 0 },
  lastAlerts: [],
  discordSent: 0,
  tickCount:  0,
};

export function recordApiCall(provider, success) {
  _state.apiCalls[provider]  = (_state.apiCalls[provider]  ?? 0) + 1;
  if (!success) _state.apiFails[provider] = (_state.apiFails[provider] ?? 0) + 1;
}

export function recordDiscordSend() { _state.discordSent++; }

export function getUptimeMinutes() {
  return Math.floor((Date.now() - _state.startTime) / 60_000);
}

// ─── ヘルスチェック ───────────────────────────────────────────────────────────

async function pingGroq(apiKey) {
  return new Promise(resolve => {
    const body = JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: "ping" }],
      max_tokens: 5,
    });
    const req = https.request({
      hostname: "api.groq.com",
      path: "/openai/v1/chat/completions",
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
      timeout: 10_000,
    }, res => {
      res.resume();
      resolve({ ok: res.statusCode < 400, status: res.statusCode });
    });
    req.on("error", () => resolve({ ok: false, status: -1 }));
    req.on("timeout", () => { req.destroy(); resolve({ ok: false, status: 0 }); });
    req.write(body);
    req.end();
  });
}

async function pingDiscord(token) {
  return new Promise(resolve => {
    const req = https.request({
      hostname: "discord.com",
      path: "/api/v10/users/@me",
      method: "GET",
      headers: { Authorization: `Bot ${token}` },
      timeout: 8_000,
    }, res => {
      res.resume();
      resolve({ ok: res.statusCode === 200, status: res.statusCode });
    });
    req.on("error", () => resolve({ ok: false, status: -1 }));
    req.on("timeout", () => { req.destroy(); resolve({ ok: false, status: 0 }); });
    req.end();
  });
}

// ─── 異常検知 ─────────────────────────────────────────────────────────────────

function detectAnomalies() {
  const alerts = [];

  // API失敗率チェック (失敗 > 50% かつ 5回以上)
  for (const [provider, calls] of Object.entries(_state.apiCalls)) {
    const fails = _state.apiFails[provider] ?? 0;
    if (calls >= 5 && fails / calls > 0.5) {
      alerts.push(`⚠️ ${provider} API失敗率 ${Math.round(fails / calls * 100)}% (${fails}/${calls})`);
    }
  }

  // Discord送信数の急増 (30分で50件以上)
  if (_state._prevDiscordSent !== undefined) {
    const delta = _state.discordSent - _state._prevDiscordSent;
    if (delta > 50) alerts.push(`⚠️ Discord送信急増: 30分で${delta}件`);
  }
  _state._prevDiscordSent = _state.discordSent;

  return alerts;
}

// ─── モニターループ ────────────────────────────────────────────────────────────

export function startSelfMonitor({ groqKey, discordToken, sendAlert, intervalMs = 30 * 60 * 1000 }) {
  async function check() {
    _state.tickCount++;
    const issues = [];

    // APIヘルスチェック
    if (groqKey) {
      const groq = await pingGroq(groqKey);
      if (!groq.ok) issues.push(`🔴 Groq API応答なし (status: ${groq.status})`);
    }
    if (discordToken) {
      const disc = await pingDiscord(discordToken);
      if (!disc.ok) issues.push(`🔴 Discord API応答なし (status: ${disc.status})`);
    }

    // 異常検知
    issues.push(...detectAnomalies());

    const uptimeMin = getUptimeMinutes();
    const uptimeH = Math.floor(uptimeMin / 60);
    const uptimeM = uptimeMin % 60;

    if (issues.length > 0) {
      const msg = [
        `🛡️ **しずめ** — システム監視アラート (tick #${_state.tickCount})`,
        `稼働時間: ${uptimeH}h ${uptimeM}m`,
        ``,
        ...issues,
        ``,
        `API統計: Groq ${_state.apiCalls.groq ?? 0}回 / Grok ${_state.apiCalls.grok ?? 0}回 / Claude ${_state.apiCalls.claude ?? 0}回`,
      ].join("\n");
      await sendAlert(msg);
      _state.lastAlerts.push({ time: new Date().toISOString(), issues });
      if (_state.lastAlerts.length > 10) _state.lastAlerts.shift();
      console.log(`[Monitor] アラート送信: ${issues.length}件`);
    } else {
      console.log(`[Monitor] ヘルスチェック OK (tick #${_state.tickCount}, uptime ${uptimeH}h${uptimeM}m)`);
    }
  }

  // 起動時に即1回チェック (5分後)
  setTimeout(check, 5 * 60 * 1000);
  setInterval(check, intervalMs);
  console.log(`🛡️ しずめ監視ループ起動 — ${intervalMs / 60_000}分ごとにヘルスチェック`);
}

// ─── ステータスサマリー ────────────────────────────────────────────────────────

export function buildMonitorContext() {
  const uptimeMin = getUptimeMinutes();
  const totalCalls = Object.values(_state.apiCalls).reduce((a, b) => a + b, 0);
  const totalFails = Object.values(_state.apiFails).reduce((a, b) => a + b, 0);
  if (totalCalls < 3) return "";
  return [
    `[システム状態]`,
    `  稼働: ${Math.floor(uptimeMin / 60)}h${uptimeMin % 60}m / API: ${totalCalls}回 (失敗${totalFails}回)`,
    _state.lastAlerts.length > 0 ? `  最終アラート: ${_state.lastAlerts[_state.lastAlerts.length - 1]?.issues[0]}` : "",
  ].filter(Boolean).join("\n");
}
