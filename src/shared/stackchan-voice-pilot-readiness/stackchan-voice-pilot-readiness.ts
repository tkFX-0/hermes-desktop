import { isStackChanVoiceIntent } from "../stackchan-voice-preview/stackchan-voice-preview";
import type { StackChanDisplayPilotTimeWindow } from "../stackchan-display-pilot-readiness/stackchan-display-pilot-readiness-types";
import type { StackChanVoiceIntent } from "../stackchan-voice-preview/stackchan-voice-preview-types";

export type StackChanVoicePilotReadinessInput = {
  humanPresent: boolean;
  manualStopMethodConfirmed: boolean;
  stackChanScreenVisible: boolean;
  timeWindow: StackChanDisplayPilotTimeWindow;
  voiceIntent: StackChanVoiceIntent;
  explicitPermittedGo?: boolean;
};

export type StackChanVoicePilotReadinessResult = {
  ready: boolean;
  voiceIntent: StackChanVoiceIntent;
  reasons: string[];
};

function isNonEmptyTimeWindow(window: StackChanDisplayPilotTimeWindow): boolean {
  if (!window.startIso.trim() || !window.endIso.trim()) return false;
  const start = Date.parse(window.startIso);
  const end = Date.parse(window.endIso);
  if (Number.isNaN(start) || Number.isNaN(end)) return false;
  return end > start;
}

export function evaluateStackChanVoicePilotReadiness(
  input: StackChanVoicePilotReadinessInput
): StackChanVoicePilotReadinessResult {
  const reasons: string[] = [];
  if (!input.humanPresent) reasons.push("human_present_required");
  if (!input.manualStopMethodConfirmed) reasons.push("manual_stop_method_required");
  if (!input.stackChanScreenVisible) reasons.push("stackchan_screen_visible_required");
  if (!input.explicitPermittedGo && !isNonEmptyTimeWindow(input.timeWindow)) {
    reasons.push("valid_time_window_required");
  }
  if (!isStackChanVoiceIntent(input.voiceIntent)) reasons.push("voice_intent_not_allowed");

  return { ready: reasons.length === 0, voiceIntent: input.voiceIntent, reasons };
}
