import type { ShikishimaAgentId, ReasoningLevelLabel } from "./model-assignment-registry";
import type { ProfilePolicy } from "./profile-policy";
import { createDryRunLedgerEntry, type LedgerDraftInput } from "./operation-ledger";
import { prepareDiscordReplyDraft, type DiscordReplyDraft } from "./discord-reply-policy";
import { prepareStackchanSpeechDraft, type StackchanSpeechDraft } from "./stackchan-speech-policy";

export interface ChannelOutputInput {
  responseId: string;
  agentId: ShikishimaAgentId;
  modelId: string;
  fullResponse: string;
  spokenResponse?: string;
  reasoningLevel: ReasoningLevelLabel;
  profilePolicy?: ProfilePolicy;
  evidenceFile: string;
}

export interface ChannelOutputBundle {
  ui: {
    responseId: string;
    agentId: ShikishimaAgentId;
    fullResponse: string;
    reasoningLevel: ReasoningLevelLabel;
  };
  discord: DiscordReplyDraft;
  stackchan: StackchanSpeechDraft;
  ledgers: {
    discordDraft: ReturnType<typeof createDryRunLedgerEntry>;
    stackchanDraft: ReturnType<typeof createDryRunLedgerEntry>;
  };
  execution: "disabled";
  productionReady: false;
  rawValuesReported: false;
}

function ledgerBase(input: ChannelOutputInput): Pick<
  LedgerDraftInput,
  "source" | "agentId" | "modelId" | "inputSummary" | "evidenceFile"
> {
  return {
    source: "renderer",
    agentId: input.agentId,
    modelId: input.modelId,
    inputSummary: "channel output draft",
    evidenceFile: input.evidenceFile,
  };
}

export function prepareChannelOutputBundle(input: ChannelOutputInput): ChannelOutputBundle {
  const discord = prepareDiscordReplyDraft({
    responseId: input.responseId,
    agentId: input.agentId,
    fullResponse: input.fullResponse,
    reasoningLevel: input.reasoningLevel,
    profilePolicy: input.profilePolicy,
    actionId: "DISCORD-REPLY-DRAFT",
    evidencePath: input.evidenceFile,
  });

  const stackchan = prepareStackchanSpeechDraft({
    responseId: input.responseId,
    agentId: input.agentId,
    fullResponse: input.fullResponse,
    requestedSpokenResponse: input.spokenResponse,
    reasoningLevel: input.reasoningLevel,
    profilePolicy: input.profilePolicy,
    actionId: "STACKCHAN-SPEECH-DRAFT",
    evidencePath: input.evidenceFile,
  });

  const base = ledgerBase(input);
  return {
    ui: {
      responseId: input.responseId,
      agentId: input.agentId,
      fullResponse: discord.response.fullResponse,
      reasoningLevel: input.reasoningLevel,
    },
    discord,
    stackchan,
    ledgers: {
      discordDraft: createDryRunLedgerEntry({
        ...base,
        operationId: `${input.responseId}:discord-draft`,
        gateId: "DISCORD-REPLY-DRAFT",
        actionKind: "discord_write",
        outputSummary: "discord reply draft prepared; not sent",
        externalWrite: false,
      }),
      stackchanDraft: createDryRunLedgerEntry({
        ...base,
        operationId: `${input.responseId}:stackchan-draft`,
        gateId: "STACKCHAN-SPEECH-DRAFT",
        actionKind: "stackchan_say",
        outputSummary: "stackchan speech draft prepared; not spoken",
        deviceAction: false,
      }),
    },
    execution: "disabled",
    productionReady: false,
    rawValuesReported: false,
  };
}
