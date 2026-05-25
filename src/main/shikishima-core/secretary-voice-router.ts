import { createStackchanSpeechPreflight, type PreflightResult } from "./preflight-factory";
import type { ShikishimaAgentId } from "./model-assignment-registry";
import {
  createResponsePolicy,
  type ResponsePolicyResult,
} from "./response-policy";
import type { ProfilePolicy } from "./profile-policy";

export type SecretaryEventKind =
  | "answer"
  | "thinking"
  | "task_done"
  | "hold"
  | "stop"
  | "routine_checkin"
  | "fx_summary"
  | "camera_comment_draft";

export interface SecretaryVoiceRouteInput {
  routeId: string;
  eventKind: SecretaryEventKind;
  agentId: ShikishimaAgentId;
  fullText: string;
  spokenText?: string;
  profilePolicy?: ProfilePolicy;
  evidencePath?: string;
}

export interface SecretaryVoiceRouteDraft {
  routeId: string;
  eventKind: SecretaryEventKind;
  agentId: ShikishimaAgentId;
  spokenResponse: ResponsePolicyResult;
  face: string;
  motion: string;
  led: "off" | "blue" | "green" | "yellow" | "red";
  preflight: PreflightResult;
  displayOnly: true;
  canExecuteNow: false;
}

const EVENT_PRESENTATION: Record<SecretaryEventKind, {
  face: string;
  motion: string;
  led: SecretaryVoiceRouteDraft["led"];
}> = {
  answer: { face: "normal", motion: "aiagent_speak", led: "blue" },
  thinking: { face: "thinking", motion: "thinking_scan", led: "blue" },
  task_done: { face: "happy", motion: "task_done", led: "green" },
  hold: { face: "thinking", motion: "safety_hold", led: "yellow" },
  stop: { face: "panic", motion: "panic_stop", led: "red" },
  routine_checkin: { face: "normal", motion: "listen_ready", led: "blue" },
  fx_summary: { face: "thinking", motion: "thinking_scan", led: "yellow" },
  camera_comment_draft: { face: "thinking", motion: "safety_hold", led: "yellow" },
};

export function createSecretaryVoiceRouteDraft(
  input: SecretaryVoiceRouteInput,
): SecretaryVoiceRouteDraft {
  const presentation = EVENT_PRESENTATION[input.eventKind];
  const spokenResponse = createResponsePolicy({
    responseId: input.routeId,
    agentId: input.agentId,
    fullResponse: input.fullText,
    requestedSpokenResponse: input.spokenText,
    reasoningLevel: input.eventKind === "stop" || input.eventKind === "hold" ? "critical" : "standard",
    emotion: presentation.face,
    maxSpeechChars: input.eventKind === "fx_summary" ? 90 : 60,
    profilePolicy: input.profilePolicy,
  });

  return {
    routeId: input.routeId,
    eventKind: input.eventKind,
    agentId: input.agentId,
    spokenResponse,
    face: presentation.face,
    motion: presentation.motion,
    led: presentation.led,
    preflight: createStackchanSpeechPreflight({
      actionId: input.routeId,
      actor: input.agentId,
      source: "system",
      targetSummary: `StackChan secretary ${input.eventKind} voice draft`,
      evidencePath: input.evidencePath ?? "docs/shikishima/SC_SECRETARY_VOICE_EVIDENCE.md",
      allowedRunCount: 1,
    }),
    displayOnly: true,
    canExecuteNow: false,
  };
}

