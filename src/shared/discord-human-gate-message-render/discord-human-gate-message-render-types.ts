import type { HumanGateQueueDisplayTargetStatus } from "../human-gate-queue-display-target/human-gate-queue-display-target-types";

export type DiscordHumanGateMessageStatusTone = "preview" | "review" | "hold" | "rejected";

export type DiscordHumanGateMessageSection = {
  heading: string;
  lines: string[];
};

export type DiscordHumanGateMessageDraftSafety = {
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

export type DiscordHumanGateMessageDraft = {
  surface: "discord-human-gate-message";
  draftOnly: true;
  sendReady: false;
  externalWrite: false;
  webhookRequired: false;
  botRequired: false;
  tokenRequired: false;
  title: string;
  statusLabel: string;
  statusTone: DiscordHumanGateMessageStatusTone;
  contentPreview: string;
  sections: DiscordHumanGateMessageSection[];
  safetyChips: string[];
  requiredHumanGateLabels: string[];
  recommendedHumanActionLabel: string;
  footerNotice: string;
  source: {
    goalId: string;
    taskId: string;
    gateId: string;
    sourceStatus: HumanGateQueueDisplayTargetStatus;
  };
  safety: DiscordHumanGateMessageDraftSafety;
};
