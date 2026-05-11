export type IchikishimaState =
  | "idle"
  | "observing"
  | "recalling"
  | "judging"
  | "silent"
  | "speak_candidate"
  | "approval_review"
  | "blocked";

export type IchikishimaPhase =
  | "Observe"
  | "Recall"
  | "Judge"
  | "Silent"
  | "SpeakCandidate"
  | "ApprovalReview"
  | "Blocked";

export type IchikishimaRecommendation =
  | "approve_recommended"
  | "hold"
  | "reject_recommended"
  | "no_action";

export interface SpeakCandidate {
  message: string;
  reason: string;
  urgency: "low" | "medium" | "high" | "critical";
  requiresUserApproval: boolean;
}

export type SilenceGateReasonCode =
  | "SHADOW_MODE_NO_AUTO_SPEAK"
  | "LOW_VALUE"
  | "INSUFFICIENT_EVIDENCE"
  | "INTERRUPTION_COST_TOO_HIGH"
  | "RECENTLY_SAID"
  | "HIGH_RISK_REVIEW_REQUIRED";

export interface SilenceGateResult {
  shouldSpeak: false;
  reasonCode: SilenceGateReasonCode;
  reason: string;
  confidence: number;
  suggestedTiming: "now" | "later" | "never" | "needs_review";
  speakCandidate?: SpeakCandidate;
}

export interface IchikishimaDecision {
  state: IchikishimaState;
  phase: IchikishimaPhase;
  recommendation: IchikishimaRecommendation;
  reason: string;
  confidence: number;
  silenceGate: SilenceGateResult;
}

export const INITIAL_ICHIKISHIMA_STATE: IchikishimaState = "idle";
