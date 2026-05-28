/**
 * Phase 7 — secretary mode planner only (no Discord wire, no voice send).
 */

import type { GoalRegistryOptions } from "./goal-registry";
import type { ShikishimaUnifiedStateSnapshot } from "./snapshot-types";
import {
  planDiscordToStackChanVoice,
  planSecretarySession,
  type SecretarySessionPlan
} from "./secretary-mode";

export const SECRETARY_EMBODIMENT_MODE = "planner_only" as const;

export interface SecretaryPlannerOnlyInput {
  redactedStatusPreview: string;
  registryOptions: GoalRegistryOptions;
}

export interface SecretaryPlannerOnlyResult {
  mode: typeof SECRETARY_EMBODIMENT_MODE;
  session: SecretarySessionPlan;
  discordVoiceBlocked: true;
  blockReasons: readonly string[];
  actualSendPerformed: false;
}

export function planSecretaryWithoutEmbodiment(
  snapshot: ShikishimaUnifiedStateSnapshot,
  input: SecretaryPlannerOnlyInput
): SecretaryPlannerOnlyResult {
  const session = planSecretarySession(snapshot, false);

  const voicePlan = planDiscordToStackChanVoice({
    messageLength: input.redactedStatusPreview.length,
    redactedPreview: input.redactedStatusPreview,
    humanGoApproved: snapshot.humanGate.humanGoApproved,
    oneShotDeclared: snapshot.humanGate.timeWindowActive,
    timeWindowActive: snapshot.humanGate.timeWindowActive,
    voicePilotAudibleAccepted: false,
    bridgeEnvEnabled: false,
    productionReady: false,
    executionEnabled: false
  });

  const blockReasons: string[] = [
    "secretary_planner_only",
    "discord_voice_bridge_forbidden",
    "stackchan_embodiment_deferred"
  ];
  if (input.registryOptions.stackchanDeferred) {
    blockReasons.push("phase1_voice_deferred");
  }
  blockReasons.push(...voicePlan.reasons);

  return {
    mode: SECRETARY_EMBODIMENT_MODE,
    session,
    discordVoiceBlocked: true,
    blockReasons,
    actualSendPerformed: false
  };
}
