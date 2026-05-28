import type { StackChanDisplayIntent } from "../stackchan-display-preview/stackchan-display-preview-types";

export type StackChanDisplayPilotTimeWindow = {
  startIso: string;
  endIso: string;
};

export type StackChanDisplayPilotReadinessInput = {
  humanPresent: boolean;
  manualStopMethodConfirmed: boolean;
  stackChanScreenVisible: boolean;
  timeWindow: StackChanDisplayPilotTimeWindow;
  displayIntent: StackChanDisplayIntent;
};

export type StackChanDisplayPilotReadinessSafety = {
  displayOnly: true;
  motionAllowed: false;
  danceAllowed: false;
  voiceAllowed: false;
  micAllowed: false;
  cameraAllowed: false;
  firmwareWriteAllowed: false;
  externalActionAllowed: false;
  productionReady: false;
  executionEnabled: false;
  actualDisplaySendApproved: false;
};

export type StackChanDisplayPilotReadinessResult = {
  ready: boolean;
  displayIntent: StackChanDisplayIntent;
  reasons: string[];
  safety: StackChanDisplayPilotReadinessSafety;
};
