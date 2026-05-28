import type {
  StackChanDisplayIntent,
  StackChanDisplayPreview,
  StackChanDisplaySafety
} from "./stackchan-display-preview-types";

export const STACKCHAN_DISPLAY_PREVIEW_SAFETY: StackChanDisplaySafety = {
  displayOnly: true,
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

const STACKCHAN_DISPLAY_INTENTS: readonly StackChanDisplayIntent[] = [
  "FINAL_CORE_ACCEPTED",
  "STACKCHAN_BASELINE_PASS",
  "SAFETY_READINESS_PREPARED",
  "HOLD",
  "PASS",
  "STOP",
  "WAITING_FOR_HUMAN",
  "NEEDS_HUMAN_GO",
  "DISCORD_HOLD",
  "EXECUTION_DISABLED",
  "PRODUCTION_READY_FALSE"
] as const;

export function isStackChanDisplayIntent(value: string): value is StackChanDisplayIntent {
  return (STACKCHAN_DISPLAY_INTENTS as readonly string[]).includes(value);
}

type DisplayMapping = Pick<StackChanDisplayPreview, "label" | "faceMood" | "message">;

const DISPLAY_MAPPING: Record<StackChanDisplayIntent, DisplayMapping> = {
  FINAL_CORE_ACCEPTED: {
    label: "Core OK",
    faceMood: "happy",
    message: "Final Shikishima Core accepted (display-only)."
  },
  STACKCHAN_BASELINE_PASS: {
    label: "StackChan OK",
    faceMood: "happy",
    message: "StackChan baseline observation PASS (read-only)."
  },
  SAFETY_READINESS_PREPARED: {
    label: "Safety Ready",
    faceMood: "calm",
    message: "StackChan safety readiness prepared. Active control HOLD."
  },
  HOLD: {
    label: "HOLD",
    faceMood: "caution",
    message: "Operation on HOLD. No autonomous execution."
  },
  PASS: {
    label: "PASS",
    faceMood: "happy",
    message: "Check PASS (display-only; not execution approval)."
  },
  STOP: {
    label: "STOP",
    faceMood: "alert",
    message: "STOP. Human review required."
  },
  WAITING_FOR_HUMAN: {
    label: "Human?",
    faceMood: "waiting",
    message: "Waiting for human operator."
  },
  NEEDS_HUMAN_GO: {
    label: "GO?",
    faceMood: "waiting",
    message: "Human GO required before next step."
  },
  DISCORD_HOLD: {
    label: "Discord HOLD",
    faceMood: "neutral",
    message: "Discord send HOLD. No actual send."
  },
  EXECUTION_DISABLED: {
    label: "Exec OFF",
    faceMood: "calm",
    message: "execution=disabled (invariant)."
  },
  PRODUCTION_READY_FALSE: {
    label: "Prod OFF",
    faceMood: "calm",
    message: "productionReady=false (invariant)."
  }
};

export function createStackChanDisplayPreview(
  intent: StackChanDisplayIntent
): StackChanDisplayPreview {
  const mapping = DISPLAY_MAPPING[intent];
  return {
    intent,
    label: mapping.label,
    faceMood: mapping.faceMood,
    message: mapping.message,
    safety: STACKCHAN_DISPLAY_PREVIEW_SAFETY
  };
}

/** Unknown intents resolve to safe HOLD display (no command side effects). */
export function resolveStackChanDisplayPreview(
  intent: string
): StackChanDisplayPreview {
  if (isStackChanDisplayIntent(intent)) {
    return createStackChanDisplayPreview(intent);
  }
  return createStackChanDisplayPreview("HOLD");
}
