import { describe, expect, it } from "vitest";
import {
  formatPercentBar,
  workflowStagePercent,
  describeWorkflowStall,
  buildAutonomyProgressReport
} from "../../../../scripts/lib/autonomy-progress.mjs";

describe("autonomy progress", () => {
  it("formats percent bar", () => {
    expect(formatPercentBar(50)).toMatch(/50%/);
    expect(formatPercentBar(50)).toContain("█");
  });

  it("workflow stage percent increases toward done", () => {
    expect(workflowStagePercent("instruction")).toBeLessThan(workflowStagePercent("eval"));
    expect(workflowStagePercent("done")).toBe(100);
  });

  it("detects eval stall hints", () => {
    const stall = describeWorkflowStall({
      stage: "eval",
      evalNeedsHuman: true,
      cycle: 6,
      updatedAt: new Date(Date.now() - 30 * 60_000).toISOString()
    });
    expect(stall).toMatch(/evalNeedsHuman/);
    expect(stall).toMatch(/idle/);
  });

  it("builds overall progress report", () => {
    const r = buildAutonomyProgressReport();
    expect(r.overallPct).toBeGreaterThanOrEqual(0);
    expect(r.overallPct).toBeLessThanOrEqual(100);
    expect(r.wavePct).toBeDefined();
    expect(r.devPipeline).toBeDefined();
    expect(typeof r.devPipeline.chainLength).toBe("number");
  });

  it("surfaces dev-pipeline blockers when pipeline disabled", () => {
    const r = buildAutonomyProgressReport(undefined, { SHIKISHIMA_DEV_PIPELINE_ENABLED: "0" });
    const joined = r.stopReasons.join(" ");
    if (!r.devPipeline.enabled) {
      expect(joined).toMatch(/dev_pipeline_disabled/);
    }
  });
});
