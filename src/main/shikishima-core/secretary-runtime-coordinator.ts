import type { HumanGoTicket } from "./action-gate-kernel";
import type { ShikishimaAgentId } from "./model-assignment-registry";
import type { ProfilePolicy } from "./profile-policy";
import {
  createSecretaryStillImageCommentDraft,
  type SecretaryStillImageCommentDraft,
} from "./secretary-camera-comment-policy";
import {
  createSecretaryDialogueDraft,
  type SecretaryDialogueDraft,
} from "./secretary-dialogue-policy";
import {
  createSecretaryBridgeDraft,
  type SecretaryBridgeDraft,
  type SecretaryBridgeEvent,
} from "./secretary-event-bridge";
import {
  createSecretaryMonitoringContract,
  type SecretaryMonitoringContract,
  type SecretaryMonitoringContractInput,
} from "./secretary-monitoring-contract";
import {
  createSecretaryControlState,
  isSecretaryActionAllowed,
  pauseSecretary,
  resumeSecretary,
  stopSecretary,
  type SecretaryPauseStopState,
} from "./secretary-pause-stop";
import {
  createSecretaryRoutineCheckinDraft,
  type SecretaryRoutineCheckinDraft,
  type SecretaryRoutineKind,
} from "./secretary-routine-checkin";

export type SecretaryRuntimeMode =
  | "idle"
  | "one_shot_dialogue"
  | "event_reaction"
  | "routine_checkin"
  | "camera_one_shot"
  | "bounded_sensor_session"
  | "paused"
  | "stopped";

export interface SecretaryRuntimeState {
  mode: SecretaryRuntimeMode;
  paused: boolean;
  stopped: boolean;
  activeGateId?: string;
  runCount: number;
  lastResult?: string;
  control: SecretaryPauseStopState;
  productionReady: false;
  execution: "disabled";
  rawValuesReported: false;
}

export type SecretaryRuntimeDraft =
  | { kind: "dialogue"; draft: SecretaryDialogueDraft }
  | { kind: "event"; draft: SecretaryBridgeDraft }
  | { kind: "routine"; draft: SecretaryRoutineCheckinDraft }
  | { kind: "camera"; draft: SecretaryStillImageCommentDraft }
  | { kind: "sensor"; draft: SecretaryMonitoringContract }
  | { kind: "blocked"; reason: string };

export function createSecretaryRuntimeState(nowLabel = "2026-05-25"): SecretaryRuntimeState {
  return {
    mode: "idle",
    paused: false,
    stopped: false,
    runCount: 0,
    control: createSecretaryControlState(nowLabel),
    productionReady: false,
    execution: "disabled",
    rawValuesReported: false,
  };
}

function withMode(
  state: SecretaryRuntimeState,
  mode: SecretaryRuntimeMode,
  activeGateId?: string,
  lastResult?: string,
): SecretaryRuntimeState {
  return {
    ...state,
    mode,
    activeGateId,
    lastResult,
    paused: state.control.controlState === "paused",
    stopped: state.control.controlState === "stopped",
  };
}

export function pauseSecretaryRuntime(
  state: SecretaryRuntimeState,
  reason: string,
): SecretaryRuntimeState {
  const control = pauseSecretary(state.control, reason);
  return {
    ...withMode(state, "paused", state.activeGateId, reason),
    control,
    paused: true,
    stopped: false,
  };
}

export function stopSecretaryRuntime(
  state: SecretaryRuntimeState,
  reason: string,
): SecretaryRuntimeState {
  const control = stopSecretary(state.control, reason);
  return {
    ...withMode(state, "stopped", state.activeGateId, reason),
    control,
    paused: false,
    stopped: true,
  };
}

export function resumeSecretaryRuntime(
  state: SecretaryRuntimeState,
  ticket?: HumanGoTicket,
): SecretaryRuntimeState {
  const control = resumeSecretary(state.control, ticket);
  return {
    ...withMode({ ...state, control }, control.controlState === "running" ? "idle" : state.mode),
    paused: control.controlState === "paused",
    stopped: control.controlState === "stopped",
  };
}

function blockedIfNeeded(
  state: SecretaryRuntimeState,
  action: Parameters<typeof isSecretaryActionAllowed>[1],
): { blocked?: SecretaryRuntimeDraft } {
  const allowed = isSecretaryActionAllowed(state.control, action);
  return allowed.allowed ? {} : { blocked: { kind: "blocked", reason: allowed.reason } };
}

export function draftSecretaryDialogue(
  state: SecretaryRuntimeState,
  input: {
    dialogueId: string;
    agentId: ShikishimaAgentId;
    userPromptSummary: string;
    draftAnswer: string;
    profilePolicy?: ProfilePolicy;
    allowVoice: boolean;
    evidencePath?: string;
  },
): { state: SecretaryRuntimeState; result: SecretaryRuntimeDraft } {
  const blocked = blockedIfNeeded(state, "stackchan_say").blocked;
  if (blocked) return { state, result: blocked };
  return {
    state: withMode(state, "one_shot_dialogue", input.dialogueId, "dialogue_drafted"),
    result: { kind: "dialogue", draft: createSecretaryDialogueDraft(input) },
  };
}

export function draftSecretaryEventReaction(
  state: SecretaryRuntimeState,
  event: SecretaryBridgeEvent,
): { state: SecretaryRuntimeState; result: SecretaryRuntimeDraft } {
  const blocked = blockedIfNeeded(state, "stackchan_say").blocked;
  if (blocked) return { state, result: blocked };
  return {
    state: withMode(state, "event_reaction", event.eventId, "event_reaction_drafted"),
    result: { kind: "event", draft: createSecretaryBridgeDraft(event) },
  };
}

export function draftSecretaryRoutineCheckin(
  state: SecretaryRuntimeState,
  input: {
    routineId: string;
    routineKind: SecretaryRoutineKind;
    agentId?: ShikishimaAgentId;
    message: string;
    minimumIntervalMinutes?: number;
    maxRunsPerDay?: number;
  },
): { state: SecretaryRuntimeState; result: SecretaryRuntimeDraft } {
  const blocked = blockedIfNeeded(state, "stackchan_say").blocked;
  if (blocked) return { state, result: blocked };
  return {
    state: withMode(state, "routine_checkin", input.routineId, "routine_drafted"),
    result: { kind: "routine", draft: createSecretaryRoutineCheckinDraft(input) },
  };
}

export function draftSecretaryCameraComment(
  state: SecretaryRuntimeState,
  input: Parameters<typeof createSecretaryStillImageCommentDraft>[0],
): { state: SecretaryRuntimeState; result: SecretaryRuntimeDraft } {
  const blocked = blockedIfNeeded(state, "stackchan_camera").blocked;
  if (blocked) return { state, result: blocked };
  return {
    state: withMode(state, "camera_one_shot", input.commentId, "camera_comment_drafted"),
    result: { kind: "camera", draft: createSecretaryStillImageCommentDraft(input) },
  };
}

export function draftSecretarySensorSession(
  state: SecretaryRuntimeState,
  input: SecretaryMonitoringContractInput,
): { state: SecretaryRuntimeState; result: SecretaryRuntimeDraft } {
  const blocked = blockedIfNeeded(
    state,
    input.mode === "microphone_always_on" || input.mode === "voice_loop" ? "stt_server" : "stackchan_camera",
  ).blocked;
  if (blocked) return { state, result: blocked };
  return {
    state: withMode(state, "bounded_sensor_session", input.contractId, "sensor_contract_drafted"),
    result: { kind: "sensor", draft: createSecretaryMonitoringContract(input) },
  };
}

