import {
  buildMobileSnapshot,
  MOBILE_CONSOLE_DEFAULT_SNAPSHOT,
} from "../../shared/mobile-console";
import type { MobileConsoleSnapshot } from "../../shared/mobile-console";
import type { ControlCenterDataProviderParams } from "../ichikishima/control-center/control-center-data-provider";
import { getControlCenterReadonlyData } from "../ichikishima/control-center/control-center-data-provider";

export interface MobileConsoleSnapshotServiceParams {
  readonly controlCenterParams: ControlCenterDataProviderParams;
}

/**
 * Build a fully redacted MobileConsoleSnapshot from live Shikishima state.
 * Falls back to the safe static default on any error.
 *
 * INVARIANTS (enforced by buildMobileSnapshot):
 *   productionReady: false
 *   rawValuesReported: false
 *   execution: "disabled"
 *   level3: "not_approved"
 */
export function buildLiveMobileConsoleSnapshot(
  params: MobileConsoleSnapshotServiceParams,
): MobileConsoleSnapshot {
  try {
    const data = getControlCenterReadonlyData(params.controlCenterParams);

    return buildMobileSnapshot(
      {
        appStatus: "live",
        phase: "iphone_private_console_phase_2b_ipc",
        agentTeam: {
          schedulerEnabled: false,
          // reuse static agent list — avoids exposing raw agent runtime data
          agents: MOBILE_CONSOLE_DEFAULT_SNAPSHOT.agentTeam.agents,
          // counts only — no message content
          blockerCount: data.riskSummary.length,
          warningCount:
            data.readiness.hermesBridgePilot.blockers.length +
            data.readiness.hermesBridgePilot.requiredHumanReviews.length,
        },
        generatedAt: new Date().toISOString(),
      },
      "redacted_snapshot_phase2b_ipc",
    );
  } catch {
    return buildMobileSnapshot(undefined, "static_phase1");
  }
}
