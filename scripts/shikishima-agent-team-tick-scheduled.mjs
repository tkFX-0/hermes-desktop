#!/usr/bin/env node
/**
 * Agent team tick — schedule gate + plain Node local tick (default no API billing).
 * Pass --live-api for real Groq/Claude maintenance pings.
 */

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { readOperationalRelease } from "./lib/operational-release-read.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const liveApi = process.argv.includes("--live-api");

function readState() {
  const path = join(root, ".shikishima-memory", "agent-team-tick-state.json");
  if (!existsSync(path)) return { lastRunAtIso: null };
  try {
    return JSON.parse(readFileSync(path, "utf-8"));
  } catch {
    return { lastRunAtIso: null };
  }
}

function writeState(patch) {
  const path = join(root, ".shikishima-memory", "agent-team-tick-state.json");
  const next = { ...readState(), ...patch };
  mkdirSync(join(root, ".shikishima-memory"), { recursive: true });
  writeFileSync(path, JSON.stringify(next, null, 2), "utf-8");
}

const release = readOperationalRelease(root);
const reasons = [];
if (!release.activated) reasons.push("track_d_not_active");
if (!release.agentTeamTickEnabled) reasons.push("agent_team_tick_disabled");

const state = readState();
let minutesSinceLastRun = null;
if (state.lastRunAtIso) {
  const lastMs = Date.parse(state.lastRunAtIso);
  if (!Number.isNaN(lastMs)) {
    minutesSinceLastRun = (Date.now() - lastMs) / 60_000;
    if (minutesSinceLastRun < release.agentTeamTickIntervalMinutes) {
      reasons.push("interval_not_elapsed");
    }
  }
}

if (reasons.length > 0) {
  console.log(
    JSON.stringify(
      {
        skipped: true,
        reasons,
        minutesSinceLastRun,
        intervalMinutes: release.agentTeamTickIntervalMinutes,
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

const args = [join(root, "scripts", "shikishima-agent-team-tick-local.mjs")];
if (liveApi) args.push("--live-api");
const run = spawnSync(process.execPath, args, { cwd: root, encoding: "utf-8" });

let body = {};
try {
  body = JSON.parse(run.stdout?.trim() || "{}");
} catch {
  body = { parseError: true };
}

writeState({
  lastRunAtIso: new Date().toISOString(),
  lastExitCode: run.status ?? 1,
  lastAgentCount: body.agentCount ?? 0,
});

console.log(JSON.stringify({ skipped: false, exitCode: run.status, ...body }, null, 2));
process.exit(run.status === 0 ? 0 : 2);
