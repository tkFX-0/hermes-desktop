export type WorkerTaskWorker = "Codex" | "ClaudeCode" | "Human" | "Other";

export type WorkerTaskExecutionState = "disabled" | "enabled";

export type WorkerTaskContractStatus = "PASS" | "HOLD";

export type WorkerTaskFileScope = {
  allowedFiles: string[];
  forbiddenFiles: string[];
};

export type WorkerTaskCommandScope = {
  allowedCommands: string[];
  forbiddenCommands: string[];
};

export type WorkerTaskPermissionSet = {
  canEditSource: boolean;
  canEditDocs: boolean;
  canRunTests: boolean;
  canCommit: boolean;
  canPush: boolean;
  canStartRuntime: boolean;
  canWriteExternal: boolean;
  canChangeDependencies: boolean;
};

export type WorkerTaskHumanGateRequirement =
  | "Push GO"
  | "Runtime GO"
  | "Discord Send GO"
  | "Obsidian Write GO"
  | "StackChan Connection GO"
  | "StackChan Firmware GO"
  | "Dependency GO"
  | "ProductionReady GO"
  | "Execution Enablement GO"
  | "Continuous Autonomy GO";

export type WorkerTaskVerificationRequirement =
  | "git status"
  | "git diff"
  | "git diff --check"
  | "typecheck:node"
  | "typecheck:web"
  | "unit tests"
  | "full tests"
  | "scope review";

export type WorkerTaskStopCondition =
  | "forbidden_file_required"
  | "forbidden_command_required"
  | "package_change_required"
  | "runtime_required"
  | "external_write_required"
  | "discord_send_required"
  | "obsidian_write_required"
  | "stackchan_connection_required"
  | "production_ready_required"
  | "execution_enablement_required"
  | "raw_secret_risk"
  | "dependency_install_required";

export type WorkerTaskContract = {
  goalId: string;
  taskId: string;
  summary: string;
  worker: WorkerTaskWorker;
  fileScope: WorkerTaskFileScope;
  commandScope: WorkerTaskCommandScope;
  permissions: WorkerTaskPermissionSet;
  requiredVerification: WorkerTaskVerificationRequirement[];
  stopConditions: WorkerTaskStopCondition[];
  humanGateRequirements: WorkerTaskHumanGateRequirement[];
  productionReady: false;
  execution: WorkerTaskExecutionState;
  rawValuesReported: boolean;
};

export type WorkerTaskContractValidationResult = {
  status: WorkerTaskContractStatus;
  errors: string[];
  warnings: string[];
};
