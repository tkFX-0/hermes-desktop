/**
 * Fixed local-only JSON reader for WSL2 wrapper value validation.
 *
 * The reader accepts only the repo-local, gitignored file path and returns a
 * redacted validation report. It never returns raw JSON or local values.
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import {
  attachHermesWsl2WrapperSlotInventoryRefreshHold,
  buildHermesWsl2WrapperSlotInventoryRefreshSummary,
  createHermesWsl2WrapperRedactedValidationReport,
  type HermesWsl2WrapperLocalValueValidationReport,
  type HermesWsl2WrapperSlotInventoryRefreshSummary,
} from "./hermes-wsl2-wrapper-local-value-validator";

function parseLocalOnlyJsonFile(filePath: string): unknown {
  return JSON.parse(readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
}

export const HERMES_WSL2_WRAPPER_LOCAL_VALUE_FILE_RELATIVE_SEGMENTS = [
  "sandbox",
  "hermes-autonomy-zone",
  "local-only",
  "wsl-wrapper-values.local.json",
] as const;

export const HERMES_WSL2_DISTRO_SELECTION_LOCAL_FILE_RELATIVE_SEGMENTS = [
  "sandbox",
  "hermes-autonomy-zone",
  "local-only",
  "wsl-distro-selection.local.json",
] as const;

export interface HermesWsl2WrapperLocalValueFilePathValidation {
  readonly ok: boolean;
  readonly reason:
    | "exact_local_only_path"
    | "not_exact_local_only_path"
    | "project_root_missing";
}

export interface HermesWsl2WrapperLocalValueFilePresenceSummary {
  readonly localValueFileExists: boolean;
  readonly gitignoredExpected: true;
  readonly relativePathLabel: "sandbox/hermes-autonomy-zone/local-only/wsl-wrapper-values.local.json";
  readonly canReadArbitraryFile: false;
}

export function resolveHermesWsl2WrapperLocalValueFilePath(
  projectRoot: string,
): string {
  return path.resolve(
    projectRoot,
    ...HERMES_WSL2_WRAPPER_LOCAL_VALUE_FILE_RELATIVE_SEGMENTS,
  );
}

export function resolveHermesWsl2DistroSelectionLocalFilePath(
  projectRoot: string,
): string {
  return path.resolve(
    projectRoot,
    ...HERMES_WSL2_DISTRO_SELECTION_LOCAL_FILE_RELATIVE_SEGMENTS,
  );
}

export function validateHermesWsl2WrapperLocalValueFilePath(
  projectRoot: string,
  candidatePath: string,
): HermesWsl2WrapperLocalValueFilePathValidation {
  if (!projectRoot || !candidatePath) {
    return { ok: false, reason: "project_root_missing" };
  }
  const expected = resolveHermesWsl2WrapperLocalValueFilePath(projectRoot);
  const candidate = path.resolve(candidatePath);
  return path.normalize(candidate) === path.normalize(expected)
    ? { ok: true, reason: "exact_local_only_path" }
    : { ok: false, reason: "not_exact_local_only_path" };
}

export function summarizeHermesWsl2WrapperLocalValueFilePresence(
  projectRoot: string,
): HermesWsl2WrapperLocalValueFilePresenceSummary {
  return {
    localValueFileExists: existsSync(
      resolveHermesWsl2WrapperLocalValueFilePath(projectRoot),
    ),
    gitignoredExpected: true,
    relativePathLabel:
      "sandbox/hermes-autonomy-zone/local-only/wsl-wrapper-values.local.json",
    canReadArbitraryFile: false,
  };
}

export function readHermesWsl2WrapperLocalValueFileForValidation(params: {
  readonly projectRoot: string;
}): HermesWsl2WrapperLocalValueValidationReport {
  const filePath = resolveHermesWsl2WrapperLocalValueFilePath(
    params.projectRoot,
  );
  const pathCheck = validateHermesWsl2WrapperLocalValueFilePath(
    params.projectRoot,
    filePath,
  );
  if (!pathCheck.ok) {
    return createHermesWsl2WrapperRedactedValidationReport(null, {
      localValueFileExists: false,
    });
  }
  if (!existsSync(filePath)) {
    return createHermesWsl2WrapperRedactedValidationReport(null, {
      localValueFileExists: false,
    });
  }

  try {
    const parsed: unknown = parseLocalOnlyJsonFile(filePath);
    return createHermesWsl2WrapperRedactedValidationReport(parsed, {
      localValueFileExists: true,
    });
  } catch {
    return {
      ...createHermesWsl2WrapperRedactedValidationReport(
        { parseError: "redacted" },
        { localValueFileExists: true },
      ),
      decision: "reject",
      validationStatus: "shape_rejected",
      nextRequiredAction: "fix_malformed_local_only_json_and_rerun_validator",
    };
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function readHermesWsl2DistroSelectionLocalFileForRefreshSummary(params: {
  readonly projectRoot: string;
}): HermesWsl2WrapperSlotInventoryRefreshSummary | null {
  const filePath = resolveHermesWsl2DistroSelectionLocalFilePath(
    params.projectRoot,
  );
  if (!existsSync(filePath)) return null;
  try {
    const parsed: unknown = parseLocalOnlyJsonFile(filePath);
    if (!isRecord(parsed)) return null;
    const selectableSlots = Array.isArray(parsed.selectableSlots)
      ? parsed.selectableSlots.map((x) => String(x))
      : [];
    return buildHermesWsl2WrapperSlotInventoryRefreshSummary({
      distroDiscoveryStatus:
        parsed.distroDiscoveryStatus === "refreshed"
          ? "refreshed"
          : "wsl_executable_missing",
      distroCount:
        typeof parsed.distroCount === "number" ? parsed.distroCount : 0,
      selectableSlots,
      selectedSlot:
        typeof parsed.selectedSlot === "string" &&
        parsed.selectedSlot !== "none" &&
        parsed.selectedSlot !== "unresolved"
          ? parsed.selectedSlot
          : parsed.selectedSlot === "unresolved"
            ? "unresolved"
            : null,
      selectedSlotStatus:
        parsed.selectedSlotStatus === "matched" ? "matched" : undefined,
      selectedAvailability:
        parsed.selectedAvailability === "failed" ? "failed" : undefined,
      selectedFailureReason:
        parsed.selectedFailureReason === "distro_not_in_current_wsl_list"
          ? "distro_not_in_current_wsl_list"
          : undefined,
      previousSelectedSlot:
        typeof parsed.previousSelectedSlot === "string"
          ? parsed.previousSelectedSlot
          : "slot-02",
      previousSelectedSlotStatus:
        parsed.previousSelectedSlotStatus === "mismatch"
          ? "mismatch"
          : undefined,
      previousFailureReason: [
        "distro_not_in_current_wsl_list",
        "distro_name_mismatch",
      ].includes(String(parsed.previousFailureReason))
        ? (String(parsed.previousFailureReason) as
            | "distro_not_in_current_wsl_list"
            | "distro_name_mismatch")
        : "distro_not_in_current_wsl_list",
      inventoryConsistency: [
        "pending",
        "matched",
        "mismatched",
        "unknown",
      ].includes(String(parsed.inventoryConsistency))
        ? (String(parsed.inventoryConsistency) as
            | "pending"
            | "matched"
            | "mismatched"
            | "unknown")
        : undefined,
      inventoryCountConsistency: ["matched", "mismatched", "unknown"].includes(
        String(parsed.inventoryCountConsistency),
      )
        ? (String(parsed.inventoryCountConsistency) as
            | "matched"
            | "mismatched"
            | "unknown")
        : undefined,
      inventoryContentConsistency: [
        "matched",
        "mismatched",
        "partial",
        "unknown",
      ].includes(String(parsed.inventoryContentConsistency))
        ? (String(parsed.inventoryContentConsistency) as
            | "matched"
            | "mismatched"
            | "partial"
            | "unknown")
        : undefined,
      slotStatuses: Array.isArray(parsed.slotStatuses)
        ? parsed.slotStatuses.map((slot) => ({
            slotId: String((slot as { slotId?: unknown }).slotId),
            status: ["matched", "mismatch", "unknown"].includes(
              String((slot as { status?: unknown }).status),
            )
              ? (String((slot as { status?: unknown }).status) as
                  | "matched"
                  | "mismatch"
                  | "unknown")
              : "unknown",
          }))
        : undefined,
      slotMapCount:
        typeof parsed.slotMapCount === "number"
          ? parsed.slotMapCount
          : undefined,
      currentInventoryCount:
        typeof parsed.currentInventoryCount === "number"
          ? parsed.currentInventoryCount
          : undefined,
      exactMatchReadiness:
        parsed.exactMatchReadiness === "ready" ||
        parsed.exactMatchReadiness === "not_ready"
          ? parsed.exactMatchReadiness
          : undefined,
      exactMatchResult: [
        "single_match",
        "no_match",
        "duplicate_match",
        "not_comparable",
      ].includes(String(parsed.exactMatchResult))
        ? (String(parsed.exactMatchResult) as
            | "single_match"
            | "no_match"
            | "duplicate_match"
            | "not_comparable")
        : undefined,
      matchedSlotId:
        typeof parsed.matchedSlotId === "string"
          ? parsed.matchedSlotId
          : undefined,
      matchCount:
        typeof parsed.matchCount === "number" ? parsed.matchCount : undefined,
      packagingGateStatus: [
        "unresolved",
        "blocked",
        "ready_for_review",
        "resolved_without_execution",
      ].includes(String(parsed.packagingGateStatus))
        ? (String(parsed.packagingGateStatus) as
            | "unresolved"
            | "blocked"
            | "ready_for_review"
            | "resolved_without_execution")
        : undefined,
      packagingRiskLevel: ["low", "medium", "high", "unknown"].includes(
        String(parsed.packagingRiskLevel),
      )
        ? (String(parsed.packagingRiskLevel) as
            | "low"
            | "medium"
            | "high"
            | "unknown")
        : undefined,
      packagingBlockers: Array.isArray(parsed.packagingBlockers)
        ? parsed.packagingBlockers
            .map((x) => String(x))
            .filter(
              (
                x,
              ): x is
                | "packaged_short_launch_smoke_not_run"
                | "pending_packaging_resolution_true"
                | "execution_forbidden"
                | "non_execution_review_required" =>
                [
                  "packaged_short_launch_smoke_not_run",
                  "pending_packaging_resolution_true",
                  "execution_forbidden",
                  "non_execution_review_required",
                ].includes(x),
            )
        : undefined,
      goPolicyReviewStatus: [
        "not_started",
        "in_review",
        "blocked",
        "ready_for_human_go_review",
      ].includes(String(parsed.goPolicyReviewStatus))
        ? (String(parsed.goPolicyReviewStatus) as
            | "not_started"
            | "in_review"
            | "blocked"
            | "ready_for_human_go_review")
        : undefined,
      goPolicyRiskLevel: ["low", "medium", "high", "unknown"].includes(
        String(parsed.goPolicyRiskLevel),
      )
        ? (String(parsed.goPolicyRiskLevel) as
            | "low"
            | "medium"
            | "high"
            | "unknown")
        : undefined,
      goPolicyBlockers: Array.isArray(parsed.goPolicyBlockers)
        ? parsed.goPolicyBlockers
            .map((x) => String(x))
            .filter(
              (
                x,
              ): x is
                | "execution_still_disabled"
                | "non_execution_readiness_review_required"
                | "human_go_review_required"
                | "packaging_gate_not_resolved"
                | "production_ready_gate_not_met" =>
                [
                  "execution_still_disabled",
                  "non_execution_readiness_review_required",
                  "human_go_review_required",
                  "packaging_gate_not_resolved",
                  "production_ready_gate_not_met",
                ].includes(x),
            )
        : undefined,
      humanGoApprovalRequired:
        parsed.humanGoApprovalRequired === true ? true : undefined,
      executionStillDisabled:
        parsed.executionStillDisabled === true ? true : undefined,
      nextRequiredHumanAction:
        parsed.nextRequiredHumanAction === "choose_matched_slot_id"
          ? "choose_matched_slot_id"
          : parsed.nextRequiredHumanAction ===
              "refresh_slot_map_or_rebuild_inventory"
            ? "refresh_slot_map_or_rebuild_inventory"
            : parsed.nextRequiredHumanAction ===
                "run_redacted_inventory_diagnostic"
              ? "run_redacted_inventory_diagnostic"
              : parsed.nextRequiredHumanAction ===
                  "refresh_or_validate_slot_inventory_consistency"
                ? "refresh_or_validate_slot_inventory_consistency"
                : parsed.nextRequiredHumanAction ===
                    "verify_selected_slot_availability_locally"
                  ? "verify_selected_slot_availability_locally"
                  : parsed.nextRequiredHumanAction ===
                      "resolve_slot_map_distro_mismatch"
                    ? "resolve_slot_map_distro_mismatch"
                    : parsed.nextRequiredHumanAction ===
                        "update_local_only_slot_map_or_hold"
                      ? "update_local_only_slot_map_or_hold"
                      : parsed.nextRequiredHumanAction ===
                          "resolve_packaging_safety_gate"
                        ? "resolve_packaging_safety_gate"
                        : parsed.nextRequiredHumanAction ===
                            "review_non_execution_readiness_before_go_policy"
                          ? "review_non_execution_readiness_before_go_policy"
                          : parsed.nextRequiredHumanAction ===
                              "address_packaging_blockers"
                            ? "address_packaging_blockers"
                            : parsed.nextRequiredHumanAction ===
                                "human_review_go_policy_prerequisites"
                              ? "human_review_go_policy_prerequisites"
                              : "select_slot_id",
    });
  } catch {
    return null;
  }
}

export function readHermesWsl2WrapperLocalValueFileWithSlotInventoryForValidation(params: {
  readonly projectRoot: string;
}): HermesWsl2WrapperLocalValueValidationReport {
  const report = readHermesWsl2WrapperLocalValueFileForValidation(params);
  const summary =
    readHermesWsl2DistroSelectionLocalFileForRefreshSummary(params);
  return summary
    ? attachHermesWsl2WrapperSlotInventoryRefreshHold(report, summary)
    : report;
}
