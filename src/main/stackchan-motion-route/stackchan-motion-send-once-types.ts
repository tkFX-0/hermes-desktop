import type { StackChanMotionIntent } from "../../shared/stackchan-motion-preview/stackchan-motion-preview-types";
import type { StackChanDisplayPilotTimeWindow } from "../../shared/stackchan-display-pilot-readiness/stackchan-display-pilot-readiness-types";
import type { StackChanMotionDeviceDecision } from "./stackchan-motion-device-route-types";
import type { StackChanMotionDeviceTransportMode } from "./stackchan-motion-device-route-types";

export type StackChanMotionSendOnceRequest = {
  intent: StackChanMotionIntent;
  humanPresent: boolean;
  manualStopMethodConfirmed: boolean;
  screenVisible: boolean;
  timeWindow: StackChanDisplayPilotTimeWindow;
  timeWindowDeclared: boolean;
  activeTimeWindow: boolean;
  transportMode: StackChanMotionDeviceTransportMode;
  actualDeviceSendEnabled: boolean;
  productionReady: false;
  executionEnabled: false;
};

export type StackChanMotionSendOnceSafety = {
  displayOnly: false;
  motionAllowed: false;
  danceAllowed: false;
  voiceAllowed: false;
  productionReady: false;
  executionEnabled: false;
};

export type StackChanMotionSendOnceResult = {
  ok: boolean;
  sent: boolean;
  deviceDecision: StackChanMotionDeviceDecision | "BLOCKED";
  transportMode: StackChanMotionDeviceTransportMode;
  presetAction: string | null;
  mockPayloadRecorded: boolean;
  websocketSendPerformed: boolean;
  reasons: string[];
  safety: StackChanMotionSendOnceSafety;
};
