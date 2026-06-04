import { describe, expect, it } from "vitest";
import {
  buildGoalDevPipelineInstruction,
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
});
