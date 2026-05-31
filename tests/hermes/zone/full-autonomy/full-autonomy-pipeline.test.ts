import { describe, expect, it } from "vitest";
import { verifyGlobalInvariants } from "../../../../src/main/shikishima-full-autonomy/autonomy-invariants";
import { assessAutonomyLevel } from "../../../../src/main/shikishima-full-autonomy/autonomy-level";
import { classifyAction } from "../../../../src/main/shikishima-full-autonomy/classify-action";
import { evaluateAcceptanceMatrix } from "../../../../src/main/shikishima-full-autonomy/acceptance-matrix";
import {
  createBurnInMonitor,
  evaluateBurnInMonitor,
  recordBurnInEvent
} from "../../../../src/main/shikishima-full-autonomy/burn-in-monitor";
import { runDesignReviewChecklist } from "../../../../src/main/shikishima-full-autonomy/design-review-checklist";
import { buildGapTracker } from "../../../../src/main/shikishima-full-autonomy/gap-tracker";
import {
  createSchedulerSession,
  enforceCooldown,
  preventRetryLoop,
  recordRouteAttempt
} from "../../../../src/main/shikishima-full-autonomy/scheduler-recovery";
import { runFullAutonomyPipeline } from "../../../../src/main/shikishima-full-autonomy/run-full-autonomy-pipeline";
import { EXTERNAL_EFFECT_REGISTRY } from "../../../../src/main/shikishima-full-autonomy/external-effect-registry";

describe("Full Autonomy Pipeline Phases 8-10", () => {
  it("chapter 1 invariants hold", () => {
    const v = verifyGlobalInvariants({
      productionReady: false,
      executionEnabled: false,
      rawValuesReported: false
    });
    expect(v.ok).toBe(true);
  });

  it("chapter 7 classifies discord send as high risk", () => {
    const c = classifyAction("discord_send");
    expect(c.riskClass).toBe("high");
    expect(c.requiresHumanGo).toBe(true);
  });

  it("phase 8 scheduler enforces cooldown and max attempts", () => {
    const session = createSchedulerSession(2, 1000);
    const t0 = 1000;
    expect(enforceCooldown(session, "discord.send", t0).allowed).toBe(true);
    recordRouteAttempt(session, "discord.send", t0);
    recordRouteAttempt(session, "discord.send", t0 + 100);
    expect(preventRetryLoop(session, "discord.send")).toBe(false);
    expect(enforceCooldown(session, "discord.send", t0 + 200).allowed).toBe(false);
  });

  it("phase 9 burn-in passes clean simulation", () => {
    const m = createBurnInMonitor(0);
    recordBurnInEvent(m, 100, "tick");
    const ev = evaluateBurnInMonitor(m, 200);
    expect(ev.pass).toBe(true);
  });

  it("phase 10 acceptance matrix not level8 while voice HOLD", () => {
    const a = evaluateAcceptanceMatrix({
      voicePass: false,
      stackchanDeferred: true,
      phases2to7TestsPass: true,
      phase8Implemented: true,
      burnInPass: true,
      safetyGovernorIntegrated: true
    });
    expect(a.level8Ready).toBe(false);
    expect(a.holdCount).toBeGreaterThan(0);
  });

  it("external registry includes critical blocked routes", () => {
    const ids = EXTERNAL_EFFECT_REGISTRY.map((e) => e.routeId);
    expect(ids).toContain("firmware.write");
    expect(ids).toContain("stackchan.mic");
  });

  it("full pipeline runs phases 2-10", () => {
    const result = runFullAutonomyPipeline({ stackchanDeferred: true, nowMs: 0 });
    expect(result.cycle2to7.steps).toHaveLength(6);
    expect(result.phases8to10).toHaveLength(3);
    expect(result.execution).toBe("disabled");
    expect(result.level8Ready).toBe(false);
    expect(result.checklistPasses).toBeGreaterThan(5);
  });

  it("pipeline marks FA-05 PASS when voicePass", () => {
    const result = runFullAutonomyPipeline({
      voicePass: true,
      stackchanConnected: true,
      stackchanDeferred: false,
      nowMs: 0
    });
    const fa05 = result.acceptance.criteria.find((c) => c.id === "FA-05");
    expect(fa05?.status).toBe("PASS");
    const g1 = result.gaps.find((g) => g.id === "G1");
    expect(g1?.status).toBe("CLOSED");
    expect(result.execution).toBe("disabled");
    expect(result.productionReady).toBe(false);
  });

  it("gap tracker lists open items when sidebot hold", () => {
    const gaps = buildGapTracker({
      stackchanConnected: false,
      voicePass: false,
      phase8CodeDone: true,
      burnInPass: true,
      sidebotHold: true
    });
    expect(gaps.length).toBe(8);
  });

  it("autonomy level below 8 when stackchan deferred", () => {
    const level = assessAutonomyLevel({
      designPackageDone: true,
      displayAccepted: true,
      motionPass: true,
      voicePass: false,
      phases2to7CodeDone: true,
      phase8SchedulerDone: true,
      burnInPass: true,
      acceptanceAllPass: false,
      stackchanDeferred: true
    });
    expect(level.currentLevel).toBeLessThan(8);
  });

  it("design review checklist runs", () => {
    const items = runDesignReviewChecklist({
      stackchanDeferred: true,
      phases2to10CodePresent: true,
      invariantsVerified: true,
      executionDisabled: true,
      voiceHermesBypassAbsent: true
    });
    expect(items.length).toBeGreaterThan(5);
  });
});
