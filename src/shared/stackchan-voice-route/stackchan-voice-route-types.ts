import type { StackChanVoiceIntent } from "../stackchan-voice-preview/stackchan-voice-preview-types";
import type { StackChanVoicePreview } from "../stackchan-voice-preview/stackchan-voice-preview-types";

export type StackChanVoiceRouteDecision = "READY_FOR_FUTURE_SEND" | "HOLD" | "BLOCKED";

export type StackChanVoiceRouteRequest = {
  intent: StackChanVoiceIntent;
  humanPresent: boolean;
  manualStopMethodConfirmed: boolean;
  screenVisible: boolean;
  timeWindowDeclared: boolean;
  activeTimeWindow: boolean;
  actualVoiceSendApproved: false;
  productionReady: false;
  executionEnabled: false;
};

export type StackChanVoiceRouteSafety = {
  displayOnly: false;
  motionAllowed: false;
  danceAllowed: false;
  voiceAllowed: false;
  actualVoiceSendPerformed: false;
  actualVoiceSendApproved: false;
  productionReady: false;
  executionEnabled: false;
};

export type StackChanVoiceRouteResult = {
  decision: StackChanVoiceRouteDecision;
  preview: StackChanVoicePreview;
  reasons: string[];
  safety: StackChanVoiceRouteSafety;
};
