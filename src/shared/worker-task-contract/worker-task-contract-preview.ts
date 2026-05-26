import type {
  WorkerTaskContract,
  WorkerTaskHumanGateRequirement
} from "./worker-task-contract-types";
import { validateWorkerTaskContract } from "./worker-task-contract-validator";

export type WorkerTaskContractPreviewDecision = "PASS" | "HOLD" | "REJECT";

export type WorkerTaskContractPreviewResult = {
  contractId: string;
  goalId: string;
  taskId: string;
  decision: WorkerTaskContractPreviewDecision;
  canProceed: boolean;
  canCommit: boolean;
  canPush: false;
  canStartRuntime: false;
  canWriteExternal: false;
  requiresHumanGate: boolean;
  reasons: string[];
  requiredHumanGates: WorkerTaskHumanGateRequirement[];
  productionReady: false;
  execution: "disabled";
  rawValuesReported: false;
};

function buildContractId(contract: WorkerTaskContract): string {
  return `${contract.goalId}:${contract.taskId}`;
}

export function previewWorkerTaskContract(
  contract: WorkerTaskContract
): WorkerTaskContractPreviewResult {
  const validation = validateWorkerTaskContract(contract);
  const decision: WorkerTaskContractPreviewDecision =
    validation.status === "PASS" ? "PASS" : "HOLD";
  const canProceed = decision === "PASS";

  return {
    contractId: buildContractId(contract),
    goalId: contract.goalId,
    taskId: contract.taskId,
    decision,
    canProceed,
    canCommit: canProceed && contract.permissions.canCommit,
    canPush: false,
    canStartRuntime: false,
    canWriteExternal: false,
    requiresHumanGate: !canProceed && contract.humanGateRequirements.length > 0,
    reasons: [...validation.errors, ...validation.warnings],
    requiredHumanGates: [...contract.humanGateRequirements],
    productionReady: false,
    execution: "disabled",
    rawValuesReported: false
  };
}
