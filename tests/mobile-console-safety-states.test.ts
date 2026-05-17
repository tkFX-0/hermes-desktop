import { describe, it, expect } from "vitest";
import {
  buildMobileSnapshot,
  deriveDisplayExpressionState,
  MOBILE_CONSOLE_DEFAULT_SNAPSHOT,
  mapKomashikiToDisplayExpression,
} from "../src/shared/mobile-console";
import type {
  ApprovalQueueItem,
  DraftOutboxItem,
  KomashikiDisplayState,
} from "../src/shared/mobile-console";
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

describe("display terminal preview safety model", () => {
  it("default display terminal is not arrived and display-only", () => {
    const { displayTerminalPreview: preview, displayTerminalSummary: summary } =
      MOBILE_CONSOLE_DEFAULT_SNAPSHOT;

    expect(preview.terminalKind).toBe("stackchan_display");
    expect(preview.connectionState).toBe("not_arrived");
    expect(summary.deviceArrivalStatus).toBe("not_arrived");
    expect(summary.physicalTestStatus).toBe("deferred");
    expect(summary.connectionAttempted).toBe(false);
    expect(preview.physicalOperation).toBe(false);
    expect(preview.voiceEnabled).toBe(false);
    expect(preview.cameraEnabled).toBe(false);
    expect(preview.microphoneEnabled).toBe(false);
    expect(preview.execution).toBe("disabled");
    expect(preview.productionReady).toBe(false);
    expect(preview.rawValuesReported).toBe(false);
  });

  it("display terminal redaction keeps unsafe attempted fields disabled", () => {
    const unsafePreview = {
      ...MOBILE_CONSOLE_DEFAULT_SNAPSHOT.displayTerminalPreview,
      physicalOperation: true,
      voiceEnabled: true,
      cameraEnabled: true,
      microphoneEnabled: true,
      execution: "enabled",
      productionReady: true,
      rawValuesReported: true,
    } as unknown as typeof MOBILE_CONSOLE_DEFAULT_SNAPSHOT.displayTerminalPreview;

    const snap = buildMobileSnapshot({ displayTerminalPreview: unsafePreview }, "static_phase1");

    expect(snap.displayTerminalPreview.physicalOperation).toBe(false);
    expect(snap.displayTerminalPreview.voiceEnabled).toBe(false);
    expect(snap.displayTerminalPreview.cameraEnabled).toBe(false);
    expect(snap.displayTerminalPreview.microphoneEnabled).toBe(false);
    expect(snap.displayTerminalPreview.execution).toBe("disabled");
    expect(snap.displayTerminalPreview.productionReady).toBe(false);
    expect(snap.displayTerminalPreview.rawValuesReported).toBe(false);
  });

  it("critical device approval item maps to caution display", () => {
    expect(
      deriveDisplayExpressionState({
        approvalQueue: MOBILE_CONSOLE_DEFAULT_SNAPSHOT.approvalQueue,
        komashikiState: "PASS",
      }),
    ).toBe("caution");
  });

  it("komashiki states map to display expressions", () => {
    expect(mapKomashikiToDisplayExpression("PUSH_WAITING")).toBe("push_waiting");
    expect(mapKomashikiToDisplayExpression("CAVEAT")).toBe("pass_with_caveat");
    expect(mapKomashikiToDisplayExpression("PASS", ["caveat"])).toBe("pass_with_caveat");
    expect(mapKomashikiToDisplayExpression("PASS")).toBe("pass");
    expect(mapKomashikiToDisplayExpression("STOP")).toBe("stop");
  });
});

describe("mobile ui display terminal rendering", () => {
  it("renders display terminal preview with non-execution labels", () => {
    const html = buildMobileUiHtml();

    expect(html).toContain("Display Terminal Preview");
    expect(html).toContain("Physical device not connected");
    expect(html).toContain("StackChan has not arrived");
    expect(html).toContain("No robot motion");
    expect(html).toContain("voice/camera/mic");
    expect(html).toContain("renderDisplayPreview");
  });

  it("does not render device connection or hardware action buttons", () => {
    const html = buildMobileUiHtml();

    expect(html).not.toContain("Connect StackChan");
    expect(html).not.toContain("Test device");
    expect(html).not.toContain("Move robot");
    expect(html).not.toContain("Speak");
    expect(html).not.toContain("Camera");
    expect(html).not.toContain("Microphone");
    expect(html).not.toContain("Send command");
  });
});

describe("draft outbox safety model", () => {
  it("default draft outbox is draft-only and cannot write externally", () => {
    const { draftOutbox, draftOutboxSummary } = MOBILE_CONSOLE_DEFAULT_SNAPSHOT;

    expect(draftOutbox.length).toBeGreaterThan(0);
    expect(draftOutboxSummary.total).toBe(draftOutbox.length);
    expect(draftOutboxSummary.displayOnly).toBe(true);
    expect(draftOutboxSummary.externalWrite).toBe(false);
    expect(draftOutboxSummary.sent).toBe(false);
    expect(draftOutboxSummary.remoteCreated).toBe(false);
    expect(draftOutboxSummary.paymentOrReservation).toBe(false);
    expect(draftOutboxSummary.execution).toBe("disabled");
    expect(draftOutboxSummary.productionReady).toBe(false);
    expect(draftOutboxSummary.rawValuesReported).toBe(false);

    for (const item of draftOutbox) {
      expect(item.externalWrite).toBe(false);
      expect(item.sent).toBe(false);
      expect(item.remoteCreated).toBe(false);
      expect(item.paymentOrReservation).toBe(false);
      expect(item.execution).toBe("disabled");
      expect(item.productionReady).toBe(false);
      expect(item.rawValuesReported).toBe(false);
    }
  });

  it("draft outbox redaction keeps unsafe attempted fields disabled", () => {
    const unsafeItem = {
      ...MOBILE_CONSOLE_DEFAULT_SNAPSHOT.draftOutbox[0],
      externalWrite: true,
      sent: true,
      remoteCreated: true,
      paymentOrReservation: true,
      execution: "enabled",
      productionReady: true,
      rawValuesReported: true,
    } as unknown as DraftOutboxItem;

    const snap = buildMobileSnapshot({ draftOutbox: [unsafeItem] }, "static_phase1");

    expect(snap.draftOutbox[0].externalWrite).toBe(false);
    expect(snap.draftOutbox[0].sent).toBe(false);
    expect(snap.draftOutbox[0].remoteCreated).toBe(false);
    expect(snap.draftOutbox[0].paymentOrReservation).toBe(false);
    expect(snap.draftOutbox[0].execution).toBe("disabled");
    expect(snap.draftOutbox[0].productionReady).toBe(false);
    expect(snap.draftOutbox[0].rawValuesReported).toBe(false);
  });

  it("contains held purchase/reservation and remote draft items only", () => {
    const purchase = MOBILE_CONSOLE_DEFAULT_SNAPSHOT.draftOutbox.find(
      (item) => item.actionKind === "purchase_or_reservation_draft",
    );
    const github = MOBILE_CONSOLE_DEFAULT_SNAPSHOT.draftOutbox.find(
      (item) => item.actionKind === "github_issue_draft",
    );

    expect(purchase?.draftState).toBe("held");
    expect(purchase?.riskLevel).toBe("critical");
    expect(purchase?.paymentOrReservation).toBe(false);
    expect(github?.remoteCreated).toBe(false);
  });
});

describe("mobile ui draft outbox rendering", () => {
  it("renders draft outbox as no-write HTML with inactive controls", () => {
    const html = buildMobileUiHtml();

    expect(html).toContain("Draft Outbox");
    expect(html).toContain("Draft-only / No external write / No send / No remote creation / Human copy required");
    expect(html).toContain("Send inactive");
    expect(html).toContain("Create remote inactive");
    expect(html).toContain("Pay inactive");
    expect(html).toContain("renderDraftOutbox");
  });

  it("does not include active external action affordances", () => {
    const html = buildMobileUiHtml();

    expect(html).not.toContain("sendEmail(");
    expect(html).not.toContain("createCalendar");
    expect(html).not.toContain("createIssue");
    expect(html).not.toContain("purchase(");
    expect(html).not.toContain("fetch('https://");
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

  it("default phaseProgress reflects 75 to 90 draft outbox milestone", () => {
    expect(MOBILE_CONSOLE_DEFAULT_SNAPSHOT.phaseProgress).toContain("75");
    expect(MOBILE_CONSOLE_DEFAULT_SNAPSHOT.phaseProgress).toContain("draft outbox");
  });

  it("default safety invariants are preserved", () => {
    expect(MOBILE_CONSOLE_DEFAULT_SNAPSHOT.productionReady).toBe(false);
    expect(MOBILE_CONSOLE_DEFAULT_SNAPSHOT.rawValuesReported).toBe(false);
    expect(MOBILE_CONSOLE_DEFAULT_SNAPSHOT.execution).toBe("disabled");
    expect(MOBILE_CONSOLE_DEFAULT_SNAPSHOT.level3).toBe("not_approved");
  });
});
