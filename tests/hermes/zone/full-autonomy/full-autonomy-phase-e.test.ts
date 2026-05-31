import { describe, expect, it } from "vitest";
import {
  canRunAutonomousCycle,
  createRuntimeCycleCounter,
  recordAutonomousCycle
} from "../../../../src/main/shikishima-full-autonomy/autonomous-runtime-config";
import { planObsidianWrite } from "../../../../src/main/shikishima-full-autonomy/obsidian-write-plan";
import { resolveSecretarySpeakPhrase } from "../../../../src/main/shikishima-full-autonomy/secretary-voice-phrase-map";
import {
  createCappedSchedulerContext,
  runCappedAutonomousTick
} from "../../../../src/main/shikishima-full-autonomy/capped-autonomous-scheduler";
import { planDiscordReadIntake } from "../../../../src/main/shikishima-full-autonomy/discord-read-intake-plan";
import { runAutonomousMaintenanceCycle } from "../../../../src/main/shikishima-full-autonomy/run-autonomous-cycle";

describe("Phase E — toward production full autonomy", () => {
  it("maps secretary preview to allowlisted phrase", () => {
    expect(resolveSecretarySpeakPhrase("承知しました")).toBe("承知しました。");
    expect(resolveSecretarySpeakPhrase("unknown xyz")).toBeNull();
  });

  it("enforces runtime cycle caps", () => {
    const counter = createRuntimeCycleCounter(0);
    const caps = { maxCyclesPerHour: 2, maxCyclesPerDay: 10, minIntervalMs: 1000 };
    expect(canRunAutonomousCycle(counter, 100, caps).allowed).toBe(true);
    recordAutonomousCycle(counter, 100);
    expect(canRunAutonomousCycle(counter, 500, caps).allowed).toBe(false);
    expect(canRunAutonomousCycle(counter, 1100, caps).allowed).toBe(true);
  });

  it("obsidian write plan stays dry-run ALLOW_DRAFT when gates pass", () => {
    const plan = planObsidianWrite({
      vaultPathRedacted: "vault/example",
      noteTitleRedacted: "daily-note",
      humanGoApproved: true,
      oneShotDeclared: true,
      operationalReleaseActive: true
    });
    expect(plan.dryRunOnly).toBe(true);
    expect(plan.wouldWrite).toBe(true);
  });

  it("autonomous maintenance cycle runs pipeline when allowed", () => {
    const counter = createRuntimeCycleCounter(0);
    const result = runAutonomousMaintenanceCycle(counter, 1);
    expect(result.allowed).toBe(true);
    expect(result.pipeline?.execution).toBeDefined();
  });

  it("capped scheduler runs maintenance under caps", () => {
    const ctx = createCappedSchedulerContext(1);
    const tick = runCappedAutonomousTick(ctx, {
      routeId: "autonomy.maintenance",
      nowMs: 1
    });
    expect(tick.allowed).toBe(true);
    expect(tick.maintenance?.pipeline?.level8Ready).toBeDefined();
  });

  it("discord read plan stays dry-run when gates pass", () => {
    const plan = planDiscordReadIntake({
      channelConfigured: true,
      humanGoApproved: true,
      oneShotDeclared: true,
      messageLimit: 10
    });
    expect(plan.dryRunOnly).toBe(true);
    expect(plan.wouldRead).toBe(true);
    expect(plan.targetSummaryRedacted).toContain("draft_limit");
  });

  it("stackchan voice route in scheduler requires explicit permitted go", () => {
    const ctx = createCappedSchedulerContext(1);
    const denied = runCappedAutonomousTick(ctx, {
      routeId: "stackchan.voice",
      nowMs: 1
    });
    expect(denied.allowed).toBe(false);
    const ctx2 = createCappedSchedulerContext(1);
    const ack = runCappedAutonomousTick(ctx2, {
      routeId: "stackchan.voice",
      nowMs: 1,
      explicitPermittedGo: true
    });
    expect(ack.allowed).toBe(true);
    expect(ack.maintenance).toBeNull();
  });
});
