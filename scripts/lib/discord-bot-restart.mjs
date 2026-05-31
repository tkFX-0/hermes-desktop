/**
 * Discord から SideBot を安全に再起動（preflight --clean --restart-dev）
 */

import { spawn } from "node:child_process";
import { join } from "node:path";
import { resolveProjectRoot } from "./project-root.mjs";

/**
 * 現在のプロセスを終了する前に preflight で新 Bot を起動
 * @param {{ reason?: string }} [opts]
 */
export function scheduleDiscordBotRestart(opts = {}) {
  const root = resolveProjectRoot();
  const script = join(root, "scripts", "shikishima-process-preflight.mjs");
  const child = spawn(
    process.execPath,
    [script, "--clean", "--restart-dev"],
    {
      cwd: root,
      detached: true,
      stdio: "ignore",
      windowsHide: true,
      env: { ...process.env, SHIKISHIMA_RESTART_REASON: opts.reason ?? "discord" }
    }
  );
  child.unref();
  return { scheduled: true, pid: child.pid ?? null };
}

/**
 * @param {number} [delayMs]
 */
export function exitAfterBotRestartScheduled(delayMs = 2000) {
  setTimeout(async () => {
    try {
      const { checkpointWorkflows } = await import("./workflow-resume.mjs");
      const root = resolveProjectRoot();
      const n = checkpointWorkflows(root);
      if (n) console.log(`[Bot] workflow checkpoint: ${n} item(s) marked interrupted`);
    } catch (e) {
      console.warn("[Bot] workflow checkpoint skip:", e?.message ?? e);
    }
    console.log("[Bot] exit for !tnt / scheduled restart");
    process.exit(0);
  }, delayMs);
}
