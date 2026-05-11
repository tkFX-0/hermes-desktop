/**
 * WSL2 wrapper local-only value validator.
 *
 * This module accepts already-parsed JSON values and returns redacted status
 * only. It never returns raw distro names, users, wrapper paths, argv, env, or
 * JSON content.
 */
import {
  coerceLocalOnlyJsonObjectToHumanValuePacket,
  validateHermesWsl2WrapperHumanValuePacket,
  validateLocalOnlyValuePacketShape,
  type HermesWsl2WrapperHumanValuePacket,
  type HermesWsl2WrapperHumanValuePacketValidationResult,
} from "./hermes-wsl2-wrapper-human-value-packet";

export const HERMES_WSL2_LOCAL_VALUE_VALIDATION_FIELDS = [
  "distroName",
  "unixUser",
  "wrapperPath",
  "windowsWslExePath",
  "allowedExecutableId",
  "timeoutMs",
  "maxStdoutBytes",
  "maxStderrBytes",
  "expectedPayloadSchemaVersion",
  "logLevel",
  "signoffSource",
  "signoffAtUnixMs",
  "operatorLabel",
] as const;

export type HermesWsl2WrapperLocalValueValidationField =
  (typeof HERMES_WSL2_LOCAL_VALUE_VALIDATION_FIELDS)[number];

export type HermesWsl2WrapperLocalValueDecision = "go" | "hold" | "reject";

export type HermesWsl2WrapperLocalValueValidationStatus =
  | "file_missing"
  | "shape_rejected"
  | "placeholder_or_not_confirmed"
  | "pending"
  | "rejected"
  | "selected_distro_availability_hold"
  | "packet_complete_execution_forbidden";

export type HermesWsl2WrapperSelectedDistroFailureCategory =
  | "inventory_mismatch"
  | "distro_not_in_current_wsl_list"
  | "distro_name_mismatch"
  | "selected_distro_launch_failed"
  | "whoami_failed_but_user_env_discovered"
  | "whoami_failed_and_user_env_failed"
  | "command_timeout"
  | "wsl_executable_missing"
  | "unknown_sanitized_failure";

export interface HermesWsl2WrapperSelectedDistroAvailabilitySummary {
  readonly selectedSlot: `slot-${string}`;
  readonly availability: "failed";
  readonly slotResolution: "resolved_locally";
  readonly inventoryCountComparison: "count_matched_content_unverified";
  readonly unixUserDiscovery: "failed";
  readonly alternateUnixUserDiscovery: "failed";
  readonly failureCategory: HermesWsl2WrapperSelectedDistroFailureCategory;
  readonly localJsonUpdatedForDistroUserWrapper: false;
  readonly nextRequiredHumanAction:
    | "verify_selected_slot_availability_locally"
    | "choose_another_slot";
  readonly rawValuesReported: false;
}

export interface HermesWsl2WrapperSlotInventoryRefreshSummary {
  readonly distroDiscoveryStatus: "refreshed" | "wsl_executable_missing";
  readonly distroCount: number;
  readonly selectableSlots: readonly `slot-${string}`[];
  readonly selectedSlot: `slot-${string}` | "none" | "unresolved";
  readonly selectedSlotStatus?: "matched";
  readonly selectedAvailability?: "failed";
  readonly selectedFailureReason?: "distro_not_in_current_wsl_list";
  readonly previousSelectedSlot: `slot-${string}`;
  readonly previousSelectedSlotStatus?: "mismatch";
  readonly previousFailureReason:
    | "distro_not_in_current_wsl_list"
    | "distro_name_mismatch";
  /**
   * Legacy count/content-ambiguous field. Do not use this as full inventory
   * content consistency. Consumers must use inventoryCountConsistency and
   * inventoryContentConsistency instead.
   */
  readonly inventoryConsistency?:
    | "pending"
    | "matched"
    | "mismatched"
    | "unknown";
  readonly inventoryCountConsistency?: "matched" | "mismatched" | "unknown";
  readonly inventoryContentConsistency?:
    | "matched"
    | "mismatched"
    | "partial"
    | "unknown";
  readonly slotStatuses?: readonly {
    readonly slotId: `slot-${string}`;
    readonly status: "matched" | "mismatch" | "unknown";
  }[];
  readonly slotMapCount?: number;
  readonly currentInventoryCount?: number;
  readonly exactMatchReadiness?: "ready" | "not_ready";
  readonly exactMatchResult?:
    | "single_match"
    | "no_match"
    | "duplicate_match"
    | "not_comparable";
  readonly matchedSlotId?: `slot-${string}` | "none";
  readonly matchCount?: number;
  readonly packagingGateStatus?:
    | "unresolved"
    | "blocked"
    | "ready_for_review"
    | "resolved_without_execution";
  readonly packagingRiskLevel?: "low" | "medium" | "high" | "unknown";
  readonly packagingBlockers?: readonly (
    | "packaged_short_launch_smoke_not_run"
    | "pending_packaging_resolution_true"
    | "execution_forbidden"
    | "non_execution_review_required"
  )[];
  /** GO policy review: not_started until packaging gate resolved_without_execution. */
  readonly goPolicyReviewStatus?:
    | "not_started"
    | "in_review"
    | "blocked"
    | "ready_for_human_go_review";
  readonly goPolicyRiskLevel?: "low" | "medium" | "high" | "unknown";
  readonly goPolicyBlockers?: readonly (
    | "execution_still_disabled"
    | "non_execution_readiness_review_required"
    | "human_go_review_required"
    | "packaging_gate_not_resolved"
    | "production_ready_gate_not_met"
  )[];
  /** Always true: human explicit GO review required before any execution. */
  readonly humanGoApprovalRequired?: true;
  /** Always true: execution remains disabled until separate human GO approval. */
  readonly executionStillDisabled?: true;
  readonly decision: "HOLD";
  readonly nextRequiredHumanAction:
    | "select_slot_id"
    | "verify_selected_slot_availability_locally"
    | "refresh_or_validate_slot_inventory_consistency"
    | "choose_matched_slot_id"
    | "refresh_slot_map_or_rebuild_inventory"
    | "run_redacted_inventory_diagnostic"
    | "resolve_slot_map_distro_mismatch"
    | "update_local_only_slot_map_or_hold"
    | "resolve_packaging_safety_gate"
    | "review_non_execution_readiness_before_go_policy"
    | "address_packaging_blockers"
    | "human_review_go_policy_prerequisites";
  readonly rawValuesReported: false;
  readonly execution: "disabled";
  readonly canRunWrapper?: false;
}

export interface HermesWsl2WrapperLocalValueValidationReport {
  readonly reportSchemaVersion: "wsl2_local_value_validation_report/v1";
  readonly decision: HermesWsl2WrapperLocalValueDecision;
  readonly validationStatus: HermesWsl2WrapperLocalValueValidationStatus;
  readonly localValueFileExists: boolean;
  readonly presentFieldCount: number;
  readonly missingFieldCount: number;
  readonly placeholderFieldCount: number;
  readonly rejectedFieldCount: number;
  readonly redactedSummaryLines: readonly string[];
  readonly nextRequiredAction: string;
  readonly safeForSignoff: boolean;
  readonly system32ExactMatchConfirmed: boolean;
  readonly sysnativeRejectedV1: boolean;
  readonly wrapperPathPolicyPassed: boolean | "unknown";
  readonly selectedDistroAvailabilitySummary?: HermesWsl2WrapperSelectedDistroAvailabilitySummary;
  readonly slotInventoryRefreshSummary?: HermesWsl2WrapperSlotInventoryRefreshSummary;
  readonly canRunWsl: false;
  readonly canRunHermes: false;
  readonly canRunOnce: false;
  readonly productionReady: false;
}

const SECRET_LIKE =
  /SECRET|PASSWORD|TOKEN|(^|_)KEY(_|$)|API[_-]?KEY|CREDENTIAL|PRIVATE|OPENAI|AZURE_|AWS_|\.env\b|Bearer\s/i;

const PLACEHOLDER_WORD =
  /^(?:TODO|TBD|PENDING|PLACEHOLDER|REPLACE_ME|CHANGE_ME|UNFILLED|UNKNOWN)$/i;

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPlaceholderValue(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  if (trimmed.length === 0) return true;
  if (trimmed.includes("<") || trimmed.includes(">")) return true;
  if (SECRET_LIKE.test(trimmed)) return false;
  return PLACEHOLDER_WORD.test(trimmed);
}

function countFields(input: unknown): {
  present: number;
  missing: number;
  placeholder: number;
} {
  if (!isPlainRecord(input)) {
    return {
      present: 0,
      missing: HERMES_WSL2_LOCAL_VALUE_VALIDATION_FIELDS.length,
      placeholder: 0,
    };
  }
  let present = 0;
  let missing = 0;
  let placeholder = 0;
  for (const field of HERMES_WSL2_LOCAL_VALUE_VALIDATION_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(input, field)) {
      missing++;
      continue;
    }
    const value = input[field];
    if (value === undefined) {
      missing++;
      continue;
    }
    present++;
    if (isPlaceholderValue(value)) placeholder++;
  }
  return { present, missing, placeholder };
}

function removePlaceholderValues(input: unknown): unknown {
  if (!isPlainRecord(input)) return input;
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (key === "_comment") {
      sanitized[key] = value;
      continue;
    }
    if (isPlaceholderValue(value)) continue;
    sanitized[key] = value;
  }
  return sanitized;
}

function classifyDecision(
  base: HermesWsl2WrapperHumanValuePacketValidationResult,
  placeholderFieldCount: number,
): HermesWsl2WrapperLocalValueDecision {
  if (base.status === "rejected") return "reject";
  if (placeholderFieldCount > 0 || base.pendingFields.length > 0) return "hold";
  return "go";
}

export function classifyHermesWsl2WrapperLocalValueDecision(
  report: Pick<HermesWsl2WrapperLocalValueValidationReport, "decision">,
): HermesWsl2WrapperLocalValueDecision {
  return report.decision;
}

function nextActionForDecision(
  decision: HermesWsl2WrapperLocalValueDecision,
): string {
  if (decision === "go")
    return "review_redacted_signoff_then_request_separate_wsl_goal";
  if (decision === "reject")
    return "fix_invalid_local_only_values_and_rerun_validator";
  return "fill_local_only_json_with_real_values_and_rerun_validator";
}

function buildRedactedLines(params: {
  decision: HermesWsl2WrapperLocalValueDecision;
  validationStatus: HermesWsl2WrapperLocalValueValidationStatus;
  counts: ReturnType<typeof countFields>;
  base: HermesWsl2WrapperHumanValuePacketValidationResult | null;
  localValueFileExists: boolean;
  system32ExactMatchConfirmed: boolean;
  sysnativeRejectedV1: boolean;
  wrapperPathPolicyPassed: boolean | "unknown";
  selectedDistroAvailabilitySummary?: HermesWsl2WrapperSelectedDistroAvailabilitySummary;
  slotInventoryRefreshSummary?: HermesWsl2WrapperSlotInventoryRefreshSummary;
}): readonly string[] {
  const lines = [
    "wsl2_local_value_validation_report:v1",
    `decision:${params.decision}`,
    `validation_status:${params.validationStatus}`,
    `local_value_file_exists:${params.localValueFileExists}`,
    `present_field_count:${params.counts.present}`,
    `missing_field_count:${params.counts.missing}`,
    `placeholder_field_count:${params.counts.placeholder}`,
    `rejected_field_count:${params.base?.rejectedFields.length ?? 0}`,
    `system32_exact_match_confirmed:${params.system32ExactMatchConfirmed}`,
    `sysnative_rejected_v1:${params.sysnativeRejectedV1}`,
    `wrapper_path_policy_passed:${String(params.wrapperPathPolicyPassed)}`,
    "raw_values_recorded:false",
    "wsl_exe_executed:false",
    "real_hermes_executed:false",
    "execfile_real_machine_executed:false",
    "can_run_wsl:false",
    "can_run_hermes:false",
    "can_run_once:false",
    "production_ready:false",
  ];
  if (params.selectedDistroAvailabilitySummary) {
    const s = params.selectedDistroAvailabilitySummary;
    lines.push(
      `selected_slot:${s.selectedSlot}`,
      `availability:${s.availability}`,
      `slot_resolution:${s.slotResolution}`,
      `inventory_count_comparison:${s.inventoryCountComparison}`,
      `unix_user_discovery:${s.unixUserDiscovery}`,
      `alternate_unix_user_discovery:${s.alternateUnixUserDiscovery}`,
      `failure_category:${s.failureCategory}`,
      `local_json_updated_for_distro_user_wrapper:${s.localJsonUpdatedForDistroUserWrapper}`,
      `next_required_human_action:${s.nextRequiredHumanAction}`,
      `selected_distro_raw_values_reported:${s.rawValuesReported}`,
    );
  }
  if (params.base) {
    lines.push(...params.base.safeSummaryLines.map((x) => `validator:${x}`));
  }
  if (params.slotInventoryRefreshSummary) {
    const s = params.slotInventoryRefreshSummary;
    lines.push(
      `distro_discovery_status:${s.distroDiscoveryStatus}`,
      `distro_count:${s.distroCount}`,
      `selectable_slots:${s.selectableSlots.join(",")}`,
      `selected_slot:${s.selectedSlot}`,
      ...(s.selectedAvailability
        ? [`selected_availability:${s.selectedAvailability}`]
        : []),
      ...(s.selectedSlotStatus
        ? [`selected_slot_status:${s.selectedSlotStatus}`]
        : []),
      ...(s.selectedFailureReason
        ? [`selected_failure_reason:${s.selectedFailureReason}`]
        : []),
      `previous_selected_slot:${s.previousSelectedSlot}`,
      ...(s.previousSelectedSlotStatus
        ? [`previous_selected_slot_status:${s.previousSelectedSlotStatus}`]
        : []),
      `previous_failure_reason:${s.previousFailureReason}`,
      ...(s.inventoryConsistency
        ? [`inventory_consistency:${s.inventoryConsistency}`]
        : []),
      ...(s.inventoryCountConsistency
        ? [`inventory_count_consistency:${s.inventoryCountConsistency}`]
        : []),
      ...(s.inventoryContentConsistency
        ? [`inventory_content_consistency:${s.inventoryContentConsistency}`]
        : []),
      ...(s.slotStatuses
        ? [
            `slot_statuses:${s.slotStatuses
              .map((x) => `${x.slotId}:${x.status}`)
              .join(",")}`,
          ]
        : []),
      ...(typeof s.slotMapCount === "number"
        ? [`slot_map_count:${s.slotMapCount}`]
        : []),
      ...(typeof s.currentInventoryCount === "number"
        ? [`current_inventory_count:${s.currentInventoryCount}`]
        : []),
      ...(s.exactMatchReadiness
        ? [`exact_match_readiness:${s.exactMatchReadiness}`]
        : []),
      ...(s.exactMatchResult
        ? [`exact_match_result:${s.exactMatchResult}`]
        : []),
      ...(s.matchedSlotId ? [`matched_slot_id:${s.matchedSlotId}`] : []),
      ...(typeof s.matchCount === "number"
        ? [`match_count:${s.matchCount}`]
        : []),
      ...(s.packagingGateStatus
        ? [`packaging_gate_status:${s.packagingGateStatus}`]
        : []),
      ...(s.packagingRiskLevel
        ? [`packaging_risk_level:${s.packagingRiskLevel}`]
        : []),
      ...(s.packagingBlockers
        ? [`packaging_blockers:${s.packagingBlockers.join(",")}`]
        : []),
      ...(s.goPolicyReviewStatus
        ? [`go_policy_review_status:${s.goPolicyReviewStatus}`]
        : []),
      ...(s.goPolicyRiskLevel
        ? [`go_policy_risk_level:${s.goPolicyRiskLevel}`]
        : []),
      ...(s.goPolicyBlockers
        ? [`go_policy_blockers:${s.goPolicyBlockers.join(",")}`]
        : []),
      ...(s.humanGoApprovalRequired
        ? [`human_go_approval_required:${s.humanGoApprovalRequired}`]
        : []),
      ...(s.executionStillDisabled
        ? [`execution_still_disabled:${s.executionStillDisabled}`]
        : []),
      `next_required_human_action:${s.nextRequiredHumanAction}`,
      `slot_inventory_raw_values_reported:${s.rawValuesReported}`,
      `execution:${s.execution}`,
      `can_run_wrapper:${String(s.canRunWrapper ?? false)}`,
    );
  }
  return lines;
}

const SLOT_ID = /^slot-\d{2,}$/;

function normalizeSelectedSlot(slot: string): `slot-${string}` {
  if (!SLOT_ID.test(slot)) {
    throw new Error("selected_distro_availability:invalid_slot_id");
  }
  return slot as `slot-${string}`;
}

export function buildHermesWsl2WrapperSelectedDistroAvailabilitySummary(params: {
  readonly selectedSlot: string;
  readonly failureCategory: HermesWsl2WrapperSelectedDistroFailureCategory;
  readonly nextRequiredHumanAction?:
    | "verify_selected_slot_availability_locally"
    | "choose_another_slot";
}): HermesWsl2WrapperSelectedDistroAvailabilitySummary {
  return {
    selectedSlot: normalizeSelectedSlot(params.selectedSlot),
    availability: "failed",
    slotResolution: "resolved_locally",
    inventoryCountComparison: "count_matched_content_unverified",
    unixUserDiscovery: "failed",
    alternateUnixUserDiscovery: "failed",
    failureCategory: params.failureCategory,
    localJsonUpdatedForDistroUserWrapper: false,
    nextRequiredHumanAction:
      params.nextRequiredHumanAction ??
      "verify_selected_slot_availability_locally",
    rawValuesReported: false,
  };
}

function statusForBase(
  decision: HermesWsl2WrapperLocalValueDecision,
  base: HermesWsl2WrapperHumanValuePacketValidationResult,
  placeholderFieldCount: number,
): HermesWsl2WrapperLocalValueValidationStatus {
  if (decision === "reject") return "rejected";
  if (placeholderFieldCount > 0) return "placeholder_or_not_confirmed";
  return base.status;
}

function reportFromShapeReject(
  counts: ReturnType<typeof countFields>,
  localValueFileExists: boolean,
): HermesWsl2WrapperLocalValueValidationReport {
  const decision = "reject" as const;
  const validationStatus = "shape_rejected" as const;
  return {
    reportSchemaVersion: "wsl2_local_value_validation_report/v1",
    decision,
    validationStatus,
    localValueFileExists,
    presentFieldCount: counts.present,
    missingFieldCount: counts.missing,
    placeholderFieldCount: counts.placeholder,
    rejectedFieldCount: 1,
    redactedSummaryLines: buildRedactedLines({
      decision,
      validationStatus,
      counts,
      base: null,
      localValueFileExists,
      system32ExactMatchConfirmed: false,
      sysnativeRejectedV1: false,
      wrapperPathPolicyPassed: "unknown",
    }),
    nextRequiredAction: nextActionForDecision(decision),
    safeForSignoff: true,
    system32ExactMatchConfirmed: false,
    sysnativeRejectedV1: false,
    wrapperPathPolicyPassed: "unknown",
    canRunWsl: false,
    canRunHermes: false,
    canRunOnce: false,
    productionReady: false,
  };
}

export function createHermesWsl2WrapperRedactedValidationReport(
  input: unknown,
  options?: { readonly localValueFileExists?: boolean },
): HermesWsl2WrapperLocalValueValidationReport {
  const localValueFileExists = options?.localValueFileExists ?? true;
  const counts = countFields(input);
  if (!localValueFileExists) {
    const decision = "hold" as const;
    const validationStatus = "file_missing" as const;
    return {
      reportSchemaVersion: "wsl2_local_value_validation_report/v1",
      decision,
      validationStatus,
      localValueFileExists: false,
      presentFieldCount: 0,
      missingFieldCount: HERMES_WSL2_LOCAL_VALUE_VALIDATION_FIELDS.length,
      placeholderFieldCount: 0,
      rejectedFieldCount: 0,
      redactedSummaryLines: buildRedactedLines({
        decision,
        validationStatus,
        counts: {
          present: 0,
          missing: HERMES_WSL2_LOCAL_VALUE_VALIDATION_FIELDS.length,
          placeholder: 0,
        },
        base: null,
        localValueFileExists: false,
        system32ExactMatchConfirmed: false,
        sysnativeRejectedV1: false,
        wrapperPathPolicyPassed: "unknown",
      }),
      nextRequiredAction: "create_local_only_json_from_example",
      safeForSignoff: true,
      system32ExactMatchConfirmed: false,
      sysnativeRejectedV1: false,
      wrapperPathPolicyPassed: "unknown",
      canRunWsl: false,
      canRunHermes: false,
      canRunOnce: false,
      productionReady: false,
    };
  }

  const shape = validateLocalOnlyValuePacketShape(input);
  if (!shape.ok) return reportFromShapeReject(counts, localValueFileExists);

  const sanitized = removePlaceholderValues(input);
  const packet = coerceLocalOnlyJsonObjectToHumanValuePacket(sanitized);
  const base = validateHermesWsl2WrapperHumanValuePacket(packet);
  const decision = classifyDecision(base, counts.placeholder);
  const validationStatus = statusForBase(decision, base, counts.placeholder);
  const system32ExactMatchConfirmed =
    base.windowsExeClass === "system32_exact_ok";
  const sysnativeRejectedV1 =
    base.windowsExeClass === "sysnative_future_v11_blocked";
  const wrapperPathPolicyPassed =
    base.pendingFields.includes("wrapperPath") || counts.placeholder > 0
      ? "unknown"
      : !base.rejectedFields.some((x) => x.field === "wrapperPath");

  return {
    reportSchemaVersion: "wsl2_local_value_validation_report/v1",
    decision,
    validationStatus,
    localValueFileExists,
    presentFieldCount: counts.present,
    missingFieldCount: counts.missing,
    placeholderFieldCount: counts.placeholder,
    rejectedFieldCount: base.rejectedFields.length,
    redactedSummaryLines: buildRedactedLines({
      decision,
      validationStatus,
      counts,
      base,
      localValueFileExists,
      system32ExactMatchConfirmed,
      sysnativeRejectedV1,
      wrapperPathPolicyPassed,
    }),
    nextRequiredAction: nextActionForDecision(decision),
    safeForSignoff: true,
    system32ExactMatchConfirmed,
    sysnativeRejectedV1,
    wrapperPathPolicyPassed,
    canRunWsl: false,
    canRunHermes: false,
    canRunOnce: false,
    productionReady: false,
  };
}

export function validateHermesWsl2WrapperLocalValueFileObject(
  input: unknown,
): HermesWsl2WrapperLocalValueValidationReport {
  return createHermesWsl2WrapperRedactedValidationReport(input, {
    localValueFileExists: true,
  });
}

export function evaluateHermesWsl2WrapperLocalValueReadiness(
  input: unknown,
): HermesWsl2WrapperLocalValueValidationReport {
  return validateHermesWsl2WrapperLocalValueFileObject(input);
}

export function summarizeHermesWsl2WrapperLocalValueValidationForSignoff(
  input: unknown | HermesWsl2WrapperHumanValuePacket,
): readonly string[] {
  return createHermesWsl2WrapperRedactedValidationReport(input)
    .redactedSummaryLines;
}

export function createEmptyHermesWsl2WrapperLocalValueValidationReport(): HermesWsl2WrapperLocalValueValidationReport {
  return createHermesWsl2WrapperRedactedValidationReport(null, {
    localValueFileExists: false,
  });
}

export function hardenHermesWsl2WrapperSelectedDistroAvailabilityHold(
  report: HermesWsl2WrapperLocalValueValidationReport,
  params: {
    readonly selectedSlot: string;
    readonly failureCategory: HermesWsl2WrapperSelectedDistroFailureCategory;
    readonly nextRequiredHumanAction?:
      | "verify_selected_slot_availability_locally"
      | "choose_another_slot";
  },
): HermesWsl2WrapperLocalValueValidationReport {
  const selectedDistroAvailabilitySummary =
    buildHermesWsl2WrapperSelectedDistroAvailabilitySummary(params);
  const redactedSummaryLines = [
    ...report.redactedSummaryLines,
    `selected_slot:${selectedDistroAvailabilitySummary.selectedSlot}`,
    `availability:${selectedDistroAvailabilitySummary.availability}`,
    `slot_resolution:${selectedDistroAvailabilitySummary.slotResolution}`,
    `inventory_count_comparison:${selectedDistroAvailabilitySummary.inventoryCountComparison}`,
    `unix_user_discovery:${selectedDistroAvailabilitySummary.unixUserDiscovery}`,
    `alternate_unix_user_discovery:${selectedDistroAvailabilitySummary.alternateUnixUserDiscovery}`,
    `failure_category:${selectedDistroAvailabilitySummary.failureCategory}`,
    "local_json_updated_for_distro_user_wrapper:false",
    `next_required_human_action:${selectedDistroAvailabilitySummary.nextRequiredHumanAction}`,
    "selected_distro_raw_values_reported:false",
  ];
  return {
    ...report,
    decision: "hold",
    validationStatus: "selected_distro_availability_hold",
    redactedSummaryLines,
    nextRequiredAction:
      selectedDistroAvailabilitySummary.nextRequiredHumanAction,
    selectedDistroAvailabilitySummary,
    canRunWsl: false,
    canRunHermes: false,
    canRunOnce: false,
    productionReady: false,
  };
}

export function buildHermesWsl2WrapperSlotInventoryRefreshSummary(params: {
  readonly distroDiscoveryStatus: "refreshed" | "wsl_executable_missing";
  readonly distroCount: number;
  readonly selectableSlots: readonly string[];
  readonly selectedSlot?: string | null;
  readonly selectedSlotStatus?: "matched";
  readonly selectedAvailability?: "failed";
  readonly selectedFailureReason?: "distro_not_in_current_wsl_list";
  readonly previousSelectedSlot: string;
  readonly previousSelectedSlotStatus?: "mismatch";
  readonly previousFailureReason:
    | "distro_not_in_current_wsl_list"
    | "distro_name_mismatch";
  readonly inventoryConsistency?:
    | "pending"
    | "matched"
    | "mismatched"
    | "unknown";
  readonly inventoryCountConsistency?: "matched" | "mismatched" | "unknown";
  readonly inventoryContentConsistency?:
    | "matched"
    | "mismatched"
    | "partial"
    | "unknown";
  readonly slotStatuses?: readonly {
    readonly slotId: string;
    readonly status: "matched" | "mismatch" | "unknown";
  }[];
  readonly slotMapCount?: number;
  readonly currentInventoryCount?: number;
  readonly exactMatchReadiness?: "ready" | "not_ready";
  readonly exactMatchResult?:
    | "single_match"
    | "no_match"
    | "duplicate_match"
    | "not_comparable";
  readonly matchedSlotId?: string | "none";
  readonly matchCount?: number;
  readonly packagingGateStatus?:
    | "unresolved"
    | "blocked"
    | "ready_for_review"
    | "resolved_without_execution";
  readonly packagingRiskLevel?: "low" | "medium" | "high" | "unknown";
  readonly packagingBlockers?: readonly (
    | "packaged_short_launch_smoke_not_run"
    | "pending_packaging_resolution_true"
    | "execution_forbidden"
    | "non_execution_review_required"
  )[];
  readonly goPolicyReviewStatus?:
    | "not_started"
    | "in_review"
    | "blocked"
    | "ready_for_human_go_review";
  readonly goPolicyRiskLevel?: "low" | "medium" | "high" | "unknown";
  readonly goPolicyBlockers?: readonly (
    | "execution_still_disabled"
    | "non_execution_readiness_review_required"
    | "human_go_review_required"
    | "packaging_gate_not_resolved"
    | "production_ready_gate_not_met"
  )[];
  readonly humanGoApprovalRequired?: true;
  readonly executionStillDisabled?: true;
  readonly nextRequiredHumanAction?:
    | "select_slot_id"
    | "verify_selected_slot_availability_locally"
    | "refresh_or_validate_slot_inventory_consistency"
    | "choose_matched_slot_id"
    | "refresh_slot_map_or_rebuild_inventory"
    | "run_redacted_inventory_diagnostic"
    | "resolve_slot_map_distro_mismatch"
    | "update_local_only_slot_map_or_hold"
    | "resolve_packaging_safety_gate"
    | "review_non_execution_readiness_before_go_policy"
    | "address_packaging_blockers"
    | "human_review_go_policy_prerequisites";
}): HermesWsl2WrapperSlotInventoryRefreshSummary {
  return {
    distroDiscoveryStatus: params.distroDiscoveryStatus,
    distroCount: Math.max(0, Math.trunc(params.distroCount)),
    selectableSlots: params.selectableSlots.map(normalizeSelectedSlot),
    selectedSlot:
      params.selectedSlot === "unresolved"
        ? "unresolved"
        : params.selectedSlot
          ? normalizeSelectedSlot(params.selectedSlot)
          : "none",
    selectedSlotStatus: params.selectedSlotStatus,
    selectedAvailability: params.selectedAvailability,
    selectedFailureReason: params.selectedFailureReason,
    previousSelectedSlot: normalizeSelectedSlot(params.previousSelectedSlot),
    previousSelectedSlotStatus: params.previousSelectedSlotStatus,
    previousFailureReason: params.previousFailureReason,
    inventoryConsistency:
      params.inventoryCountConsistency || params.inventoryContentConsistency
        ? undefined
        : params.inventoryConsistency,
    inventoryCountConsistency: params.inventoryCountConsistency,
    inventoryContentConsistency: params.inventoryContentConsistency,
    slotStatuses: params.slotStatuses?.map((slot) => ({
      slotId: normalizeSelectedSlot(slot.slotId),
      status: slot.status,
    })),
    slotMapCount:
      typeof params.slotMapCount === "number"
        ? Math.max(0, Math.trunc(params.slotMapCount))
        : undefined,
    currentInventoryCount:
      typeof params.currentInventoryCount === "number"
        ? Math.max(0, Math.trunc(params.currentInventoryCount))
        : undefined,
    exactMatchReadiness: params.exactMatchReadiness,
    exactMatchResult: params.exactMatchResult,
    matchedSlotId: params.matchedSlotId
      ? params.matchedSlotId === "none"
        ? "none"
        : normalizeSelectedSlot(params.matchedSlotId)
      : undefined,
    matchCount:
      typeof params.matchCount === "number"
        ? Math.max(0, Math.trunc(params.matchCount))
        : undefined,
    packagingGateStatus: params.packagingGateStatus,
    packagingRiskLevel: params.packagingRiskLevel,
    packagingBlockers: params.packagingBlockers,
    goPolicyReviewStatus: params.goPolicyReviewStatus,
    goPolicyRiskLevel: params.goPolicyRiskLevel,
    goPolicyBlockers: params.goPolicyBlockers,
    humanGoApprovalRequired: params.humanGoApprovalRequired,
    executionStillDisabled: params.executionStillDisabled,
    decision: "HOLD",
    nextRequiredHumanAction:
      params.nextRequiredHumanAction ??
      (params.selectedSlot
        ? "verify_selected_slot_availability_locally"
        : "select_slot_id"),
    rawValuesReported: false,
    execution: "disabled",
    canRunWrapper: false,
  };
}

export function attachHermesWsl2WrapperSlotInventoryRefreshHold(
  report: HermesWsl2WrapperLocalValueValidationReport,
  summary: HermesWsl2WrapperSlotInventoryRefreshSummary,
): HermesWsl2WrapperLocalValueValidationReport {
  return {
    ...report,
    decision: "hold",
    nextRequiredAction: summary.nextRequiredHumanAction,
    slotInventoryRefreshSummary: summary,
    redactedSummaryLines: [
      ...report.redactedSummaryLines,
      ...buildRedactedLines({
        decision: "hold",
        validationStatus: report.validationStatus,
        counts: {
          present: report.presentFieldCount,
          missing: report.missingFieldCount,
          placeholder: report.placeholderFieldCount,
        },
        base: null,
        localValueFileExists: report.localValueFileExists,
        system32ExactMatchConfirmed: report.system32ExactMatchConfirmed,
        sysnativeRejectedV1: report.sysnativeRejectedV1,
        wrapperPathPolicyPassed: report.wrapperPathPolicyPassed,
        slotInventoryRefreshSummary: summary,
      }).filter(
        (line) =>
          line.startsWith("distro_") ||
          line.startsWith("selectable_") ||
          line.startsWith("selected_") ||
          line.startsWith("previous_") ||
          line.startsWith("inventory_") ||
          line.startsWith("slot_map_") ||
          line.startsWith("slot_statuses:") ||
          line.startsWith("current_inventory_") ||
          line.startsWith("exact_match_") ||
          line.startsWith("matched_slot_") ||
          line.startsWith("match_count:") ||
          line.startsWith("packaging_") ||
          line.startsWith("go_policy_") ||
          line.startsWith("human_go_") ||
          line.startsWith("execution_still_") ||
          line.startsWith("next_") ||
          line.startsWith("slot_inventory_") ||
          line.startsWith("execution:") ||
          line.startsWith("can_run_wrapper:"),
      ),
    ],
    canRunWsl: false,
    canRunHermes: false,
    canRunOnce: false,
    productionReady: false,
  };
}

/**
 * Records a distro name mismatch HOLD without resolving raw distro identity.
 * Slot selection is unresolved: previousSelectedSlot had a distro name field
 * that did not exactly match the current WSL discovery result.
 * Partial matches and visual similarity are treated as mismatch.
 */
/**
 * Records that non-execution GO policy review is complete and ready for human
 * final review. All execution flags remain HOLD; human GO approval is still
 * required. goPolicyBlockers describe what human must evaluate.
 */
export function buildHermesWsl2WrapperGoReadyForHumanReviewSummary(params: {
  readonly distroCount: number;
  readonly selectableSlots: readonly string[];
  readonly previousSelectedSlot: string;
}): HermesWsl2WrapperSlotInventoryRefreshSummary {
  return buildHermesWsl2WrapperSlotInventoryRefreshSummary({
    distroDiscoveryStatus: "refreshed",
    distroCount: params.distroCount,
    selectableSlots: params.selectableSlots,
    selectedSlot: "slot-02",
    selectedSlotStatus: "matched",
    previousSelectedSlot: params.previousSelectedSlot,
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
  });
}

export function buildHermesWsl2WrapperDistroNameMismatchRefreshSummary(params: {
  readonly previousSelectedSlot: string;
}): HermesWsl2WrapperSlotInventoryRefreshSummary {
  return buildHermesWsl2WrapperSlotInventoryRefreshSummary({
    distroDiscoveryStatus: "refreshed",
    distroCount: 0,
    selectableSlots: [],
    selectedSlot: null,
    previousSelectedSlot: params.previousSelectedSlot,
    previousFailureReason: "distro_name_mismatch",
    inventoryContentConsistency: "mismatched",
    nextRequiredHumanAction: "resolve_slot_map_distro_mismatch",
  });
}
