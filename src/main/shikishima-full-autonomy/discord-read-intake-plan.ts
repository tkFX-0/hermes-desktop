/**
 * Phase E5 — Discord read-only intake plan (dry-run; no REST / no token read).
 */

import { evaluateExternalEffect } from "./evaluate-external-effect";
import { evaluateSafetyGovernor } from "./safety-governor";

export interface DiscordReadIntakePlanInput {
  channelConfigured: boolean;
  humanGoApproved: boolean;
  oneShotDeclared: boolean;
  messageLimit: number;
}

export interface DiscordReadIntakePlanResult {
  decision: "HOLD" | "ALLOW_DRAFT" | "BLOCKED";
  reasons: readonly string[];
  dryRunOnly: true;
  wouldRead: boolean;
  /** Redacted summary only; never real channel id or token. */
  targetSummaryRedacted: string;
}

export function planDiscordReadIntake(
  input: DiscordReadIntakePlanInput
): DiscordReadIntakePlanResult {
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
      dryRunOnly: true,
      wouldRead: false,
      targetSummaryRedacted: "discord_read:blocked"
    };
  }

  const effect = evaluateExternalEffect({
    routeId: "discord.read",
    humanGoApproved: input.humanGoApproved,
    oneShotDeclared: input.oneShotDeclared,
    timeWindowActive: true,
    dryRunOnly: true,
    productionReady: false,
    executionEnabled: false
  });

  const reasons = [...effect.reasons];
  if (!input.channelConfigured) reasons.push("channel_not_configured");
  if (input.messageLimit < 1 || input.messageLimit > 50) reasons.push("message_limit_out_of_range");

  const raw = reasons.length > 0 ? "HOLD" : effect.decision;
  const decision: DiscordReadIntakePlanResult["decision"] =
    raw === "ALLOW" || raw === "ALLOW_DRAFT"
      ? "ALLOW_DRAFT"
      : raw === "BLOCKED"
        ? "BLOCKED"
        : "HOLD";

  return {
    decision,
    reasons,
    dryRunOnly: true,
    wouldRead: decision === "ALLOW_DRAFT",
    targetSummaryRedacted: input.channelConfigured
      ? `discord_read:draft_limit_${input.messageLimit}`
      : "discord_read:channel_missing"
  };
}
