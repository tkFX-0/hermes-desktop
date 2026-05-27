import type { DiscordReviewPacketAssemblyResult } from "../discord-review-packet-assembly/discord-review-packet-assembly-types";
import type { HumanGateReport } from "../human-gate-report/human-gate-report-types";
import type { HumanGateReportStatusSnapshotAdapterResult } from "../human-gate-report-status-snapshot-adapter/human-gate-report-status-snapshot-adapter-types";
import type { OperatorHandoffSession } from "../operator-handoff-session/operator-handoff-session-types";
import type { OperatorHandoffGoalResultStatus } from "../operator-handoff-session/operator-handoff-session-types";
import type { DiscordSendPreflightResult } from "../discord-send-preflight/discord-send-preflight-types";

export type OperatorHandoffAssemblyStatus = "READY_FOR_HUMAN_REVIEW" | "HOLD" | "BLOCKED";

export type OperatorHandoffAssemblySafety = {
  assemblyOnly: true;
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

export type OperatorHandoffAssemblyInput = {
  surface: "operator-handoff-assembly-input";
  humanGateReport: HumanGateReport;
  sendPreflightResult: DiscordSendPreflightResult;
  goalName: string;
  goalResultStatus: OperatorHandoffGoalResultStatus;
  sessionId?: string;
  packetId?: string;
  humanGoReference?: string;
  originMainAfter?: string;
  localCommitsAhead?: string[];
  pushedCommits?: string[];
  nextRecommendedGoal?: string;
  humanQuestion?: string;
  redacted: true;
};

export type OperatorHandoffAssemblyResult = {
  surface: "operator-handoff-assembly-result";
  assemblyOnly: true;
  handoffOnly: true;
  reviewOnly: true;
  draftOnly: true;
  status: OperatorHandoffAssemblyStatus;
  snapshotAdapterResult: HumanGateReportStatusSnapshotAdapterResult;
  discordReviewPacketAssembly: DiscordReviewPacketAssemblyResult;
  operatorHandoffSession: OperatorHandoffSession;
  preview: string;
  source: {
    humanGateReportStatus: string;
    snapshotStatus: string;
    reviewPacketStatus: string;
    handoffSessionStatus: string;
    goalName: string;
    goalResultStatus: string;
    humanGoReference?: string;
  };
  caveats: string[];
  safety: OperatorHandoffAssemblySafety;
};
