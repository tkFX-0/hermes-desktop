/**
 * Agent team tick schedule — gated by operational-release local file.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

import { resolveOperationalRelease } from "./operational-release-state";

const STATE_REL = join(".shikishima-memory", "agent-team-tick-state.json");

export interface AgentTeamTickScheduleState {
  lastRunAtIso: string | null;
  lastExitCode: number | null;
  lastAgentCount: number;
}

function statePath(projectRoot: string): string {
  return join(projectRoot, STATE_REL);
}

export function readAgentTeamTickState(projectRoot = process.cwd()): AgentTeamTickScheduleState {
  const path = statePath(projectRoot);
  if (!existsSync(path)) {
    return { lastRunAtIso: null, lastExitCode: null, lastAgentCount: 0 };
  }
  try {
    return JSON.parse(readFileSync(path, "utf8")) as AgentTeamTickScheduleState;
  } catch {
    return { lastRunAtIso: null, lastExitCode: null, lastAgentCount: 0 };
  }
}

export function writeAgentTeamTickState(
  projectRoot: string,
  state: AgentTeamTickScheduleState
): void {
  const path = statePath(projectRoot);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(state, null, 2), "utf8");
}

export interface AgentTeamScheduleDecision {
  shouldRun: boolean;
  reasons: readonly string[];
  intervalMinutes: number;
  minutesSinceLastRun: number | null;
}

export function evaluateAgentTeamTickSchedule(
  projectRoot = process.cwd(),
  nowMs = Date.now()
): AgentTeamScheduleDecision {
  const release = resolveOperationalRelease(projectRoot);
  const reasons: string[] = [];

  if (!release.activated) reasons.push("track_d_not_active");
  if (!release.agentTeamTickEnabled) reasons.push("agent_team_tick_disabled");

  const intervalMinutes = release.agentTeamTickIntervalMinutes;
  const state = readAgentTeamTickState(projectRoot);
  let minutesSinceLastRun: number | null = null;

  if (state.lastRunAtIso) {
    const lastMs = Date.parse(state.lastRunAtIso);
    if (!Number.isNaN(lastMs)) {
      minutesSinceLastRun = (nowMs - lastMs) / 60_000;
      if (minutesSinceLastRun < intervalMinutes) {
        reasons.push("interval_not_elapsed");
      }
    }
  }

  const shouldRun = reasons.length === 0;
  return { shouldRun, reasons, intervalMinutes, minutesSinceLastRun };
}
