import {
  evaluateReviewMode,
  type ReviewModeStructuredInput,
} from "./review-mode";

export type HermesReportRecommendation =
  | "approve_recommended"
  | "hold"
  | "reject_recommended";

export type HermesReportRiskLevel = "low" | "medium" | "high";

export type HermesReportReviewInput = ReviewModeStructuredInput;

export type HermesReportReviewSource = string | HermesReportReviewInput;

export interface HermesReportReviewResult {
  recommendation: HermesReportRecommendation;
  riskLevel: HermesReportRiskLevel;
  reasons: string[];
  detectedProtectedTerms: string[];
  missingEvidence: string[];
  requiresUserFinalApproval: true;
  autoApproved: false;
}

export function reviewHermesReport(
  input: HermesReportReviewSource,
): HermesReportReviewResult {
  const review = evaluateReviewMode(input);

  return {
    recommendation: review.decision,
    riskLevel: review.riskLevel,
    reasons: review.reasons,
    detectedProtectedTerms: review.detectedRiskTerms,
    missingEvidence: review.missingChecks,
    requiresUserFinalApproval: true,
    autoApproved: false,
  };
}
