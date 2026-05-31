/**
 * 自律ワークフロー — 再起動耐性・停止時チェックポイント・再開
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync, appendFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import {
  loadWorkflowQueue,
  saveWorkflowQueue,
  enqueueWorkflow,
  runWorkflowBurst,
  formatWorkflowQueueStatus
} from "./autonomous-workflow-engine.mjs";
import { isScopedExecutionAllowed } from "./execution-scope-policy.mjs";

const ROOT = join(homedir(), "Desktop", "プロジェクトファイル", "hermes-desktop");
const STALE_RUNNING_MS = 5 * 60 * 1000;

function handoffPath(projectRoot) {
  return join(projectRoot, ".shikishima-memory", "handoff.json");
}

function auditResume(projectRoot, row) {
  try {
    const dir = join(projectRoot, ".shikishima-memory", "audit");
    mkdirSync(dir, { recursive: true });
    appendFileSync(
      join(dir, "workflow-resume.jsonl"),
      `${JSON.stringify({ at: new Date().toISOString(), ...row })}\n`,
      "utf8"
    );
  } catch {
    /* ignore */
  }
}

/**
 * Bot 終了・!tnt 直前 — 実行中を interrupted として永続化
 * @param {string} [projectRoot]
 */
export function checkpointWorkflows(projectRoot = ROOT) {
  const q = loadWorkflowQueue(projectRoot);
  let marked = 0;
  for (const item of q.items) {
    if (item.stage === "done") continue;
    if (item.running || (item.stage !== "human" && item.stage !== "done")) {
      item.running = false;
      item.interrupted = true;
      item.interruptedAt = new Date().toISOString();
      item.log = item.log ?? [];
      item.log.push({
        at: new Date().toISOString().slice(0, 19),
        line: "checkpoint: interrupted (bot restart)"
      });
      if (item.log.length > 24) item.log = item.log.slice(-24);
      marked++;
    }
  }
  if (marked) saveWorkflowQueue(projectRoot, q);
  auditResume(projectRoot, { kind: "checkpoint", marked });
  return marked;
}

/**
 * @param {string} [projectRoot]
 */
export function healStaleRunningItems(projectRoot = ROOT) {
  const q = loadWorkflowQueue(projectRoot);
  const now = Date.now();
  let healed = 0;
  for (const item of q.items) {
    if (!item.running) continue;
    const t = Date.parse(item.heartbeatAt ?? "");
    if (Number.isNaN(t) || now - t > STALE_RUNNING_MS) {
      item.running = false;
      item.interrupted = true;
      item.interruptedAt = new Date().toISOString();
      healed++;
    }
  }
  if (healed) saveWorkflowQueue(projectRoot, q);
  return healed;
}

/**
 * handoff.json の未完了トピックをワークフローへ（キューが空のときのみ）
 * @param {string} [projectRoot]
 * @param {Record<string, string>} [env]
 */
export function ensureWorkflowFromHandoff(projectRoot = ROOT, env = process.env) {
  const get = (k) => env[k] ?? process.env[k];
  const handoffOff =
    get("SHIKISHIMA_WORKFLOW_HANDOFF_DISABLE") === "1" ||
    get("SHIKISHIMA_WORKFLOW_HANDOFF_DISABLE") === "true";
  if (handoffOff) {
    return { action: "none", reason: "handoff_disabled" };
  }

  const q = loadWorkflowQueue(projectRoot);
  const active = q.items.filter((i) => i.stage !== "done");
  if (active.length) {
    return { action: "existing", ids: active.map((i) => i.id), stages: active.map((i) => i.stage) };
  }

  const hp = handoffPath(projectRoot);
  if (!existsSync(hp)) return { action: "none", reason: "no_handoff" };

  let handoff;
  try {
    handoff = JSON.parse(readFileSync(hp, "utf8"));
  } catch {
    return { action: "none", reason: "handoff_parse_error" };
  }

  const topics = [...(handoff.topics ?? []), ...(handoff.unresolved ?? [])].filter(Boolean);
  const devTopic = topics.find((t) =>
    /ea|mt5|mql5|バックテスト|github|開発|fxbot|botを探/i.test(String(t))
  );
  if (!devTopic) return { action: "none", reason: "no_dev_topic" };

  const id = enqueueWorkflow(projectRoot, String(devTopic));
  auditResume(projectRoot, { kind: "handoff_enqueue", id, topic: String(devTopic).slice(0, 80) });
  return { action: "enqueued", id, topic: String(devTopic).slice(0, 120) };
}

/**
 * @param {string} [projectRoot]
 * @param {Record<string, string>} [env]
 * @param {{ maxSteps?: number }} [opts]
 */
export async function resumeWorkflowOnStartup(projectRoot = ROOT, env = process.env, opts = {}) {
  if (!isScopedExecutionAllowed("autonomous_dev", (k) => env[k] ?? process.env[k], projectRoot)) {
    return { ok: false, allowed: false, reason: "autonomous_dev_scope_hold" };
  }

  const healed = healStaleRunningItems(projectRoot);
  const handoffResult = ensureWorkflowFromHandoff(projectRoot, env);

  const q = loadWorkflowQueue(projectRoot);
  const resumable = q.items.filter((i) => i.stage !== "done");
  for (const item of resumable) {
    item.interrupted = false;
    item.resumeCount = (item.resumeCount ?? 0) + 1;
    item.resumedAt = new Date().toISOString();
  }
  if (resumable.length) saveWorkflowQueue(projectRoot, q);

  const burst = await runWorkflowBurst(projectRoot, env, opts.maxSteps ?? 12);

  const report = {
    ok: true,
    allowed: true,
    projectRoot,
    healed,
    handoff: handoffResult,
    resumableCount: resumable.length,
    burst,
    queue: loadWorkflowQueue(projectRoot)
  };
  auditResume(projectRoot, {
    kind: "startup_resume",
    healed,
    handoff: handoffResult.action,
    resumable: resumable.length,
    processed: burst.totalProcessed
  });
  return report;
}

/**
 * @param {ReturnType<typeof resumeWorkflowOnStartup>} report
 */
export function formatWorkflowResumeReport(report) {
  if (!report.allowed) {
    return "🛡️ **しずめ** — ワークフロー再開は HOLD（execution-scope GO が必要）";
  }
  const lines = [
    "🔄 **ワークフロー再開レポート**",
    `• stale修復: ${report.healed ?? 0}`,
    `• handoff: ${report.handoff?.action ?? "—"}${report.handoff?.id ? ` (\`${report.handoff.id}\`)` : ""}`,
    `• 再開対象: ${report.resumableCount ?? 0} 件`,
    `• 今回処理ステップ: ${report.burst?.totalProcessed ?? 0}`,
    ...(report.burst?.totalProcessed === 0 && report.burst?.ticks?.length
      ? [
          `• 未処理理由: ${report.burst.ticks.map((t) => t.reason ?? "—").filter(Boolean).join(" · ") || "tick_busy"}`
        ]
      : []),
    "",
    formatWorkflowQueueStatus(report.projectRoot ?? ROOT)
      .split("\n")
      .slice(0, 8)
      .join("\n")
  ];
  return lines.join("\n").slice(0, 1900);
}
