import path from "node:path";

import { describe, expect, it } from "vitest";

import type { ApprovalReport } from "../../../src/main/ichikishima/approval";
import {
  approvalQueueCandidateFromBlockedDelete,
  approvalQueueCandidateFromBlockedOperation,
  createApprovalQueueItemFromReport,
  createApprovalReport,
  renderApprovalReportMarkdown,
} from "../../../src/main/ichikishima/approval";
import {
  deleteZoneFile,
  executeCommand,
  requestGitOperation,
  requestNetworkAccess,
} from "../../../src/main/ichikishima/autonomy-zone";
import { evaluateReviewMode } from "../../../src/main/ichikishima/review/review-mode";

describe("Approval queue adapters (report / blockers)", () => {
  const zoneRoot = path.join(process.cwd(), "sandbox", "hermes-autonomy-zone");

  function approveSuggestedReport(): ApprovalReport {
    const review = evaluateReviewMode({
      reportText: "minor documentation tweak",
      docsOnly: true,
      executedTests: ["tests/ichikishima/approval/approval-queue.test.ts"],
      unexecutedTests: ["electron-ui-smoke-check"],
      untouchedImportantAreas: ["MT5/EA"],
      rollbackPlan: "git checkout HEAD -- docs/",
    });
    expect(review.decision).toBe("approve_recommended");
    const report = createApprovalReport({
      source: "review_mode",
      title: "Approve suggested",
      summary: "minor documentation update",
      reviewResult: review,
    });
    return report;
  }

  it("keeps approve_recommended reports on pending snapshots with linkage", () => {
    const report = approveSuggestedReport();
    const queue = createApprovalQueueItemFromReport(report);

    expect(queue.ok).toBe(true);
    if (!queue.ok) return;

    expect(queue.item.requiresUserApproval).toBe(true);
    expect(queue.item.autoExecutable).toBe(false);
    expect(queue.item.status).toBe("pending");
    expect(queue.item.relatedReportId).toBe(report.reportId);
    expect(queue.item.reason).not.toContain("##");
  });

  it("does not embed rendered markdown payloads", () => {
    const report = approveSuggestedReport();
    const markdown = renderApprovalReportMarkdown(report);
    const queue = createApprovalQueueItemFromReport(report);

    expect(queue.ok).toBe(true);
    if (!queue.ok) return;
    expect(markdown.length).toBeGreaterThan(50);
    expect(JSON.stringify(queue.item)).not.toContain("# ");
  });

  it("maps reject workflows to rejected records with escalated severity", () => {
    const report = createApprovalReport({
      source: "review_mode",
      title: "Reject path",
      summary: "risky rollout wording",
      reviewResult: evaluateReviewMode({
        reportText:
          ".env references with MT5 EA hooks plus trade histories and secrets",
      }),
    });
    expect(report.decision).toBe("reject_recommended");

    const queue = createApprovalQueueItemFromReport(report);
    expect(queue.ok).toBe(true);
    if (!queue.ok) return;
    expect(queue.item.status).toBe("rejected");
    expect(queue.item.riskLevel).toBe("critical");
    expect(queue.item.requiresUserApproval).toBe(true);
    expect(queue.item.reason).not.toContain(".env");
  });

  it("raises low reviewer risk to high when reviewer requests a hold", () => {
    const review = evaluateReviewMode({
      reportText: "docs change only pending verification",
      docsOnly: true,
    });

    expect(review.decision).toBe("hold");
    expect(review.riskLevel).toBe("low");

    const report = createApprovalReport({
      source: "review_mode",
      title: "Hold sample",
      summary: "waiting on tests evidence",
      reviewResult: review,
    });

    const queue = createApprovalQueueItemFromReport(report);
    expect(queue.ok).toBe(true);
    if (!queue.ok) return;
    expect(queue.item.status).toBe("held");
    expect(queue.item.riskLevel).toBe("high");
  });

  it("captures blocker candidates without running delete execute network git ops", () => {
    const deleteResult = deleteZoneFile({
      zoneRoot,
      requestedPath: "output/pilot-delete-block.txt",
      actor: "hermes",
    });
    expect(deleteResult.ok).toBe(false);

    const delQueue = approvalQueueCandidateFromBlockedDelete(deleteResult);
    expect(delQueue).not.toBeNull();
    if (!delQueue || !delQueue.ok) return;
    expect(delQueue.item.actionType).toBe("delete");
    expect(delQueue.item.requiresUserApproval).toBe(true);
    expect(delQueue.item.autoExecutable).toBe(false);

    const execBlocked = approvalQueueCandidateFromBlockedOperation(
      executeCommand({
        command: "node",
        actor: "hermes",
      }),
    );
    expect(execBlocked.ok).toBe(true);
    if (!execBlocked.ok) return;
    expect(execBlocked.item.actionType).toBe("execute");

    const netBlocked = approvalQueueCandidateFromBlockedOperation(
      requestNetworkAccess({
        url: "https://example.invalid",
        actor: "hermes",
      }),
    );
    expect(netBlocked.ok).toBe(true);
    if (!netBlocked.ok) return;
    expect(netBlocked.item.externalUrls.length).toBeGreaterThan(0);

    const gitBlocked = approvalQueueCandidateFromBlockedOperation(
      requestGitOperation({
        operation: "status",
        actor: "hermes",
      }),
    );
    expect(gitBlocked.ok).toBe(true);
    if (!gitBlocked.ok) return;
    expect(gitBlocked.item.actionType).toBe("git");
  });

  it("returns null queue candidates when delete blocks omit approval payloads", () => {
    const missing = approvalQueueCandidateFromBlockedDelete({
      ok: false,
      reasonCode: "DENIED_BY_PATH_GUARD",
      reason: "path outside zone",
      deleted: false,
      auditEventCandidate: {
        actor: "hermes",
        action: "delete",
        status: "denied",
        reasonCode: "DENIED_BY_PATH_GUARD",
        reason: "blocked",
        deleted: false,
        contentIncluded: false,
        timestamp: new Date().toISOString(),
      },
    });

    expect(missing).toBeNull();
  });
});
