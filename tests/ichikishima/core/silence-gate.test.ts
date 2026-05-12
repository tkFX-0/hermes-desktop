import { describe, expect, it } from "vitest";
import { evaluateSilenceGate } from "../../../src/main/ichikishima/core/silence-gate";

describe("Ichikishima silence gate", () => {
  it("does not auto-speak in Shadow Mode", () => {
    const result = evaluateSilenceGate({
      observationSummary: "Hermes completed a local pilot step",
      riskLevel: "low",
      evidenceStrength: 0.8,
      interruptionCost: 0.5,
    });

    expect(result.shouldSpeak).toBe(false);
    expect(result.reasonCode).toBe("SHADOW_MODE_NO_AUTO_SPEAK");
    expect(result.suggestedTiming).toBe("needs_review");
  });
});
