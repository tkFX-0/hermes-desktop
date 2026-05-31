import {
  isAllowlistedSecretaryPhrase,
  resolveSecretarySpeakPhrase
} from "../shikishima-full-autonomy/secretary-voice-phrase-map";
import { mapVoiceIntentToPhraseId, resolveGuardedVoicePhrase } from "./stackchan-voice-phrase-map";
import { evaluateStackChanVoiceDeviceRoute } from "./stackchan-voice-device-route";
import type { StackChanVoiceDeviceTransportMode } from "./stackchan-voice-device-route-types";
import {
  createDisabledStackChanVoiceTransport,
  createMockStackChanVoiceTransport
} from "./stackchan-voice-transport-mock";
import { createGuardedWsStackChanVoiceTransport } from "./stackchan-voice-transport-guarded";
import type { StackChanVoiceTransport } from "./stackchan-voice-transport-types";
import type {
  StackChanVoiceSendOnceRequest,
  StackChanVoiceSendOnceResult,
  StackChanVoiceSendOnceSafety
} from "./stackchan-voice-send-once-types";

export const STACKCHAN_VOICE_SEND_ONCE_SAFETY: StackChanVoiceSendOnceSafety = {
  displayOnly: false,
  motionAllowed: false,
  danceAllowed: false,
  voiceAllowed: false,
  productionReady: false,
  executionEnabled: false
};

const PILOT_SEND_ENV_FLAG = "STACKCHAN_VOICE_PILOT_SEND";

function buildResult(
  partial: Pick<
    StackChanVoiceSendOnceResult,
    | "ok"
    | "sent"
    | "deviceDecision"
    | "reasons"
    | "phraseId"
    | "mockPayloadRecorded"
    | "websocketSendPerformed"
  > & { transportMode: StackChanVoiceDeviceTransportMode }
): StackChanVoiceSendOnceResult {
  return { ...partial, safety: STACKCHAN_VOICE_SEND_ONCE_SAFETY };
}

function resolveTransport(
  mode: StackChanVoiceDeviceTransportMode,
  override?: StackChanVoiceTransport
): StackChanVoiceTransport {
  if (override) return override;
  if (mode === "mock") return createMockStackChanVoiceTransport();
  if (mode === "guarded-ws") return createGuardedWsStackChanVoiceTransport();
  return createDisabledStackChanVoiceTransport();
}

export async function sendStackChanVoiceOnce(
  request: StackChanVoiceSendOnceRequest,
  transportOverride?: StackChanVoiceTransport
): Promise<StackChanVoiceSendOnceResult> {
  if (request.productionReady !== false || request.executionEnabled !== false) {
    return buildResult({
      ok: false,
      sent: false,
      deviceDecision: "BLOCKED",
      transportMode: request.transportMode,
      phraseId: null,
      mockPayloadRecorded: false,
      websocketSendPerformed: false,
      reasons: ["unsafe_invariant_violation"]
    });
  }

  if (request.actualDeviceSendEnabled && process.env[PILOT_SEND_ENV_FLAG] !== "1") {
    return buildResult({
      ok: false,
      sent: false,
      deviceDecision: "BLOCKED",
      transportMode: request.transportMode,
      phraseId: null,
      mockPayloadRecorded: false,
      websocketSendPerformed: false,
      reasons: ["voice_pilot_go_and_env_required"]
    });
  }

  const mapped = mapVoiceIntentToPhraseId(request.intent);
  if (!mapped.ok) {
    return buildResult({
      ok: false,
      sent: false,
      deviceDecision: "HOLD",
      transportMode: request.transportMode,
      phraseId: null,
      mockPayloadRecorded: false,
      websocketSendPerformed: false,
      reasons: [mapped.reason]
    });
  }

  const phraseId = mapped.phraseId;
  let phrase = resolveGuardedVoicePhrase(request.intent);
  if (request.guardedPhrase) {
    const override =
      resolveSecretarySpeakPhrase(request.guardedPhrase) ??
      (isAllowlistedSecretaryPhrase(request.guardedPhrase) ? request.guardedPhrase : null);
    if (!override) {
      return buildResult({
        ok: false,
        sent: false,
        deviceDecision: "HOLD",
        transportMode: request.transportMode,
        phraseId,
        mockPayloadRecorded: false,
        websocketSendPerformed: false,
        reasons: ["guarded_phrase_not_allowlisted"]
      });
    }
    phrase = override;
  }

  const device = evaluateStackChanVoiceDeviceRoute({
    intent: request.intent,
    humanPresent: request.humanPresent,
    manualStopMethodConfirmed: request.manualStopMethodConfirmed,
    screenVisible: request.screenVisible,
    timeWindowDeclared: request.timeWindowDeclared,
    activeTimeWindow: request.activeTimeWindow,
    explicitPermittedGo: request.explicitPermittedGo,
    timeWindow: request.timeWindow,
    transportMode: request.transportMode,
    actualVoiceSendApproved: false,
    productionReady: false,
    executionEnabled: false
  });

  if (device.decision !== "READY_FOR_PILOT_GO") {
    return buildResult({
      ok: false,
      sent: false,
      deviceDecision: device.decision,
      transportMode: device.transportMode,
      phraseId,
      mockPayloadRecorded: false,
      websocketSendPerformed: false,
      reasons: device.reasons
    });
  }

  const transport = resolveTransport(request.transportMode, transportOverride);

  if (!request.actualDeviceSendEnabled) {
    if (request.transportMode === "mock" || transport.mode === "mock") {
      await transport.sendVoicePhrase(phraseId, phrase);
      return buildResult({
        ok: true,
        sent: false,
        deviceDecision: device.decision,
        transportMode: request.transportMode,
        phraseId,
        mockPayloadRecorded: true,
        websocketSendPerformed: false,
        reasons: []
      });
    }
    return buildResult({
      ok: true,
      sent: false,
      deviceDecision: device.decision,
      transportMode: request.transportMode,
      phraseId,
      mockPayloadRecorded: false,
      websocketSendPerformed: false,
      reasons: ["send_disabled_implementation"]
    });
  }

  if (request.transportMode !== "guarded-ws") {
    return buildResult({
      ok: false,
      sent: false,
      deviceDecision: "BLOCKED",
      transportMode: request.transportMode,
      phraseId,
      mockPayloadRecorded: false,
      websocketSendPerformed: false,
      reasons: ["guarded_ws_required_for_device_send"]
    });
  }

  const sendResult = await transport.sendVoicePhrase(phraseId, phrase);
  return buildResult({
    ok: sendResult.ok,
    sent: sendResult.ok,
    deviceDecision: device.decision,
    transportMode: request.transportMode,
    phraseId,
    mockPayloadRecorded: false,
    websocketSendPerformed: sendResult.ok,
    reasons: sendResult.ok ? [] : [sendResult.errorCode ?? "send_failed"]
  });
}
