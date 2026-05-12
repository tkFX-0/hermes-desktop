import { describe, expect, it } from "vitest";

import {
  createIchikishimaDecisionPackage,
  processHermesPilotResult,
} from "../../../src/main/ichikishima/orchestrator";
import {
  createHermesBridgeReport,
  createHermesBridgeTask,
} from "../../../src/main/ichikishima/hermes/hermes-bridge";
import type { HermesLocalPilotResult } from "../../../src/main/ichikishima/hermes/hermes-local-pilot";

describe("Ichikishima orchestrator", () => {
  it("consumes Hermes Pilot output without persistence or outbound IO", () => {
    const bridgeTask = createHermesBridgeTask({
      taskId: "orch_task",
      title: "orchestration smoke",
      description: "",
      requestedOperations: [],
    });
    const bridgeReport = createHermesBridgeReport(bridgeTask);

    const minimalPilot: HermesLocalPilotResult = {
      status: "completed",
      forbiddenOperations: [],
      finalSummary:
        "dummy summary\nHermes変更レポート: Local Pilot が sandbox で read/write と危険操作ブロックのみを評価。",
      bridgeTask,
      bridgeReport,
      approvalItems: [],
      auditRecords: [],
      operations: [],
      approvalReport: {
        reportId: "approval_deadbeef",
        createdAt: new Date().toISOString(),
        source: "hermes_report",
        title: "pilot",
        summary: "pilot",
        decision: "hold",
        riskLevel: "medium",
        reasons: [],
        changedFiles: ["output/mock.txt"],
        untouchedCriticalAreas: [],
        userVisibleChanges: [],
        executedTests: [],
        skippedTests: [],
        missingChecks: [],
        rollbackPlan: "",
        nextStepRisk: [],
        memoryCandidatesSummary: {
          candidateCount: 0,
          rejectedCount: 0,
          requiresApprovalCount: 0,
          forbiddenCount: 0,
          categories: [],
          warnings: [],
        },
        safetyFlags: [],
        requiresUserApproval: true,
        autoApproved: false,
        recommendedUserAction: "hold",
      },
      requiresUserApproval: true,
      autoExecutable: false,
    };

    const pkg = processHermesPilotResult(minimalPilot);
    expect(pkg.reviewResult.requiresUserFinalApproval).toBe(true);
    expect(pkg.reviewResult.autoApproved).toBe(false);

    expect(
      pkg.memoryCandidates.candidates.every((candidate) => candidate.id),
    ).toBe(true);
    expect(pkg.approvalQueueItems.some((candidate) => candidate.ok)).toBe(true);
    expect(
      pkg.auditRecords.some((record) => record.kind === "review_completed"),
    ).toBe(true);
    expect(
      pkg.finalDecision.requiresUserApproval &&
        !pkg.finalDecision.autoExecutable,
    ).toBe(true);

    const alias = createIchikishimaDecisionPackage(minimalPilot);
    expect(alias.finalDecision.shouldSpeak).toBe(false);
  });
});
