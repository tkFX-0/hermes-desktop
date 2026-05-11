import type { SilenceGateResult } from "./state";

export interface EvaluateSilenceGateInput {
  observationSummary?: string;
  riskLevel?: "low" | "medium" | "high" | "critical";
  evidenceStrength?: number;
  interruptionCost?: number;
  recentlySaidSimilar?: boolean;
}

export function evaluateSilenceGate(
  input: EvaluateSilenceGateInput = {},
): SilenceGateResult {
  void input;

  return {
    shouldSpeak: false,
    reasonCode: "SHADOW_MODE_NO_AUTO_SPEAK",
    reason: "Shadow Mode does not auto-speak",
    confidence: 1,
    suggestedTiming: "needs_review",
  };
}
