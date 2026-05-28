import { describe, expect, it } from "vitest";
import { buildUnifiedStateSnapshot } from "../../../../src/main/shikishima-full-autonomy/build-unified-snapshot";
import { evaluateExternalEffect } from "../../../../src/main/shikishima-full-autonomy/evaluate-external-effect";
import { evaluateLocalAutonomousWorkScope } from "../../../../src/main/shikishima-full-autonomy/local-autonomous-work";
import { generateAutonomousProposal } from "../../../../src/main/shikishima-full-autonomy/proposal-engine";
import { evaluateSafetyGovernor } from "../../../../src/main/shikishima-full-autonomy/safety-governor";
import {
  planDiscordToStackChanVoice,
  planSecretarySession
} from "../../../../src/main/shikishima-full-autonomy/secretary-mode";
import { planAllSurfaceOutputs } from "../../../../src/main/shikishima-full-autonomy/unified-output-policy";
import { runDiscordSecretaryVoiceBridge } from "../../../../src/main/shikishima-full-autonomy/discord-secretary-voice-bridge";

describe("Full Autonomy Phases 2-7", () => {
  it("builds unified snapshot with shared HOLD reason", () => {
    const snap = buildUnifiedStateSnapshot({
      humanGate: { humanGoApproved: false, visualConfirmationPassed: false }
    });
    expect(snap.globalDecision).toBe("HOLD");
    expect(snap.holdReason).toContain("human_go_required");
    expect(snap.productionReady).toBe(false);
    expect(snap.executionEnabled).toBe(false);
  });

  it("plans surface-specific output limits", () => {
    const snap = buildUnifiedStateSnapshot({ holdReason: "test_hold" });
    const plans = planAllSurfaceOutputs(snap);
    const stackchan = plans.find((p) => p.surface === "stackchan");
    expect(stackchan?.body.length).toBeLessThanOrEqual(80);
    expect(stackchan?.body).toContain("test_hold");
  });

  it("generates proposal without execution", () => {
    const snap = buildUnifiedStateSnapshot();
    const proposal = generateAutonomousProposal(snap);
    expect(proposal.execution).toBe("disabled");
    expect(proposal.productionReady).toBe(false);
    expect(proposal.nextRallyGoalId).toBe("shikishima.phase1.voice-acceptance");
  });

  it("allows bounded local work paths only", () => {
    expect(
      evaluateLocalAutonomousWorkScope({
        targetPath: "docs/shikishima/FOO.md",
        operation: "write"
      }).allowed
    ).toBe(true);
    expect(
      evaluateLocalAutonomousWorkScope({
        targetPath: "src/main/hermes-danger.ts",
        operation: "write"
      }).allowed
    ).toBe(false);
  });

  it("holds external voice until phase1 audible", () => {
    const result = evaluateExternalEffect({
      routeId: "stackchan.voice",
      humanGoApproved: true,
      oneShotDeclared: true,
      timeWindowActive: true,
      dryRunOnly: true,
      productionReady: false,
      executionEnabled: false,
      voicePilotAudibleAccepted: false
    });
    expect(result.decision).toBe("HOLD");
    expect(result.reasons).toContain("phase1_voice_not_audible_accepted");
  });

  it("blocks safety governor invariant violations", () => {
    const gov = evaluateSafetyGovernor({
      productionReady: true,
      executionEnabled: false,
      rawValuesReported: false,
      retryLoopDetected: false,
      humanVisualAutoPassAttempted: false
    });
    expect(gov.decision).toBe("BLOCKED");
  });

  it("holds discord voice bridge by default", () => {
    const plan = planDiscordToStackChanVoice({
      messageLength: 12,
      redactedPreview: "hello",
      humanGoApproved: true,
      oneShotDeclared: true,
      timeWindowActive: true,
      voicePilotAudibleAccepted: true,
      bridgeEnvEnabled: false,
      productionReady: false,
      executionEnabled: false
    });
    expect(plan.decision).toBe("HOLD");
    expect(plan.reasons).toContain("discord_voice_bridge_disabled");
  });

  it("plans secretary session in HOLD when voice not accepted", () => {
    const snap = buildUnifiedStateSnapshot();
    const session = planSecretarySession(snap, false);
    expect(session.mode).toBe("home_ap_secretary");
    expect(session.discordVoice.decision).toBe("HOLD");
  });

  it("bridge does not send when plan is HOLD", async () => {
    const result = await runDiscordSecretaryVoiceBridge({
      messageLength: 5,
      redactedPreview: "test",
      humanGoApproved: false,
      oneShotDeclared: false,
      timeWindowActive: false,
      voicePilotAudibleAccepted: false,
      bridgeEnvEnabled: false,
      productionReady: false,
      executionEnabled: false,
      actualDeviceSendEnabled: false,
      humanPresent: false,
      manualStopMethodConfirmed: false,
      screenVisible: false,
      timeWindowDeclared: false,
      activeTimeWindow: false
    });
    expect(result.sendResult).toBeNull();
  });
});
