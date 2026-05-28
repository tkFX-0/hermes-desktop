import { describe, expect, it } from "vitest";
import { evaluateStackChanVoiceRoute } from "./stackchan-voice-route";

describe("stackchan-voice-route", () => {
  it("ready when guards pass", () => {
    const r = evaluateStackChanVoiceRoute({
      intent: "STACKCHAN_VOICE_PILOT_ACK",
      humanPresent: true,
      manualStopMethodConfirmed: true,
      screenVisible: true,
      timeWindowDeclared: true,
      activeTimeWindow: true,
      actualVoiceSendApproved: false,
      productionReady: false,
      executionEnabled: false
    });
    expect(r.decision).toBe("READY_FOR_FUTURE_SEND");
    expect(r.safety.voiceAllowed).toBe(false);
  });
});
