import type { ShikishimaAgentId } from "./model-assignment-registry";
import {
  createSecretaryVoiceRouteDraft,
  type SecretaryVoiceRouteDraft,
} from "./secretary-voice-router";

export type SecretaryRoutineKind =
  | "break_reminder"
  | "hydration_reminder"
  | "task_wrapup"
  | "gate_review"
  | "daily_summary_draft";

export interface SecretaryRoutineCheckinDraft {
  routineId: string;
  routineKind: SecretaryRoutineKind;
  agentId: ShikishimaAgentId;
  message: string;
  minimumIntervalMinutes: number;
  maxRunsPerDay: number;
  retryLoop: false;
  naggingEscalation: false;
  requiresHumanGoForVoice: true;
  voiceDraft: SecretaryVoiceRouteDraft;
}

export function createSecretaryRoutineCheckinDraft(input: {
  routineId: string;
  routineKind: SecretaryRoutineKind;
  agentId?: ShikishimaAgentId;
  message: string;
  minimumIntervalMinutes?: number;
  maxRunsPerDay?: number;
}): SecretaryRoutineCheckinDraft {
  const agentId = input.agentId ?? "shikishima";
  const minimumIntervalMinutes = Math.max(15, input.minimumIntervalMinutes ?? 60);
  const maxRunsPerDay = Math.max(1, Math.min(8, input.maxRunsPerDay ?? 3));

  return {
    routineId: input.routineId,
    routineKind: input.routineKind,
    agentId,
    message: input.message,
    minimumIntervalMinutes,
    maxRunsPerDay,
    retryLoop: false,
    naggingEscalation: false,
    requiresHumanGoForVoice: true,
    voiceDraft: createSecretaryVoiceRouteDraft({
      routeId: `${input.routineId}:voice`,
      eventKind: "routine_checkin",
      agentId,
      fullText: input.message,
      spokenText: input.message,
      evidencePath: "docs/shikishima/SC_ROUTINE_CHECKIN_EVIDENCE.md",
    }),
  };
}

