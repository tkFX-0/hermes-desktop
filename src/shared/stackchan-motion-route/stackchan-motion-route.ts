import {
  createStackChanMotionPreview,
  isStackChanMotionIntent
} from "../stackchan-motion-preview/stackchan-motion-preview";
import type {
  StackChanMotionRouteRequest,
  StackChanMotionRouteResult,
  StackChanMotionRouteSafety
} from "./stackchan-motion-route-types";

export const STACKCHAN_MOTION_ROUTE_SAFETY: StackChanMotionRouteSafety = {
  displayOnly: false,
  motionAllowed: false,
  danceAllowed: false,
  voiceAllowed: false,
  actualMotionSendPerformed: false,
  actualMotionSendApproved: false,
  productionReady: false,
  executionEnabled: false
};

function buildResult(
  decision: StackChanMotionRouteResult["decision"],
  preview: StackChanMotionRouteResult["preview"],
  reasons: string[]
): StackChanMotionRouteResult {
  return { decision, preview, reasons, safety: STACKCHAN_MOTION_ROUTE_SAFETY };
}

export function evaluateStackChanMotionRoute(
  request: StackChanMotionRouteRequest
): StackChanMotionRouteResult {
  const key = String(request.intent);
  const preview = isStackChanMotionIntent(key)
    ? createStackChanMotionPreview(key)
    : createStackChanMotionPreview("STACKCHAN_MOTION_CENTER");

  if (request.productionReady !== false || request.executionEnabled !== false) {
    return buildResult("BLOCKED", preview, ["unsafe_invariant_violation"]);
  }
  if (request.actualMotionSendApproved !== false) {
    return buildResult("BLOCKED", preview, ["actual_motion_send_not_approved"]);
  }
  if (!isStackChanMotionIntent(key)) {
    return buildResult("BLOCKED", preview, ["motion_intent_invalid"]);
  }

  const hold: string[] = [];
  if (!request.humanPresent) hold.push("human_present_required");
  if (!request.manualStopMethodConfirmed) hold.push("manual_stop_method_required");
  if (!request.screenVisible) hold.push("screen_visible_required");
  if (!request.timeWindowDeclared) hold.push("time_window_declared_required");
  if (!request.activeTimeWindow) hold.push("active_time_window_required");

  if (hold.length > 0) return buildResult("HOLD", preview, hold);
  return buildResult("READY_FOR_FUTURE_SEND", preview, []);
}
