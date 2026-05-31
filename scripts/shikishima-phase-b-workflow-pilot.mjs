#!/usr/bin/env node
/**
 * Phase B — 境界付き WF 1 サイクル（CLI · 外部送信なし）
 *
 *   node scripts/shikishima-phase-b-workflow-pilot.mjs
 *   node scripts/shikishima-phase-b-workflow-pilot.mjs --instruction "custom"
 */

import { existsSync, readFileSync, appendFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  enqueueWorkflow,
  runWorkflowBurst,
  completeWorkflowHuman,
  loadWorkflowQueue,
  formatWorkflowQueueStatus,
  healWorkflowEvalBacklog
} from "./lib/autonomous-workflow-engine.mjs";
import { resolveExecutionScopePolicy } from "./lib/execution-scope-policy.mjs";
import { appendShirubeDailyLog } from "./lib/obsidian-shirube-write.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const instrIdx = process.argv.indexOf("--instruction");
const instruction =
  instrIdx >= 0 && process.argv[instrIdx + 1]
    ? process.argv[instrIdx + 1]
    : "【Phase B pilot】docs/shikishima/ORDERED_TASKS_2026-05-31.md に WF サイクル検証1行のみ追記。他ファイル変更禁止。";

function loadEnvLocal() {
  const e = { ...process.env };
  const p = join(root, ".env.local");
  if (!existsSync(p)) return e;
  for (const line of readFileSync(p, "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#") || !t.includes("=")) continue;
    const eq = t.indexOf("=");
    e[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
  }
  return e;
}

const env = loadEnvLocal();
const policy = resolveExecutionScopePolicy((k) => env[k], root);

if (!policy.autonomousDev) {
  console.error("[PhaseB] autonomous_dev HOLD — abort");
  process.exit(1);
}

const healed = healWorkflowEvalBacklog(root);
if (healed) console.log(`[PhaseB] heal eval→human: ${healed}`);

const id = enqueueWorkflow(root, instruction);
console.log(`[PhaseB] enqueue: ${id}`);

const burst = await runWorkflowBurst(root, env, 12);
console.log(`[PhaseB] burst processed=${burst.totalProcessed}`);
for (const t of burst.ticks ?? []) {
  if (t.results?.length) {
    for (const r of t.results) {
      console.log(`  ${r.id} ${r.stageBefore}→${r.stageAfter} ${r.preview?.slice(0, 60) ?? ""}`);
    }
  } else {
    console.log(`  tick reason=${t.reason ?? "—"} processed=${t.processed ?? 0}`);
  }
}

const q = loadWorkflowQueue(root);
const item = q.items.find((i) => i.id === id);
if (item?.stage === "human") {
  const n = completeWorkflowHuman(root, id);
  console.log(`[PhaseB] workflow done: ${n}`);
} else {
  console.log(`[PhaseB] not at human (stage=${item?.stage ?? "missing"}) — run !workflow done ${id} manually`);
}

const logPath = join(root, "docs/shikishima/ORDERED_TASKS_2026-05-31.md");
const line = `\n- **Phase B WF pilot** (${new Date().toISOString().slice(0, 19)}): id=\`${id}\` stage=${item?.stage ?? "?"} lastDevOk=${item?.lastDevOk} burst=${burst.totalProcessed}\n`;
try {
  appendFileSync(logPath, line, "utf8");
  console.log(`[PhaseB] appended ORDERED_TASKS`);
} catch (e) {
  console.warn("[PhaseB] ORDERED_TASKS append failed:", e.message);
}

const daily = appendShirubeDailyLog(
  root,
  `Phase B WF pilot: ${id} → ${item?.stage ?? "?"}. burst=${burst.totalProcessed}.`,
  { title: "Phase-B-WF-pilot" }
);
console.log("[PhaseB] daily:", daily.ok ? daily.path : daily.error);

mkdirSync(join(root, ".shikishima-memory", "audit"), { recursive: true });
appendFileSync(
  join(root, ".shikishima-memory", "audit", "phase-b-workflow.jsonl"),
  `${JSON.stringify({ at: new Date().toISOString(), id, stage: item?.stage, burst: burst.totalProcessed })}\n`,
  "utf8"
);

const finalItem = loadWorkflowQueue(root).items.find((i) => i.id === id);
console.log("\n" + formatWorkflowQueueStatus(root));
process.exit(finalItem?.stage === "done" ? 0 : 2);
