import type { DiscordHumanGateMessageDraft } from "../discord-human-gate-message-render/discord-human-gate-message-render-types";
import type {
  DiscordHumanGateDigestCountsByStatusTone,
  DiscordHumanGateDigestDraft,
  DiscordHumanGateDigestDraftSafety,
  DiscordHumanGateDigestHighlight
} from "./discord-human-gate-digest-render-types";

const FOOTER_NOTICE =
  "Review-only Discord digest draft. No Discord send performed. Human GO required before any post or external write.";

const SAFETY_BLOCK: DiscordHumanGateDigestDraftSafety = {
  displayOnly: true,
  canApprovePush: false,
  canApproveRuntime: false,
  canApproveExternalWrite: false,
  actualQueueMutation: false,
  uiConnected: false,
  ipcConnected: false,
  runtimeStarted: false,
  networkExposed: false,
  externalWrite: false,
  discordSend: false,
  webhookUsed: false,
  botStarted: false,
  tokenRead: false,
  productionReady: false,
  execution: "disabled",
  rawValuesReported: false,
  redacted: true
};

function emptyCounts(): DiscordHumanGateDigestCountsByStatusTone {
  return {
    preview: 0,
    review: 0,
    hold: 0,
    rejected: 0
  };
}

function buildSafetyChips(): string[] {
  return [
    "review-only",
    "digest-draft-only",
    "no-discord-send",
    "execution-disabled",
    "HOLD",
    "human-go-required"
  ];
}

function buildNextHumanActionLabel(itemCount: number): string {
  if (itemCount === 0) {
    return "No pending Human Gate drafts; continue with explicit human GO only when new work appears.";
  }
  return "Review each Human Gate draft individually; issue explicit human GO per gate — no automated approval.";
}

function buildContentPreview(
  itemCount: number,
  counts: DiscordHumanGateDigestCountsByStatusTone,
  highlights: DiscordHumanGateDigestHighlight[]
): string {
  const countLines = [
    `preview: ${counts.preview}`,
    `review: ${counts.review}`,
    `hold: ${counts.hold}`,
    `rejected: ${counts.rejected}`
  ];

  const highlightLines =
    highlights.length > 0
      ? highlights.map(
          (item) =>
            `- ${item.title} (${item.statusLabel}; ${item.goalId}/${item.taskId})`
        )
      : ["- (no items)"];

  return [
    "**Human Gate Digest (draft only — not sent)**",
    "",
    `Items: ${itemCount}`,
    "",
    "**Counts by status tone:**",
    ...countLines.map((line) => `- ${line}`),
    "",
    "**Highlights:**",
    ...highlightLines,
    "",
    "Safety: review-only | no Discord send performed | execution disabled"
  ].join("\n");
}

export function createDiscordHumanGateDigestDraft(
  drafts: DiscordHumanGateMessageDraft[]
): DiscordHumanGateDigestDraft {
  const counts = emptyCounts();

  for (const draft of drafts) {
    counts[draft.statusTone] += 1;
  }

  const highlights: DiscordHumanGateDigestHighlight[] = drafts.map((draft) => ({
    goalId: draft.source.goalId,
    taskId: draft.source.taskId,
    gateId: draft.source.gateId,
    title: draft.title,
    statusTone: draft.statusTone,
    statusLabel: draft.statusLabel
  }));

  const itemCount = drafts.length;
  const contentPreview = buildContentPreview(itemCount, counts, highlights);

  return {
    surface: "discord-human-gate-digest",
    draftOnly: true,
    sendReady: false,
    externalWrite: false,
    webhookRequired: false,
    botRequired: false,
    tokenRequired: false,
    title: "Human Gate Digest (review-only)",
    contentPreview,
    itemCount,
    countsByStatusTone: counts,
    highlights,
    safetyChips: buildSafetyChips(),
    nextHumanActionLabel: buildNextHumanActionLabel(itemCount),
    footerNotice: FOOTER_NOTICE,
    safety: { ...SAFETY_BLOCK }
  };
}

export function renderDiscordHumanGateDigestPreview(
  digest: DiscordHumanGateDigestDraft
): string {
  return [
    "<!-- review-only / digest draft-only / no Discord send -->",
    `**${digest.title}**`,
    "",
    digest.contentPreview,
    "",
    `**Next human action:** ${digest.nextHumanActionLabel}`,
    "",
    `**Safety chips:** ${digest.safetyChips.join(" | ")}`,
    "",
    digest.footerNotice,
    "",
    "draftOnly: true | sendReady: false | discordSend: false | webhookUsed: false | botStarted: false | tokenRead: false"
  ].join("\n");
}
