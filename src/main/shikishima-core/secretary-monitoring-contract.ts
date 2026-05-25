import type { HumanGoTicket } from "./action-gate-kernel";

export type SecretarySensorMode =
  | "camera_continuous"
  | "microphone_always_on"
  | "voice_loop";

export interface SecretaryMonitoringContractInput {
  contractId: string;
  mode: SecretarySensorMode;
  humanGoTicket?: HumanGoTicket;
  durationSeconds: number;
  localOnly: boolean;
  privateSpaceConfirmed: boolean;
  pauseCommand: string;
  stopCommand: string;
  evidencePath: string;
}

export interface SecretaryMonitoringContract {
  contractId: string;
  mode: SecretarySensorMode;
  approved: boolean;
  maxDurationSeconds: number;
  localOnly: boolean;
  privateSpaceConfirmed: boolean;
  pauseCommand: string;
  stopCommand: string;
  retryLoop: false;
  backgroundDaemon: false;
  externalUpload: false;
  identityRecognition: false;
  evidencePath: string;
  blockedReason?: string;
}

const MAX_DURATION_SECONDS: Record<SecretarySensorMode, number> = {
  camera_continuous: 300,
  microphone_always_on: 300,
  voice_loop: 180,
};

export function createSecretaryMonitoringContract(
  input: SecretaryMonitoringContractInput,
): SecretaryMonitoringContract {
  const maxDurationSeconds = Math.min(
    Math.max(1, input.durationSeconds),
    MAX_DURATION_SECONDS[input.mode],
  );
  const ticketValid =
    input.humanGoTicket?.approvedByHuman === true &&
    input.humanGoTicket.allowedRunCount === 1 &&
    input.humanGoTicket.afterActionHoldRequired === true;
  const controlsReady = input.pauseCommand.trim().length > 0 && input.stopCommand.trim().length > 0;
  const approved =
    ticketValid &&
    input.localOnly &&
    input.privateSpaceConfirmed &&
    controlsReady &&
    input.evidencePath.trim().length > 0;

  return {
    contractId: input.contractId,
    mode: input.mode,
    approved,
    maxDurationSeconds,
    localOnly: input.localOnly,
    privateSpaceConfirmed: input.privateSpaceConfirmed,
    pauseCommand: input.pauseCommand,
    stopCommand: input.stopCommand,
    retryLoop: false,
    backgroundDaemon: false,
    externalUpload: false,
    identityRecognition: false,
    evidencePath: input.evidencePath,
    blockedReason: approved ? undefined : "monitoring_contract_not_ready",
  };
}

