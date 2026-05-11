import type {
  BlockedOperationResult,
  DeleteZoneFileResult,
} from "../autonomy-zone/types";

import {
  createApprovalQueueItemFromApprovalRequest,
  type CreateApprovalQueueItemResult,
} from "./approval-queue";

/** deleteZoneFile が ApprovalRequest を付与しないケースでは null を返す。 */
export function approvalQueueCandidateFromBlockedDelete(
  result: DeleteZoneFileResult,
): CreateApprovalQueueItemResult | null {
  if (!result.approvalRequestCandidate) return null;
  return createApprovalQueueItemFromApprovalRequest(
    result.approvalRequestCandidate,
    {
      source: "operation_block",
      title: `Delete blocked: ${result.reasonCode}`,
    },
  );
}

/** execute / network / git の明示ブロックからキュー項目候補を生成する（実行はしない）。 */
export function approvalQueueCandidateFromBlockedOperation(
  result: BlockedOperationResult,
): CreateApprovalQueueItemResult {
  return createApprovalQueueItemFromApprovalRequest(
    result.approvalRequestCandidate,
    {
      source: "operation_block",
      title: `${result.approvalRequestCandidate.actionType} blocked: ${result.reasonCode}`,
    },
  );
}

/** {@link approvalQueueCandidateFromBlockedDelete} と同一（Goal 側の関数名との互換別名）。 */
export function createApprovalQueueItemFromBlockedDelete(
  result: DeleteZoneFileResult,
): CreateApprovalQueueItemResult | null {
  return approvalQueueCandidateFromBlockedDelete(result);
}

/** {@link approvalQueueCandidateFromBlockedOperation} と同一（Goal 側の関数名との互換別名）。 */
export function createApprovalQueueItemFromBlockedOperation(
  result: BlockedOperationResult,
): CreateApprovalQueueItemResult {
  return approvalQueueCandidateFromBlockedOperation(result);
}
