import { describe, expect, it } from "vitest";

import {
  CONTROL_CENTER_PACKAGED_SHORT_LAUNCH_ITEM_IDS,
  createControlCenterPackagedShortLaunchChecklist,
  evaluateControlCenterPackagedShortLaunchEvidence,
  summarizeControlCenterPackagedShortLaunchReadiness,
} from "../../../src/main/ichikishima/control-center/control-center-packaged-short-launch-contract";

describe("control-center-packaged-short-launch-contract", () => {
  it("createControlCenterPackagedShortLaunchChecklist matches CONTROL_CENTER_PACKAGED_SHORT_LAUNCH_ITEM_IDS", () => {
    const rows = createControlCenterPackagedShortLaunchChecklist();
    expect(rows.length).toBe(
      CONTROL_CENTER_PACKAGED_SHORT_LAUNCH_ITEM_IDS.length,
    );
    expect(rows.map((r) => r.id)).toEqual([
      ...CONTROL_CENTER_PACKAGED_SHORT_LAUNCH_ITEM_IDS,
    ]);
  });

  it("summarizeControlCenterPackagedShortLaunchReadiness has no drive letter path patterns", () => {
    const lines = summarizeControlCenterPackagedShortLaunchReadiness();
    expect(lines.some((l) => /^\s*[A-Za-z]:\\/.test(l))).toBe(false);
    expect(lines.some((l) => l.includes("\\Users\\"))).toBe(false);
    expect(lines.length).toBeGreaterThanOrEqual(3);
  });

  it("evaluate with empty/null evidence is pending", () => {
    expect(
      evaluateControlCenterPackagedShortLaunchEvidence(undefined).decision,
    ).toBe("pending");
    expect(evaluateControlCenterPackagedShortLaunchEvidence({}).decision).toBe(
      "pending",
    );
    expect(
      evaluateControlCenterPackagedShortLaunchEvidence(undefined).missingItemIds
        .length,
    ).toBe(CONTROL_CENTER_PACKAGED_SHORT_LAUNCH_ITEM_IDS.length);
  });

  it("evaluate with one false is rejected", () => {
    const allTrue = Object.fromEntries(
      CONTROL_CENTER_PACKAGED_SHORT_LAUNCH_ITEM_IDS.map((id) => [id, true]),
    ) as Record<
      (typeof CONTROL_CENTER_PACKAGED_SHORT_LAUNCH_ITEM_IDS)[number],
      boolean
    >;
    const ev = { ...allTrue, get_app_snapshot_ok: false };
    const r = evaluateControlCenterPackagedShortLaunchEvidence(ev);
    expect(r.decision).toBe("rejected");
    expect(r.rejectedItemIds).toContain("get_app_snapshot_ok");
  });

  it("evaluate with one missing is pending", () => {
    const almost = Object.fromEntries(
      CONTROL_CENTER_PACKAGED_SHORT_LAUNCH_ITEM_IDS.slice(0, -1).map((id) => [
        id,
        true,
      ]),
    ) as Record<
      (typeof CONTROL_CENTER_PACKAGED_SHORT_LAUNCH_ITEM_IDS)[number],
      boolean
    >;
    const r = evaluateControlCenterPackagedShortLaunchEvidence(almost);
    expect(r.decision).toBe("pending");
    expect(r.missingItemIds.length).toBe(1);
  });

  it("evaluate with all true is complete_for_signoff", () => {
    const allTrue = Object.fromEntries(
      CONTROL_CENTER_PACKAGED_SHORT_LAUNCH_ITEM_IDS.map((id) => [id, true]),
    ) as Record<
      (typeof CONTROL_CENTER_PACKAGED_SHORT_LAUNCH_ITEM_IDS)[number],
      boolean
    >;
    const r = evaluateControlCenterPackagedShortLaunchEvidence(allTrue);
    expect(r.decision).toBe("complete_for_signoff");
    expect(r.missingItemIds).toEqual([]);
    expect(r.rejectedItemIds).toEqual([]);
  });
});
