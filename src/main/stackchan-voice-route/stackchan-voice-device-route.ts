import { evaluateStackChanVoicePilotReadiness } from "../../shared/stackchan-voice-pilot-readiness/stackchan-voice-pilot-readiness";
import type { StackChanDisplayPilotTimeWindow } from "../../shared/stackchan-display-pilot-readiness/stackchan-display-pilot-readiness-types";
import { evaluateStackChanVoiceRoute } from "../../shared/stackchan-voice-route/stackchan-voice-route";
import type {
  StackChanVoiceDeviceRequest,
  StackChanVoiceDeviceResult,
  StackChanVoiceDeviceSafety,
  StackChanVoiceDeviceTransportMode
} from "./stackchan-voice-device-route-types";

export const STACKCHAN_VOICE_DEVICE_ROUTE_SAFETY: StackChanVoiceDeviceSafety = {
  displayOnly: false,
  actualVoiceSendApproved: false,
  actualVoiceSendPerformed: false,
  motionAllowed: false,
  danceAllowed: false,
  voiceAllowed: false,
  productionReady: false,
  executionEnabled: false
};

const ALLOWED: readonly StackChanVoiceDeviceTransportMode[] = ["disabled", "mock", "guarded-ws"];

function buildResult(
  decision: StackChanVoiceDeviceResult["decision"],
  routeDecision: StackChanVoiceDeviceResult["routeDecision"],
  transportMode: StackChanVoiceDeviceTransportMode,
  reasons: string[]
): StackChanVoiceDeviceResult {
  return {
    decision,
    routeDecision,
    transportMode,
    voiceSendPerformed: false,
    websocketSendPerformed: false,
    reasons,
    safety: STACKCHAN_VOICE_DEVICE_ROUTE_SAFETY
  };
}

function pilotTimeWindow(request: StackChanVoiceDeviceRequest): StackChanDisplayPilotTimeWindow {
  if (request.timeWindow) return request.timeWindow;
  if (!request.timeWindowDeclared || !request.activeTimeWindow) {
    return { startIso: "", endIso: "" };
  }
  return { startIso: "2026-05-28T06:00:00.000Z", endIso: "2026-05-28T07:00:00.000Z" };
}

export function evaluateStackChanVoiceDeviceRoute(
  request: StackChanVoiceDeviceRequest
): StackChanVoiceDeviceResult {
  const transportMode = request.transportMode;

  if (!(ALLOWED as readonly string[]).includes(transportMode)) {
    return buildResult("BLOCKED", "BLOCKED", transportMode, ["transport_mode_forbidden"]);
  }

  if (request.productionReady !== false || request.executionEnabled !== false) {
    return buildResult("BLOCKED", "BLOCKED", transportMode, ["unsafe_invariant_violation"]);
  }
  if (request.actualVoiceSendApproved !== false) {
    return buildResult("BLOCKED", "BLOCKED", transportMode, ["actual_voice_send_not_approved"]);
  }

  const readiness = evaluateStackChanVoicePilotReadiness({
    humanPresent: request.humanPresent,
    manualStopMethodConfirmed: request.manualStopMethodConfirmed,
    stackChanScreenVisible: request.screenVisible,
    timeWindow: pilotTimeWindow(request),
    voiceIntent: request.intent,
    explicitPermittedGo: request.explicitPermittedGo
  });

  if (!readiness.ready) {
    return buildResult("HOLD", "HOLD", transportMode, readiness.reasons);
  }

  const route = evaluateStackChanVoiceRoute({
    intent: request.intent,
    humanPresent: request.humanPresent,
    manualStopMethodConfirmed: request.manualStopMethodConfirmed,
    screenVisible: request.screenVisible,
    timeWindowDeclared: request.timeWindowDeclared,
    activeTimeWindow: request.activeTimeWindow,
    explicitPermittedGo: request.explicitPermittedGo,
    actualVoiceSendApproved: false,
    productionReady: false,
    executionEnabled: false
  });

  if (route.decision === "BLOCKED") {
    return buildResult("BLOCKED", route.decision, transportMode, route.reasons);
  }
  if (route.decision === "HOLD") {
    return buildResult("HOLD", route.decision, transportMode, route.reasons);
  }

  return buildResult("READY_FOR_PILOT_GO", route.decision, transportMode, []);
}
