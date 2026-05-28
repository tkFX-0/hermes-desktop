import { describe, expect, it } from "vitest";
import { evaluateStackChanActiveControlRoute } from "./stackchan-active-control-route";
import type { StackChanActiveControlRouteRequest } from "./stackchan-active-control-route-types";

function ready(
  overrides: Partial<StackChanActiveControlRouteRequest> = {}
): StackChanActiveControlRouteRequest {
  return {
    commandClass: "motion",
    humanPresent: true,
    manualStopMethodConfirmed: true,
    screenVisible: true,
    timeWindowDeclared: true,
    activeTimeWindow: true,
    productionReady: false,
    executionEnabled: false,
    ...overrides
  };
}

describe("stackchan-active-control-route", () => {
  it("delegates motion when ready", () => {
    const r = evaluateStackChanActiveControlRoute(ready({ commandClass: "motion" }));
    expect(r.decision).toBe("DELEGATE_MOTION_ROUTE");
    expect(r.safety.motionAllowed).toBe(false);
  });

  it("blocks dance without GO", () => {
    const r = evaluateStackChanActiveControlRoute(ready({ commandClass: "dance" }));
    expect(r.decision).toBe("BLOCKED");
    expect(r.reasons).toContain("dance_requires_separate_go");
  });

  it("holds when time window inactive", () => {
    const r = evaluateStackChanActiveControlRoute(ready({ activeTimeWindow: false }));
    expect(r.decision).toBe("HOLD");
  });
});
