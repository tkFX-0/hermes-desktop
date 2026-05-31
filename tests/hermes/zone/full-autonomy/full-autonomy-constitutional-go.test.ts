import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  resolveConstitutionalGo,
  hasConstitutionalGoScope
} from "../../../../src/main/shikishima-full-autonomy/constitutional-go-state";
import { executeObsidianWrite } from "../../../../src/main/shikishima-full-autonomy/obsidian-write-executor";
import { planHermesSubprocessBridge } from "../../../../src/main/shikishima-full-autonomy/hermes-subprocess-bridge";
import { resolveShadowSttOptIn } from "../../../../src/main/shikishima-full-autonomy/shadow-stt-opt-in";
import { evaluateAcceptanceMatrix } from "../../../../src/main/shikishima-full-autonomy/acceptance-matrix";
import { planDiscordReadIntake } from "../../../../src/main/shikishima-full-autonomy/discord-read-intake-plan";

describe("Constitutional 全てGO", () => {
  const prevVitest = process.env.VITEST;
  const prevGo = process.env.SHIKISHIMA_TEST_CONSTITUTIONAL_GO;
  const prevAll = process.env.SHIKISHIMA_CONSTITUTIONAL_ALL_GO;

  beforeEach(() => {
    process.env.SHIKISHIMA_TEST_CONSTITUTIONAL_GO = "1";
    process.env.SHIKISHIMA_CONSTITUTIONAL_ALL_GO = "1";
  });

  afterEach(() => {
    process.env.VITEST = prevVitest;
    if (prevGo === undefined) delete process.env.SHIKISHIMA_TEST_CONSTITUTIONAL_GO;
    else process.env.SHIKISHIMA_TEST_CONSTITUTIONAL_GO = prevGo;
    if (prevAll === undefined) delete process.env.SHIKISHIMA_CONSTITUTIONAL_ALL_GO;
    else process.env.SHIKISHIMA_CONSTITUTIONAL_ALL_GO = prevAll;
  });

  it("resolves active constitutional GO with scopes", () => {
    const state = resolveConstitutionalGo();
    expect(state.active).toBe(true);
    expect(hasConstitutionalGoScope("obsidian_write")).toBe(true);
  });

  it("obsidian executor performs write when writeFn provided", () => {
    const result = executeObsidianWrite(
      { filename: "2026-05-28_test.md", content: "# test" },
      () => ({
        success: true,
        dryRun: false,
        redactedPath: "30_Evidence/2026-05-28_test.md"
      })
    );
    expect(result.success).toBe(true);
    expect(result.dryRun).toBe(false);
  });

  it("discord read plan wouldRead under GO", () => {
    const plan = planDiscordReadIntake({
      channelConfigured: true,
      humanGoApproved: true,
      oneShotDeclared: true,
      messageLimit: 10
    });
    expect(plan.wouldRead).toBe(true);
  });

  it("hermes bridge plan allows draft under GO", () => {
    const plan = planHermesSubprocessBridge();
    expect(plan.wouldSpawn).toBe(true);
  });

  it("shadow STT opts in under GO", () => {
    expect(resolveShadowSttOptIn().optedIn).toBe(true);
  });

  it("FA-12 PASS when Phase E production GO acknowledged", () => {
    const matrix = evaluateAcceptanceMatrix({
      voicePass: true,
      stackchanDeferred: false,
      phases2to7TestsPass: true,
      phase8Implemented: true,
      burnInPass: true,
      safetyGovernorIntegrated: true,
      pilotLevel8HumanDeclaration: true,
      phaseEProductionGoAcknowledged: true
    });
    const fa12 = matrix.criteria.find((c) => c.id === "FA-12");
    expect(fa12?.status).toBe("PASS");
    expect(matrix.level8Ready).toBe(true);
  });
});
