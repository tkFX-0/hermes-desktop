#!/usr/bin/env node
/**
 * 人間 GO 後の順次タスク実行（Phase E → discord.read → agent-team local → StackChan resume）
 *
 *   node scripts/shikishima-run-ordered-tasks.mjs
 *   node scripts/shikishima-run-ordered-tasks.mjs --skip-stackchan-resume
 *
 * Task 3 は --live-api なし（追加課金なし・forceLocal）。
 */

import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const skipResume = process.argv.includes("--skip-stackchan-resume");

function run(label, args, extraEnv = {}) {
  console.log(`\n=== ${label} ===`);
  const r = spawnSync(process.execPath, args, {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, ...extraEnv },
  });
  if (r.status !== 0) {
    console.error(`[FAIL] ${label} exit=${r.status}`);
    return false;
  }
  return true;
}

const results = [];

results.push(
  run("Task3 agent-team local (no billing)", [
    "scripts/shikishima-agent-team-tick-local.mjs",
    "--force",
  ], {
    SHIKISHIMA_ALLOW_PAID_API: "0",
    SHIKISHIMA_BILLING_MODE: "subscription_only",
  }),
);
results.push(
  run("Task1a autonomy.maintenance", ["scripts/shikishima-autonomous-runtime-tick.mjs", "autonomy.maintenance"]),
);
results.push(run("Task1b obsidian dry-run", ["scripts/shikishima-obsidian-dry-run-tick.mjs"]));
results.push(
  run("Task2 discord.read", ["scripts/shikishima-autonomous-runtime-tick.mjs", "discord.read"]),
);

if (!skipResume) {
  results.push(
    run("Task4 stackchan resume + restart", ["scripts/shikishima-stackchan-resume.mjs", "--restart-bot"]),
  );
} else {
  console.log("\n=== Task4 skipped (--skip-stackchan-resume) ===");
}

const ok = results.every(Boolean);
console.log(`\n[OrderedTasks] ${ok ? "ALL OK" : "SOME FAILED"} (${results.filter(Boolean).length}/${results.length})`);
process.exit(ok ? 0 : 1);
