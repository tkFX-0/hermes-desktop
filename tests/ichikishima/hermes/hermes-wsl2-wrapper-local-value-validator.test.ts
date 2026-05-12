import { describe, expect, it } from "vitest";

import {
  attachHermesWsl2WrapperSlotInventoryRefreshHold,
  buildHermesWsl2WrapperDistroNameMismatchRefreshSummary,
  buildHermesWsl2WrapperGoReadyForHumanReviewSummary,
  buildHermesWsl2WrapperSlotInventoryRefreshSummary,
  createHermesWsl2WrapperRedactedValidationReport,
  evaluateHermesWsl2WrapperLocalValueReadiness,
  hardenHermesWsl2WrapperSelectedDistroAvailabilityHold,
  summarizeHermesWsl2WrapperLocalValueValidationForSignoff,
  validateHermesWsl2WrapperLocalValueFileObject,
} from "../../../src/main/ichikishima/hermes/hermes-wsl2-wrapper-local-value-validator";
import {
  EXPECTED_ALLOWED_EXECUTABLE_ID,
  EXPECTED_BRIDGE_PAYLOAD_SCHEMA_VERSION,
  expectedWrapperPathForUnixUser,
} from "../../../src/main/ichikishima/hermes/hermes-wsl2-wrapper-parameter-registry";

const completeLocalValueObject = () =>
  ({
    distroName: "UbuntuPreview",
    unixUser: "hermes_lab",
    wrapperPath: expectedWrapperPathForUnixUser("hermes_lab"),
    windowsWslExePath: "C:\\Windows\\System32\\wsl.exe",
    allowedExecutableId: EXPECTED_ALLOWED_EXECUTABLE_ID,
    timeoutMs: 120_000,
    maxStdoutBytes: 65_536,
    maxStderrBytes: 8192,
    expectedPayloadSchemaVersion: EXPECTED_BRIDGE_PAYLOAD_SCHEMA_VERSION,
    logLevel: "minimal",
    signoffSource: "local_signoff_ref",
    signoffAtUnixMs: 1_700_000_000_000,
    operatorLabel: "local_operator",
  }) as const;

describe("hermes-wsl2-wrapper-local-value-validator", () => {
  it("holds placeholder values instead of treating them as GO", () => {
    const report = validateHermesWsl2WrapperLocalValueFileObject({
      distroName: "<WSL_DISTRO_NAME>",
      unixUser: "<POSIX_USER_TOKEN>",
      wrapperPath:
        "/home/<POSIX_USER_TOKEN>/.hermes-bridge/hermes-bridge-payload-once.sh",
      windowsWslExePath: "C:\\Windows\\System32\\wsl.exe",
      allowedExecutableId: EXPECTED_ALLOWED_EXECUTABLE_ID,
      timeoutMs: 120_000,
      maxStdoutBytes: 65_536,
      maxStderrBytes: 8192,
      expectedPayloadSchemaVersion: EXPECTED_BRIDGE_PAYLOAD_SCHEMA_VERSION,
      logLevel: "minimal",
      signoffSource: "<SIGNOFF_REF>",
      signoffAtUnixMs: null,
      operatorLabel: "<OPERATOR_ROLE_LABEL>",
    });

    expect(report.decision).toBe("hold");
    expect(report.validationStatus).toBe("placeholder_or_not_confirmed");
    expect(report.placeholderFieldCount).toBeGreaterThan(0);
    expect(report.canRunWsl).toBe(false);
    expect(report.canRunHermes).toBe(false);
    expect(report.canRunOnce).toBe(false);
    expect(report.productionReady).toBe(false);
  });

  it("returns GO only for fully validated values while still forbidding execution", () => {
    const report = createHermesWsl2WrapperRedactedValidationReport(
      completeLocalValueObject(),
    );

    expect(report.decision).toBe("go");
    expect(report.validationStatus).toBe("packet_complete_execution_forbidden");
    expect(report.system32ExactMatchConfirmed).toBe(true);
    expect(report.wrapperPathPolicyPassed).toBe(true);
    expect(report.canRunWsl).toBe(false);
    expect(report.canRunOnce).toBe(false);
  });

  it("rejects Sysnative in V1", () => {
    const report = evaluateHermesWsl2WrapperLocalValueReadiness({
      ...completeLocalValueObject(),
      windowsWslExePath: "C:\\Windows\\Sysnative\\wsl.exe",
    });

    expect(report.decision).toBe("reject");
    expect(report.sysnativeRejectedV1).toBe(true);
    expect(report.rejectedFieldCount).toBeGreaterThan(0);
  });

  it("rejects non-System32 WSL executable candidates", () => {
    const report = evaluateHermesWsl2WrapperLocalValueReadiness({
      ...completeLocalValueObject(),
      windowsWslExePath: "wsl",
    });

    expect(report.decision).toBe("reject");
    expect(report.system32ExactMatchConfirmed).toBe(false);
  });

  it("rejects wrapper paths outside the strict policy", () => {
    const report = evaluateHermesWsl2WrapperLocalValueReadiness({
      ...completeLocalValueObject(),
      wrapperPath: "/tmp/hermes-bridge-payload-once.sh",
    });

    expect(report.decision).toBe("reject");
    expect(report.wrapperPathPolicyPassed).toBe(false);
  });

  it("redacted lines omit raw local values", () => {
    const raw = completeLocalValueObject();
    const report = evaluateHermesWsl2WrapperLocalValueReadiness(raw);
    const blob = report.redactedSummaryLines.join("\n").toLowerCase();

    expect(blob).not.toContain(raw.distroName.toLowerCase());
    expect(blob).not.toContain(raw.unixUser.toLowerCase());
    expect(blob).not.toContain("/home/hermes_lab");
    expect(blob).not.toContain("local_operator");
    expect(blob).not.toContain("local_signoff_ref");
  });

  it("signoff summary is redacted-only", () => {
    const lines = summarizeHermesWsl2WrapperLocalValueValidationForSignoff(
      completeLocalValueObject(),
    );

    expect(lines.some((x) => x.startsWith("decision:"))).toBe(true);
    expect(lines.join("\n")).not.toContain("/home/hermes_lab");
  });

  it("rejects unknown top-level keys without echoing values", () => {
    const report = validateHermesWsl2WrapperLocalValueFileObject({
      ...completeLocalValueObject(),
      unexpected: "do_not_echo",
    });

    expect(report.decision).toBe("reject");
    expect(report.redactedSummaryLines.join("\n")).not.toContain("do_not_echo");
  });

  it("hardens selected distro availability failure as HOLD without raw values", () => {
    const base = evaluateHermesWsl2WrapperLocalValueReadiness({
      ...completeLocalValueObject(),
      distroName: "<WSL_DISTRO_NAME>",
      unixUser: "<POSIX_USER_TOKEN>",
      wrapperPath:
        "/home/<POSIX_USER_TOKEN>/.hermes-bridge/hermes-bridge-payload-once.sh",
    });
    const report = hardenHermesWsl2WrapperSelectedDistroAvailabilityHold(base, {
      selectedSlot: "slot-02",
      failureCategory: "whoami_failed_and_user_env_failed",
    });

    expect(report.decision).toBe("hold");
    expect(report.validationStatus).toBe("selected_distro_availability_hold");
    expect(report.nextRequiredAction).toBe(
      "verify_selected_slot_availability_locally",
    );
    expect(report.selectedDistroAvailabilitySummary).toEqual({
      selectedSlot: "slot-02",
      availability: "failed",
      slotResolution: "resolved_locally",
      inventoryCountComparison: "count_matched_content_unverified",
      unixUserDiscovery: "failed",
      alternateUnixUserDiscovery: "failed",
      failureCategory: "whoami_failed_and_user_env_failed",
      localJsonUpdatedForDistroUserWrapper: false,
      nextRequiredHumanAction: "verify_selected_slot_availability_locally",
      rawValuesReported: false,
    });
    const blob = report.redactedSummaryLines.join("\n").toLowerCase();
    expect(blob).toContain("selected_slot:slot-02");
    expect(blob).toContain("availability:failed");
    expect(blob).toContain(
      "failure_category:whoami_failed_and_user_env_failed",
    );
    expect(blob).not.toContain("ubuntupreview");
    expect(blob).not.toContain("hermes_lab");
    expect(blob).not.toContain("/home/hermes_lab");
    expect(report.canRunWsl).toBe(false);
    expect(report.canRunHermes).toBe(false);
    expect(report.canRunOnce).toBe(false);
  });

  it("hardens unavailable selected slot as choose-another-slot HOLD", () => {
    const base = evaluateHermesWsl2WrapperLocalValueReadiness({
      ...completeLocalValueObject(),
      distroName: "<WSL_DISTRO_NAME>",
      unixUser: "<POSIX_USER_TOKEN>",
      wrapperPath:
        "/home/<POSIX_USER_TOKEN>/.hermes-bridge/hermes-bridge-payload-once.sh",
    });
    const report = hardenHermesWsl2WrapperSelectedDistroAvailabilityHold(base, {
      selectedSlot: "slot-02",
      failureCategory: "distro_not_in_current_wsl_list",
      nextRequiredHumanAction: "choose_another_slot",
    });

    expect(report.decision).toBe("hold");
    expect(report.nextRequiredAction).toBe("choose_another_slot");
    expect(report.selectedDistroAvailabilitySummary).toMatchObject({
      selectedSlot: "slot-02",
      availability: "failed",
      failureCategory: "distro_not_in_current_wsl_list",
      nextRequiredHumanAction: "choose_another_slot",
      rawValuesReported: false,
    });
    const blob = report.redactedSummaryLines.join("\n").toLowerCase();
    expect(blob).toContain("failure_category:distro_not_in_current_wsl_list");
    expect(blob).toContain("next_required_human_action:choose_another_slot");
    expect(blob).not.toContain("ubuntupreview");
    expect(blob).not.toContain("hermes_lab");
    expect(blob).not.toContain("/home/hermes_lab");
  });

  it("attaches refreshed slot inventory as slot IDs only", () => {
    const base = evaluateHermesWsl2WrapperLocalValueReadiness({
      ...completeLocalValueObject(),
      distroName: "<WSL_DISTRO_NAME>",
      unixUser: "<POSIX_USER_TOKEN>",
      wrapperPath:
        "/home/<POSIX_USER_TOKEN>/.hermes-bridge/hermes-bridge-payload-once.sh",
    });
    const summary = buildHermesWsl2WrapperSlotInventoryRefreshSummary({
      distroDiscoveryStatus: "refreshed",
      distroCount: 3,
      selectableSlots: ["slot-01", "slot-02", "slot-03"],
      previousSelectedSlot: "slot-02",
      previousFailureReason: "distro_not_in_current_wsl_list",
    });
    const report = attachHermesWsl2WrapperSlotInventoryRefreshHold(
      base,
      summary,
    );

    expect(report.decision).toBe("hold");
    expect(report.nextRequiredAction).toBe("select_slot_id");
    expect(report.slotInventoryRefreshSummary).toEqual(
      expect.objectContaining({
        distroDiscoveryStatus: "refreshed",
        distroCount: 3,
        selectableSlots: ["slot-01", "slot-02", "slot-03"],
        selectedSlot: "none",
        previousSelectedSlot: "slot-02",
        previousFailureReason: "distro_not_in_current_wsl_list",
        decision: "HOLD",
        nextRequiredHumanAction: "select_slot_id",
        rawValuesReported: false,
        execution: "disabled",
        canRunWrapper: false,
      }),
    );
    const blob = report.redactedSummaryLines.join("\n").toLowerCase();
    expect(blob).toContain("selectable_slots:slot-01,slot-02,slot-03");
    expect(blob).toContain(
      "previous_failure_reason:distro_not_in_current_wsl_list",
    );
    expect(blob).not.toContain("ubuntupreview");
    expect(blob).not.toContain("hermes_lab");
    expect(blob).not.toContain("/home/hermes_lab");
  });

  it("records selected refreshed slot as HOLD without resolving raw distro", () => {
    const base = evaluateHermesWsl2WrapperLocalValueReadiness({
      ...completeLocalValueObject(),
      distroName: "<WSL_DISTRO_NAME>",
      unixUser: "<POSIX_USER_TOKEN>",
      wrapperPath:
        "/home/<POSIX_USER_TOKEN>/.hermes-bridge/hermes-bridge-payload-once.sh",
    });
    const summary = buildHermesWsl2WrapperSlotInventoryRefreshSummary({
      distroDiscoveryStatus: "refreshed",
      distroCount: 3,
      selectableSlots: ["slot-01", "slot-02", "slot-03"],
      selectedSlot: "slot-01",
      previousSelectedSlot: "slot-02",
      previousFailureReason: "distro_not_in_current_wsl_list",
    });
    const report = attachHermesWsl2WrapperSlotInventoryRefreshHold(
      base,
      summary,
    );

    expect(report.decision).toBe("hold");
    expect(report.nextRequiredAction).toBe(
      "verify_selected_slot_availability_locally",
    );
    expect(report.slotInventoryRefreshSummary?.selectedSlot).toBe("slot-01");
    expect(report.slotInventoryRefreshSummary?.previousSelectedSlot).toBe(
      "slot-02",
    );
    expect(report.slotInventoryRefreshSummary?.rawValuesReported).toBe(false);
    const blob = report.redactedSummaryLines.join("\n").toLowerCase();
    expect(blob).toContain("selected_slot:slot-01");
    expect(blob).toContain(
      "next_required_human_action:verify_selected_slot_availability_locally",
    );
    expect(blob).not.toContain("ubuntupreview");
    expect(blob).not.toContain("hermes_lab");
    expect(blob).not.toContain("/home/hermes_lab");
  });

  it("records selected slot failure with inventory consistency enum only", () => {
    const base = evaluateHermesWsl2WrapperLocalValueReadiness({
      ...completeLocalValueObject(),
      distroName: "<WSL_DISTRO_NAME>",
      unixUser: "<POSIX_USER_TOKEN>",
      wrapperPath:
        "/home/<POSIX_USER_TOKEN>/.hermes-bridge/hermes-bridge-payload-once.sh",
    });
    const summary = buildHermesWsl2WrapperSlotInventoryRefreshSummary({
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
    });
    const report = attachHermesWsl2WrapperSlotInventoryRefreshHold(
      base,
      summary,
    );

    expect(report.decision).toBe("hold");
    expect(report.nextRequiredAction).toBe("choose_matched_slot_id");
    expect(report.slotInventoryRefreshSummary).toMatchObject({
      selectedSlot: "slot-01",
      selectedAvailability: "failed",
      selectedFailureReason: "distro_not_in_current_wsl_list",
      previousSelectedSlot: "slot-02",
      inventoryCountConsistency: "matched",
      inventoryContentConsistency: "partial",
      slotMapCount: 3,
      currentInventoryCount: 3,
      rawValuesReported: false,
      execution: "disabled",
    });
    const blob = report.redactedSummaryLines.join("\n").toLowerCase();
    expect(blob).toContain(
      "selected_failure_reason:distro_not_in_current_wsl_list",
    );
    expect(summary.inventoryConsistency).toBeUndefined();
    expect(blob).not.toContain("inventory_consistency:matched");
    expect(blob).toContain("inventory_count_consistency:matched");
    expect(blob).toContain("inventory_content_consistency:partial");
    expect(blob).toContain(
      "slot_statuses:slot-01:mismatch,slot-02:matched,slot-03:matched",
    );
    expect(blob).not.toContain("ubuntupreview");
    expect(blob).not.toContain("hermes_lab");
    expect(blob).not.toContain("/home/hermes_lab");
  });

  it("records distro name mismatch as slot-selection-unresolved HOLD without raw values", () => {
    const base = evaluateHermesWsl2WrapperLocalValueReadiness({
      ...completeLocalValueObject(),
      distroName: "<WSL_DISTRO_NAME>",
      unixUser: "<POSIX_USER_TOKEN>",
      wrapperPath:
        "/home/<POSIX_USER_TOKEN>/.hermes-bridge/hermes-bridge-payload-once.sh",
    });
    const summary = buildHermesWsl2WrapperDistroNameMismatchRefreshSummary({
      previousSelectedSlot: "slot-01",
    });

    expect(summary.previousSelectedSlot).toBe("slot-01");
    expect(summary.previousFailureReason).toBe("distro_name_mismatch");
    expect(summary.selectedSlot).toBe("none");
    expect(summary.inventoryContentConsistency).toBe("mismatched");
    expect(summary.nextRequiredHumanAction).toBe(
      "resolve_slot_map_distro_mismatch",
    );
    expect(summary.decision).toBe("HOLD");
    expect(summary.rawValuesReported).toBe(false);
    expect(summary.execution).toBe("disabled");

    const report = attachHermesWsl2WrapperSlotInventoryRefreshHold(
      base,
      summary,
    );

    expect(report.decision).toBe("hold");
    expect(report.nextRequiredAction).toBe("resolve_slot_map_distro_mismatch");
    expect(report.canRunWsl).toBe(false);
    expect(report.canRunHermes).toBe(false);
    expect(report.canRunOnce).toBe(false);
    expect(report.productionReady).toBe(false);

    const blob = report.redactedSummaryLines.join("\n").toLowerCase();
    expect(blob).toContain("previous_selected_slot:slot-01");
    expect(blob).toContain("previous_failure_reason:distro_name_mismatch");
    expect(blob).toContain(
      "next_required_human_action:resolve_slot_map_distro_mismatch",
    );
    expect(blob).toContain("inventory_content_consistency:mismatched");
    expect(blob).not.toContain("ubuntupreview");
    expect(blob).not.toContain("hermes_lab");
    expect(blob).not.toContain("/home/hermes_lab");
  });

  it("GO policy ready_for_human_go_review keeps HOLD without enabling execution", () => {
    const summary = buildHermesWsl2WrapperGoReadyForHumanReviewSummary({
      distroCount: 3,
      selectableSlots: ["slot-01", "slot-02", "slot-03"],
      previousSelectedSlot: "slot-01",
    });

    expect(summary.goPolicyReviewStatus).toBe("ready_for_human_go_review");
    expect(summary.goPolicyRiskLevel).toBe("high");
    expect(summary.goPolicyBlockers).toContain("execution_still_disabled");
    expect(summary.goPolicyBlockers).toContain("human_go_review_required");
    expect(summary.goPolicyBlockers).toContain("production_ready_gate_not_met");
    expect(summary.humanGoApprovalRequired).toBe(true);
    expect(summary.executionStillDisabled).toBe(true);
    expect(summary.nextRequiredHumanAction).toBe(
      "human_review_go_policy_prerequisites",
    );
    expect(summary.decision).toBe("HOLD");
    expect(summary.execution).toBe("disabled");
    expect(summary.rawValuesReported).toBe(false);
    expect(summary.canRunWrapper).toBe(false);

    const base = createHermesWsl2WrapperRedactedValidationReport(null, {
      localValueFileExists: false,
    });
    const report = attachHermesWsl2WrapperSlotInventoryRefreshHold(
      base,
      summary,
    );

    expect(report.decision).toBe("hold");
    expect(report.canRunWsl).toBe(false);
    expect(report.canRunHermes).toBe(false);
    expect(report.canRunOnce).toBe(false);
    expect(report.productionReady).toBe(false);
    expect(report.nextRequiredAction).toBe("human_review_go_policy_prerequisites");

    const blob = report.redactedSummaryLines.join("\n");
    expect(blob).toContain("go_policy_review_status:ready_for_human_go_review");
    expect(blob).toContain("go_policy_risk_level:high");
    expect(blob).toContain("human_go_approval_required:true");
    expect(blob).toContain("execution_still_disabled:true");
    expect(blob).toContain(
      "next_required_human_action:human_review_go_policy_prerequisites",
    );
    expect(blob).not.toContain("ubuntupreview");
    expect(blob).not.toContain("hermes_lab");
  });
});
