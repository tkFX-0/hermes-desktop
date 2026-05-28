import { describe, expect, it } from "vitest";
import {
  createStackChanDisplayPreview,
  isStackChanDisplayIntent,
  resolveStackChanDisplayPreview,
  STACKCHAN_DISPLAY_PREVIEW_SAFETY
} from "./stackchan-display-preview";
import type { StackChanDisplayIntent } from "./stackchan-display-preview-types";

const ALL_INTENTS: StackChanDisplayIntent[] = [
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
];

describe("stackchan-display-preview", () => {
  it("maps every intent with displayOnly safety", () => {
    for (const intent of ALL_INTENTS) {
      const preview = createStackChanDisplayPreview(intent);
      expect(preview.intent).toBe(intent);
      expect(preview.safety).toEqual(STACKCHAN_DISPLAY_PREVIEW_SAFETY);
      expect(preview.safety.displayOnly).toBe(true);
      expect(preview.safety.motionAllowed).toBe(false);
      expect(preview.safety.danceAllowed).toBe(false);
      expect(preview.safety.voiceAllowed).toBe(false);
      expect(preview.safety.micAllowed).toBe(false);
      expect(preview.safety.cameraAllowed).toBe(false);
      expect(preview.safety.firmwareWriteAllowed).toBe(false);
      expect(preview.safety.externalActionAllowed).toBe(false);
      expect(preview.safety.productionReady).toBe(false);
      expect(preview.safety.executionEnabled).toBe(false);
      expect(preview.label.length).toBeGreaterThan(0);
      expect(preview.message.length).toBeGreaterThan(0);
    }
  });

  it("rejects unknown intent strings via type guard", () => {
    expect(isStackChanDisplayIntent("UNKNOWN_INTENT")).toBe(false);
    expect(isStackChanDisplayIntent("MOTION_GO")).toBe(false);
  });

  it("resolves unknown intent to safe HOLD display", () => {
    const preview = resolveStackChanDisplayPreview("NOT_A_REAL_INTENT");
    expect(preview.intent).toBe("HOLD");
    expect(preview.label).toBe("HOLD");
    expect(preview.safety.displayOnly).toBe(true);
  });

  it("maps FINAL_CORE_ACCEPTED to Core OK", () => {
    const preview = createStackChanDisplayPreview("FINAL_CORE_ACCEPTED");
    expect(preview.label).toBe("Core OK");
    expect(preview.faceMood).toBe("happy");
  });
});
