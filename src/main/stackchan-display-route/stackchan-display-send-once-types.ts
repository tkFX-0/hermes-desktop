import type { StackChanDisplayIntent } from "../../shared/stackchan-display-preview/stackchan-display-preview-types";
import type { StackChanDisplayPilotTimeWindow } from "../../shared/stackchan-display-pilot-readiness/stackchan-display-pilot-readiness-types";
import type {
  StackChanDisplayDeviceDecision,
  StackChanDisplayDeviceTransportMode
} from "./stackchan-display-device-route-types";
import type { StackChanDeviceFaceMode } from "./stackchan-display-face-mode-map";

export type StackChanDisplaySendOnceRequest = {
  intent: StackChanDisplayIntent;
  humanPresent: boolean;
  manualStopMethodConfirmed: boolean;
  screenVisible: boolean;
  timeWindow: StackChanDisplayPilotTimeWindow;
  timeWindowDeclared: boolean;
  activeTimeWindow: boolean;
  transportMode: StackChanDisplayDeviceTransportMode;
  actualDeviceSendEnabled: boolean;
  productionReady: false;
  executionEnabled: false;
};

export type StackChanDisplaySendOnceSafety = {
  displayOnly: true;
  actualDisplaySendApproved: false;
  motionAllowed: false;
  danceAllowed: false;
  touchBehaviorChangeAllowed: false;
  voiceAllowed: false;
  micAllowed: false;
  cameraAllowed: false;
  firmwareWriteAllowed: false;
  externalActionAllowed: false;
  productionReady: false;
  executionEnabled: false;
};

export type StackChanDisplaySendOnceResult = {
  ok: boolean;
  sent: boolean;
  deviceDecision: StackChanDisplayDeviceDecision | "BLOCKED";
  transportMode: StackChanDisplayDeviceTransportMode;
  faceMode: StackChanDeviceFaceMode | null;
  mockPayloadRecorded: boolean;
  websocketSendPerformed: boolean;
  stackchanConnectedByCommand: boolean;
  reasons: string[];
  safety: StackChanDisplaySendOnceSafety;
};
