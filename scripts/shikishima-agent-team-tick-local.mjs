#!/usr/bin/env node
/**
 * 5-agent maintenance tick — plain Node.
 * Default: local-only (no API billing). Pass --live-api to call Groq/Claude via WSL.
 */

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";

import { AGENT_TEAM_IDS, dispatchAgentReply } from "./lib/dispatch-agent-reply.mjs";
import {
  canRunAutonomousCycle,
  readRuntimeCounter,
  recordAutonomousCycle,
  writeRuntimeCounter,
} from "./lib/autonomous-runtime-caps.mjs";
import { readOperationalRelease } from "./lib/operational-release-read.mjs";
import { isLiveApiTickAllowed } from "./lib/billing-policy.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const memoryDir = join(root, ".shikishima-memory");

const forceRun = process.argv.includes("--force");
const liveApiRequested = process.argv.includes("--live-api");
const liveApi = liveApiRequested && isLiveApiTickAllowed();
if (liveApiRequested && !liveApi) {
  console.error("[AgentTeam] --live-api blocked (set SHIKISHIMA_ALLOW_PAID_API=1 only with human approval)");
}
if (!liveApi) {
  console.log("[AgentTeam] mode=local-only (no Groq/Claude billing — forceLocal dispatch)");
}

const MAINTENANCE_PROMPTS = {
  shikishima: "自律運用ヘルスチェック: 1行で現在の管制状態を述べよ。",
  shizume: "自律運用ヘルスチェック: 安全ゲートはHOLDか。1行のみ。",
  tsumugi: "自律運用ヘルスチェック: 実装Worker待機中であることを1行で。",
  hajime: "自律運用ヘルスチェック: 次の安全な一手を1行で。",
  shirube: "自律運用ヘルスチェック: 証跡・調査は read-only。1行で。",
};

function readEnvLocal() {
  const path = join(root, ".env.local");
  if (!existsSync(path)) return {};
  const env = { ...process.env };
  for (const line of readFileSync(path, "utf-8").split("\n")) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return env;
}

function callGroq(_prompt) {
  return Promise.resolve({
    ok: false,
    text: "Hermes/Groq 経路は封印中です（全自動承認経路の暴走停止）。Claude へフォールバックします。",
  });
}

function callClaude(prompt) {
  return new Promise((resolve) => {
    execFile(
      "wsl",
      ["-d", "Ubuntu", "-u", "root", "--", "bash", "-lc", `claude -p ${JSON.stringify(prompt)} --model claude-sonnet-4-6 --output-format text 2>&1`],
      { timeout: 120_000, maxBuffer: 2 * 1024 * 1024 },
      (err, stdout) => {
        if (err) resolve({ ok: false, text: err.message });
        else resolve({ ok: true, text: String(stdout ?? "").replace(/\x1B\[[0-9;]*[mGKHF]/g, "").trim() });
      },
    );
  });
}

const release = readOperationalRelease(root);
const counter = readRuntimeCounter(memoryDir);
const nowMs = Date.now();
const gate = canRunAutonomousCycle(counter, nowMs);

if (!release.activated) {
  console.log(JSON.stringify({ allowed: false, reasons: ["track_d_not_active"], agents: [] }, null, 2));
  process.exit(2);
}

if (!gate.allowed && !forceRun) {
  console.log(JSON.stringify({ allowed: false, reasons: gate.reasons, agents: [] }, null, 2));
  process.exit(2);
}
if (!gate.allowed && forceRun) {
  console.log("[AgentTeam] --force: bypass min_interval cap for ordered run");
}

const env = readEnvLocal();
const agents = [];

for (const agentId of AGENT_TEAM_IDS) {
  const prompt = MAINTENANCE_PROMPTS[agentId] ?? "ヘルスチェック1行";
  const started = Date.now();
  const result = await dispatchAgentReply(agentId, `@${agentId} ${prompt}`, {
    callGroq,
    callClaude,
    forceLocal: !liveApi,
    env,
  });
  agents.push({
    agentId,
    success: result.ok,
    backend: result.trace?.backendUsed ?? "unknown",
    model: result.trace?.model ?? "unknown",
    replyPreviewLen: String(result.text ?? "").length,
    durationMs: Date.now() - started,
  });
}

recordAutonomousCycle(counter, nowMs);
writeRuntimeCounter(memoryDir, counter);

const ok = agents.every((a) => a.success);
console.log(
  JSON.stringify(
    {
      allowed: true,
      liveApi,
      agentCount: agents.length,
      agents,
    },
    null,
    2,
  ),
);

process.exit(ok ? 0 : 2);
