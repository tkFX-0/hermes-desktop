import {
  createResponsePolicy,
  type ResponsePolicyInput,
  type ResponsePolicyResult,
} from "./response-policy";
import { createDiscordSendPreflight, type PreflightResult } from "./preflight-factory";

export interface DiscordReplyDraft {
  response: ResponsePolicyResult;
  preflight: PreflightResult;
  canSendNow: false;
  displayOnly: true;
}

export function prepareDiscordReplyDraft(
  input: ResponsePolicyInput & {
    actionId?: string;
    evidencePath?: string;
  },
): DiscordReplyDraft {
  const response = createResponsePolicy({
    maxSpeechChars: 0,
    ...input,
    requestedSpokenResponse: "",
  });

  const preflight = createDiscordSendPreflight({
    actionId: input.actionId ?? "DISCORD-REPLY",
    actor: input.agentId,
    source: "discord",
    targetSummary: "Discord reply draft",
    evidencePath: input.evidencePath ?? "docs/shikishima/DISCORD_REPLY_EVIDENCE.md",
    allowedRunCount: 1,
  });

  return {
    response,
    preflight,
    canSendNow: false,
    displayOnly: true,
  };
}
