import { evaluateExternalEffect } from "./evaluate-external-effect";
import { evaluateSafetyGovernor } from "./safety-governor";
import type { ShikishimaUnifiedStateSnapshot } from "./snapshot-types";
import { planSurfaceOutput } from "./unified-output-policy";

export const DISCORD_VOICE_BRIDGE_ENV = "SHIKISHIMA_DISCORD_VOICE_BRIDGE";

export type SecretaryVoiceIntent = "secretary_ack" | "secretary_hold" | "secretary_status";

export interface DiscordSecretaryVoicePlanInput {
  messageLength: number;
  redactedPreview: string;
  humanGoApproved: boolean;
  oneShotDeclared: boolean;
  timeWindowActive: boolean;
  voicePilotAudibleAccepted: boolean;
  bridgeEnvEnabled: boolean;
  productionReady: boolean;
  executionEnabled: boolean;
}

export interface DiscordSecretaryVoicePlan {
  decision: "HOLD" | "ALLOW_DRAFT" | "BLOCKED";
  voiceIntent: SecretaryVoiceIntent | null;
  speakPhraseHint: string | null;
  reasons: readonly string[];
  stackchanSubtitleMax: 28;
}

export interface SecretarySessionPlan {
  mode: "home_ap_secretary";
  decision: "HOLD" | "ALLOW_DRAFT";
  statusLine: string;
  discordVoice: DiscordSecretaryVoicePlan;
}

function redactPreview(preview: string): string {
  return preview
    .replace(/\b\d{1,3}(?:\.\d{1,3}){3}\b/g, "[ip]")
    .replace(/\b[A-Fa-f0-9]{16,}\b/g, "[token]")
    .slice(0, 80);
}

export function planDiscordToStackChanVoice(
  input: DiscordSecretaryVoicePlanInput
): DiscordSecretaryVoicePlan {
  const governor = evaluateSafetyGovernor({
    productionReady: input.productionReady,
    executionEnabled: input.executionEnabled,
    rawValuesReported: false,
    retryLoopDetected: false,
    humanVisualAutoPassAttempted: false
  });

  if (governor.decision === "BLOCKED") {
    return {
      decision: "BLOCKED",
      voiceIntent: null,
      speakPhraseHint: null,
      reasons: governor.reasons,
      stackchanSubtitleMax: 28
    };
  }

  if (!input.bridgeEnvEnabled) {
    return {
      decision: "HOLD",
      voiceIntent: null,
      speakPhraseHint: null,
      reasons: ["discord_voice_bridge_disabled"],
      stackchanSubtitleMax: 28
    };
  }

  const effect = evaluateExternalEffect({
    routeId: "stackchan.voice",
    humanGoApproved: input.humanGoApproved,
    oneShotDeclared: input.oneShotDeclared,
    timeWindowActive: input.timeWindowActive,
    dryRunOnly: true,
    productionReady: input.productionReady,
    executionEnabled: input.executionEnabled,
    voicePilotAudibleAccepted: input.voicePilotAudibleAccepted
  });

  if (effect.decision === "ALLOW_DRAFT") {
    const preview = redactPreview(input.redactedPreview);
    return {
      decision: "ALLOW_DRAFT",
      voiceIntent: "secretary_ack",
      speakPhraseHint: preview.length > 0 ? preview.slice(0, 28) : "了解しました",
      reasons: [],
      stackchanSubtitleMax: 28
    };
  }

  return {
    decision: "HOLD",
    voiceIntent: "secretary_hold",
    speakPhraseHint: null,
    reasons: effect.reasons.length > 0 ? effect.reasons : ["gates_not_met"],
    stackchanSubtitleMax: 28
  };
}

export function planSecretarySession(
  snapshot: ShikishimaUnifiedStateSnapshot,
  bridgeEnvEnabled: boolean
): SecretarySessionPlan {
  const stackchanLine = planSurfaceOutput(snapshot, "stackchan").body;
  const discordVoice = planDiscordToStackChanVoice({
    messageLength: 0,
    redactedPreview: stackchanLine,
    humanGoApproved: snapshot.humanGate.humanGoApproved,
    oneShotDeclared: snapshot.humanGate.timeWindowActive,
    timeWindowActive: snapshot.humanGate.timeWindowActive,
    voicePilotAudibleAccepted: snapshot.stackchan.voicePilotAudibleAccepted,
    bridgeEnvEnabled,
    productionReady: false,
    executionEnabled: false
  });

  return {
    mode: "home_ap_secretary",
    decision: snapshot.globalDecision === "ALLOW_DRAFT" ? "ALLOW_DRAFT" : "HOLD",
    statusLine: stackchanLine,
    discordVoice
  };
}
