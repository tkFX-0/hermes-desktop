/**
 * Operator one-shot: explicit 許可GO voice pilot (device send).
 * Run: STACKCHAN_VOICE_PILOT_SEND=1 STACKCHAN_VOICE_EXPLICIT_GO_PILOT=1 npm run test -- stackchan-voice-explicit-go-pilot.run.test.ts
 */
import { describe, expect, it } from "vitest";
import { bootstrapStackChanEnvFromLocalFile } from "./stackchan-env-bootstrap";
import { sendStackChanVoiceOnce } from "./stackchan-voice-send-once";

const RUN =
  process.env.STACKCHAN_VOICE_EXPLICIT_GO_PILOT === "1" &&
  process.env.STACKCHAN_VOICE_PILOT_SEND === "1";

describe.runIf(RUN)("stackchan voice explicit permitted GO pilot", () => {
  it("sends guarded voice once without time window", async () => {
    bootstrapStackChanEnvFromLocalFile();
    const result = await sendStackChanVoiceOnce({
      intent: "STACKCHAN_VOICE_PILOT_ACK",
      humanPresent: true,
      manualStopMethodConfirmed: true,
      screenVisible: true,
      timeWindow: { startIso: "", endIso: "" },
      timeWindowDeclared: false,
      activeTimeWindow: false,
      explicitPermittedGo: true,
      transportMode: "guarded-ws",
      actualDeviceSendEnabled: true,
      productionReady: false,
      executionEnabled: false
    });

    console.log(
      JSON.stringify({
        ok: result.ok,
        sent: result.sent,
        deviceDecision: result.deviceDecision,
        websocketSendPerformed: result.websocketSendPerformed,
        reasons: result.reasons
      })
    );

    expect(result.deviceDecision).toBe("READY_FOR_PILOT_GO");
    expect(result.ok).toBe(true);
    expect(result.sent).toBe(true);
    expect(result.websocketSendPerformed).toBe(true);
  });
});
