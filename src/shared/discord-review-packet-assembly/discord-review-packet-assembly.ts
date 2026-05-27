import { createDiscordBriefSendPreflightJoin } from "../discord-brief-send-preflight-join/discord-brief-send-preflight-join";
import { createDiscordOperatorBrief } from "../discord-operator-brief/discord-operator-brief";
import {
  createDiscordReviewPacket,
  renderDiscordReviewPacketPreview
} from "../discord-review-packet/discord-review-packet";
import type { DiscordReviewPacketStatus } from "../discord-review-packet/discord-review-packet-types";
import type {
  DiscordReviewPacketAssemblyInput,
  DiscordReviewPacketAssemblyResult,
  DiscordReviewPacketAssemblySafety,
  DiscordReviewPacketAssemblyStatus
} from "./discord-review-packet-assembly-types";

const SAFETY_BLOCK: DiscordReviewPacketAssemblySafety = {
  assemblyOnly: true,
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

function mapPacketStatusToAssemblyStatus(
  packetStatus: DiscordReviewPacketStatus
): DiscordReviewPacketAssemblyStatus {
  if (packetStatus === "BLOCKED") return "BLOCKED";
  if (packetStatus === "REVIEW_READY_CANDIDATE") return "REVIEW_READY_CANDIDATE";
  return "HOLD";
}

export function createDiscordReviewPacketAssembly(
  input: DiscordReviewPacketAssemblyInput
): DiscordReviewPacketAssemblyResult {
  const humanGoReference = input.humanGoReference ?? input.snapshot.source.humanGoReference;

  const operatorBrief = createDiscordOperatorBrief({
    surface: "discord-operator-brief-input",
    snapshot: input.snapshot,
    redacted: true
  });

  const joinedReview = createDiscordBriefSendPreflightJoin({
    surface: "discord-brief-send-preflight-join-input",
    operatorBrief,
    sendPreflightResult: input.sendPreflightResult,
    humanGoReference,
    redacted: true
  });

  const reviewPacket = createDiscordReviewPacket({
    surface: "discord-review-packet-input",
    joinedReview,
    packetId: input.packetId,
    humanGoReference,
    redacted: true
  });

  const preview = renderDiscordReviewPacketPreview(reviewPacket);
  const status = mapPacketStatusToAssemblyStatus(reviewPacket.status);

  return {
    surface: "discord-review-packet-assembly-result",
    assemblyOnly: true,
    reviewOnly: true,
    draftOnly: true,
    status,
    operatorBrief,
    joinedReview,
    reviewPacket,
    preview,
    source: {
      snapshotStatus: input.snapshot.status,
      sendPreflightStatus: input.sendPreflightResult.status,
      packetId: reviewPacket.packetId,
      humanGoReference
    },
    safety: { ...SAFETY_BLOCK }
  };
}

export function createDiscordReviewPacketAssemblyPreview(
  input: DiscordReviewPacketAssemblyInput
): string {
  return createDiscordReviewPacketAssembly(input).preview;
}
