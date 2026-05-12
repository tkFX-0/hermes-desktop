import { describe, expect, it } from "vitest";

import {
  CONTROL_CENTER_PACKAGED_SMOKE_ITEM_IDS,
  createControlCenterPackagedSmokeChecklist,
  evaluateControlCenterPackagedSmokeEvidence,
  summarizeControlCenterPackagedSmokeGate,
} from "../../../src/main/ichikishima/control-center/control-center-packaged-smoke-checklist";

describe("control-center-packaged-smoke-checklist", () => {
  it("createControlCenterPackagedSmokeChecklist returns stable ids matching CONTROL_CENTER_PACKAGED_SMOKE_ITEM_IDS", () => {
    const rows = createControlCenterPackagedSmokeChecklist();
    expect(rows.length).toBe(CONTROL_CENTER_PACKAGED_SMOKE_ITEM_IDS.length);
    expect(rows.map((r) => r.id)).toEqual([
      ...CONTROL_CENTER_PACKAGED_SMOKE_ITEM_IDS,
    ]);
  });

  it("summarizeControlCenterPackagedSmokeGate has no windows drive or unix root patterns", () => {
    const lines = summarizeControlCenterPackagedSmokeGate();
    expect(lines.some((l) => /^\s*[A-Za-z]:\\/.test(l))).toBe(false);
    expect(lines.some((l) => l.includes("\\Users\\"))).toBe(false);
    expect(lines.length).toBeGreaterThanOrEqual(3);
  });

  it("evaluate with empty/null evidence is pending", () => {
    const a = evaluateControlCenterPackagedSmokeEvidence(undefined);
    const b = evaluateControlCenterPackagedSmokeEvidence({});
    expect(a.decision).toBe("pending");
    expect(b.decision).toBe("pending");
    expect(a.missingItemIds.length).toBe(
      CONTROL_CENTER_PACKAGED_SMOKE_ITEM_IDS.length,
    );
  });

  it("evaluate with one false is rejected", () => {
    const allTrue = Object.fromEntries(
      CONTROL_CENTER_PACKAGED_SMOKE_ITEM_IDS.map((id) => [id, true]),
    ) as Record<
      (typeof CONTROL_CENTER_PACKAGED_SMOKE_ITEM_IDS)[number],
      boolean
    >;
    const ev = { ...allTrue, get_app_snapshot_ok: false };
    const r = evaluateControlCenterPackagedSmokeEvidence(ev);
    expect(r.decision).toBe("rejected");
    expect(r.rejectedItemIds).toContain("get_app_snapshot_ok");
  });

  it("evaluate with one missing is pending", () => {
    const almost = Object.fromEntries(
      CONTROL_CENTER_PACKAGED_SMOKE_ITEM_IDS.slice(0, -1).map((id) => [
        id,
        true,
      ]),
    ) as Record<
      (typeof CONTROL_CENTER_PACKAGED_SMOKE_ITEM_IDS)[number],
      boolean
    >;
    const r = evaluateControlCenterPackagedSmokeEvidence(almost);
    expect(r.decision).toBe("pending");
    expect(r.missingItemIds.length).toBe(1);
  });

  it("evaluate with all true is complete_for_signoff", () => {
    const allTrue = Object.fromEntries(
      CONTROL_CENTER_PACKAGED_SMOKE_ITEM_IDS.map((id) => [id, true]),
    ) as Record<
      (typeof CONTROL_CENTER_PACKAGED_SMOKE_ITEM_IDS)[number],
      boolean
    >;
    const r = evaluateControlCenterPackagedSmokeEvidence(allTrue);
    expect(r.decision).toBe("complete_for_signoff");
    expect(r.missingItemIds).toEqual([]);
    expect(r.rejectedItemIds).toEqual([]);
  });
});
