import { describe, expect, it } from "vitest";
import { validateWorkerTaskContract } from "./worker-task-contract-validator";
import type { WorkerTaskContract } from "./worker-task-contract-types";

function makeContract(
  overrides: Partial<WorkerTaskContract> = {}
): WorkerTaskContract {
  return {
    goalId: "shikishima.worker-task-contract-types",
    taskId: "types-test",
    summary: "test worker task contract",
    worker: "Codex",
    fileScope: {
      allowedFiles: ["src/shared/worker-task-contract/**"],
      forbiddenFiles: ["package.json", "package-lock.json", ".env*"]
    },
    commandScope: {
      allowedCommands: [
        "git status --short",
        "git diff --check",
        "npm run typecheck:node",
        "npm run typecheck:web",
        "npm test"
      ],
      forbiddenCommands: ["git push", "npm install", "npm run dev"]
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
    requiredVerification: ["git status", "git diff --check", "typecheck:node"],
    stopConditions: [
      "forbidden_file_required",
      "runtime_required",
      "external_write_required"
    ],
    humanGateRequirements: ["Push GO"],
    productionReady: false,
    execution: "disabled",
    rawValuesReported: false,
    ...overrides
  };
}

describe("worker task contract validator", () => {
  it("passes a valid docs-only contract", () => {
    const contract = makeContract({
      fileScope: {
        allowedFiles: ["docs/shikishima/WORKER_TASK_CONTRACT_FOUNDATION.md"],
        forbiddenFiles: ["src/**", "package.json", ".env*"]
      },
      permissions: {
        ...makeContract().permissions,
        canEditSource: false,
        canEditDocs: true
      }
    });

    expect(validateWorkerTaskContract(contract).status).toBe("PASS");
  });

  it("passes a valid scoped source-and-test contract", () => {
    expect(validateWorkerTaskContract(makeContract()).status).toBe("PASS");
  });

  it("holds canPush true", () => {
    const contract = makeContract({
      permissions: { ...makeContract().permissions, canPush: true }
    });

    expect(validateWorkerTaskContract(contract).status).toBe("HOLD");
  });

  it("holds canStartRuntime true", () => {
    const contract = makeContract({
      permissions: { ...makeContract().permissions, canStartRuntime: true }
    });

    expect(validateWorkerTaskContract(contract).status).toBe("HOLD");
  });

  it("holds canWriteExternal true", () => {
    const contract = makeContract({
      permissions: { ...makeContract().permissions, canWriteExternal: true }
    });

    expect(validateWorkerTaskContract(contract).status).toBe("HOLD");
  });

  it("holds canChangeDependencies true", () => {
    const contract = makeContract({
      permissions: {
        ...makeContract().permissions,
        canChangeDependencies: true
      }
    });

    expect(validateWorkerTaskContract(contract).status).toBe("HOLD");
  });

  it("holds productionReady true even if an unsafe runtime object is provided", () => {
    const contract = {
      ...makeContract(),
      productionReady: true
    } as unknown as WorkerTaskContract;

    expect(validateWorkerTaskContract(contract).status).toBe("HOLD");
  });

  it("holds execution enabled", () => {
    const contract = makeContract({ execution: "enabled" });

    expect(validateWorkerTaskContract(contract).status).toBe("HOLD");
  });

  it("holds rawValuesReported true", () => {
    const contract = makeContract({ rawValuesReported: true });

    expect(validateWorkerTaskContract(contract).status).toBe("HOLD");
  });

  it("holds forbidden command npm install", () => {
    const contract = makeContract({
      commandScope: {
        ...makeContract().commandScope,
        allowedCommands: ["npm install"]
      }
    });

    expect(validateWorkerTaskContract(contract).status).toBe("HOLD");
  });

  it("holds forbidden command git push", () => {
    const contract = makeContract({
      commandScope: {
        ...makeContract().commandScope,
        allowedCommands: ["git push origin main"]
      }
    });

    expect(validateWorkerTaskContract(contract).status).toBe("HOLD");
  });

  it("holds forbidden command npm run dev", () => {
    const contract = makeContract({
      commandScope: {
        ...makeContract().commandScope,
        allowedCommands: ["npm run dev"]
      }
    });

    expect(validateWorkerTaskContract(contract).status).toBe("HOLD");
  });

  it("holds forbidden file .env", () => {
    const contract = makeContract({
      fileScope: {
        ...makeContract().fileScope,
        allowedFiles: [".env.local"]
      }
    });

    expect(validateWorkerTaskContract(contract).status).toBe("HOLD");
  });

  it("holds forbidden file package.json", () => {
    const contract = makeContract({
      fileScope: {
        ...makeContract().fileScope,
        allowedFiles: ["package.json"]
      }
    });

    expect(validateWorkerTaskContract(contract).status).toBe("HOLD");
  });

  it("holds missing required verification", () => {
    const contract = makeContract({ requiredVerification: [] });

    expect(validateWorkerTaskContract(contract).status).toBe("HOLD");
  });

  it("holds missing stop conditions", () => {
    const contract = makeContract({ stopConditions: [] });

    expect(validateWorkerTaskContract(contract).status).toBe("HOLD");
  });
});
