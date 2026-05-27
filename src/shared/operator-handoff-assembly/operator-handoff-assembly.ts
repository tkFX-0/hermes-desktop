import { createDiscordReviewPacketAssembly } from "../discord-review-packet-assembly/discord-review-packet-assembly";
import { createHumanGateStatusSnapshotFromHumanGateReport } from "../human-gate-report-status-snapshot-adapter/human-gate-report-status-snapshot-adapter";
import {
  createOperatorHandoffSession,
  renderOperatorHandoffSessionPreview
} from "../operator-handoff-session/operator-handoff-session";
import type { OperatorHandoffSessionStatus } from "../operator-handoff-session/operator-handoff-session-types";
import type {
  OperatorHandoffAssemblyInput,
  OperatorHandoffAssemblyResult,
  OperatorHandoffAssemblySafety,
  OperatorHandoffAssemblyStatus
} from "./operator-handoff-assembly-types";

const SAFETY_BLOCK: OperatorHandoffAssemblySafety = {
  assemblyOnly: true,
  handoffOnly: true,
  reviewOnly: true,
  draftOnly: true,
  displayOnly: true,
  sendReady: false,
  maySendNow: false,
  actualDiscordSend: false,
  executorImplemented: false,
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

function mapSessionStatusToAssemblyStatus(
  sessionStatus: OperatorHandoffSessionStatus
): OperatorHandoffAssemblyStatus {
  if (sessionStatus === "BLOCKED") return "BLOCKED";
  if (sessionStatus === "READY_FOR_HUMAN_REVIEW") return "READY_FOR_HUMAN_REVIEW";
  return "HOLD";
}

function mergeCaveats(
  snapshotCaveats: string[],
  assemblyCaveats: string[]
): string[] {
  const merged: string[] = [];
  for (const item of [...snapshotCaveats, ...assemblyCaveats]) {
    if (!merged.includes(item)) {
      merged.push(item);
    }
  }
  return merged;
}

export function createOperatorHandoffAssembly(
  input: OperatorHandoffAssemblyInput
): OperatorHandoffAssemblyResult {
  const humanGoReference = input.humanGoReference;

  const snapshotAdapterResult = createHumanGateStatusSnapshotFromHumanGateReport({
    surface: "human-gate-report-status-snapshot-adapter-input",
    humanGateReport: input.humanGateReport,
    humanGoReference,
    redacted: true
  });

  const discordReviewPacketAssembly = createDiscordReviewPacketAssembly({
    surface: "discord-review-packet-assembly-input",
    snapshot: snapshotAdapterResult.snapshot,
    sendPreflightResult: input.sendPreflightResult,
    packetId: input.packetId,
    humanGoReference,
    redacted: true
  });

  const operatorHandoffSession = createOperatorHandoffSession({
    surface: "operator-handoff-session-input",
    assembly: discordReviewPacketAssembly,
    sessionId: input.sessionId,
    goalName: input.goalName,
    goalResultStatus: input.goalResultStatus,
    originMainAfter: input.originMainAfter,
    localCommitsAhead: input.localCommitsAhead,
    pushedCommits: input.pushedCommits,
    nextRecommendedGoal: input.nextRecommendedGoal,
    humanQuestion: input.humanQuestion,
    redacted: true
  });

  const preview = renderOperatorHandoffSessionPreview(operatorHandoffSession);
  const status = mapSessionStatusToAssemblyStatus(operatorHandoffSession.status);

  const caveats = mergeCaveats(snapshotAdapterResult.caveats, [
    "Operator handoff assembly is review-only; synthesized snapshot digest may apply."
  ]);

  return {
    surface: "operator-handoff-assembly-result",
    assemblyOnly: true,
    handoffOnly: true,
    reviewOnly: true,
    draftOnly: true,
    status,
    snapshotAdapterResult,
    discordReviewPacketAssembly,
    operatorHandoffSession,
    preview,
    source: {
      humanGateReportStatus: input.humanGateReport.status,
      snapshotStatus: snapshotAdapterResult.snapshot.status,
      reviewPacketStatus: discordReviewPacketAssembly.reviewPacket.status,
      handoffSessionStatus: operatorHandoffSession.status,
      goalName: input.goalName,
      goalResultStatus: input.goalResultStatus,
      humanGoReference
    },
    caveats,
    safety: { ...SAFETY_BLOCK }
  };
}

export function createOperatorHandoffAssemblyPreview(
  input: OperatorHandoffAssemblyInput
): string {
  return createOperatorHandoffAssembly(input).preview;
}
