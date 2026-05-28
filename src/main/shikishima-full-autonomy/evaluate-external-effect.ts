import type { AutonomyDecision } from "./snapshot-types";
import { getExternalEffectDefinition } from "./external-effect-registry";

export interface ExternalEffectEvaluationInput {
  routeId: string;
  humanGoApproved: boolean;
  oneShotDeclared: boolean;
  timeWindowActive: boolean;
  dryRunOnly: boolean;
  productionReady: boolean;
  executionEnabled: boolean;
  voicePilotAudibleAccepted?: boolean;
  explicitPermittedGo?: boolean;
}

export interface ExternalEffectEvaluationResult {
  routeId: string;
  decision: AutonomyDecision;
  reasons: readonly string[];
  allowsActualExecution: false;
}

export function evaluateExternalEffect(
  input: ExternalEffectEvaluationInput
): ExternalEffectEvaluationResult {
  const def = getExternalEffectDefinition(input.routeId);
  if (!def) {
    return {
      routeId: input.routeId,
      decision: "BLOCKED",
      reasons: ["unknown_route"],
      allowsActualExecution: false
    };
  }

  if (input.productionReady || input.executionEnabled) {
    return {
      routeId: input.routeId,
      decision: "BLOCKED",
      reasons: ["invariant_violation"],
      allowsActualExecution: false
    };
  }

  if (def.defaultDecision === "BLOCKED") {
    return {
      routeId: input.routeId,
      decision: "BLOCKED",
      reasons: ["registry_blocked"],
      allowsActualExecution: false
    };
  }

  const reasons: string[] = [];

  if (def.requiresHumanGo && !input.humanGoApproved) {
    reasons.push("human_go_required");
  }
  if (def.oneShotRequired && !input.oneShotDeclared) {
    reasons.push("one_shot_required");
  }
  if (def.timeWindowRequired && !input.timeWindowActive && !input.explicitPermittedGo) {
    reasons.push("time_window_required");
  }

  if (input.routeId === "stackchan.voice" && input.voicePilotAudibleAccepted === false) {
    reasons.push("phase1_voice_not_audible_accepted");
  }

  if (input.routeId.startsWith("discord.") && !input.dryRunOnly) {
    reasons.push("discord_actual_send_requires_phase6_go");
  }

  const decision: AutonomyDecision =
    reasons.length > 0 ? "HOLD" : input.dryRunOnly ? "ALLOW_DRAFT" : "HOLD";

  return {
    routeId: input.routeId,
    decision,
    reasons,
    allowsActualExecution: false
  };
}
