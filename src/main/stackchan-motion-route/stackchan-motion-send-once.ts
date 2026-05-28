import { mapMotionIntentToPresetAction } from "./stackchan-motion-preset-map";
import { evaluateStackChanMotionDeviceRoute } from "./stackchan-motion-device-route";
import type { StackChanMotionDeviceTransportMode } from "./stackchan-motion-device-route-types";
import {
  createDisabledStackChanMotionTransport,
  createMockStackChanMotionTransport
} from "./stackchan-motion-transport-mock";
import { createGuardedWsStackChanMotionTransport } from "./stackchan-motion-transport-guarded";
import type { StackChanMotionTransport } from "./stackchan-motion-transport-types";
import type {
  StackChanMotionSendOnceRequest,
  StackChanMotionSendOnceResult,
  StackChanMotionSendOnceSafety
} from "./stackchan-motion-send-once-types";

export const STACKCHAN_MOTION_SEND_ONCE_SAFETY: StackChanMotionSendOnceSafety = {
  displayOnly: false,
  motionAllowed: false,
  danceAllowed: false,
  voiceAllowed: false,
  productionReady: false,
  executionEnabled: false
};

const PILOT_SEND_ENV_FLAG = "STACKCHAN_MOTION_PILOT_SEND";

function buildResult(
  partial: Pick<
    StackChanMotionSendOnceResult,
    | "ok"
    | "sent"
    | "deviceDecision"
    | "reasons"
    | "presetAction"
    | "mockPayloadRecorded"
    | "websocketSendPerformed"
  > & { transportMode: StackChanMotionDeviceTransportMode }
): StackChanMotionSendOnceResult {
  return { ...partial, safety: STACKCHAN_MOTION_SEND_ONCE_SAFETY };
}

function resolveTransport(
  mode: StackChanMotionDeviceTransportMode,
  override?: StackChanMotionTransport
): StackChanMotionTransport {
  if (override) return override;
  if (mode === "mock") return createMockStackChanMotionTransport();
  if (mode === "guarded-ws") return createGuardedWsStackChanMotionTransport();
  return createDisabledStackChanMotionTransport();
}

export async function sendStackChanMotionOnce(
  request: StackChanMotionSendOnceRequest,
  transportOverride?: StackChanMotionTransport
): Promise<StackChanMotionSendOnceResult> {
  if (request.productionReady !== false || request.executionEnabled !== false) {
    return buildResult({
      ok: false,
      sent: false,
      deviceDecision: "BLOCKED",
      transportMode: request.transportMode,
      presetAction: null,
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
      presetAction: null,
      mockPayloadRecorded: false,
      websocketSendPerformed: false,
      reasons: ["motion_pilot_go_and_env_required"]
    });
  }

  const mapped = mapMotionIntentToPresetAction(request.intent);
  if (!mapped.ok) {
    return buildResult({
      ok: false,
      sent: false,
      deviceDecision: "HOLD",
      transportMode: request.transportMode,
      presetAction: null,
      mockPayloadRecorded: false,
      websocketSendPerformed: false,
      reasons: [mapped.reason]
    });
  }

  const presetAction = mapped.presetAction;

  const device = evaluateStackChanMotionDeviceRoute({
    intent: request.intent,
    humanPresent: request.humanPresent,
    manualStopMethodConfirmed: request.manualStopMethodConfirmed,
    screenVisible: request.screenVisible,
    timeWindowDeclared: request.timeWindowDeclared,
    activeTimeWindow: request.activeTimeWindow,
    timeWindow: request.timeWindow,
    transportMode: request.transportMode,
    actualMotionSendApproved: false,
    productionReady: false,
    executionEnabled: false
  });

  if (device.decision !== "READY_FOR_PILOT_GO") {
    return buildResult({
      ok: false,
      sent: false,
      deviceDecision: device.decision,
      transportMode: device.transportMode,
      presetAction,
      mockPayloadRecorded: false,
      websocketSendPerformed: false,
      reasons: device.reasons
    });
  }

  const transport = resolveTransport(request.transportMode, transportOverride);

  if (!request.actualDeviceSendEnabled) {
    if (request.transportMode === "mock" || transport.mode === "mock") {
      await transport.sendMovePreset(presetAction);
      return buildResult({
        ok: true,
        sent: false,
        deviceDecision: device.decision,
        transportMode: request.transportMode,
        presetAction,
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
      presetAction,
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
      presetAction,
      mockPayloadRecorded: false,
      websocketSendPerformed: false,
      reasons: ["guarded_ws_required_for_device_send"]
    });
  }

  const sendResult = await transport.sendMovePreset(presetAction);
  return buildResult({
    ok: sendResult.ok,
    sent: sendResult.ok,
    deviceDecision: device.decision,
    transportMode: request.transportMode,
    presetAction,
    mockPayloadRecorded: false,
    websocketSendPerformed: sendResult.ok,
    reasons: sendResult.ok ? [] : [sendResult.errorCode ?? "send_failed"]
  });
}
