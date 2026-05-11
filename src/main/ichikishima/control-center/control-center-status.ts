import { existsSync, readFileSync } from "node:fs";
import { join, sep as pathSep } from "node:path";

import { checkDenylist } from "../autonomy-zone/denylist";
import {
  checkZonePath,
  isInsidePath,
  resolveExistingPath,
  resolvePathAgainstBase,
  validatePathInput,
} from "../autonomy-zone/path-guard";
import { readApprovalQueueItems } from "../approval/approval-queue-store";
import type { LocalPilotFullLoopResult } from "../pilot";

import type { ControlCenterPathResolutionRendererSafe } from "./control-center-project-root-resolution";

export type ControlCenterReadinessCard =
  | "READY_FOR_LOCAL_PILOT"
  | "READY_FOR_LOCAL_FULL_LOOP"
  | "SHADOW_MODE_READY"
  | "REVIEW_MODE_READY"
  | "APPROVAL_QUEUE_READY"
  | "AUDIT_LOG_READY"
  | "HERMES_BRIDGE_READY"
  | "CONTROL_CENTER_V1_DESIGN_READY"
  | "BLOCKED"
  | "HOLD"
  | "NEEDS_USER_APPROVAL";

/** Read-only Dashboard がファイルパスのみ参照する際のヒント（本文は読み込まない）。 */
export const ICHIKISHIMA_READONLY_DOC_PATHS = {
  morningReview: "docs/ichikishima/MORNING_REVIEW_REPORT.md",
  goalCompletion: "docs/ichikishima/GOAL_COMPLETION_REPORT.md",
  bridgeFinalReview: "docs/ichikishima/HERMES_BRIDGE_FINAL_REVIEW.md",
  nextGoals: "docs/ichikishima/NEXT_GOALS.md",
} as const;

export interface ControlCenterReadonlyStatusModel {
  cards: ControlCenterReadinessCard[];
  approvalQueueSnapCount: number | null;
  auditLogApproxLines: number | null;
  latestReportHint?: string;
  morningReviewHint: string;
  goalCompletionHint: string;
  bridgeFinalReviewHint: string;
  nextGoalsHint: string;
  /** Bridge/Pilotのみを意味する論理ラベル（Hermesランタイム起動とは無関係）。 */
  hermesOperationalLabel: string;
  ichikishimaOperationalLabel: string;
  /** Pilot で blocked/denied を含む要約の近似件数。pilot が無ければ null。 */
  blockedOperationApproxCount: number | null;
  /** 短文リスクダイジェスト（コード・秘密情報の生データは含めない）。 */
  riskSummaryLines: string[];
  /** 自動実行しない運用ヒントのみ。 */
  nextRecommendedGoalHint: string;
  notes: string[];
}

export interface BuildControlCenterReadonlyStatusParams {
  projectRoot: string;
  zoneRoot: string;
  dateUtc: string;
  approvalSubdirectory?: string;
  auditSubdirectory?: string;
  pilotLoop?: LocalPilotFullLoopResult | null;
  /** Resolver が組み立てた Renderer 安全メタ（省略時は snapshot が導出）。 */
  pathResolutionRendererSafe?: ControlCenterPathResolutionRendererSafe;
  /** ユニットテスト専用：packaged pending 分岐を強制（本番運用では undefined） */
  assumePackagedResolutionTest?: boolean;
}

const NEXT_RECOMMENDED_GOAL_HINT =
  "推奨: Hermes本体より先に Bridge Pilot（sandbox・実ランタイム無し）または Control Center V1 read-only UI（別リポ／ボタン無しまたは disabled のみ）。secrets と本文は Dashboard に出さない。";

function parseRelativeSubdirectory(
  rawInput: string | undefined,
  defaultName: string,
): { ok: true; relativePath: string } | { ok: false; reason: string } {
  const raw = (rawInput ?? defaultName).trim();
  if (!raw) {
    return { ok: false, reason: "Subdirectory must not be empty" };
  }
  if (raw.startsWith("/") || /^[a-zA-Z]:[\\/]/.test(raw)) {
    return { ok: false, reason: "Subdirectory must be relative to zone root" };
  }

  const parts = raw.split(/[/\\]/).filter(Boolean);
  if (parts.some((p) => p === "..")) {
    return {
      ok: false,
      reason: "Subdirectory must not contain parent segments",
    };
  }
  if (parts.some((p) => p === ".")) {
    return {
      ok: false,
      reason: "Subdirectory must not contain dot path segments",
    };
  }

  return { ok: true, relativePath: parts.join(pathSep) };
}

function countJsonlLinesAt(filePath: string): number {
  if (!existsSync(filePath)) return 0;
  try {
    const text = readFileSync(filePath, "utf8");
    return text.split(/\r?\n/).filter((line) => line.trim().length > 0).length;
  } catch {
    return 0;
  }
}

function approximateBlockedPilotOps(
  loop: LocalPilotFullLoopResult | null | undefined,
): number | null {
  if (!loop) return null;
  return loop.hermesPilotResult.operations.filter((record) =>
    /blocked|denied/i.test(record.summary),
  ).length;
}

function riskDigestFromLoop(
  loop: LocalPilotFullLoopResult | null | undefined,
): string[] {
  if (!loop) return [];

  const report = loop.ichikishimaOrchestration.approvalReport;
  const head = [`decision=${report.decision}`, `riskLevel=${report.riskLevel}`];
  const reasons = report.reasons
    .slice(0, 3)
    .map((reason) =>
      reason.length > 140 ? `${reason.slice(0, 137)}…` : reason,
    );
  return [...head, ...reasons];
}

function hermesLabelFromLoop(
  loop: LocalPilotFullLoopResult | null | undefined,
): string {
  if (!loop) return "hermes_unknown_no_loop_snapshot";

  if (loop.readinessStatus === "READY_FOR_LOCAL_FULL_LOOP") {
    return "hermes_shadow_local_full_loop_ok";
  }
  return `hermes_shadow_status_${loop.hermesPilotResult.status}_${loop.readinessStatus}`;
}

function ichikishimaLabelFromLoop(
  loop: LocalPilotFullLoopResult | null | undefined,
): string {
  if (!loop) return "ichikishima_unknown_no_loop_snapshot";

  return loop.ichikishimaOrchestration.finalDecision.shouldSpeak === false
    ? "ichikishima_shadow_review_no_speak_requires_user_gate"
    : "ichikishima_contract_violation_should_speak_must_be_false";
}

type ComposeDocHintsResult = Omit<
  ControlCenterReadonlyStatusModel,
  "cards" | "approvalQueueSnapCount" | "auditLogApproxLines" | "notes"
>;

function composeDocHints(
  loop: LocalPilotFullLoopResult | null | undefined,
): ComposeDocHintsResult {
  const latestReportHint =
    loop?.ichikishimaOrchestration.approvalReport.reportId;

  return {
    morningReviewHint: ICHIKISHIMA_READONLY_DOC_PATHS.morningReview,
    goalCompletionHint: ICHIKISHIMA_READONLY_DOC_PATHS.goalCompletion,
    bridgeFinalReviewHint: ICHIKISHIMA_READONLY_DOC_PATHS.bridgeFinalReview,
    nextGoalsHint: ICHIKISHIMA_READONLY_DOC_PATHS.nextGoals,
    hermesOperationalLabel: hermesLabelFromLoop(loop),
    ichikishimaOperationalLabel: ichikishimaLabelFromLoop(loop),
    blockedOperationApproxCount: approximateBlockedPilotOps(loop),
    riskSummaryLines: riskDigestFromLoop(loop),
    nextRecommendedGoalHint: NEXT_RECOMMENDED_GOAL_HINT,
    ...(latestReportHint !== undefined ? { latestReportHint } : {}),
  };
}

/** Control Center V1 向けの read-only カード（UIは作らない）。 */
export function buildControlCenterReadonlyStatus(
  params: BuildControlCenterReadonlyStatusParams,
): ControlCenterReadonlyStatusModel {
  const notes: string[] = [];
  const cards = new Set<ControlCenterReadinessCard>();

  cards.add("READY_FOR_LOCAL_PILOT");
  cards.add("SHADOW_MODE_READY");
  cards.add("REVIEW_MODE_READY");
  cards.add("HERMES_BRIDGE_READY");

  const projectErr = validatePathInput(params.projectRoot, "projectRoot");
  const zoneErr = validatePathInput(params.zoneRoot, "zoneRoot");
  if (projectErr || zoneErr) {
    notes.push(projectErr?.reason ?? zoneErr?.reason ?? "path invalid");
    cards.add("BLOCKED");
    cards.add("NEEDS_USER_APPROVAL");
    return {
      cards: [...cards],
      approvalQueueSnapCount: null,
      auditLogApproxLines: null,
      notes,
      ...composeDocHints(params.pilotLoop),
    };
  }

  let projectResolved: string;
  let zoneResolved: string;
  try {
    projectResolved = resolveExistingPath(params.projectRoot);
    zoneResolved = resolveExistingPath(params.zoneRoot);
  } catch {
    notes.push("Failed to resolve project or zone root");
    cards.add("BLOCKED");
    cards.add("NEEDS_USER_APPROVAL");
    return {
      cards: [...cards],
      approvalQueueSnapCount: null,
      auditLogApproxLines: null,
      notes,
      ...composeDocHints(params.pilotLoop),
    };
  }

  if (!isInsidePath(zoneResolved, projectResolved)) {
    notes.push("Zone root must stay inside project root");
    cards.add("BLOCKED");
    cards.add("NEEDS_USER_APPROVAL");
    return {
      cards: [...cards],
      approvalQueueSnapCount: null,
      auditLogApproxLines: null,
      notes,
      ...composeDocHints(params.pilotLoop),
    };
  }

  const approvalSub = parseRelativeSubdirectory(
    params.approvalSubdirectory,
    "approval",
  );
  const auditSub = parseRelativeSubdirectory(params.auditSubdirectory, "audit");

  let approvalQueueSnapCount: number | null = null;
  if (approvalSub.ok) {
    const approvalRead = readApprovalQueueItems({
      projectRoot: params.projectRoot,
      zoneRoot: params.zoneRoot,
      approvalSubdirectory: approvalSub.relativePath,
      dateUtc: params.dateUtc,
    });
    approvalQueueSnapCount = approvalRead.ok ? approvalRead.items.length : null;
    if (!approvalRead.ok) {
      notes.push(approvalRead.reason);
    }

    cards.add("APPROVAL_QUEUE_READY");
    cards.add("NEEDS_USER_APPROVAL");
  } else {
    notes.push(`approval subdirectory: ${approvalSub.reason}`);
  }

  let auditLogApproxLines: number | null = null;
  if (auditSub.ok) {
    const auditDirResolved = resolvePathAgainstBase(
      zoneResolved,
      auditSub.relativePath,
    );
    const fileCandidate = join(
      auditDirResolved,
      `audit-${params.dateUtc}.jsonl`,
    );

    const dirGate = checkZonePath({
      zoneRoot: zoneResolved,
      targetPath: auditDirResolved,
    });
    const fileGate = checkZonePath({
      zoneRoot: zoneResolved,
      targetPath: fileCandidate,
    });

    if (!(dirGate.ok && fileGate.ok)) {
      notes.push("audit path guard denied snapshot");
      cards.add("HOLD");
      auditLogApproxLines = null;
    } else {
      const deny = checkDenylist(fileGate.normalizedPath);
      if (!deny.ok) {
        notes.push("audit path denylist prevented snapshot metadata");
        auditLogApproxLines = null;
      } else {
        auditLogApproxLines = countJsonlLinesAt(fileGate.realPath);
        if (auditLogApproxLines > 0) {
          cards.add("AUDIT_LOG_READY");
        }
      }
    }
  } else {
    notes.push(`audit subdirectory: ${auditSub.reason}`);
  }

  if (params.pilotLoop?.readinessStatus === "READY_FOR_LOCAL_FULL_LOOP") {
    cards.add("READY_FOR_LOCAL_FULL_LOOP");
  } else if (params.pilotLoop) {
    cards.add("HOLD");
    cards.add("NEEDS_USER_APPROVAL");
  }

  const readyForCc =
    (approvalQueueSnapCount ?? 0) > 0 &&
    params.pilotLoop?.readinessStatus === "READY_FOR_LOCAL_FULL_LOOP";

  if (readyForCc) {
    cards.add("CONTROL_CENTER_V1_DESIGN_READY");
  }

  const docHints = composeDocHints(params.pilotLoop);

  return {
    cards: [...cards],
    approvalQueueSnapCount,
    auditLogApproxLines,
    notes,
    ...docHints,
  };
}
