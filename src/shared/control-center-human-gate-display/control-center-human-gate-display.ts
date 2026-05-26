import type { GoalRunnerDryRunInput } from "../goal-runner-dry-run/goal-runner-dry-run-types";
import type { HumanGateQueueDisplayTargetItem } from "../human-gate-queue-display-target/human-gate-queue-display-target-types";
import { createHumanGateQueueDisplayTargetItemFromContract } from "../human-gate-queue-display-target/human-gate-queue-display-target";
import type { ControlCenterHumanGateDisplayItem } from "./control-center-human-gate-display-types";

function buildDisplayId(queueItemId: string): string {
  return `control-center:${queueItemId}`;
}

export function createControlCenterHumanGateDisplayItem(
  item: HumanGateQueueDisplayTargetItem
): ControlCenterHumanGateDisplayItem {
  return {
    displayId: buildDisplayId(item.queueItemId),
    gateId: item.gateId,
    goalId: item.goalId,
    taskId: item.taskId,
    title: item.title,
    status: item.status,
    summary: item.summary,
    reasons: [...item.reasons],
    requiredHumanGates: [...item.requiredHumanGates],
    displayOnly: true,
    uiConnected: false,
    ipcConnected: false,
    actualQueueMutation: false,
    canApproveProceed: item.canApproveProceed,
    canApproveCommit: item.canApproveCommit,
    canApprovePush: false,
    canApproveRuntime: false,
    canApproveExternalWrite: false,
    productionReady: false,
    execution: "disabled",
    rawValuesReported: false,
    redacted: true
  };
}

export function createControlCenterHumanGateDisplayItemFromContract(
  input: GoalRunnerDryRunInput
): ControlCenterHumanGateDisplayItem {
  return createControlCenterHumanGateDisplayItem(
    createHumanGateQueueDisplayTargetItemFromContract(input)
  );
}
