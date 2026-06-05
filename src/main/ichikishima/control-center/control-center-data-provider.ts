import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { readApprovalQueueItems } from "../approval/approval-queue-store";
import type { ApprovalQueueSummary } from "../approval/approval-queue-summary";
import { summarizeApprovalQueueItems } from "../approval/approval-queue-summary";
import type { AuditLogSummary } from "../audit/audit-log-summary";
import { getAuditLogSummary as summarizeZoneAuditDailyLines } from "../audit/audit-log-summary";
import { isInsidePath, resolveExistingPath } from "../autonomy-zone/path-guard";
import {
  ICHIKISHIMA_READONLY_DOC_PATHS,
  buildControlCenterReadonlyStatus,
  type BuildControlCenterReadonlyStatusParams,
  type ControlCenterReadinessCard,
} from "./control-center-status";
import type { HermesBridgePilotReadiness } from "../hermes/hermes-bridge-readiness";
import { getHermesBridgePilotReadiness } from "../hermes/hermes-bridge-readiness";
import type { LocalPilotFullLoopResult } from "../pilot";

/** IPC 契約上の論理 RPC 名とペイロード版（`CONTROL_CENTER_V1_IPC_CONTRACT.md` と一致）。 */
export const CONTROL_CENTER_READONLY_IPC_BINDING = {
  rpcLogicalName: "controlCenter.readonly.getAppSnapshot",
  payloadSchemaVersion: "v1",
} as const;

/** V1 RPC に出さない／常に無効化する危険カテゴリ（識別子のみ）。 */
export const CONTROL_CENTER_V1_DISABLED_ACTION_IDS = [
  "runCommand",
  "writeAnyFile",
  "deleteFile_unbounded",
  "fetchUrl",
  "gitPush",
  "readEnv",
  "connectMT5",
  "updateMemoryDb",
] as const;

export interface ControlCenterLatestReportRefs {
  readonly docRelativePaths: typeof ICHIKISHIMA_READONLY_DOC_PATHS;
  /** キュー／pilot 連携の UUID 風 ID のみ。本文は載せない。 */
  latestApprovalReportId: string | null;
}

export interface ControlCenterReadinessBundle {
  ichikishimaCards: ControlCenterReadinessCard[];
  localFullLoopReady: boolean;
  controlCenterDesignReady: boolean;
  hermesBridgePilot: HermesBridgePilotReadiness;
  statusNotes: string[];
}

export interface ControlCenterNextGoalItem {
  ordinal: number;
  title: string;
}

export interface ControlCenterReadonlyData {
  /** preload / Browser クライアントが論理 RPC を照合するための固定値。 */
  ipcBinding: typeof CONTROL_CENTER_READONLY_IPC_BINDING;
  statusCards: ControlCenterReadinessCard[];
  approvalQueueSummary:
    | ApprovalQueueSummary
    | { unavailable: true; reason: string };
  auditLogSummary: AuditLogSummary | { unavailable: true; reason: string };
  latestReports: ControlCenterLatestReportRefs;
  readiness: ControlCenterReadinessBundle;
  nextGoals: ControlCenterNextGoalItem[];
  /** 集計・短文のみ（JSONL 本文・commands 原文は含めない）。 */
  riskSummary: string[];
  disabledActions: (typeof CONTROL_CENTER_V1_DISABLED_ACTION_IDS)[number][];
  requiresUserApproval: true;
  canExecuteDangerousActions: false;
}

export type ControlCenterDataProviderParams =
  BuildControlCenterReadonlyStatusParams;

function validateDocsReadPath(
  projectRoot: string,
  unixRelative: string,
):
  | {
      ok: true;
      absolute: string;
    }
  | {
      ok: false;
      reason: string;
    } {
  const segments = unixRelative.split("/").filter(Boolean);
  if (segments.some((s) => s === "..")) {
    return {
      ok: false,
      reason: "NEXT_GOALS path traversal rejected",
    };
  }

  try {
    const projectResolved = resolveExistingPath(projectRoot);
    const absolute = resolveExistingPath(join(projectRoot, ...segments));
    if (!isInsidePath(absolute, projectResolved)) {
      return { ok: false, reason: "path outside projectRoot" };
    }
    return { ok: true, absolute };
  } catch {
    return { ok: false, reason: "failed to resolve doc path" };
  }
}

const NEXT_GOALS_RELATIVE = ["archive", "ichikishima", "NEXT_GOALS.md"] as const;

export function extractNextGoalsFromMarkdown(
  markdown: string,
): ControlCenterNextGoalItem[] {
  const re = /^### Goal (\d+) — (.+)$/gm;
  const out: ControlCenterNextGoalItem[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(markdown)) !== null) {
    const ordinal = Number.parseInt(m[1] ?? "", 10);
    if (Number.isNaN(ordinal)) continue;
    const title = (m[2] ?? "").trim();
    if (!title) continue;
    out.push({ ordinal, title });
  }
  return out;
}

/** `NEXT_GOALS.md` の見出し行のみ読み取る（本文詳細は返さない）。 */
export function getNextGoalSummary(input: { projectRoot: string }):
  | { ok: true; goals: ControlCenterNextGoalItem[] }
  | {
      ok: false;
      reason: string;
    } {
  const pathGate = validateDocsReadPath(
    input.projectRoot,
    NEXT_GOALS_RELATIVE.join("/"),
  );
  if (!pathGate.ok) {
    return { ok: false, reason: pathGate.reason };
  }
  if (!existsSync(pathGate.absolute)) {
    return {
      ok: false,
      reason: "NEXT_GOALS.md missing under archive/ichikishima",
    };
  }

  let text: string;
  try {
    text = readFileSync(pathGate.absolute, "utf8");
  } catch {
    return {
      ok: false,
      reason: "unable to read NEXT_GOALS snapshot (filesystem)",
    };
  }

  const goals = extractNextGoalsFromMarkdown(text);
  if (goals.length === 0) {
    return { ok: false, reason: "no Goal headings matched in NEXT_GOALS.md" };
  }

  return { ok: true, goals };
}

export function getApprovalQueueSummary(
  params: ControlCenterDataProviderParams,
): { ok: true; summary: ApprovalQueueSummary } | { ok: false; reason: string } {
  const read = readApprovalQueueItems({
    projectRoot: params.projectRoot,
    zoneRoot: params.zoneRoot,
    approvalSubdirectory: params.approvalSubdirectory,
    dateUtc: params.dateUtc,
  });
  if (!read.ok) {
    return { ok: false, reason: read.reason };
  }
  return { ok: true, summary: summarizeApprovalQueueItems(read.items) };
}

export function getAuditLogSummary(
  params: ControlCenterDataProviderParams,
): { ok: true; summary: AuditLogSummary } | { ok: false; reason: string } {
  const sum = summarizeZoneAuditDailyLines({
    projectRoot: params.projectRoot,
    zoneRoot: params.zoneRoot,
    dateUtc: params.dateUtc,
    auditSubdirectory: params.auditSubdirectory,
  });
  if (
    typeof sum === "object" &&
    sum !== null &&
    "ok" in sum &&
    (sum as { ok?: boolean }).ok === false &&
    "reason" in sum
  ) {
    return {
      ok: false,
      reason: (sum as { reason: string }).reason,
    };
  }
  return { ok: true, summary: sum as AuditLogSummary };
}

export function getLatestReportRefs(
  pilotLoop: LocalPilotFullLoopResult | null | undefined,
): ControlCenterLatestReportRefs {
  const rawId =
    pilotLoop?.ichikishimaOrchestration.approvalReport.reportId.trim() ?? "";
  return {
    docRelativePaths: { ...ICHIKISHIMA_READONLY_DOC_PATHS },
    latestApprovalReportId: rawId === "" ? null : rawId,
  };
}

export function getReadinessSummary(
  params: ControlCenterDataProviderParams,
): ControlCenterReadinessBundle {
  const snapshot = buildControlCenterReadonlyStatus(params);
  const bridge = getHermesBridgePilotReadiness({
    projectRoot: params.projectRoot,
  });

  return {
    ichikishimaCards: [...snapshot.cards],
    localFullLoopReady: snapshot.cards.includes("READY_FOR_LOCAL_FULL_LOOP"),
    controlCenterDesignReady: snapshot.cards.includes(
      "CONTROL_CENTER_V1_DESIGN_READY",
    ),
    hermesBridgePilot: bridge,
    statusNotes: [...snapshot.notes],
  };
}

function buildRiskDigestLines(params: {
  statusRiskLines: string[];
  approvalWarnings: string[];
  auditParseFailures?: number | null;
  approvalHighRisk: number;
  auditHighRisk: number;
}): string[] {
  const tail: string[] = [];
  if (params.approvalWarnings.length > 0) {
    tail.push(`approval_summary_warnings:${params.approvalWarnings.length}`);
  }
  if ((params.auditParseFailures ?? 0) > 0) {
    tail.push(`audit_parse_failures:${params.auditParseFailures}`);
  }
  tail.push(`approval_high_risk_count:${params.approvalHighRisk}`);
  tail.push(`audit_high_risk_events:${params.auditHighRisk}`);
  return [...params.statusRiskLines, ...tail];
}

/** Read-only Dashboard 向け単一応答バンドル（危険操作・本文・secrets は含めない）。 */
export function getControlCenterReadonlyData(
  params: ControlCenterDataProviderParams,
): ControlCenterReadonlyData {
  const status = buildControlCenterReadonlyStatus(params);
  const bridge = getHermesBridgePilotReadiness({
    projectRoot: params.projectRoot,
  });
  const goals = getNextGoalSummary({ projectRoot: params.projectRoot });
  const approval = getApprovalQueueSummary(params);
  const audit = getAuditLogSummary(params);

  const approvalWrapped: ControlCenterReadonlyData["approvalQueueSummary"] =
    approval.ok
      ? approval.summary
      : { unavailable: true, reason: approval.reason };

  let auditWrapped: ControlCenterReadonlyData["auditLogSummary"];
  if (audit.ok) {
    auditWrapped = audit.summary;
  } else {
    auditWrapped = { unavailable: true, reason: audit.reason };
  }

  let approvalWarnings: string[] = [];
  let approvalHighRisk = 0;
  if (approval.ok) {
    approvalWarnings = [...approval.summary.parseWarnings];
    approvalHighRisk = approval.summary.highRisk;
  }

  let auditFailures = 0;
  let auditHighRisk = 0;
  if (audit.ok) {
    auditFailures = audit.summary.parseFailures;
    auditHighRisk = audit.summary.highRiskEvents;
  }

  const readiness: ControlCenterReadinessBundle = {
    ichikishimaCards: [...status.cards],
    localFullLoopReady: status.cards.includes("READY_FOR_LOCAL_FULL_LOOP"),
    controlCenterDesignReady: status.cards.includes(
      "CONTROL_CENTER_V1_DESIGN_READY",
    ),
    hermesBridgePilot: bridge,
    statusNotes: [...status.notes],
  };

  return {
    ipcBinding: CONTROL_CENTER_READONLY_IPC_BINDING,
    statusCards: [...status.cards],
    approvalQueueSummary: approvalWrapped,
    auditLogSummary: auditWrapped,
    latestReports: getLatestReportRefs(params.pilotLoop),
    readiness,
    nextGoals: goals.ok ? goals.goals : [],
    riskSummary: buildRiskDigestLines({
      statusRiskLines: [...status.riskSummaryLines],
      approvalWarnings,
      auditParseFailures: auditFailures,
      approvalHighRisk,
      auditHighRisk,
    }),
    disabledActions: [...CONTROL_CENTER_V1_DISABLED_ACTION_IDS],
    requiresUserApproval: true,
    canExecuteDangerousActions: false,
  };
}
