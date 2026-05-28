import { isStackChanDisplayIntent } from "../stackchan-display-preview/stackchan-display-preview";
import type {
  StackChanDisplayPilotReadinessInput,
  StackChanDisplayPilotReadinessResult,
  StackChanDisplayPilotReadinessSafety,
  StackChanDisplayPilotTimeWindow
} from "./stackchan-display-pilot-readiness-types";

export const STACKCHAN_DISPLAY_PILOT_READINESS_SAFETY: StackChanDisplayPilotReadinessSafety =
  {
    displayOnly: true,
    motionAllowed: false,
    danceAllowed: false,
    voiceAllowed: false,
    micAllowed: false,
    cameraAllowed: false,
    firmwareWriteAllowed: false,
    externalActionAllowed: false,
    productionReady: false,
    executionEnabled: false,
    actualDisplaySendApproved: false
  };

function isNonEmptyTimeWindow(window: StackChanDisplayPilotTimeWindow): boolean {
  if (!window.startIso.trim() || !window.endIso.trim()) return false;
  const start = Date.parse(window.startIso);
  const end = Date.parse(window.endIso);
  if (Number.isNaN(start) || Number.isNaN(end)) return false;
  return end > start;
}

export function evaluateStackChanDisplayPilotReadiness(
  input: StackChanDisplayPilotReadinessInput
): StackChanDisplayPilotReadinessResult {
  const reasons: string[] = [];

  if (!input.humanPresent) {
    reasons.push("human_present_required");
  }
  if (!input.manualStopMethodConfirmed) {
    reasons.push("manual_stop_method_required");
  }
  if (!input.stackChanScreenVisible) {
    reasons.push("stackchan_screen_visible_required");
  }
  if (!isNonEmptyTimeWindow(input.timeWindow)) {
    reasons.push("valid_time_window_required");
  }
  if (!isStackChanDisplayIntent(input.displayIntent)) {
    reasons.push("display_intent_not_allowed");
  }

  return {
    ready: reasons.length === 0,
    displayIntent: input.displayIntent,
    reasons,
    safety: STACKCHAN_DISPLAY_PILOT_READINESS_SAFETY
  };
}
