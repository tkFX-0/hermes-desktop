import type { DiscordBriefSendPreflightJoin } from "../discord-brief-send-preflight-join/discord-brief-send-preflight-join-types";
import type {
  DiscordReviewPacket,
  DiscordReviewPacketInput,
  DiscordReviewPacketReviewRow,
  DiscordReviewPacketSafety,
  DiscordReviewPacketSection,
  DiscordReviewPacketStatus
} from "./discord-review-packet-types";

const FOOTER_NOTICE =
  "Packet-only review bundle. No Discord send. No webhook. No bot. No token read. Human GO required before any external effect.";

const SAFETY_BLOCK: DiscordReviewPacketSafety = {
  packetOnly: true,
  reviewOnly: true,
  draftOnly: true,
  displayOnly: true,
  sendReady: false,
  maySendNow: false,
  actualDiscordSend: false,
  webhookUsed: false,
  botStarted: false,
  tokenRead: false,
  networkCall: false,
  externalWrite: false,
  runtimeStarted: false,
  actualQueueMutation: false,
  fileWriteReady: false,
  humanGateQueueDocModified: false,
  productionReady: false,
  execution: "disabled",
  rawValuesReported: false,
  redacted: true
};

function mapJoinedStatusToPacketStatus(
  joinedStatus: DiscordBriefSendPreflightJoin["status"]
): DiscordReviewPacketStatus {
  if (joinedStatus === "BLOCKED") return "BLOCKED";
  if (joinedStatus === "REVIEW_READY_CANDIDATE") return "REVIEW_READY_CANDIDATE";
  return "HOLD";
}

function buildPacketId(joined: DiscordBriefSendPreflightJoin, provided?: string): string {
  if (provided?.trim()) {
    return provided.trim();
  }
  const slug = joined.headline.replace(/\s+/g, "-").toLowerCase();
  return [
    "discord-review-packet",
    joined.status,
    joined.source.briefStatus,
    joined.source.sendPreflightStatus,
    slug
  ].join(":");
}

function buildHeadline(status: DiscordReviewPacketStatus): string {
  if (status === "BLOCKED") return "Discord review packet: BLOCKED";
  if (status === "REVIEW_READY_CANDIDATE") {
    return "Discord review packet: ready for human review (not send approved)";
  }
  return "Discord review packet: HOLD";
}

function buildReviewRows(joined: DiscordBriefSendPreflightJoin): DiscordReviewPacketReviewRow[] {
  return joined.reviewRows.map((row) => ({
    label: row.label,
    status: row.status,
    mayProceedNow: false,
    reasons: [...row.reasons]
  }));
}

function buildSections(joined: DiscordBriefSendPreflightJoin): DiscordReviewPacketSection[] {
  return [
    {
      heading: "Operator brief",
      lines: [joined.headline, "See operatorBriefPreview for full brief text."]
    },
    {
      heading: "Send preflight",
      lines: [joined.sendPreflightSummary]
    },
    {
      heading: "Safety boundary",
      lines: [
        "review-only | packet-only | draft-only",
        "no Discord send | no webhook | no bot | no token read",
        "no queue mutation | no file write",
        "productionReady: false | execution: disabled"
      ]
    },
    {
      heading: "Next human action",
      lines: [joined.nextHumanActionLabel]
    }
  ];
}

function buildBodyPreview(
  joined: DiscordBriefSendPreflightJoin,
  operatorBriefPreview: string,
  sendPreflightPreview: string
): string {
  return [
    joined.headline,
    "",
    "**Operator brief**",
    operatorBriefPreview,
    "",
    "**Send preflight**",
    sendPreflightPreview,
    "",
    joined.footerNotice
  ].join("\n");
}

export function createDiscordReviewPacket(input: DiscordReviewPacketInput): DiscordReviewPacket {
  const joined = input.joinedReview;
  const status = mapJoinedStatusToPacketStatus(joined.status);
  const packetId = buildPacketId(joined, input.packetId);
  const operatorBriefPreview = joined.briefPreview;
  const sendPreflightPreview = joined.sendPreflightSummary;
  const humanGoReference = input.humanGoReference ?? joined.source.humanGoReference;

  return {
    surface: "discord-review-packet",
    packetOnly: true,
    reviewOnly: true,
    draftOnly: true,
    status,
    packetId,
    title: input.title ?? "Discord Review Packet (packet-only)",
    headline: buildHeadline(status),
    bodyPreview: buildBodyPreview(joined, operatorBriefPreview, sendPreflightPreview),
    operatorBriefPreview,
    sendPreflightPreview,
    sections: buildSections(joined),
    reviewRows: buildReviewRows(joined),
    nextHumanActionLabel: joined.nextHumanActionLabel,
    footerNotice: FOOTER_NOTICE,
    source: {
      joinedReviewStatus: joined.status,
      humanGoReference
    },
    safety: { ...SAFETY_BLOCK }
  };
}

export function renderDiscordReviewPacketPreview(packet: DiscordReviewPacket): string {
  const sectionBlocks = packet.sections.map((section) => {
    const lines = section.lines.map((line) => `- ${line}`).join("\n");
    return `### ${section.heading}\n${lines}`;
  });

  const rowLines = packet.reviewRows.map(
    (row) =>
      `- ${row.label}: ${row.status} (mayProceedNow: false)${
        row.reasons.length > 0 ? `\n  - ${row.reasons.join("\n  - ")}` : ""
      }`
  );

  return [
    "<!-- review-only / packet-only / draft-only / no Discord send -->",
    `**${packet.title}**`,
    `Packet ID: ${packet.packetId}`,
    packet.headline,
    `Status: ${packet.status}`,
    "",
    packet.bodyPreview,
    "",
    "**Review rows:**",
    ...rowLines,
    "",
    ...sectionBlocks,
    "",
    `**Next human action:** ${packet.nextHumanActionLabel}`,
    "",
    packet.footerNotice,
    "",
    "REVIEW_READY_CANDIDATE is not Discord send approval."
  ].join("\n");
}

export function createDiscordReviewPacketPreview(input: DiscordReviewPacketInput): string {
  return renderDiscordReviewPacketPreview(createDiscordReviewPacket(input));
}
