import path from "node:path";

import { describe, expect, it } from "vitest";

import { buildControlCenterApprovalAuditReadonlySummary } from "../../../src/main/ichikishima/control-center/control-center-approval-audit-summary";
import { getControlCenterReadonlyData } from "../../../src/main/ichikishima/control-center/control-center-data-provider";

describe("control-center-approval-audit-summary", () => {
  const projectRoot = path.resolve(__dirname, "../../..");
  const zoneRoot = path.join(projectRoot, "sandbox", "hermes-autonomy-zone");

  it("does not amplify raw approval or audit payloads", async () => {
    const bundle = getControlCenterReadonlyData({
      projectRoot,
      zoneRoot,
      dateUtc: "2099-12-06",
      pilotLoop: null,
    });
    const s = buildControlCenterApprovalAuditReadonlySummary(bundle);
    expect(Object.keys(s).length).toBeGreaterThan(0);
    expect(Array.isArray(s.latestSafeSummaryLines)).toBe(true);
    expect(Array.isArray(s.latestShortStatusHints)).toBe(true);
    expect(
      typeof s.requiresUserApprovalApproxCount === "number" ||
        s.requiresUserApprovalApproxCount === null,
    ).toBe(true);
    const json = JSON.stringify(s);
    expect(json.length).toBeLessThan(30_000);
  });
});
