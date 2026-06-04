import { describe, expect, it } from "vitest";
import {
  buildGoalDevPipelineInstruction,
  parseGoalGoApproval,
  shouldRouteGoalStepToDevPipeline
} from "../../../../scripts/lib/goal-dev-pipeline-route.mjs";

describe("goal dev pipeline routing", () => {
  it("routes only approved-capable tsumugi L3+ steps to dev pipeline", () => {
    expect(shouldRouteGoalStepToDevPipeline({
      agent: "tsumugi",
      autonomyLevel: 3
    })).toBe(true);
    expect(shouldRouteGoalStepToDevPipeline({
      agent: "tsumugi",
      autonomyLevel: 4
    })).toBe(true);
    expect(shouldRouteGoalStepToDevPipeline({
      agent: "hajime",
      autonomyLevel: 3
    })).toBe(false);
    expect(shouldRouteGoalStepToDevPipeline({
      agent: "tsumugi",
      autonomyLevel: 2
    })).toBe(false);
  });

  it("builds a guarded instruction for subscription dev execution", () => {
    const instruction = buildGoalDevPipelineInstruction(
      { description: "daily portfolio post" },
      { step: 2, autonomyLevel: 3, description: "edit scheduler", agent: "tsumugi" }
    );
    expect(instruction).toContain("[Goal] daily portfolio post");
    expect(instruction).toContain("[Step 2 / L3 / tsumugi] edit scheduler");
    expect(instruction).toContain("do not push");
    expect(instruction).toContain("do not merge to main");
    expect(instruction).toContain("--yolo");
  });

  it("requires explicit L3 approval details after /goal go", () => {
    expect(parseGoalGoApproval("go")?.explicit).toBe(false);
    expect(parseGoalGoApproval("go \u5b8c\u8d70\u3057\u3066\u304f\u3060\u3055\u3044")?.explicit).toBe(false);
    expect(parseGoalGoApproval("go L3\u306e\u30d5\u30a1\u30a4\u30eb\u5909\u66f4\u30fb\u8a2d\u5b9a\u5909\u66f4\u306b\u7740\u624b\u3057\u3066\u3088\u3044")?.explicit).toBe(true);
    expect(parseGoalGoApproval("go \u30b3\u30fc\u30c9\u5909\u66f4\u3092\u627f\u8a8d")?.explicit).toBe(true);
    expect(parseGoalGoApproval("go L3 file/config changes approved")?.explicit).toBe(true);
    expect(parseGoalGoApproval("status")).toBeNull();
  });
});
