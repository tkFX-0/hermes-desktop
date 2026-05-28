import type {
  StackChanActiveControlCommandClass,
  StackChanActiveControlRouteRequest,
  StackChanActiveControlRouteResult,
  StackChanActiveControlRouteSafety
} from "./stackchan-active-control-route-types";

export const STACKCHAN_ACTIVE_CONTROL_ROUTE_SAFETY: StackChanActiveControlRouteSafety = {
  displayOnly: false,
  motionAllowed: false,
  danceAllowed: false,
  voiceAllowed: false,
  micAllowed: false,
  cameraAllowed: false,
  firmwareWriteAllowed: false,
  externalActionAllowed: false,
  productionReady: false,
  executionEnabled: false
};

const DELEGATE_DISPLAY: StackChanActiveControlCommandClass[] = ["display"];
const DELEGATE_MOTION: StackChanActiveControlCommandClass[] = ["motion"];
const DELEGATE_VOICE: StackChanActiveControlCommandClass[] = ["voice"];
const BLOCKED_CLASSES: StackChanActiveControlCommandClass[] = [
  "dance",
  "touch",
  "firmware",
  "mic",
  "camera",
  "autonomous"
];

function buildResult(
  decision: StackChanActiveControlRouteResult["decision"],
  commandClass: StackChanActiveControlCommandClass,
  reasons: string[]
): StackChanActiveControlRouteResult {
  return {
    decision,
    commandClass,
    reasons,
    safety: STACKCHAN_ACTIVE_CONTROL_ROUTE_SAFETY
  };
}

export function evaluateStackChanActiveControlRoute(
  request: StackChanActiveControlRouteRequest
): StackChanActiveControlRouteResult {
  const { commandClass } = request;

  if (request.productionReady !== false || request.executionEnabled !== false) {
    return buildResult("BLOCKED", commandClass, ["unsafe_invariant_violation"]);
  }

  if (BLOCKED_CLASSES.includes(commandClass)) {
    return buildResult("BLOCKED", commandClass, [`${commandClass}_requires_separate_go`]);
  }

  const holdReasons: string[] = [];
  if (!request.humanPresent) holdReasons.push("human_present_required");
  if (!request.manualStopMethodConfirmed) holdReasons.push("manual_stop_method_required");
  if (!request.screenVisible) holdReasons.push("screen_visible_required");
  if (!request.timeWindowDeclared) holdReasons.push("time_window_declared_required");
  if (!request.activeTimeWindow) holdReasons.push("active_time_window_required");

  if (holdReasons.length > 0) {
    return buildResult("HOLD", commandClass, holdReasons);
  }

  if (DELEGATE_DISPLAY.includes(commandClass)) {
    return buildResult("DELEGATE_DISPLAY_ROUTE", commandClass, []);
  }
  if (DELEGATE_MOTION.includes(commandClass)) {
    return buildResult("DELEGATE_MOTION_ROUTE", commandClass, []);
  }
  if (DELEGATE_VOICE.includes(commandClass)) {
    return buildResult("DELEGATE_VOICE_ROUTE", commandClass, []);
  }

  return buildResult("BLOCKED", commandClass, ["unknown_command_class"]);
}
