/**
 * Phase 7 — Discord → StackChan voice bridge (guarded send only).
 * Default: HOLD. Requires env + phase1 audible + external-effect gates.
 */

import { sendStackChanVoiceOnce } from "../stackchan-voice-route/stackchan-voice-send-once";
import type {
  StackChanVoiceSendOnceRequest,
  StackChanVoiceSendOnceResult
} from "../stackchan-voice-route/stackchan-voice-send-once-types";
import {
  DISCORD_VOICE_BRIDGE_ENV,
  planDiscordToStackChanVoice,
  type DiscordSecretaryVoicePlanInput
} from "./secretary-mode";

export interface DiscordSecretaryVoiceBridgeInput extends DiscordSecretaryVoicePlanInput {
  actualDeviceSendEnabled: boolean;
  humanPresent: boolean;
  manualStopMethodConfirmed: boolean;
  screenVisible: boolean;
  timeWindowDeclared: boolean;
  activeTimeWindow: boolean;
}

export interface DiscordSecretaryVoiceBridgeResult {
  planDecision: "HOLD" | "ALLOW_DRAFT" | "BLOCKED";
  reasons: readonly string[];
  sendResult: StackChanVoiceSendOnceResult | null;
}

export function isDiscordVoiceBridgeEnvEnabled(): boolean {
  return process.env[DISCORD_VOICE_BRIDGE_ENV] === "1";
}

function buildActivePilotTimeWindow(): NonNullable<StackChanVoiceSendOnceRequest["timeWindow"]> {
  const now = Date.now();
  return {
    startIso: new Date(now - 60_000).toISOString(),
    endIso: new Date(now + 600_000).toISOString()
  };
}

export async function runDiscordSecretaryVoiceBridge(
  input: DiscordSecretaryVoiceBridgeInput
): Promise<DiscordSecretaryVoiceBridgeResult> {
  const plan = planDiscordToStackChanVoice({
    ...input,
    bridgeEnvEnabled: input.bridgeEnvEnabled && isDiscordVoiceBridgeEnvEnabled()
  });

  if (plan.decision !== "ALLOW_DRAFT" || !plan.speakPhraseHint) {
    return { planDecision: plan.decision, reasons: plan.reasons, sendResult: null };
  }

  const sendResult = await sendStackChanVoiceOnce({
    intent: "STACKCHAN_VOICE_PILOT_ACK",
    transportMode: input.actualDeviceSendEnabled ? "guarded-ws" : "mock",
    actualDeviceSendEnabled: input.actualDeviceSendEnabled,
    humanPresent: input.humanPresent,
    manualStopMethodConfirmed: input.manualStopMethodConfirmed,
    screenVisible: input.screenVisible,
    timeWindowDeclared: input.timeWindowDeclared,
    activeTimeWindow: input.activeTimeWindow,
    timeWindow: input.activeTimeWindow ? buildActivePilotTimeWindow() : undefined,
    explicitPermittedGo: input.humanGoApproved,
    productionReady: false,
    executionEnabled: false
  });

  return {
    planDecision: plan.decision,
    reasons: sendResult.ok ? [] : sendResult.reasons,
    sendResult
  };
}
