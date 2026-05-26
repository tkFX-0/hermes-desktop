import type { ControlCenterHumanGateDisplayRenderModel } from "../control-center-human-gate-display-render/control-center-human-gate-display-render-types";
import type { HumanGateQueueDisplayTargetItem } from "../human-gate-queue-display-target/human-gate-queue-display-target-types";
import type {
  DiscordHumanGateMessageDraft,
  DiscordHumanGateMessageDraftSafety,
  DiscordHumanGateMessageSection,
  DiscordHumanGateMessageStatusTone
} from "./discord-human-gate-message-render-types";

const FOOTER_NOTICE =
  "Review-only Discord message draft. No Discord send performed. Human GO required before push, runtime, external write, queue mutation, or Discord post.";

const SAFETY_BLOCK: DiscordHumanGateMessageDraftSafety = {
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

function mapStatusTone(
  status: HumanGateQueueDisplayTargetItem["status"]
): DiscordHumanGateMessageStatusTone {
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

function buildSafetyChips(): string[] {
  return [
    "review-only",
    "draft-only",
    "no-discord-send",
    "execution-disabled",
    "HOLD",
    "no-push",
    "no-runtime",
    "no-external-write",
    "human-go-required"
  ];
}

function buildSections(item: HumanGateQueueDisplayTargetItem): DiscordHumanGateMessageSection[] {
  return [
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
    }
  ];
}

function buildRecommendedHumanActionLabel(
  status: HumanGateQueueDisplayTargetItem["status"]
): string {
  if (status === "REJECTED") return "Do not proceed; resolve blockers before requesting GO.";
  if (status === "HOLD") return "Wait for explicit human GO; no automated approval.";
  if (status === "READY_FOR_REVIEW") return "Review gate references and issue explicit human GO.";
  return "Preview only; human GO still required for any effect.";
}

function buildContentPreview(
  item: HumanGateQueueDisplayTargetItem,
  statusLabel: string,
  sections: DiscordHumanGateMessageSection[]
): string {
  const sectionLines = sections.flatMap((section) => [
    `### ${section.heading}`,
    ...section.lines.map((line) => `- ${line}`)
  ]);

  return [
    `**Human Gate Review (draft only — not sent)**`,
    "",
    `**${item.title}**`,
    `Status: ${statusLabel} (${item.status})`,
    `Goal: ${item.goalId} | Task: ${item.taskId} | Gate: ${item.gateId}`,
    "",
    ...sectionLines,
    "",
    "Safety: review-only | no Discord send | execution disabled | HOLD"
  ].join("\n");
}

export function createDiscordHumanGateMessageDraft(
  item: HumanGateQueueDisplayTargetItem
): DiscordHumanGateMessageDraft {
  const statusTone = mapStatusTone(item.status);
  const statusLabel = buildStatusLabel(item.status);
  const sections = buildSections(item);
  const contentPreview = buildContentPreview(item, statusLabel, sections);

  return {
    surface: "discord-human-gate-message",
    draftOnly: true,
    sendReady: false,
    externalWrite: false,
    webhookRequired: false,
    botRequired: false,
    tokenRequired: false,
    title: item.title,
    statusLabel,
    statusTone,
    contentPreview,
    sections,
    safetyChips: buildSafetyChips(),
    requiredHumanGateLabels: [...item.requiredHumanGates],
    recommendedHumanActionLabel: buildRecommendedHumanActionLabel(item.status),
    footerNotice: FOOTER_NOTICE,
    source: {
      goalId: item.goalId,
      taskId: item.taskId,
      gateId: item.gateId,
      sourceStatus: item.status
    },
    safety: { ...SAFETY_BLOCK }
  };
}

export function createDiscordHumanGateMessageDraftFromControlCenterRenderModel(
  model: ControlCenterHumanGateDisplayRenderModel
): DiscordHumanGateMessageDraft {
  const statusTone = model.statusTone;
  const sections: DiscordHumanGateMessageSection[] = model.summaryBlocks.map((block) => ({
    heading: block.label,
    lines: [...block.lines]
  }));

  if (model.reasonRows.length > 0) {
    sections.push({
      heading: "Reasons",
      lines: model.reasonRows.map((row) => row.text)
    });
  }

  const contentPreview = [
    `**Human Gate Review (draft only — not sent)**`,
    "",
    `**${model.title}**`,
    `Status: ${model.statusLabel} (${model.status})`,
    `Goal: ${model.goalId} | Task: ${model.taskId} | Gate: ${model.gateId}`,
    "",
    ...sections.flatMap((section) => [
      `### ${section.heading}`,
      ...section.lines.map((line) => `- ${line}`)
    ]),
    "",
    "Safety: review-only | no Discord send | execution disabled | HOLD"
  ].join("\n");

  return {
    surface: "discord-human-gate-message",
    draftOnly: true,
    sendReady: false,
    externalWrite: false,
    webhookRequired: false,
    botRequired: false,
    tokenRequired: false,
    title: model.title,
    statusLabel: model.statusLabel,
    statusTone,
    contentPreview,
    sections,
    safetyChips: ["review-only", "draft-only", "no-discord-send", ...model.safetyChips],
    requiredHumanGateLabels: [...model.requiredHumanGateLabels],
    recommendedHumanActionLabel: model.recommendedHumanActionLabel,
    footerNotice: FOOTER_NOTICE,
    source: {
      goalId: model.goalId,
      taskId: model.taskId,
      gateId: model.gateId,
      sourceStatus: model.status as HumanGateQueueDisplayTargetItem["status"]
    },
    safety: { ...SAFETY_BLOCK }
  };
}

export function renderDiscordHumanGateMessagePreview(
  draft: DiscordHumanGateMessageDraft
): string {
  const sectionBlocks = draft.sections.map((section) => {
    const lines = section.lines.map((line) => `- ${line}`).join("\n");
    return `### ${section.heading}\n${lines}`;
  });

  return [
    "<!-- review-only / draft-only / no Discord send -->",
    `**${draft.title}**`,
    `Status: ${draft.statusLabel} (tone: ${draft.statusTone})`,
    "",
    draft.contentPreview,
    "",
    ...sectionBlocks,
    "",
    `**Required human gates:**`,
    ...(draft.requiredHumanGateLabels.length > 0
      ? draft.requiredHumanGateLabels.map((gate) => `- ${gate}`)
      : ["- (none listed)"]),
    "",
    `**Recommended action:** ${draft.recommendedHumanActionLabel}`,
    "",
    `**Safety chips:** ${draft.safetyChips.join(" | ")}`,
    "",
    draft.footerNotice,
    "",
    "draftOnly: true | sendReady: false | discordSend: false | webhookUsed: false | botStarted: false | tokenRead: false"
  ].join("\n");
}
