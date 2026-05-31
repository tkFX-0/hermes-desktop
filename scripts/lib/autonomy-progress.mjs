/**
 * 完全自律までの進捗（Wave / INVENTORY / ワークフロー / GAP）
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
/** ワークフロー段（autonomous-workflow-engine と同期） */
export const WORKFLOW_STAGES = [
  "instruction",
  "dev",
  "research",
  "record",
  "eval",
  "human",
  "done"
];
import { buildHumanGoReadinessReport } from "./human-go-readiness-report.mjs";
import { readOperationalRelease } from "./operational-release-read.mjs";
import { resolveExecutionScopePolicy } from "./execution-scope-policy.mjs";
import { mayStartOrchestratorLoop, evaluateRouteGate } from "./orchestrator-gates.mjs";
import {
  resolveDevPipelineConfig,
  resolveDevBackendChain,
  loadWslPreflight
} from "./dev-pipeline-router.mjs";

const ROOT = join(homedir(), "Desktop", "プロジェクトファイル", "hermes-desktop");

/** @type {{ id: string, weight: number, status: "done"|"open"|"deferred" }[]} */
export const AUTONOMY_WAVES = [
  { id: "W1", weight: 14, status: "done" },
  { id: "W2", weight: 14, status: "done" },
  { id: "W3", weight: 14, status: "done" },
  { id: "W4", weight: 14, status: "done" },
  { id: "W5", weight: 22, status: "done" },
  { id: "W6", weight: 22, status: "deferred" }
];

const INVENTORY_TRACKS = [
  { id: "SC", done: 12, total: 14, note: "StackChan（SC-005 resume · SC-013 mitigated · 実機 2・3 PASS 2026-05-31）" },
  { id: "SHI", done: 12, total: 16, note: "しきしま運用（SHI-001/004/005/006 · 011〜014）" },
  { id: "CHI", done: 5, total: 6, note: "Chisiki調査（C本番はH）" },
  { id: "GAP", done: 4, total: 8, note: "G1–G8（runtime）" }
];

/**
 * @param {number} n 0–100
 * @param {number} [width]
 */
export function formatPercentBar(n, width = 16) {
  const pct = Math.max(0, Math.min(100, Math.round(n)));
  const filled = Math.round((pct / 100) * width);
  return `${"█".repeat(filled)}${"░".repeat(width - filled)} ${pct}%`;
}

/**
 * @param {string} stage
 */
export function workflowStagePercent(stage) {
  const idx = WORKFLOW_STAGES.indexOf(stage);
  if (idx < 0) return 0;
  return Math.round(((idx + 1) / WORKFLOW_STAGES.length) * 100);
}

/**
 * @param {string} projectRoot
 */
function loadWorkflowQueueLite(projectRoot) {
  const p = join(projectRoot, ".shikishima-memory", "autonomous-workflow-queue.json");
  if (!existsSync(p)) return { items: [], updatedAt: null };
  try {
    const data = JSON.parse(readFileSync(p, "utf8"));
    return { items: Array.isArray(data.items) ? data.items : [], updatedAt: data.updatedAt ?? null };
  } catch {
    return { items: [], updatedAt: null };
  }
}

/**
 * @param {object} item
 */
export function describeWorkflowStall(item) {
  if (!item) return null;
  if (item.stage === "done") return null;
  const reasons = [];
  if (item.stage === "eval") {
    if (item.evalNeedsHuman) reasons.push("evalNeedsHuman（次tickでhumanへ）");
    if ((item.cycle ?? 1) >= 5) reasons.push(`cycle=${item.cycle}≥maxCycles`);
    if (item.lastDevOk === false) reasons.push("lastDev失敗");
  }
  if (item.paused) reasons.push("paused");
  if (item.running) reasons.push("runningフラグON");
  const updated = item.updatedAt ? Date.parse(item.updatedAt) : NaN;
  if (!Number.isNaN(updated)) {
    const idleMin = Math.round((Date.now() - updated) / 60_000);
    if (idleMin >= 15) reasons.push(`更新から${idleMin}分 idle（Bot/tick要確認）`);
  }
  return reasons.length ? reasons.join(" · ") : null;
}

/**
 * @param {string} [projectRoot]
 * @param {Record<string, string>} [env]
 */
export function buildAutonomyProgressReport(projectRoot = ROOT, env = process.env) {
  const readiness = buildHumanGoReadinessReport(projectRoot);
  const release = readOperationalRelease(projectRoot);
  const scope = resolveExecutionScopePolicy((k) => env[k] ?? process.env[k], projectRoot);
  const loopGate = mayStartOrchestratorLoop(projectRoot, (k) => env[k] ?? process.env[k]);
  const maintenanceGate = evaluateRouteGate(projectRoot, "autonomy.maintenance", (k) => env[k] ?? process.env[k]);
  const devGate = evaluateRouteGate(projectRoot, "dev.autonomous", (k) => env[k] ?? process.env[k]);

  let waveDone = 0;
  let waveWeight = 0;
  for (const w of AUTONOMY_WAVES) {
    waveWeight += w.weight;
    if (w.status === "done") waveDone += w.weight;
    if (w.status === "open") waveDone += w.weight * 0.35;
    if (w.status === "deferred") waveDone += 0;
  }
  const wavePct = waveWeight ? Math.round((waveDone / waveWeight) * 100) : 0;

  let invDone = 0;
  let invTotal = 0;
  for (const t of INVENTORY_TRACKS) {
    invDone += t.done;
    invTotal += t.total;
  }
  const inventoryPct = invTotal ? Math.round((invDone / invTotal) * 100) : 0;

  const q = loadWorkflowQueueLite(projectRoot);
  const active = q.items.filter((i) => i.stage !== "done");
  let wfPct = 0;
  if (active.length) {
    wfPct = Math.round(
      active.reduce((s, i) => s + workflowStagePercent(i.stage), 0) / active.length
    );
  } else if (q.items.some((i) => i.stage === "done")) {
    wfPct = 100;
  }

  const readinessReady = readiness.items.filter((i) => i.status === "READY").length;
  const readinessPct = readiness.items.length
    ? Math.round((readinessReady / readiness.items.length) * 100)
    : 0;

  const overallPct = Math.round(
    wavePct * 0.35 + inventoryPct * 0.25 + readinessPct * 0.2 + wfPct * 0.2
  );

  const stopReasons = [];
  if (!loopGate.allowed) stopReasons.push(`orchestrator: ${loopGate.reasons.join(",")}`);
  if (!scope.autonomousDev) stopReasons.push("autonomous_dev_scope_hold");
  if (!devGate.allowed) stopReasons.push(...(devGate.reasons ?? []));
  if (!maintenanceGate.allowed) stopReasons.push(...(maintenanceGate.reasons ?? []));
  if (readiness.decisionForAutomation === "HOLD") {
    stopReasons.push(`decision=${readiness.decisionForAutomation} openGaps=${readiness.openGaps}`);
  }
  for (const item of active) {
    const stall = describeWorkflowStall(item);
    if (stall) stopReasons.push(`WF ${item.id}: ${stall}`);
  }

  let botLikelyDown = false;
  const auditOrchestrator = join(projectRoot, ".shikishima-memory", "audit", "orchestrator-tick.jsonl");
  if (existsSync(auditOrchestrator)) {
    try {
      const lines = readFileSync(auditOrchestrator, "utf8").trim().split("\n");
      const last = JSON.parse(lines[lines.length - 1] || "{}");
      const lastMs = Date.parse(last.at ?? "");
      if (!Number.isNaN(lastMs) && Date.now() - lastMs > 45 * 60_000) {
        botLikelyDown = true;
        stopReasons.push("orchestrator_tick>45min（SideBot停止の可能性）");
      }
    } catch {
      /* ignore */
    }
  }

  const devCfg = resolveDevPipelineConfig((k) => env[k] ?? process.env[k]);
  const preflight = loadWslPreflight();
  const devChain = resolveDevBackendChain(devCfg, preflight);
  const devPipeline = {
    enabled: devCfg.enabled,
    chainLength: devChain.length,
    primary: devChain[0]?.id ?? "none",
    via: devChain[0]?.via ?? "—"
  };

  if (!devCfg.enabled) {
    stopReasons.push("dev_pipeline_disabled（SHIKISHIMA_DEV_PIPELINE_ENABLED≠1 · WF/!kaihatu dev即fail）");
  }
  if (preflight?.login?.claude && !preflight.login.claude.loggedIn) {
    stopReasons.push("wsl_claude_login_required（SHI-012 · wsl claude login）");
  }
  if (preflight?.windows?.agent && preflight.windows.agent.present !== true) {
    stopReasons.push("windows_agent_cli_missing（SHI-010 · Cursor agent install）");
  }

  return {
    atIso: new Date().toISOString(),
    overallPct,
    devPipeline,
    wavePct,
    inventoryPct,
    readinessPct,
    workflowPct: wfPct,
    decisionForAutomation: readiness.decisionForAutomation,
    openGaps: readiness.openGaps,
    orchestratorEnabled: release.autonomousOrchestratorEnabled,
    orchestratorRelaxed: scope.orchestratorRelaxed,
    autonomousDev: scope.autonomousDev,
    activeWorkflowCount: active.length,
    stopReasons,
    botLikelyDown,
    waves: AUTONOMY_WAVES,
    inventoryTracks: INVENTORY_TRACKS
  };
}

/**
 * @param {ReturnType<typeof buildAutonomyProgressReport>} report
 */
export function formatAutonomyProgressDiscord(report) {
  const lines = [
    "📊 **しきしま完全自律 — 進捗**",
    `**全体** ${formatPercentBar(report.overallPct)}`,
    "",
    `Wave（W1–W6） ${formatPercentBar(report.wavePct)}`,
    `INVENTORY ${formatPercentBar(report.inventoryPct)}`,
    `Human-GO readiness ${formatPercentBar(report.readinessPct)}`,
    `ワークフロー ${formatPercentBar(report.workflowPct)} · 未完了 ${report.activeWorkflowCount}件`,
    "",
    `automation: **${report.decisionForAutomation}** · gaps: ${report.openGaps}`,
    `orchestrator: ${report.orchestratorEnabled ? "ON" : "OFF"}${report.orchestratorRelaxed ? " (緩和)" : ""}`,
    `autonomous_dev: ${report.autonomousDev ? "ON" : "HOLD"}`,
    `dev-pipeline: ${report.devPipeline?.enabled ? "ON" : "OFF"} · chain ${report.devPipeline?.chainLength ?? 0} (${report.devPipeline?.primary ?? "—"}/${report.devPipeline?.via ?? "—"})`
  ];

  if (report.stopReasons.length) {
    lines.push("", "**停止・滞留の可能性**");
    for (const r of report.stopReasons.slice(0, 6)) {
      lines.push(`• ${r}`);
    }
  } else {
    lines.push("", "停止要因: （検出なし — tick 稼働中とみなす）");
  }

  lines.push("", "`!workflow status` · `!autonomy progress` · `node scripts/shikishima-autonomy-status.mjs`");
  return lines.join("\n").slice(0, 1900);
}
