#!/usr/bin/env node
/**
 * ポートフォリオ部屋への1件投稿テスト (最小版)
 * Run: node scripts/test-portfolio-post-once.mjs
 */

import { readFileSync, existsSync } from "node:fs";
import { resolveProjectRoot } from "./lib/project-root.mjs";
import { defaultEnvLocalPath } from "./lib/env-local-patch.mjs";

const root = resolveProjectRoot();
const envPath = defaultEnvLocalPath(root);

function loadEnvFile() {
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#") || !t.includes("=")) continue;
    const i = t.indexOf("=");
    const k = t.slice(0, i).trim();
    const v = t.slice(i + 1).trim();
    if (!process.env[k]) process.env[k] = v;
  }
}

async function discordPost(channelId, content, token) {
  const res = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bot ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content: content.slice(0, 2000) }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { ok: false, status: res.status, error: body?.message ?? `http_${res.status}` };
  }
  return { ok: true, id: body.id };
}

async function main() {
  loadEnvFile();

  const token = process.env.DISCORD_BOT_TOKEN;
  const channelId = process.env.DISCORD_PORTFOLIO_CHANNEL_ID ?? "1510129430100709407";

  if (!token) {
    console.error(JSON.stringify({ ok: false, error: "DISCORD_BOT_TOKEN missing" }));
    process.exit(1);
  }

  const message =
    `📎 **つむぎ** — ポートフォリオ投稿テスト\n` +
    `チャンネル: ${channelId}\n` +
    `時刻: ${new Date().toISOString()}\n` +
    `ステータス: test-portfolio-post-once 動作確認`;

  console.log(`[test] posting to portfolio channel ${channelId} ...`);
  const result = await discordPost(channelId, message, token);
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.ok ? 0 : 1);
}

main().catch((e) => {
  console.error(JSON.stringify({ ok: false, error: String(e.message ?? e) }));
  process.exit(1);
});
