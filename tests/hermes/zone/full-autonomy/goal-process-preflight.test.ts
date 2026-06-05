import { describe, expect, it } from "vitest";
import {
  assessSidebotProcessReport,
  buildGoalL4ProcessHoldMessage,
  isGoalProcessOpStep,
  parseGoalL4ProcessApproval,
  sidebotPreflightOk
} from "../../../../scripts/lib/goal-process-preflight.mjs";
import { L3_HOLD_PROMPT } from "../../../../scripts/lib/goal-engine.mjs";

describe("goal process preflight (L4 PID)", () => {
  it("sidebotPreflightOk matches SHI-004 duplicate guard", () => {
    expect(
      sidebotPreflightOk({
        duplicateBots: false,
        botCount: 1,
        pidFiles: { bot: { alive: true } }
      })
    ).toBe(true);
    expect(
      sidebotPreflightOk({
        duplicateBots: true,
        botCount: 2,
        pidFiles: { bot: { alive: true } }
      })
    ).toBe(false);
  });

  it("assessSidebotProcessReport flags destructive ops only when not ok", () => {
    const ok = assessSidebotProcessReport({
      duplicateBots: false,
      botCount: 1,
      pidFiles: { bot: { alive: true } }
    });
    expect(ok.ok).toBe(true);
    expect(ok.needsDestructiveOps).toBe(false);

    const dup = assessSidebotProcessReport({
      duplicateBots: true,
      botCount: 2,
      pidFiles: { bot: { alive: true } }
    });
    expect(dup.needsDestructiveOps).toBe(true);
  });

  it("detects L4 PID / process operation steps", () => {
    expect(
      isGoalProcessOpStep({
        autonomyLevel: 4,
        description: "2 PID 解消に停止・再起動・外部実行が必要な場合のみ、明示承認後に実施する"
      })
    ).toBe(true);
    expect(
      isGoalProcessOpStep({
        autonomyLevel: 3,
        description: "2 PID 解消"
      })
    ).toBe(false);
  });

  it("requires explicit L4 wording for destructive process approval", () => {
    expect(parseGoalL4ProcessApproval("L3 file/config changes approved")).toBe(false);
    expect(parseGoalL4ProcessApproval("L4 stop restart preflight clean approved")).toBe(true);
    expect(parseGoalL4ProcessApproval("L4 PID process restart 承認")).toBe(true);
  });

  it("L3_HOLD_PROMPT uses L4 process message for L4 PID steps", () => {
    const prompt = L3_HOLD_PROMPT({
      step: 7,
      description: "2 PID 解消に停止・再起動",
      agent: "shizume",
      autonomyLevel: 4
    });
    expect(prompt).toContain("L4 process confirmation");
    expect(prompt).toContain("preflight --clean");
    expect(buildGoalL4ProcessHoldMessage({
      step: 7,
      description: "2 PID",
      agent: "shizume",
      autonomyLevel: 4
    })).toContain("Execution: tsumugi");
  });
});
