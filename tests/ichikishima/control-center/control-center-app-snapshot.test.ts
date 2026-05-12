import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  assertAppSnapshotContainsNoApiNameArrays,
  buildControlCenterAppSnapshot,
  sanitizeControlCenterAppSnapshot,
} from "../../../src/main/ichikishima/control-center/control-center-app-snapshot";
import {
  attachHermesWsl2WrapperSlotInventoryRefreshHold,
  buildHermesWsl2WrapperSlotInventoryRefreshSummary,
  hardenHermesWsl2WrapperSelectedDistroAvailabilityHold,
  validateHermesWsl2WrapperLocalValueFileObject,
} from "../../../src/main/ichikishima/hermes/hermes-wsl2-wrapper-local-value-validator";

describe("control-center-app-snapshot", () => {
  const projectRoot = path.resolve(__dirname, "../../..");
  const zoneRoot = path.join(projectRoot, "sandbox", "hermes-autonomy-zone");

  it("does not expose allowedApis/forbiddenApis arrays or secrets patterns", () => {
    const snap = buildControlCenterAppSnapshot({
      projectRoot,
      zoneRoot,
      dateUtc: "2099-12-07",
      pilotLoop: null,
      nowUnixMs: 1700_000_000_000,
    });

    sanitizeControlCenterAppSnapshot(snap);
    assertAppSnapshotContainsNoApiNameArrays(snap);

    expect(snap.pathResolutionSafeSummaryLines.length).toBeGreaterThan(0);
    expect(snap.snapshotSourceLabel).toBeTruthy();
    const wireFull = JSON.stringify(snap);
    expect(wireFull).not.toMatch(/API_KEY=|PASSWORD=|PRIVATE[_-]?KEY/i);
    const prNorm = projectRoot.replace(/\\/g, "/").toLowerCase();
    expect(wireFull.toLowerCase()).not.toContain(prNorm);

    expect(snap.productionReady).toBe(false);
    expect(snap.realHermesProcessStatus).toBe(
      "not_running_not_production_ready",
    );
    expect(snap.agentTeamSummary.schedulerEnabled).toBe(false);
    expect(snap.agentTeamSummary.agents.every((a) => a.autoRun === false)).toBe(
      true,
    );
    expect(snap.visualizationModel.footerNote).toContain("no_stdio_full_text");
    expect(
      snap.approvalAuditSummary.latestSafeSummaryLines.length,
    ).toBeGreaterThan(0);
    expect(snap.memorySummary.excerptSourceHint).toBeTruthy();
    expect(snap.memoryCandidateApproxCount).toBe(
      snap.memorySummary.candidateApproxCount,
    );
    expect(snap.controlledPilotPreflightStatus).toBeTruthy();
    expect(snap.wsl2WrapperParameterSummary.productionReady).toBe(false);
    expect(snap.wsl2WrapperParameterSummary.canRunWsl).toBe(false);
    expect(snap.wsl2WrapperParameterSummary.canRunBridgeOnceViaWsl).toBe(false);
    expect(snap.wsl2WrapperParameterSummary.status).toBe("pending");
    expect(snap.wsl2WrapperStatusLine.startsWith("wsl2_registry:")).toBe(true);
    expect(snap.wsl2HumanValuePacketSummary.humanValuePacketStatus).toBe(
      "pending",
    );
    expect(snap.wsl2HumanValuePacketSummary.sysnativePolicy).toBe(
      "future_candidate_not_allowed_v1",
    );
    expect(snap.wsl2HumanValueStatusLine.startsWith("wsl2_hvp:")).toBe(true);
    expect(snap.wsl2LocalValueValidationSummary.decision).toBe("hold");
    expect(snap.wsl2LocalValueValidationSummary.canRunWsl).toBe(false);
    expect(snap.wsl2LocalValueValidationSummary.canRunOnce).toBe(false);
    expect(snap.wsl2LocalValueValidationSummary.productionReady).toBe(false);
    expect(snap.wsl2LocalValueValidationStatusLine).toContain(
      "wsl2_local_value:",
    );
    for (const r of snap.rooms.rooms) {
      for (const a of r.actions) {
        expect(a.state).toBe("disabled");
      }
    }
  });

  it("baselineReadonly.hermesBridgePilot has counts only", () => {
    const snap = buildControlCenterAppSnapshot({
      projectRoot,
      zoneRoot,
      dateUtc: "2099-12-08",
      pilotLoop: null,
    });
    expect("allowedApisCount" in snap.baselineReadonly.hermesBridgePilot).toBe(
      true,
    );
    expect(
      (snap.baselineReadonly.hermesBridgePilot as { allowedApis?: unknown })
        .allowedApis,
    ).toBeUndefined();
  });

  it("exposes local value validation as safe counts only", () => {
    const snap = buildControlCenterAppSnapshot({
      projectRoot,
      zoneRoot,
      dateUtc: "2099-12-09",
      pilotLoop: null,
      wsl2LocalValueValidationInput: {
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
      },
    });

    expect(snap.wsl2LocalValueValidationSummary.decision).toBe("hold");
    expect(
      snap.wsl2LocalValueValidationSummary.placeholderFieldCount,
    ).toBeGreaterThan(0);
    expect("redactedSummaryLines" in snap.wsl2LocalValueValidationSummary).toBe(
      false,
    );
    const wire = JSON.stringify(snap).toLowerCase();
    expect(wire).not.toContain("redactedsummarylines");
    expect(wire).not.toContain("wsl_distro_name");
    expect(wire).not.toContain("posix_user_token");
  });

  it("exposes selected distro availability HOLD as slot-only status", () => {
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
      projectRoot,
      zoneRoot,
      dateUtc: "2099-12-10",
      pilotLoop: null,
      wsl2LocalValueValidationReport:
        hardenHermesWsl2WrapperSelectedDistroAvailabilityHold(base, {
          selectedSlot: "slot-02",
          failureCategory: "whoami_failed_and_user_env_failed",
        }),
    });

    const summary =
      snap.wsl2LocalValueValidationSummary.selectedDistroAvailabilitySummary;
    expect(snap.wsl2LocalValueValidationSummary.decision).toBe("hold");
    expect(snap.wsl2LocalValueValidationSummary.validationStatus).toBe(
      "selected_distro_availability_hold",
    );
    expect(summary?.selectedSlot).toBe("slot-02");
    expect(summary?.availability).toBe("failed");
    expect(summary?.failureCategory).toBe("whoami_failed_and_user_env_failed");
    expect(summary?.rawValuesReported).toBe(false);
    expect(snap.wsl2LocalValueValidationStatusLine).toContain(
      "selected_slot=slot-02",
    );
    const wire = JSON.stringify(snap).toLowerCase();
    expect(wire).not.toContain("redactedsummarylines");
    expect(wire).not.toContain("wsl_distro_name");
    expect(wire).not.toContain("posix_user_token");
    expect(wire).not.toContain("/home/");
  });

  it("exposes unavailable selected slot as choose-another-slot HOLD", () => {
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
      projectRoot,
      zoneRoot,
      dateUtc: "2099-12-11",
      pilotLoop: null,
      wsl2LocalValueValidationReport:
        hardenHermesWsl2WrapperSelectedDistroAvailabilityHold(base, {
          selectedSlot: "slot-02",
          failureCategory: "distro_not_in_current_wsl_list",
          nextRequiredHumanAction: "choose_another_slot",
        }),
    });

    const summary =
      snap.wsl2LocalValueValidationSummary.selectedDistroAvailabilitySummary;
    expect(snap.wsl2LocalValueValidationSummary.decision).toBe("hold");
    expect(snap.wsl2LocalValueValidationSummary.nextRequiredAction).toBe(
      "choose_another_slot",
    );
    expect(summary?.selectedSlot).toBe("slot-02");
    expect(summary?.availability).toBe("failed");
    expect(summary?.failureCategory).toBe("distro_not_in_current_wsl_list");
    expect(summary?.nextRequiredHumanAction).toBe("choose_another_slot");
    expect(summary?.rawValuesReported).toBe(false);
    const wire = JSON.stringify(snap).toLowerCase();
    expect(wire).toContain("slot-02");
    expect(wire).toContain("distro_not_in_current_wsl_list");
    expect(wire).toContain("choose_another_slot");
    expect(wire).not.toContain("wsl_distro_name");
    expect(wire).not.toContain("posix_user_token");
    expect(wire).not.toContain("/home/");
  });

  it("exposes refreshed slot inventory as slot IDs only", () => {
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
      projectRoot,
      zoneRoot,
      dateUtc: "2099-12-12",
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

    const summary =
      snap.wsl2LocalValueValidationSummary.slotInventoryRefreshSummary;
    expect(snap.wsl2LocalValueValidationSummary.decision).toBe("hold");
    expect(snap.wsl2LocalValueValidationSummary.nextRequiredAction).toBe(
      "select_slot_id",
    );
    expect(summary?.distroDiscoveryStatus).toBe("refreshed");
    expect(summary?.distroCount).toBe(3);
    expect(summary?.selectableSlots).toEqual(["slot-01", "slot-02", "slot-03"]);
    expect(summary?.selectedSlot).toBe("none");
    expect(summary?.previousSelectedSlot).toBe("slot-02");
    expect(summary?.previousFailureReason).toBe(
      "distro_not_in_current_wsl_list",
    );
    expect(summary?.rawValuesReported).toBe(false);
    expect(summary?.execution).toBe("disabled");
    const wire = JSON.stringify(snap).toLowerCase();
    expect(wire).toContain("slot-01");
    expect(wire).toContain("slot-03");
    expect(wire).not.toContain("wsl_distro_name");
    expect(wire).not.toContain("posix_user_token");
    expect(wire).not.toContain("/home/");
  });

  it("exposes selected refreshed slot as redacted HOLD", () => {
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
      projectRoot,
      zoneRoot,
      dateUtc: "2099-12-13",
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

    const summary =
      snap.wsl2LocalValueValidationSummary.slotInventoryRefreshSummary;
    expect(snap.wsl2LocalValueValidationSummary.decision).toBe("hold");
    expect(snap.wsl2LocalValueValidationSummary.nextRequiredAction).toBe(
      "verify_selected_slot_availability_locally",
    );
    expect(summary?.selectedSlot).toBe("slot-01");
    expect(summary?.previousSelectedSlot).toBe("slot-02");
    expect(summary?.rawValuesReported).toBe(false);
    expect(summary?.execution).toBe("disabled");
    const wire = JSON.stringify(snap).toLowerCase();
    expect(wire).toContain("slot-01");
    expect(wire).not.toContain("wsl_distro_name");
    expect(wire).not.toContain("posix_user_token");
    expect(wire).not.toContain("/home/");
  });

  it("exposes selected slot failure and inventory consistency as redacted HOLD", () => {
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
      projectRoot,
      zoneRoot,
      dateUtc: "2099-12-14",
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

    const summary =
      snap.wsl2LocalValueValidationSummary.slotInventoryRefreshSummary;
    expect(snap.wsl2LocalValueValidationSummary.decision).toBe("hold");
    expect(snap.wsl2LocalValueValidationSummary.nextRequiredAction).toBe(
      "choose_matched_slot_id",
    );
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
    expect(summary?.rawValuesReported).toBe(false);
    expect(summary?.execution).toBe("disabled");
    const wire = JSON.stringify(snap).toLowerCase();
    expect(wire).not.toContain("inventoryconsistency");
    expect(wire).toContain("inventorycountconsistency");
    expect(wire).toContain("inventorycontentconsistency");
    expect(wire).not.toContain("wsl_distro_name");
    expect(wire).not.toContain("posix_user_token");
    expect(wire).not.toContain("/home/");
  });

  it("keeps packaging safety gate as redacted non-execution readiness", () => {
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
      projectRoot,
      zoneRoot,
      dateUtc: "2099-12-15",
      pilotLoop: null,
      assumePackagedResolutionTest: true,
      wsl2LocalValueValidationReport:
        attachHermesWsl2WrapperSlotInventoryRefreshHold(
          base,
          buildHermesWsl2WrapperSlotInventoryRefreshSummary({
            distroDiscoveryStatus: "refreshed",
            distroCount: 3,
            selectableSlots: ["slot-01", "slot-02", "slot-03"],
            selectedSlot: "slot-02",
            selectedSlotStatus: "matched",
            previousSelectedSlot: "slot-01",
            previousSelectedSlotStatus: "mismatch",
            previousFailureReason: "distro_name_mismatch",
            exactMatchReadiness: "ready",
            exactMatchResult: "single_match",
            matchedSlotId: "slot-02",
            matchCount: 1,
            packagingGateStatus: "resolved_without_execution",
            packagingRiskLevel: "low",
            packagingBlockers: [],
            nextRequiredHumanAction:
              "review_non_execution_readiness_before_go_policy",
          }),
        ),
    });

    const summary =
      snap.wsl2LocalValueValidationSummary.slotInventoryRefreshSummary;
    expect(snap.wsl2LocalValueValidationSummary.decision).toBe("hold");
    expect(snap.wsl2LocalValueValidationSummary.canRunWsl).toBe(false);
    expect(snap.wsl2LocalValueValidationSummary.canRunHermes).toBe(false);
    expect(snap.wsl2LocalValueValidationSummary.canRunOnce).toBe(false);
    expect(snap.wsl2LocalValueValidationSummary.productionReady).toBe(false);
    expect(snap.productionReady).toBe(false);
    expect(snap.pendingPackagingResolution).toBe(true);
    expect(summary?.selectedSlot).toBe("slot-02");
    expect(summary?.selectedSlotStatus).toBe("matched");
    expect(summary?.packagingGateStatus).toBe("resolved_without_execution");
    expect(summary?.packagingRiskLevel).toBe("low");
    expect(summary?.packagingBlockers).toEqual([]);
    expect(summary?.canRunWrapper).toBe(false);
    expect(summary?.nextRequiredHumanAction).toBe(
      "review_non_execution_readiness_before_go_policy",
    );
    const wire = JSON.stringify(snap).toLowerCase();
    expect(wire).toContain("packaginggatestatus");
    expect(wire).toContain("resolved_without_execution");
    expect(wire).not.toContain("wsl_distro_name");
    expect(wire).not.toContain("posix_user_token");
    expect(wire).not.toContain("/home/");
    expect(wire).not.toMatch(/"allowedapis"\s*:\s*\[/);
    expect(wire).not.toMatch(/"forbiddenapis"\s*:\s*\[/);
  });
});
