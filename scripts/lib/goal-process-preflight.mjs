/**
 * Goal L4 process ops — read-only SideBot PID assessment.
 * Destructive cleanup (taskkill, preflight --clean) requires explicit L4 human approval.
 */

import { execFileSync } from "node:child_process";
import { join } from "node:path";

/** Mirrors scripts/shikishima-process-preflight.mjs report.ok */
export function sidebotPreflightOk(report) {
  return (
    !report?.duplicateBots &&
    Number(report?.botCount ?? 0) <= 1 &&
    !(report?.pidFiles?.bot?.alive && Number(report?.botCount ?? 0) === 0)
  );
}

/**
 * @param {object} report — JSON from shikishima-process-preflight.mjs --json
 */
export function assessSidebotProcessReport(report) {
  const ok = sidebotPreflightOk(report);
  const duplicateBots = Boolean(report?.duplicateBots);
  const botCount = Number(report?.botCount ?? 0);
  const stalePidGhost =
    Boolean(report?.pidFiles?.bot?.alive) && botCount === 0;
  const needsDestructiveOps = !ok && (duplicateBots || botCount > 1 || stalePidGhost);

  let summary;
  if (ok) {
    summary = `SideBot preflight OK (botCount=${botCount}, duplicateBots=false).`;
  } else if (duplicateBots || botCount > 1) {
    summary = `duplicate SideBot detected (botCount=${botCount}).`;
  } else if (stalePidGhost) {
    summary = "PID file alive but no scanned bot — stale lock.";
  } else {
    summary = "SideBot preflight needs attention.";
  }

  return { ok, duplicateBots, botCount, stalePidGhost, needsDestructiveOps, summary };
}

/** L4 steps that may involve stop / restart / preflight --clean */
export function isGoalProcessOpStep(step) {
  const level = Number(step?.autonomyLevel ?? 0);
  if (level < 4) return false;
  const text = String(step?.description ?? "");
  return /PID|pid|二重|preflight|停止|再起動|process-preflight|SideBot/i.test(text);
}

/** Explicit L4 approval for destructive process operations */
export function parseGoalL4ProcessApproval(detail) {
  const t = String(detail ?? "").trim();
  if (!t) return false;
  return (
    /L4/i.test(t) &&
    /(?:承認|許可|approved|authorize)/i.test(t) &&
    /(?:停止|再起動|taskkill|preflight|process|PID|SideBot|clean)/i.test(t)
  );
}

export function buildGoalL4ProcessHoldMessage(step) {
  const planner = String(step?.agent ?? "shizume");
  return (
    `L${step.autonomyLevel} process confirmation required - Step ${step.step}: ${step.description}\n\n` +
    `What: read-only SideBot PID check first; stop/restart/preflight --clean only if still broken.\n` +
    `Agent (plan): ${planner} · Execution: tsumugi\n` +
    `Risk: L4 may stop processes or restart SideBot — destructive ops need separate explicit approval.\n` +
    `Rollback: restart SideBot via approved preflight workflow; git unchanged for process-only ops.\n\n` +
    "`/goal go` or L3 file approval alone is not enough for stop/restart.\n" +
    "To approve destructive ops, send e.g.:\n" +
    "`/goal go L4 stop restart preflight clean approved`\n" +
    "Cancel: `/goal cancel`"
  );
}

/**
 * Read-only: node scripts/shikishima-process-preflight.mjs --json
 * @param {string} repoRoot
 */
export function runReadOnlySidebotPreflight(repoRoot) {
  const script = join(repoRoot, "scripts", "shikishima-process-preflight.mjs");
  const raw = execFileSync(process.execPath, [script, "--json"], {
    cwd: repoRoot,
    encoding: "utf8",
    maxBuffer: 4 * 1024 * 1024
  });
  return JSON.parse(raw.trim());
}
