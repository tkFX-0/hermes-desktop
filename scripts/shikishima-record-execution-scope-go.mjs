#!/usr/bin/env node
/**
 * ユーザー承認の実行スコープ GO を .shikishima-memory に記録
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  formatExecutionScopeStatus,
  recordUserExecutionScopeGo,
  resolveExecutionScopePolicy
} from "./lib/execution-scope-policy.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const doc = recordUserExecutionScopeGo(root, {
  note: "User chat 2026-05-30: MT5 backtest + autonomous dev; production/live/git push remain HOLD"
});
const policy = resolveExecutionScopePolicy((k) => process.env[k], root);
console.log(JSON.stringify({ ok: true, recordedAt: doc.recordedAt }, null, 2));
console.log("\n" + formatExecutionScopeStatus(policy));
