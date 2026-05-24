import type { OperationActionKind } from "./operation-ledger-types";

export type ActionGateDecision =
  | "ALLOW_DRAFT"
  | "NEEDS_HUMAN"
  | "APPROVED_ONE_SHOT"
  | "DENY"
  | "STOP";

export type ActionGateRisk = "low" | "medium" | "high" | "critical";

export interface HumanGoTicket {
  ticketId: string;
  approvedByHuman: true;
  gateId: string;
  exactAction: string;
  timeWindowJst: string;
  allowedRunCount: number;
  target: string;
  forbiddenActions: readonly string[];
  stopConditions: readonly string[];
  evidenceFile: string;
  afterActionHoldRequired: true;
}

export interface ActionGateRequest {
  actionId: string;
  actionKind: OperationActionKind;
  actor: string;
  source: "renderer" | "discord" | "stackchan" | "sidebot" | "schedule" | "human" | "system";
  riskLevel: ActionGateRisk;
  requestedEffects: readonly string[];
  targetSummary: string;
  rawValuePolicy: "redacted_only";
  requiresHumanGo: boolean;
  allowedRunCount: number;
  timeWindowJst?: string;
  evidencePath: string;
  rollbackOrDisableMethod: string;
  humanGoTicket?: HumanGoTicket;
}

export interface ActionGateResult {
  decision: ActionGateDecision;
  reason: string;
  redactedSummary: string;
  requiredGoFields: readonly string[];
  approvedRunCount: number;
}

const LEVEL5_ACTIONS = new Set<OperationActionKind>([
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

const REQUIRED_GO_FIELDS = [
  "ticketId",
  "approvedByHuman",
  "gateId",
  "exactAction",
  "timeWindowJst",
  "allowedRunCount",
  "target",
  "stopConditions",
  "evidenceFile",
] as const;

function hasValidTicket(request: ActionGateRequest): boolean {
  const ticket = request.humanGoTicket;
  if (!ticket) return false;
  return (
    ticket.approvedByHuman === true &&
    ticket.gateId === request.actionId &&
    ticket.allowedRunCount > 0 &&
    ticket.allowedRunCount <= request.allowedRunCount &&
    ticket.afterActionHoldRequired === true &&
    ticket.evidenceFile.length > 0
  );
}

export function evaluateActionGate(request: ActionGateRequest): ActionGateResult {
  if (request.rawValuePolicy !== "redacted_only") {
    return {
      decision: "STOP",
      reason: "raw_value_policy_must_be_redacted_only",
      redactedSummary: request.targetSummary,
      requiredGoFields: REQUIRED_GO_FIELDS,
      approvedRunCount: 0,
    };
  }

  if (request.actionKind === "production_ready" || request.actionKind === "execution_enable") {
    return {
      decision: "DENY",
      reason: "critical_gate_not_implemented",
      redactedSummary: request.targetSummary,
      requiredGoFields: REQUIRED_GO_FIELDS,
      approvedRunCount: 0,
    };
  }

  const isLevel5 = LEVEL5_ACTIONS.has(request.actionKind);
  if (!isLevel5 && !request.requiresHumanGo) {
    return {
      decision: "ALLOW_DRAFT",
      reason: "draft_or_local_safe_action",
      redactedSummary: request.targetSummary,
      requiredGoFields: [],
      approvedRunCount: 0,
    };
  }

  if (hasValidTicket(request)) {
    return {
      decision: "APPROVED_ONE_SHOT",
      reason: "valid_human_go_ticket",
      redactedSummary: request.targetSummary,
      requiredGoFields: [],
      approvedRunCount: request.humanGoTicket?.allowedRunCount ?? 0,
    };
  }

  return {
    decision: "NEEDS_HUMAN",
    reason: "human_go_required",
    redactedSummary: request.targetSummary,
    requiredGoFields: REQUIRED_GO_FIELDS,
    approvedRunCount: 0,
  };
}
