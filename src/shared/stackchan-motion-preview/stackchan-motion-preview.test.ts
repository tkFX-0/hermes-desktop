import { describe, expect, it } from "vitest";
import { createStackChanMotionPreview, isStackChanMotionIntent } from "./stackchan-motion-preview";

describe("stackchan-motion-preview", () => {
  it("maps center intent", () => {
    expect(createStackChanMotionPreview("STACKCHAN_MOTION_CENTER").presetAction).toBe("center");
  });

  it("validates intents", () => {
    expect(isStackChanMotionIntent("STACKCHAN_MOTION_WAKE_UP")).toBe(true);
    expect(isStackChanMotionIntent("dance")).toBe(false);
  });
});
