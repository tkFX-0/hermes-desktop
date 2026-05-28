import { describe, expect, it } from "vitest";
import { createMockStackChanMotionTransport } from "./stackchan-motion-transport-mock";
import { sendStackChanMotionOnce } from "./stackchan-motion-send-once";
import type { StackChanMotionSendOnceRequest } from "./stackchan-motion-send-once-types";

const WINDOW = {
  startIso: "2026-05-28T06:00:00.000Z",
  endIso: "2026-05-28T07:00:00.000Z"
};

function ready(overrides: Partial<StackChanMotionSendOnceRequest> = {}): StackChanMotionSendOnceRequest {
  return {
    intent: "STACKCHAN_MOTION_CENTER",
    humanPresent: true,
    manualStopMethodConfirmed: true,
    screenVisible: true,
    timeWindow: WINDOW,
    timeWindowDeclared: true,
    activeTimeWindow: true,
    transportMode: "mock",
    actualDeviceSendEnabled: false,
    productionReady: false,
    executionEnabled: false,
    ...overrides
  };
}

describe("stackchan-motion-send-once", () => {
  it("records mock move without device send", async () => {
    const mock = createMockStackChanMotionTransport();
    const result = await sendStackChanMotionOnce(ready(), mock);
    expect(result.ok).toBe(true);
    expect(result.sent).toBe(false);
    expect(result.presetAction).toBe("center");
    expect(mock.lastMessage).toEqual({ type: "move", action: "center" });
  });

  it("blocks actual send without env flag", async () => {
    const prev = process.env.STACKCHAN_MOTION_PILOT_SEND;
    delete process.env.STACKCHAN_MOTION_PILOT_SEND;
    const result = await sendStackChanMotionOnce(
      ready({ actualDeviceSendEnabled: true, transportMode: "guarded-ws" })
    );
    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("motion_pilot_go_and_env_required");
    if (prev !== undefined) process.env.STACKCHAN_MOTION_PILOT_SEND = prev;
  });
});
