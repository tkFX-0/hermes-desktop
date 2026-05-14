import type { StackChanConfig } from "./stackchan-config";

export type StackChanSafetyResult =
  | { allowed: true }
  | { allowed: false; reason: string };

export function checkStackChanSafety(
  config: StackChanConfig,
  action: "connect" | "expression" | "motion",
): StackChanSafetyResult {
  if (!config.enabled) {
    return { allowed: false, reason: "StackChan is disabled in config" };
  }

  if (config.connectionMode === "none") {
    return { allowed: false, reason: "No connection mode configured" };
  }

  if (action === "motion" && !config.motionEnabled) {
    return {
      allowed: false,
      reason:
        "Motion is HOLD — requires explicit human GO to enable. Set motionEnabled=true after human approval.",
    };
  }

  if (action === "motion" && config.expressionOnly) {
    return {
      allowed: false,
      reason: "expressionOnly=true — motion is not permitted in this mode",
    };
  }

  return { allowed: true };
}
