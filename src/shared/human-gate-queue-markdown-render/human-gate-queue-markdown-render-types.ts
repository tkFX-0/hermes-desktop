import type { HumanGateQueueDisplayTargetStatus } from "../human-gate-queue-display-target/human-gate-queue-display-target-types";

export type HumanGateQueueMarkdownRenderStatusTone = "preview" | "review" | "hold" | "rejected";

export type HumanGateQueueMarkdownSection = {
  heading: string;
  lines: string[];
};

export type HumanGateQueueMarkdownRenderSafety = {
  displayOnly: true;
  canApprovePush: false;
  canApproveRuntime: false;
  canApproveExternalWrite: false;
  actualQueueMutation: false;
  fileWritePerformed: false;
  humanGateQueueDocModified: false;
  discordSend: false;
  webhookUsed: false;
  botStarted: false;
  tokenRead: false;
  obsidianActualWrite: false;
  runtimeStarted: false;
  networkCall: false;
  externalWrite: false;
  productionReady: false;
  execution: "disabled";
  rawValuesReported: false;
  redacted: true;
};

export type HumanGateQueueMarkdownRenderModel = {
  surface: "human-gate-queue-markdown";
  previewOnly: true;
  fileWriteReady: false;
  actualQueueMutation: false;
  targetDocument: "docs/shikishima/HUMAN_GATE_QUEUE.md";
  title: string;
  statusLabel: string;
  statusTone: HumanGateQueueMarkdownRenderStatusTone;
  markdownSections: HumanGateQueueMarkdownSection[];
  source: {
    goalId: string;
    taskId: string;
    gateId: string;
    sourceStatus: HumanGateQueueDisplayTargetStatus;
  };
  safety: HumanGateQueueMarkdownRenderSafety;
};
