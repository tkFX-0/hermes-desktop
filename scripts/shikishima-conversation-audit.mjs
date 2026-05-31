#!/usr/bin/env node
/**
 * 会話ログ審査（redacted）— discord-threads / agent-log / intake cursor
 * Usage: node scripts/shikishima-conversation-audit.mjs [--channel ID]
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { readDiscordChannelEnv } from "./lib/discord-channel-config.mjs";
import { buildRoomStatusReport } from "./lib/discord-agent-thread-store.mjs";

const MEM = join(homedir(), "Desktop", "プロジェクトファイル", "hermes-desktop", ".shikishima-memory");

function readJson(p, fallback = null) {
  try {
    return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : fallback;
  } catch {
    return fallback;
  }
}

const channelArg = process.argv.find((a) => a.startsWith("--channel="))?.split("=")[1];
const env = readDiscordChannelEnv(process.env);
const commandId = channelArg || env.commandChannelId || "";

console.log("=== しきしま 会話ログ審査（redacted）===\n");
console.log(`時刻: ${new Date().toISOString().slice(0, 19)}Z`);
console.log(`司令部 channelId: ${commandId || "(未設定)"}\n`);

if (commandId) {
  console.log(buildRoomStatusReport(commandId));
  console.log("");
}

const agentLog = readJson(join(MEM, "agent-log.json"), {});
console.log("--- agent-log 直近（各1件）---");
for (const [id, entries] of Object.entries(agentLog)) {
  const e = entries?.[0];
  if (!e) continue;
  console.log(`${id}: ${e.at} — ${String(e.decision).slice(0, 72)}…`);
}

const summary = readJson(join(MEM, "conversation-summary.json"), {});
console.log("\n--- conversation-summary ---");
console.log(`savedAt: ${summary.savedAt ?? "なし"}`);
console.log(`summary: ${String(summary.summary ?? "").slice(0, 100)}…`);

const cursor = readJson(join(MEM, "discord-intake-cursor.json"), {});
console.log("\n--- intake cursor ---");
for (const [ch, v] of Object.entries(cursor)) {
  console.log(`  ${ch.slice(-8)}: last=${String(v.lastHandledId ?? "").slice(-8)}`);
}

console.log("\n--- 判定メモ ---");
console.log(
  "Cursor 正本: skills/shikishima-* + .agents/skills。Bot: shikishima-runtime-skills.mjs で境界+4種要約をプロンプト注入。"
);
console.log("会話継続本体: .shikishima-memory/discord-threads/*.json");
console.log("詳細: docs/shikishima/CONVERSATION_BEHAVIOR_AUDIT_2026-05-30.md");
