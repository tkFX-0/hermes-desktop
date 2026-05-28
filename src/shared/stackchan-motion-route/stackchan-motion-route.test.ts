import { describe, expect, it } from "vitest";
import { evaluateStackChanMotionRoute } from "./stackchan-motion-route";

describe("stackchan-motion-route", () => {
  it("ready when window active", () => {
    const r = evaluateStackChanMotionRoute({
      intent: "STACKCHAN_MOTION_CENTER",
      humanPresent: true,
      manualStopMethodConfirmed: true,
      screenVisible: true,
      timeWindowDeclared: true,
      activeTimeWindow: true,
      actualMotionSendApproved: false,
      productionReady: false,
      executionEnabled: false
    });
    expect(r.decision).toBe("READY_FOR_FUTURE_SEND");
    expect(r.safety.motionAllowed).toBe(false);
  });
});
