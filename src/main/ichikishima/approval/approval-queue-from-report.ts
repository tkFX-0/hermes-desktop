import type { ApprovalRiskLevel } from "../autonomy-zone/types";

import type { ApprovalReport } from "./approval-report";
import type { ApprovalQueueStatus } from "./approval-queue";
import {
  createApprovalQueueItem,
  type CreateApprovalQueueItemResult,
} from "./approval-queue";

/** Report risk only covers low〜high; escalate reject to critical と hold で low を引き上げる。 */
function riskFromReport(report: ApprovalReport): ApprovalRiskLevel {
  if (report.decision === "reject_recommended") return "critical";
  if (report.decision === "hold" && report.riskLevel === "low") {
    return "high";
  }
  return report.riskLevel;
}

function queueStatusFromReport(report: ApprovalReport): ApprovalQueueStatus {
  if (report.decision === "reject_recommended") return "rejected";
  if (report.decision === "hold") return "held";
  return "pending";
}

function shortenReason(report: ApprovalReport): string {
  const head = [...report.reasons].slice(0, 5).join(" ");
  return `${report.summary} | highlights: ${head}`.slice(0, 480).trim();
}

/**
 * Builds a queue snapshot from Approval Report semantics (Markdown body is NOT stored).
 * `approve_recommended` は pending のままでも `requiresUserApproval` は維持される。
 */
export function createApprovalQueueItemFromReport(
  report: ApprovalReport,
): CreateApprovalQueueItemResult {
  return createApprovalQueueItem({
    source: "approval_report",
    actor: "ichikishima",
    actionType: "approval_report_followup",
    status: queueStatusFromReport(report),
    riskLevel: riskFromReport(report),
    title: report.title,
    reason: shortenReason(report),
    expectedResult: "User confirms next steps aligned with gated safety policy",
    rollbackPlan:
      report.rollbackPlan.length > 0
        ? report.rollbackPlan
        : "Revert according to rollout plan captured outside this queue item",
    testPlan:
      report.skippedTests.length > 0
        ? `Re-run deferred tests (${report.skippedTests.slice(0, 3).join(", ")}) before execution`
        : "Run targeted regression tests before approving execution goals",
    relatedReportId: report.reportId,
    metadata: {
      decision: report.decision,
      recommended_user_action: report.recommendedUserAction,
    },
  });
}
