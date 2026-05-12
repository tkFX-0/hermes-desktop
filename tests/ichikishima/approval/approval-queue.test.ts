import { describe, expect, it } from "vitest";

import type { ApprovalRiskLevel } from "../../../src/main/ichikishima/autonomy-zone/types";
import {
  createApprovalQueueItem,
  maskApprovalQueueSensitiveText,
  normalizeApprovalQueueItem,
  updateApprovalQueueItemStatus,
} from "../../../src/main/ichikishima/approval";

describe("Approval queue core", () => {
  it("forces requiresUserApproval and autoExecutable guards", () => {
    const result = createApprovalQueueItem({
      source: "manual",
      actor: "user",
      actionType: "execute",
      riskLevel: "high",
      title: "Test title",
      reason: "blocked command",
      expectedResult: "None",
      rollbackPlan: "None",
      testPlan: "None",
      commands: ["node -e 1"],
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.item.requiresUserApproval).toBe(true);
    expect(result.item.autoExecutable).toBe(false);
  });

  it("masks secret-like payloads in reusable mask helper", () => {
    const masked = maskApprovalQueueSensitiveText(
      "sk-abcdABCDEFGHij0123456789",
    );
    expect(masked).not.toContain("abcdABCDEFGHij0123456789");
    expect(masked.length).toBeGreaterThan(0);
  });

  it("rejects blank title or reason before persistence", () => {
    expect(
      createApprovalQueueItem({
        source: "manual",
        actor: "system",
        actionType: "git",
        riskLevel: "medium",
        title: "   ",
        reason: "",
        expectedResult: "x",
        rollbackPlan: "y",
        testPlan: "z",
      }).ok,
    ).toBe(false);
  });

  it("accepts creator-supplied critical risk", () => {
    const result = createApprovalQueueItem({
      source: "manual",
      actor: "hermes",
      actionType: "dependency_install",
      riskLevel: "critical",
      title: "install deps",
      reason: "Need package",
      expectedResult: "deps installed manually",
      rollbackPlan: "revert package lock",
      testPlan: "smoke npm test",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.item.riskLevel).toBe("critical");
  });

  const validLevels: ApprovalRiskLevel[] = [
    "low",
    "medium",
    "high",
    "critical",
  ];
  validLevels.forEach((riskLevel) => {
    it(`accepts ApprovalRiskLevel ${riskLevel}`, () => {
      const result = createApprovalQueueItem({
        source: "system",
        actor: "system",
        actionType: "external_escalation",
        riskLevel,
        title: `${riskLevel} queue`,
        reason: `${riskLevel} testing`,
        expectedResult: "none",
        rollbackPlan: "none",
        testPlan: "none",
      });

      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(result.item.riskLevel).toBe(riskLevel);
    });
  });

  it("updates status without turning on autoExecutable", () => {
    const draft = createApprovalQueueItem({
      source: "operation_block",
      actor: "hermes",
      actionType: "delete",
      riskLevel: "high",
      title: "delete block",
      reason: "policy",
      expectedResult: "delete after approval workflow",
      rollbackPlan: "restore backup",
      testPlan: "path review",
      targetPaths: ["sandbox/output/x.txt"],
    });
    expect(draft.ok).toBe(true);
    if (!draft.ok) return;

    const approved = updateApprovalQueueItemStatus(draft.item, {
      status: "approved",
    });
    expect(approved.ok).toBe(true);
    if (!approved.ok) return;
    expect(approved.item.status).toBe("approved");
    expect(approved.item.autoExecutable).toBe(false);

    const normalized = normalizeApprovalQueueItem({
      ...approved.item,
      reason: `${approved.item.reason} sk-fedcba9876543210`,
    });

    expect(normalized.reason).not.toContain("sk-fedcba9876543210");
    expect(normalized.requiresUserApproval).toBe(true);
    expect(normalized.autoExecutable).toBe(false);
  });
});
