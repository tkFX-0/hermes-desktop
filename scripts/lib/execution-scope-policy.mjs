/**
 * スコープ付き実行 GO（本番 decision=HOLD は維持、領域別に緩和）
 * 記録: .shikishima-memory/execution-scope-go.local.json
 * env: SHIKISHIMA_MT5_BACKTEST_GO=1, SHIKISHIMA_AUTONOMOUS_DEV_GO=1
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const DEFAULT_ROOT = join(homedir(), "Desktop", "プロジェクトファイル", "hermes-desktop");

export const EXECUTION_SCOPE_FILE = "execution-scope-go.local.json";

/** @typedef {"mt5_backtest"|"autonomous_dev"|"live_trading"|"git_push"|"production_execute"} ExecutionScopeId */

function truthy(v) {
  if (v == null || v === "") return false;
  return /^(1|true|yes|on)$/i.test(String(v).trim());
}

/**
 * @param {string} [projectRoot]
 */
export function scopeGoPath(projectRoot = DEFAULT_ROOT) {
  return join(projectRoot, ".shikishima-memory", EXECUTION_SCOPE_FILE);
}

/**
 * @param {string} [projectRoot]
 */
export function loadExecutionScopeGo(projectRoot = DEFAULT_ROOT) {
  const p = scopeGoPath(projectRoot);
  if (!existsSync(p)) return null;
  try {
    return JSON.parse(readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}

/**
 * @param {string} projectRoot
 * @param {object} doc
 */
export function saveExecutionScopeGo(projectRoot, doc) {
  const dir = join(projectRoot, ".shikishima-memory");
  mkdirSync(dir, { recursive: true });
  writeFileSync(scopeGoPath(projectRoot), JSON.stringify(doc, null, 2), "utf8");
}

/**
 * @param {(k: string) => string|undefined} [getEnv]
 * @param {string} [projectRoot]
 */
export function resolveExecutionScopePolicy(getEnv = (k) => process.env[k], projectRoot = DEFAULT_ROOT) {
  const g = (k) => String(getEnv(k) ?? "").trim();
  const file = loadExecutionScopeGo(projectRoot);
  const scopes = file?.scopes ?? {};

  const mt5Backtest =
    truthy(g("SHIKISHIMA_MT5_BACKTEST_GO")) || scopes.mt5Backtest?.enabled === true;
  const autonomousDev =
    truthy(g("SHIKISHIMA_AUTONOMOUS_DEV_GO")) || scopes.autonomousDev?.enabled === true;

  return {
    globalDecision: "HOLD",
    globalProductionExecution: "disabled",
    mt5Backtest,
    autonomousDev,
    autonomousDevAutoLoop: scopes.autonomousDev?.autoLoopAfterEval === true || truthy(g("SHIKISHIMA_AUTONOMOUS_DEV_AUTO_LOOP")),
    liveTrading: false,
    gitPush: false,
    productionExecute: false,
    orchestratorRelaxed:
      scopes.orchestratorRelaxed?.enabled === true || truthy(g("SHIKISHIMA_ORCHESTRATOR_RELAXED")),
    maxWorkflowStepsPerTick: Number(scopes.autonomousDev?.maxStepsPerTick ?? 3) || 3,
    maxWorkflowCycles: Number(scopes.autonomousDev?.maxCycles ?? 5) || 5,
    maxWorkflowDevFails: Number(scopes.autonomousDev?.maxDevFails ?? 2) || 2,
    recordedAt: file?.recordedAt ?? null,
    approvedBy: file?.approvedBy ?? null
  };
}

/**
 * @param {ExecutionScopeId} scopeId
 * @param {(k: string) => string|undefined} [getEnv]
 * @param {string} [projectRoot]
 */
export function isScopedExecutionAllowed(scopeId, getEnv, projectRoot) {
  const p = resolveExecutionScopePolicy(getEnv, projectRoot);
  switch (scopeId) {
    case "mt5_backtest":
      return p.mt5Backtest;
    case "autonomous_dev":
      return p.autonomousDev;
    case "live_trading":
      return p.liveTrading;
    case "git_push":
      return p.gitPush;
    case "production_execute":
      return p.productionExecute;
    default:
      return false;
  }
}

/**
 * @param {string} projectRoot
 * @param {{ note?: string }} [opts]
 */
export function recordUserExecutionScopeGo(projectRoot, opts = {}) {
  const doc = {
    recordedAt: new Date().toISOString(),
    approvedBy: "user",
    note: opts.note ?? "MT5 backtest + autonomous dev; live trading/git push/production remain HOLD",
    globalDecision: "HOLD",
    globalProductionExecution: "disabled",
    scopes: {
      mt5Backtest: {
        enabled: true,
        allowReadExport: true,
        allowTesterTrigger: true,
        liveTrading: false
      },
      autonomousDev: {
        enabled: true,
        autoLoopAfterEval: true,
        maxStepsPerTick: 3,
        maxCycles: 5,
        maxDevFails: 2,
        skipHumanGateOnEvalPass: false
      },
      orchestratorRelaxed: {
        enabled: true,
        note: "Track D / phase-go ack なしで orchestrator + dev.autonomous"
      },
      liveTrading: { enabled: false },
      gitPush: { enabled: false },
      productionExecute: { enabled: false }
    }
  };
  saveExecutionScopeGo(projectRoot, doc);
  return doc;
}

/**
 * @param {ReturnType<typeof resolveExecutionScopePolicy>} policy
 */
export function formatExecutionScopeStatus(policy) {
  return [
    "📋 **実行スコープ**（本番 decision=HOLD 不変）",
    `MT5バックテスト: **${policy.mt5Backtest ? "G" : "H"}**`,
    `自律開発ループ: **${policy.autonomousDev ? "G" : "H"}**` +
      (policy.autonomousDevAutoLoop ? " · eval後自動ループ" : ""),
    `ライブ売買: **H**`,
    `git push: **H**`,
    `本番 execute: **H**`,
    policy.recordedAt ? `記録: ${policy.recordedAt.slice(0, 19)}` : "記録: env のみ"
  ].join("\n");
}
