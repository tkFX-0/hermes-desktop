import { createApprovalRequest } from "./approval-request";
import type {
  BlockedOperationAuditEventCandidate,
  BlockedOperationReasonCode,
  BlockedOperationResult,
  ExecuteCommandInput,
  GitOperationInput,
  NetworkAccessInput,
} from "./types";

function createBlockedAuditEventCandidate(
  input: { requestId?: string; actor: ExecuteCommandInput["actor"] },
  action: BlockedOperationAuditEventCandidate["action"],
  reasonCode: BlockedOperationReasonCode,
  reason: string,
): BlockedOperationAuditEventCandidate {
  return {
    requestId: input.requestId,
    actor: input.actor,
    action,
    status: "denied",
    reasonCode,
    reason,
    contentIncluded: false,
    timestamp: new Date().toISOString(),
  };
}

export function executeCommand(
  input: ExecuteCommandInput,
): BlockedOperationResult {
  const reason = input.reason ?? "Command execution requires explicit approval";
  const commandLine = [input.command, ...(input.args ?? [])].join(" ").trim();
  return {
    ok: false,
    reasonCode: "EXECUTE_REQUIRES_APPROVAL",
    reason,
    executed: false,
    auditEventCandidate: createBlockedAuditEventCandidate(
      input,
      "execute",
      "EXECUTE_REQUIRES_APPROVAL",
      reason,
    ),
    approvalRequestCandidate: createApprovalRequest({
      requestId: input.requestId,
      actionType: "execute",
      actor: input.actor,
      targetPaths: input.cwd ? [input.cwd] : [],
      commands: commandLine ? [commandLine] : [],
      riskLevel: "high",
      reason,
      expectedResult: "Run the requested command only after user approval",
      rollbackPlan:
        "Do not execute automatically; prepare manual rollback before approval",
      testPlan:
        "Review command, working directory, and expected side effects before approval",
    }),
  };
}

export function requestNetworkAccess(
  input: NetworkAccessInput,
): BlockedOperationResult {
  const reason = input.reason ?? "Network access requires explicit approval";
  return {
    ok: false,
    reasonCode: "NETWORK_REQUIRES_APPROVAL",
    reason,
    executed: false,
    auditEventCandidate: createBlockedAuditEventCandidate(
      input,
      "network",
      "NETWORK_REQUIRES_APPROVAL",
      reason,
    ),
    approvalRequestCandidate: createApprovalRequest({
      requestId: input.requestId,
      actionType: "network",
      actor: input.actor,
      externalUrls: [input.url],
      riskLevel: "high",
      reason,
      expectedResult: "Access the requested URL only after user approval",
      rollbackPlan: "No network request is sent before approval",
      testPlan:
        "Review URL, method, payload, and data exposure risk before approval",
    }),
  };
}

export function requestGitOperation(
  input: GitOperationInput,
): BlockedOperationResult {
  const reason = input.reason ?? "Git operation requires explicit approval";
  const commandLine = ["git", input.operation, ...(input.args ?? [])]
    .join(" ")
    .trim();
  return {
    ok: false,
    reasonCode: "GIT_REQUIRES_APPROVAL",
    reason,
    executed: false,
    auditEventCandidate: createBlockedAuditEventCandidate(
      input,
      "git",
      "GIT_REQUIRES_APPROVAL",
      reason,
    ),
    approvalRequestCandidate: createApprovalRequest({
      requestId: input.requestId,
      actionType: "git",
      actor: input.actor,
      targetPaths: input.repositoryPath ? [input.repositoryPath] : [],
      commands: [commandLine],
      riskLevel: "high",
      reason,
      expectedResult:
        "Run the requested git operation only after user approval",
      rollbackPlan:
        "Inspect git status and prepare a restore plan before approval",
      testPlan:
        "Review operation, target branch, and remote impact before approval",
    }),
  };
}
