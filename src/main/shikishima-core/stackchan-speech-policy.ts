import {
  createResponsePolicy,
  type ResponsePolicyInput,
  type ResponsePolicyResult,
} from "./response-policy";
import { createStackchanSpeechPreflight, type PreflightResult } from "./preflight-factory";

export interface StackchanSpeechDraft {
  response: ResponsePolicyResult;
  preflight: PreflightResult;
  canExecuteNow: false;
  displayOnly: true;
}

export function prepareStackchanSpeechDraft(
  input: ResponsePolicyInput & {
    actionId?: string;
    evidencePath?: string;
  },
): StackchanSpeechDraft {
  const response = createResponsePolicy({
    maxSpeechChars: 80,
    ...input,
  });

  const preflight = createStackchanSpeechPreflight({
    actionId: input.actionId ?? "SC-AI-SPEECH",
    actor: input.agentId,
    source: "renderer",
    targetSummary: "StackChan spoken response draft",
    evidencePath: input.evidencePath ?? "docs/shikishima/SC_AI_SPEECH_EVIDENCE.md",
    allowedRunCount: 1,
  });

  return {
    response,
    preflight,
    canExecuteNow: false,
    displayOnly: true,
  };
}
