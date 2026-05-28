import type { StackChanDisplayIntent } from "../../shared/stackchan-display-preview/stackchan-display-preview-types";
import type { StackChanDisplayRouteDecision } from "../../shared/stackchan-display-route/stackchan-display-route-types";

export type StackChanDisplayDeviceTransportMode = "disabled" | "mock";

export type StackChanDisplayDeviceDecision =
  | "READY_FOR_PILOT_GO"
  | "HOLD"
  | "BLOCKED";

export type StackChanDisplayDeviceRequest = {
  intent: StackChanDisplayIntent;
  humanPresent: boolean;
  manualStopMethodConfirmed: boolean;
  screenVisible: boolean;
  timeWindowDeclared: boolean;
  activeTimeWindow: boolean;
  transportMode: StackChanDisplayDeviceTransportMode;
  actualDisplaySendApproved: false;
  productionReady: false;
  executionEnabled: false;
};

export type StackChanDisplayDeviceSafety = {
  displayOnly: true;
  actualDisplaySendApproved: false;
  actualDisplaySendPerformed: false;
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

export type StackChanDisplayDeviceResult = {
  decision: StackChanDisplayDeviceDecision;
  routeDecision: StackChanDisplayRouteDecision;
  transportMode: StackChanDisplayDeviceTransportMode;
  displaySendPerformed: false;
  stackchanConnectedByCommand: false;
  websocketSendPerformed: false;
  reasons: string[];
  safety: StackChanDisplayDeviceSafety;
};
