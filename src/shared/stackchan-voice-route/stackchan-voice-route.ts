import {
  createStackChanVoicePreview,
  isStackChanVoiceIntent
} from "../stackchan-voice-preview/stackchan-voice-preview";
import type {
  StackChanVoiceRouteRequest,
  StackChanVoiceRouteResult,
  StackChanVoiceRouteSafety
} from "./stackchan-voice-route-types";

export const STACKCHAN_VOICE_ROUTE_SAFETY: StackChanVoiceRouteSafety = {
  displayOnly: false,
  motionAllowed: false,
  danceAllowed: false,
  voiceAllowed: false,
  actualVoiceSendPerformed: false,
  actualVoiceSendApproved: false,
  productionReady: false,
  executionEnabled: false
};

function buildResult(
  decision: StackChanVoiceRouteResult["decision"],
  preview: StackChanVoiceRouteResult["preview"],
  reasons: string[]
): StackChanVoiceRouteResult {
  return { decision, preview, reasons, safety: STACKCHAN_VOICE_ROUTE_SAFETY };
}

export function evaluateStackChanVoiceRoute(
  request: StackChanVoiceRouteRequest
): StackChanVoiceRouteResult {
  const key = String(request.intent);
  const preview = isStackChanVoiceIntent(key)
    ? createStackChanVoicePreview(key)
    : createStackChanVoicePreview("STACKCHAN_VOICE_PILOT_ACK");

  if (request.productionReady !== false || request.executionEnabled !== false) {
    return buildResult("BLOCKED", preview, ["unsafe_invariant_violation"]);
  }
  if (request.actualVoiceSendApproved !== false) {
    return buildResult("BLOCKED", preview, ["actual_voice_send_not_approved"]);
  }
  if (!isStackChanVoiceIntent(key)) {
    return buildResult("BLOCKED", preview, ["voice_intent_invalid"]);
  }

  const hold: string[] = [];
  if (!request.humanPresent) hold.push("human_present_required");
  if (!request.manualStopMethodConfirmed) hold.push("manual_stop_method_required");
  if (!request.screenVisible) hold.push("screen_visible_required");
  if (!request.explicitPermittedGo) {
    if (!request.timeWindowDeclared) hold.push("time_window_declared_required");
    if (!request.activeTimeWindow) hold.push("active_time_window_required");
  }

  if (hold.length > 0) return buildResult("HOLD", preview, hold);
  return buildResult("READY_FOR_FUTURE_SEND", preview, []);
}
