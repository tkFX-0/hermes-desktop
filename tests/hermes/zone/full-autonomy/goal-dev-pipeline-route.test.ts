import { describe, expect, it } from "vitest";
import {
  buildGoalDevPipelineInstruction,
  classifyGoalStepResult,
  formatGoalStepResultForDiscord,
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
    expect(parseGoalGoApproval("go 完走してください")?.explicit).toBe(false);
    expect(parseGoalGoApproval("go L3のファイル変更・設定変更に着手してよい")?.explicit).toBe(true);
    expect(parseGoalGoApproval("go コード変更を承認")?.explicit).toBe(true);
    expect(parseGoalGoApproval("status")).toBeNull();
  });

  it("does not complete a step when the agent reports HOLD or drift", () => {
    expect(classifyGoalStepResult("この範囲では問題を検出していません").okToComplete).toBe(true);
    expect(classifyGoalStepResult("DRIFT_FOUND: 短い返答を1回だけの条件を満たしていない").okToComplete).toBe(false);
    expect(classifyGoalStepResult("/goal go単独では承認とみなさないためHOLD継続").okToComplete).toBe(false);
  });

  it("hides tool/sandbox chatter from user-facing step summaries", () => {
    const text = [
      "シェルが使えないため、読み取りは node_repl に切り替えます。",
      "GitHub コネクタで確認します。",
      "Step 3 完了: L3承認条件は未確定のためHOLD継続が安全です。"
    ].join("\n");
    const formatted = formatGoalStepResultForDiscord(text, 200);
    expect(formatted).not.toContain("node_repl");
    expect(formatted).not.toContain("GitHub");
    expect(formatted).toContain("Step 3 完了");
  });
});
