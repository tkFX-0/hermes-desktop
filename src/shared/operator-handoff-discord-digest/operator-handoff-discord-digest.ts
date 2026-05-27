import type { OperatorHandoffDailyQueuePreviewItem } from "../operator-handoff-daily-queue-preview/operator-handoff-daily-queue-preview-types";
import type {
  OperatorHandoffDiscordDigest,
  OperatorHandoffDiscordDigestInput,
  OperatorHandoffDiscordDigestItem,
  OperatorHandoffDiscordDigestPriority,
  OperatorHandoffDiscordDigestSafety,
  OperatorHandoffDiscordDigestStatus
} from "./operator-handoff-discord-digest-types";

const DEFAULT_TITLE = "しきしま Operator Digest";
const DEFAULT_MAX_ITEMS = 5;
const DEFAULT_MAX_LENGTH = 1800;

const SAFETY_BLOCK: OperatorHandoffDiscordDigestSafety = {
  digestOnly: true,
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

const PRIORITY_ORDER: Record<OperatorHandoffDiscordDigestPriority, number> = {
  blocked: 0,
  review_now: 1,
  hold: 2
};

function mapPreviewStatus(status: string): OperatorHandoffDiscordDigestStatus {
  if (status === "BLOCKED") return "BLOCKED";
  if (status === "MIXED") return "MIXED";
  if (status === "READY_FOR_HUMAN_REVIEW") return "READY_FOR_HUMAN_REVIEW";
  return "HOLD";
}

function toDigestItem(item: OperatorHandoffDailyQueuePreviewItem): OperatorHandoffDiscordDigestItem {
  return {
    goalName: item.goalName,
    status: item.status,
    priority: item.priority,
    nextRecommendedGoal: item.nextRecommendedGoal,
    requiresExplicitHumanGo: true
  };
}

function sortByPriority(items: OperatorHandoffDiscordDigestItem[]): OperatorHandoffDiscordDigestItem[] {
  return [...items].sort((left, right) => PRIORITY_ORDER[left.priority] - PRIORITY_ORDER[right.priority]);
}

function buildSummaryLine(status: OperatorHandoffDiscordDigestStatus, counts: OperatorHandoffDiscordDigest["counts"]): string {
  return `status=${status} | review_now=${counts.reviewNow} | hold=${counts.hold} | blocked=${counts.blocked} | total=${counts.total}`;
}

function renderDigestMarkdown(
  title: string,
  status: OperatorHandoffDiscordDigestStatus,
  counts: OperatorHandoffDiscordDigest["counts"],
  items: OperatorHandoffDiscordDigestItem[],
  recommendedHumanAction: string,
  includeSafetySummary: boolean
): string {
  const topItems = items.map((item, index) => {
    const nextLine = item.nextRecommendedGoal
      ? `   - next: ${item.nextRecommendedGoal}`
      : "   - next: (none recorded)";

    return [
      `${index + 1}. ${item.goalName}`,
      `   - priority: ${item.priority}`,
      nextLine,
      "   - Human GO required: yes"
    ].join("\n");
  });

  const lines = [
    `# ${title}`,
    "",
    `**Status:** ${status}`,
    `**Review Now:** ${counts.reviewNow} / **HOLD:** ${counts.hold} / **BLOCKED:** ${counts.blocked}`,
    "",
    "## Top Items",
    topItems.length > 0 ? topItems.join("\n\n") : "- (none)",
    "",
    "## Recommended Human Action",
    recommendedHumanAction
  ];

  if (includeSafetySummary) {
    lines.push(
      "",
      "## Safety",
      "Discord send: HOLD / Queue mutation: HOLD / Runtime: HOLD / productionReady: false / execution: disabled",
      "READY_FOR_HUMAN_REVIEW is not Discord send approval.",
      "Every next Goal requires explicit Human GO."
    );
  }

  return lines.join("\n");
}

function applyMaxLength(markdown: string, maxLength: number): { markdown: string; truncated: boolean } {
  if (markdown.length <= maxLength) {
    return { markdown, truncated: false };
  }

  const suffix = "\n\n(truncated for Discord paste)";
  const sliceLength = Math.max(0, maxLength - suffix.length);

  return {
    markdown: `${markdown.slice(0, sliceLength)}${suffix}`,
    truncated: true
  };
}

export function createOperatorHandoffDiscordDigest(
  input: OperatorHandoffDiscordDigestInput
): OperatorHandoffDiscordDigest {
  const preview = input.dailyQueuePreview;
  const title = input.title?.trim() || DEFAULT_TITLE;
  const maxItems = input.maxItems ?? DEFAULT_MAX_ITEMS;
  const maxLength = input.maxLength ?? DEFAULT_MAX_LENGTH;
  const includeSafetySummary = input.includeSafetySummary !== false;

  const status = mapPreviewStatus(preview.status);
  const counts = {
    total: preview.counts.total,
    reviewNow: preview.counts.reviewNow,
    hold: preview.counts.hold,
    blocked: preview.counts.blocked
  };

  const sortedItems = sortByPriority(preview.items.map(toDigestItem));
  const listedItems = sortedItems.slice(0, maxItems);
  const truncatedByItems = listedItems.length < sortedItems.length;

  const fullMarkdown = renderDigestMarkdown(
    title,
    status,
    counts,
    listedItems,
    preview.recommendedHumanAction,
    includeSafetySummary
  );

  const { markdown, truncated: truncatedByLength } = applyMaxLength(fullMarkdown, maxLength);

  return {
    surface: "operator-handoff-discord-digest",
    digestOnly: true,
    markdownOnly: true,
    reviewOnly: true,
    draftOnly: true,
    status,
    title,
    summaryLine: buildSummaryLine(status, counts),
    items: listedItems,
    counts,
    recommendedHumanAction: preview.recommendedHumanAction,
    markdown,
    truncated: truncatedByItems || truncatedByLength,
    safety: { ...SAFETY_BLOCK }
  };
}

export function renderOperatorHandoffDiscordDigest(digest: OperatorHandoffDiscordDigest): string {
  return digest.markdown;
}

export function createOperatorHandoffDiscordDigestMarkdown(
  input: OperatorHandoffDiscordDigestInput
): string {
  return renderOperatorHandoffDiscordDigest(createOperatorHandoffDiscordDigest(input));
}
