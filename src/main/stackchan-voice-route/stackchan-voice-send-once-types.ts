import type { StackChanVoiceIntent } from "../../shared/stackchan-voice-preview/stackchan-voice-preview-types";
import type { StackChanDisplayPilotTimeWindow } from "../../shared/stackchan-display-pilot-readiness/stackchan-display-pilot-readiness-types";
import type {
  StackChanVoiceDeviceDecision,
  StackChanVoiceDeviceTransportMode
} from "./stackchan-voice-device-route-types";

export type StackChanVoiceSendOnceRequest = {
  intent: StackChanVoiceIntent;
  humanPresent: boolean;
  manualStopMethodConfirmed: boolean;
  screenVisible: boolean;
  timeWindow: StackChanDisplayPilotTimeWindow;
  timeWindowDeclared: boolean;
  activeTimeWindow: boolean;
  transportMode: StackChanVoiceDeviceTransportMode;
  actualDeviceSendEnabled: boolean;
  productionReady: false;
  executionEnabled: false;
};

export type StackChanVoiceSendOnceSafety = {
  displayOnly: false;
  motionAllowed: false;
  danceAllowed: false;
  voiceAllowed: false;
  productionReady: false;
  executionEnabled: false;
};

export type StackChanVoiceSendOnceResult = {
  ok: boolean;
  sent: boolean;
  deviceDecision: StackChanVoiceDeviceDecision | "BLOCKED";
  transportMode: StackChanVoiceDeviceTransportMode;
  phraseId: string | null;
  mockPayloadRecorded: boolean;
  websocketSendPerformed: boolean;
  reasons: string[];
  safety: StackChanVoiceSendOnceSafety;
};
