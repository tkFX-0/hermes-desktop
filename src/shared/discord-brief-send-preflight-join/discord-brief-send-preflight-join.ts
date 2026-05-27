import { renderDiscordOperatorBriefPreview } from "../discord-operator-brief/discord-operator-brief";
import type { DiscordOperatorBrief } from "../discord-operator-brief/discord-operator-brief-types";
import type { DiscordSendPreflightResult } from "../discord-send-preflight/discord-send-preflight-types";
import type {
  DiscordBriefSendPreflightJoin,
  DiscordBriefSendPreflightJoinInput,
  DiscordBriefSendPreflightJoinReviewRow,
  DiscordBriefSendPreflightJoinRowStatus,
  DiscordBriefSendPreflightJoinSafety,
  DiscordBriefSendPreflightJoinStatus
} from "./discord-brief-send-preflight-join-types";

const FOOTER_NOTICE =
  "Review-only join. No Discord send. No webhook. No bot. No token read. Human GO required before any send.";

const SAFETY_BLOCK: DiscordBriefSendPreflightJoinSafety = {
  joinOnly: true,
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
  productionReady: false,
  execution: "disabled",
  rawValuesReported: false,
  redacted: true
};

function mapPreflightStatus(status: DiscordSendPreflightResult["status"]): DiscordBriefSendPreflightJoinRowStatus {
  return status;
}

function resolveJoinStatus(
  briefStatus: DiscordOperatorBrief["status"],
  preflightStatus: DiscordSendPreflightResult["status"]
): DiscordBriefSendPreflightJoinStatus {
  if (briefStatus === "BLOCKED" || preflightStatus === "BLOCKED") {
    return "BLOCKED";
  }
  if (briefStatus === "REVIEW_READY_CANDIDATE" && preflightStatus === "READY_CANDIDATE") {
    return "REVIEW_READY_CANDIDATE";
  }
  return "HOLD";
}

function buildHeadline(status: DiscordBriefSendPreflightJoinStatus): string {
  if (status === "BLOCKED") return "Discord send review: BLOCKED";
  if (status === "REVIEW_READY_CANDIDATE") return "Discord send review: ready for human review (not approved)";
  return "Discord send review: HOLD";
}

function buildSendPreflightSummary(result: DiscordSendPreflightResult): string {
  const parts = [`preflight: ${result.status}`, ...result.reasons];
  if (result.missingRequirements.length > 0) {
    parts.push(...result.missingRequirements.map((item) => `missing: ${item}`));
  }
  return parts.join(" | ");
}

function buildReviewRows(
  brief: DiscordOperatorBrief,
  preflight: DiscordSendPreflightResult
): DiscordBriefSendPreflightJoinReviewRow[] {
  const preflightReasons = [...preflight.reasons];
  if (preflight.missingRequirements.length > 0) {
    preflightReasons.push(...preflight.missingRequirements.map((item) => `missing: ${item}`));
  }

  return [
    {
      label: "Operator brief",
      status:
        brief.status === "REVIEW_READY_CANDIDATE"
          ? "READY_CANDIDATE"
          : brief.status === "BLOCKED"
            ? "BLOCKED"
            : "HOLD",
      mayProceedNow: false,
      reasons: [brief.headline, brief.shortSummary]
    },
    {
      label: "Discord send preflight",
      status: mapPreflightStatus(preflight.status),
      mayProceedNow: false,
      reasons: preflightReasons
    }
  ];
}

function buildNextHumanActionLabel(status: DiscordBriefSendPreflightJoinStatus, brief: DiscordOperatorBrief): string {
  if (status === "BLOCKED") {
    return "Do not request Discord send; resolve BLOCKED brief or preflight items.";
  }
  if (status === "REVIEW_READY_CANDIDATE") {
    return `${brief.actionLine} Separate explicit Discord Send GO still required — join does not approve send.`;
  }
  return "Complete missing send preflight requirements; remain on HOLD.";
}

export function createDiscordBriefSendPreflightJoin(
  input: DiscordBriefSendPreflightJoinInput
): DiscordBriefSendPreflightJoin {
  const brief = input.operatorBrief;
  const preflight = input.sendPreflightResult;
  const status = resolveJoinStatus(brief.status, preflight.status);
  const briefPreview = renderDiscordOperatorBriefPreview(brief);

  return {
    surface: "discord-brief-send-preflight-join",
    joinOnly: true,
    reviewOnly: true,
    draftOnly: true,
    status,
    title: "Discord Brief + Send Preflight Join (review-only)",
    headline: buildHeadline(status),
    briefPreview,
    sendPreflightSummary: buildSendPreflightSummary(preflight),
    reviewRows: buildReviewRows(brief, preflight),
    nextHumanActionLabel: buildNextHumanActionLabel(status, brief),
    footerNotice: FOOTER_NOTICE,
    source: {
      briefStatus: brief.status,
      sendPreflightStatus: preflight.status,
      humanGoReference: input.humanGoReference
    },
    safety: { ...SAFETY_BLOCK }
  };
}

export function renderDiscordBriefSendPreflightJoinPreview(
  joined: DiscordBriefSendPreflightJoin
): string {
  const rowLines = joined.reviewRows.map(
    (row) =>
      `- ${row.label}: ${row.status} (mayProceedNow: false)${
        row.reasons.length > 0 ? `\n  - ${row.reasons.join("\n  - ")}` : ""
      }`
  );

  return [
    "<!-- review-only / join-only / no Discord send / no webhook / no bot / no token -->",
    `**${joined.title}**`,
    joined.headline,
    `Join status: ${joined.status}`,
    "",
    "**Operator brief (preview):**",
    joined.briefPreview,
    "",
    `**Send preflight summary:** ${joined.sendPreflightSummary}`,
    "",
    "**Review rows:**",
    ...rowLines,
    "",
    `**Next human action:** ${joined.nextHumanActionLabel}`,
    "",
    joined.footerNotice,
    "",
    "REVIEW_READY_CANDIDATE is not Discord send approval."
  ].join("\n");
}

export function createDiscordBriefSendPreflightJoinPreview(
  input: DiscordBriefSendPreflightJoinInput
): string {
  return renderDiscordBriefSendPreflightJoinPreview(createDiscordBriefSendPreflightJoin(input));
}
