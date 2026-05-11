/**
 * Renderer 向け Control Center App Shell が **検証のみ** で使う Snapshot 外形。
 * main の `buildControlCenterAppSnapshot` 出力と手で同期すること（実行ロジックは持たない）。
 */

export interface ControlCenterShellRoomAction {
  readonly id: string;
  readonly label: string;
  readonly state: "disabled";
  readonly disabledReason: string;
}

export interface ControlCenterShellRoomCard {
  readonly id: string;
  readonly title: string;
  readonly statusLine: string;
  readonly actions: readonly ControlCenterShellRoomAction[];
}

export interface ControlCenterShellRooms {
  readonly generatedAtUnixMs: number;
  readonly rooms: readonly ControlCenterShellRoomCard[];
}

export interface ControlCenterShellAgentTeamBrief {
  readonly schedulerEnabled: boolean;
  readonly blockerCountApprox: number;
  readonly warningCountApprox: number;
  readonly agents: readonly {
    readonly id: string;
    readonly labelJa: string;
    readonly autoRun: false;
    readonly autoApprove: false;
  }[];
}

export interface ControlCenterShellMemoryBrief {
  readonly candidateApproxCount: number;
  readonly safeSummaryLines: readonly string[];
}

export interface ControlCenterShellApprovalAuditBrief {
  readonly approvalQueueApproxCount: number | null;
  readonly auditApproxCount: number | null;
  readonly latestShortStatusHints: readonly string[];
}

export interface ControlCenterShellVisualizationBrief {
  readonly footerNote: string;
  readonly nodeCount: number;
}

export type ControlCenterShellPathRuntimeMode =
  | "electron_development"
  | "electron_packaged_pending";

export type ControlCenterShellSnapshotSourceLabel =
  | "development_snapshot_dev_only_source"
  | "packaged_snapshot_path_resolution_pending";

export type ControlCenterShellPathResolutionStatus =
  | "dev_repo_layout_ok"
  | "dev_repo_layout_marker_missing"
  | "packaged_unverified_fallback_layout"
  | "zone_outside_project_warning";

export interface ControlCenterShellBlockedItem {
  readonly code: string;
  readonly message: string;
}

export interface ControlCenterShellWsl2ParameterBrief {
  readonly parameterStatus: string;
  readonly pendingFieldCount: number;
  readonly confirmedFieldCount: number;
  readonly rejectedFieldCount: number;
  readonly nextRequiredUserAction: string;
  readonly pendingReasonBrief: string;
  readonly canRunWsl: false;
  readonly canRunBridgeOnceViaWsl: false;
  readonly productionReady: false;
}

export interface ControlCenterShellHumanValuePacketBrief {
  readonly humanValuePacketStatus: string;
  readonly pendingFieldCount: number;
  readonly rejectedFieldCount: number;
  readonly nextRequiredUserAction: string;
  readonly sysnativePolicy: string;
  readonly canRunWsl: false;
  readonly canRunBridgeOnceViaWsl: false;
  readonly productionReady: false;
}

export interface ControlCenterShellLocalValueValidationBrief {
  readonly decision: "go" | "hold" | "reject";
  readonly validationStatus: string;
  readonly localValueFileExists: boolean;
  readonly presentFieldCount: number;
  readonly missingFieldCount: number;
  readonly placeholderFieldCount: number;
  readonly rejectedFieldCount: number;
  readonly nextRequiredAction: string;
  readonly safeForSignoff: boolean;
  readonly system32ExactMatchConfirmed: boolean;
  readonly sysnativeRejectedV1: boolean;
  readonly wrapperPathPolicyPassed: boolean | "unknown";
  readonly selectedDistroAvailabilitySummary?: {
    readonly selectedSlot: string;
    readonly availability: "failed";
    readonly slotResolution: "resolved_locally";
    readonly inventoryCountComparison: "count_matched_content_unverified";
    readonly unixUserDiscovery: "failed";
    readonly alternateUnixUserDiscovery: "failed";
    readonly failureCategory: string;
    readonly localJsonUpdatedForDistroUserWrapper: false;
    readonly nextRequiredHumanAction: string;
    readonly rawValuesReported: false;
  };
  readonly slotInventoryRefreshSummary?: {
    readonly distroDiscoveryStatus: "refreshed" | "wsl_executable_missing";
    readonly distroCount: number;
    readonly selectableSlots: readonly string[];
    readonly selectedSlot: string | "none" | "unresolved";
    readonly selectedSlotStatus?: "matched";
    readonly selectedAvailability?: "failed";
    readonly selectedFailureReason?: "distro_not_in_current_wsl_list";
    readonly previousSelectedSlot: string;
    readonly previousSelectedSlotStatus?: "mismatch";
    readonly previousFailureReason:
      | "distro_not_in_current_wsl_list"
      | "distro_name_mismatch";
    /** Legacy count/content-ambiguous field. Use split consistency fields. */
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
    readonly packagingBlockers?: readonly string[];
    readonly goPolicyReviewStatus?:
      | "not_started"
      | "in_review"
      | "blocked"
      | "ready_for_human_go_review";
    readonly goPolicyRiskLevel?: "low" | "medium" | "high" | "unknown";
    readonly goPolicyBlockers?: readonly string[];
    readonly humanGoApprovalRequired?: true;
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
  };
  readonly canRunWsl: false;
  readonly canRunHermes: false;
  readonly canRunOnce: false;
  readonly productionReady: false;
}

/** UI が表示してよい安全サブセット（ネスト済みオブジェクトのみ） */
export interface ControlCenterShellSnapshot {
  readonly appStatus: string;
  readonly generatedAtUnixMs: number;
  readonly productionReady: false;
  readonly bridgeReadinessLabel: string;
  readonly scenarioSuiteLabel: string;
  readonly controlledPilotPreflightStatus: string;
  readonly controlledPilotCanRunOnceMeta: boolean;
  readonly realHermesProcessStatus: string;
  readonly wsl2WrapperStatusLine: string;
  /** main `wsl2WrapperParameterSummary` と同形の安全要約 */
  readonly wsl2WrapperParameterSummary: ControlCenterShellWsl2ParameterBrief;
  readonly wsl2HumanValueStatusLine: string;
  readonly wsl2HumanValuePacketSummary: ControlCenterShellHumanValuePacketBrief;
  readonly wsl2LocalValueValidationStatusLine: string;
  readonly wsl2LocalValueValidationSummary: ControlCenterShellLocalValueValidationBrief;
  readonly blockersCount: number;
  readonly warningsCount: number;
  readonly nextRecommendedGoal: string;
  readonly rooms: ControlCenterShellRooms;
  readonly agentTeamSummary: ControlCenterShellAgentTeamBrief;
  readonly visualizationModel: ControlCenterShellVisualizationBrief;
  readonly approvalAuditSummary: ControlCenterShellApprovalAuditBrief;
  readonly memorySummary: ControlCenterShellMemoryBrief;
  readonly warnings: readonly ControlCenterShellBlockedItem[];
  readonly blockers: readonly ControlCenterShellBlockedItem[];

  readonly pathResolutionRuntimeMode: ControlCenterShellPathRuntimeMode;
  readonly snapshotSourceLabel: ControlCenterShellSnapshotSourceLabel;
  readonly pathResolutionStatus: ControlCenterShellPathResolutionStatus;
  readonly pendingPackagingResolution: boolean;
  readonly pathResolutionSafeSummaryLines: readonly string[];
}

export type ShellSnapshotParseResult =
  | { readonly ok: true; readonly snapshot: ControlCenterShellSnapshot }
  | { readonly ok: false; readonly errorCode: string };

function isNonEmptyRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

function okRoomAction(x: unknown): x is ControlCenterShellRoomAction {
  if (!isNonEmptyRecord(x)) return false;
  return (
    typeof x.id === "string" &&
    typeof x.label === "string" &&
    x.state === "disabled" &&
    typeof x.disabledReason === "string"
  );
}

function okRoomCard(x: unknown): x is ControlCenterShellRoomCard {
  if (!isNonEmptyRecord(x)) return false;
  if (
    typeof x.id !== "string" ||
    typeof x.title !== "string" ||
    typeof x.statusLine !== "string"
  ) {
    return false;
  }
  if (!Array.isArray(x.actions) || x.actions.some((a) => !okRoomAction(a))) {
    return false;
  }
  return true;
}

const SHELL_RUNTIME_MODES: readonly ControlCenterShellPathRuntimeMode[] = [
  "electron_development",
  "electron_packaged_pending",
];

const SHELL_SNAPSHOT_SOURCES: readonly ControlCenterShellSnapshotSourceLabel[] =
  [
    "development_snapshot_dev_only_source",
    "packaged_snapshot_path_resolution_pending",
  ];

const SHELL_PATH_STATUSES: readonly ControlCenterShellPathResolutionStatus[] = [
  "dev_repo_layout_ok",
  "dev_repo_layout_marker_missing",
  "packaged_unverified_fallback_layout",
  "zone_outside_project_warning",
];

/** 短文に絶対パス類が混入していないか（過剰表示抑止）。 */
function summaryLineLooksLikeLeakedAbsolutePath(line: string): boolean {
  return /[A-Za-z]:\\|\\\\|\/(?:Users\/|home\/|tmp\/|var\/|etc\/)/i.test(line);
}

/** `getAppSnapshot()` の結果を検証。**失敗時は握りつぶさずコードのみ返す**（ Renderer はエラー UI）。 */
export function parseControlCenterShellSnapshot(
  data: unknown,
): ShellSnapshotParseResult {
  if (!isNonEmptyRecord(data))
    return { ok: false, errorCode: "payload_not_object" };

  if (
    typeof data.generatedAtUnixMs !== "number" ||
    !Number.isFinite(data.generatedAtUnixMs)
  )
    return { ok: false, errorCode: "missing_generated_at" };

  if (data.productionReady !== false)
    return { ok: false, errorCode: "production_ready_invariant_failed" };

  if (typeof data.appStatus !== "string")
    return { ok: false, errorCode: "missing_app_status" };

  const rooms = data.rooms;
  if (
    !isNonEmptyRecord(rooms) ||
    !Array.isArray(rooms.rooms) ||
    rooms.rooms.some((r) => !okRoomCard(r))
  )
    return { ok: false, errorCode: "invalid_rooms" };

  const at = data.agentTeamSummary;
  if (!isNonEmptyRecord(at))
    return { ok: false, errorCode: "invalid_agent_team" };
  if (typeof at.schedulerEnabled !== "boolean")
    return { ok: false, errorCode: "invalid_scheduler_flag" };

  const agents = at.agents;
  if (
    !Array.isArray(agents) ||
    agents.some(
      (a) =>
        !isNonEmptyRecord(a) ||
        typeof (a as { id?: unknown }).id !== "string" ||
        typeof (a as { labelJa?: unknown }).labelJa !== "string",
    )
  )
    return { ok: false, errorCode: "invalid_agents_shape" };

  const viz = data.visualizationModel;
  if (!isNonEmptyRecord(viz))
    return { ok: false, errorCode: "invalid_visualization" };
  const nodes = viz.nodes as unknown[] | undefined;
  if (!Array.isArray(nodes))
    return { ok: false, errorCode: "invalid_viz_nodes" };

  const ap = data.approvalAuditSummary;
  if (!isNonEmptyRecord(ap))
    return { ok: false, errorCode: "invalid_approval_audit" };
  if (!Array.isArray(ap.latestShortStatusHints))
    return { ok: false, errorCode: "invalid_approval_hints" };

  const mem = data.memorySummary;
  if (!isNonEmptyRecord(mem))
    return { ok: false, errorCode: "invalid_memory_summary" };
  if (
    typeof mem.candidateApproxCount !== "number" ||
    !Array.isArray(mem.safeSummaryLines)
  )
    return { ok: false, errorCode: "invalid_memory_counts" };

  const blockersRaw = data.blockers;
  const warningsRaw = data.warnings;
  if (
    !Array.isArray(blockersRaw) ||
    blockersRaw.some(
      (b) =>
        !isNonEmptyRecord(b) ||
        typeof b.code !== "string" ||
        typeof b.message !== "string",
    )
  )
    return { ok: false, errorCode: "invalid_blockers" };
  if (
    !Array.isArray(warningsRaw) ||
    warningsRaw.some(
      (w) =>
        !isNonEmptyRecord(w) ||
        typeof w.code !== "string" ||
        typeof w.message !== "string",
    )
  )
    return { ok: false, errorCode: "invalid_warnings" };

  if (
    typeof data.pathResolutionRuntimeMode !== "string" ||
    !SHELL_RUNTIME_MODES.includes(
      data.pathResolutionRuntimeMode as ControlCenterShellPathRuntimeMode,
    )
  )
    return { ok: false, errorCode: "invalid_path_runtime_mode" };

  if (
    typeof data.snapshotSourceLabel !== "string" ||
    !SHELL_SNAPSHOT_SOURCES.includes(
      data.snapshotSourceLabel as ControlCenterShellSnapshotSourceLabel,
    )
  )
    return { ok: false, errorCode: "invalid_snapshot_source_label" };

  if (
    typeof data.pathResolutionStatus !== "string" ||
    !SHELL_PATH_STATUSES.includes(
      data.pathResolutionStatus as ControlCenterShellPathResolutionStatus,
    )
  )
    return { ok: false, errorCode: "invalid_path_resolution_status" };

  if (typeof data.pendingPackagingResolution !== "boolean")
    return { ok: false, errorCode: "invalid_pending_packaging_flag" };

  const pathResLinesRaw = data.pathResolutionSafeSummaryLines;
  if (!Array.isArray(pathResLinesRaw))
    return { ok: false, errorCode: "invalid_path_resolution_lines" };

  const pathResLinesClean = [...pathResLinesRaw]
    .map((x) => String(x))
    .slice(0, 32);
  if (pathResLinesClean.some(summaryLineLooksLikeLeakedAbsolutePath)) {
    return { ok: false, errorCode: "path_absolute_leak_detected_in_summary" };
  }

  const wpf = data.wsl2WrapperParameterSummary;
  if (!isNonEmptyRecord(wpf))
    return { ok: false, errorCode: "missing_wsl2_wrapper_parameter_summary" };
  const sts = String((wpf as { status?: unknown }).status);
  const allowed = new Set([
    "pending",
    "rejected",
    "registry_ready_execution_forbidden",
  ]);
  if (!allowed.has(sts))
    return { ok: false, errorCode: "invalid_wsl2_registry_status" };
  const pfc = Number(
    (wpf as { pendingFieldCount?: unknown }).pendingFieldCount,
  );
  const cfc = Number(
    (wpf as { confirmedFieldCount?: unknown }).confirmedFieldCount,
  );
  const rfc = Number(
    (wpf as { rejectedFieldCount?: unknown }).rejectedFieldCount,
  );
  const prb = String(
    (wpf as { pendingReasonBrief?: unknown }).pendingReasonBrief,
  );
  if (
    !Number.isFinite(pfc) ||
    !Number.isFinite(cfc) ||
    !Number.isFinite(rfc) ||
    pfc < 0 ||
    cfc < 0 ||
    rfc < 0
  )
    return { ok: false, errorCode: "invalid_wsl2_registry_counts" };
  const nextAc = String(
    (wpf as { nextRequiredUserAction?: unknown }).nextRequiredUserAction,
  );
  if (nextAc.length > 400)
    return { ok: false, errorCode: "wsl2_registry_next_action_too_long" };
  if (summaryLineLooksLikeLeakedAbsolutePath(nextAc))
    return { ok: false, errorCode: "wsl2_registry_next_action_path_leak" };
  if (
    (wpf as { canRunWsl?: unknown }).canRunWsl !== false ||
    (wpf as { canRunBridgeOnceViaWsl?: unknown }).canRunBridgeOnceViaWsl !==
      false ||
    (wpf as { productionReady?: unknown }).productionReady !== false
  )
    return {
      ok: false,
      errorCode: "wsl2_registry_execution_flags_invariant_failed",
    };

  const hvp = data.wsl2HumanValuePacketSummary;
  if (!isNonEmptyRecord(hvp))
    return { ok: false, errorCode: "missing_wsl2_human_value_packet_summary" };
  const hvSts = String(
    (hvp as { humanValuePacketStatus?: unknown }).humanValuePacketStatus,
  );
  const hvAllowed = new Set([
    "pending",
    "rejected",
    "packet_complete_execution_forbidden",
  ]);
  if (!hvAllowed.has(hvSts))
    return { ok: false, errorCode: "invalid_wsl2_human_packet_status" };
  const hvP = Number(
    (hvp as { pendingFieldCount?: unknown }).pendingFieldCount,
  );
  const hvR = Number(
    (hvp as { rejectedFieldCount?: unknown }).rejectedFieldCount,
  );
  if (!Number.isFinite(hvP) || !Number.isFinite(hvR) || hvP < 0 || hvR < 0)
    return { ok: false, errorCode: "invalid_wsl2_human_packet_counts" };
  const hvNext = String(
    (hvp as { nextRequiredUserAction?: unknown }).nextRequiredUserAction,
  );
  if (hvNext.length > 400)
    return { ok: false, errorCode: "wsl2_human_packet_next_action_too_long" };
  if (summaryLineLooksLikeLeakedAbsolutePath(hvNext))
    return { ok: false, errorCode: "wsl2_human_packet_next_action_path_leak" };
  const snPol = String((hvp as { sysnativePolicy?: unknown }).sysnativePolicy);
  if (snPol !== "future_candidate_not_allowed_v1")
    return { ok: false, errorCode: "invalid_wsl2_human_sysnative_policy" };
  if (
    (hvp as { canRunWsl?: unknown }).canRunWsl !== false ||
    (hvp as { canRunBridgeOnceViaWsl?: unknown }).canRunBridgeOnceViaWsl !==
      false ||
    (hvp as { productionReady?: unknown }).productionReady !== false
  )
    return {
      ok: false,
      errorCode: "wsl2_human_packet_execution_flags_invariant_failed",
    };

  const lv = data.wsl2LocalValueValidationSummary;
  if (!isNonEmptyRecord(lv))
    return { ok: false, errorCode: "missing_wsl2_local_value_validation" };
  const lvDecision = String((lv as { decision?: unknown }).decision);
  if (!["go", "hold", "reject"].includes(lvDecision))
    return { ok: false, errorCode: "invalid_wsl2_local_value_decision" };
  const lvStatus = String(
    (lv as { validationStatus?: unknown }).validationStatus,
  );
  const lvPresent = Number(
    (lv as { presentFieldCount?: unknown }).presentFieldCount,
  );
  const lvMissing = Number(
    (lv as { missingFieldCount?: unknown }).missingFieldCount,
  );
  const lvPlaceholder = Number(
    (lv as { placeholderFieldCount?: unknown }).placeholderFieldCount,
  );
  const lvRejected = Number(
    (lv as { rejectedFieldCount?: unknown }).rejectedFieldCount,
  );
  if (
    !Number.isFinite(lvPresent) ||
    !Number.isFinite(lvMissing) ||
    !Number.isFinite(lvPlaceholder) ||
    !Number.isFinite(lvRejected) ||
    lvPresent < 0 ||
    lvMissing < 0 ||
    lvPlaceholder < 0 ||
    lvRejected < 0
  )
    return { ok: false, errorCode: "invalid_wsl2_local_value_counts" };
  const lvNext = String(
    (lv as { nextRequiredAction?: unknown }).nextRequiredAction,
  );
  if (lvNext.length > 400)
    return { ok: false, errorCode: "wsl2_local_value_next_action_too_long" };
  if (summaryLineLooksLikeLeakedAbsolutePath(lvNext))
    return { ok: false, errorCode: "wsl2_local_value_next_action_path_leak" };
  const lvWrapperPolicy = (lv as { wrapperPathPolicyPassed?: unknown })
    .wrapperPathPolicyPassed;
  if (
    lvWrapperPolicy !== true &&
    lvWrapperPolicy !== false &&
    lvWrapperPolicy !== "unknown"
  )
    return { ok: false, errorCode: "invalid_wsl2_local_wrapper_policy" };
  if (
    (lv as { canRunWsl?: unknown }).canRunWsl !== false ||
    (lv as { canRunHermes?: unknown }).canRunHermes !== false ||
    (lv as { canRunOnce?: unknown }).canRunOnce !== false ||
    (lv as { productionReady?: unknown }).productionReady !== false
  )
    return {
      ok: false,
      errorCode: "wsl2_local_value_execution_flags_invariant_failed",
    };

  const selectedDistroAvailabilityRaw = (
    lv as { selectedDistroAvailabilitySummary?: unknown }
  ).selectedDistroAvailabilitySummary;
  let selectedDistroAvailabilitySummary:
    | ControlCenterShellLocalValueValidationBrief["selectedDistroAvailabilitySummary"]
    | undefined;
  if (selectedDistroAvailabilityRaw !== undefined) {
    if (!isNonEmptyRecord(selectedDistroAvailabilityRaw)) {
      return {
        ok: false,
        errorCode: "invalid_wsl2_selected_distro_availability",
      };
    }
    const selectedSlot = String(
      (selectedDistroAvailabilityRaw as { selectedSlot?: unknown })
        .selectedSlot,
    );
    const failureCategory = String(
      (selectedDistroAvailabilityRaw as { failureCategory?: unknown })
        .failureCategory,
    );
    const availability = String(
      (selectedDistroAvailabilityRaw as { availability?: unknown })
        .availability,
    );
    const nextRequiredHumanAction = String(
      (
        selectedDistroAvailabilityRaw as {
          nextRequiredHumanAction?: unknown;
        }
      ).nextRequiredHumanAction,
    );
    if (!/^slot-\d{2,}$/.test(selectedSlot)) {
      return {
        ok: false,
        errorCode: "invalid_wsl2_selected_distro_slot",
      };
    }
    if (
      summaryLineLooksLikeLeakedAbsolutePath(failureCategory) ||
      summaryLineLooksLikeLeakedAbsolutePath(nextRequiredHumanAction) ||
      availability !== "failed" ||
      failureCategory.length > 120 ||
      nextRequiredHumanAction.length > 160 ||
      (selectedDistroAvailabilityRaw as { rawValuesReported?: unknown })
        .rawValuesReported !== false ||
      (
        selectedDistroAvailabilityRaw as {
          localJsonUpdatedForDistroUserWrapper?: unknown;
        }
      ).localJsonUpdatedForDistroUserWrapper !== false
    ) {
      return {
        ok: false,
        errorCode: "unsafe_wsl2_selected_distro_availability",
      };
    }
    selectedDistroAvailabilitySummary = {
      selectedSlot,
      availability: "failed",
      slotResolution: "resolved_locally",
      inventoryCountComparison: "count_matched_content_unverified",
      unixUserDiscovery: "failed",
      alternateUnixUserDiscovery: "failed",
      failureCategory: failureCategory.slice(0, 120),
      localJsonUpdatedForDistroUserWrapper: false,
      nextRequiredHumanAction: nextRequiredHumanAction.slice(0, 160),
      rawValuesReported: false,
    };
  }

  const slotInventoryRefreshRaw = (
    lv as { slotInventoryRefreshSummary?: unknown }
  ).slotInventoryRefreshSummary;
  let slotInventoryRefreshSummary:
    | ControlCenterShellLocalValueValidationBrief["slotInventoryRefreshSummary"]
    | undefined;
  if (slotInventoryRefreshRaw !== undefined) {
    if (!isNonEmptyRecord(slotInventoryRefreshRaw)) {
      return { ok: false, errorCode: "invalid_wsl2_slot_inventory_refresh" };
    }
    const selectableSlotsRaw = (
      slotInventoryRefreshRaw as { selectableSlots?: unknown }
    ).selectableSlots;
    const selectableSlots = Array.isArray(selectableSlotsRaw)
      ? selectableSlotsRaw.map((x) => String(x))
      : [];
    const previousSelectedSlot = String(
      (slotInventoryRefreshRaw as { previousSelectedSlot?: unknown })
        .previousSelectedSlot,
    );
    const selectedSlotForRefresh = String(
      (slotInventoryRefreshRaw as { selectedSlot?: unknown }).selectedSlot,
    );
    const nextRequiredSlotAction = String(
      (slotInventoryRefreshRaw as { nextRequiredHumanAction?: unknown })
        .nextRequiredHumanAction,
    );
    const selectedAvailability = (
      slotInventoryRefreshRaw as { selectedAvailability?: unknown }
    ).selectedAvailability;
    const selectedSlotStatus = (
      slotInventoryRefreshRaw as { selectedSlotStatus?: unknown }
    ).selectedSlotStatus;
    const previousSelectedSlotStatus = (
      slotInventoryRefreshRaw as { previousSelectedSlotStatus?: unknown }
    ).previousSelectedSlotStatus;
    const selectedFailureReason = (
      slotInventoryRefreshRaw as { selectedFailureReason?: unknown }
    ).selectedFailureReason;
    const inventoryConsistency = String(
      (slotInventoryRefreshRaw as { inventoryConsistency?: unknown })
        .inventoryConsistency,
    );
    const inventoryCountConsistency = String(
      (slotInventoryRefreshRaw as { inventoryCountConsistency?: unknown })
        .inventoryCountConsistency,
    );
    const inventoryContentConsistency = String(
      (slotInventoryRefreshRaw as { inventoryContentConsistency?: unknown })
        .inventoryContentConsistency,
    );
    const slotStatusesRaw = (
      slotInventoryRefreshRaw as { slotStatuses?: unknown }
    ).slotStatuses;
    const slotStatuses = Array.isArray(slotStatusesRaw)
      ? slotStatusesRaw.map((slot) => ({
          slotId: String((slot as { slotId?: unknown }).slotId),
          status: String((slot as { status?: unknown }).status),
        }))
      : undefined;
    const exactMatchReadiness = String(
      (slotInventoryRefreshRaw as { exactMatchReadiness?: unknown })
        .exactMatchReadiness,
    );
    const exactMatchResult = String(
      (slotInventoryRefreshRaw as { exactMatchResult?: unknown })
        .exactMatchResult,
    );
    const matchedSlotId = String(
      (slotInventoryRefreshRaw as { matchedSlotId?: unknown }).matchedSlotId,
    );
    const packagingGateStatus = String(
      (slotInventoryRefreshRaw as { packagingGateStatus?: unknown })
        .packagingGateStatus,
    );
    const packagingRiskLevel = String(
      (slotInventoryRefreshRaw as { packagingRiskLevel?: unknown })
        .packagingRiskLevel,
    );
    const packagingBlockersRaw = (
      slotInventoryRefreshRaw as { packagingBlockers?: unknown }
    ).packagingBlockers;
    const packagingBlockers = Array.isArray(packagingBlockersRaw)
      ? packagingBlockersRaw.map((x) => String(x))
      : undefined;
    const goPolicyReviewStatus = String(
      (slotInventoryRefreshRaw as { goPolicyReviewStatus?: unknown })
        .goPolicyReviewStatus,
    );
    const goPolicyRiskLevel = String(
      (slotInventoryRefreshRaw as { goPolicyRiskLevel?: unknown })
        .goPolicyRiskLevel,
    );
    const goPolicyBlockersRaw = (
      slotInventoryRefreshRaw as { goPolicyBlockers?: unknown }
    ).goPolicyBlockers;
    const goPolicyBlockers = Array.isArray(goPolicyBlockersRaw)
      ? goPolicyBlockersRaw.map((x) => String(x))
      : undefined;
    const humanGoApprovalRequiredRaw = (
      slotInventoryRefreshRaw as { humanGoApprovalRequired?: unknown }
    ).humanGoApprovalRequired;
    const executionStillDisabledRaw = (
      slotInventoryRefreshRaw as { executionStillDisabled?: unknown }
    ).executionStillDisabled;
    if (
      !["refreshed", "wsl_executable_missing"].includes(
        String(
          (
            slotInventoryRefreshRaw as {
              distroDiscoveryStatus?: unknown;
            }
          ).distroDiscoveryStatus,
        ),
      ) ||
      selectableSlots.some((slot) => !/^slot-\d{2,}$/.test(slot)) ||
      !/^slot-\d{2,}$/.test(previousSelectedSlot) ||
      !(
        selectedSlotForRefresh === "none" ||
        selectedSlotForRefresh === "unresolved" ||
        /^slot-\d{2,}$/.test(selectedSlotForRefresh)
      ) ||
      !["distro_not_in_current_wsl_list", "distro_name_mismatch"].includes(
        String(
          (slotInventoryRefreshRaw as { previousFailureReason?: unknown })
            .previousFailureReason,
        ),
      ) ||
      ![
        "select_slot_id",
        "verify_selected_slot_availability_locally",
        "refresh_or_validate_slot_inventory_consistency",
        "choose_matched_slot_id",
        "refresh_slot_map_or_rebuild_inventory",
        "run_redacted_inventory_diagnostic",
        "resolve_slot_map_distro_mismatch",
        "update_local_only_slot_map_or_hold",
        "resolve_packaging_safety_gate",
        "review_non_execution_readiness_before_go_policy",
        "address_packaging_blockers",
        "human_review_go_policy_prerequisites",
      ].includes(nextRequiredSlotAction) ||
      !(selectedSlotStatus === undefined || selectedSlotStatus === "matched") ||
      !(
        previousSelectedSlotStatus === undefined ||
        previousSelectedSlotStatus === "mismatch"
      ) ||
      !(
        selectedAvailability === undefined || selectedAvailability === "failed"
      ) ||
      !(
        selectedFailureReason === undefined ||
        selectedFailureReason === "distro_not_in_current_wsl_list"
      ) ||
      !["pending", "matched", "mismatched", "unknown", "undefined"].includes(
        inventoryConsistency,
      ) ||
      !["matched", "mismatched", "unknown", "undefined"].includes(
        inventoryCountConsistency,
      ) ||
      !["matched", "mismatched", "partial", "unknown", "undefined"].includes(
        inventoryContentConsistency,
      ) ||
      (slotStatuses !== undefined &&
        slotStatuses.some(
          (slot) =>
            !/^slot-\d{2,}$/.test(slot.slotId) ||
            !["matched", "mismatch", "unknown"].includes(slot.status),
        )) ||
      !["ready", "not_ready", "undefined"].includes(exactMatchReadiness) ||
      ![
        "single_match",
        "no_match",
        "duplicate_match",
        "not_comparable",
        "undefined",
      ].includes(exactMatchResult) ||
      ![
        "unresolved",
        "blocked",
        "ready_for_review",
        "resolved_without_execution",
        "undefined",
      ].includes(packagingGateStatus) ||
      !["low", "medium", "high", "unknown", "undefined"].includes(
        packagingRiskLevel,
      ) ||
      (packagingBlockers !== undefined &&
        packagingBlockers.some(
          (blocker) =>
            ![
              "packaged_short_launch_smoke_not_run",
              "pending_packaging_resolution_true",
              "execution_forbidden",
              "non_execution_review_required",
            ].includes(blocker),
        )) ||
      ![
        "not_started",
        "in_review",
        "blocked",
        "ready_for_human_go_review",
        "undefined",
      ].includes(goPolicyReviewStatus) ||
      !["low", "medium", "high", "unknown", "undefined"].includes(
        goPolicyRiskLevel,
      ) ||
      (goPolicyBlockers !== undefined &&
        goPolicyBlockers.some(
          (b) =>
            ![
              "execution_still_disabled",
              "non_execution_readiness_review_required",
              "human_go_review_required",
              "packaging_gate_not_resolved",
              "production_ready_gate_not_met",
            ].includes(b),
        )) ||
      !(
        humanGoApprovalRequiredRaw === undefined ||
        humanGoApprovalRequiredRaw === true
      ) ||
      !(
        executionStillDisabledRaw === undefined ||
        executionStillDisabledRaw === true
      ) ||
      !(
        matchedSlotId === "undefined" ||
        matchedSlotId === "none" ||
        /^slot-\d{2,}$/.test(matchedSlotId)
      ) ||
      (slotInventoryRefreshRaw as { rawValuesReported?: unknown })
        .rawValuesReported !== false ||
      (slotInventoryRefreshRaw as { execution?: unknown }).execution !==
        "disabled" ||
      !(
        (slotInventoryRefreshRaw as { canRunWrapper?: unknown })
          .canRunWrapper === undefined ||
        (slotInventoryRefreshRaw as { canRunWrapper?: unknown })
          .canRunWrapper === false
      )
    ) {
      return { ok: false, errorCode: "unsafe_wsl2_slot_inventory_refresh" };
    }
    const hasSplitInventoryConsistency =
      inventoryCountConsistency !== "undefined" ||
      inventoryContentConsistency !== "undefined";
    slotInventoryRefreshSummary = {
      distroDiscoveryStatus: String(
        (
          slotInventoryRefreshRaw as {
            distroDiscoveryStatus?: unknown;
          }
        ).distroDiscoveryStatus,
      ) as "refreshed" | "wsl_executable_missing",
      distroCount: Number(
        (slotInventoryRefreshRaw as { distroCount?: unknown }).distroCount,
      ),
      selectableSlots,
      selectedSlot: selectedSlotForRefresh as string | "none" | "unresolved",
      ...(selectedSlotStatus === "matched"
        ? { selectedSlotStatus: "matched" as const }
        : {}),
      ...(selectedAvailability === "failed"
        ? { selectedAvailability: "failed" as const }
        : {}),
      ...(selectedFailureReason === "distro_not_in_current_wsl_list"
        ? { selectedFailureReason: "distro_not_in_current_wsl_list" as const }
        : {}),
      previousSelectedSlot,
      ...(previousSelectedSlotStatus === "mismatch"
        ? { previousSelectedSlotStatus: "mismatch" as const }
        : {}),
      previousFailureReason: String(
        (slotInventoryRefreshRaw as { previousFailureReason?: unknown })
          .previousFailureReason,
      ) as "distro_not_in_current_wsl_list" | "distro_name_mismatch",
      ...(inventoryConsistency !== "undefined" && !hasSplitInventoryConsistency
        ? {
            inventoryConsistency: inventoryConsistency as
              | "pending"
              | "matched"
              | "mismatched"
              | "unknown",
          }
        : {}),
      ...(inventoryCountConsistency !== "undefined"
        ? {
            inventoryCountConsistency: inventoryCountConsistency as
              | "matched"
              | "mismatched"
              | "unknown",
          }
        : {}),
      ...(inventoryContentConsistency !== "undefined"
        ? {
            inventoryContentConsistency: inventoryContentConsistency as
              | "matched"
              | "mismatched"
              | "partial"
              | "unknown",
          }
        : {}),
      ...(slotStatuses
        ? {
            slotStatuses: slotStatuses as {
              readonly slotId: string;
              readonly status: "matched" | "mismatch" | "unknown";
            }[],
          }
        : {}),
      ...(typeof (slotInventoryRefreshRaw as { slotMapCount?: unknown })
        .slotMapCount === "number"
        ? {
            slotMapCount: (slotInventoryRefreshRaw as { slotMapCount: number })
              .slotMapCount,
          }
        : {}),
      ...(typeof (
        slotInventoryRefreshRaw as { currentInventoryCount?: unknown }
      ).currentInventoryCount === "number"
        ? {
            currentInventoryCount: (
              slotInventoryRefreshRaw as { currentInventoryCount: number }
            ).currentInventoryCount,
          }
        : {}),
      ...(exactMatchReadiness !== "undefined"
        ? { exactMatchReadiness: exactMatchReadiness as "ready" | "not_ready" }
        : {}),
      ...(exactMatchResult !== "undefined"
        ? {
            exactMatchResult: exactMatchResult as
              | "single_match"
              | "no_match"
              | "duplicate_match"
              | "not_comparable",
          }
        : {}),
      ...(matchedSlotId !== "undefined"
        ? { matchedSlotId: matchedSlotId as string | "none" }
        : {}),
      ...(typeof (slotInventoryRefreshRaw as { matchCount?: unknown })
        .matchCount === "number"
        ? {
            matchCount: (slotInventoryRefreshRaw as { matchCount: number })
              .matchCount,
          }
        : {}),
      ...(packagingGateStatus !== "undefined"
        ? {
            packagingGateStatus: packagingGateStatus as
              | "unresolved"
              | "blocked"
              | "ready_for_review"
              | "resolved_without_execution",
          }
        : {}),
      ...(packagingRiskLevel !== "undefined"
        ? {
            packagingRiskLevel: packagingRiskLevel as
              | "low"
              | "medium"
              | "high"
              | "unknown",
          }
        : {}),
      ...(packagingBlockers ? { packagingBlockers } : {}),
      ...(goPolicyReviewStatus !== "undefined"
        ? {
            goPolicyReviewStatus: goPolicyReviewStatus as
              | "not_started"
              | "in_review"
              | "blocked"
              | "ready_for_human_go_review",
          }
        : {}),
      ...(goPolicyRiskLevel !== "undefined"
        ? {
            goPolicyRiskLevel: goPolicyRiskLevel as
              | "low"
              | "medium"
              | "high"
              | "unknown",
          }
        : {}),
      ...(goPolicyBlockers ? { goPolicyBlockers } : {}),
      ...(humanGoApprovalRequiredRaw === true
        ? { humanGoApprovalRequired: true as const }
        : {}),
      ...(executionStillDisabledRaw === true
        ? { executionStillDisabled: true as const }
        : {}),
      decision: "HOLD",
      nextRequiredHumanAction: nextRequiredSlotAction as
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
        | "human_review_go_policy_prerequisites",
      rawValuesReported: false,
      execution: "disabled",
      canRunWrapper: false,
    };
  }

  const str = (v: unknown, fallback: string): string =>
    typeof v === "string" ? v : fallback;

  const snapshot: ControlCenterShellSnapshot = {
    appStatus: data.appStatus,
    generatedAtUnixMs: data.generatedAtUnixMs,
    productionReady: false,
    bridgeReadinessLabel: str(data.bridgeReadinessLabel, ""),
    scenarioSuiteLabel: str(data.scenarioSuiteLabel, ""),
    controlledPilotPreflightStatus: str(
      data.controlledPilotPreflightStatus,
      "",
    ),
    controlledPilotCanRunOnceMeta: data.controlledPilotCanRunOnceMeta === true,
    realHermesProcessStatus: str(data.realHermesProcessStatus, ""),
    wsl2WrapperStatusLine: str(data.wsl2WrapperStatusLine, ""),
    wsl2WrapperParameterSummary: {
      parameterStatus: sts,
      pendingFieldCount: pfc,
      confirmedFieldCount: cfc,
      rejectedFieldCount: rfc,
      nextRequiredUserAction: nextAc.slice(0, 320),
      pendingReasonBrief: prb.slice(0, 240),
      canRunWsl: false,
      canRunBridgeOnceViaWsl: false,
      productionReady: false,
    },
    wsl2HumanValueStatusLine: str(data.wsl2HumanValueStatusLine, ""),
    wsl2HumanValuePacketSummary: {
      humanValuePacketStatus: hvSts,
      pendingFieldCount: hvP,
      rejectedFieldCount: hvR,
      nextRequiredUserAction: hvNext.slice(0, 320),
      sysnativePolicy: snPol,
      canRunWsl: false,
      canRunBridgeOnceViaWsl: false,
      productionReady: false,
    },
    wsl2LocalValueValidationStatusLine: str(
      data.wsl2LocalValueValidationStatusLine,
      "",
    ),
    wsl2LocalValueValidationSummary: {
      decision: lvDecision as "go" | "hold" | "reject",
      validationStatus: lvStatus.slice(0, 120),
      localValueFileExists:
        (lv as { localValueFileExists?: unknown }).localValueFileExists ===
        true,
      presentFieldCount: lvPresent,
      missingFieldCount: lvMissing,
      placeholderFieldCount: lvPlaceholder,
      rejectedFieldCount: lvRejected,
      nextRequiredAction: lvNext.slice(0, 320),
      safeForSignoff:
        (lv as { safeForSignoff?: unknown }).safeForSignoff === true,
      system32ExactMatchConfirmed:
        (lv as { system32ExactMatchConfirmed?: unknown })
          .system32ExactMatchConfirmed === true,
      sysnativeRejectedV1:
        (lv as { sysnativeRejectedV1?: unknown }).sysnativeRejectedV1 === true,
      wrapperPathPolicyPassed: lvWrapperPolicy as boolean | "unknown",
      ...(selectedDistroAvailabilitySummary
        ? { selectedDistroAvailabilitySummary }
        : {}),
      ...(slotInventoryRefreshSummary ? { slotInventoryRefreshSummary } : {}),
      canRunWsl: false,
      canRunHermes: false,
      canRunOnce: false,
      productionReady: false,
    },
    blockersCount:
      typeof data.blockersCount === "number" ? data.blockersCount : 0,
    warningsCount:
      typeof data.warningsCount === "number" ? data.warningsCount : 0,
    nextRecommendedGoal: str(data.nextRecommendedGoal, ""),
    rooms: {
      generatedAtUnixMs:
        typeof rooms.generatedAtUnixMs === "number"
          ? rooms.generatedAtUnixMs
          : data.generatedAtUnixMs,
      rooms: rooms.rooms.filter(okRoomCard) as ControlCenterShellRoomCard[],
    },
    agentTeamSummary: {
      schedulerEnabled: at.schedulerEnabled,
      blockerCountApprox:
        typeof at.blockerCountApprox === "number" ? at.blockerCountApprox : 0,
      warningCountApprox:
        typeof at.warningCountApprox === "number" ? at.warningCountApprox : 0,
      agents: agents.map((a) => ({
        id: String((a as { id: string }).id),
        labelJa: String((a as { labelJa: string }).labelJa),
        autoRun: false as const,
        autoApprove: false as const,
      })),
    },
    visualizationModel: {
      footerNote: str(viz.footerNote, ""),
      nodeCount: nodes.length,
    },
    approvalAuditSummary: {
      approvalQueueApproxCount:
        typeof ap.approvalQueueApproxCount === "number" ||
        ap.approvalQueueApproxCount === null
          ? (ap.approvalQueueApproxCount as number | null)
          : null,
      auditApproxCount:
        typeof ap.auditApproxCount === "number" || ap.auditApproxCount === null
          ? (ap.auditApproxCount as number | null)
          : null,
      latestShortStatusHints: [...ap.latestShortStatusHints]
        .map((x) => String(x))
        .slice(0, 24),
    },
    memorySummary: {
      candidateApproxCount:
        typeof mem.candidateApproxCount === "number"
          ? mem.candidateApproxCount
          : 0,
      safeSummaryLines: [...mem.safeSummaryLines]
        .map((x) => String(x))
        .slice(0, 24),
    },
    warnings: warningsRaw as ControlCenterShellBlockedItem[],
    blockers: blockersRaw as ControlCenterShellBlockedItem[],
    pathResolutionRuntimeMode:
      data.pathResolutionRuntimeMode as ControlCenterShellPathRuntimeMode,
    snapshotSourceLabel:
      data.snapshotSourceLabel as ControlCenterShellSnapshotSourceLabel,
    pathResolutionStatus:
      data.pathResolutionStatus as ControlCenterShellPathResolutionStatus,
    pendingPackagingResolution: data.pendingPackagingResolution === true,
    pathResolutionSafeSummaryLines: pathResLinesClean,
  };

  return { ok: true, snapshot };
}
