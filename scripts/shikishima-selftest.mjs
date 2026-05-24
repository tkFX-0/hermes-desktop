/**
 * Shikishima Self-Test — 起動時セルフ診断
 * 全コンポーネントの状態をチェックしてDiscordにレポートを送信
 */

import * as https from "https";
import * as http from "http";
import * as net from "net";
import { execFile } from "child_process";
import { existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import { scanMt5DataPath } from "./shikishima-mt5.mjs";

// ─── 各種チェック ──────────────────────────────────────────────────────────────

async function checkDiscordBot(token) {
  return new Promise(resolve => {
    const req = https.request({
      hostname: "discord.com", path: "/api/v10/users/@me", method: "GET",
      headers: { Authorization: `Bot ${token}` }, timeout: 8_000,
    }, res => {
      let d = ""; res.on("data", c => d += c);
      res.on("end", () => {
        try {
          const b = JSON.parse(d);
          resolve({ ok: res.statusCode === 200, name: b.username, id: b.id });
        } catch { resolve({ ok: false }); }
      });
    });
    req.on("error", () => resolve({ ok: false }));
    req.on("timeout", () => { req.destroy(); resolve({ ok: false, error: "timeout" }); });
    req.end();
  });
}

async function checkWebhookPermission(channelId, token) {
  return new Promise(resolve => {
    const req = https.request({
      hostname: "discord.com",
      path: `/api/v10/channels/${channelId}/webhooks`,
      method: "GET",
      headers: { Authorization: `Bot ${token}` },
      timeout: 8_000,
    }, res => {
      res.resume();
      resolve({ ok: res.statusCode === 200, status: res.statusCode });
    });
    req.on("error", () => resolve({ ok: false }));
    req.on("timeout", () => { req.destroy(); resolve({ ok: false }); });
    req.end();
  });
}

async function checkVoicevox() {
  return new Promise(resolve => {
    const req = http.get("http://localhost:50021/version", res => {
      let d = ""; res.on("data", c => d += c);
      res.on("end", () => resolve({ ok: true, version: d.trim().replace(/"/g, "") }));
      res.on("error", () => resolve({ ok: false }));
    });
    req.on("error", () => resolve({ ok: false }));
    req.setTimeout(3_000, () => { req.destroy(); resolve({ ok: false }); });
  });
}

async function checkStackchan() {
  return new Promise(resolve => {
    const sock = net.createConnection({ host: "<STACKCHAN_HOST>", port: 8080 });
    sock.setTimeout(3000);
    sock.on("connect", () => { sock.destroy(); resolve({ ok: true }); });
    sock.on("error", () => resolve({ ok: false }));
    sock.on("timeout", () => { sock.destroy(); resolve({ ok: false }); });
  }).catch(() => ({ ok: false }));
}

async function checkGroq(apiKey) {
  if (!apiKey) return { ok: false, error: "no_key" };
  return new Promise(resolve => {
    const body = JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: "ping" }],
      max_tokens: 3,
    });
    const req = https.request({
      hostname: "api.groq.com", path: "/openai/v1/chat/completions", method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) },
      timeout: 10_000,
    }, res => { res.resume(); resolve({ ok: res.statusCode < 400, status: res.statusCode }); });
    req.on("error", () => resolve({ ok: false }));
    req.on("timeout", () => { req.destroy(); resolve({ ok: false }); });
    req.write(body); req.end();
  });
}

async function checkGrok() {
  return new Promise(resolve => {
    execFile("wsl", ["-d", "Ubuntu", "--", "bash", "--login", "-c",
      `~/.local/bin/hermes chat -Q -q "ping" -m grok-4.3 --provider xai-oauth --yolo 2>&1 | head -5`],
      { timeout: 30_000 },
      (err, stdout) => {
        const clean = (stdout || "").replace(/\x1B\[[0-9;]*[mGKHF]/g, "").trim();
        resolve({ ok: !err && clean.length > 0, preview: clean.slice(0, 50) });
      });
  });
}

// ─── メイン診断 ───────────────────────────────────────────────────────────────

export async function runSelfTest({ token, channelId, groqKey }) {
  const results = {};

  // 並列チェック
  const [bot, webhook, voicevox, groq] = await Promise.all([
    checkDiscordBot(token),
    checkWebhookPermission(channelId, token),
    checkVoicevox(),
    checkGroq(groqKey),
  ]);

  results.discordBot     = bot;
  results.webhookPerm    = webhook;
  results.voicevox       = voicevox;
  results.groq           = groq;

  // MT5スキャン (同期)
  const mt5Scan = scanMt5DataPath();
  results.mt5 = {
    ok: mt5Scan.dataFiles.length > 0,
    dataFiles: mt5Scan.dataFiles,
    terminals: mt5Scan.terminals,
  };

  return results;
}

export function buildSelfTestReport(results, botPid) {
  const ok  = v => v ? "✅" : "❌";
  const warn = v => v ? "✅" : "⚠️";
  const lines = [
    `🏯 **しきしま 起動診断レポート**`,
    `PID: ${botPid} / ${new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}`,
    ``,
    `**Discord**`,
    `  ${ok(results.discordBot?.ok)} Botアカウント: ${results.discordBot?.name ?? "未接続"} (${results.discordBot?.id ?? "-"})`,
    `  ${ok(results.webhookPerm?.ok)} Webhook権限: ${results.webhookPerm?.ok ? "OK" : `403 — DiscordサーバーでBotに「Webhookを管理」権限を付与してください`}`,
    ``,
    `**AI エンジン**`,
    `  ${ok(results.groq?.ok)} Groq API: ${results.groq?.ok ? "OK" : `エラー (key確認要)`}`,
    ``,
    `**StackChan**`,
    `  ${warn(results.voicevox?.ok)} VOICEVOX: ${results.voicevox?.ok ? `v${results.voicevox.version}` : "未起動 — localhost:50021"}`,
    ``,
    `**MT5**`,
    `  ${warn(results.mt5?.ok)} データファイル: ${results.mt5?.ok ? results.mt5.dataFiles[0] : "未検出"}`,
    results.mt5?.terminals?.length > 0
      ? `  検出済みTerminal: ${results.mt5.terminals.map(t => t.id.slice(0, 8) + "...").join(", ")}`
      : `  Terminal未検出 (MT5が未インストール or 別パス)`,
    ``,
  ];

  // ガイドセクション
  const issues = [];
  if (!results.webhookPerm?.ok) {
    issues.push(`🔧 **Webhook修正**: Discordサーバー設定 → ロール/メンバー → BotのPermissions → 「Webhookを管理」をON`);
  }
  if (!results.mt5?.ok) {
    issues.push(`🔧 **MT5設定**: \`docs/mql5/ShikishimaDataExport.mq5\` をMT5でコンパイルしてXAUUSD M5チャートに追加`);
  }
  if (!results.voicevox?.ok) {
    issues.push(`🔧 **VOICEVOX**: VOICEVOXアプリを起動してください (StackChan発話が無効になっています)`);
  }

  if (issues.length > 0) {
    lines.push(`**修正が必要な項目**`);
    lines.push(...issues);
  } else {
    lines.push(`全システム正常稼働中 🎉`);
  }

  return lines.join("\n").slice(0, 2000);
}
