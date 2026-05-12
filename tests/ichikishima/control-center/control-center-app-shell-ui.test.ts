import path from "node:path";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { buildControlCenterAppSnapshot } from "../../../src/main/ichikishima/control-center/control-center-app-snapshot";
import {
  attachHermesWsl2WrapperSlotInventoryRefreshHold,
  buildHermesWsl2WrapperSlotInventoryRefreshSummary,
  hardenHermesWsl2WrapperSelectedDistroAvailabilityHold,
  validateHermesWsl2WrapperLocalValueFileObject,
} from "../../../src/main/ichikishima/hermes/hermes-wsl2-wrapper-local-value-validator";
import { parseControlCenterShellSnapshot } from "../../../src/shared/ichikishima/control-center-shell-ui-contract";

const projRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

function readShellComponentSource(): string {
  return readFileSync(
    path.join(
      projRoot,
      "src/renderer/src/screens/ControlCenterAppShell/ControlCenterAppShell.tsx",
    ),
    "utf8",
  );
}

describe("control-center-app-shell-ui contract", () => {
  it("parseControlCenterShellSnapshot accepts real buildControlCenterAppSnapshot output", () => {
    const snap = buildControlCenterAppSnapshot({
      projectRoot: projRoot,
      zoneRoot: path.join(projRoot, "sandbox", "hermes-autonomy-zone"),
      dateUtc: "2099-01-15",
      pilotLoop: null,
    });
    const r = parseControlCenterShellSnapshot(snap);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.snapshot.productionReady).toBe(false);
      expect(r.snapshot.pathResolutionRuntimeMode).toBeDefined();
      expect(r.snapshot.snapshotSourceLabel).toBe(
        "development_snapshot_dev_only_source",
      );
      expect(r.snapshot.pendingPackagingResolution).toBe(false);
      expect(r.snapshot.rooms.rooms.length).toBeGreaterThan(0);
      for (const room of r.snapshot.rooms.rooms) {
        expect(room.actions.every((a) => a.state === "disabled")).toBe(true);
      }
      expect(r.snapshot.agentTeamSummary.schedulerEnabled).toBe(false);
    }
  });

  it("rejects null snapshot (no empty success)", () => {
    expect(parseControlCenterShellSnapshot(null).ok).toBe(false);
  });

  it("parse rejects leaked absolute-looking path resolution summaries", () => {
    const snap = buildControlCenterAppSnapshot({
      projectRoot: projRoot,
      zoneRoot: path.join(projRoot, "sandbox", "hermes-autonomy-zone"),
      dateUtc: "2099-01-16",
      pilotLoop: null,
    });
    const poisoned = {
      ...snap,
      pathResolutionSafeSummaryLines: [
        ...snap.pathResolutionSafeSummaryLines,
        "X:\\Leak\\bad",
      ],
    };
    expect(parseControlCenterShellSnapshot(poisoned).ok).toBe(false);
  });

  it("parse accepts selected distro availability HOLD without raw values", () => {
    const base = validateHermesWsl2WrapperLocalValueFileObject({
      distroName: "<WSL_DISTRO_NAME>",
      unixUser: "<POSIX_USER_TOKEN>",
      wrapperPath:
        "/home/<POSIX_USER_TOKEN>/.hermes-bridge/hermes-bridge-payload-once.sh",
      windowsWslExePath: "C:\\Windows\\System32\\wsl.exe",
      allowedExecutableId: "wsl-hermes-bridge-wrapper-v1",
      timeoutMs: 120000,
      maxStdoutBytes: 65536,
      maxStderrBytes: 8192,
      expectedPayloadSchemaVersion: "hermes-bridge-payload/v1",
      logLevel: "minimal",
      signoffSource: "<SIGNOFF_REF>",
      signoffAtUnixMs: null,
      operatorLabel: "<OPERATOR_ROLE_LABEL>",
    });
    const snap = buildControlCenterAppSnapshot({
      projectRoot: projRoot,
      zoneRoot: path.join(projRoot, "sandbox", "hermes-autonomy-zone"),
      dateUtc: "2099-01-17",
      pilotLoop: null,
      wsl2LocalValueValidationReport:
        hardenHermesWsl2WrapperSelectedDistroAvailabilityHold(base, {
          selectedSlot: "slot-02",
          failureCategory: "whoami_failed_and_user_env_failed",
        }),
    });

    const parsed = parseControlCenterShellSnapshot(snap);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      const summary =
        parsed.snapshot.wsl2LocalValueValidationSummary
          .selectedDistroAvailabilitySummary;
      expect(summary?.selectedSlot).toBe("slot-02");
      expect(summary?.availability).toBe("failed");
      expect(summary?.failureCategory).toBe(
        "whoami_failed_and_user_env_failed",
      );
      expect(summary?.localJsonUpdatedForDistroUserWrapper).toBe(false);
      expect(summary?.rawValuesReported).toBe(false);
    }
    const wire = JSON.stringify(snap).toLowerCase();
    expect(wire).not.toContain("redactedsummarylines");
    expect(wire).not.toContain("wsl_distro_name");
    expect(wire).not.toContain("posix_user_token");
    expect(wire).not.toContain("/home/");
  });

  it("parse accepts selected slot failed choose-another-slot status", () => {
    const base = validateHermesWsl2WrapperLocalValueFileObject({
      distroName: "<WSL_DISTRO_NAME>",
      unixUser: "<POSIX_USER_TOKEN>",
      wrapperPath:
        "/home/<POSIX_USER_TOKEN>/.hermes-bridge/hermes-bridge-payload-once.sh",
      windowsWslExePath: "C:\\Windows\\System32\\wsl.exe",
      allowedExecutableId: "wsl-hermes-bridge-wrapper-v1",
      timeoutMs: 120000,
      maxStdoutBytes: 65536,
      maxStderrBytes: 8192,
      expectedPayloadSchemaVersion: "hermes-bridge-payload/v1",
      logLevel: "minimal",
      signoffSource: "<SIGNOFF_REF>",
      signoffAtUnixMs: null,
      operatorLabel: "<OPERATOR_ROLE_LABEL>",
    });
    const snap = buildControlCenterAppSnapshot({
      projectRoot: projRoot,
      zoneRoot: path.join(projRoot, "sandbox", "hermes-autonomy-zone"),
      dateUtc: "2099-01-18",
      pilotLoop: null,
      wsl2LocalValueValidationReport:
        hardenHermesWsl2WrapperSelectedDistroAvailabilityHold(base, {
          selectedSlot: "slot-02",
          failureCategory: "distro_not_in_current_wsl_list",
          nextRequiredHumanAction: "choose_another_slot",
        }),
    });

    const parsed = parseControlCenterShellSnapshot(snap);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      const summary =
        parsed.snapshot.wsl2LocalValueValidationSummary
          .selectedDistroAvailabilitySummary;
      expect(parsed.snapshot.wsl2LocalValueValidationSummary.decision).toBe(
        "hold",
      );
      expect(summary?.selectedSlot).toBe("slot-02");
      expect(summary?.availability).toBe("failed");
      expect(summary?.failureCategory).toBe("distro_not_in_current_wsl_list");
      expect(summary?.nextRequiredHumanAction).toBe("choose_another_slot");
      expect(summary?.rawValuesReported).toBe(false);
    }
    const wire = JSON.stringify(snap).toLowerCase();
    expect(wire).not.toContain("wsl_distro_name");
    expect(wire).not.toContain("posix_user_token");
    expect(wire).not.toContain("/home/");
  });

  it("parse accepts refreshed slot inventory with slot IDs only", () => {
    const base = validateHermesWsl2WrapperLocalValueFileObject({
      distroName: "<WSL_DISTRO_NAME>",
      unixUser: "<POSIX_USER_TOKEN>",
      wrapperPath:
        "/home/<POSIX_USER_TOKEN>/.hermes-bridge/hermes-bridge-payload-once.sh",
      windowsWslExePath: "C:\\Windows\\System32\\wsl.exe",
      allowedExecutableId: "wsl-hermes-bridge-wrapper-v1",
      timeoutMs: 120000,
      maxStdoutBytes: 65536,
      maxStderrBytes: 8192,
      expectedPayloadSchemaVersion: "hermes-bridge-payload/v1",
      logLevel: "minimal",
      signoffSource: "<SIGNOFF_REF>",
      signoffAtUnixMs: null,
      operatorLabel: "<OPERATOR_ROLE_LABEL>",
    });
    const snap = buildControlCenterAppSnapshot({
      projectRoot: projRoot,
      zoneRoot: path.join(projRoot, "sandbox", "hermes-autonomy-zone"),
      dateUtc: "2099-01-19",
      pilotLoop: null,
      wsl2LocalValueValidationReport:
        attachHermesWsl2WrapperSlotInventoryRefreshHold(
          base,
          buildHermesWsl2WrapperSlotInventoryRefreshSummary({
            distroDiscoveryStatus: "refreshed",
            distroCount: 3,
            selectableSlots: ["slot-01", "slot-02", "slot-03"],
            previousSelectedSlot: "slot-02",
            previousFailureReason: "distro_not_in_current_wsl_list",
          }),
        ),
    });

    const parsed = parseControlCenterShellSnapshot(snap);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      const summary =
        parsed.snapshot.wsl2LocalValueValidationSummary
          .slotInventoryRefreshSummary;
      expect(summary?.distroDiscoveryStatus).toBe("refreshed");
      expect(summary?.distroCount).toBe(3);
      expect(summary?.selectableSlots).toEqual([
        "slot-01",
        "slot-02",
        "slot-03",
      ]);
      expect(summary?.selectedSlot).toBe("none");
      expect(summary?.nextRequiredHumanAction).toBe("select_slot_id");
      expect(summary?.rawValuesReported).toBe(false);
      expect(summary?.execution).toBe("disabled");
    }
    const wire = JSON.stringify(snap).toLowerCase();
    expect(wire).not.toContain("wsl_distro_name");
    expect(wire).not.toContain("posix_user_token");
    expect(wire).not.toContain("/home/");
  });

  it("parse accepts selected refreshed slot as redacted HOLD", () => {
    const base = validateHermesWsl2WrapperLocalValueFileObject({
      distroName: "<WSL_DISTRO_NAME>",
      unixUser: "<POSIX_USER_TOKEN>",
      wrapperPath:
        "/home/<POSIX_USER_TOKEN>/.hermes-bridge/hermes-bridge-payload-once.sh",
      windowsWslExePath: "C:\\Windows\\System32\\wsl.exe",
      allowedExecutableId: "wsl-hermes-bridge-wrapper-v1",
      timeoutMs: 120000,
      maxStdoutBytes: 65536,
      maxStderrBytes: 8192,
      expectedPayloadSchemaVersion: "hermes-bridge-payload/v1",
      logLevel: "minimal",
      signoffSource: "<SIGNOFF_REF>",
      signoffAtUnixMs: null,
      operatorLabel: "<OPERATOR_ROLE_LABEL>",
    });
    const snap = buildControlCenterAppSnapshot({
      projectRoot: projRoot,
      zoneRoot: path.join(projRoot, "sandbox", "hermes-autonomy-zone"),
      dateUtc: "2099-01-20",
      pilotLoop: null,
      wsl2LocalValueValidationReport:
        attachHermesWsl2WrapperSlotInventoryRefreshHold(
          base,
          buildHermesWsl2WrapperSlotInventoryRefreshSummary({
            distroDiscoveryStatus: "refreshed",
            distroCount: 3,
            selectableSlots: ["slot-01", "slot-02", "slot-03"],
            selectedSlot: "slot-01",
            previousSelectedSlot: "slot-02",
            previousFailureReason: "distro_not_in_current_wsl_list",
          }),
        ),
    });

    const parsed = parseControlCenterShellSnapshot(snap);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      const summary =
        parsed.snapshot.wsl2LocalValueValidationSummary
          .slotInventoryRefreshSummary;
      expect(summary?.selectedSlot).toBe("slot-01");
      expect(summary?.previousSelectedSlot).toBe("slot-02");
      expect(summary?.nextRequiredHumanAction).toBe(
        "verify_selected_slot_availability_locally",
      );
      expect(summary?.rawValuesReported).toBe(false);
      expect(summary?.execution).toBe("disabled");
    }
    const wire = JSON.stringify(snap).toLowerCase();
    expect(wire).not.toContain("wsl_distro_name");
    expect(wire).not.toContain("posix_user_token");
    expect(wire).not.toContain("/home/");
  });

  it("parse accepts selected slot failure and inventory consistency status", () => {
    const base = validateHermesWsl2WrapperLocalValueFileObject({
      distroName: "<WSL_DISTRO_NAME>",
      unixUser: "<POSIX_USER_TOKEN>",
      wrapperPath:
        "/home/<POSIX_USER_TOKEN>/.hermes-bridge/hermes-bridge-payload-once.sh",
      windowsWslExePath: "C:\\Windows\\System32\\wsl.exe",
      allowedExecutableId: "wsl-hermes-bridge-wrapper-v1",
      timeoutMs: 120000,
      maxStdoutBytes: 65536,
      maxStderrBytes: 8192,
      expectedPayloadSchemaVersion: "hermes-bridge-payload/v1",
      logLevel: "minimal",
      signoffSource: "<SIGNOFF_REF>",
      signoffAtUnixMs: null,
      operatorLabel: "<OPERATOR_ROLE_LABEL>",
    });
    const snap = buildControlCenterAppSnapshot({
      projectRoot: projRoot,
      zoneRoot: path.join(projRoot, "sandbox", "hermes-autonomy-zone"),
      dateUtc: "2099-01-21",
      pilotLoop: null,
      wsl2LocalValueValidationReport:
        attachHermesWsl2WrapperSlotInventoryRefreshHold(
          base,
          buildHermesWsl2WrapperSlotInventoryRefreshSummary({
            distroDiscoveryStatus: "refreshed",
            distroCount: 3,
            selectableSlots: ["slot-01", "slot-02", "slot-03"],
            selectedSlot: "slot-01",
            selectedAvailability: "failed",
            selectedFailureReason: "distro_not_in_current_wsl_list",
            previousSelectedSlot: "slot-02",
            previousFailureReason: "distro_not_in_current_wsl_list",
            inventoryCountConsistency: "matched",
            inventoryContentConsistency: "partial",
            slotStatuses: [
              { slotId: "slot-01", status: "mismatch" },
              { slotId: "slot-02", status: "matched" },
              { slotId: "slot-03", status: "matched" },
            ],
            slotMapCount: 3,
            currentInventoryCount: 3,
            nextRequiredHumanAction: "choose_matched_slot_id",
          }),
        ),
    });

    const parsed = parseControlCenterShellSnapshot(snap);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      const summary =
        parsed.snapshot.wsl2LocalValueValidationSummary
          .slotInventoryRefreshSummary;
      expect(summary?.selectedSlot).toBe("slot-01");
      expect(summary?.selectedAvailability).toBe("failed");
      expect(summary?.selectedFailureReason).toBe(
        "distro_not_in_current_wsl_list",
      );
      expect(summary?.previousSelectedSlot).toBe("slot-02");
      expect(summary?.inventoryConsistency).toBeUndefined();
      expect(summary?.inventoryCountConsistency).toBe("matched");
      expect(summary?.inventoryContentConsistency).toBe("partial");
      expect(summary?.slotStatuses).toEqual([
        { slotId: "slot-01", status: "mismatch" },
        { slotId: "slot-02", status: "matched" },
        { slotId: "slot-03", status: "matched" },
      ]);
      expect(summary?.nextRequiredHumanAction).toBe("choose_matched_slot_id");
      expect(summary?.rawValuesReported).toBe(false);
      expect(summary?.execution).toBe("disabled");
    }
    const wire = JSON.stringify(snap).toLowerCase();
    expect(wire).not.toContain("wsl_distro_name");
    expect(wire).not.toContain("posix_user_token");
    expect(wire).not.toContain("/home/");
  });

  it("rejects productionReady true", () => {
    const bad = {
      appStatus: "x",
      generatedAtUnixMs: 1,
      productionReady: true,
      rooms: { rooms: [] },
      agentTeamSummary: {
        schedulerEnabled: false,
        blockerCountApprox: 0,
        warningCountApprox: 0,
        agents: [],
      },
      visualizationModel: { footerNote: "", nodes: [] },
      approvalAuditSummary: {
        latestShortStatusHints: [],
        approvalQueueApproxCount: null,
        auditApproxCount: null,
      },
      memorySummary: { candidateApproxCount: 0, safeSummaryLines: [] },
      warnings: [],
      blockers: [],
    };
    expect(parseControlCenterShellSnapshot(bad).ok).toBe(false);
  });
});

describe("control-center-app-shell-ui forbiddens (static)", () => {
  const forbidden = [
    "runHermes",
    "runWsl",
    "executeApproval",
    "saveMemory",
    "rawFs",
    "rawIpc",
    /invoke\s*\(\s*["']/,
    "window.hermesAPI",
    ".stack",
  ] as const;

  it("shell component avoids forbidden executor patterns", () => {
    const src = readShellComponentSource();
    for (const f of forbidden) {
      if (typeof f === "string") {
        expect(src.includes(f), `unexpected substring: ${f}`).toBe(false);
      } else {
        expect(f.test(src), `matched forbidden pattern ${f}`).toBe(false);
      }
    }
    expect(src).toContain('role="main"');
    expect(src).toContain("aria-busy");
    expect(src).toContain("controlCenter.shell.mainLandmarkLabel");
    expect(src).toContain("controlCenter.shell.statusAtAGlance");
    expect(src).toContain("ichikishimaControlCenter");
    expect(src).toContain("SOURCE_LABEL_I18N");
    expect(src).toContain("wsl2SelectedDistroAvailability");
    expect(src).toContain("selected slot failed");
    expect(src).toContain("choose another slot required");
    expect(src).toContain("wsl2CurrentSlotInventory");
    expect(src).toContain("slot IDs only");
    expect(src).toContain("Raw values: hidden");
    expect(src).toContain("selected slot failed before launch");
    expect(src).toContain("slot count matches");
    expect(src).toContain("selected slot does not match current WSL inventory");
    expect(src).toContain("decision remains HOLD");
    expect(src).toContain("execution remains disabled");
    expect(src).toContain("countConsistency");
    expect(src).toContain("contentConsistency");
    expect(src).toContain("slotStatuses");
    expect(src).toContain("rawValuesReported");
    expect(src).toContain("Execution=disabled");
  });

  it("error paths do not stringify raw exceptions", () => {
    const src = readShellComponentSource();
    expect(src).not.toMatch(
      /catch\s*\([^)]*\)\s*\{[^}]*String\s*\(\s*\w+\s*\)/s,
    );
    expect(src).not.toContain("console.error");
    expect(src).not.toContain("JSON.stringify");
  });

  it("shell component avoids misleading production claims", () => {
    const src = readShellComponentSource().toLowerCase();
    expect(src).not.toContain("production verified");
    expect(src).not.toContain("packaged safe");
  });
});
