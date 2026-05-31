/**
 * ワークフロー tick のプロセス横断排他（keepalive / orchestrator / resume の二重実行防止）
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync, unlinkSync } from "node:fs";
import { join, dirname } from "node:path";

/** keepalive 3min + dev 長時間を考慮しつつ、死んだ PID は即回収 */
const STALE_MS = 8 * 60 * 1000;

function isPidAlive(pid) {
  if (!pid || !Number.isFinite(pid)) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function lockPath(memoryDir) {
  return join(memoryDir, "locks", "workflow-tick.lock");
}

/**
 * @param {string} memoryDir
 * @param {string} [holder]
 */
export function tryAcquireWorkflowTickLock(memoryDir, holder = "tick") {
  const lp = lockPath(memoryDir);
  mkdirSync(dirname(lp), { recursive: true });

  if (existsSync(lp)) {
    try {
      const parts = readFileSync(lp, "utf8").split("\n");
      const pid = Number(parts[0]);
      const ts = Number(parts[1]);
      const holder = parts[2] ?? "unknown";
      const ageOk = Number.isFinite(ts) && Date.now() - ts < STALE_MS;
      const pidAlive = isPidAlive(pid);
      if (ageOk && pidAlive) {
        return { acquired: false, reason: "workflow_tick_busy", holder, pid };
      }
      unlinkSync(lp);
    } catch {
      try {
        unlinkSync(lp);
      } catch {
        return { acquired: false, reason: "workflow_tick_busy" };
      }
    }
  }

  try {
    writeFileSync(lp, `${process.pid}\n${Date.now()}\n${holder}`, { flag: "wx" });
    return { acquired: true };
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && e.code === "EEXIST") {
      return { acquired: false, reason: "workflow_tick_busy" };
    }
    throw e;
  }
}

/**
 * @param {string} memoryDir
 */
export function releaseWorkflowTickLock(memoryDir) {
  const lp = lockPath(memoryDir);
  try {
    if (existsSync(lp)) unlinkSync(lp);
  } catch {
    /* ignore */
  }
}
