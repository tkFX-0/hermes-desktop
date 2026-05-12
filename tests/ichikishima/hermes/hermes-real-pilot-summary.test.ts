import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import {
  buildHermesRealPilotControlCenterSummary,
  NOT_READY_FOR_REAL_HERMES_PROCESS,
  REAL_HERMES_PROCESS_CONTROLLED_PILOT_CODE_READY,
  READY_FOR_REAL_HERMES_PILOT_MINIMAL_STUB,
} from "../../../src/main/ichikishima/hermes/hermes-real-pilot-summary";
import type { HermesRealPilotMinimalResult } from "../../../src/main/ichikishima/hermes/hermes-real-pilot-minimal";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "../../../");

function baseResult(): HermesRealPilotMinimalResult {
  return {
    status: "completed",
    errors: [],
    summaryLines: ["pilot:completed"],
    counts: {
      approvalsPersisted: 1,
      auditAppendsAttempted: 1,
      auditAppendsOk: 1,
      auditPersistenceLinesEstimate: 2,
      forbiddenOperations: 0,
      blockedSensitiveOperations: 0,
      bridgeApprovalOperations: 0,
      reportsQueued: 1,
    },
    queueLane: "production_fail_closed",
    receiverEnqueueExecuted: true,
    requiresUserApproval: true,
    autoExecutable: false,
    shouldSpeak: false,
    productionMode: "fail_closed",
    partialMode: "disabled",
  };
}

describe("hermes-real-pilot-summary", () => {
  it("summarizes with stub labels without api arrays", () => {
    const cc = buildHermesRealPilotControlCenterSummary({
      projectRoot: REPO_ROOT,
      result: baseResult(),
    });

    expect(cc.pilotLabel).toBe(READY_FOR_REAL_HERMES_PILOT_MINIMAL_STUB);
    expect(cc.realProcessGate).toBe(NOT_READY_FOR_REAL_HERMES_PROCESS);
    const wire = JSON.stringify(cc);
    expect(wire.toLowerCase()).not.toContain("allowedapis");
    expect(wire.toLowerCase()).not.toContain("forbiddenapis");
    expect(wire).not.toContain("PASSWORD");
    expect(cc.auditRecordsCreated).toBe(2);
  });

  it("records controlled pilot gate when ingress completed", () => {
    const cc = buildHermesRealPilotControlCenterSummary({
      projectRoot: REPO_ROOT,
      result: {
        ...baseResult(),
        processAdapterIngress: "exec_completed",
      },
    });

    expect(cc.realProcessGate).toBe(
      REAL_HERMES_PROCESS_CONTROLLED_PILOT_CODE_READY,
    );
    expect(cc.inputKind).toBe("exec_adapter_ingress");
  });
});
