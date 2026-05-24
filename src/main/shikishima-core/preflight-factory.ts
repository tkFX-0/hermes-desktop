import {
  evaluateActionGate,
  type ActionGateRequest,
  type ActionGateResult,
  type HumanGoTicket,
} from "./action-gate-kernel";
import type { OperationActionKind } from "./operation-ledger-types";

export interface PreflightInput {
  actionId: string;
  actionKind: OperationActionKind;
  actor: string;
  source: ActionGateRequest["source"];
  targetSummary: string;
  evidencePath: string;
  requestedEffects?: readonly string[];
  allowedRunCount?: number;
  humanGoTicket?: HumanGoTicket;
}

export interface PreflightResult {
  request: ActionGateRequest;
  gate: ActionGateResult;
}

const ACTION_RISK: Record<OperationActionKind, ActionGateRequest["riskLevel"]> = {
  local_draft: "low",
  discord_read: "medium",
  discord_write: "high",
  obsidian_write: "high",
  x_search: "medium",
  hermes_cli: "high",
  claude_code: "high",
  stackchan_say: "high",
  stackchan_motion: "critical",
  stackchan_camera: "critical",
  stt_server: "critical",
  runtime_start: "critical",
  production_ready: "critical",
  execution_enable: "critical",
  fx_thesis: "medium",
  debate: "low",
};

const HUMAN_GO_ACTIONS = new Set<OperationActionKind>([
  "discord_read",
  "discord_write",
  "obsidian_write",
  "x_search",
  "hermes_cli",
  "claude_code",
  "stackchan_say",
  "stackchan_motion",
  "stackchan_camera",
  "stt_server",
  "runtime_start",
  "production_ready",
  "execution_enable",
]);

export function createActionPreflight(input: PreflightInput): PreflightResult {
  const request: ActionGateRequest = {
    actionId: input.actionId,
    actionKind: input.actionKind,
    actor: input.actor,
    source: input.source,
    riskLevel: ACTION_RISK[input.actionKind],
    requestedEffects: input.requestedEffects ?? [],
    targetSummary: input.targetSummary,
    rawValuePolicy: "redacted_only",
    requiresHumanGo: HUMAN_GO_ACTIONS.has(input.actionKind),
    allowedRunCount: input.allowedRunCount ?? 1,
    evidencePath: input.evidencePath,
    rollbackOrDisableMethod: "restore gate to HOLD",
    humanGoTicket: input.humanGoTicket,
  };

  return {
    request,
    gate: evaluateActionGate(request),
  };
}

export function createStackchanSpeechPreflight(input: Omit<PreflightInput, "actionKind" | "requestedEffects">): PreflightResult {
  return createActionPreflight({
    ...input,
    actionKind: "stackchan_say",
    requestedEffects: ["voice_output"],
  });
}

export function createDiscordSendPreflight(input: Omit<PreflightInput, "actionKind" | "requestedEffects">): PreflightResult {
  return createActionPreflight({
    ...input,
    actionKind: "discord_write",
    requestedEffects: ["external_write"],
  });
}

export function createObsidianWritePreflight(input: Omit<PreflightInput, "actionKind" | "requestedEffects">): PreflightResult {
  return createActionPreflight({
    ...input,
    actionKind: "obsidian_write",
    requestedEffects: ["local_note_write"],
  });
}
