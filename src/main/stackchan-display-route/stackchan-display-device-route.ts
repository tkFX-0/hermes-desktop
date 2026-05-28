import { evaluateStackChanDisplayPilotReadiness } from "../../shared/stackchan-display-pilot-readiness/stackchan-display-pilot-readiness";
import type { StackChanDisplayPilotTimeWindow } from "../../shared/stackchan-display-pilot-readiness/stackchan-display-pilot-readiness-types";
import { evaluateStackChanDisplayRoute } from "../../shared/stackchan-display-route/stackchan-display-route";
import type {
  StackChanDisplayDeviceRequest,
  StackChanDisplayDeviceResult,
  StackChanDisplayDeviceSafety,
  StackChanDisplayDeviceTransportMode
} from "./stackchan-display-device-route-types";

export const STACKCHAN_DISPLAY_DEVICE_ROUTE_SAFETY: StackChanDisplayDeviceSafety = {
  displayOnly: true,
  actualDisplaySendApproved: false,
  actualDisplaySendPerformed: false,
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

const ALLOWED_TRANSPORT_MODES: readonly StackChanDisplayDeviceTransportMode[] = [
  "disabled",
  "mock",
  "guarded-ws"
];

function buildResult(
  decision: StackChanDisplayDeviceResult["decision"],
  routeDecision: StackChanDisplayDeviceResult["routeDecision"],
  transportMode: StackChanDisplayDeviceTransportMode,
  reasons: string[]
): StackChanDisplayDeviceResult {
  return {
    decision,
    routeDecision,
    transportMode,
    displaySendPerformed: false,
    stackchanConnectedByCommand: false,
    websocketSendPerformed: false,
    reasons,
    safety: STACKCHAN_DISPLAY_DEVICE_ROUTE_SAFETY
  };
}

function pilotTimeWindowForRequest(
  request: StackChanDisplayDeviceRequest
): StackChanDisplayPilotTimeWindow {
  if (request.timeWindow) {
    return request.timeWindow;
  }
  if (!request.timeWindowDeclared || !request.activeTimeWindow) {
    return { startIso: "", endIso: "" };
  }
  return {
    startIso: "2026-05-28T03:00:00.000Z",
    endIso: "2026-05-28T04:00:00.000Z"
  };
}

function isUnsafeInvariantViolation(request: StackChanDisplayDeviceRequest): string[] {
  const blocked: string[] = [];
  if (request.productionReady !== false) {
    blocked.push("production_ready_must_be_false");
  }
  if (request.executionEnabled !== false) {
    blocked.push("execution_must_be_disabled");
  }
  if (request.actualDisplaySendApproved !== false) {
    blocked.push("actual_display_send_not_approved");
  }
  return blocked;
}

function isAllowedTransportMode(
  mode: string
): mode is StackChanDisplayDeviceTransportMode {
  return (ALLOWED_TRANSPORT_MODES as readonly string[]).includes(mode);
}

export function evaluateStackChanDisplayDeviceRoute(
  request: StackChanDisplayDeviceRequest
): StackChanDisplayDeviceResult {
  const transportMode = request.transportMode;

  if (!isAllowedTransportMode(transportMode)) {
    return buildResult("BLOCKED", "BLOCKED", transportMode as StackChanDisplayDeviceTransportMode, [
      "transport_mode_forbidden"
    ]);
  }

  const invariantReasons = isUnsafeInvariantViolation(request);
  if (invariantReasons.length > 0) {
    return buildResult("BLOCKED", "BLOCKED", transportMode, invariantReasons);
  }

  const readiness = evaluateStackChanDisplayPilotReadiness({
    humanPresent: request.humanPresent,
    manualStopMethodConfirmed: request.manualStopMethodConfirmed,
    stackChanScreenVisible: request.screenVisible,
    timeWindow: pilotTimeWindowForRequest(request),
    displayIntent: request.intent
  });

  if (!readiness.ready) {
    return buildResult("HOLD", "HOLD", transportMode, readiness.reasons);
  }

  const route = evaluateStackChanDisplayRoute({
    intent: request.intent,
    humanPresent: request.humanPresent,
    manualStopMethodConfirmed: request.manualStopMethodConfirmed,
    screenVisible: request.screenVisible,
    timeWindowDeclared: request.timeWindowDeclared,
    activeTimeWindow: request.activeTimeWindow,
    actualDisplaySendApproved: false,
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
