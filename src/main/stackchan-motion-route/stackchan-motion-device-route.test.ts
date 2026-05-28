import { describe, expect, it } from "vitest";
import { evaluateStackChanMotionDeviceRoute } from "./stackchan-motion-device-route";

describe("stackchan-motion-device-route", () => {
  it("ready for pilot when guards pass", () => {
    const r = evaluateStackChanMotionDeviceRoute({
      intent: "STACKCHAN_MOTION_CENTER",
      humanPresent: true,
      manualStopMethodConfirmed: true,
      screenVisible: true,
      timeWindowDeclared: true,
      activeTimeWindow: true,
      transportMode: "mock",
      actualMotionSendApproved: false,
      productionReady: false,
      executionEnabled: false
    });
    expect(r.decision).toBe("READY_FOR_PILOT_GO");
  });
});
