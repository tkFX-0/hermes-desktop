import type { StackChanMotionIntent, StackChanMotionPreview } from "./stackchan-motion-preview-types";

const PREVIEWS: Record<StackChanMotionIntent, StackChanMotionPreview> = {
  STACKCHAN_MOTION_CENTER: {
    intent: "STACKCHAN_MOTION_CENTER",
    label: "Return to center (safe reset)",
    presetAction: "center"
  },
  STACKCHAN_MOTION_WAKE_UP: {
    intent: "STACKCHAN_MOTION_WAKE_UP",
    label: "Wake / listen ready motion",
    presetAction: "wake_up"
  },
  STACKCHAN_MOTION_LISTEN_READY: {
    intent: "STACKCHAN_MOTION_LISTEN_READY",
    label: "Listen ready posture",
    presetAction: "listen_ready"
  }
};

export function isStackChanMotionIntent(value: string): value is StackChanMotionIntent {
  return Object.prototype.hasOwnProperty.call(PREVIEWS, value);
}

export function createStackChanMotionPreview(intent: StackChanMotionIntent): StackChanMotionPreview {
  return PREVIEWS[intent];
}
