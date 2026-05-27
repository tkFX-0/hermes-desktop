import type { HumanGateStatusSnapshot } from "../human-gate-status-snapshot/human-gate-status-snapshot-types";
import type {
  DiscordOperatorBrief,
  DiscordOperatorBriefInput,
  DiscordOperatorBriefSafety,
  DiscordOperatorBriefStatus
} from "./discord-operator-brief-types";

const DEFAULT_MAX_LINES = 8;
const FOOTER_NOTICE =
  "Draft-only operator brief. No Discord send. No queue mutation. Ledger is source of truth. Human GO required.";

const SAFETY_BLOCK: DiscordOperatorBriefSafety = {
  briefOnly: true,
  draftOnly: true,
  displayOnly: true,
  sendReady: false,
  maySendNow: false,
  mayMutateQueueNow: false,
  fileWriteReady: false,
  actualDiscordSend: false,
  actualQueueMutation: false,
  humanGateQueueDocModified: false,
  webhookUsed: false,
  botStarted: false,
  tokenRead: false,
  networkCall: false,
  externalWrite: false,
  runtimeStarted: false,
  obsidianActualWrite: false,
  productionReady: false,
  execution: "disabled",
  rawValuesReported: false,
  redacted: true
};

function mapSnapshotStatusToBriefStatus(
  snapshotStatus: HumanGateStatusSnapshot["status"]
): DiscordOperatorBriefStatus {
  if (snapshotStatus === "BLOCKED") return "BLOCKED";
  if (snapshotStatus === "REVIEW_READY_CANDIDATE") return "REVIEW_READY_CANDIDATE";
  return "HOLD";
}

function buildHeadline(status: DiscordOperatorBriefStatus): string {
  if (status === "BLOCKED") return "Human Gate: BLOCKED — do not proceed";
  if (status === "REVIEW_READY_CANDIDATE") return "Human Gate: ready for human review (not approved)";
  return "Human Gate: HOLD — requirements incomplete";
}

function buildShortSummary(snapshot: HumanGateStatusSnapshot): string {
  return snapshot.summary.length > 160
    ? `${snapshot.summary.slice(0, 157)}...`
    : snapshot.summary;
}

function buildCandidateLines(snapshot: HumanGateStatusSnapshot): string[] {
  const lines: string[] = [
    `Status: ${snapshot.status}`,
    `Source of truth: ${snapshot.sourceOfTruth}`,
    `Primary surface: ${snapshot.primaryDisplaySurface}`,
    `Fallback: ${snapshot.fallbackDisplaySurface}`,
    "Review-only — no Discord send / no queue write",
    "productionReady: false | execution: disabled"
  ];

  for (const card of snapshot.cards.slice(0, 4)) {
    lines.push(`${card.label}: ${card.status}`);
  }

  return lines;
}

function applyMaxLines(lines: string[], maxLines: number): string[] {
  if (maxLines <= 0) return [];
  return lines.slice(0, maxLines);
}

function buildActionLine(status: DiscordOperatorBriefStatus, snapshot: HumanGateStatusSnapshot): string {
  if (status === "BLOCKED") {
    return "Action: resolve BLOCKED items before any Human GO request.";
  }
  if (status === "REVIEW_READY_CANDIDATE") {
    return snapshot.nextHumanActionLabel;
  }
  return "Action: complete missing requirements; remain on HOLD.";
}

export function createDiscordOperatorBrief(input: DiscordOperatorBriefInput): DiscordOperatorBrief {
  const snapshot = input.snapshot;
  const status = mapSnapshotStatusToBriefStatus(snapshot.status);
  const maxLines = input.maxLines ?? DEFAULT_MAX_LINES;
  const lines = applyMaxLines(buildCandidateLines(snapshot), maxLines);

  return {
    surface: "discord-operator-brief",
    briefOnly: true,
    draftOnly: true,
    status,
    title: input.title ?? "Discord Operator Brief (draft-only)",
    headline: buildHeadline(status),
    shortSummary: buildShortSummary(snapshot),
    lines,
    actionLine: buildActionLine(status, snapshot),
    footerNotice: FOOTER_NOTICE,
    source: {
      snapshotStatus: snapshot.status,
      sourceOfTruth: snapshot.sourceOfTruth,
      primaryDisplaySurface: snapshot.primaryDisplaySurface,
      fallbackDisplaySurface: snapshot.fallbackDisplaySurface
    },
    safety: { ...SAFETY_BLOCK }
  };
}

export function renderDiscordOperatorBriefPreview(brief: DiscordOperatorBrief): string {
  return [
    "<!-- review-only / draft-only / no Discord send / no queue mutation -->",
    `**${brief.title}**`,
    brief.headline,
    "",
    brief.shortSummary,
    "",
    ...brief.lines.map((line) => `- ${line}`),
    "",
    `**Action:** ${brief.actionLine}`,
    "",
    brief.footerNotice,
    "",
    "REVIEW_READY_CANDIDATE is not send, queue mutation, or runtime approval."
  ].join("\n");
}

export function createDiscordOperatorBriefPreview(input: DiscordOperatorBriefInput): string {
  return renderDiscordOperatorBriefPreview(createDiscordOperatorBrief(input));
}
