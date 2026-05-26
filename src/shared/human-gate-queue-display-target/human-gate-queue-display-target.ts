import type { GoalRunnerDryRunInput } from "../goal-runner-dry-run/goal-runner-dry-run-types";
import { createHumanGateReportFromContract } from "../human-gate-report/human-gate-report";
import type {
  HumanGateReport,
  HumanGateReportStatus
} from "../human-gate-report/human-gate-report-types";
import type {
  HumanGateQueueDisplayTargetItem,
  HumanGateQueueDisplayTargetStatus
} from "./human-gate-queue-display-target-types";

const DISPLAY_TARGET = "repo-local-human-gate-queue-markdown" as const;

const SAFETY_BLOCK: HumanGateQueueDisplayTargetItem["safety"] = {
  productionReady: false,
  execution: "disabled",
  rawValuesReported: false,
  runtimeStarted: false,
  externalWrite: false,
  uiConnected: false,
  ipcConnected: false,
  obsidianActualWrite: false,
  discordSend: false,
  stackchanConnection: false
};

function buildQueueItemId(gateId: string): string {
  return `queue-item:${gateId}`;
}

function mapReportStatusToDisplayStatus(
  status: HumanGateReportStatus
): HumanGateQueueDisplayTargetStatus {
  if (status === "PASS_PREVIEW_ONLY") return "PREVIEW_ONLY";
  if (status === "READY_FOR_HUMAN_REVIEW") return "READY_FOR_REVIEW";
  if (status === "REJECTED") return "REJECTED";
  return "HOLD";
}

export function createHumanGateQueueDisplayTargetItem(
  report: HumanGateReport
): HumanGateQueueDisplayTargetItem {
  const status = mapReportStatusToDisplayStatus(report.status);

  return {
    queueItemId: buildQueueItemId(report.gateId),
    gateId: report.gateId,
    goalId: report.goalId,
    taskId: report.taskId,
    title: report.title,
    status,
    summary: report.summary,
    requestedAction: report.requestedAction,
    canApproveProceed: report.canHumanApproveProceed,
    canApproveCommit: report.canHumanApproveCommit,
    canApprovePush: false,
    canApproveRuntime: false,
    canApproveExternalWrite: false,
    requiredHumanGates: [...report.requiredHumanGates],
    reasons: [...report.reasons],
    sourceReportStatus: report.status,
    display: {
      target: DISPLAY_TARGET,
      markdownReady: true,
      uiReady: false,
      ipcReady: false,
      actualQueueMutation: false
    },
    safety: { ...SAFETY_BLOCK },
    redacted: true
  };
}

export function createHumanGateQueueDisplayTargetItemFromContract(
  input: GoalRunnerDryRunInput
): HumanGateQueueDisplayTargetItem {
  return createHumanGateQueueDisplayTargetItem(createHumanGateReportFromContract(input));
}

export function renderHumanGateQueueDisplayTargetMarkdownPreview(
  item: HumanGateQueueDisplayTargetItem
): string {
  const lines = [
    "<!-- review-only / not an approval -->",
    `## Human Gate Queue Display Target (preview)`,
    "",
    `- queueItemId: ${item.queueItemId}`,
    `- gateId: ${item.gateId}`,
    `- goalId: ${item.goalId}`,
    `- taskId: ${item.taskId}`,
    `- title: ${item.title}`,
    `- status: ${item.status}`,
    `- requestedAction: ${item.requestedAction}`,
    `- sourceReportStatus: ${item.sourceReportStatus}`,
    "",
    `**Summary:** ${item.summary}`,
    "",
    "**Safety (HOLD — human GO required for effects):**",
    "- productionReady: false",
    "- execution: disabled",
    "- actualQueueMutation: false",
    "- uiReady: false",
    "- ipcReady: false",
    "",
    "**Required human gates:**",
    ...(item.requiredHumanGates.length > 0
      ? item.requiredHumanGates.map((gate) => `- ${gate}`)
      : ["- (none listed)"]),
    "",
    "**Reasons:**",
    ...(item.reasons.length > 0
      ? item.reasons.map((reason) => `- ${reason}`)
      : ["- (none)"])
  ];

  return lines.join("\n");
}
