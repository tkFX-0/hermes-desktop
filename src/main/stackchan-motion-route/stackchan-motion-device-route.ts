import { evaluateStackChanMotionPilotReadiness } from "../../shared/stackchan-motion-pilot-readiness/stackchan-motion-pilot-readiness";
import type { StackChanDisplayPilotTimeWindow } from "../../shared/stackchan-display-pilot-readiness/stackchan-display-pilot-readiness-types";
import { evaluateStackChanMotionRoute } from "../../shared/stackchan-motion-route/stackchan-motion-route";
import type {
  StackChanMotionDeviceRequest,
  StackChanMotionDeviceResult,
  StackChanMotionDeviceSafety,
  StackChanMotionDeviceTransportMode
} from "./stackchan-motion-device-route-types";

export const STACKCHAN_MOTION_DEVICE_ROUTE_SAFETY: StackChanMotionDeviceSafety = {
  displayOnly: false,
  actualMotionSendApproved: false,
  actualMotionSendPerformed: false,
  motionAllowed: false,
  danceAllowed: false,
  voiceAllowed: false,
  productionReady: false,
  executionEnabled: false
};

const ALLOWED: readonly StackChanMotionDeviceTransportMode[] = ["disabled", "mock", "guarded-ws"];

function buildResult(
  decision: StackChanMotionDeviceResult["decision"],
  routeDecision: StackChanMotionDeviceResult["routeDecision"],
  transportMode: StackChanMotionDeviceTransportMode,
  reasons: string[]
): StackChanMotionDeviceResult {
  return {
    decision,
    routeDecision,
    transportMode,
    motionSendPerformed: false,
    websocketSendPerformed: false,
    reasons,
    safety: STACKCHAN_MOTION_DEVICE_ROUTE_SAFETY
  };
}

function pilotTimeWindow(request: StackChanMotionDeviceRequest): StackChanDisplayPilotTimeWindow {
  if (request.timeWindow) return request.timeWindow;
  if (!request.timeWindowDeclared || !request.activeTimeWindow) {
    return { startIso: "", endIso: "" };
  }
  return { startIso: "2026-05-28T06:00:00.000Z", endIso: "2026-05-28T07:00:00.000Z" };
}

export function evaluateStackChanMotionDeviceRoute(
  request: StackChanMotionDeviceRequest
): StackChanMotionDeviceResult {
  const transportMode = request.transportMode;

  if (!(ALLOWED as readonly string[]).includes(transportMode)) {
    return buildResult("BLOCKED", "BLOCKED", transportMode, ["transport_mode_forbidden"]);
  }

  if (request.productionReady !== false || request.executionEnabled !== false) {
    return buildResult("BLOCKED", "BLOCKED", transportMode, ["unsafe_invariant_violation"]);
  }
  if (request.actualMotionSendApproved !== false) {
    return buildResult("BLOCKED", "BLOCKED", transportMode, ["actual_motion_send_not_approved"]);
  }

  const readiness = evaluateStackChanMotionPilotReadiness({
    humanPresent: request.humanPresent,
    manualStopMethodConfirmed: request.manualStopMethodConfirmed,
    stackChanScreenVisible: request.screenVisible,
    timeWindow: pilotTimeWindow(request),
    motionIntent: request.intent
  });

  if (!readiness.ready) {
    return buildResult("HOLD", "HOLD", transportMode, readiness.reasons);
  }

  const route = evaluateStackChanMotionRoute({
    intent: request.intent,
    humanPresent: request.humanPresent,
    manualStopMethodConfirmed: request.manualStopMethodConfirmed,
    screenVisible: request.screenVisible,
    timeWindowDeclared: request.timeWindowDeclared,
    activeTimeWindow: request.activeTimeWindow,
    actualMotionSendApproved: false,
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
