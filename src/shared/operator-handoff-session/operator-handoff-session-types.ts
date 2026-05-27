import type { DiscordReviewPacketAssemblyResult } from "../discord-review-packet-assembly/discord-review-packet-assembly-types";

export type OperatorHandoffSessionStatus = "READY_FOR_HUMAN_REVIEW" | "HOLD" | "BLOCKED";

export type OperatorHandoffGoalResultStatus = "PASS" | "PASS_WITH_CAVEAT" | "HOLD" | "STOP";

export type OperatorDecisionChoice = "APPROVE_NEXT_GOAL" | "REQUEST_REVISION" | "REJECT" | "HOLD";

export type OperatorHandoffSessionSection = {
  heading: string;
  lines: string[];
};

export type OperatorHandoffDecisionChoiceRow = {
  choice: OperatorDecisionChoice;
  label: string;
  requiresExplicitHumanGo: boolean;
};

export type OperatorHandoffSessionSafety = {
  sessionOnly: true;
  handoffOnly: true;
  reviewOnly: true;
  draftOnly: true;
  displayOnly: true;
  sendReady: false;
  maySendNow: false;
  actualDiscordSend: false;
  executorImplemented: false;
  webhookUsed: false;
  botStarted: false;
  tokenRead: false;
  networkCall: false;
  externalWrite: false;
  runtimeStarted: false;
  actualQueueMutation: false;
  fileWriteReady: false;
  humanGateQueueDocModified: false;
  productionReady: false;
  execution: "disabled";
  rawValuesReported: false;
  redacted: true;
};

export type OperatorHandoffSessionInput = {
  surface: "operator-handoff-session-input";
  assembly: DiscordReviewPacketAssemblyResult;
  sessionId?: string;
  goalName: string;
  goalResultStatus: OperatorHandoffGoalResultStatus;
  originMainAfter?: string;
  localCommitsAhead?: string[];
  pushedCommits?: string[];
  nextRecommendedGoal?: string;
  humanQuestion?: string;
  redacted: true;
};

export type OperatorHandoffSession = {
  surface: "operator-handoff-session";
  sessionOnly: true;
  handoffOnly: true;
  reviewOnly: true;
  draftOnly: true;
  status: OperatorHandoffSessionStatus;
  sessionId: string;
  title: string;
  summary: string;
  goalName: string;
  goalResultStatus: string;
  reviewPacketPreview: string;
  sections: OperatorHandoffSessionSection[];
  source: {
    assemblyStatus: string;
    reviewPacketStatus: string;
    originMainAfter?: string;
    localCommitsAhead: string[];
    pushedCommits: string[];
  };
  decisionChoices: OperatorHandoffDecisionChoiceRow[];
  nextRecommendedGoal?: string;
  humanQuestion?: string;
  safety: OperatorHandoffSessionSafety;
};
