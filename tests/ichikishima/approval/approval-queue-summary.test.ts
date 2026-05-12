import { describe, expect, it } from "vitest";

import type { ApprovalQueueItem } from "../../../src/main/ichikishima/approval/approval-queue";
import {
  getApprovalQueueSummaryFromItems,
  summarizeApprovalQueueItems,
} from "../../../src/main/ichikishima/approval/approval-queue-summary";

function baseItem(
  overrides: Partial<ApprovalQueueItem> = {},
): ApprovalQueueItem {
  return {
    approvalId: "00000000-0000-4000-8000-000000000001",
    createdAt: "2099-01-01T00:00:00.000Z",
    updatedAt: "2099-01-02T02:00:00.000Z",
    source: "manual",
    actor: "user",
    actionType: "external_escalation",
    status: "pending",
    riskLevel: "medium",
    title: "",
    reason: "",
    targetPaths: [],
    commands: [],
    externalUrls: [],
    expectedResult: "",
    rollbackPlan: "",
    testPlan: "",
    requiresUserApproval: true,
    autoExecutable: false,
    relatedAuditEventIds: [],
    metadata: {},
    ...overrides,
  };
}

describe("approval-queue-summary", () => {
  it("counts buckets without echoing secrets from items", () => {
    const items: ApprovalQueueItem[] = [
      baseItem({
        approvalId: "00000000-0000-4000-8000-000000000001",
        status: "pending",
        riskLevel: "critical",
      }),
      baseItem({
        approvalId: "00000000-0000-4000-8000-000000000002",
        status: "held",
        riskLevel: "medium",
      }),
      baseItem({
        approvalId: "00000000-0000-4000-8000-000000000003",
        status: "approved",
        riskLevel: "high",
      }),
      baseItem({
        approvalId: "00000000-0000-4000-8000-000000000004",
        status: "rejected",
        riskLevel: "low",
      }),
    ];

    const s = summarizeApprovalQueueItems(items);
    expect(s.total).toBe(4);
    expect(s.pending).toBe(1);
    expect(s.held).toBe(1);
    expect(s.approved).toBe(1);
    expect(s.rejected).toBe(1);
    expect(s.highRisk).toBe(2);
    expect(s.latestUpdatedAt).toBe("2099-01-02T02:00:00.000Z");
    expect(JSON.stringify(s)).not.toMatch(/external_escalation/);
  });

  it("alias matches summarize", () => {
    const items = [baseItem()];
    expect(getApprovalQueueSummaryFromItems(items)).toEqual(
      summarizeApprovalQueueItems(items),
    );
  });
});
