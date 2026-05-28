import type { StackChanMotionIntent } from "../stackchan-motion-preview/stackchan-motion-preview-types";
import type { StackChanMotionPreview } from "../stackchan-motion-preview/stackchan-motion-preview-types";

export type StackChanMotionRouteDecision = "READY_FOR_FUTURE_SEND" | "HOLD" | "BLOCKED";

export type StackChanMotionRouteRequest = {
  intent: StackChanMotionIntent;
  humanPresent: boolean;
  manualStopMethodConfirmed: boolean;
  screenVisible: boolean;
  timeWindowDeclared: boolean;
  activeTimeWindow: boolean;
  actualMotionSendApproved: false;
  productionReady: false;
  executionEnabled: false;
};

export type StackChanMotionRouteSafety = {
  displayOnly: false;
  motionAllowed: false;
  danceAllowed: false;
  voiceAllowed: false;
  actualMotionSendPerformed: false;
  actualMotionSendApproved: false;
  productionReady: false;
  executionEnabled: false;
};

export type StackChanMotionRouteResult = {
  decision: StackChanMotionRouteDecision;
  preview: StackChanMotionPreview;
  reasons: string[];
  safety: StackChanMotionRouteSafety;
};
