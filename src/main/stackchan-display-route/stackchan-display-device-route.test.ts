import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  evaluateStackChanDisplayDeviceRoute,
  STACKCHAN_DISPLAY_DEVICE_ROUTE_SAFETY
} from "./stackchan-display-device-route";
import type { StackChanDisplayDeviceRequest } from "./stackchan-display-device-route-types";

const __dirname = dirname(fileURLToPath(import.meta.url));

function readyRequest(
  overrides: Partial<StackChanDisplayDeviceRequest> = {}
): StackChanDisplayDeviceRequest {
  return {
    intent: "STACKCHAN_BASELINE_PASS",
    humanPresent: true,
    manualStopMethodConfirmed: true,
    screenVisible: true,
    timeWindowDeclared: true,
    activeTimeWindow: true,
    transportMode: "mock",
    actualDisplaySendApproved: false,
    productionReady: false,
    executionEnabled: false,
    ...overrides
  };
}

describe("stackchan-display-device-route", () => {
  it("returns READY_FOR_PILOT_GO when readiness and route guard pass with mock transport", () => {
    const result = evaluateStackChanDisplayDeviceRoute(readyRequest());
    expect(result.decision).toBe("READY_FOR_PILOT_GO");
    expect(result.routeDecision).toBe("READY_FOR_FUTURE_SEND");
    expect(result.transportMode).toBe("mock");
    expect(result.reasons).toEqual([]);
  });

  it("returns READY_FOR_PILOT_GO with disabled transport", () => {
    const result = evaluateStackChanDisplayDeviceRoute(
      readyRequest({ transportMode: "disabled" })
    );
    expect(result.decision).toBe("READY_FOR_PILOT_GO");
    expect(result.transportMode).toBe("disabled");
  });

  it("returns HOLD when human is absent", () => {
    const result = evaluateStackChanDisplayDeviceRoute(
      readyRequest({ humanPresent: false })
    );
    expect(result.decision).toBe("HOLD");
    expect(result.reasons).toContain("human_present_required");
  });

  it("returns HOLD when manual stop is not confirmed", () => {
    const result = evaluateStackChanDisplayDeviceRoute(
      readyRequest({ manualStopMethodConfirmed: false })
    );
    expect(result.decision).toBe("HOLD");
    expect(result.reasons).toContain("manual_stop_method_required");
  });

  it("returns HOLD when screen is not visible", () => {
    const result = evaluateStackChanDisplayDeviceRoute(
      readyRequest({ screenVisible: false })
    );
    expect(result.decision).toBe("HOLD");
    expect(result.reasons).toContain("stackchan_screen_visible_required");
  });

  it("returns HOLD when time window is not declared", () => {
    const result = evaluateStackChanDisplayDeviceRoute(
      readyRequest({ timeWindowDeclared: false })
    );
    expect(result.decision).toBe("HOLD");
    expect(result.reasons).toContain("valid_time_window_required");
  });

  it("returns HOLD when time window is inactive", () => {
    const result = evaluateStackChanDisplayDeviceRoute(
      readyRequest({ activeTimeWindow: false })
    );
    expect(result.decision).toBe("HOLD");
    expect(result.reasons).toContain("valid_time_window_required");
  });

  it("returns BLOCKED when productionReady is true", () => {
    const result = evaluateStackChanDisplayDeviceRoute({
      ...readyRequest(),
      productionReady: true as false
    });
    expect(result.decision).toBe("BLOCKED");
    expect(result.reasons).toContain("production_ready_must_be_false");
  });

  it("returns BLOCKED when execution is enabled", () => {
    const result = evaluateStackChanDisplayDeviceRoute({
      ...readyRequest(),
      executionEnabled: true as false
    });
    expect(result.decision).toBe("BLOCKED");
    expect(result.reasons).toContain("execution_must_be_disabled");
  });

  it("returns BLOCKED when actual display send is approved", () => {
    const result = evaluateStackChanDisplayDeviceRoute({
      ...readyRequest(),
      actualDisplaySendApproved: true as false
    });
    expect(result.decision).toBe("BLOCKED");
    expect(result.reasons).toContain("actual_display_send_not_approved");
  });

  it("returns BLOCKED for forbidden transport mode", () => {
    const result = evaluateStackChanDisplayDeviceRoute(
      readyRequest({ transportMode: "websocket" as "mock" })
    );
    expect(result.decision).toBe("BLOCKED");
    expect(result.reasons).toContain("transport_mode_forbidden");
  });

  it("returns READY_FOR_PILOT_GO with guarded-ws transport mode", () => {
    const result = evaluateStackChanDisplayDeviceRoute(
      readyRequest({ transportMode: "guarded-ws" })
    );
    expect(result.decision).toBe("READY_FOR_PILOT_GO");
    expect(result.transportMode).toBe("guarded-ws");
  });

  it("keeps displaySendPerformed and device connection flags false", () => {
    const ready = evaluateStackChanDisplayDeviceRoute(readyRequest());
    const hold = evaluateStackChanDisplayDeviceRoute(readyRequest({ humanPresent: false }));
    for (const result of [ready, hold]) {
      expect(result.displaySendPerformed).toBe(false);
      expect(result.stackchanConnectedByCommand).toBe(false);
      expect(result.websocketSendPerformed).toBe(false);
      expect(result.safety).toEqual(STACKCHAN_DISPLAY_DEVICE_ROUTE_SAFETY);
      expect(result.safety.motionAllowed).toBe(false);
      expect(result.safety.danceAllowed).toBe(false);
      expect(result.safety.voiceAllowed).toBe(false);
      expect(result.safety.micAllowed).toBe(false);
      expect(result.safety.cameraAllowed).toBe(false);
      expect(result.safety.firmwareWriteAllowed).toBe(false);
    }
  });

  it("does not import forbidden local service modules", () => {
    const sources = [
      "stackchan-display-device-route.ts",
      "stackchan-display-device-route-types.ts",
      "index.ts"
    ];
    for (const file of sources) {
      const content = readFileSync(join(__dirname, file), "utf8");
      expect(content).not.toMatch(/stackchan-local-service/);
      expect(content).not.toMatch(/stackchanFaceLocal/);
      expect(content).not.toMatch(/stackchanSayLocal/);
      expect(content).not.toMatch(/stackchanDanceLocal/);
      expect(content).not.toMatch(/connectWs/);
    }
  });
});
