import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  CONTROL_CENTER_READONLY_IPC_BINDING,
  CONTROL_CENTER_V1_DISABLED_ACTION_IDS,
  getControlCenterReadonlyData,
} from "../../../src/main/ichikishima/control-center/control-center-data-provider";

describe("control-center readonly snapshot contract", () => {
  const projectRoot = path.resolve(__dirname, "../../..");
  const zoneRoot = path.join(projectRoot, "sandbox", "hermes-autonomy-zone");

  it("fills readonly invariants without full pilot setup", () => {
    const bundle = getControlCenterReadonlyData({
      projectRoot,
      zoneRoot,
      dateUtc: "2099-12-03",
      pilotLoop: null,
    });

    expect(bundle.ipcBinding).toEqual(CONTROL_CENTER_READONLY_IPC_BINDING);
    expect(bundle.requiresUserApproval).toBe(true);
    expect(bundle.canExecuteDangerousActions).toBe(false);
    expect(bundle.disabledActions).toEqual([
      ...CONTROL_CENTER_V1_DISABLED_ACTION_IDS,
    ]);
    expect(Array.isArray(bundle.statusCards)).toBe(true);
    expect(
      bundle.latestReports.latestApprovalReportId === null ||
        typeof bundle.latestReports.latestApprovalReportId === "string",
    ).toBe(true);
    expect(Array.isArray(bundle.riskSummary)).toBe(true);
    expect(Array.isArray(bundle.nextGoals)).toBe(true);
    expect("ichikishimaCards" in bundle.readiness).toBe(true);

    expect(
      bundle.readiness.hermesBridgePilot.allowedApis.length,
    ).toBeGreaterThan(0);
    expect(
      bundle.readiness.hermesBridgePilot.forbiddenApis.length,
    ).toBeGreaterThan(0);
  });

  it("serializes snapshot without implying executable RPC bridges", () => {
    const bundle = getControlCenterReadonlyData({
      projectRoot,
      zoneRoot,
      dateUtc: "2099-12-04",
      pilotLoop: null,
    });

    const text = JSON.stringify(bundle);
    expect(text).not.toMatch(/exposeRawFs|exposeShell|executeApprovedAction/i);

    expect(text.includes('"runCommand":')).toBe(false);
    expect(
      bundle.disabledActions.every((id) =>
        (CONTROL_CENTER_V1_DISABLED_ACTION_IDS as readonly string[]).includes(
          id,
        ),
      ),
    ).toBe(true);
    expect(bundle.disabledActions).not.toContain("runHermesRaw");
    expect(bundle.canExecuteDangerousActions).toBe(false);
  });
});
