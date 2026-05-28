export type StackChanDisplayIntent =
  | "FINAL_CORE_ACCEPTED"
  | "STACKCHAN_BASELINE_PASS"
  | "SAFETY_READINESS_PREPARED"
  | "HOLD"
  | "PASS"
  | "STOP"
  | "WAITING_FOR_HUMAN"
  | "NEEDS_HUMAN_GO"
  | "DISCORD_HOLD"
  | "EXECUTION_DISABLED"
  | "PRODUCTION_READY_FALSE";

export type StackChanDisplayFaceMood =
  | "calm"
  | "happy"
  | "neutral"
  | "caution"
  | "alert"
  | "waiting";

export type StackChanDisplaySafety = {
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
};

export type StackChanDisplayPreview = {
  intent: StackChanDisplayIntent;
  label: string;
  faceMood: StackChanDisplayFaceMood;
  message: string;
  safety: StackChanDisplaySafety;
};
