import { isStackChanMotionIntent } from "../stackchan-motion-preview/stackchan-motion-preview";
import type { StackChanDisplayPilotTimeWindow } from "../stackchan-display-pilot-readiness/stackchan-display-pilot-readiness-types";
import type { StackChanMotionIntent } from "../stackchan-motion-preview/stackchan-motion-preview-types";

export type StackChanMotionPilotReadinessInput = {
  humanPresent: boolean;
  manualStopMethodConfirmed: boolean;
  stackChanScreenVisible: boolean;
  timeWindow: StackChanDisplayPilotTimeWindow;
  motionIntent: StackChanMotionIntent;
};

export type StackChanMotionPilotReadinessResult = {
  ready: boolean;
  motionIntent: StackChanMotionIntent;
  reasons: string[];
};

function isNonEmptyTimeWindow(window: StackChanDisplayPilotTimeWindow): boolean {
  if (!window.startIso.trim() || !window.endIso.trim()) return false;
  const start = Date.parse(window.startIso);
  const end = Date.parse(window.endIso);
  if (Number.isNaN(start) || Number.isNaN(end)) return false;
  return end > start;
}

export function evaluateStackChanMotionPilotReadiness(
  input: StackChanMotionPilotReadinessInput
): StackChanMotionPilotReadinessResult {
  const reasons: string[] = [];
  if (!input.humanPresent) reasons.push("human_present_required");
  if (!input.manualStopMethodConfirmed) reasons.push("manual_stop_method_required");
  if (!input.stackChanScreenVisible) reasons.push("stackchan_screen_visible_required");
  if (!isNonEmptyTimeWindow(input.timeWindow)) reasons.push("valid_time_window_required");
  if (!isStackChanMotionIntent(input.motionIntent)) reasons.push("motion_intent_not_allowed");

  return {
    ready: reasons.length === 0,
    motionIntent: input.motionIntent,
    reasons
  };
}
