import { describe, expect, it } from "vitest";

import {
  SHIKISHIMA_AGENT_IDS,
  addForbiddenPhraseCorrection,
  buildProfileInstruction,
  checkProfileCompliance,
  createDefaultProfilePolicy,
  createResponsePolicy,
  getModelAssignment,
  listModelAssignments,
  validateModelAssignmentRegistry,
} from "../src/main/shikishima-core";

describe("shikishima model assignment registry", () => {
  it("has exactly one safe assignment for every canonical agent", () => {
    expect(validateModelAssignmentRegistry()).toEqual({ ok: true });
    expect(listModelAssignments()).toHaveLength(SHIKISHIMA_AGENT_IDS.length);

    for (const agentId of SHIKISHIMA_AGENT_IDS) {
      const assignment = getModelAssignment(agentId);
      expect(assignment.agentId).toBe(agentId);
      expect(assignment.defaultModel).toBeTruthy();
      expect(assignment.externalWriteAllowed).toBe(false);
      expect(assignment.requiresHumanGoFor.length).toBeGreaterThan(0);
    }
  });

  it("keeps FX as thesis-only and never trade execution", () => {
    const chihaya = getModelAssignment("chihaya");
    expect(chihaya.fxPositionAllowed).toBe("thesis_only");
    expect(chihaya.forbiddenCapabilities).toContain("trade_execution");
  });
});

describe("profile policy", () => {
  it("lets current human corrections override memory/persona defaults", () => {
    const policy = addForbiddenPhraseCorrection(
      createDefaultProfilePolicy(),
      "do-not-say-this",
      "human correction",
    );

    expect(buildProfileInstruction(policy)).toContain("hard safety > current human correction");
    expect(checkProfileCompliance("please do-not-say-this", policy)).toEqual({
      ok: false,
      blockedPhrases: ["do-not-say-this"],
      blockedTopics: [],
    });
  });
});

describe("response policy", () => {
  it("separates full UI response from short StackChan speech", () => {
    const result = createResponsePolicy({
      responseId: "resp-1",
      agentId: "shikishima",
      fullResponse: "This is the long UI response with implementation detail that should stay on screen.",
      requestedSpokenResponse: "短く安全に返します。",
      reasoningLevel: "standard",
      maxSpeechChars: 20,
    });

    expect(result.fullResponse).toContain("long UI response");
    expect(result.spokenResponse).toBe("短く安全に返します。");
    expect(result.requiresHumanGo).toBe(true);
    expect(result.spokenAllowed).toBe(true);
  });

  it("blocks raw error-like text from StackChan speech", () => {
    const result = createResponsePolicy({
      responseId: "resp-2",
      agentId: "tsumugi",
      fullResponse: "Error: stack trace should not be spoken",
      reasoningLevel: "critical",
    });

    expect(result.spokenAllowed).toBe(false);
    expect(result.blockedReason).toBe("raw_error_like_text");
    expect(result.spokenResponse).toBe("いまは応答を安全確認中です。");
  });

  it("redacts local-looking values before producing speech", () => {
    const localLookingAddress = ["10", "20", "30", "40"].join(".");
    const tokenLikeValue = "abcdefghijklmnopqrstuvwxyz" + "123456";
    const result = createResponsePolicy({
      responseId: "resp-3",
      agentId: "shirube",
      fullResponse: `Device is at ${localLookingAddress} and token ${tokenLikeValue}`,
      reasoningLevel: "standard",
    });

    expect(result.fullResponse).toContain("[redacted-address]");
    expect(result.fullResponse).toContain("[redacted-token]");
    expect(result.redactionPassed).toBe(false);
  });
});
