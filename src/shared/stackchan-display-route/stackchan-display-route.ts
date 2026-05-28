import {
  createStackChanDisplayPreview,
  isStackChanDisplayIntent,
  resolveStackChanDisplayPreview
} from "../stackchan-display-preview/stackchan-display-preview";
import type {
  StackChanDisplayRouteRequest,
  StackChanDisplayRouteResult,
  StackChanDisplayRouteSafety
} from "./stackchan-display-route-types";

export const STACKCHAN_DISPLAY_ROUTE_SAFETY: StackChanDisplayRouteSafety = {
  displayOnly: true,
  actualDisplaySendPerformed: false,
  actualDisplaySendApproved: false,
  stackchanConnectedByCommand: false,
  serialConnected: false,
  websocketSend: false,
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

function buildResult(
  decision: StackChanDisplayRouteResult["decision"],
  preview: StackChanDisplayRouteResult["preview"],
  reasons: string[]
): StackChanDisplayRouteResult {
  return {
    decision,
    preview,
    reasons,
    safety: STACKCHAN_DISPLAY_ROUTE_SAFETY
  };
}

function isUnsafeInvariantViolation(request: StackChanDisplayRouteRequest): string[] {
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

export function evaluateStackChanDisplayRoute(
  request: StackChanDisplayRouteRequest
): StackChanDisplayRouteResult {
  const intentKey = String(request.intent);
  const previewForIntent = isStackChanDisplayIntent(intentKey)
    ? createStackChanDisplayPreview(intentKey)
    : resolveStackChanDisplayPreview(intentKey);

  const invariantReasons = isUnsafeInvariantViolation(request);
  if (invariantReasons.length > 0) {
    return buildResult("BLOCKED", previewForIntent, invariantReasons);
  }

  if (!isStackChanDisplayIntent(intentKey)) {
    return buildResult("BLOCKED", resolveStackChanDisplayPreview("HOLD"), [
      "display_intent_invalid"
    ]);
  }

  const preview = createStackChanDisplayPreview(intentKey);
  const holdReasons: string[] = [];

  if (!request.humanPresent) {
    holdReasons.push("human_present_required");
  }
  if (!request.manualStopMethodConfirmed) {
    holdReasons.push("manual_stop_method_required");
  }
  if (!request.screenVisible) {
    holdReasons.push("screen_visible_required");
  }
  if (!request.timeWindowDeclared) {
    holdReasons.push("time_window_declared_required");
  }
  if (!request.activeTimeWindow) {
    holdReasons.push("active_time_window_required");
  }

  if (holdReasons.length > 0) {
    return buildResult("HOLD", preview, holdReasons);
  }

  return buildResult("READY_FOR_FUTURE_SEND", preview, []);
}
