import type { StackChanVoiceIntent } from "../../shared/stackchan-voice-preview/stackchan-voice-preview-types";
import type { StackChanDisplayPilotTimeWindow } from "../../shared/stackchan-display-pilot-readiness/stackchan-display-pilot-readiness-types";
import type { StackChanVoiceRouteDecision } from "../../shared/stackchan-voice-route/stackchan-voice-route-types";

export type StackChanVoiceDeviceTransportMode = "disabled" | "mock" | "guarded-ws";

export type StackChanVoiceDeviceDecision = "READY_FOR_PILOT_GO" | "HOLD" | "BLOCKED";

export type StackChanVoiceDeviceRequest = {
  intent: StackChanVoiceIntent;
  humanPresent: boolean;
  manualStopMethodConfirmed: boolean;
  screenVisible: boolean;
  timeWindowDeclared: boolean;
  activeTimeWindow: boolean;
  explicitPermittedGo?: boolean;
  timeWindow?: StackChanDisplayPilotTimeWindow;
  transportMode: StackChanVoiceDeviceTransportMode;
  actualVoiceSendApproved: false;
  productionReady: false;
  executionEnabled: false;
};

export type StackChanVoiceDeviceSafety = {
  displayOnly: false;
  actualVoiceSendApproved: false;
  actualVoiceSendPerformed: false;
  motionAllowed: false;
  danceAllowed: false;
  voiceAllowed: false;
  productionReady: false;
  executionEnabled: false;
};

export type StackChanVoiceDeviceResult = {
  decision: StackChanVoiceDeviceDecision;
  routeDecision: StackChanVoiceRouteDecision;
  transportMode: StackChanVoiceDeviceTransportMode;
  voiceSendPerformed: false;
  websocketSendPerformed: false;
  reasons: string[];
  safety: StackChanVoiceDeviceSafety;
};
