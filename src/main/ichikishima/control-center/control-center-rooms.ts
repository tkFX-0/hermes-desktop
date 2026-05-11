/**
 * Control Center V1 — **read-only Room モデル**（実行口なし・actions はすべて disabled）。
 */
import type { ControlCenterReadonlyData } from "./control-center-data-provider";
import type { HermesControlledPilotDashboardSummary } from "../hermes/hermes-controlled-pilot-summary";

/** 論理Room ID（静的 Shell／将来 UI のタブ単位）。 */
export type ControlCenterRoomId =
  | "hermes_room"
  | "ichikishima_room"
  | "approval_room"
  | "audit_room"
  | "memory_room"
  | "controlled_pilot_room"
  | "visualization_room"
  | "system_room";

export type ControlCenterRoomRiskLevel = "low" | "medium" | "high" | "unknown";

export type ControlCenterRoomActionState = "disabled";

/** ユーザー操作。**V1 は state=disabled のみ**。 */
export interface ControlCenterRoomAction {
  readonly id: string;
  readonly label: string;
  readonly state: ControlCenterRoomActionState;
  /** 必須（read-only の理由短文） */
  readonly disabledReason: string;
}

export interface ControlCenterRoomCard {
  readonly id: ControlCenterRoomId;
  readonly title: string;
  readonly statusLine: string;
  readonly riskLevel: ControlCenterRoomRiskLevel;
  readonly actions: readonly ControlCenterRoomAction[];
}

export interface ControlCenterRoomsSnapshot {
  readonly generatedAtUnixMs: number;
  readonly rooms: readonly ControlCenterRoomCard[];
}

function disabledReasonTemplate(scope: string): string {
  return `read_only_foundation:no_execution:${scope}`;
}

function mkAction(
  id: string,
  label: string,
  scope: string,
): ControlCenterRoomAction {
  return {
    id,
    label,
    state: "disabled",
    disabledReason: disabledReasonTemplate(scope),
  };
}

function riskFromPilot(
  cp: HermesControlledPilotDashboardSummary,
): ControlCenterRoomRiskLevel {
  if (cp.controlledPilotPreflightStatus === "GO_READY") return "medium";
  return "low";
}

export function buildHermesRoomCard(
  bundle: Pick<
    ControlCenterReadonlyData,
    "readiness" | "canExecuteDangerousActions"
  >,
): ControlCenterRoomCard {
  const label = bundle.readiness.hermesBridgePilot.label;
  const runLine = `${label}; real_hermes=not_running; bridge_dry_run_only`;
  return {
    id: "hermes_room",
    title: "Hermes Room",
    statusLine: runLine.slice(0, 220),
    riskLevel: bundle.readiness.hermesBridgePilot.ready ? "low" : "medium",
    actions: [
      mkAction(
        "startHermesBridgePilot",
        "Bridge Pilot を起動する",
        "hermes_not_wired_execution_forbidden",
      ),
      mkAction(
        "startRealHermes",
        "実 Hermes プロセスを起動する",
        "real_hermes_forbidden_until_separate_goal",
      ),
      mkAction(
        "runWslWrapper",
        "WSL wrapper を実行する",
        "wsl_wrapper_design_pending_execution_forbidden",
      ),
    ],
  };
}

export function buildIchikishimaRoomCard(
  snapshot: Pick<
    ControlCenterReadonlyData,
    "readiness" | "requiresUserApproval"
  >,
): ControlCenterRoomCard {
  const cards = snapshot.readiness.ichikishimaCards.join(", ").slice(0, 220);
  return {
    id: "ichikishima_room",
    title: "Ichikishima Room",
    statusLine: `${cards.slice(0, 180)}; auto_speak:forbidden(shadow)`.slice(
      0,
      220,
    ),
    riskLevel: "low",
    actions: [
      mkAction(
        "toggleShadowModeUnsafe",
        "Shadow Mode を開発者のみ解除する",
        "ichikishima_manual_only_via_dev_tools_forbidden_here",
      ),
      mkAction(
        "approveReviewAutomatically",
        "Review を自動承認する",
        "review_always_user_decision_execution_forbidden",
      ),
    ],
  };
}

export function buildApprovalRoomCard(
  data: Pick<ControlCenterReadonlyData, "approvalQueueSummary">,
): ControlCenterRoomCard {
  const ap = data.approvalQueueSummary;
  const unavailable =
    typeof ap === "object" &&
    ap !== null &&
    "unavailable" in ap &&
    ap.unavailable;
  const line = unavailable
    ? `approval_queue:${String((ap as { reason?: string }).reason ?? "").slice(0, 120)}`
    : `approval_total:${String((ap as { total?: number }).total ?? 0)}`;

  return {
    id: "approval_room",
    title: "Approval Room",
    statusLine: line.slice(0, 220),
    riskLevel: unavailable
      ? "medium"
      : ((ap as { highRisk?: number }).highRisk ?? 0) > 0
        ? "medium"
        : "low",
    actions: [
      mkAction(
        "executeApprovedQueueHead",
        "承認済みキューを実行する",
        "approval_execution_engine_not_present_execution_forbidden",
      ),
      mkAction(
        "mutateApprovalState",
        "承認状態を API 経由で書き換える",
        "write_path_not_exposed_ipc_forbidden",
      ),
    ],
  };
}

export function buildAuditRoomCard(
  data: Pick<ControlCenterReadonlyData, "auditLogSummary">,
): ControlCenterRoomCard {
  const au = data.auditLogSummary;
  const unavailable =
    typeof au === "object" &&
    au !== null &&
    "unavailable" in au &&
    au.unavailable;
  const line = unavailable
    ? `audit:${String((au as { reason?: string }).reason ?? "").slice(0, 120)}`
    : `audit_lines_approx:${String((au as { total?: number }).total ?? 0)}`;

  return {
    id: "audit_room",
    title: "Audit Room",
    statusLine: line.slice(0, 220),
    riskLevel: unavailable
      ? "medium"
      : ((au as { highRiskEvents?: number }).highRiskEvents ?? 0) > 0
        ? "medium"
        : "low",
    actions: [
      mkAction(
        "exportAuditFullText",
        "監査ログ全文をエクスポートする",
        "raw_audit_dump_forbidden_ui_read_only",
      ),
    ],
  };
}

/** Memory は件数のみ。本文・DB 更新は出さない。 */
export function buildMemoryRoomCard(
  memoryCandidateApproxCount: number | null,
): ControlCenterRoomCard {
  const line =
    memoryCandidateApproxCount === null
      ? "memory_candidates:not_tracked_in_readonly_foundation"
      : `memory_candidate_approx:${memoryCandidateApproxCount}`;
  return {
    id: "memory_room",
    title: "Memory Room",
    statusLine: line.slice(0, 220),
    riskLevel: "low",
    actions: [
      mkAction(
        "persistMemoryCandidate",
        "Memory 候補を DB に保存する",
        "memory_persistence_forbidden_until_separate_goal",
      ),
    ],
  };
}

export function buildControlledPilotRoomCard(
  cp: HermesControlledPilotDashboardSummary,
): ControlCenterRoomCard {
  const line = [
    `preflight:${cp.controlledPilotPreflightStatus}`,
    `canRunOnce_meta:${cp.canRunOnce}`,
    `argv_pattern:${cp.argvPatternLabel.slice(0, 120)}`,
  ].join(" · ");

  return {
    id: "controlled_pilot_room",
    title: "Controlled Pilot",
    statusLine: line.slice(0, 220),
    riskLevel: riskFromPilot(cp),
    actions: [
      mkAction(
        "runControlledPilotOnce",
        "Controlled Pilot 実機 1 回を実行する",
        "pilot_values_not_confirmed_execfile_forbidden",
      ),
      mkAction(
        "runWslForPilot",
        "WSL を起動して pilot を実行する",
        "wsl_exec_forbidden_separate_goal",
      ),
    ],
  };
}

export function buildVisualizationRoomCard(): ControlCenterRoomCard {
  return {
    id: "visualization_room",
    title: "Visualization Room",
    statusLine:
      "agent_visualization:design_pending; topology:not_attached_execution_forbidden",
    riskLevel: "unknown",
    actions: [
      mkAction(
        "openAmbient3d",
        "3D 可視化を開く",
        "visualization_assets_not_shipped_execution_forbidden",
      ),
    ],
  };
}

export function buildSystemRoomCard(): ControlCenterRoomCard {
  return {
    id: "system_room",
    title: "System Room",
    statusLine:
      "electron_ipc_wiring:foundation_only; productionReady:false; cursor_composer_codex:dev_only",
    riskLevel: "medium",
    actions: [
      mkAction(
        "enableProductionMode",
        "本番 READY に切り替える",
        "production_flag_forbidden_read_only_phase",
      ),
      mkAction(
        "openDangerousDeveloperPanel",
        "開発者用の危険パネルを開く",
        "not_shipped_execution_forbidden",
      ),
    ],
  };
}

export function buildControlCenterRoomsSnapshot(params: {
  readonly data: ControlCenterReadonlyData;
  readonly controlledPilotDashboard: HermesControlledPilotDashboardSummary;
  readonly memoryCandidateApproxCount: number | null;
  readonly nowUnixMs?: number;
}): ControlCenterRoomsSnapshot {
  const ts = params.nowUnixMs ?? Date.now();
  return {
    generatedAtUnixMs: ts,
    rooms: [
      buildHermesRoomCard(params.data),
      buildIchikishimaRoomCard(params.data),
      buildApprovalRoomCard(params.data),
      buildAuditRoomCard(params.data),
      buildMemoryRoomCard(params.memoryCandidateApproxCount),
      buildControlledPilotRoomCard(params.controlledPilotDashboard),
      buildVisualizationRoomCard(),
      buildSystemRoomCard(),
    ],
  };
}
