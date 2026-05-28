import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  evaluateStackChanDisplayRoute,
  STACKCHAN_DISPLAY_ROUTE_SAFETY
} from "./stackchan-display-route";
import type { StackChanDisplayRouteRequest } from "./stackchan-display-route-types";

const __dirname = dirname(fileURLToPath(import.meta.url));

function readyRequest(
  overrides: Partial<StackChanDisplayRouteRequest> = {}
): StackChanDisplayRouteRequest {
  return {
    intent: "STACKCHAN_BASELINE_PASS",
    humanPresent: true,
    manualStopMethodConfirmed: true,
    screenVisible: true,
    timeWindowDeclared: true,
    activeTimeWindow: true,
    actualDisplaySendApproved: false,
    productionReady: false,
    executionEnabled: false,
    ...overrides
  };
}

describe("stackchan-display-route", () => {
  it("returns READY_FOR_FUTURE_SEND when all readiness conditions are true", () => {
    const result = evaluateStackChanDisplayRoute(readyRequest());
    expect(result.decision).toBe("READY_FOR_FUTURE_SEND");
    expect(result.preview.intent).toBe("STACKCHAN_BASELINE_PASS");
    expect(result.reasons).toEqual([]);
    expect(result.safety).toEqual(STACKCHAN_DISPLAY_ROUTE_SAFETY);
  });

  it("returns HOLD when human is absent", () => {
    const result = evaluateStackChanDisplayRoute(
      readyRequest({ humanPresent: false })
    );
    expect(result.decision).toBe("HOLD");
    expect(result.reasons).toContain("human_present_required");
  });

  it("returns HOLD when manual stop is not confirmed", () => {
    const result = evaluateStackChanDisplayRoute(
      readyRequest({ manualStopMethodConfirmed: false })
    );
    expect(result.decision).toBe("HOLD");
    expect(result.reasons).toContain("manual_stop_method_required");
  });

  it("returns HOLD when screen is not visible", () => {
    const result = evaluateStackChanDisplayRoute(
      readyRequest({ screenVisible: false })
    );
    expect(result.decision).toBe("HOLD");
    expect(result.reasons).toContain("screen_visible_required");
  });

  it("returns HOLD when time window is not declared", () => {
    const result = evaluateStackChanDisplayRoute(
      readyRequest({ timeWindowDeclared: false })
    );
    expect(result.decision).toBe("HOLD");
    expect(result.reasons).toContain("time_window_declared_required");
  });

  it("returns HOLD when time window is inactive", () => {
    const result = evaluateStackChanDisplayRoute(
      readyRequest({ activeTimeWindow: false })
    );
    expect(result.decision).toBe("HOLD");
    expect(result.reasons).toContain("active_time_window_required");
  });

  it("returns BLOCKED for unknown intent and never approves send", () => {
    const result = evaluateStackChanDisplayRoute(
      readyRequest({ intent: "MOTION_GO" as StackChanDisplayRouteRequest["intent"] })
    );
    expect(result.decision).toBe("BLOCKED");
    expect(result.preview.intent).toBe("HOLD");
    expect(result.reasons).toContain("display_intent_invalid");
    expect(result.safety.actualDisplaySendPerformed).toBe(false);
  });

  it("returns BLOCKED when productionReady is true", () => {
    const result = evaluateStackChanDisplayRoute({
      ...readyRequest(),
      productionReady: true as false
    });
    expect(result.decision).toBe("BLOCKED");
    expect(result.reasons).toContain("production_ready_must_be_false");
  });

  it("returns BLOCKED when execution is enabled", () => {
    const result = evaluateStackChanDisplayRoute({
      ...readyRequest(),
      executionEnabled: true as false
    });
    expect(result.decision).toBe("BLOCKED");
    expect(result.reasons).toContain("execution_must_be_disabled");
  });

  it("returns BLOCKED when actual display send is approved", () => {
    const result = evaluateStackChanDisplayRoute({
      ...readyRequest(),
      actualDisplaySendApproved: true as false
    });
    expect(result.decision).toBe("BLOCKED");
    expect(result.reasons).toContain("actual_display_send_not_approved");
  });

  it("keeps actualDisplaySendPerformed and active-control flags false", () => {
    const ready = evaluateStackChanDisplayRoute(readyRequest());
    const hold = evaluateStackChanDisplayRoute(readyRequest({ humanPresent: false }));
    for (const result of [ready, hold]) {
      expect(result.safety.actualDisplaySendPerformed).toBe(false);
      expect(result.safety.actualDisplaySendApproved).toBe(false);
      expect(result.safety.websocketSend).toBe(false);
      expect(result.safety.motionAllowed).toBe(false);
      expect(result.safety.danceAllowed).toBe(false);
      expect(result.safety.voiceAllowed).toBe(false);
      expect(result.safety.micAllowed).toBe(false);
      expect(result.safety.cameraAllowed).toBe(false);
      expect(result.safety.firmwareWriteAllowed).toBe(false);
      expect(result.preview.safety.displayOnly).toBe(true);
    }
  });

  it("does not import main process or local service modules", () => {
    const sources = [
      "stackchan-display-route.ts",
      "stackchan-display-route-types.ts",
      "index.ts"
    ];
    for (const file of sources) {
      const content = readFileSync(join(__dirname, file), "utf8");
      expect(content).not.toMatch(/stackchan-local-service/);
      expect(content).not.toMatch(/src\/main/);
      expect(content).not.toMatch(/stackchanFaceLocal/);
      expect(content).not.toMatch(/stackchanSayLocal/);
      expect(content).not.toMatch(/stackchanDanceLocal/);
    }
  });
});
