import { describe, expect, it } from "vitest";
import {
  evaluateStackChanDisplayPilotReadiness,
  STACKCHAN_DISPLAY_PILOT_READINESS_SAFETY
} from "./stackchan-display-pilot-readiness";

const validWindow = {
  startIso: "2026-05-28T10:00:00+09:00",
  endIso: "2026-05-28T10:15:00+09:00"
};

describe("stackchan-display-pilot-readiness", () => {
  it("passes when all preconditions are met", () => {
    const result = evaluateStackChanDisplayPilotReadiness({
      humanPresent: true,
      manualStopMethodConfirmed: true,
      stackChanScreenVisible: true,
      timeWindow: validWindow,
      displayIntent: "HOLD"
    });
    expect(result.ready).toBe(true);
    expect(result.reasons).toEqual([]);
    expect(result.safety).toEqual(STACKCHAN_DISPLAY_PILOT_READINESS_SAFETY);
    expect(result.safety.actualDisplaySendApproved).toBe(false);
  });

  it("fails when human or stop method missing", () => {
    const result = evaluateStackChanDisplayPilotReadiness({
      humanPresent: false,
      manualStopMethodConfirmed: false,
      stackChanScreenVisible: true,
      timeWindow: validWindow,
      displayIntent: "FINAL_CORE_ACCEPTED"
    });
    expect(result.ready).toBe(false);
    expect(result.reasons).toContain("human_present_required");
    expect(result.reasons).toContain("manual_stop_method_required");
  });

  it("fails when time window is invalid", () => {
    const result = evaluateStackChanDisplayPilotReadiness({
      humanPresent: true,
      manualStopMethodConfirmed: true,
      stackChanScreenVisible: true,
      timeWindow: { startIso: "", endIso: "" },
      displayIntent: "HOLD"
    });
    expect(result.ready).toBe(false);
    expect(result.reasons).toContain("valid_time_window_required");
  });

  it("keeps all active-control flags false in safety", () => {
    const result = evaluateStackChanDisplayPilotReadiness({
      humanPresent: true,
      manualStopMethodConfirmed: true,
      stackChanScreenVisible: true,
      timeWindow: validWindow,
      displayIntent: "EXECUTION_DISABLED"
    });
    expect(result.safety.motionAllowed).toBe(false);
    expect(result.safety.productionReady).toBe(false);
    expect(result.safety.executionEnabled).toBe(false);
  });
});
