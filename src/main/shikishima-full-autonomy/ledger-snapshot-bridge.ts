/**
 * Phase 2 — connect unified snapshot to ledger-shaped context (no Obsidian/file write).
 */

import { buildUnifiedStateSnapshot } from "./build-unified-snapshot";
import type { GoalStatus } from "./goal-registry";
import { getActivePhaseGoal, type GoalRegistryOptions } from "./goal-registry";
import type { RegistryGoal } from "./goal-registry";
import type { ShikishimaUnifiedStateSnapshot } from "./snapshot-types";

export interface LedgerConnectionInput {
  registry: readonly RegistryGoal[];
  registryOptions: GoalRegistryOptions;
  capturedAtIso?: string;
  traceId?: string;
  additionalHoldReasons?: readonly string[];
}

export interface LedgerSnapshotConnection {
  activeGoalId: string;
  activeGoalStatus: GoalStatus;
  snapshot: ShikishimaUnifiedStateSnapshot;
  ledgerLines: readonly string[];
}

function stackchanBlockFromRegistry(
  registry: readonly RegistryGoal[],
  options: GoalRegistryOptions
): { holdReasons: string[]; voiceDeferred: boolean } {
  const holdReasons: string[] = [];
  if (options.stackchanDeferred) {
    holdReasons.push("stackchan_embodiment_deferred");
  }
  const voice = registry.find((g) => g.id === "shikishima.phase1.voice-completion");
  if (voice?.status === "DEFERRED" || voice?.status === "HOLD") {
    holdReasons.push("phase1_voice_deferred");
  }
  return { holdReasons, voiceDeferred: options.stackchanDeferred };
}

export function connectLedgerToUnifiedSnapshot(
  input: LedgerConnectionInput
): LedgerSnapshotConnection {
  const active = getActivePhaseGoal(input.registry, input.registryOptions);
  const stackchan = stackchanBlockFromRegistry(input.registry, input.registryOptions);

  const snapshot = buildUnifiedStateSnapshot({
    capturedAtIso: input.capturedAtIso,
    traceId: input.traceId ?? `ledger-${active.id}`,
    holdReason: [
      `active_goal=${active.id}`,
      ...(input.additionalHoldReasons ?? []),
      ...stackchan.holdReasons
    ].join("; "),
    stackchan: {
      displayRoute: "HOLD",
      motionRoute: "HOLD",
      voiceRoute: "HOLD",
      voicePilotAudibleAccepted: false,
      holdReasons: stackchan.holdReasons
    },
    humanGate: {
      humanPresent: true,
      humanGoApproved: false,
      visualConfirmationRequired: true,
      visualConfirmationPassed: false,
      timeWindowActive: false
    }
  });

  const ledgerLines: string[] = [
    `active_goal: ${active.id}`,
    `active_goal_status: ${active.status}`,
    `global_decision: ${snapshot.globalDecision}`,
    `hold_reason: ${snapshot.holdReason ?? "none"}`,
    `stackchan_deferred: ${input.registryOptions.stackchanDeferred}`,
    `productionReady: false`,
    `execution: disabled`
  ];

  return {
    activeGoalId: active.id,
    activeGoalStatus: active.status,
    snapshot,
    ledgerLines
  };
}
