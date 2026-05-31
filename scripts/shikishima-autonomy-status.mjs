#!/usr/bin/env node
/**
 * 完全自律進捗 + 停止要因（外部送信なし）
 *
 *   node scripts/shikishima-autonomy-status.mjs
 *   node scripts/shikishima-autonomy-status.mjs --json
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildAutonomyProgressReport,
  formatAutonomyProgressDiscord
} from "./lib/autonomy-progress.mjs";
import { healWorkflowEvalBacklog } from "./lib/autonomous-workflow-engine.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvLocal() {
  const e = { ...process.env };
  const p = join(root, ".env.local");
  if (!existsSync(p)) return e;
  for (const line of readFileSync(p, "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#") || !t.includes("=")) continue;
    const i = t.indexOf("=");
    e[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return e;
}
const asJson = process.argv.includes("--json");
const heal = process.argv.includes("--heal-eval");

if (heal) {
  const n = healWorkflowEvalBacklog(root);
  console.log(`[autonomy-status] heal eval → human: ${n} item(s)`);
}

const report = buildAutonomyProgressReport(root, loadEnvLocal());
if (asJson) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(formatAutonomyProgressDiscord(report));
}
