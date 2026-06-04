import { describe, expect, it } from "vitest";
import {
  buildGoalDevPipelineInstruction,
  formatGoalStepResultForDiscord,
  parseGoalGoApproval,
  resolveGoalStepExecutionAgent,
  shouldRouteGoalStepToDevPipeline
} from "../../../../scripts/lib/goal-dev-pipeline-route.mjs";

describe("goal dev pipeline routing", () => {
  it("routes all L3+ steps to tsumugi dev pipeline regardless of assigned agent", () => {
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
    })).toBe(true);
    expect(shouldRouteGoalStepToDevPipeline({
      agent: "shikishima",
      autonomyLevel: 3
    })).toBe(true);
    expect(shouldRouteGoalStepToDevPipeline({
      agent: "shizume",
      autonomyLevel: 3
    })).toBe(true);
    expect(shouldRouteGoalStepToDevPipeline({
      agent: "tsumugi",
      autonomyLevel: 2
    })).toBe(false);
  });

  it("resolves tsumugi as execution agent for any L3+ step", () => {
    expect(resolveGoalStepExecutionAgent({ agent: "hajime", autonomyLevel: 3 })).toBe("tsumugi");
    expect(resolveGoalStepExecutionAgent({ agent: "shizume", autonomyLevel: 4 })).toBe("tsumugi");
    expect(resolveGoalStepExecutionAgent({ agent: "hajime", autonomyLevel: 2 })).toBe("hajime");
    expect(resolveGoalStepExecutionAgent({ autonomyLevel: 1 })).toBe("shikishima");
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

  it("removes internal tool chatter without treating stop-condition wording as state", () => {
    const text = [
      "\u30ed\u30fc\u30ab\u30eb\u8aad\u53d6\u304c sandbox \u521d\u671f\u5316\u3067\u5931\u6557\u3057\u307e\u3057\u305f\u3002",
      "GitHub \u30b3\u30cd\u30af\u30bf\u3067\u78ba\u8a8d\u3057\u307e\u3059\u3002",
      "Step 1 \u78ba\u5b9a: \u5bfe\u8c61\u7bc4\u56f2\u3068\u505c\u6b62\u6761\u4ef6\u3092\u56fa\u5b9a\u3057\u307e\u3057\u305f\u3002"
    ].join("\n");
    const formatted = formatGoalStepResultForDiscord(text, 200);
    expect(formatted).not.toContain("sandbox");
    expect(formatted).not.toContain("GitHub");
    expect(formatted).toContain("\u505c\u6b62\u6761\u4ef6");
  });
});
