#!/usr/bin/env node
/**
 * Human GO 後の自律前進（外部送信なし）
 *
 *   node scripts/shikishima-human-go-advance.mjs
 *   node scripts/shikishima-human-go-advance.mjs --workflow-done
 *   node scripts/shikishima-human-go-advance.mjs --workflow-done wf-mpsjl3fk --restart-bot
 */

import { spawnSync } from "node:child_process";
import { appendFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  completeWorkflowHuman,
  continueWorkflowDevLoop,
  formatWorkflowQueueStatus,
  runWorkflowBurst,
  healWorkflowEvalBacklog,
  enqueueWorkflow
} from "./lib/autonomous-workflow-engine.mjs";
import { resolveExecutionScopePolicy } from "./lib/execution-scope-policy.mjs";
import {
  buildAutonomyProgressReport,
  formatAutonomyProgressDiscord
} from "./lib/autonomy-progress.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const doWorkflowDone = args.includes("--workflow-done");
const continueDev = args.includes("--continue-dev");
const restartBot = args.includes("--restart-bot");
const newEnqueue = args.includes("--enqueue");
const wfIdIdx = args.indexOf("--workflow-done");
const wfId =
  wfIdIdx >= 0 && args[wfIdIdx + 1] && !args[wfIdIdx + 1].startsWith("-")
    ? args[wfIdIdx + 1]
    : undefined;

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

function appendHumanGoEvent(note) {
  const dir = join(root, ".shikishima-memory", "audit");
  mkdirSync(dir, { recursive: true });
  const line = JSON.stringify({
    at: new Date().toISOString(),
    kind: "human_go_advance",
    note: note.slice(0, 500),
    workflowId: wfId ?? null
  });
  appendFileSync(join(dir, "human-go-events.jsonl"), `${line}\n`, "utf8");
}

const env = loadEnvLocal();
const policy = resolveExecutionScopePolicy((k) => env[k], root);

console.log("[HumanGO] decision=HOLD / execution=disabled（不変）");
console.log(`[HumanGO] autonomous_dev=${policy.autonomousDev} orchestratorRelaxed=${policy.orchestratorRelaxed}`);

appendHumanGoEvent("Human GO advance autonomy (CLI)");

const healed = healWorkflowEvalBacklog(root);
if (healed) console.log(`[HumanGO] heal eval→human: ${healed}`);

if (doWorkflowDone) {
  const n = completeWorkflowHuman(root, wfId);
  console.log(`[HumanGO] workflow done: ${n} item(s)${wfId ? ` id=${wfId}` : ""}`);
  console.log(formatWorkflowQueueStatus(root));
}

if (continueDev) {
  const c = continueWorkflowDevLoop(root, wfId);
  console.log(
    `[HumanGO] continue dev (B): ${c.n} id=${c.id ?? "—"} cycle=${c.cycle ?? "—"} ${c.reason ?? ""}`
  );
  if (!c.n && newEnqueue) {
    const id = enqueueWorkflow(
      root,
      "@しきしま EA研究をしてください スタート証拠金は2万円です"
    );
    console.log(`[HumanGO] new enqueue: ${id}`);
  }
  console.log(formatWorkflowQueueStatus(root));
}

if (!policy.autonomousDev) {
  console.error("[HumanGO] autonomous_dev HOLD — record scope GO first");
  process.exit(1);
}

if (doWorkflowDone || continueDev) {
  const burst = await runWorkflowBurst(root, env, 12);
  console.log(`[HumanGO] workflow burst processed=${burst.totalProcessed}`);
  if (burst.totalProcessed === 0 && burst.ticks?.length) {
    console.log(
      `[HumanGO] burst reasons: ${burst.ticks.map((t) => t.reason ?? t.processed).join(" · ")}`
    );
  }
}

console.log("\n[HumanGO] orchestrator tick…");
const orch = spawnSync(
  process.execPath,
  [join(root, "scripts", "shikishima-autonomous-orchestrator.mjs"), "--quiet"],
  { cwd: root, encoding: "utf-8", env }
);
console.log(orch.stdout?.trim() || `(exit ${orch.status})`);

if (restartBot) {
  console.log("\n[HumanGO] SideBot restart…");
  const pf = spawnSync(
    process.execPath,
    ["scripts/shikishima-process-preflight.mjs", "--clean", "--restart-dev"],
    { cwd: root, stdio: "inherit", env }
  );
  if (pf.status !== 0) console.warn("[HumanGO] preflight exit", pf.status);
}

const report = buildAutonomyProgressReport(root, env);
console.log("\n" + formatAutonomyProgressDiscord(report));
process.exit(0);
