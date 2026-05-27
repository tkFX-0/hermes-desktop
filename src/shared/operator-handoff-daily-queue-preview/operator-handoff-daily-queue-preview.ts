import type { OperatorHandoffSnapshotIndexStatus } from "../operator-handoff-snapshot-index/operator-handoff-snapshot-index-types";
import type {
  OperatorHandoffDailyQueuePreview,
  OperatorHandoffDailyQueuePreviewCounts,
  OperatorHandoffDailyQueuePreviewInput,
  OperatorHandoffDailyQueuePreviewItem,
  OperatorHandoffDailyQueuePreviewPriority,
  OperatorHandoffDailyQueuePreviewSafety,
  OperatorHandoffDailyQueuePreviewStatus
} from "./operator-handoff-daily-queue-preview-types";

const DEFAULT_TITLE = "しきしま Daily Operator Queue Preview";

const SAFETY_BLOCK: OperatorHandoffDailyQueuePreviewSafety = {
  previewOnly: true,
  queuePreviewOnly: true,
  markdownOnly: true,
  reviewOnly: true,
  draftOnly: true,
  displayOnly: true,
  discordPasteReady: true,
  obsidianCompatible: true,
  obsidianWrite: false,
  fileWrite: false,
  humanGateQueueMutation: false,
  sendReady: false,
  maySendNow: false,
  actualDiscordSend: false,
  executorImplemented: false,
  webhookUsed: false,
  botStarted: false,
  tokenRead: false,
  networkCall: false,
  externalWrite: false,
  runtimeStarted: false,
  actualQueueMutation: false,
  humanGateQueueDocModified: false,
  productionReady: false,
  execution: "disabled",
  rawValuesReported: false,
  redacted: true
};

function mapIndexStatusToPreviewStatus(
  indexStatus: OperatorHandoffSnapshotIndexStatus
): OperatorHandoffDailyQueuePreviewStatus {
  return indexStatus;
}

function resolveItemPriority(snapshotStatus: string): OperatorHandoffDailyQueuePreviewPriority {
  if (snapshotStatus === "READY_FOR_HUMAN_REVIEW") {
    return "review_now";
  }

  if (snapshotStatus === "BLOCKED") {
    return "blocked";
  }

  return "hold";
}

function buildItems(
  input: OperatorHandoffDailyQueuePreviewInput
): OperatorHandoffDailyQueuePreviewItem[] {
  return input.snapshotIndex.entries.map((entry) => ({
    goalName: entry.goalName,
    status: entry.snapshotStatus,
    result: entry.goalResultStatus,
    sessionId: entry.sessionId,
    nextRecommendedGoal: entry.nextRecommendedGoal,
    priority: resolveItemPriority(entry.snapshotStatus),
    requiresExplicitHumanGo: true
  }));
}

function buildCounts(items: OperatorHandoffDailyQueuePreviewItem[]): OperatorHandoffDailyQueuePreviewCounts {
  let reviewNow = 0;
  let hold = 0;
  let blocked = 0;

  for (const item of items) {
    if (item.priority === "review_now") {
      reviewNow += 1;
    } else if (item.priority === "blocked") {
      blocked += 1;
    } else {
      hold += 1;
    }
  }

  return {
    total: items.length,
    reviewNow,
    hold,
    blocked
  };
}

function resolveRecommendedHumanAction(
  status: OperatorHandoffDailyQueuePreviewStatus
): string {
  if (status === "BLOCKED") {
    return "Resolve BLOCKED items before approving new GO.";
  }

  if (status === "MIXED") {
    return "Review READY items first, then decide whether HOLD/BLOCKED items need revision.";
  }

  if (status === "READY_FOR_HUMAN_REVIEW") {
    return "Choose one next Goal and issue explicit Human GO if approved.";
  }

  return "No approval-ready item. Review HOLD reasons or wait for new evidence.";
}

function renderItemList(
  items: OperatorHandoffDailyQueuePreviewItem[],
  emptyLabel: string
): string {
  if (items.length === 0) {
    return `- ${emptyLabel}`;
  }

  return items
    .map((item, index) => {
      const nextLine = item.nextRecommendedGoal
        ? `   - next: ${item.nextRecommendedGoal}`
        : "   - next: (none recorded)";

      return [
        `${index + 1}. ${item.goalName}`,
        `   - session: ${item.sessionId}`,
        nextLine,
        "   - Human GO required: yes"
      ].join("\n");
    })
    .join("\n\n");
}

function renderDailyQueueMarkdown(
  input: OperatorHandoffDailyQueuePreviewInput,
  preview: Pick<
    OperatorHandoffDailyQueuePreview,
    "title" | "dateLabel" | "operatorName" | "status" | "counts" | "items" | "recommendedHumanAction"
  >
): string {
  const includeSafety = input.includeSafetySection !== false;
  const includeNextActions = input.includeNextActions !== false;

  const reviewNowItems = preview.items.filter((item) => item.priority === "review_now");
  const holdItems = preview.items.filter((item) => item.priority === "hold");
  const blockedItems = preview.items.filter((item) => item.priority === "blocked");

  const operatorLine = preview.operatorName?.trim()
    ? preview.operatorName.trim()
    : "(not recorded)";

  const lines = [
    `# ${preview.title}`,
    "",
    "## Date",
    `- date: ${preview.dateLabel}`,
    `- operator: ${operatorLine}`,
    "",
    "## Status",
    `- status: ${preview.status}`,
    `- total: ${preview.counts.total}`,
    `- review_now: ${preview.counts.reviewNow}`,
    `- hold: ${preview.counts.hold}`,
    `- blocked: ${preview.counts.blocked}`,
    "",
    "## Review Now",
    renderItemList(reviewNowItems, "(none)"),
    "",
    "## HOLD",
    renderItemList(holdItems, "(none)"),
    "",
    "## BLOCKED",
    renderItemList(blockedItems, "(none)"),
    "",
    "## Recommended Human Action",
    preview.recommendedHumanAction
  ];

  if (includeNextActions) {
    lines.push(
      "",
      "## Next Actions",
      "- READY_FOR_HUMAN_REVIEW is not Discord send approval.",
      "- READY_FOR_HUMAN_REVIEW is not next Goal approval.",
      "- Every next Goal requires explicit Human GO."
    );
  }

  if (includeSafety) {
    lines.push(
      "",
      "## Safety Boundary",
      "- Discord send: HOLD",
      "- Executor: HOLD",
      "- Webhook/Bot/Token/Network: HOLD",
      "- Queue mutation: HOLD",
      "- Runtime: HOLD",
      "- productionReady: false",
      "- execution: disabled"
    );
  }

  return lines.join("\n");
}

export function createOperatorHandoffDailyQueuePreview(
  input: OperatorHandoffDailyQueuePreviewInput
): OperatorHandoffDailyQueuePreview {
  const title = input.title?.trim() || DEFAULT_TITLE;
  const dateLabel = input.dateLabel.trim();
  const operatorName = input.operatorName?.trim() || undefined;
  const status = mapIndexStatusToPreviewStatus(input.snapshotIndex.status);
  const items = buildItems(input);
  const counts = buildCounts(items);
  const recommendedHumanAction = resolveRecommendedHumanAction(status);

  const previewCore = {
    title,
    dateLabel,
    operatorName,
    status,
    counts,
    items,
    recommendedHumanAction
  };

  const markdown = renderDailyQueueMarkdown(input, previewCore);

  return {
    surface: "operator-handoff-daily-queue-preview",
    previewOnly: true,
    queuePreviewOnly: true,
    markdownOnly: true,
    reviewOnly: true,
    draftOnly: true,
    status,
    title,
    dateLabel,
    operatorName,
    items,
    counts,
    recommendedHumanAction,
    markdown,
    safety: { ...SAFETY_BLOCK }
  };
}

export function renderOperatorHandoffDailyQueuePreview(
  preview: OperatorHandoffDailyQueuePreview
): string {
  return preview.markdown;
}

export function createOperatorHandoffDailyQueuePreviewMarkdown(
  input: OperatorHandoffDailyQueuePreviewInput
): string {
  return renderOperatorHandoffDailyQueuePreview(createOperatorHandoffDailyQueuePreview(input));
}
