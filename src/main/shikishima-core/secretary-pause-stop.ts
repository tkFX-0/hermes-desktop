import type { HumanGoTicket } from "./action-gate-kernel";
import type { OperationActionKind } from "./operation-ledger-types";

export type SecretaryControlState = "running" | "paused" | "stopped";

export interface SecretaryPauseStopState {
  controlState: SecretaryControlState;
  reason?: string;
  updatedAtLabel: string;
  resumedByTicketId?: string;
  productionReady: false;
  execution: "disabled";
  rawValuesReported: false;
}

export interface SecretaryActionAllowance {
  allowed: boolean;
  reason: string;
}

export function createSecretaryControlState(nowLabel = "2026-05-25"): SecretaryPauseStopState {
  return {
    controlState: "running",
    updatedAtLabel: nowLabel,
    productionReady: false,
    execution: "disabled",
    rawValuesReported: false,
  };
}

export function pauseSecretary(
  state: SecretaryPauseStopState,
  reason: string,
  nowLabel = state.updatedAtLabel,
): SecretaryPauseStopState {
  return {
    ...state,
    controlState: "paused",
    reason,
    updatedAtLabel: nowLabel,
    resumedByTicketId: undefined,
  };
}

export function stopSecretary(
  state: SecretaryPauseStopState,
  reason: string,
  nowLabel = state.updatedAtLabel,
): SecretaryPauseStopState {
  return {
    ...state,
    controlState: "stopped",
    reason,
    updatedAtLabel: nowLabel,
    resumedByTicketId: undefined,
  };
}

export function resumeSecretary(
  state: SecretaryPauseStopState,
  ticket: HumanGoTicket | undefined,
  nowLabel = state.updatedAtLabel,
): SecretaryPauseStopState {
  if (
    !ticket?.approvedByHuman ||
    ticket.allowedRunCount !== 1 ||
    ticket.afterActionHoldRequired !== true
  ) {
    return state;
  }

  return {
    ...state,
    controlState: "running",
    reason: undefined,
    updatedAtLabel: nowLabel,
    resumedByTicketId: ticket.ticketId,
  };
}

export function isSecretaryActionAllowed(
  state: SecretaryPauseStopState,
  actionKind: OperationActionKind | "status" | "evidence",
): SecretaryActionAllowance {
  if (actionKind === "status" || actionKind === "evidence") {
    return { allowed: true, reason: "status_or_evidence_allowed" };
  }
  if (state.controlState === "stopped") {
    return { allowed: false, reason: "secretary_stopped" };
  }
  if (state.controlState === "paused") {
    return { allowed: false, reason: "secretary_paused" };
  }
  return { allowed: true, reason: "secretary_running" };
}

