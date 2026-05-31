import { describe, expect, it } from "vitest";
import { buildHumanGoReadiness } from "../../../../src/main/shikishima-full-autonomy/human-go-readiness";

describe("human GO readiness", () => {
  it("defaults to HOLD automation decision under vitest", () => {
    const report = buildHumanGoReadiness({ devPipelineEnabled: true });
    expect(report.decisionForAutomation).toBe("HOLD");
    expect(report.items.some((i) => i.id === "unbounded_discord" && i.status === "BLOCKED")).toBe(
      true
    );
  });

  it("includes burn-in and obsidian items", () => {
    const report = buildHumanGoReadiness();
    expect(report.items.find((i) => i.id === "burn_in_wall")).toBeDefined();
    expect(report.items.find((i) => i.id === "obsidian_write")).toBeDefined();
  });
});
