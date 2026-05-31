#!/usr/bin/env node
/**
 * 完全自律開発ギャップ — 順次 Task 1〜5（読取・診断中心、憲法 execute は開かない）
 *
 *   node scripts/shikishima-run-autonomy-gap-tasks.mjs
 */

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { defaultEnvLocalPath } from "./lib/env-local-patch.mjs";
import { resolveDevPipelineConfig } from "./lib/dev-pipeline-router.mjs";
import { isPaidApiExplicitlyAllowed } from "./lib/billing-policy.mjs";
import { isPortfolioDialogueBridgeEnabled } from "./lib/portfolio-dialogue-bridge.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = defaultEnvLocalPath(root);

function loadEnv() {
  const e = { ...process.env };
  if (!existsSync(envPath)) return e;
  for (const line of readFileSync(envPath, "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#") || !t.includes("=")) continue;
    const i = t.indexOf("=");
    e[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return e;
}

function run(label, args, extraEnv = {}) {
  console.log(`\n=== ${label} ===`);
  const r = spawnSync(process.execPath, args, {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, ...extraEnv },
  });
  const ok = r.status === 0;
  if (!ok) console.error(`[FAIL] ${label} exit=${r.status}`);
  return ok;
}

function task1Constitutional(env) {
  console.log("\n=== Task1 憲法・実行ゲート（報告のみ・H 維持） ===");
  const r = spawnSync(process.execPath, ["scripts/shikishima-human-go-readiness.mjs"], {
    cwd: root,
    encoding: "utf-8",
    env: process.env,
  });
  const pass = r.status === 0;
  console.log(pass ? "[OK] human-go-readiness" : "[FAIL] human-go-readiness");
  console.log("[NOTE] decision=HOLD / execution=disabled は意図的。execute 開放は別 G。");
  return pass;
}

function task2DevPipeline(env) {
  console.log("\n=== Task2 開発パイプライン準備 ===");
  const cfg = resolveDevPipelineConfig((k) => env[k]);
  console.log(`  DEV_PIPELINE_ENABLED: ${cfg.enabled}`);
  console.log(`  subscriptionOnly: ${cfg.subscriptionOnly}`);
  const pre = run("WSL preflight", ["scripts/shikishima-wsl-dev-preflight.mjs"]);
  if (!cfg.enabled) {
    console.log("[HOLD] SHIKISHIMA_DEV_PIPELINE_ENABLED=1 を .env.local に設定");
    return false;
  }
  return pre;
}

function task3Subscription(env) {
  console.log("\n=== Task3 司令部 !kaihatu 課金レーン ===");
  const sub = env.SHIKISHIMA_BILLING_MODE === "subscription_only" || env.SHIKISHIMA_SUBSCRIPTION_ONLY === "1";
  const paid = isPaidApiExplicitlyAllowed((k) => env[k]);
  console.log(`  subscription_only: ${sub}`);
  console.log(`  ALLOW_PAID_API: ${paid}`);
  console.log("  !kaihatu / !kaihatuslot → WSL dev pipeline（Groq 通常チャットとは分離）");
  return sub && !paid;
}

function task4Orchestrator() {
  console.log("\n=== Task4 オーケストレータ（保守 tick） ===");
  const ok = run("orchestrator status", ["scripts/shikishima-orchestrator-status.mjs"]);
  console.log("[NOTE] 24h 無人コーディングは dev-queue 将来拡張。現状は maintenance + !kaihatu 即時。");
  return ok;
}

function task5PortfolioDialogue(env) {
  console.log("\n=== Task5 ポートフォリオ→対話ブリッジ ===");
  const on = isPortfolioDialogueBridgeEnabled((k) => env[k]);
  console.log(`  SHIKISHIMA_PORTFOLIO_DIALOGUE_G: ${on ? "1" : "0"}`);
  if (!on) {
    console.log("[HOLD] 自動転送は G=1 で有効。テストは !multi-room-test または投稿+G");
    return true;
  }
  return true;
}

const env = loadEnv();
const results = [
  task1Constitutional(env),
  task2DevPipeline(env),
  task3Subscription(env),
  task4Orchestrator(),
  task5PortfolioDialogue(env),
];

const ok = results.every(Boolean);
console.log(`\n[AutonomyGapTasks] ${ok ? "ALL OK" : "SOME FAILED"} (${results.filter(Boolean).length}/${results.length})`);
process.exit(ok ? 0 : 1);
