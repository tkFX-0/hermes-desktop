import type { HumanGateQueueDisplayTargetItem } from "../human-gate-queue-display-target/human-gate-queue-display-target-types";
import type {
  HumanGateQueueMarkdownRenderModel,
  HumanGateQueueMarkdownRenderSafety,
  HumanGateQueueMarkdownRenderStatusTone,
  HumanGateQueueMarkdownSection
} from "./human-gate-queue-markdown-render-types";

const TARGET_DOCUMENT = "docs/shikishima/HUMAN_GATE_QUEUE.md" as const;

const SAFETY_BLOCK: HumanGateQueueMarkdownRenderSafety = {
  displayOnly: true,
  canApprovePush: false,
  canApproveRuntime: false,
  canApproveExternalWrite: false,
  actualQueueMutation: false,
  fileWritePerformed: false,
  humanGateQueueDocModified: false,
  discordSend: false,
  webhookUsed: false,
  botStarted: false,
  tokenRead: false,
  obsidianActualWrite: false,
  runtimeStarted: false,
  networkCall: false,
  externalWrite: false,
  productionReady: false,
  execution: "disabled",
  rawValuesReported: false,
  redacted: true
};

function mapStatusTone(
  status: HumanGateQueueDisplayTargetItem["status"]
): HumanGateQueueMarkdownRenderStatusTone {
  if (status === "READY_FOR_REVIEW") return "review";
  if (status === "PREVIEW_ONLY") return "preview";
  if (status === "REJECTED") return "rejected";
  return "hold";
}

function buildStatusLabel(status: HumanGateQueueDisplayTargetItem["status"]): string {
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

function buildMarkdownSections(item: HumanGateQueueDisplayTargetItem): HumanGateQueueMarkdownSection[] {
  return [
    {
      heading: "Item",
      lines: [
        `queueItemId: ${item.queueItemId}`,
        `gateId: ${item.gateId}`,
        `goalId: ${item.goalId}`,
        `taskId: ${item.taskId}`,
        `status: ${item.status}`,
        `requestedAction: ${item.requestedAction}`,
        `sourceReportStatus: ${item.sourceReportStatus}`
      ]
    },
    {
      heading: "Summary",
      lines: [item.summary]
    },
    {
      heading: "Required human gates",
      lines:
        item.requiredHumanGates.length > 0
          ? item.requiredHumanGates.map((gate) => gate)
          : ["(none listed)"]
    },
    {
      heading: "Reasons",
      lines: item.reasons.length > 0 ? item.reasons.map((reason) => reason) : ["(none)"]
    },
    {
      heading: "Safety",
      lines: [
        "review-only",
        "HOLD",
        "no queue mutation",
        "no file write",
        "execution disabled",
        "no external write",
        "human GO required for effects"
      ]
    }
  ];
}

export function createHumanGateQueueMarkdownRenderModel(
  item: HumanGateQueueDisplayTargetItem
): HumanGateQueueMarkdownRenderModel {
  return {
    surface: "human-gate-queue-markdown",
    previewOnly: true,
    fileWriteReady: false,
    actualQueueMutation: false,
    targetDocument: TARGET_DOCUMENT,
    title: item.title,
    statusLabel: buildStatusLabel(item.status),
    statusTone: mapStatusTone(item.status),
    markdownSections: buildMarkdownSections(item),
    source: {
      goalId: item.goalId,
      taskId: item.taskId,
      gateId: item.gateId,
      sourceStatus: item.status
    },
    safety: { ...SAFETY_BLOCK }
  };
}

export function renderHumanGateQueueMarkdownPreview(
  model: HumanGateQueueMarkdownRenderModel
): string {
  const sectionBlocks = model.markdownSections.map((section) => {
    const lines = section.lines.map((line) => `- ${line}`).join("\n");
    return `### ${section.heading}\n${lines}`;
  });

  return [
    "<!-- review-only / preview-only / not an approval -->",
    "<!-- no file write / HUMAN_GATE_QUEUE.md unmodified -->",
    `## Human Gate Queue Markdown Preview`,
    "",
    `**Target document (not written):** ${model.targetDocument}`,
    `**Title:** ${model.title}`,
    `**Status:** ${model.statusLabel} (${model.source.sourceStatus}; tone: ${model.statusTone})`,
  `**Source:** goalId=${model.source.goalId} | taskId=${model.source.taskId} | gateId=${model.source.gateId}`,
    "",
    ...sectionBlocks,
    "",
    "**Operator notice:**",
    "- previewOnly: true | fileWriteReady: false | actualQueueMutation: false",
    "- humanGateQueueDocModified: false | fileWritePerformed: false",
    "- execution: disabled | productionReady: false | externalWrite: false",
    "- This preview does not approve push, runtime, queue mutation, or file write."
  ].join("\n");
}

export function createHumanGateQueueMarkdownPreview(
  item: HumanGateQueueDisplayTargetItem
): string {
  return renderHumanGateQueueMarkdownPreview(createHumanGateQueueMarkdownRenderModel(item));
}
