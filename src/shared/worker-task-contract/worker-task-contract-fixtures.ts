import type { WorkerTaskContract } from "./worker-task-contract-types";

const baseSafeContract: WorkerTaskContract = {
  goalId: "shikishima.worker-task-contract-fixture-registry",
  taskId: "fixture-registry",
  summary: "representative worker task contract fixture",
  worker: "Codex",
  fileScope: {
    allowedFiles: ["src/shared/worker-task-contract/**"],
    forbiddenFiles: ["package.json", "package-lock.json", ".env*", "docs/firmware/**"]
  },
  commandScope: {
    allowedCommands: [
      "git status --short",
      "git diff --check",
      "npm run typecheck:node",
      "npm run typecheck:web",
      "npm test -- --runInBand"
    ],
    forbiddenCommands: [
      "git push",
      "npm install",
      "npm update",
      "npm run dev",
      "npm start",
      "Discord send",
      "Obsidian write",
      "StackChan connection",
      "runtime start"
    ]
  },
  permissions: {
    canEditSource: true,
    canEditDocs: false,
    canRunTests: true,
    canCommit: true,
    canPush: false,
    canStartRuntime: false,
    canWriteExternal: false,
    canChangeDependencies: false
  },
  requiredVerification: ["git status", "git diff --check", "typecheck:node", "unit tests"],
  stopConditions: [
    "forbidden_file_required",
    "forbidden_command_required",
    "package_change_required",
    "runtime_required",
    "external_write_required"
  ],
  humanGateRequirements: ["Push GO"],
  productionReady: false,
  execution: "disabled",
  rawValuesReported: false
};

function makeFixture(overrides: Partial<WorkerTaskContract>): WorkerTaskContract {
  return {
    ...baseSafeContract,
    ...overrides
  };
}

export const docsOnlySafeContract: WorkerTaskContract = makeFixture({
  taskId: "docs-only-safe",
  summary: "docs-only task that permits local docs edits and validation",
  fileScope: {
    allowedFiles: ["docs/shikishima/AUTONOMY_GOAL_LEDGER.md"],
    forbiddenFiles: ["src/**", "package.json", "package-lock.json", ".env*"]
  },
  permissions: {
    ...baseSafeContract.permissions,
    canEditSource: false,
    canEditDocs: true
  }
});

export const sourceAndTestsSafeContract: WorkerTaskContract = makeFixture({
  taskId: "source-and-tests-safe",
  summary: "scoped source and test task without external effects"
});

export const sourceWithPackageChangeHoldContract: WorkerTaskContract = makeFixture({
  taskId: "source-with-package-change-hold",
  summary: "source task that incorrectly attempts a dependency/package change",
  fileScope: {
    ...baseSafeContract.fileScope,
    allowedFiles: ["src/shared/worker-task-contract/**", "package.json"]
  },
  commandScope: {
    ...baseSafeContract.commandScope,
    allowedCommands: ["npm install"]
  },
  permissions: {
    ...baseSafeContract.permissions,
    canChangeDependencies: true
  }
});

export const pushAttemptRejectedContract: WorkerTaskContract = makeFixture({
  taskId: "push-attempt-rejected",
  summary: "task that attempts repository push without Push GO",
  commandScope: {
    ...baseSafeContract.commandScope,
    allowedCommands: ["git push origin main"]
  },
  permissions: {
    ...baseSafeContract.permissions,
    canPush: true
  }
});

export const runtimeStartRejectedContract: WorkerTaskContract = makeFixture({
  taskId: "runtime-start-rejected",
  summary: "task that attempts to start the app/runtime",
  commandScope: {
    ...baseSafeContract.commandScope,
    allowedCommands: ["npm run dev"]
  },
  permissions: {
    ...baseSafeContract.permissions,
    canStartRuntime: true
  }
});

export const externalWriteRejectedContract: WorkerTaskContract = makeFixture({
  taskId: "external-write-rejected",
  summary: "task that attempts an external write",
  commandScope: {
    ...baseSafeContract.commandScope,
    allowedCommands: ["external API write"]
  },
  permissions: {
    ...baseSafeContract.permissions,
    canWriteExternal: true
  }
});

export const discordSendRejectedContract: WorkerTaskContract = makeFixture({
  taskId: "discord-send-rejected",
  summary: "task that attempts Discord send",
  commandScope: {
    ...baseSafeContract.commandScope,
    allowedCommands: ["Discord send"]
  },
  permissions: {
    ...baseSafeContract.permissions,
    canWriteExternal: true
  },
  humanGateRequirements: ["Discord Send GO"]
});

export const obsidianWriteRejectedContract: WorkerTaskContract = makeFixture({
  taskId: "obsidian-write-rejected",
  summary: "task that attempts Obsidian write",
  commandScope: {
    ...baseSafeContract.commandScope,
    allowedCommands: ["Obsidian write"]
  },
  permissions: {
    ...baseSafeContract.permissions,
    canWriteExternal: true
  },
  humanGateRequirements: ["Obsidian Write GO"]
});

export const stackchanConnectionRejectedContract: WorkerTaskContract = makeFixture({
  taskId: "stackchan-connection-rejected",
  summary: "task that attempts StackChan device connection",
  commandScope: {
    ...baseSafeContract.commandScope,
    allowedCommands: ["StackChan connection"]
  },
  permissions: {
    ...baseSafeContract.permissions,
    canWriteExternal: true
  },
  humanGateRequirements: ["StackChan Connection GO"]
});

export const productionReadyRejectedContract = makeFixture({
  taskId: "production-ready-rejected",
  summary: "task that attempts to mark productionReady true",
  humanGateRequirements: ["ProductionReady GO"],
  productionReady: true
} as unknown as Partial<WorkerTaskContract>) as WorkerTaskContract;

export const executionEnabledRejectedContract: WorkerTaskContract = makeFixture({
  taskId: "execution-enabled-rejected",
  summary: "task that attempts to enable execution",
  humanGateRequirements: ["Execution Enablement GO"],
  execution: "enabled"
});

export const missingVerificationHoldContract: WorkerTaskContract = makeFixture({
  taskId: "missing-verification-hold",
  summary: "task missing required verification",
  requiredVerification: []
});

export const missingStopConditionsHoldContract: WorkerTaskContract = makeFixture({
  taskId: "missing-stop-conditions-hold",
  summary: "task missing stop conditions",
  stopConditions: []
});

export const workerTaskContractFixtures = {
  docsOnlySafeContract,
  sourceAndTestsSafeContract,
  sourceWithPackageChangeHoldContract,
  pushAttemptRejectedContract,
  runtimeStartRejectedContract,
  externalWriteRejectedContract,
  discordSendRejectedContract,
  obsidianWriteRejectedContract,
  stackchanConnectionRejectedContract,
  productionReadyRejectedContract,
  executionEnabledRejectedContract,
  missingVerificationHoldContract,
  missingStopConditionsHoldContract
} as const;
