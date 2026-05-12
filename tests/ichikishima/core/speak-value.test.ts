import { describe, expect, it } from "vitest";
import { evaluateSpeakValue } from "../../../src/main/ichikishima/core/speak-value";

describe("Ichikishima speak value score", () => {
  it("keeps shouldSpeak false even for high scores in Shadow Mode", () => {
    const result = evaluateSpeakValue({
      urgency: 1,
      lossPrevention: 1,
      userWaiting: 1,
      evidenceStrength: 1,
      safetyRisk: 1,
      timeSensitivity: 1,
      projectProgressImpact: 1,
      candidateMessage: "Review this before proceeding",
    });

    expect(result.score).toBeGreaterThan(0.7);
    expect(result.shouldSpeak).toBe(false);
    expect(result.reasonCode).toBe("SHADOW_MODE_NO_AUTO_SPEAK");
    expect(result.speakCandidate?.requiresUserApproval).toBe(true);
  });

  it("does not create a speak candidate for low value input", () => {
    const result = evaluateSpeakValue({
      urgency: 0.1,
      interruptionCost: 1,
      repetitionPenalty: 1,
    });

    expect(result.shouldSpeak).toBe(false);
    expect(result.reasonCode).toBe("LOW_VALUE");
    expect(result.speakCandidate).toBeNull();
  });

  it("clamps invalid numeric inputs safely", () => {
    const result = evaluateSpeakValue({
      urgency: Number.POSITIVE_INFINITY,
      evidenceStrength: Number.NaN,
      interruptionCost: -1,
    });

    expect(result.score).toBe(0);
    expect(result.shouldSpeak).toBe(false);
  });
});
