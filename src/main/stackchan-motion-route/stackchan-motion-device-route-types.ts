import type { StackChanMotionIntent } from "../../shared/stackchan-motion-preview/stackchan-motion-preview-types";
import type { StackChanDisplayPilotTimeWindow } from "../../shared/stackchan-display-pilot-readiness/stackchan-display-pilot-readiness-types";
import type { StackChanMotionRouteDecision } from "../../shared/stackchan-motion-route/stackchan-motion-route-types";

export type StackChanMotionDeviceTransportMode = "disabled" | "mock" | "guarded-ws";

export type StackChanMotionDeviceDecision = "READY_FOR_PILOT_GO" | "HOLD" | "BLOCKED";

export type StackChanMotionDeviceRequest = {
  intent: StackChanMotionIntent;
  humanPresent: boolean;
  manualStopMethodConfirmed: boolean;
  screenVisible: boolean;
  timeWindowDeclared: boolean;
  activeTimeWindow: boolean;
  timeWindow?: StackChanDisplayPilotTimeWindow;
  transportMode: StackChanMotionDeviceTransportMode;
  actualMotionSendApproved: false;
  productionReady: false;
  executionEnabled: false;
};

export type StackChanMotionDeviceSafety = {
  displayOnly: false;
  actualMotionSendApproved: false;
  actualMotionSendPerformed: false;
  motionAllowed: false;
  danceAllowed: false;
  voiceAllowed: false;
  productionReady: false;
  executionEnabled: false;
};

export type StackChanMotionDeviceResult = {
  decision: StackChanMotionDeviceDecision;
  routeDecision: StackChanMotionRouteDecision;
  transportMode: StackChanMotionDeviceTransportMode;
  motionSendPerformed: false;
  websocketSendPerformed: false;
  reasons: string[];
  safety: StackChanMotionDeviceSafety;
};
