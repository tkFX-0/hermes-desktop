#!/usr/bin/env node
/**
 * 自律開発ワークフロー 1 tick（キュー 1〜3 ステップ）
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { runAutonomousWorkflowTick } from "./lib/autonomous-workflow-engine.mjs";
import { resolveExecutionScopePolicy, formatExecutionScopeStatus } from "./lib/execution-scope-policy.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = join(root, ".env.local");

function readEnvLocal() {
  const out = { ...process.env };
  if (!existsSync(envPath)) return out;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#") || !t.includes("=")) continue;
    const i = t.indexOf("=");
    out[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return out;
}

const env = readEnvLocal();
const policy = resolveExecutionScopePolicy((k) => env[k], root);
const result = await runAutonomousWorkflowTick(root, env);

console.log(
  JSON.stringify(
    {
      ok: result.ok,
      allowed: result.allowed,
      processed: result.processed,
      reason: result.reason,
      results: result.results,
      policy: {
        mt5Backtest: policy.mt5Backtest,
        autonomousDev: policy.autonomousDev,
        autoLoop: policy.autonomousDevAutoLoop
      }
    },
    null,
    2
  )
);
