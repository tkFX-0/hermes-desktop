import { describe, expect, expectTypeOf, it } from "vitest";
import {
  INITIAL_ICHIKISHIMA_STATE,
  type IchikishimaDecision,
  type IchikishimaPhase,
  type IchikishimaState,
  type SilenceGateResult,
} from "../../../src/main/ichikishima/core/state";

describe("Ichikishima state model", () => {
  it("starts in idle state", () => {
    expect(INITIAL_ICHIKISHIMA_STATE).toBe("idle");
  });

  it("defines the Shadow Mode state contract", () => {
    expectTypeOf<IchikishimaState>().toEqualTypeOf<
      | "idle"
      | "observing"
      | "recalling"
      | "judging"
      | "silent"
      | "speak_candidate"
      | "approval_review"
      | "blocked"
    >();
    expectTypeOf<IchikishimaPhase>().toEqualTypeOf<
      | "Observe"
      | "Recall"
      | "Judge"
      | "Silent"
      | "SpeakCandidate"
      | "ApprovalReview"
      | "Blocked"
    >();
  });

  it("keeps silence gate and decision shapes explicit", () => {
    const silenceGate: SilenceGateResult = {
      shouldSpeak: false,
      reasonCode: "SHADOW_MODE_NO_AUTO_SPEAK",
      reason: "Shadow Mode does not auto-speak",
      confidence: 1,
      suggestedTiming: "needs_review",
    };

    const decision: IchikishimaDecision = {
      state: "silent",
      phase: "Silent",
      recommendation: "no_action",
      reason: "No user-facing speech in Shadow Mode",
      confidence: 1,
      silenceGate,
    };

    expect(decision.silenceGate.shouldSpeak).toBe(false);
  });
});
