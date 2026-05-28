/** Chapter 7 — action classification (しずめ preflight). */

export type RiskClass = "low" | "medium" | "high" | "critical";

export type ActionIntentKind =
  | "local_read"
  | "local_write"
  | "discord_read"
  | "discord_send"
  | "git_push"
  | "stackchan_device"
  | "production_change"
  | "financial"
  | "firmware"
  | "unknown";

export interface ClassifiedAction {
  kind: ActionIntentKind;
  riskClass: RiskClass;
  routeId: string;
  requiresHumanGo: boolean;
}

const KIND_TO_ROUTE: Record<ActionIntentKind, string> = {
  local_read: "local.read",
  local_write: "local.write",
  discord_read: "discord.read",
  discord_send: "discord.send",
  git_push: "git.push",
  stackchan_device: "stackchan.voice",
  production_change: "production.ready",
  financial: "financial",
  firmware: "firmware.write",
  unknown: "unknown"
};

const KIND_RISK: Record<ActionIntentKind, RiskClass> = {
  local_read: "low",
  local_write: "medium",
  discord_read: "low",
  discord_send: "high",
  git_push: "high",
  stackchan_device: "medium",
  production_change: "critical",
  financial: "critical",
  firmware: "critical",
  unknown: "high"
};

export function classifyAction(intent: ActionIntentKind): ClassifiedAction {
  return {
    kind: intent,
    riskClass: KIND_RISK[intent],
    routeId: KIND_TO_ROUTE[intent],
    requiresHumanGo: KIND_RISK[intent] !== "low"
  };
}
