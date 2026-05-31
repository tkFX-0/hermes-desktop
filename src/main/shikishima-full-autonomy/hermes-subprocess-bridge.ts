/**
 * Phase E6 — Hermes daemon / WSL subprocess bridge (plan + bounded execute).
 */

import { hasConstitutionalGoScope } from "./constitutional-go-state";
import { evaluateSafetyGovernor } from "./safety-governor";

export interface HermesSubprocessPlanInput {
  wslDistribution?: string;
  commandRedacted?: string;
}

export interface HermesSubprocessPlanResult {
  decision: "HOLD" | "ALLOW_DRAFT" | "BLOCKED";
  reasons: readonly string[];
  wouldSpawn: boolean;
  commandRedacted: string;
}

export interface HermesSubprocessExecuteInput extends HermesSubprocessPlanInput {
  dryRun?: boolean;
}

export interface HermesSubprocessExecuteResult {
  success: boolean;
  spawned: boolean;
  exitCode: number | null;
  commandRedacted: string;
  reasons: readonly string[];
}

export function planHermesSubprocessBridge(
  input: HermesSubprocessPlanInput = {}
): HermesSubprocessPlanResult {
  const goActive = hasConstitutionalGoScope("hermes_subprocess");
  const governor = evaluateSafetyGovernor({
    productionReady: false,
    executionEnabled: false,
    rawValuesReported: false,
    retryLoopDetected: false,
    humanVisualAutoPassAttempted: false
  });

  if (governor.decision === "BLOCKED") {
    return {
      decision: "BLOCKED",
      reasons: governor.reasons,
      wouldSpawn: false,
      commandRedacted: "hermes:blocked"
    };
  }

  const reasons: string[] = [];
  if (!goActive) reasons.push("constitutional_go_hermes_subprocess_required");

  const commandRedacted =
    input.commandRedacted ??
    `wsl -d ${input.wslDistribution ?? "Ubuntu"} -- bash -lc "hermes status --redacted"`;

  const decision = reasons.length > 0 ? "HOLD" : "ALLOW_DRAFT";

  return {
    decision,
    reasons,
    wouldSpawn: decision === "ALLOW_DRAFT",
    commandRedacted
  };
}

export type SpawnFn = (
  command: string,
  args: readonly string[]
) => Promise<{ exitCode: number | null }>;

export async function executeHermesSubprocessBridge(
  input: HermesSubprocessExecuteInput = {},
  spawnFn?: SpawnFn
): Promise<HermesSubprocessExecuteResult> {
  const plan = planHermesSubprocessBridge(input);
  if (!plan.wouldSpawn) {
    return {
      success: false,
      spawned: false,
      exitCode: null,
      commandRedacted: plan.commandRedacted,
      reasons: plan.reasons
    };
  }

  if (input.dryRun !== false || !spawnFn) {
    return {
      success: true,
      spawned: false,
      exitCode: null,
      commandRedacted: plan.commandRedacted,
      reasons: ["dry_run_no_spawn"]
    };
  }

  const result = await spawnFn("wsl", [
    "-d",
    input.wslDistribution ?? "Ubuntu",
    "--",
    "bash",
    "-lc",
    "echo hermes_bridge_ok"
  ]);

  return {
    success: result.exitCode === 0,
    spawned: true,
    exitCode: result.exitCode,
    commandRedacted: plan.commandRedacted,
    reasons: result.exitCode === 0 ? [] : ["hermes_spawn_nonzero_exit"]
  };
}
