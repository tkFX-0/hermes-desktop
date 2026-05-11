import type { SpeakCandidate } from "./state";

export interface SpeakValueScoreInput {
  urgency?: number;
  lossPrevention?: number;
  deadlineRelevance?: number;
  userWaiting?: number;
  interruptionCost?: number;
  evidenceStrength?: number;
  repetitionPenalty?: number;
  timeSensitivity?: number;
  safetyRisk?: number;
  emotionalSupportNeed?: number;
  marketOrTradeRisk?: number;
  projectProgressImpact?: number;
  candidateMessage?: string;
}

export type SpeakValueReasonCode =
  | "SHADOW_MODE_NO_AUTO_SPEAK"
  | "LOW_VALUE"
  | "NEEDS_REVIEW"
  | "INSUFFICIENT_EVIDENCE";

export interface SpeakValueResult {
  shouldSpeak: false;
  score: number;
  reasonCode: SpeakValueReasonCode;
  reason: string;
  suggestedTiming: "now" | "later" | "never" | "needs_review";
  speakCandidate: SpeakCandidate | null;
}

function clamp01(value: number | undefined): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

export function evaluateSpeakValue(
  input: SpeakValueScoreInput = {},
): SpeakValueResult {
  const positiveScore =
    clamp01(input.urgency) * 0.12 +
    clamp01(input.lossPrevention) * 0.14 +
    clamp01(input.deadlineRelevance) * 0.08 +
    clamp01(input.userWaiting) * 0.1 +
    clamp01(input.evidenceStrength) * 0.12 +
    clamp01(input.timeSensitivity) * 0.1 +
    clamp01(input.safetyRisk) * 0.14 +
    clamp01(input.emotionalSupportNeed) * 0.06 +
    clamp01(input.marketOrTradeRisk) * 0.08 +
    clamp01(input.projectProgressImpact) * 0.06;
  const penalty =
    clamp01(input.interruptionCost) * 0.18 +
    clamp01(input.repetitionPenalty) * 0.12;
  const score = Math.max(0, Math.min(1, positiveScore - penalty));
  const urgency: SpeakCandidate["urgency"] =
    score >= 0.9 ? "critical" : score >= 0.8 ? "high" : "medium";
  const speakCandidate: SpeakCandidate | null =
    score >= 0.7
      ? {
          message: input.candidateMessage ?? "Shadow Mode speak candidate",
          reason:
            "Speak value score is high, but Shadow Mode does not auto-speak",
          urgency,
          requiresUserApproval: true,
        }
      : null;

  return {
    shouldSpeak: false,
    score,
    reasonCode: score >= 0.7 ? "SHADOW_MODE_NO_AUTO_SPEAK" : "LOW_VALUE",
    reason:
      score >= 0.7
        ? "Shadow Mode records a speak candidate without auto-speaking"
        : "Speak value is not high enough to create a candidate",
    suggestedTiming: score >= 0.85 ? "needs_review" : "later",
    speakCandidate,
  };
}
