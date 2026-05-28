import type { AutonomyDecision } from "./snapshot-types";

export type ExternalEffectRisk = "low" | "medium" | "high" | "critical";

export interface ExternalEffectDefinition {
  routeId: string;
  effectType: string;
  riskLevel: ExternalEffectRisk;
  defaultDecision: AutonomyDecision;
  requiresHumanGo: boolean;
  allowsAutonomousExecution: boolean;
  oneShotRequired: boolean;
  timeWindowRequired: boolean;
  evidenceRequired: boolean;
}

export const EXTERNAL_EFFECT_REGISTRY: readonly ExternalEffectDefinition[] = [
  {
    routeId: "stackchan.display",
    effectType: "device_display",
    riskLevel: "medium",
    defaultDecision: "HOLD",
    requiresHumanGo: true,
    allowsAutonomousExecution: false,
    oneShotRequired: true,
    timeWindowRequired: true,
    evidenceRequired: true
  },
  {
    routeId: "stackchan.motion",
    effectType: "device_motion",
    riskLevel: "medium",
    defaultDecision: "HOLD",
    requiresHumanGo: true,
    allowsAutonomousExecution: false,
    oneShotRequired: true,
    timeWindowRequired: true,
    evidenceRequired: true
  },
  {
    routeId: "stackchan.voice",
    effectType: "device_voice",
    riskLevel: "medium",
    defaultDecision: "HOLD",
    requiresHumanGo: true,
    allowsAutonomousExecution: false,
    oneShotRequired: true,
    timeWindowRequired: true,
    evidenceRequired: true
  },
  {
    routeId: "discord.read",
    effectType: "discord_read",
    riskLevel: "low",
    defaultDecision: "HOLD",
    requiresHumanGo: true,
    allowsAutonomousExecution: false,
    oneShotRequired: false,
    timeWindowRequired: false,
    evidenceRequired: true
  },
  {
    routeId: "discord.send",
    effectType: "discord_send",
    riskLevel: "high",
    defaultDecision: "HOLD",
    requiresHumanGo: true,
    allowsAutonomousExecution: false,
    oneShotRequired: true,
    timeWindowRequired: false,
    evidenceRequired: true
  },
  {
    routeId: "git.push",
    effectType: "git_push",
    riskLevel: "high",
    defaultDecision: "HOLD",
    requiresHumanGo: true,
    allowsAutonomousExecution: false,
    oneShotRequired: false,
    timeWindowRequired: false,
    evidenceRequired: true
  },
  {
    routeId: "production.ready",
    effectType: "production_ready_change",
    riskLevel: "critical",
    defaultDecision: "BLOCKED",
    requiresHumanGo: true,
    allowsAutonomousExecution: false,
    oneShotRequired: false,
    timeWindowRequired: false,
    evidenceRequired: true
  },
  {
    routeId: "stackchan.dance",
    effectType: "device_motion",
    riskLevel: "high",
    defaultDecision: "BLOCKED",
    requiresHumanGo: true,
    allowsAutonomousExecution: false,
    oneShotRequired: true,
    timeWindowRequired: true,
    evidenceRequired: true
  },
  {
    routeId: "stackchan.mic",
    effectType: "mic_input",
    riskLevel: "critical",
    defaultDecision: "BLOCKED",
    requiresHumanGo: true,
    allowsAutonomousExecution: false,
    oneShotRequired: false,
    timeWindowRequired: false,
    evidenceRequired: true
  },
  {
    routeId: "stackchan.camera",
    effectType: "camera_input",
    riskLevel: "critical",
    defaultDecision: "BLOCKED",
    requiresHumanGo: true,
    allowsAutonomousExecution: false,
    oneShotRequired: false,
    timeWindowRequired: false,
    evidenceRequired: true
  },
  {
    routeId: "obsidian.write",
    effectType: "obsidian_write",
    riskLevel: "high",
    defaultDecision: "HOLD",
    requiresHumanGo: true,
    allowsAutonomousExecution: false,
    oneShotRequired: true,
    timeWindowRequired: false,
    evidenceRequired: true
  },
  {
    routeId: "github.write",
    effectType: "github_write",
    riskLevel: "high",
    defaultDecision: "HOLD",
    requiresHumanGo: true,
    allowsAutonomousExecution: false,
    oneShotRequired: false,
    timeWindowRequired: false,
    evidenceRequired: true
  },
  {
    routeId: "financial",
    effectType: "financial_action",
    riskLevel: "critical",
    defaultDecision: "BLOCKED",
    requiresHumanGo: true,
    allowsAutonomousExecution: false,
    oneShotRequired: false,
    timeWindowRequired: false,
    evidenceRequired: true
  },
  {
    routeId: "firmware.write",
    effectType: "firmware_write",
    riskLevel: "critical",
    defaultDecision: "BLOCKED",
    requiresHumanGo: true,
    allowsAutonomousExecution: false,
    oneShotRequired: false,
    timeWindowRequired: false,
    evidenceRequired: true
  }
] as const;

export function getExternalEffectDefinition(
  routeId: string
): ExternalEffectDefinition | undefined {
  return EXTERNAL_EFFECT_REGISTRY.find((e) => e.routeId === routeId);
}
