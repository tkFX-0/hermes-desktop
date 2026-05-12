import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { tmpdir } from "node:os";

import { describe, expect, it } from "vitest";

import {
  readHermesWsl2DistroSelectionLocalFileForRefreshSummary,
  readHermesWsl2WrapperLocalValueFileWithSlotInventoryForValidation,
  resolveHermesWsl2DistroSelectionLocalFilePath,
  readHermesWsl2WrapperLocalValueFileForValidation,
  resolveHermesWsl2WrapperLocalValueFilePath,
  summarizeHermesWsl2WrapperLocalValueFilePresence,
  validateHermesWsl2WrapperLocalValueFilePath,
} from "../../../src/main/ichikishima/hermes/hermes-wsl2-wrapper-local-value-file";

function makeTempProjectRoot(label: string): string {
  return path.join(
    tmpdir(),
    `hermes-wsl2-local-value-file-${label}-${Date.now()}-${Math.random()
      .toString(16)
      .slice(2)}`,
  );
}

describe("hermes-wsl2-wrapper-local-value-file", () => {
  it("resolves only the fixed local-only JSON path", () => {
    const root = makeTempProjectRoot("path");
    const expected = resolveHermesWsl2WrapperLocalValueFilePath(root);
    expect(validateHermesWsl2WrapperLocalValueFilePath(root, expected).ok).toBe(
      true,
    );
    expect(
      validateHermesWsl2WrapperLocalValueFilePath(root, path.join(root, ".env"))
        .ok,
    ).toBe(false);
  });

  it("reports missing local file as HOLD without arbitrary reads", () => {
    const root = makeTempProjectRoot("missing");
    const report = readHermesWsl2WrapperLocalValueFileForValidation({
      projectRoot: root,
    });
    const presence = summarizeHermesWsl2WrapperLocalValueFilePresence(root);

    expect(presence.localValueFileExists).toBe(false);
    expect(presence.canReadArbitraryFile).toBe(false);
    expect(report.decision).toBe("hold");
    expect(report.validationStatus).toBe("file_missing");
    expect(report.localValueFileExists).toBe(false);
  });

  it("reads the fixed file and returns redacted HOLD for placeholders", () => {
    const root = makeTempProjectRoot("placeholder");
    const file = resolveHermesWsl2WrapperLocalValueFilePath(root);
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(
      file,
      JSON.stringify({
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
      }),
      "utf8",
    );

    const report = readHermesWsl2WrapperLocalValueFileForValidation({
      projectRoot: root,
    });

    expect(report.decision).toBe("hold");
    expect(report.placeholderFieldCount).toBeGreaterThan(0);
    expect(report.redactedSummaryLines.join("\n")).not.toContain(
      "WSL_DISTRO_NAME",
    );
  });

  it("reads the repo local-only file if present and returns only redacted status", () => {
    const projectRoot = path.resolve(__dirname, "../../..");
    const report = readHermesWsl2WrapperLocalValueFileForValidation({
      projectRoot,
    });
    const blob = report.redactedSummaryLines.join("\n");

    expect(["go", "hold", "reject"]).toContain(report.decision);
    expect(report.canRunWsl).toBe(false);
    expect(report.canRunHermes).toBe(false);
    expect(report.canRunOnce).toBe(false);
    expect(blob).not.toMatch(/[A-Za-z]:\\Users\\/i);
    expect(blob).not.toMatch(/\/home\/[a-z0-9_-]+\/\.hermes-bridge/i);
  });

  it("reads refreshed distro slot map as slot IDs only", () => {
    const root = makeTempProjectRoot("slot-map");
    const localValueFile = resolveHermesWsl2WrapperLocalValueFilePath(root);
    const slotMapFile = resolveHermesWsl2DistroSelectionLocalFilePath(root);
    mkdirSync(path.dirname(localValueFile), { recursive: true });
    writeFileSync(
      localValueFile,
      JSON.stringify({
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
      }),
      "utf8",
    );
    writeFileSync(
      slotMapFile,
      JSON.stringify({
        distroDiscoveryStatus: "refreshed",
        distroCount: 2,
        selectableSlots: ["slot-01", "slot-02"],
        selectedSlot: null,
        previousSelectedSlot: "slot-02",
        previousFailureReason: "distro_not_in_current_wsl_list",
        rawDistroEntries: [
          { slotId: "slot-01", distroName: "DoNotEchoA" },
          { slotId: "slot-02", distroName: "DoNotEchoB" },
        ],
      }),
      "utf8",
    );

    const summary = readHermesWsl2DistroSelectionLocalFileForRefreshSummary({
      projectRoot: root,
    });
    const report =
      readHermesWsl2WrapperLocalValueFileWithSlotInventoryForValidation({
        projectRoot: root,
      });
    const blob = report.redactedSummaryLines.join("\n");

    expect(summary?.selectableSlots).toEqual(["slot-01", "slot-02"]);
    expect(summary?.distroCount).toBe(2);
    expect(report.slotInventoryRefreshSummary?.selectedSlot).toBe("none");
    expect(report.nextRequiredAction).toBe("select_slot_id");
    expect(blob).toContain("selectable_slots:slot-01,slot-02");
    expect(blob).not.toContain("DoNotEchoA");
    expect(blob).not.toContain("DoNotEchoB");
  });

  it("reads selected refreshed slot without exposing raw distro names", () => {
    const root = makeTempProjectRoot("slot-selected");
    const localValueFile = resolveHermesWsl2WrapperLocalValueFilePath(root);
    const slotMapFile = resolveHermesWsl2DistroSelectionLocalFilePath(root);
    mkdirSync(path.dirname(localValueFile), { recursive: true });
    writeFileSync(
      localValueFile,
      JSON.stringify({
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
      }),
      "utf8",
    );
    writeFileSync(
      slotMapFile,
      JSON.stringify({
        distroDiscoveryStatus: "refreshed",
        distroCount: 2,
        selectableSlots: ["slot-01", "slot-02"],
        selectedSlot: "slot-01",
        previousSelectedSlot: "slot-02",
        previousFailureReason: "distro_not_in_current_wsl_list",
        nextRequiredHumanAction: "verify_selected_slot_availability_locally",
        rawDistroEntries: [
          { slotId: "slot-01", distroName: "DoNotEchoA" },
          { slotId: "slot-02", distroName: "DoNotEchoB" },
        ],
      }),
      "utf8",
    );

    const report =
      readHermesWsl2WrapperLocalValueFileWithSlotInventoryForValidation({
        projectRoot: root,
      });
    const blob = report.redactedSummaryLines.join("\n");

    expect(report.slotInventoryRefreshSummary?.selectedSlot).toBe("slot-01");
    expect(report.nextRequiredAction).toBe(
      "verify_selected_slot_availability_locally",
    );
    expect(blob).toContain("selected_slot:slot-01");
    expect(blob).not.toContain("DoNotEchoA");
    expect(blob).not.toContain("DoNotEchoB");
  });

  it("reads selected slot failure and inventory consistency without raw distro names", () => {
    const root = makeTempProjectRoot("slot-failed-consistency");
    const localValueFile = resolveHermesWsl2WrapperLocalValueFilePath(root);
    const slotMapFile = resolveHermesWsl2DistroSelectionLocalFilePath(root);
    mkdirSync(path.dirname(localValueFile), { recursive: true });
    writeFileSync(
      localValueFile,
      JSON.stringify({
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
      }),
      "utf8",
    );
    writeFileSync(
      slotMapFile,
      JSON.stringify({
        distroDiscoveryStatus: "refreshed",
        distroCount: 2,
        selectableSlots: ["slot-01", "slot-02"],
        selectedSlot: "slot-01",
        selectedAvailability: "failed",
        selectedFailureReason: "distro_not_in_current_wsl_list",
        previousSelectedSlot: "slot-02",
        previousFailureReason: "distro_not_in_current_wsl_list",
        inventoryConsistency: "matched",
        inventoryCountConsistency: "matched",
        inventoryContentConsistency: "partial",
        slotStatuses: [
          { slotId: "slot-01", status: "mismatch" },
          { slotId: "slot-02", status: "matched" },
        ],
        slotMapCount: 2,
        currentInventoryCount: 2,
        nextRequiredHumanAction: "choose_matched_slot_id",
        rawDistroEntries: [
          { slotId: "slot-01", distroName: "DoNotEchoA" },
          { slotId: "slot-02", distroName: "DoNotEchoB" },
        ],
      }),
      "utf8",
    );

    const report =
      readHermesWsl2WrapperLocalValueFileWithSlotInventoryForValidation({
        projectRoot: root,
      });
    const summary = report.slotInventoryRefreshSummary;
    const blob = report.redactedSummaryLines.join("\n");

    expect(summary?.selectedSlot).toBe("slot-01");
    expect(summary?.selectedAvailability).toBe("failed");
    expect(summary?.selectedFailureReason).toBe(
      "distro_not_in_current_wsl_list",
    );
    expect(summary?.inventoryConsistency).toBeUndefined();
    expect(summary?.inventoryCountConsistency).toBe("matched");
    expect(summary?.inventoryContentConsistency).toBe("partial");
    expect(summary?.slotStatuses).toEqual([
      { slotId: "slot-01", status: "mismatch" },
      { slotId: "slot-02", status: "matched" },
    ]);
    expect(report.nextRequiredAction).toBe("choose_matched_slot_id");
    expect(blob).not.toContain("inventory_consistency:matched");
    expect(blob).not.toContain("DoNotEchoA");
    expect(blob).not.toContain("DoNotEchoB");
  });

  it("reads distro_name_mismatch previousFailureReason and resolve_slot_map_distro_mismatch nextRequiredHumanAction without echoing raw entries", () => {
    const root = makeTempProjectRoot("distro-name-mismatch");
    const localValueFile = resolveHermesWsl2WrapperLocalValueFilePath(root);
    const slotMapFile = resolveHermesWsl2DistroSelectionLocalFilePath(root);
    mkdirSync(path.dirname(localValueFile), { recursive: true });
    writeFileSync(
      localValueFile,
      JSON.stringify({
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
      }),
      "utf8",
    );
    writeFileSync(
      slotMapFile,
      JSON.stringify({
        distroDiscoveryStatus: "refreshed",
        distroCount: 0,
        selectableSlots: [],
        selectedSlot: "none",
        previousSelectedSlot: "slot-01",
        previousFailureReason: "distro_name_mismatch",
        inventoryContentConsistency: "mismatched",
        nextRequiredHumanAction: "resolve_slot_map_distro_mismatch",
        rawValuesReported: false,
        execution: "disabled",
        rawDistroEntries: [
          { slotId: "slot-01", distroName: "DoNotEchoMismatch" },
        ],
      }),
      "utf8",
    );

    const summary = readHermesWsl2DistroSelectionLocalFileForRefreshSummary({
      projectRoot: root,
    });

    expect(summary).not.toBeNull();
    expect(summary?.previousSelectedSlot).toBe("slot-01");
    expect(summary?.previousFailureReason).toBe("distro_name_mismatch");
    expect(summary?.selectedSlot).toBe("none");
    expect(summary?.inventoryContentConsistency).toBe("mismatched");
    expect(summary?.nextRequiredHumanAction).toBe(
      "resolve_slot_map_distro_mismatch",
    );
    expect(summary?.decision).toBe("HOLD");
    expect(summary?.rawValuesReported).toBe(false);
    expect(summary?.execution).toBe("disabled");

    const report =
      readHermesWsl2WrapperLocalValueFileWithSlotInventoryForValidation({
        projectRoot: root,
      });
    const blob = report.redactedSummaryLines.join("\n");
    expect(blob).not.toContain("DoNotEchoMismatch");
    expect(blob).toContain("previous_failure_reason:distro_name_mismatch");
    expect(blob).toContain(
      "next_required_human_action:resolve_slot_map_distro_mismatch",
    );
  });

  it("reads local-only repair HOLD with unresolved selected slot and UTF-8 BOM stripped", () => {
    const root = makeTempProjectRoot("slot-map-repair-hold");
    const localValueFile = resolveHermesWsl2WrapperLocalValueFilePath(root);
    const slotMapFile = resolveHermesWsl2DistroSelectionLocalFilePath(root);
    mkdirSync(path.dirname(localValueFile), { recursive: true });
    writeFileSync(
      localValueFile,
      `\uFEFF${JSON.stringify({
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
      })}`,
      "utf8",
    );
    writeFileSync(
      slotMapFile,
      `\uFEFF${JSON.stringify({
        distroDiscoveryStatus: "refreshed",
        distroCount: 3,
        selectableSlots: ["slot-01", "slot-02", "slot-03"],
        selectedSlot: "unresolved",
        previousSelectedSlot: "slot-01",
        previousFailureReason: "distro_name_mismatch",
        inventoryContentConsistency: "mismatched",
        nextRequiredHumanAction: "update_local_only_slot_map_or_hold",
        rawValuesReported: false,
        execution: "disabled",
        rawDistroEntries: [
          { slotId: "slot-01", distroName: "DoNotEchoA" },
          { slotId: "slot-02", distroName: "" },
          { slotId: "slot-03", distroName: null },
        ],
      })}`,
      "utf8",
    );

    const report =
      readHermesWsl2WrapperLocalValueFileWithSlotInventoryForValidation({
        projectRoot: root,
      });
    const summary = report.slotInventoryRefreshSummary;
    const blob = report.redactedSummaryLines.join("\n");

    expect(summary?.selectedSlot).toBe("unresolved");
    expect(summary?.previousSelectedSlot).toBe("slot-01");
    expect(summary?.previousFailureReason).toBe("distro_name_mismatch");
    expect(summary?.inventoryContentConsistency).toBe("mismatched");
    expect(summary?.nextRequiredHumanAction).toBe(
      "update_local_only_slot_map_or_hold",
    );
    expect(summary?.decision).toBe("HOLD");
    expect(summary?.rawValuesReported).toBe(false);
    expect(summary?.execution).toBe("disabled");
    expect(report.nextRequiredAction).toBe(
      "update_local_only_slot_map_or_hold",
    );
    expect(blob).toContain("selected_slot:unresolved");
    expect(blob).toContain("previous_selected_slot:slot-01");
    expect(blob).toContain("previous_failure_reason:distro_name_mismatch");
    expect(blob).toContain(
      "next_required_human_action:update_local_only_slot_map_or_hold",
    );
    expect(blob).not.toContain("DoNotEchoA");
    expect(blob).not.toContain("/home/");
  });

  it("reads human-confirmed matched slot as HOLD without enabling execution", () => {
    const root = makeTempProjectRoot("slot-confirmed-match");
    const localValueFile = resolveHermesWsl2WrapperLocalValueFilePath(root);
    const slotMapFile = resolveHermesWsl2DistroSelectionLocalFilePath(root);
    mkdirSync(path.dirname(localValueFile), { recursive: true });
    writeFileSync(
      localValueFile,
      JSON.stringify({
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
      }),
      "utf8",
    );
    writeFileSync(
      slotMapFile,
      JSON.stringify({
        distroDiscoveryStatus: "refreshed",
        distroCount: 3,
        selectableSlots: ["slot-01", "slot-02", "slot-03"],
        selectedSlot: "slot-02",
        selectedSlotStatus: "matched",
        previousSelectedSlot: "slot-01",
        previousSelectedSlotStatus: "mismatch",
        previousFailureReason: "distro_name_mismatch",
        inventoryContentConsistency: "partial",
        exactMatchReadiness: "ready",
        exactMatchResult: "single_match",
        matchedSlotId: "slot-02",
        matchCount: 1,
        nextRequiredHumanAction: "resolve_packaging_safety_gate",
        rawValuesReported: false,
        execution: "disabled",
        rawDistroEntries: [
          { slotId: "slot-02", distroName: "DoNotEchoConfirmed" },
        ],
      }),
      "utf8",
    );

    const report =
      readHermesWsl2WrapperLocalValueFileWithSlotInventoryForValidation({
        projectRoot: root,
      });
    const summary = report.slotInventoryRefreshSummary;
    const blob = report.redactedSummaryLines.join("\n");

    expect(summary?.selectedSlot).toBe("slot-02");
    expect(summary?.selectedSlotStatus).toBe("matched");
    expect(summary?.previousSelectedSlot).toBe("slot-01");
    expect(summary?.previousSelectedSlotStatus).toBe("mismatch");
    expect(summary?.exactMatchReadiness).toBe("ready");
    expect(summary?.exactMatchResult).toBe("single_match");
    expect(summary?.matchedSlotId).toBe("slot-02");
    expect(summary?.matchCount).toBe(1);
    expect(summary?.nextRequiredHumanAction).toBe(
      "resolve_packaging_safety_gate",
    );
    expect(summary?.decision).toBe("HOLD");
    expect(summary?.rawValuesReported).toBe(false);
    expect(summary?.execution).toBe("disabled");
    expect(report.nextRequiredAction).toBe("resolve_packaging_safety_gate");
    expect(report.canRunWsl).toBe(false);
    expect(report.canRunHermes).toBe(false);
    expect(report.canRunOnce).toBe(false);
    expect(report.productionReady).toBe(false);
    expect(blob).toContain("selected_slot:slot-02");
    expect(blob).toContain("selected_slot_status:matched");
    expect(blob).toContain("matched_slot_id:slot-02");
    expect(blob).toContain("match_count:1");
    expect(blob).toContain(
      "next_required_human_action:resolve_packaging_safety_gate",
    );
    expect(blob).not.toContain("DoNotEchoConfirmed");
    expect(blob).not.toContain("/home/");
  });

  it("reads GO policy review fields as enum-only HOLD without enabling execution", () => {
    const root = makeTempProjectRoot("go-policy");
    const localValueFile = resolveHermesWsl2WrapperLocalValueFilePath(root);
    const slotMapFile = resolveHermesWsl2DistroSelectionLocalFilePath(root);
    mkdirSync(path.dirname(localValueFile), { recursive: true });
    writeFileSync(
      localValueFile,
      JSON.stringify({
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
      }),
      "utf8",
    );
    writeFileSync(
      slotMapFile,
      JSON.stringify({
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
        goPolicyReviewStatus: "blocked",
        goPolicyRiskLevel: "high",
        goPolicyBlockers: [
          "execution_still_disabled",
          "human_go_review_required",
          "production_ready_gate_not_met",
        ],
        humanGoApprovalRequired: true,
        executionStillDisabled: true,
        nextRequiredHumanAction: "address_packaging_blockers",
        rawValuesReported: false,
        execution: "disabled",
        canRunWrapper: false,
        rawDistroEntries: [
          { slotId: "slot-02", distroName: "DoNotEchoGoPolicy" },
        ],
      }),
      "utf8",
    );

    const report =
      readHermesWsl2WrapperLocalValueFileWithSlotInventoryForValidation({
        projectRoot: root,
      });
    const summary = report.slotInventoryRefreshSummary;
    const blob = report.redactedSummaryLines.join("\n");

    expect(summary?.goPolicyReviewStatus).toBe("blocked");
    expect(summary?.goPolicyRiskLevel).toBe("high");
    expect(summary?.goPolicyBlockers).toEqual([
      "execution_still_disabled",
      "human_go_review_required",
      "production_ready_gate_not_met",
    ]);
    expect(summary?.humanGoApprovalRequired).toBe(true);
    expect(summary?.executionStillDisabled).toBe(true);
    expect(summary?.nextRequiredHumanAction).toBe("address_packaging_blockers");
    expect(summary?.decision).toBe("HOLD");
    expect(summary?.rawValuesReported).toBe(false);
    expect(summary?.execution).toBe("disabled");
    expect(summary?.canRunWrapper).toBe(false);
    expect(report.nextRequiredAction).toBe("address_packaging_blockers");
    expect(report.canRunWsl).toBe(false);
    expect(report.canRunHermes).toBe(false);
    expect(report.canRunOnce).toBe(false);
    expect(report.productionReady).toBe(false);
    expect(blob).toContain("go_policy_review_status:blocked");
    expect(blob).toContain("go_policy_risk_level:high");
    expect(blob).toContain("human_go_approval_required:true");
    expect(blob).toContain("execution_still_disabled:true");
    expect(blob).toContain("next_required_human_action:address_packaging_blockers");
    expect(blob).not.toContain("DoNotEchoGoPolicy");
    expect(blob).not.toContain("/home/");
  });

  it("reads GO policy ready_for_human_go_review from file as HOLD without enabling execution", () => {
    const root = makeTempProjectRoot("go-policy-ready");
    const localValueFile = resolveHermesWsl2WrapperLocalValueFilePath(root);
    const slotMapFile = resolveHermesWsl2DistroSelectionLocalFilePath(root);
    mkdirSync(path.dirname(localValueFile), { recursive: true });
    writeFileSync(
      localValueFile,
      JSON.stringify({
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
      }),
      "utf8",
    );
    writeFileSync(
      slotMapFile,
      JSON.stringify({
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
        goPolicyReviewStatus: "ready_for_human_go_review",
        goPolicyRiskLevel: "high",
        goPolicyBlockers: [
          "execution_still_disabled",
          "human_go_review_required",
          "production_ready_gate_not_met",
        ],
        humanGoApprovalRequired: true,
        executionStillDisabled: true,
        nextRequiredHumanAction: "human_review_go_policy_prerequisites",
        rawValuesReported: false,
        execution: "disabled",
        canRunWrapper: false,
        rawDistroEntries: [
          { slotId: "slot-02", distroName: "DoNotEchoGoReady" },
        ],
      }),
      "utf8",
    );

    const report =
      readHermesWsl2WrapperLocalValueFileWithSlotInventoryForValidation({
        projectRoot: root,
      });
    const summary = report.slotInventoryRefreshSummary;
    const blob = report.redactedSummaryLines.join("\n");

    expect(summary?.goPolicyReviewStatus).toBe("ready_for_human_go_review");
    expect(summary?.goPolicyRiskLevel).toBe("high");
    expect(summary?.goPolicyBlockers).toContain("execution_still_disabled");
    expect(summary?.goPolicyBlockers).toContain("human_go_review_required");
    expect(summary?.goPolicyBlockers).toContain("production_ready_gate_not_met");
    expect(summary?.humanGoApprovalRequired).toBe(true);
    expect(summary?.executionStillDisabled).toBe(true);
    expect(summary?.nextRequiredHumanAction).toBe(
      "human_review_go_policy_prerequisites",
    );
    expect(summary?.decision).toBe("HOLD");
    expect(summary?.rawValuesReported).toBe(false);
    expect(summary?.execution).toBe("disabled");
    expect(summary?.canRunWrapper).toBe(false);
    expect(report.nextRequiredAction).toBe("human_review_go_policy_prerequisites");
    expect(report.canRunWsl).toBe(false);
    expect(report.canRunHermes).toBe(false);
    expect(report.canRunOnce).toBe(false);
    expect(report.productionReady).toBe(false);
    expect(blob).toContain("go_policy_review_status:ready_for_human_go_review");
    expect(blob).toContain("go_policy_risk_level:high");
    expect(blob).toContain("human_go_approval_required:true");
    expect(blob).toContain("execution_still_disabled:true");
    expect(blob).toContain(
      "next_required_human_action:human_review_go_policy_prerequisites",
    );
    expect(blob).not.toContain("DoNotEchoGoReady");
    expect(blob).not.toContain("/home/");
  });

  it("reads packaging gate readiness as enum-only HOLD without enabling execution", () => {
    const root = makeTempProjectRoot("packaging-gate");
    const localValueFile = resolveHermesWsl2WrapperLocalValueFilePath(root);
    const slotMapFile = resolveHermesWsl2DistroSelectionLocalFilePath(root);
    mkdirSync(path.dirname(localValueFile), { recursive: true });
    writeFileSync(
      localValueFile,
      JSON.stringify({
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
      }),
      "utf8",
    );
    writeFileSync(
      slotMapFile,
      JSON.stringify({
        distroDiscoveryStatus: "refreshed",
        distroCount: 3,
        selectableSlots: ["slot-01", "slot-02", "slot-03"],
        selectedSlot: "slot-02",
        selectedSlotStatus: "matched",
        previousSelectedSlot: "slot-01",
        previousSelectedSlotStatus: "mismatch",
        previousFailureReason: "distro_name_mismatch",
        inventoryContentConsistency: "partial",
        exactMatchReadiness: "ready",
        exactMatchResult: "single_match",
        matchedSlotId: "slot-02",
        matchCount: 1,
        packagingGateStatus: "resolved_without_execution",
        packagingRiskLevel: "low",
        packagingBlockers: [],
        nextRequiredHumanAction:
          "review_non_execution_readiness_before_go_policy",
        rawValuesReported: false,
        execution: "disabled",
        canRunWrapper: false,
        rawDistroEntries: [
          { slotId: "slot-02", distroName: "DoNotEchoPackaging" },
        ],
      }),
      "utf8",
    );

    const report =
      readHermesWsl2WrapperLocalValueFileWithSlotInventoryForValidation({
        projectRoot: root,
      });
    const summary = report.slotInventoryRefreshSummary;
    const blob = JSON.stringify(report);

    expect(summary?.selectedSlot).toBe("slot-02");
    expect(summary?.selectedSlotStatus).toBe("matched");
    expect(summary?.packagingGateStatus).toBe("resolved_without_execution");
    expect(summary?.packagingRiskLevel).toBe("low");
    expect(summary?.packagingBlockers).toEqual([]);
    expect(summary?.nextRequiredHumanAction).toBe(
      "review_non_execution_readiness_before_go_policy",
    );
    expect(summary?.decision).toBe("HOLD");
    expect(summary?.rawValuesReported).toBe(false);
    expect(summary?.execution).toBe("disabled");
    expect(summary?.canRunWrapper).toBe(false);
    expect(report.nextRequiredAction).toBe(
      "review_non_execution_readiness_before_go_policy",
    );
    expect(report.canRunWsl).toBe(false);
    expect(report.canRunHermes).toBe(false);
    expect(report.canRunOnce).toBe(false);
    expect(report.productionReady).toBe(false);
    expect(blob).toContain("packaging_gate_status:resolved_without_execution");
    expect(blob).toContain("can_run_wrapper:false");
    expect(blob).not.toContain("DoNotEchoPackaging");
    expect(blob).not.toContain("/home/");
  });
});
