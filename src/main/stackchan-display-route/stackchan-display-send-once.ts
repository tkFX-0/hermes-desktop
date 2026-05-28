import { createStackChanDisplayPreview } from "../../shared/stackchan-display-preview/stackchan-display-preview";
import {
  mapFaceMoodToDeviceFaceMode,
  type StackChanDeviceFaceMode
} from "./stackchan-display-face-mode-map";
import { evaluateStackChanDisplayDeviceRoute } from "./stackchan-display-device-route";
import type { StackChanDisplayDeviceTransportMode } from "./stackchan-display-device-route-types";
import {
  createDisabledStackChanDisplayTransport,
  createMockStackChanDisplayTransport
} from "./stackchan-display-transport-mock";
import { createGuardedWsStackChanDisplayTransport } from "./stackchan-display-transport-guarded";
import type { StackChanDisplayTransport } from "./stackchan-display-transport-types";
import type {
  StackChanDisplaySendOnceRequest,
  StackChanDisplaySendOnceResult,
  StackChanDisplaySendOnceSafety
} from "./stackchan-display-send-once-types";

export const STACKCHAN_DISPLAY_SEND_ONCE_SAFETY: StackChanDisplaySendOnceSafety = {
  displayOnly: true,
  actualDisplaySendApproved: false,
  motionAllowed: false,
  danceAllowed: false,
  touchBehaviorChangeAllowed: false,
  voiceAllowed: false,
  micAllowed: false,
  cameraAllowed: false,
  firmwareWriteAllowed: false,
  externalActionAllowed: false,
  productionReady: false,
  executionEnabled: false
};

const PILOT_SEND_ENV_FLAG = "STACKCHAN_DISPLAY_PILOT_SEND";

function buildSendResult(
  partial: Pick<
    StackChanDisplaySendOnceResult,
    "ok" | "sent" | "deviceDecision" | "reasons" | "faceMode" | "mockPayloadRecorded" | "websocketSendPerformed"
  > & { transportMode: StackChanDisplayDeviceTransportMode }
): StackChanDisplaySendOnceResult {
  return {
    ...partial,
    stackchanConnectedByCommand: false,
    safety: STACKCHAN_DISPLAY_SEND_ONCE_SAFETY
  };
}

function resolveTransport(
  mode: StackChanDisplayDeviceTransportMode,
  override?: StackChanDisplayTransport
): StackChanDisplayTransport {
  if (override) return override;
  if (mode === "mock") return createMockStackChanDisplayTransport();
  if (mode === "guarded-ws") return createGuardedWsStackChanDisplayTransport();
  return createDisabledStackChanDisplayTransport();
}

export async function sendStackChanDisplayOnce(
  request: StackChanDisplaySendOnceRequest,
  transportOverride?: StackChanDisplayTransport
): Promise<StackChanDisplaySendOnceResult> {
  if (request.productionReady !== false || request.executionEnabled !== false) {
    return buildSendResult({
      ok: false,
      sent: false,
      deviceDecision: "BLOCKED",
      transportMode: request.transportMode,
      faceMode: null,
      mockPayloadRecorded: false,
      websocketSendPerformed: false,
      reasons: ["unsafe_invariant_violation"]
    });
  }

  if (request.actualDeviceSendEnabled && process.env[PILOT_SEND_ENV_FLAG] !== "1") {
    return buildSendResult({
      ok: false,
      sent: false,
      deviceDecision: "BLOCKED",
      transportMode: request.transportMode,
      faceMode: null,
      mockPayloadRecorded: false,
      websocketSendPerformed: false,
      reasons: ["rally_4b_go_and_env_required"]
    });
  }

  const preview = createStackChanDisplayPreview(request.intent);
  const mapped = mapFaceMoodToDeviceFaceMode(preview.faceMood);
  if (!mapped.ok) {
    return buildSendResult({
      ok: false,
      sent: false,
      deviceDecision: "HOLD",
      transportMode: request.transportMode,
      faceMode: null,
      mockPayloadRecorded: false,
      websocketSendPerformed: false,
      reasons: [mapped.reason]
    });
  }

  const faceMode: StackChanDeviceFaceMode = mapped.faceMode;

  const device = evaluateStackChanDisplayDeviceRoute({
    intent: request.intent,
    humanPresent: request.humanPresent,
    manualStopMethodConfirmed: request.manualStopMethodConfirmed,
    screenVisible: request.screenVisible,
    timeWindowDeclared: request.timeWindowDeclared,
    activeTimeWindow: request.activeTimeWindow,
    timeWindow: request.timeWindow,
    transportMode: request.transportMode,
    actualDisplaySendApproved: false,
    productionReady: false,
    executionEnabled: false
  });

  if (device.decision !== "READY_FOR_PILOT_GO") {
    return buildSendResult({
      ok: false,
      sent: false,
      deviceDecision: device.decision,
      transportMode: device.transportMode,
      faceMode,
      mockPayloadRecorded: false,
      websocketSendPerformed: false,
      reasons: device.reasons
    });
  }

  const transport = resolveTransport(request.transportMode, transportOverride);

  if (!request.actualDeviceSendEnabled) {
    if (request.transportMode === "mock" || transport.mode === "mock") {
      await transport.sendFaceMode(faceMode);
      return buildSendResult({
        ok: true,
        sent: false,
        deviceDecision: device.decision,
        transportMode: request.transportMode,
        faceMode,
        mockPayloadRecorded: true,
        websocketSendPerformed: false,
        reasons: []
      });
    }
    return buildSendResult({
      ok: true,
      sent: false,
      deviceDecision: device.decision,
      transportMode: request.transportMode,
      faceMode,
      mockPayloadRecorded: false,
      websocketSendPerformed: false,
      reasons: ["send_disabled_rally_4a"]
    });
  }

  if (request.transportMode !== "guarded-ws") {
    return buildSendResult({
      ok: false,
      sent: false,
      deviceDecision: "BLOCKED",
      transportMode: request.transportMode,
      faceMode,
      mockPayloadRecorded: false,
      websocketSendPerformed: false,
      reasons: ["guarded_ws_required_for_device_send"]
    });
  }

  const sendResult = await transport.sendFaceMode(faceMode);
  return buildSendResult({
    ok: sendResult.ok,
    sent: sendResult.ok,
    deviceDecision: device.decision,
    transportMode: request.transportMode,
    faceMode,
    mockPayloadRecorded: false,
    websocketSendPerformed: sendResult.ok,
    reasons: sendResult.ok ? [] : [sendResult.errorCode ?? "send_failed"]
  });
}
