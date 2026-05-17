import { describe, it, expect } from "vitest";
import {
  checkRedaction,
  snapshotToSafeSummary,
  holdSummary,
} from "../src/shared/ichikishima/ui-snapshot-helpers";
import {
  isStale,
  getHoldFallback,
  getStaleBadge,
  resolveDecision,
} from "../src/shared/ichikishima/ui-freshness-helpers";
import {
  toOperatorPageData,
  toStackChanPageData,
  toPushPageData,
  toSafetyStripData,
} from "../src/renderer/src/utils/snapshot-to-page";
import type { DataUnavailableReason } from "../src/shared/ichikishima/ui-safety-types";

// ─── ui-freshness-helpers ────────────────────────────────────────────────────

describe("isStale", () => {
  it("returns true for undefined timestamp", () => {
    expect(isStale(undefined, 60)).toBe(true);
  });

  it("returns true for non-finite timestamp", () => {
    expect(isStale(NaN, 60)).toBe(true);
    expect(isStale(Infinity, 60)).toBe(true);
  });

  it("returns true for timestamp older than threshold", () => {
    const old = Date.now() - 61_000;
    expect(isStale(old, 60)).toBe(true);
  });

  it("returns false for fresh timestamp", () => {
    const fresh = Date.now() - 29_000;
    expect(isStale(fresh, 60)).toBe(false);
  });

  it("returns true for timestamp in the future (clock skew)", () => {
    const future = Date.now() + 10_000;
    expect(isStale(future, 60)).toBe(true);
  });
});

describe("getHoldFallback", () => {
  const reasons: DataUnavailableReason[] = [
    "stale",
    "unknown",
    "error",
    "loading",
    "redaction-uncertain",
    "device-connection-uncertain",
    "external-write-uncertain",
  ];

  it.each(reasons)("returns HOLD for reason: %s", (reason) => {
    expect(getHoldFallback(reason)).toBe("HOLD");
  });
});

describe("getStaleBadge", () => {
  it("returns STALE", () => {
    expect(getStaleBadge()).toBe("STALE");
  });
});

describe("resolveDecision", () => {
  it("returns HOLD when stale is true, regardless of decision", () => {
    expect(resolveDecision("PASS", true)).toBe("HOLD");
    expect(resolveDecision("GO_READY", true)).toBe("HOLD");
    expect(resolveDecision("PASS_WITH_CAVEAT", true)).toBe("HOLD");
  });

  it("returns the original decision when stale is false", () => {
    expect(resolveDecision("HOLD", false)).toBe("HOLD");
    expect(resolveDecision("PASS", false)).toBe("PASS");
    expect(resolveDecision("STOP", false)).toBe("STOP");
  });
});

// ─── ui-snapshot-helpers ────────────────────────────────────────────────────

describe("checkRedaction", () => {
  it("returns clean for empty lines", () => {
    expect(checkRedaction([])).toBe("clean");
  });

  it("returns clean for safe strings", () => {
    expect(checkRedaction(["Gate 004 PASS", "HOLD", "65% candidate"])).toBe("clean");
  });

  it("returns omit for Windows absolute path pattern", () => {
    expect(checkRedaction(["C:\\Users\\test\\value"])).toBe("omit");
  });

  it("returns omit for LAN IP pattern", () => {
    expect(checkRedaction(["server at 192.168.1.12:3030"])).toBe("omit");
  });

  it("returns omit for API key-like pattern", () => {
    expect(checkRedaction(["key sk-abcdefghijklmnop"])).toBe("omit");
  });

  it("returns omit if any line is unsafe (short-circuits)", () => {
    expect(checkRedaction(["safe line", "C:\\Users\\path\\file"])).toBe("omit");
  });
});

describe("holdSummary", () => {
  it("always returns HOLD decision", () => {
    const s = holdSummary(0, "test");
    expect(s.decision).toBe("HOLD");
  });

  it("always has productionReady: false", () => {
    expect(holdSummary(0, "test").productionReady).toBe(false);
  });

  it("always has rawValuesReported: false", () => {
    expect(holdSummary(0, "test").rawValuesReported).toBe(false);
  });

  it("always has execution: disabled", () => {
    expect(holdSummary(0, "test").execution).toBe("disabled");
  });

  it("always has stale: true", () => {
    expect(holdSummary(0, "test").stale).toBe(true);
  });
});

describe("snapshotToSafeSummary", () => {
  // Minimal valid snapshot stub
  function makeSnapshot(overrides: Partial<{ productionReady: false; generatedAtUnixMs: number; snapshotSourceLabel: string }> = {}): Parameters<typeof snapshotToSafeSummary>[0] {
    return {
      productionReady: false,
      rawValuesReported: false,
      generatedAtUnixMs: Date.now(),
      snapshotSourceLabel: "development_snapshot_dev_only_source",
      ...overrides,
    } as Parameters<typeof snapshotToSafeSummary>[0];
  }

  it("always returns productionReady: false", () => {
    const s = snapshotToSafeSummary(makeSnapshot());
    expect(s.productionReady).toBe(false);
  });

  it("always returns rawValuesReported: false", () => {
    const s = snapshotToSafeSummary(makeSnapshot());
    expect(s.rawValuesReported).toBe(false);
  });

  it("always returns execution: disabled", () => {
    const s = snapshotToSafeSummary(makeSnapshot());
    expect(s.execution).toBe("disabled");
  });

  it("returns stale: false for fresh snapshot", () => {
    const s = snapshotToSafeSummary(makeSnapshot({ generatedAtUnixMs: Date.now() }), 60);
    expect(s.stale).toBe(false);
  });

  it("returns stale: true for old snapshot", () => {
    const old = Date.now() - 61_000;
    const s = snapshotToSafeSummary(makeSnapshot({ generatedAtUnixMs: old }), 60);
    expect(s.stale).toBe(true);
  });

  it("returns HOLD decision for HOLD summary regardless of stale", () => {
    const s = snapshotToSafeSummary(makeSnapshot());
    expect(s.decision).toBe("HOLD");
  });
});

// ─── snapshot-to-page ────────────────────────────────────────────────────────

describe("toOperatorPageData", () => {
  it("returns HOLD decision for null input", () => {
    const d = toOperatorPageData(null);
    expect(d.decision).toBe("HOLD");
  });

  it("always has productionReady: false", () => {
    expect(toOperatorPageData(null).productionReady).toBe(false);
  });

  it("returns STALE badge for stale summary", () => {
    const stale = holdSummary(0, "test");
    const d = toOperatorPageData(stale);
    expect(d.staleBadge).toBe("STALE");
    expect(d.stale).toBe(true);
  });

  it("returns no STALE badge for fresh summary", () => {
    const fresh = {
      productionReady: false as const,
      rawValuesReported: false as const,
      generatedAtUnixMs: Date.now(),
      decision: "HOLD" as const,
      execution: "disabled" as const,
      stale: false,
      dataSource: "test",
    };
    const d = toOperatorPageData(fresh);
    expect(d.staleBadge).toBeNull();
  });
});

describe("toStackChanPageData", () => {
  it("always has physicalOperation: false", () => {
    expect(toStackChanPageData(null).physicalOperation).toBe(false);
  });

  it("always has voiceActive: false", () => {
    expect(toStackChanPageData(null).voiceActive).toBe(false);
  });

  it("always has cameraActive: false", () => {
    expect(toStackChanPageData(null).cameraActive).toBe(false);
  });

  it("always has micActive: false", () => {
    expect(toStackChanPageData(null).micActive).toBe(false);
  });
});

describe("toPushPageData", () => {
  it("returns HOLD for null input", () => {
    expect(toPushPageData(null).decisionStrip).toBe("HOLD");
  });

  it("always has productionReady: false", () => {
    expect(toPushPageData(null).productionReady).toBe(false);
  });
});

describe("toSafetyStripData", () => {
  it("returns HOLD for null input", () => {
    expect(toSafetyStripData(null).decision).toBe("HOLD");
  });

  it("always has execution: disabled", () => {
    expect(toSafetyStripData(null).execution).toBe("disabled");
  });

  it("returns HOLD when stale even if summary has a different decision", () => {
    const stale = holdSummary(0, "test");
    expect(toSafetyStripData(stale).decision).toBe("HOLD");
  });
});
