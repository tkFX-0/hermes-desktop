import type { GoalRunnerDryRunInput } from "../goal-runner-dry-run/goal-runner-dry-run-types";
import type { ControlCenterHumanGateDisplayItem } from "../control-center-human-gate-display/control-center-human-gate-display-types";
import { createControlCenterHumanGateDisplayItemFromContract } from "../control-center-human-gate-display/control-center-human-gate-display";
import type {
  ControlCenterHumanGateDisplayRenderModel,
  ControlCenterHumanGateDisplayRenderReasonRow,
  ControlCenterHumanGateDisplayRenderStatusTone,
  ControlCenterHumanGateDisplayRenderSummaryBlock
} from "./control-center-human-gate-display-render-types";

const FOOTER_NOTICE =
  "Review-only panel. Human GO required before push, runtime, external write, or queue mutation.";

function mapStatusTone(status: ControlCenterHumanGateDisplayItem["status"]): ControlCenterHumanGateDisplayRenderStatusTone {
  if (status === "READY_FOR_REVIEW") return "review";
  if (status === "PREVIEW_ONLY") return "preview";
  if (status === "REJECTED") return "rejected";
  return "hold";
}

function buildStatusLabel(status: ControlCenterHumanGateDisplayItem["status"]): string {
  switch (status) {
    case "READY_FOR_REVIEW":
      return "Ready for human review";
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
    "HOLD",
    "no-push",
    "no-runtime",
    "no-external-write",
    "human-go-required"
  ];
}

function buildSummaryBlocks(item: ControlCenterHumanGateDisplayItem): ControlCenterHumanGateDisplayRenderSummaryBlock[] {
  return [
    {
      id: "summary",
      label: "Summary",
      lines: [item.summary]
    },
    {
      id: "gates",
      label: "Required human gates",
      lines:
        item.requiredHumanGates.length > 0
          ? item.requiredHumanGates.map((gate) => gate)
          : ["(none listed)"]
    }
  ];
}

function buildReasonRows(reasons: string[]): ControlCenterHumanGateDisplayRenderReasonRow[] {
  return reasons.map((text, index) => ({
    id: `reason-${index + 1}`,
    text
  }));
}

function buildRecommendedHumanActionLabel(
  status: ControlCenterHumanGateDisplayItem["status"]
): string {
  if (status === "REJECTED") return "Do not proceed; resolve blockers before requesting GO.";
  if (status === "HOLD") return "Wait for explicit human GO; no automated approval.";
  if (status === "READY_FOR_REVIEW") return "Review gate references and issue explicit human GO.";
  return "Preview only; human GO still required for any effect.";
}

export function createControlCenterHumanGateDisplayRenderModel(
  item: ControlCenterHumanGateDisplayItem
): ControlCenterHumanGateDisplayRenderModel {
  const statusTone = mapStatusTone(item.status);

  return {
    surface: "control-center-readonly",
    displayOnly: true,
    layout: "human-gate-review-panel",
    goalId: item.goalId,
    taskId: item.taskId,
    gateId: item.gateId,
    title: item.title,
    subtitle: `${item.goalId} / ${item.taskId}`,
    status: item.status,
    statusLabel: buildStatusLabel(item.status),
    statusTone,
    summary: item.summary,
    summaryBlocks: buildSummaryBlocks(item),
    safetyChips: buildSafetyChips(),
    requiredHumanGateLabels: [...item.requiredHumanGates],
    reasonRows: buildReasonRows(item.reasons),
    recommendedHumanActionLabel: buildRecommendedHumanActionLabel(item.status),
    footerNotice: FOOTER_NOTICE,
    uiConnected: false,
    ipcConnected: false,
    actualQueueMutation: false,
    canApprovePush: false,
    canApproveRuntime: false,
    canApproveExternalWrite: false,
    productionReady: false,
    execution: "disabled",
    rawValuesReported: false,
    redacted: true
  };
}

export function createControlCenterHumanGateDisplayRenderModelFromContract(
  input: GoalRunnerDryRunInput
): ControlCenterHumanGateDisplayRenderModel {
  return createControlCenterHumanGateDisplayRenderModel(
    createControlCenterHumanGateDisplayItemFromContract(input)
  );
}
