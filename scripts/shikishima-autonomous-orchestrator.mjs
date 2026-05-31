#!/usr/bin/env node
/**
 * Autonomous orchestrator — maintenance tick + optional agent team (plain Node).
 * No Discord REST send. No execution enablement.
 */

import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";

import { readOperationalRelease } from "./lib/operational-release-read.mjs";
import { buildHumanGoReadinessReport } from "./lib/human-go-readiness-report.mjs";
import { isLiveApiTickAllowed } from "./lib/billing-policy.mjs";
import { evaluateAgentTeamGate, isOrchestratorRelaxed } from "./lib/orchestrator-gates.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const quiet = process.argv.includes("--quiet");
const liveApiRequested = process.argv.includes("--live-api");
const liveApi = liveApiRequested && isLiveApiTickAllowed();
if (liveApiRequested && !liveApi) {
  console.error("[Orchestrator] --live-api blocked (SHIKISHIMA_ALLOW_PAID_API=0)");
}

function log(obj) {
  if (!quiet) console.log(JSON.stringify(obj, null, 2));
}

function readAgentTeamState() {
  const path = join(root, ".shikishima-memory", "agent-team-tick-state.json");
  if (!existsSync(path)) return { lastRunAtIso: null };
  try {
    return JSON.parse(readFileSync(path, "utf-8"));
  } catch {
    return { lastRunAtIso: null };
  }
}

function writeAgentTeamState(patch) {
  const path = join(root, ".shikishima-memory", "agent-team-tick-state.json");
  const prev = readAgentTeamState();
  const next = { ...prev, ...patch };
  mkdirSync(join(root, ".shikishima-memory"), { recursive: true });
  writeFileSync(path, JSON.stringify(next, null, 2), "utf-8");
}

const getEnv = (k) => process.env[k];

function shouldRunAgentTeam(release, nowMs) {
  const gate = evaluateAgentTeamGate(root, getEnv, nowMs);
  const state = readAgentTeamState();
  let minutesSinceLastRun = null;
  if (state.lastRunAtIso) {
    const lastMs = Date.parse(state.lastRunAtIso);
    if (!Number.isNaN(lastMs)) minutesSinceLastRun = (nowMs - lastMs) / 60_000;
  }
  return {
    shouldRun: gate.allowed,
    reasons: gate.reasons,
    minutesSinceLastRun,
    intervalMinutes: gate.intervalMinutes ?? release.agentTeamTickIntervalMinutes
  };
}

const release = readOperationalRelease(root);
const readiness = buildHumanGoReadinessReport(root);
const nowMs = Date.now();

const maintenance = spawnSync(
  process.execPath,
  [join(root, "scripts", "shikishima-autonomous-runtime-tick.mjs"), "autonomy.maintenance"],
  { cwd: root, encoding: "utf-8" },
);

let maintenanceJson = null;
try {
  maintenanceJson = JSON.parse(maintenance.stdout?.trim() || "{}");
} catch {
  maintenanceJson = { parseError: true, stdout: maintenance.stdout?.slice(0, 200) };
}

const teamDecision = shouldRunAgentTeam(release, nowMs);
let teamResult = { skipped: true, reasons: teamDecision.reasons };

if (teamDecision.shouldRun) {
  const args = [join(root, "scripts", "shikishima-agent-team-tick-local.mjs")];
  if (liveApi) args.push("--live-api");
  const team = spawnSync(process.execPath, args, { cwd: root, encoding: "utf-8" });
  try {
    teamResult = { skipped: false, ...JSON.parse(team.stdout?.trim() || "{}"), exitCode: team.status };
  } catch {
    teamResult = { skipped: false, parseError: true, exitCode: team.status };
  }
  writeAgentTeamState({
    lastRunAtIso: new Date().toISOString(),
    lastExitCode: team.status ?? 1,
    lastAgentCount: teamResult.agentCount ?? 0,
  });
}

let workflowJson = { skipped: true, reason: "scope_hold" };
const scopeDev = isOrchestratorRelaxed(getEnv, root) || release.autonomousOrchestratorEnabled;
if (scopeDev) {
  const wf = spawnSync(
    process.execPath,
    [join(root, "scripts", "shikishima-autonomous-runtime-tick.mjs"), "dev.autonomous"],
    { cwd: root, encoding: "utf-8" }
  );
  try {
    workflowJson = { skipped: false, ...JSON.parse(wf.stdout?.trim() || "{}"), exitCode: wf.status };
  } catch {
    workflowJson = { skipped: false, parseError: true, exitCode: wf.status };
  }
}

const summary = {
  atIso: new Date().toISOString(),
  operationalActivated: release.activated,
  autonomousOrchestratorEnabled: release.autonomousOrchestratorEnabled,
  decisionForAutomation: readiness.decisionForAutomation,
  openGaps: readiness.openGaps,
  maintenance: maintenanceJson,
  maintenanceExitCode: maintenance.status,
  agentTeam: teamResult,
  workflow: workflowJson,
  execution: workflowJson.skipped ? "disabled" : "scoped_dev",
  productionReady: false
};

try {
  const auditDir = join(root, ".shikishima-memory", "audit");
  mkdirSync(auditDir, { recursive: true });
  const auditLine = JSON.stringify({
    at: summary.atIso,
    maintenanceExitCode: summary.maintenanceExitCode,
    decisionForAutomation: summary.decisionForAutomation,
    openGaps: summary.openGaps,
    agentTeamSkipped: teamResult.skipped === true,
    agentTeamReasons: teamResult.reasons ?? [],
    tickCount: maintenanceJson?.tickCount ?? null,
  });
  writeFileSync(join(auditDir, "orchestrator-tick.jsonl"), `${auditLine}\n`, {
    flag: "a",
    encoding: "utf-8",
  });
} catch {
  /* non-fatal */
}

log(summary);
process.exit(maintenance.status === 0 ? 0 : 2);
