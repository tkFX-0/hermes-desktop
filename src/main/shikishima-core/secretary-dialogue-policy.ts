import type { ProfilePolicy } from "./profile-policy";
import type { ShikishimaAgentId } from "./model-assignment-registry";
import {
  createSecretaryVoiceRouteDraft,
  type SecretaryVoiceRouteDraft,
} from "./secretary-voice-router";

export interface SecretaryDialogueDraftInput {
  dialogueId: string;
  agentId: ShikishimaAgentId;
  userPromptSummary: string;
  draftAnswer: string;
  profilePolicy?: ProfilePolicy;
  allowVoice: boolean;
  evidencePath?: string;
}

export interface SecretaryDialogueDraft {
  dialogueId: string;
  agentId: ShikishimaAgentId;
  userPromptSummary: string;
  draftAnswer: string;
  voiceDraft?: SecretaryVoiceRouteDraft;
  oneShotOnly: true;
  continuousLoop: false;
  microphoneAlwaysOn: false;
  cameraMonitoring: false;
  externalWrite: false;
  productionReady: false;
  execution: "disabled";
}

export function createSecretaryDialogueDraft(
  input: SecretaryDialogueDraftInput,
): SecretaryDialogueDraft {
  const voiceDraft = input.allowVoice
    ? createSecretaryVoiceRouteDraft({
        routeId: `${input.dialogueId}:voice`,
        eventKind: "answer",
        agentId: input.agentId,
        fullText: input.draftAnswer,
        profilePolicy: input.profilePolicy,
        evidencePath: input.evidencePath,
      })
    : undefined;

  return {
    dialogueId: input.dialogueId,
    agentId: input.agentId,
    userPromptSummary: input.userPromptSummary,
    draftAnswer: input.draftAnswer,
    voiceDraft,
    oneShotOnly: true,
    continuousLoop: false,
    microphoneAlwaysOn: false,
    cameraMonitoring: false,
    externalWrite: false,
    productionReady: false,
    execution: "disabled",
  };
}

