export type StackChanActiveControlCommandClass =
  | "display"
  | "motion"
  | "voice"
  | "dance"
  | "touch"
  | "firmware"
  | "mic"
  | "camera"
  | "autonomous";

export type StackChanActiveControlRouteDecision =
  | "DELEGATE_DISPLAY_ROUTE"
  | "DELEGATE_MOTION_ROUTE"
  | "DELEGATE_VOICE_ROUTE"
  | "HOLD"
  | "BLOCKED";

export type StackChanActiveControlRouteRequest = {
  commandClass: StackChanActiveControlCommandClass;
  humanPresent: boolean;
  manualStopMethodConfirmed: boolean;
  screenVisible: boolean;
  timeWindowDeclared: boolean;
  activeTimeWindow: boolean;
  productionReady: false;
  executionEnabled: false;
};

export type StackChanActiveControlRouteSafety = {
  displayOnly: false;
  motionAllowed: false;
  danceAllowed: false;
  voiceAllowed: false;
  micAllowed: false;
  cameraAllowed: false;
  firmwareWriteAllowed: false;
  externalActionAllowed: false;
  productionReady: false;
  executionEnabled: false;
};

export type StackChanActiveControlRouteResult = {
  decision: StackChanActiveControlRouteDecision;
  commandClass: StackChanActiveControlCommandClass;
  reasons: string[];
  safety: StackChanActiveControlRouteSafety;
};
