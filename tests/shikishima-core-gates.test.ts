import { describe, expect, it } from "vitest";

import {
  applyProfileCorrection,
  checkProfileCompliance,
  classifyRealtimeSource,
  createDebateSessionDraft,
  createDefaultProfilePolicy,
  createFxThesis,
  createProfileCorrectionStore,
  evaluateActionGate,
  validateAutomationContract,
  validateDebateSessionDraft,
  validateFxThesis,
  type AutomationContract,
  type HumanGoTicket,
} from "../src/main/shikishima-core";

describe("action gate kernel", () => {
  it("requires human GO for StackChan speech", () => {
    const result = evaluateActionGate({
      actionId: "SC-AI-01",
      actionKind: "stackchan_say",
      actor: "shikishima",
      source: "renderer",
      riskLevel: "high",
      requestedEffects: ["voice_output"],
      targetSummary: "StackChan fixed text one-shot",
      rawValuePolicy: "redacted_only",
      requiresHumanGo: true,
      allowedRunCount: 1,
      evidencePath: "docs/shikishima/evidence.md",
      rollbackOrDisableMethod: "return gate to HOLD",
    });

    expect(result.decision).toBe("NEEDS_HUMAN");
    expect(result.approvedRunCount).toBe(0);
  });

  it("approves only bounded one-shot when a valid human ticket exists", () => {
    const ticket: HumanGoTicket = {
      ticketId: "go-1",
      approvedByHuman: true,
      gateId: "SC-AI-01",
      exactAction: "speak fixed text once",
      timeWindowJst: "2026-05-24 15:00-15:05",
      allowedRunCount: 1,
      target: "StackChan voice",
      forbiddenActions: ["motion", "camera", "loop"],
      stopConditions: ["second speech"],
      evidenceFile: "docs/shikishima/evidence.md",
      afterActionHoldRequired: true,
    };

    const result = evaluateActionGate({
      actionId: "SC-AI-01",
      actionKind: "stackchan_say",
      actor: "shikishima",
      source: "human",
      riskLevel: "high",
      requestedEffects: ["voice_output"],
      targetSummary: "StackChan fixed text one-shot",
      rawValuePolicy: "redacted_only",
      requiresHumanGo: true,
      allowedRunCount: 1,
      evidencePath: "docs/shikishima/evidence.md",
      rollbackOrDisableMethod: "return gate to HOLD",
      humanGoTicket: ticket,
    });

    expect(result.decision).toBe("APPROVED_ONE_SHOT");
    expect(result.approvedRunCount).toBe(1);
  });

  it("denies productionReady and execution enable as critical unimplemented gates", () => {
    for (const actionKind of ["production_ready", "execution_enable"] as const) {
      const result = evaluateActionGate({
        actionId: actionKind,
        actionKind,
        actor: "system",
        source: "system",
        riskLevel: "critical",
        requestedEffects: ["critical_state_change"],
        targetSummary: actionKind,
        rawValuePolicy: "redacted_only",
        requiresHumanGo: true,
        allowedRunCount: 1,
        evidencePath: "docs/shikishima/evidence.md",
        rollbackOrDisableMethod: "manual rollback",
      });
      expect(result.decision).toBe("DENY");
    }
  });
});

describe("profile correction store", () => {
  it("persists forbidden speech correction into policy", () => {
    const store = createProfileCorrectionStore(createDefaultProfilePolicy());
    const next = applyProfileCorrection(store, {
      phrase: "forbidden-line",
      reason: "human said not to say it",
      scope: "all_paths",
      createdAt: "2026-05-24",
    });

    expect(next.corrections).toHaveLength(1);
    expect(checkProfileCompliance("this has forbidden-line", next.policy).ok).toBe(false);
  });
});

describe("automation and realtime contracts", () => {
  it("keeps continuous automation gated", () => {
    const contract: AutomationContract = {
      automationId: "camera-monitor",
      scheduleLabel: "continuous",
      purpose: "camera monitoring",
      mode: "continuous_hold",
      allowedActions: [],
      forbiddenActions: ["stackchan_camera"],
      maxRunCount: 1,
      maxDurationSeconds: 60,
      gateRequired: true,
      evidencePath: "docs/shikishima/camera.md",
      stopConditions: ["privacy risk"],
      productionReady: false,
      execution: "disabled",
    };

    expect(validateAutomationContract(contract)).toEqual({ ok: true });
    expect(classifyRealtimeSource("camera_monitoring").mode).toBe("HARD_HOLD");
  });

  it("classifies StackChan voice as one-shot external with human GO", () => {
    const policy = classifyRealtimeSource("stackchan_voice");
    expect(policy.mode).toBe("ONE_SHOT_EXTERNAL");
    expect(policy.requiresHumanGo).toBe(true);
    expect(policy.maxRunCount).toBe(1);
  });
});

describe("FX thesis and debate mode", () => {
  it("keeps FX position as thesis-only with trade execution false", () => {
    const thesis = createFxThesis({
      marketContext: "range day",
      directionBias: "wait",
      setupName: "no trade",
      entryZone: "none",
      invalidation: "breakout with volume",
      riskNotes: "stand aside",
      confidenceLabel: "medium",
      evidenceSources: ["manual chart review"],
      whatWouldChangeMyMind: "clean session break",
      positionIntent: "wait",
    });

    expect(thesis.tradeExecution).toBe(false);
    expect(validateFxThesis(thesis)).toEqual({ ok: true });
  });

  it("debate session always requires human final decision", () => {
    const debate = createDebateSessionDraft({
      debateId: "debate-1",
      mode: "design_debate",
      proposal: "wire profile policy",
      agentPositions: [
        {
          agentId: "shizume",
          stance: "hold",
          summary: "gate first",
          riskNotes: ["external speech path"],
        },
      ],
      conflicts: ["speed vs safety"],
      resolvedPoints: ["types first"],
      unresolvedPoints: ["live wiring"],
      riskLevel: "medium",
      recommendedNextAction: "human review then implementation GO",
    });

    expect(debate.humanDecisionRequired).toBe(true);
    expect(validateDebateSessionDraft(debate)).toEqual({ ok: true });
  });
});
