#!/usr/bin/env node
/**
 * 帰宅チェック — Bot / オーケストレータ / ワークフロー状態
 */
import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { loadWorkflowQueue } from "./lib/autonomous-workflow-engine.mjs";
import { healStaleRunningItems } from "./lib/workflow-resume.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function tailLog(n = 25) {
  const p = join(root, "shikishima-bot.log");
  if (!existsSync(p)) return ["(no log)"];
  return readFileSync(p, "utf8").split("\n").slice(-n);
}

function botProcesses() {
  try {
    const ps = `Get-CimInstance Win32_Process -Filter "Name='node.exe'" | Where-Object { $_.CommandLine -match 'shikishima-bot\\.mjs' } | Select-Object ProcessId | ConvertTo-Json -Compress`;
    const raw = execFileSync("powershell", ["-NoProfile", "-Command", ps], { encoding: "utf8" });
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : parsed ? [parsed] : [];
  } catch {
    return [];
  }
}

const healed = healStaleRunningItems(root);
const q = loadWorkflowQueue(root);
const active = q.items.filter((i) => i.stage !== "done");
const bots = botProcesses();

console.log("=== しきしま 帰宅ログチェック ===");
console.log(`時刻: ${new Date().toISOString().slice(0, 19)}`);
console.log(`SideBot: ${bots.length ? `OK PID ${bots.map((b) => b.ProcessId).join(",")}` : "STOPPED"}`);
console.log(`ワークフロー stale修復: ${healed}`);
console.log(`ワークフロー 未完了: ${active.length}`);
for (const item of active.slice(-5)) {
  console.log(
    `  - ${item.id} stage=${item.stage} cycle=${item.cycle} interrupted=${!!item.interrupted} running=${!!item.running}`
  );
  console.log(`    ${item.instruction?.slice(0, 70)}…`);
}
if (existsSync(join(root, ".shikishima-memory", "handoff.json"))) {
  const h = JSON.parse(readFileSync(join(root, ".shikishima-memory", "handoff.json"), "utf8"));
  console.log(`handoff topics: ${(h.topics ?? []).length}`);
}
console.log("\n--- log tail ---");
for (const line of tailLog(20)) console.log(line);
