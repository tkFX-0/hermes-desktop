/**
 * Track D operational release — plain Node reader (SideBot / orchestrator).
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { resolveExecutionScopePolicy } from "./execution-scope-policy.mjs";

function orchestratorRelaxedForRelease(projectRoot) {
  if (/^(1|true|yes|on)$/i.test(String(process.env.SHIKISHIMA_ORCHESTRATOR_RELAXED ?? ""))) {
    return true;
  }
  return resolveExecutionScopePolicy(undefined, projectRoot).autonomousDev;
}

const LOCAL_REL = ".shikishima-memory/operational-release.local.json";

function defaultRelease() {
  return {
    activated: false,
    trackDActive: false,
    orchestratorRelaxed: false,
    executionEnabled: false,
    productionReady: false,
    sidebotHoldReleased: false,
    hermesDaemonPilotEnabled: false,
    agentTeamTickEnabled: false,
    agentTeamTickIntervalMinutes: 360,
    autonomousOrchestratorEnabled: false,
    autonomousOrchestratorIntervalMinutes: 30,
    source: "default",
  };
}

/**
 * @param {string} projectRoot
 */
export function readOperationalRelease(projectRoot) {
  if (process.env.VITEST === "true") {
    return defaultRelease();
  }

  const path = join(projectRoot, LOCAL_REL);
  if (!existsSync(path)) return defaultRelease();

  try {
    const local = JSON.parse(readFileSync(path, "utf-8"));
    const trackDActive =
      local.trackDGoAcknowledged === true &&
      local.executionEnabled === true &&
      local.productionReady === true;
    const relaxed = orchestratorRelaxedForRelease(projectRoot);

    const intervalTeam =
      typeof local.agentTeamTickIntervalMinutes === "number" &&
      local.agentTeamTickIntervalMinutes >= 15
        ? local.agentTeamTickIntervalMinutes
        : 360;

    const intervalOrch =
      typeof local.autonomousOrchestratorIntervalMinutes === "number" &&
      local.autonomousOrchestratorIntervalMinutes >= 5
        ? local.autonomousOrchestratorIntervalMinutes
        : 30;

    return {
      activated: trackDActive || relaxed,
      trackDActive,
      orchestratorRelaxed: relaxed,
      executionEnabled: trackDActive,
      productionReady: trackDActive,
      sidebotHoldReleased: local.sidebotHoldReleased === true,
      hermesDaemonPilotEnabled: local.hermesDaemonPilotEnabled === true,
      agentTeamTickEnabled:
        (trackDActive && local.agentTeamTickEnabled === true) || relaxed,
      agentTeamTickIntervalMinutes: relaxed ? Math.min(intervalTeam, 30) : intervalTeam,
      autonomousOrchestratorEnabled:
        (trackDActive && local.autonomousOrchestratorEnabled === true) || relaxed,
      autonomousOrchestratorIntervalMinutes: relaxed ? Math.min(intervalOrch, 15) : intervalOrch,
      source: "local_file",
      humanGoNote: local.humanGoNote ?? null,
    };
  } catch {
    return defaultRelease();
  }
}
