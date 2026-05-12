import { describe, expect, it } from "vitest";

import { buildControlCenterMemoryReadonlySummary } from "../../../src/main/ichikishima/control-center/control-center-memory-summary";

describe("control-center-memory-summary", () => {
  it("uses empty excerpt by default — no persistence", () => {
    const m = buildControlCenterMemoryReadonlySummary();
    expect(m.candidateApproxCount).toBeGreaterThanOrEqual(0);
    expect(m.safeSummaryLines.length).toBeGreaterThan(0);
    expect(m.excerptSourceHint).toContain("sandbox");
    const js = JSON.stringify(m);
    expect(js).not.toMatch(/\bPRIVATE_KEY\b|\bAPI_KEY\b/);
  });

  it("serialized summary stays bounded for short sanitized label", () => {
    const m = buildControlCenterMemoryReadonlySummary(
      "Hermes READY_FOR_LOCAL_PILOT",
    );
    expect(JSON.stringify(m).length).toBeLessThan(12000);
  });
});
