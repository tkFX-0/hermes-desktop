export type StackChanMotionIntent =
  | "STACKCHAN_MOTION_CENTER"
  | "STACKCHAN_MOTION_WAKE_UP"
  | "STACKCHAN_MOTION_LISTEN_READY";

export type StackChanMotionPreview = {
  intent: StackChanMotionIntent;
  label: string;
  presetAction: string;
};
