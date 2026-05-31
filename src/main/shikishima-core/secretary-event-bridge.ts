import type { ShikishimaAgentId } from "./model-assignment-registry";
import type { SecretaryEventKind, SecretaryVoiceRouteDraft } from "./secretary-voice-router";
import { createSecretaryVoiceRouteDraft } from "./secretary-voice-router";

export type SecretaryBridgeEventKind =
  | "task_done"
  | "gate_hold"
  | "gate_stop"
  | "evidence_created"
  | "discord_read_only_summary"
  | "fx_thesis_summary";

export interface SecretaryBridgeEvent {
  eventId: string;
  eventKind: SecretaryBridgeEventKind;
  summary: string;
  agentId?: ShikishimaAgentId;
  evidencePath?: string;
}

export interface SecretaryBridgeDraft {
  event: SecretaryBridgeEvent;
  voiceDraft: SecretaryVoiceRouteDraft;
  externalWrite: false;
  deviceActionExecuted: false;
  canExecuteNow: false;
}

const EVENT_TO_SECRETARY_KIND: Record<SecretaryBridgeEventKind, SecretaryEventKind> = {
  task_done: "task_done",
  gate_hold: "hold",
  gate_stop: "stop",
  evidence_created: "task_done",
  discord_read_only_summary: "answer",
  fx_thesis_summary: "fx_summary",
};

const EVENT_TO_AGENT: Record<SecretaryBridgeEventKind, ShikishimaAgentId> = {
  task_done: "tsumugi",
  gate_hold: "shizume",
  gate_stop: "shizume",
  evidence_created: "shirube",
  discord_read_only_summary: "shirube",
  fx_thesis_summary: "shirube",
};

export function createSecretaryBridgeDraft(event: SecretaryBridgeEvent): SecretaryBridgeDraft {
  const agentId = event.agentId ?? EVENT_TO_AGENT[event.eventKind];

  return {
    event,
    voiceDraft: createSecretaryVoiceRouteDraft({
      routeId: `${event.eventId}:voice`,
      eventKind: EVENT_TO_SECRETARY_KIND[event.eventKind],
      agentId,
      fullText: event.summary,
      spokenText: event.summary,
      evidencePath: event.evidencePath,
    }),
    externalWrite: false,
    deviceActionExecuted: false,
    canExecuteNow: false,
  };
}

