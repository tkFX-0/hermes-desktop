import type { OperatorHandoffMarkdownSnapshot } from "../operator-handoff-markdown-snapshot/operator-handoff-markdown-snapshot-types";
import type {
  OperatorHandoffSnapshotIndex,
  OperatorHandoffSnapshotIndexCounts,
  OperatorHandoffSnapshotIndexEntry,
  OperatorHandoffSnapshotIndexInput,
  OperatorHandoffSnapshotIndexSafety,
  OperatorHandoffSnapshotIndexStatus
} from "./operator-handoff-snapshot-index-types";

const DEFAULT_TITLE = "しきしま Operator Handoff Snapshot Index";

const SAFETY_BLOCK: OperatorHandoffSnapshotIndexSafety = {
  indexOnly: true,
  markdownOnly: true,
  reviewOnly: true,
  draftOnly: true,
  displayOnly: true,
  discordPasteReady: true,
  obsidianCompatible: true,
  obsidianWrite: false,
  fileWrite: false,
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

function extractNextRecommendedGoal(snapshot: OperatorHandoffMarkdownSnapshot): string | undefined {
  const section = snapshot.sections.find((item) => item.heading === "Next Recommended Goal");
  const line = section?.lines[0]?.trim();

  if (!line || line === "(none recorded)") {
    return undefined;
  }

  return line;
}

function buildCounts(snapshots: OperatorHandoffMarkdownSnapshot[]): OperatorHandoffSnapshotIndexCounts {
  let readyForHumanReview = 0;
  let hold = 0;
  let blocked = 0;

  for (const snapshot of snapshots) {
    if (snapshot.status === "READY_FOR_HUMAN_REVIEW") {
      readyForHumanReview += 1;
    } else if (snapshot.status === "BLOCKED") {
      blocked += 1;
    } else {
      hold += 1;
    }
  }

  return {
    total: snapshots.length,
    readyForHumanReview,
    hold,
    blocked
  };
}

function resolveIndexStatus(counts: OperatorHandoffSnapshotIndexCounts): OperatorHandoffSnapshotIndexStatus {
  if (counts.total === 0) {
    return "HOLD";
  }

  if (counts.blocked > 0) {
    return "BLOCKED";
  }

  const hasReady = counts.readyForHumanReview > 0;
  const hasHold = counts.hold > 0;

  if (hasReady && hasHold) {
    return "MIXED";
  }

  if (counts.readyForHumanReview === counts.total) {
    return "READY_FOR_HUMAN_REVIEW";
  }

  if (counts.hold === counts.total) {
    return "HOLD";
  }

  return "MIXED";
}

function buildEntries(snapshots: OperatorHandoffMarkdownSnapshot[]): OperatorHandoffSnapshotIndexEntry[] {
  return snapshots.map((snapshot) => ({
    goalName: snapshot.source.goalName,
    goalResultStatus: snapshot.source.goalResultStatus,
    snapshotStatus: snapshot.status,
    sessionId: snapshot.source.sessionId,
    nextRecommendedGoal: extractNextRecommendedGoal(snapshot),
    requiresExplicitHumanGo: true
  }));
}

function renderSnapshotEntries(
  entries: OperatorHandoffSnapshotIndexEntry[],
  includeSnapshotMarkdownLinks: boolean,
  snapshots: OperatorHandoffMarkdownSnapshot[]
): string[] {
  if (entries.length === 0) {
    return ["No snapshots"];
  }

  return entries.map((entry, index) => {
    const nextLine = entry.nextRecommendedGoal
      ? `   - next: ${entry.nextRecommendedGoal}`
      : "   - next: (none recorded)";
    const linkLine =
      includeSnapshotMarkdownLinks && snapshots[index]
        ? `   - snapshot: ${snapshots[index].title}`
        : undefined;

    return [
      `${index + 1}. ${entry.goalName}`,
      `   - status: ${entry.snapshotStatus}`,
      `   - result: ${entry.goalResultStatus}`,
      `   - session: ${entry.sessionId}`,
      nextLine,
      "   - Human GO required: yes",
      linkLine
    ]
      .filter((line): line is string => line !== undefined)
      .join("\n");
  });
}

function renderIndexMarkdown(
  title: string,
  status: OperatorHandoffSnapshotIndexStatus,
  counts: OperatorHandoffSnapshotIndexCounts,
  entries: OperatorHandoffSnapshotIndexEntry[],
  snapshots: OperatorHandoffMarkdownSnapshot[],
  input: OperatorHandoffSnapshotIndexInput
): string {
  const includeSafety = input.includeSafetySection !== false;
  const includeLinks = input.includeSnapshotMarkdownLinks === true;
  const entryBlocks = renderSnapshotEntries(entries, includeLinks, snapshots);

  const lines = [
    `# ${title}`,
    "",
    "## Status",
    `- status: ${status}`,
    `- total: ${counts.total}`,
    `- ready: ${counts.readyForHumanReview}`,
    `- hold: ${counts.hold}`,
    `- blocked: ${counts.blocked}`,
    ""
  ];

  if (input.generatedAtLabel) {
    lines.push(`- generated: ${input.generatedAtLabel}`, "");
  }

  lines.push("## Snapshot Entries", ...entryBlocks, "", "## Next Actions");

  if (counts.total === 0) {
    lines.push("- No snapshots to review");
  } else {
    lines.push(
      "- Review READY_FOR_HUMAN_REVIEW entries",
      "- Decide whether to approve one next Goal (explicit Human GO required)",
      "- HOLD/BLOCKED entries require revision or investigation",
      "- READY_FOR_HUMAN_REVIEW is not Discord send approval",
      "- READY_FOR_HUMAN_REVIEW is not next Goal approval"
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
      "- execution: disabled",
      "- Every next Goal requires explicit Human GO"
    );
  }

  return lines.join("\n");
}

export function createOperatorHandoffSnapshotIndex(
  input: OperatorHandoffSnapshotIndexInput
): OperatorHandoffSnapshotIndex {
  const snapshots = [...input.snapshots];
  const title = input.title?.trim() || DEFAULT_TITLE;
  const counts = buildCounts(snapshots);
  const status = resolveIndexStatus(counts);
  const entries = buildEntries(snapshots);
  const markdown = renderIndexMarkdown(title, status, counts, entries, snapshots, input);

  return {
    surface: "operator-handoff-snapshot-index",
    indexOnly: true,
    markdownOnly: true,
    reviewOnly: true,
    draftOnly: true,
    status,
    title,
    entries,
    counts,
    markdown,
    safety: { ...SAFETY_BLOCK }
  };
}

export function renderOperatorHandoffSnapshotIndex(
  index: OperatorHandoffSnapshotIndex
): string {
  return index.markdown;
}

export function createOperatorHandoffSnapshotIndexMarkdown(
  input: OperatorHandoffSnapshotIndexInput
): string {
  return renderOperatorHandoffSnapshotIndex(createOperatorHandoffSnapshotIndex(input));
}

export function countSnapshotsByStatus(
  snapshots: OperatorHandoffMarkdownSnapshot[]
): OperatorHandoffSnapshotIndexCounts {
  return buildCounts(snapshots);
}

export function resolveSnapshotIndexStatus(
  snapshots: OperatorHandoffMarkdownSnapshot[]
): OperatorHandoffSnapshotIndexStatus {
  return resolveIndexStatus(buildCounts(snapshots));
}
