import { describe, it, expect } from "vitest";
import {
  buildMobileSnapshot,
  MOBILE_CONSOLE_DEFAULT_SNAPSHOT,
} from "../src/shared/mobile-console";
import type { KomashikiDisplayState } from "../src/shared/mobile-console";

describe("mobile console safety invariants", () => {
  it("productionReady is always false and cannot be overridden", () => {
    const snap = buildMobileSnapshot({ appStatus: "live" }, "redacted_snapshot_phase2c_same_lan");
    expect(snap.productionReady).toBe(false);
  });

  it("rawValuesReported is always false and cannot be overridden", () => {
    const snap = buildMobileSnapshot({ appStatus: "live" }, "redacted_snapshot_phase2c_same_lan");
    expect(snap.rawValuesReported).toBe(false);
  });

  it("execution is always disabled", () => {
    const snap = buildMobileSnapshot({}, "static_phase1");
    expect(snap.execution).toBe("disabled");
  });

  it("level3 is always not_approved", () => {
    const snap = buildMobileSnapshot({}, "static_phase1");
    expect(snap.level3).toBe("not_approved");
  });

  it("decision only allows HOLD or stop", () => {
    const hold = buildMobileSnapshot({ decision: "HOLD" }, "static_phase1");
    expect(hold.decision).toBe("HOLD");

    const stop = buildMobileSnapshot({ decision: "stop" }, "static_phase1");
    expect(stop.decision).toBe("stop");
  });
});

describe("komashiki state model", () => {
  const ALL_STATES: KomashikiDisplayState[] = [
    "GO", "HOLD", "REJECT", "PASS", "STOP",
    "REVIEW_READY", "PUSH_WAITING", "RUNTIME_RUNNING", "CAVEAT", "SLEEPY",
  ];

  it("komashikiState passes through buildMobileSnapshot", () => {
    for (const state of ALL_STATES) {
      const snap = buildMobileSnapshot({ komashikiState: state }, "static_phase1");
      expect(snap.komashikiState).toBe(state);
    }
  });

  it("HOLD state does not imply GO authority", () => {
    const snap = buildMobileSnapshot({ komashikiState: "HOLD" }, "static_phase1");
    expect(snap.komashikiState).toBe("HOLD");
    expect(snap.execution).toBe("disabled");
    expect(snap.productionReady).toBe(false);
  });

  it("PASS state does not imply productionReady", () => {
    const snap = buildMobileSnapshot({ komashikiState: "PASS" }, "static_phase1");
    expect(snap.komashikiState).toBe("PASS");
    expect(snap.productionReady).toBe(false);
    expect(snap.execution).toBe("disabled");
  });

  it("CAVEAT state is non-blocking — safety invariants still hold", () => {
    const snap = buildMobileSnapshot({ komashikiState: "CAVEAT" }, "static_phase1");
    expect(snap.komashikiState).toBe("CAVEAT");
    expect(snap.productionReady).toBe(false);
    expect(snap.execution).toBe("disabled");
    expect(snap.rawValuesReported).toBe(false);
  });

  it("GO state does not imply autonomous execution", () => {
    const snap = buildMobileSnapshot({ komashikiState: "GO" }, "static_phase1");
    expect(snap.komashikiState).toBe("GO");
    expect(snap.execution).toBe("disabled");
    expect(snap.productionReady).toBe(false);
    expect(snap.level3).toBe("not_approved");
  });
});

describe("caveat display — non-blocking", () => {
  it("windows caveat passes through snapshot without breaking safety", () => {
    const caveats = ["windows_manual_installer_required_non_blocking"] as const;
    const snap = buildMobileSnapshot({ caveats, komashikiState: "CAVEAT" }, "redacted_snapshot_phase2c_same_lan");
    expect(snap.caveats).toEqual(caveats);
    expect(snap.productionReady).toBe(false);
    expect(snap.execution).toBe("disabled");
    expect(snap.rawValuesReported).toBe(false);
  });

  it("multiple caveats pass through without adding execution", () => {
    const caveats = ["caveat_a", "caveat_b"] as const;
    const snap = buildMobileSnapshot({ caveats }, "static_phase1");
    expect(snap.caveats?.length).toBe(2);
    expect(snap.execution).toBe("disabled");
  });
});

describe("next human action field", () => {
  it("nextHumanAction passes through snapshot", () => {
    const snap = buildMobileSnapshot(
      { nextHumanAction: "push GO required" },
      "static_phase1",
    );
    expect(snap.nextHumanAction).toBe("push GO required");
  });

  it("nextHumanAction does not affect safety invariants", () => {
    const snap = buildMobileSnapshot(
      { nextHumanAction: "review evidence and approve" },
      "static_phase1",
    );
    expect(snap.productionReady).toBe(false);
    expect(snap.execution).toBe("disabled");
  });
});

describe("phase progress field", () => {
  it("phaseProgress and currentSession pass through snapshot", () => {
    const snap = buildMobileSnapshot(
      {
        phaseProgress: "30% COMPLETE_PASS_WITH_CAVEAT",
        currentSession: "Session 004 PASS_WITH_CAVEAT",
      },
      "redacted_snapshot_phase2c_same_lan",
    );
    expect(snap.phaseProgress).toBe("30% COMPLETE_PASS_WITH_CAVEAT");
    expect(snap.currentSession).toBe("Session 004 PASS_WITH_CAVEAT");
    expect(snap.productionReady).toBe(false);
  });
});

describe("default snapshot alignment with 30% state", () => {
  it("default komashikiState is PUSH_WAITING", () => {
    expect(MOBILE_CONSOLE_DEFAULT_SNAPSHOT.komashikiState).toBe("PUSH_WAITING");
  });

  it("default caveats include windows caveat", () => {
    expect(MOBILE_CONSOLE_DEFAULT_SNAPSHOT.caveats).toContain(
      "windows_manual_installer_required_non_blocking",
    );
  });

  it("default phaseProgress reflects 30% milestone", () => {
    expect(MOBILE_CONSOLE_DEFAULT_SNAPSHOT.phaseProgress).toContain("30%");
  });

  it("default safety invariants are preserved", () => {
    expect(MOBILE_CONSOLE_DEFAULT_SNAPSHOT.productionReady).toBe(false);
    expect(MOBILE_CONSOLE_DEFAULT_SNAPSHOT.rawValuesReported).toBe(false);
    expect(MOBILE_CONSOLE_DEFAULT_SNAPSHOT.execution).toBe("disabled");
    expect(MOBILE_CONSOLE_DEFAULT_SNAPSHOT.level3).toBe("not_approved");
  });
});
