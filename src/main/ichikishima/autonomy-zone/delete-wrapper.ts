import { checkDenylist } from "./denylist";
import { checkZonePath } from "./path-guard";
import { createApprovalRequest } from "./approval-request";
import type {
  DeleteAuditEventCandidate,
  DeleteFailureReasonCode,
  DeleteZoneFileInput,
  DeleteZoneFileResult,
} from "./types";

function createDeleteAuditEventCandidate(
  input: DeleteZoneFileInput,
  reasonCode: DeleteFailureReasonCode,
  reason: string,
  normalizedPath?: string,
): DeleteAuditEventCandidate {
  return {
    requestId: input.requestId,
    actor: input.actor,
    action: "delete",
    status: "denied",
    normalizedPath,
    reasonCode,
    reason,
    deleted: false,
    contentIncluded: false,
    timestamp: new Date().toISOString(),
  };
}

export function deleteZoneFile(
  input: DeleteZoneFileInput,
): DeleteZoneFileResult {
  const pathResult = checkZonePath({
    zoneRoot: input.zoneRoot,
    targetPath: input.requestedPath,
  });

  if (!pathResult.ok) {
    const reasonCode = "DENIED_BY_PATH_GUARD";
    return {
      ok: false,
      normalizedPath: pathResult.normalizedPath,
      reasonCode,
      reason: pathResult.reason,
      deleted: false,
      auditEventCandidate: createDeleteAuditEventCandidate(
        input,
        reasonCode,
        pathResult.reason,
        pathResult.normalizedPath,
      ),
    };
  }

  const denylistResult = checkDenylist(pathResult.relativePath, input.policy);
  if (!denylistResult.ok) {
    const reasonCode = "DENIED_BY_DENYLIST";
    return {
      ok: false,
      normalizedPath: pathResult.normalizedPath,
      reasonCode,
      reason: denylistResult.reason,
      deleted: false,
      auditEventCandidate: createDeleteAuditEventCandidate(
        input,
        reasonCode,
        denylistResult.reason,
        pathResult.normalizedPath,
      ),
    };
  }

  const reason = "Delete requires explicit user approval";
  const reasonCode = "DELETE_REQUIRES_APPROVAL";
  return {
    ok: false,
    normalizedPath: pathResult.normalizedPath,
    reasonCode,
    reason,
    deleted: false,
    auditEventCandidate: createDeleteAuditEventCandidate(
      input,
      reasonCode,
      reason,
      pathResult.normalizedPath,
    ),
    approvalRequestCandidate: createApprovalRequest({
      requestId: input.requestId,
      actionType: "delete",
      actor: input.actor,
      targetPaths: [pathResult.normalizedPath],
      riskLevel: "high",
      reason,
      expectedResult: "Delete the requested Zone file after user approval",
      rollbackPlan: "Restore from backup or source control if available",
      testPlan:
        "Confirm target path and run relevant Zone tests before approval",
    }),
  };
}
