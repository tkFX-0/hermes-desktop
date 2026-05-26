import type { GoalRunnerDryRunInput } from "../goal-runner-dry-run/goal-runner-dry-run-types";
import type { HumanGateQueueDisplayTargetItem } from "../human-gate-queue-display-target/human-gate-queue-display-target-types";
import { createHumanGateQueueDisplayTargetItemFromContract } from "../human-gate-queue-display-target/human-gate-queue-display-target";
import type {
  IphoneHumanGateDisplayItem,
  IphoneHumanGateDisplaySection,
  IphoneHumanGateDisplayStatus
} from "./iphone-human-gate-display-types";

function buildDisplayId(queueItemId: string): string {
  return `iphone-private-console:${queueItemId}`;
}

function buildPrimaryStatusLabel(status: IphoneHumanGateDisplayStatus): string {
  switch (status) {
    case "READY_FOR_REVIEW":
      return "Review required";
    case "PREVIEW_ONLY":
      return "Preview only";
    case "REJECTED":
      return "Rejected";
    default:
      return "HOLD";
  }
}

function buildSafetyChips(): string[] {
  return [
    "display-only",
    "no-push",
    "no-runtime",
    "no-external-write",
    "human-go-required"
  ];
}

function buildMobileSections(item: HumanGateQueueDisplayTargetItem): IphoneHumanGateDisplaySection[] {
  return [
    {
      id: "summary",
      label: "Summary",
      lines: [item.summary]
    },
    {
      id: "gates",
      label: "Required gates",
      lines:
        item.requiredHumanGates.length > 0
          ? item.requiredHumanGates.map((gate) => `- ${gate}`)
          : ["- (none listed)"]
    },
    {
      id: "reasons",
      label: "Reasons",
      lines: item.reasons.length > 0 ? item.reasons.map((reason) => `- ${reason}`) : ["- (none)"]
    }
  ];
}

function buildRecommendedHumanActionLabel(status: IphoneHumanGateDisplayStatus): string {
  if (status === "REJECTED") return "Do not proceed; resolve blockers.";
  if (status === "HOLD") return "Wait for human GO before any effect.";
  if (status === "READY_FOR_REVIEW") return "Review gate references and issue explicit human GO.";
  return "Preview only; explicit human GO still required.";
}

export function createIphoneHumanGateDisplayItem(
  item: HumanGateQueueDisplayTargetItem
): IphoneHumanGateDisplayItem {
  const status = item.status;

  return {
    displayId: buildDisplayId(item.queueItemId),
    gateId: item.gateId,
    goalId: item.goalId,
    taskId: item.taskId,
    title: item.title,
    status,
    summary: item.summary,
    reasons: [...item.reasons],
    requiredHumanGates: [...item.requiredHumanGates],
    compactTitle: item.title.length > 48 ? `${item.title.slice(0, 45)}...` : item.title,
    primaryStatusLabel: buildPrimaryStatusLabel(status),
    safetyChips: buildSafetyChips(),
    mobileSections: buildMobileSections(item),
    recommendedHumanActionLabel: buildRecommendedHumanActionLabel(status),
    displayOnly: true,
    mobileReady: true,
    uiConnected: false,
    ipcConnected: false,
    networkExposed: false,
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

export function createIphoneHumanGateDisplayItemFromContract(
  input: GoalRunnerDryRunInput
): IphoneHumanGateDisplayItem {
  return createIphoneHumanGateDisplayItem(createHumanGateQueueDisplayTargetItemFromContract(input));
}
