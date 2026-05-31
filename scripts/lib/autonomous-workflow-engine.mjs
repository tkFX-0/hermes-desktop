/**
 * 指示→開発→研究→記録(BT)→評価→人間→ループ
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { isScopedExecutionAllowed, resolveExecutionScopePolicy } from "./execution-scope-policy.mjs";
import { runKaihatuDev } from "./discord-dev-commands.mjs";
import { runKaihatuAutoReview } from "./kaihatu-auto-review.mjs";
import { runMt5BacktestRecord } from "./mt5-backtest-runner.mjs";
import { recordDevPipelineRunGovernance } from "./governance-changelog.mjs";
import { tryAcquireWorkflowTickLock, releaseWorkflowTickLock } from "./workflow-tick-lock.mjs";
import {
  workflowStagePercent,
  formatPercentBar,
  describeWorkflowStall,
  WORKFLOW_STAGES
} from "./autonomy-progress.mjs";

const ROOT = join(homedir(), "Desktop", "プロジェクトファイル", "hermes-desktop");

export { WORKFLOW_STAGES };

function queuePath(projectRoot) {
  return join(projectRoot, ".shikishima-memory", "autonomous-workflow-queue.json");
}

/**
 * @param {string} projectRoot
 */
export function loadWorkflowQueue(projectRoot = ROOT) {
  const p = queuePath(projectRoot);
  if (!existsSync(p)) return { items: [], updatedAt: null };
  try {
    const data = JSON.parse(readFileSync(p, "utf8"));
    return { items: Array.isArray(data.items) ? data.items : [], updatedAt: data.updatedAt ?? null };
  } catch {
    return { items: [], updatedAt: null };
  }
}

/**
 * @param {string} projectRoot
 * @param {{ items: object[] }} queue
 */
export function saveWorkflowQueue(projectRoot, queue) {
  mkdirSync(join(projectRoot, ".shikishima-memory"), { recursive: true });
  writeFileSync(
    queuePath(projectRoot),
    JSON.stringify({ ...queue, updatedAt: new Date().toISOString() }, null, 2),
    "utf8"
  );
}

/**
 * @param {string} projectRoot
 * @param {string} instruction
 */
export function enqueueWorkflow(projectRoot, instruction) {
  const q = loadWorkflowQueue(projectRoot);
  const id = `wf-${Date.now().toString(36)}`;
  q.items.push({
    id,
    instruction: String(instruction).trim().slice(0, 2000),
    stage: "instruction",
    cycle: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    log: []
  });
  saveWorkflowQueue(projectRoot, q);
  return id;
}

/**
 * @param {object} item
 * @param {string} line
 */
function pushLog(item, line) {
  item.log = item.log ?? [];
  item.log.push({ at: new Date().toISOString().slice(0, 19), line: line.slice(0, 200) });
  if (item.log.length > 24) item.log = item.log.slice(-24);
}

/**
 * @param {string} projectRoot
 * @param {object} item
 * @param {Record<string, string>} env
 */
async function advanceWorkflowItem(projectRoot, item, env) {
  const stage = item.stage;
  pushLog(item, `enter ${stage} cycle=${item.cycle}`);

  if (stage === "instruction") {
    item.stage = "dev";
    pushLog(item, "instruction → dev");
    return { agentId: "shikishima", preview: "開発へ進行" };
  }

  if (stage === "dev") {
    const dev = await runKaihatuDev(item.instruction, env);
    item.lastDevOk = dev.ok;
    if (!dev.ok) {
      item.devFailCount = (item.devFailCount ?? 0) + 1;
    } else {
      item.devFailCount = 0;
    }
    item.stage = "research";
    pushLog(item, `dev ${dev.ok ? "ok" : "fail"} → research (fails=${item.devFailCount})`);
    return { agentId: dev.agentId, preview: dev.text?.slice(0, 120) ?? "dev" };
  }

  if (stage === "research") {
    item.researchNote = `自律研究: ${item.instruction.slice(0, 80)}（要約は governance に記録）`;
    try {
      recordDevPipelineRunGovernance({
        agentId: "shirube",
        backend: "workflow-research",
        model: "local",
        ok: true
      });
    } catch {
      /* ignore */
    }
    item.stage = "record";
    pushLog(item, "research → record");
    return { agentId: "shirube", preview: item.researchNote };
  }

  if (stage === "record") {
    const bt = runMt5BacktestRecord(projectRoot, (k) => env[k] ?? process.env[k]);
    item.backtestOk = bt.ok;
    item.stage = "eval";
    pushLog(item, `record bt=${bt.ok} → eval`);
    return { agentId: "tsumugi", preview: bt.text?.slice(0, 120) ?? "record" };
  }

  if (stage === "eval") {
    const review = runKaihatuAutoReview({
      root: projectRoot,
      instruction: item.instruction,
      kaihatuOk: item.lastDevOk !== false,
      testMode: false,
      operatorUserId: env.DISCORD_OPERATOR_USER_ID ?? ""
    });
    item.evalDecision = review.verdict?.decision ?? "HOLD";
    item.evalNeedsHuman = review.needsHuman;

    const policy = resolveExecutionScopePolicy((k) => env[k] ?? process.env[k], projectRoot);
    const maxCycles = policy.maxWorkflowCycles ?? 5;
    const maxDevFails = policy.maxWorkflowDevFails ?? 2;
    const devFails = item.devFailCount ?? 0;
    const cycle = item.cycle ?? 1;

    if (item.paused) {
      pushLog(item, "eval skipped (paused)");
    } else if (devFails >= maxDevFails) {
      item.stage = "human";
      pushLog(item, `eval → human (dev failed ${devFails}x)`);
    } else if (cycle >= maxCycles) {
      item.stage = "human";
      pushLog(item, `eval → human (max cycles ${maxCycles})`);
    } else if (review.needsHuman || item.evalDecision === "HOLD") {
      item.stage = "human";
      pushLog(item, `eval ${item.evalDecision} → human (needs review)`);
    } else if (policy.autonomousDevAutoLoop && review.verdict?.decision === "GO_PREPARED") {
      item.cycle = cycle + 1;
      item.stage = "dev";
      pushLog(item, `eval GO_PREPARED → loop dev cycle ${item.cycle}`);
    } else {
      item.stage = "human";
      pushLog(item, "eval → human");
    }
    return { agentId: "shizume", preview: review.text?.slice(0, 120) ?? "eval" };
  }

  if (stage === "human") {
    pushLog(item, "human gate — awaiting operator ack");
    return { agentId: "shikishima", preview: "人間確認待ち（!workflow done で完了）" };
  }

  return { agentId: "shikishima", preview: "noop" };
}

/**
 * @param {string} [projectRoot]
 * @param {Record<string, string>} [env]
 */
export async function runAutonomousWorkflowTick(projectRoot = ROOT, env = process.env) {
  if (!isScopedExecutionAllowed("autonomous_dev", (k) => env[k] ?? process.env[k], projectRoot)) {
    return {
      ok: false,
      allowed: false,
      reason: "autonomous_dev_scope_hold",
      processed: 0
    };
  }

  const mem = join(projectRoot, ".shikishima-memory");
  const lock = tryAcquireWorkflowTickLock(mem, "workflow-tick");
  if (!lock.acquired) {
    return { ok: true, allowed: true, processed: 0, reason: lock.reason ?? "workflow_tick_busy" };
  }

  try {
    const policy = resolveExecutionScopePolicy((k) => env[k] ?? process.env[k], projectRoot);
    const q = loadWorkflowQueue(projectRoot);
    const active = q.items.filter((i) => i.stage !== "done" && !i.paused);
    if (!active.length) {
      return { ok: true, allowed: true, processed: 0, reason: "queue_empty" };
    }

    if (active.some((i) => i.running)) {
      return { ok: true, allowed: true, processed: 0, reason: "workflow_item_running" };
    }

    let processed = 0;
    const results = [];
    const maxSteps = Math.min(policy.maxWorkflowStepsPerTick, 3);

    for (const item of active) {
      if (processed >= maxSteps) break;
      if (item.stage === "human") continue;

      const stageBefore = item.stage;
      item.running = true;
      item.heartbeatAt = new Date().toISOString();
      item.interrupted = false;
      let r;
      try {
        r = await advanceWorkflowItem(projectRoot, item, env);
      } catch (e) {
        item.lastError = String(e?.message ?? e).slice(0, 200);
        pushLog(item, `error ${item.lastError}`);
        r = { agentId: "shizume", preview: item.lastError };
      } finally {
        item.running = false;
        item.heartbeatAt = new Date().toISOString();
      }
      item.updatedAt = new Date().toISOString();
      results.push({
        id: item.id,
        stageBefore,
        stageAfter: item.stage,
        cycle: item.cycle,
        ...r
      });
      processed++;
    }

    saveWorkflowQueue(projectRoot, q);
    return { ok: true, allowed: true, processed, results, queueSize: q.items.length };
  } finally {
    releaseWorkflowTickLock(mem);
  }
}

/**
 * @param {string} projectRoot
 */
export function formatWorkflowQueueStatus(projectRoot = ROOT) {
  const q = loadWorkflowQueue(projectRoot);
  const active = q.items.filter((i) => i.stage !== "done");
  let wfPct = 0;
  if (active.length) {
    wfPct = Math.round(
      active.reduce((s, i) => s + workflowStagePercent(i.stage), 0) / active.length
    );
  } else if (q.items.length) {
    wfPct = 100;
  }

  const lines = [
    "🔄 **自律ワークフロー**（指示→開発→研究→記録→評価→人間→完了）",
    `キュー進捗 ${formatPercentBar(wfPct)} · 件数 ${q.items.length}（未完了 ${active.length}）`,
    `更新: ${q.updatedAt?.slice(0, 19) ?? "なし"}`,
    ""
  ];
  for (const item of q.items.slice(-6)) {
    const pct = workflowStagePercent(item.stage);
    const stall = describeWorkflowStall(item);
    lines.push(
      `• \`${item.id}\` **${item.stage}** ${pct}% · c${item.cycle ?? 1} — ${item.instruction.slice(0, 48)}…`
    );
    if (stall) lines.push(`  ↳ ⚠ ${stall}`);
  }
  if (!q.items.length) {
    lines.push("（空）`!workflow enqueue <指示>` で追加");
  }
  lines.push("", "人間確認後: `!workflow done` · 全体: `!autonomy progress`");
  return lines.join("\n").slice(0, 1900);
}

/**
 * @param {string} projectRoot
 * @param {boolean} paused
 * @param {string} [itemId] — 省略時は未完了をすべて
 */
export function setWorkflowPaused(projectRoot = ROOT, paused, itemId) {
  const q = loadWorkflowQueue(projectRoot);
  let n = 0;
  for (const item of q.items) {
    if (item.stage === "done") continue;
    if (itemId && item.id !== itemId) continue;
    item.paused = paused;
    pushLog(item, paused ? "paused by ops" : "resumed by ops");
    n++;
  }
  if (n) saveWorkflowQueue(projectRoot, q);
  return n;
}

/**
 * デプロイ直後: eval + dev 連続失敗の空回しを human に落とす
 * @param {string} [projectRoot]
 */
export function healWorkflowEvalBacklog(projectRoot = ROOT) {
  const q = loadWorkflowQueue(projectRoot);
  const policy = resolveExecutionScopePolicy(undefined, projectRoot);
  const maxCycles = policy.maxWorkflowCycles ?? 5;
  let n = 0;
  for (const item of q.items) {
    if (item.stage !== "eval") continue;
    const fails = item.devFailCount ?? 0;
    const cycle = item.cycle ?? 1;
    const idleMs = item.updatedAt ? Date.now() - Date.parse(item.updatedAt) : 0;
    const staleEval = idleMs > 20 * 60_000;
    if (
      fails >= 2 ||
      cycle >= maxCycles ||
      item.evalNeedsHuman === true ||
      staleEval
    ) {
      item.stage = "human";
      pushLog(
        item,
        `heal eval → human (fails=${fails} cycle=${cycle} needsHuman=${Boolean(item.evalNeedsHuman)} stale=${staleEval})`
      );
      n++;
    }
  }
  if (n) saveWorkflowQueue(projectRoot, q);
  return n;
}

/**
 * 人間確認後にのみ done へ（tick では human をスキップする）
 * @param {string} [projectRoot]
 * @param {string} [itemId]
 */
export function completeWorkflowHuman(projectRoot = ROOT, itemId) {
  const q = loadWorkflowQueue(projectRoot);
  let n = 0;
  for (const item of q.items) {
    if (item.stage !== "human") continue;
    if (itemId && item.id !== itemId) continue;
    item.stage = "done";
    item.humanAckAt = new Date().toISOString();
    pushLog(item, "human ack → done");
    n++;
  }
  if (n) saveWorkflowQueue(projectRoot, q);
  return n;
}

/**
 * オペレーター B: 開発継続 — human/done から次 cycle の dev へ（Human GO 承認後のループ）
 * @param {string} [projectRoot]
 * @param {string} [itemId]
 */
export function continueWorkflowDevLoop(projectRoot = ROOT, itemId) {
  const q = loadWorkflowQueue(projectRoot);
  let target =
    (itemId && q.items.find((i) => i.id === itemId)) ||
    [...q.items].reverse().find((i) => i.stage === "human" || i.stage === "done");
  if (!target) return { n: 0, id: null };

  if (target.stage !== "human" && target.stage !== "done") {
    return { n: 0, id: target.id, reason: "not_at_human_or_done" };
  }

  target.cycle = (target.cycle ?? 1) + 1;
  target.stage = "dev";
  target.paused = false;
  target.running = false;
  target.interrupted = false;
  target.evalNeedsHuman = false;
  target.humanContinueAt = new Date().toISOString();
  pushLog(target, `operator continue (B) → dev cycle ${target.cycle}`);
  saveWorkflowQueue(projectRoot, q);
  return { n: 1, id: target.id, cycle: target.cycle };
}

export function settleActiveWorkflowsToHuman(projectRoot = ROOT) {
  const q = loadWorkflowQueue(projectRoot);
  let n = 0;
  for (const item of q.items) {
    if (item.stage === "done" || item.stage === "human") continue;
    item.stage = "human";
    item.paused = false;
    pushLog(item, "settle → human (backlog fix)");
    n++;
  }
  if (n) saveWorkflowQueue(projectRoot, q);
  return n;
}

/**
 * 再起動後などに複数ステップを連続実行
 * @param {string} [projectRoot]
 * @param {Record<string, string>} [env]
 * @param {number} [maxSteps]
 */
export async function runWorkflowBurst(projectRoot = ROOT, env = process.env, maxSteps = 9) {
  let totalProcessed = 0;
  const ticks = [];
  const cap = Math.max(1, Math.min(maxSteps, 24));
  while (totalProcessed < cap) {
    let tick = await runAutonomousWorkflowTick(projectRoot, env);
    if (tick.reason === "workflow_tick_busy") {
      await new Promise((r) => setTimeout(r, 2500));
      tick = await runAutonomousWorkflowTick(projectRoot, env);
    }
    ticks.push(tick);
    if (!tick.ok || !tick.allowed || !tick.processed) break;
    totalProcessed += tick.processed;
  }
  return { totalProcessed, ticks };
}
