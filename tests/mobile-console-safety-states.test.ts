import { describe, it, expect } from "vitest";
import {
  buildMobileSnapshot,
  MOBILE_CONSOLE_DEFAULT_SNAPSHOT,
} from "../src/shared/mobile-console";
import type { ApprovalQueueItem, KomashikiDisplayState } from "../src/shared/mobile-console";
import { buildMobileUiHtml } from "../src/main/mobile-console/mobile-console-local-server";

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

describe("approval queue safety model", () => {
  it("default approval queue requires human action and preserves safety invariants", () => {
    const snap = MOBILE_CONSOLE_DEFAULT_SNAPSHOT;

    expect(snap.approvalQueue.length).toBeGreaterThan(0);
    expect(snap.approvalQueueSummary.total).toBe(snap.approvalQueue.length);
    expect(snap.approvalQueueSummary.displayOnly).toBe(true);
    expect(snap.approvalQueueSummary.execution).toBe("disabled");
    expect(snap.approvalQueueSummary.productionReady).toBe(false);
    expect(snap.approvalQueueSummary.rawValuesReported).toBe(false);

    for (const item of snap.approvalQueue) {
      expect(item.requiredHumanAction.length).toBeGreaterThan(0);
      expect(item.execution).toBe("disabled");
      expect(item.productionReady).toBe(false);
      expect(item.rawValuesReported).toBe(false);
    }
  });

  it("git push item is display-only and cannot perform push", () => {
    const item = MOBILE_CONSOLE_DEFAULT_SNAPSHOT.approvalQueue.find(
      (entry) => entry.actionKind === "git_push",
    );

    expect(item).toBeDefined();
    expect(item?.decisionState).toBe("waiting_human");
    expect(item?.blockedReason).toContain("cannot push");
    expect(item?.execution).toBe("disabled");
  });

  it("runtime observation and critical device operation stay held", () => {
    const runtime = MOBILE_CONSOLE_DEFAULT_SNAPSHOT.approvalQueue.find(
      (entry) => entry.actionKind === "runtime_observation",
    );
    const device = MOBILE_CONSOLE_DEFAULT_SNAPSHOT.approvalQueue.find(
      (entry) => entry.actionKind === "device_operation",
    );

    expect(runtime?.decisionState).toBe("held_by_human");
    expect(runtime?.riskLevel).toBe("high");
    expect(device?.decisionState).toBe("held_by_human");
    expect(device?.riskLevel).toBe("critical");
  });

  it("approval queue redaction keeps attempted raw fields disabled", () => {
    const unsafeItem = {
      ...MOBILE_CONSOLE_DEFAULT_SNAPSHOT.approvalQueue[0],
      title: "Safe item",
      rawValuesReported: true,
      execution: "enabled",
      productionReady: true,
    } as unknown as ApprovalQueueItem;

    const snap = buildMobileSnapshot({ approvalQueue: [unsafeItem] }, "static_phase1");

    expect(snap.approvalQueue[0].rawValuesReported).toBe(false);
    expect(snap.approvalQueue[0].execution).toBe("disabled");
    expect(snap.approvalQueue[0].productionReady).toBe(false);
    expect(snap.rawValuesReported).toBe(false);
    expect(snap.execution).toBe("disabled");
    expect(snap.productionReady).toBe(false);
  });

  it("approval queue keeps komashiki in HOLD while high and critical items are held", () => {
    const snap = MOBILE_CONSOLE_DEFAULT_SNAPSHOT;

    expect(snap.komashikiState).toBe("HOLD");
    expect(snap.approvalQueue.some((item) => item.riskLevel === "critical")).toBe(true);
    expect(snap.execution).toBe("disabled");
  });
});

describe("mobile ui approval queue rendering", () => {
  it("renders approval queue as display-only HTML with inactive controls", () => {
    const html = buildMobileUiHtml();

    expect(html).toContain("Approval Queue");
    expect(html).toContain("Display-only / No execution / Human decision required");
    expect(html).toContain("Approve inactive");
    expect(html).toContain("Hold inactive");
    expect(html).toContain("Reject inactive");
    expect(html).toContain("renderApprovalQueue");
  });

  it("keeps token masked and avoids persistence or console logging", () => {
    const html = buildMobileUiHtml();

    expect(html).toContain('type="password"');
    expect(html).not.toContain("localStorage");
    expect(html).not.toContain("sessionStorage");
    expect(html).not.toContain("console.log");
    expect(html).not.toContain("0.0.0.0");
  });
});

describe("default snapshot alignment with 45% state", () => {
  it("default komashikiState is HOLD", () => {
    expect(MOBILE_CONSOLE_DEFAULT_SNAPSHOT.komashikiState).toBe("HOLD");
  });

  it("default caveats include windows caveat", () => {
    expect(MOBILE_CONSOLE_DEFAULT_SNAPSHOT.caveats).toContain(
      "windows_manual_installer_required_non_blocking",
    );
  });

  it("default phaseProgress reflects 45 to 60 approval queue milestone", () => {
    expect(MOBILE_CONSOLE_DEFAULT_SNAPSHOT.phaseProgress).toContain("45");
    expect(MOBILE_CONSOLE_DEFAULT_SNAPSHOT.phaseProgress).toContain("approval queue");
  });

  it("default safety invariants are preserved", () => {
    expect(MOBILE_CONSOLE_DEFAULT_SNAPSHOT.productionReady).toBe(false);
    expect(MOBILE_CONSOLE_DEFAULT_SNAPSHOT.rawValuesReported).toBe(false);
    expect(MOBILE_CONSOLE_DEFAULT_SNAPSHOT.execution).toBe("disabled");
    expect(MOBILE_CONSOLE_DEFAULT_SNAPSHOT.level3).toBe("not_approved");
  });
});
