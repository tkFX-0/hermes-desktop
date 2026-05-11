import type { ApprovalRequest, ApprovalRequestInput } from "./types";

export function createApprovalRequest(
  input: ApprovalRequestInput,
): ApprovalRequest {
  return {
    requestId: input.requestId,
    actionType: input.actionType,
    actor: input.actor,
    targetPaths: [...(input.targetPaths ?? [])],
    commands: [...(input.commands ?? [])],
    externalUrls: [...(input.externalUrls ?? [])],
    riskLevel: input.riskLevel,
    reason: input.reason,
    expectedResult: input.expectedResult,
    rollbackPlan: input.rollbackPlan,
    testPlan: input.testPlan,
    requiresUserApproval: true,
    createdAt: new Date().toISOString(),
  };
}
