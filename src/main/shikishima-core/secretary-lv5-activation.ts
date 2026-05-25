import {
  createActionPreflight,
  type PreflightResult,
} from "./preflight-factory";
import type { HumanGoTicket } from "./action-gate-kernel";

export interface SecretaryLv5ActivationInput {
  activationId: string;
  humanGoTicket?: HumanGoTicket;
  checks: {
    personaPolicyReady: boolean;
    voiceRouterReady: boolean;
    oneShotEvidenceReady: boolean;
    stopMethodDefined: boolean;
    rollbackDefined: boolean;
    rawValuePolicyPassed: boolean;
  };
}

export interface SecretaryLv5ActivationDraft {
  activationId: string;
  productionReadyPreflight: PreflightResult;
  executionEnablePreflight: PreflightResult;
  criticalStateTransitionReady: boolean;
  productionReadyWouldBecome: boolean;
  executionWouldBecome: "enabled" | "disabled";
  actualMutationPerformed: false;
}

function checksPass(input: SecretaryLv5ActivationInput["checks"]): boolean {
  return (
    input.personaPolicyReady &&
    input.voiceRouterReady &&
    input.oneShotEvidenceReady &&
    input.stopMethodDefined &&
    input.rollbackDefined &&
    input.rawValuePolicyPassed
  );
}

export function createSecretaryLv5ActivationDraft(
  input: SecretaryLv5ActivationInput,
): SecretaryLv5ActivationDraft {
  const ready = checksPass(input.checks);
  const productionReadyPreflight = createActionPreflight({
    actionId: `${input.activationId}:production_ready`,
    actionKind: "production_ready",
    actor: "shizume",
    source: "human",
    targetSummary: "Secretary productionReady transition candidate",
    evidencePath: "docs/shikishima/SC_SECRETARY_LV5_ACTIVATION_EVIDENCE.md",
    requestedEffects: ["critical_state_change"],
    allowedRunCount: 1,
    humanGoTicket: input.humanGoTicket,
    criticalStateTransitionReady: ready,
  });
  const executionEnablePreflight = createActionPreflight({
    actionId: `${input.activationId}:execution_enable`,
    actionKind: "execution_enable",
    actor: "shizume",
    source: "human",
    targetSummary: "Secretary execution enabled transition candidate",
    evidencePath: "docs/shikishima/SC_SECRETARY_LV5_ACTIVATION_EVIDENCE.md",
    requestedEffects: ["critical_state_change"],
    allowedRunCount: 1,
    humanGoTicket: input.humanGoTicket,
    criticalStateTransitionReady: ready,
  });

  const bothApproved =
    productionReadyPreflight.gate.decision === "APPROVED_ONE_SHOT" &&
    executionEnablePreflight.gate.decision === "APPROVED_ONE_SHOT";

  return {
    activationId: input.activationId,
    productionReadyPreflight,
    executionEnablePreflight,
    criticalStateTransitionReady: ready,
    productionReadyWouldBecome: bothApproved,
    executionWouldBecome: bothApproved ? "enabled" : "disabled",
    actualMutationPerformed: false,
  };
}

