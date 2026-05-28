import type { StackChanDisplayIntent } from "../stackchan-display-preview/stackchan-display-preview-types";
import type { StackChanDisplayPreview } from "../stackchan-display-preview/stackchan-display-preview-types";

export type StackChanDisplayRouteDecision =
  | "READY_FOR_FUTURE_SEND"
  | "HOLD"
  | "BLOCKED";

export type StackChanDisplayRouteRequest = {
  intent: StackChanDisplayIntent;
  humanPresent: boolean;
  manualStopMethodConfirmed: boolean;
  screenVisible: boolean;
  timeWindowDeclared: boolean;
  activeTimeWindow: boolean;
  actualDisplaySendApproved: false;
  productionReady: false;
  executionEnabled: false;
};

export type StackChanDisplayRouteSafety = {
  displayOnly: true;
  actualDisplaySendPerformed: false;
  actualDisplaySendApproved: false;
  stackchanConnectedByCommand: false;
  serialConnected: false;
  websocketSend: false;
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

export type StackChanDisplayRouteResult = {
  decision: StackChanDisplayRouteDecision;
  preview: StackChanDisplayPreview;
  reasons: string[];
  safety: StackChanDisplayRouteSafety;
};
