import type { DiscordHumanGateMessageStatusTone } from "../discord-human-gate-message-render/discord-human-gate-message-render-types";

export type DiscordHumanGateDigestHighlight = {
  goalId: string;
  taskId: string;
  gateId: string;
  title: string;
  statusTone: DiscordHumanGateMessageStatusTone;
  statusLabel: string;
};

export type DiscordHumanGateDigestCountsByStatusTone = Record<
  DiscordHumanGateMessageStatusTone,
  number
>;

export type DiscordHumanGateDigestDraftSafety = {
  displayOnly: true;
  canApprovePush: false;
  canApproveRuntime: false;
  canApproveExternalWrite: false;
  actualQueueMutation: false;
  uiConnected: false;
  ipcConnected: false;
  runtimeStarted: false;
  networkExposed: false;
  externalWrite: false;
  discordSend: false;
  webhookUsed: false;
  botStarted: false;
  tokenRead: false;
  productionReady: false;
  execution: "disabled";
  rawValuesReported: false;
  redacted: true;
};

export type DiscordHumanGateDigestDraft = {
  surface: "discord-human-gate-digest";
  draftOnly: true;
  sendReady: false;
  externalWrite: false;
  webhookRequired: false;
  botRequired: false;
  tokenRequired: false;
  title: string;
  contentPreview: string;
  itemCount: number;
  countsByStatusTone: DiscordHumanGateDigestCountsByStatusTone;
  highlights: DiscordHumanGateDigestHighlight[];
  safetyChips: string[];
  nextHumanActionLabel: string;
  footerNotice: string;
  safety: DiscordHumanGateDigestDraftSafety;
};
