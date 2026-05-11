/**
 * Control Center V1 — **App Management 向け read-only 統合 Snapshot**（単一取得用）。
 * payload 全文・API 名配列・stdio・secrets・Executable 絶対パス過剰露出は含めない。
 */
import { HERMES_BRIDGE_PILOT_NEXT_DRY_RUN_SCENARIOS_LABEL } from "../hermes/hermes-bridge-pilot-dry-run";
import type { HermesBridgePilotReadiness } from "../hermes/hermes-bridge-readiness";
import { buildHermesControlledPilotDashboardSummary } from "../hermes/hermes-controlled-pilot-summary";
import type { HermesWsl2WrapperParameterRegistry } from "../hermes/hermes-wsl2-wrapper-parameter-registry";
import type {
  HermesWsl2WrapperHumanValuePacket,
  HermesWsl2WrapperHumanValuePacketSafeSummary,
} from "../hermes/hermes-wsl2-wrapper-human-value-packet";
import {
  createEmptyHermesWsl2WrapperHumanValuePacket,
  summarizeHermesWsl2WrapperHumanValuePacket,
} from "../hermes/hermes-wsl2-wrapper-human-value-packet";
import {
  createEmptyHermesWsl2WrapperLocalValueValidationReport,
  createHermesWsl2WrapperRedactedValidationReport,
  type HermesWsl2WrapperLocalValueValidationReport,
} from "../hermes/hermes-wsl2-wrapper-local-value-validator";
import {
  createEmptyHermesWsl2WrapperParameterRegistry,
  summarizeHermesWsl2WrapperParameterRegistry,
  type HermesWsl2WrapperSafeSummary,
} from "../hermes/hermes-wsl2-wrapper-parameter-registry";
import {
  buildAgentTeamFoundationReadonlySummary,
  type AgentTeamFoundationReadonlySummary,
} from "../agent-team/agent-supervisor";
import {
  buildVisualizationV1ReadonlyModel,
  type VisualizationV1ReadonlyModel,
} from "../visualization/visualization-v1-model";
import {
  buildControlCenterApprovalAuditReadonlySummary,
  type ControlCenterApprovalAuditReadonlySummary,
} from "./control-center-approval-audit-summary";
import {
  buildControlCenterMemoryReadonlySummary,
  type ControlCenterMemoryReadonlySummary,
} from "./control-center-memory-summary";
import {
  buildControlCenterRoomsSnapshot,
  type ControlCenterRoomsSnapshot,
} from "./control-center-rooms";
import type { ControlCenterDataProviderParams } from "./control-center-data-provider";
import { getControlCenterReadonlyData } from "./control-center-data-provider";
import {
  derivePathResolutionFallback,
  evaluateZoneRelativeToProject,
  resolveControlCenterZoneRoot,
  type ControlCenterPathResolutionRendererSafe,
  type ControlCenterPathResolutionStatus,
  type ControlCenterRuntimeMode,
  type ControlCenterSnapshotSourceLabel,
} from "./control-center-project-root-resolution";

export type ControlCenterAppSnapshotStatus = "readonly_foundation_active";

export type ControlCenterAppSnapshotSource =
  "getControlCenterReadonlyData_aggregate";

export interface ControlCenterAppSnapshotWarning {
  readonly code: string;
  readonly message: string;
}

export interface ControlCenterAppSnapshotBlocker {
  readonly code: string;
  readonly message: string;
}

/** Hermes Bridge メタ。**allowedApis/forbiddenApis の列挙は載せない**。 */
export interface ControlCenterHermesBridgeReadinessSafe {
  readonly ready: boolean;
  readonly label: string;
  readonly blockersCount: number;
  readonly requiredHumanReviewsCount: number;
  readonly allowedApisCount: number;
  readonly forbiddenApisCount: number;
}

export interface ControlCenterReadonlyDataSafe {
  readonly statusCards: readonly string[];
  readonly approvalQueueSummary: unknown;
  readonly auditLogSummary: unknown;
  readonly latestReports: unknown;
  readonly nextGoals: readonly { ordinal: number; title: string }[];
  readonly riskSummary: readonly string[];
  readonly disabledActions: readonly string[];
  readonly requiresUserApproval: true;
  readonly canExecuteDangerousActions: false;
  readonly readinessCards: readonly string[];
  readonly localFullLoopReady: boolean;
  readonly controlCenterDesignReady: boolean;
  readonly hermesBridgePilot: ControlCenterHermesBridgeReadinessSafe;
  readonly statusNotes: readonly string[];
}

export type ControlCenterWsl2LocalValueValidationSummarySafe = Omit<
  HermesWsl2WrapperLocalValueValidationReport,
  "redactedSummaryLines"
>;

export interface ControlCenterAppSnapshot {
  readonly appStatus: ControlCenterAppSnapshotStatus;
  readonly productionReady: false;
  readonly generatedAtUnixMs: number;
  readonly source: ControlCenterAppSnapshotSource;
  /** 集約 rooms（actions すべて disabled）。 */
  readonly rooms: ControlCenterRoomsSnapshot;
  /** getSnapshot 相当から **安全化**した基底。 */
  readonly baselineReadonly: ControlCenterReadonlyDataSafe;
  readonly bridgeReadinessLabel: string;
  readonly scenarioSuiteLabel: string;
  readonly controlledPilotCodeStatus: string;
  readonly controlledPilotPreflightStatus: string;
  readonly controlledPilotCanRunOnceMeta: boolean;
  readonly realHermesProcessStatus: "not_running_not_production_ready";
  /** 短文 1 行 — WSL2 registry 要約由来（絶対パスなし） */
  readonly wsl2WrapperStatusLine: string;
  readonly wsl2WrapperParameterSummary: HermesWsl2WrapperSafeSummary;
  /** 人手 WSL 値パケット要約（**テンプレ未記入はすべて pending**）。raw path / argv なし。 */
  readonly wsl2HumanValuePacketSummary: HermesWsl2WrapperHumanValuePacketSafeSummary;
  /** 短文 1 行 — Human value packet */
  readonly wsl2HumanValueStatusLine: string;
  /** local-only JSON validator 要約（raw values / raw JSON / argv なし）。 */
  readonly wsl2LocalValueValidationSummary: ControlCenterWsl2LocalValueValidationSummarySafe;
  /** 短文 1 行 — local-only JSON validator */
  readonly wsl2LocalValueValidationStatusLine: string;
  readonly approvalQueueApproxCount: number | null;
  readonly auditApproxCount: number | null;
  /** Memory room 表示用の近似件数（本文・DB には接続しない）。 */
  readonly memoryCandidateApproxCount: number | null;
  /** Approval / Audit の短文ラベルのみ（キュー JSONL 本文・payload 無し）。 */
  readonly approvalAuditSummary: ControlCenterApprovalAuditReadonlySummary;
  /** Memory Candidate のカウント・短文のみ（profile 本文無し）。 */
  readonly memorySummary: ControlCenterMemoryReadonlySummary;
  /** Agent Team foundation — dry-run のみ・scheduler OFF。 */
  readonly agentTeamSummary: AgentTeamFoundationReadonlySummary;
  /** 可視化メタ（座標・生ログ無し）。 */
  readonly visualizationModel: VisualizationV1ReadonlyModel;
  readonly latestSafeSummaryLines: readonly string[];
  readonly blockersCount: number;
  readonly warningsCount: number;
  readonly nextRecommendedGoal: string;
  readonly warnings: readonly ControlCenterAppSnapshotWarning[];
  readonly blockers: readonly ControlCenterAppSnapshotBlocker[];

  readonly pathResolutionRuntimeMode: ControlCenterRuntimeMode;
  readonly snapshotSourceLabel: ControlCenterSnapshotSourceLabel;
  readonly pathResolutionStatus: ControlCenterPathResolutionStatus;
  readonly pendingPackagingResolution: boolean;
  /** Renderer への短文（絶対パスなし）。 */
  readonly pathResolutionSafeSummaryLines: readonly string[];
}

export function sanitizeHermesBridgeReadiness(
  r: HermesBridgePilotReadiness,
): ControlCenterHermesBridgeReadinessSafe {
  return {
    ready: r.ready,
    label: r.label,
    blockersCount: r.blockers.length,
    requiredHumanReviewsCount: r.requiredHumanReviews.length,
    allowedApisCount: r.allowedApis.length,
    forbiddenApisCount: r.forbiddenApis.length,
  };
}

export function sanitizeControlCenterReadonlyDataAggregate(
  bundle: ReturnType<typeof getControlCenterReadonlyData>,
): ControlCenterReadonlyDataSafe {
  const r = bundle.readiness;
  return {
    statusCards: [...bundle.statusCards],
    approvalQueueSummary: bundle.approvalQueueSummary,
    auditLogSummary: bundle.auditLogSummary,
    latestReports: bundle.latestReports,
    nextGoals: bundle.nextGoals.map((g) => ({
      ordinal: g.ordinal,
      title: g.title,
    })),
    riskSummary: [...bundle.riskSummary],
    disabledActions: [...bundle.disabledActions],
    requiresUserApproval: true,
    canExecuteDangerousActions: false,
    readinessCards: [...r.ichikishimaCards],
    localFullLoopReady: r.localFullLoopReady,
    controlCenterDesignReady: r.controlCenterDesignReady,
    hermesBridgePilot: sanitizeHermesBridgeReadiness(r.hermesBridgePilot),
    statusNotes: [...r.statusNotes],
  };
}

export function sanitizeWsl2LocalValueValidationSummaryForAppSnapshot(
  report: HermesWsl2WrapperLocalValueValidationReport,
): ControlCenterWsl2LocalValueValidationSummarySafe {
  const { redactedSummaryLines, slotInventoryRefreshSummary, ...rest } = report;
  void redactedSummaryLines;
  if (
    slotInventoryRefreshSummary?.inventoryCountConsistency ||
    slotInventoryRefreshSummary?.inventoryContentConsistency
  ) {
    const { inventoryConsistency, ...splitInventorySummary } =
      slotInventoryRefreshSummary;
    void inventoryConsistency;
    return {
      ...rest,
      slotInventoryRefreshSummary: splitInventorySummary,
    };
  }
  const safeSummary = {
    ...rest,
    ...(slotInventoryRefreshSummary ? { slotInventoryRefreshSummary } : {}),
  };
  return safeSummary;
}

/** `JSON.stringify` 後に **Hermes API 名の列挙配列**が無いことを確認。 */
export function sanitizeControlCenterAppSnapshot(
  snapshot: ControlCenterAppSnapshot,
): ControlCenterAppSnapshot {
  const wire = JSON.stringify(snapshot);
  if (
    /"allowedApis"\s*:\s*\[/.test(wire) ||
    /"forbiddenApis"\s*:\s*\[/.test(wire) ||
    /"redactedSummaryLines"\s*:\s*\[/.test(wire)
  ) {
    throw new Error(
      "snapshot_sanitizer:raw_or_unneeded_arrays_forbidden_in_app_snapshot",
    );
  }
  return snapshot;
}

export function assertAppSnapshotContainsNoApiNameArrays(
  snap: ControlCenterAppSnapshot,
): void {
  sanitizeControlCenterAppSnapshot(snap);
}

export function summarizeControlCenterAppSnapshot(
  snapshot: ControlCenterAppSnapshot,
): readonly string[] {
  return [
    `appStatus:${snapshot.appStatus}`,
    `bridge:${snapshot.bridgeReadinessLabel}`,
    `controlled_pilot_preflight:${snapshot.controlledPilotPreflightStatus}`,
    `real_hermes:${snapshot.realHermesProcessStatus}`,
    `next_goal_hint:${snapshot.nextRecommendedGoal.slice(0, 140)}`,
    `rooms:${snapshot.rooms.rooms.length}`,
    `agent_team_scheduler:${snapshot.agentTeamSummary.schedulerEnabled ? "unexpected_on" : "off"}`,
    `viz_nodes:${snapshot.visualizationModel.nodes.length}`,
    `snapshot_src:${snapshot.snapshotSourceLabel}`,
    `path_resolution:${snapshot.pathResolutionStatus}`,
    `pending_pack:${snapshot.pendingPackagingResolution}`,
    `wsl2_registry:${snapshot.wsl2WrapperParameterSummary.status}:p=${snapshot.wsl2WrapperParameterSummary.pendingFieldCount}`,
    `wsl2_human_packet:${snapshot.wsl2HumanValuePacketSummary.humanValuePacketStatus}:p=${snapshot.wsl2HumanValuePacketSummary.pendingFieldCount}:${snapshot.wsl2HumanValuePacketSummary.sysnativePolicy}`,
    `wsl2_local_value:${snapshot.wsl2LocalValueValidationSummary.decision}:${snapshot.wsl2LocalValueValidationSummary.validationStatus}:placeholder=${snapshot.wsl2LocalValueValidationSummary.placeholderFieldCount}`,
  ];
}

export function buildControlCenterAppSnapshot(
  params: ControlCenterDataProviderParams & {
    nowUnixMs?: number;
    /** 未設定は空 registry（すべて pending） */
    wsl2WrapperParameterRegistry?: HermesWsl2WrapperParameterRegistry | null;
    /** 未設定は空パケット（すべて pending） */
    wsl2HumanValuePacket?: HermesWsl2WrapperHumanValuePacket | null;
    /** 未設定は local-only file missing / HOLD として扱う。 */
    wsl2LocalValueValidationReport?: HermesWsl2WrapperLocalValueValidationReport | null;
    /** テスト・prepared 配線用。raw を snapshot に含めず redacted report へ即変換する。 */
    wsl2LocalValueValidationInput?: unknown;
  },
): ControlCenterAppSnapshot {
  let effectiveParams: ControlCenterDataProviderParams =
    params as ControlCenterDataProviderParams;

  const zoneNeedsCoercionPreData =
    !params.pathResolutionRendererSafe &&
    !evaluateZoneRelativeToProject(params.projectRoot, params.zoneRoot).ok;

  if (zoneNeedsCoercionPreData) {
    effectiveParams = {
      ...params,
      zoneRoot: resolveControlCenterZoneRoot(params.projectRoot, [
        "sandbox",
        "hermes-autonomy-zone",
      ]),
    };
  }

  const bundle = getControlCenterReadonlyData(effectiveParams);
  const ts = params.nowUnixMs ?? Date.now();

  const pilotDash = buildHermesControlledPilotDashboardSummary(
    undefined,
    undefined,
  );

  const approvalAuditSummary =
    buildControlCenterApprovalAuditReadonlySummary(bundle);
  const memorySummary = buildControlCenterMemoryReadonlySummary();
  const bp = bundle.readiness.hermesBridgePilot;
  const wslRegistry =
    params.wsl2WrapperParameterRegistry ??
    createEmptyHermesWsl2WrapperParameterRegistry();
  const wslParamSummary =
    summarizeHermesWsl2WrapperParameterRegistry(wslRegistry);
  const wslStatusLine = (
    `wsl2_registry:${wslParamSummary.status}:pending=${wslParamSummary.pendingFieldCount}` +
    `:rej=${wslParamSummary.rejectedFieldCount}`
  ).slice(0, 180);
  const hvpPacket =
    params.wsl2HumanValuePacket ??
    createEmptyHermesWsl2WrapperHumanValuePacket();
  const hvpSummary = summarizeHermesWsl2WrapperHumanValuePacket(hvpPacket);
  const hvpStatusLine = (
    `wsl2_hvp:${hvpSummary.humanValuePacketStatus}:p=${hvpSummary.pendingFieldCount}` +
    `:rej=${hvpSummary.rejectedFieldCount}`
  ).slice(0, 180);
  const localValueSummary =
    params.wsl2LocalValueValidationReport ??
    (Object.prototype.hasOwnProperty.call(
      params,
      "wsl2LocalValueValidationInput",
    )
      ? createHermesWsl2WrapperRedactedValidationReport(
          params.wsl2LocalValueValidationInput,
          { localValueFileExists: true },
        )
      : createEmptyHermesWsl2WrapperLocalValueValidationReport());
  const localValueWireSummary =
    sanitizeWsl2LocalValueValidationSummaryForAppSnapshot(localValueSummary);
  const localValueStatusLine = (
    `wsl2_local_value:${localValueWireSummary.decision}` +
    `:${localValueWireSummary.validationStatus}` +
    `:present=${localValueWireSummary.presentFieldCount}` +
    `:placeholder=${localValueWireSummary.placeholderFieldCount}` +
    `:rej=${localValueWireSummary.rejectedFieldCount}` +
    (localValueWireSummary.selectedDistroAvailabilitySummary
      ? `:selected_slot=${localValueWireSummary.selectedDistroAvailabilitySummary.selectedSlot}` +
        `:failure=${localValueWireSummary.selectedDistroAvailabilitySummary.failureCategory}`
      : "")
  ).slice(0, 220);
  const blockerApprox = bundle.riskSummary.length;
  const warnApprox = bp.blockers.length + bp.requiredHumanReviews.length;
  const agentTeamSummary = buildAgentTeamFoundationReadonlySummary(
    blockerApprox,
    warnApprox,
  );
  const visualizationModel = buildVisualizationV1ReadonlyModel({
    ...effectiveParams,
    nowUnixMs: ts,
  });

  const pathRes: ControlCenterPathResolutionRendererSafe =
    effectiveParams.pathResolutionRendererSafe ??
    derivePathResolutionFallback({
      projectRoot: effectiveParams.projectRoot,
      zoneRoot: params.zoneRoot,
      assumePackagedMode: effectiveParams.assumePackagedResolutionTest === true,
    });

  const rooms = buildControlCenterRoomsSnapshot({
    data: bundle,
    controlledPilotDashboard: pilotDash,
    memoryCandidateApproxCount: memorySummary.candidateApproxCount,
    nowUnixMs: ts,
  });

  const safeReadiness = sanitizeHermesBridgeReadiness(bp);

  const baseline = sanitizeControlCenterReadonlyDataAggregate(bundle);

  const warnings: ControlCenterAppSnapshotWarning[] = [];
  if (!bundle.readiness.localFullLoopReady) {
    warnings.push({
      code: "local_full_loop_not_ready",
      message: "sandbox full loop label not present in cards",
    });
  }
  if (pathRes.pendingPackagingResolution) {
    warnings.push({
      code: "packaged_path_resolution_pending",
      message:
        "Packaged path layout is pending verification — treat snapshot as provisional.",
    });
  }
  if (
    pathRes.pathResolutionStatus === "zone_outside_project_warning" ||
    pathRes.pathResolutionStatus === "dev_repo_layout_marker_missing"
  ) {
    warnings.push({
      code: "path_resolution_clarity",
      message: `pathResolutionStatus=${pathRes.pathResolutionStatus}`,
    });
  }

  const blockersList: ControlCenterAppSnapshotBlocker[] =
    safeReadiness.blockersCount > 0
      ? bp.blockers.slice(0, 8).map((m) => ({
          code: "hermes_bridge_gate",
          message: m.slice(0, 200),
        }))
      : [];

  const approvalN = approvalAuditSummary.approvalQueueApproxCount;
  const auditN = approvalAuditSummary.auditApproxCount;

  const goal0 = bundle.nextGoals[0];

  return sanitizeControlCenterAppSnapshot({
    appStatus: "readonly_foundation_active",
    productionReady: false,
    generatedAtUnixMs: ts,
    source: "getControlCenterReadonlyData_aggregate",
    rooms,
    baselineReadonly: baseline,
    bridgeReadinessLabel: bp.label,
    scenarioSuiteLabel: HERMES_BRIDGE_PILOT_NEXT_DRY_RUN_SCENARIOS_LABEL,
    controlledPilotCodeStatus: pilotDash.controlledPilotCodeStatus,
    controlledPilotPreflightStatus: pilotDash.controlledPilotPreflightStatus,
    controlledPilotCanRunOnceMeta: pilotDash.canRunOnce,
    realHermesProcessStatus: "not_running_not_production_ready",
    wsl2WrapperStatusLine: wslStatusLine,
    wsl2WrapperParameterSummary: wslParamSummary,
    wsl2HumanValuePacketSummary: hvpSummary,
    wsl2HumanValueStatusLine: hvpStatusLine,
    wsl2LocalValueValidationSummary: localValueWireSummary,
    wsl2LocalValueValidationStatusLine: localValueStatusLine,
    approvalQueueApproxCount: approvalN,
    auditApproxCount: auditN,
    memoryCandidateApproxCount: memorySummary.candidateApproxCount,
    approvalAuditSummary,
    memorySummary,
    agentTeamSummary,
    visualizationModel,
    latestSafeSummaryLines: approvalAuditSummary.latestSafeSummaryLines.slice(
      0,
      12,
    ),
    blockersCount: blockersList.length,
    warningsCount: warnings.length,
    nextRecommendedGoal: goal0
      ? `[${goal0.ordinal}] ${goal0.title}`.slice(0, 280)
      : "see_docs:ichikishima/NEXT_GOALS.md",
    warnings,
    blockers: blockersList,
    pathResolutionRuntimeMode: pathRes.runtimeMode,
    snapshotSourceLabel: pathRes.snapshotSourceLabel,
    pathResolutionStatus: pathRes.pathResolutionStatus,
    pendingPackagingResolution: pathRes.pendingPackagingResolution,
    pathResolutionSafeSummaryLines: [...pathRes.safeSummaryLines],
  });
}
