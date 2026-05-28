import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { createMockStackChanDisplayTransport } from "./stackchan-display-transport-mock";
import type { StackChanDisplayTransport } from "./stackchan-display-transport-types";
import { sendStackChanDisplayOnce } from "./stackchan-display-send-once";
import type { StackChanDisplaySendOnceRequest } from "./stackchan-display-send-once-types";

const __dirname = dirname(fileURLToPath(import.meta.url));

const VALID_WINDOW = {
  startIso: "2026-05-28T03:00:00.000Z",
  endIso: "2026-05-28T04:00:00.000Z"
};

function readySendRequest(
  overrides: Partial<StackChanDisplaySendOnceRequest> = {}
): StackChanDisplaySendOnceRequest {
  return {
    intent: "STACKCHAN_BASELINE_PASS",
    humanPresent: true,
    manualStopMethodConfirmed: true,
    screenVisible: true,
    timeWindow: VALID_WINDOW,
    timeWindowDeclared: true,
    activeTimeWindow: true,
    transportMode: "mock",
    actualDeviceSendEnabled: false,
    productionReady: false,
    executionEnabled: false,
    ...overrides
  };
}

describe("stackchan-display-send-once", () => {
  it("records mock face_mode payload without device send (Rally 4A)", async () => {
    const mock = createMockStackChanDisplayTransport();
    const result = await sendStackChanDisplayOnce(readySendRequest(), mock);

    expect(result.ok).toBe(true);
    expect(result.sent).toBe(false);
    expect(result.deviceDecision).toBe("READY_FOR_PILOT_GO");
    expect(result.mockPayloadRecorded).toBe(true);
    expect(result.websocketSendPerformed).toBe(false);
    expect(result.faceMode).toBe("happy");
    expect(mock.lastMessage).toEqual({ type: "face_mode", value: "happy" });
    expect(mock.sendCallCount).toBe(1);
  });

  it("returns HOLD when human is absent", async () => {
    const result = await sendStackChanDisplayOnce(
      readySendRequest({ humanPresent: false })
    );
    expect(result.ok).toBe(false);
    expect(result.sent).toBe(false);
    expect(result.deviceDecision).toBe("HOLD");
    expect(result.reasons).toContain("human_present_required");
  });

  it("returns HOLD when manual stop is not confirmed", async () => {
    const result = await sendStackChanDisplayOnce(
      readySendRequest({ manualStopMethodConfirmed: false })
    );
    expect(result.reasons).toContain("manual_stop_method_required");
  });

  it("returns HOLD when screen is not visible", async () => {
    const result = await sendStackChanDisplayOnce(
      readySendRequest({ screenVisible: false })
    );
    expect(result.reasons).toContain("stackchan_screen_visible_required");
  });

  it("returns HOLD when time window is invalid", async () => {
    const result = await sendStackChanDisplayOnce(
      readySendRequest({
        timeWindow: { startIso: "", endIso: "" },
        activeTimeWindow: false
      })
    );
    expect(result.deviceDecision).toBe("HOLD");
  });

  it("blocks actual send without Rally 4B env flag", async () => {
    let sendCallCount = 0;
    const mock: StackChanDisplayTransport = {
      mode: "guarded-ws",
      async sendFaceMode() {
        sendCallCount += 1;
        return { ok: true };
      }
    };
    const result = await sendStackChanDisplayOnce(
      readySendRequest({
        actualDeviceSendEnabled: true,
        transportMode: "guarded-ws"
      }),
      mock
    );
    expect(result.sent).toBe(false);
    expect(result.reasons).toContain("rally_4b_go_and_env_required");
    expect(sendCallCount).toBe(0);
  });

  it("keeps safety flags false", async () => {
    const result = await sendStackChanDisplayOnce(readySendRequest());
    expect(result.safety.motionAllowed).toBe(false);
    expect(result.safety.voiceAllowed).toBe(false);
    expect(result.safety.firmwareWriteAllowed).toBe(false);
    expect(result.stackchanConnectedByCommand).toBe(false);
  });

  it("does not import stackchan-local-service", () => {
    const sources = [
      "stackchan-display-send-once.ts",
      "stackchan-display-transport-guarded.ts",
      "stackchan-display-transport-mock.ts"
    ];
    for (const file of sources) {
      const content = readFileSync(join(__dirname, file), "utf8");
      expect(content).not.toMatch(/from\s+["'].*stackchan-local-service/);
      expect(content).not.toMatch(/stackchanFaceLocal\s*\(/);
      expect(content).not.toMatch(/stackchanSayLocal/);
      expect(content).not.toMatch(/stackchanDanceLocal/);
    }
  });
});
