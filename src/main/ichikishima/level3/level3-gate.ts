import type { Level3Config, Level3StopCondition } from "./level3-config";

export type Level3GateResult =
  | { pass: true }
  | { pass: false; reason: string; stopCondition?: Level3StopCondition };

export function checkLevel3PreflightGate(
  config: Level3Config,
): Level3GateResult {
  if (config.status !== "go_issued") {
    return {
      pass: false,
      reason: `Level 3 requires status=go_issued. Current: ${config.status}`,
    };
  }

  if (!config.approvedBy || !config.approvedAt) {
    return {
      pass: false,
      reason: "Level 3 requires explicit human approval with approvedBy and approvedAt",
    };
  }

  if (!config.sessionId) {
    return { pass: false, reason: "Level 3 requires a session ID" };
  }

  if (!config.timeWindow) {
    return { pass: false, reason: "Level 3 requires an approved time_window" };
  }

  const now = new Date();
  const windowEnd = new Date(config.timeWindow.end);
  if (now > windowEnd) {
    return {
      pass: false,
      reason: "Level 3 time_window has expired",
      stopCondition: "time_window_expired",
    };
  }

  return { pass: true };
}

export function checkLevel3StopCondition(
  condition: string,
): Level3GateResult {
  if (condition === "raw_value_visible" || condition === "secret_visible") {
    return {
      pass: false,
      reason: `STOP: ${condition} detected`,
      stopCondition: condition as Level3StopCondition,
    };
  }
  return { pass: true };
}
