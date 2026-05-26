import type {
  WorkerTaskCommandScope,
  WorkerTaskContract,
  WorkerTaskContractValidationResult,
  WorkerTaskFileScope
} from "./worker-task-contract-types";

const forbiddenCommandPatterns = [
  /^git\s+push\b/i,
  /^npm\s+install\b/i,
  /^npm\s+update\b/i,
  /^npx\b/i,
  /^npm\s+run\s+dev\b/i,
  /^npm\s+start\b/i,
  /^electron\s+\./i,
  /StackChan connection/i,
  /StackChan firmware upload/i,
  /Discord send/i,
  /Obsidian write/i,
  /external API write/i,
  /runtime start/i
];

const forbiddenFilePatterns = [
  /^\.env/i,
  /^package\.json$/i,
  /^package-lock\.json$/i,
  /^docs\/firmware\//i,
  /^config/i
];

function hasForbiddenCommand(commandScope: WorkerTaskCommandScope): string[] {
  return commandScope.allowedCommands.filter((command) =>
    forbiddenCommandPatterns.some((pattern) => pattern.test(command))
  );
}

function hasForbiddenFile(fileScope: WorkerTaskFileScope): string[] {
  return fileScope.allowedFiles.filter((file) =>
    forbiddenFilePatterns.some((pattern) => pattern.test(file))
  );
}

function hasRequiredShape(contract: WorkerTaskContract): string[] {
  const errors: string[] = [];

  if (!contract.goalId) errors.push("goalId is required");
  if (!contract.taskId) errors.push("taskId is required");
  if (!contract.summary) errors.push("summary is required");
  if (contract.fileScope.allowedFiles.length === 0) {
    errors.push("allowedFiles must not be empty");
  }
  if (contract.requiredVerification.length === 0) {
    errors.push("requiredVerification must not be empty");
  }
  if (contract.stopConditions.length === 0) {
    errors.push("stopConditions must not be empty");
  }

  return errors;
}

export function validateWorkerTaskContract(
  contract: WorkerTaskContract
): WorkerTaskContractValidationResult {
  const errors = hasRequiredShape(contract);
  const warnings: string[] = [];

  if (contract.permissions.canPush) {
    errors.push("canPush must remain false without Push GO");
  }
  if (contract.permissions.canStartRuntime) {
    errors.push("canStartRuntime must remain false without Runtime GO");
  }
  if (contract.permissions.canWriteExternal) {
    errors.push("canWriteExternal must remain false without External Write GO");
  }
  if (contract.permissions.canChangeDependencies) {
    errors.push("canChangeDependencies must remain false without Dependency GO");
  }
  if (contract.productionReady !== false) {
    errors.push("productionReady must remain false");
  }
  if (contract.execution !== "disabled") {
    errors.push("execution must remain disabled");
  }
  if (contract.rawValuesReported) {
    errors.push("rawValuesReported must remain false");
  }

  for (const command of hasForbiddenCommand(contract.commandScope)) {
    errors.push(`forbidden command in allowedCommands: ${command}`);
  }

  for (const file of hasForbiddenFile(contract.fileScope)) {
    errors.push(`forbidden file in allowedFiles: ${file}`);
  }

  if (contract.fileScope.forbiddenFiles.length === 0) {
    warnings.push("forbiddenFiles should be explicit");
  }
  if (contract.commandScope.forbiddenCommands.length === 0) {
    warnings.push("forbiddenCommands should be explicit");
  }

  return {
    status: errors.length === 0 ? "PASS" : "HOLD",
    errors,
    warnings
  };
}
