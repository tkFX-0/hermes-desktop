/**
 * Sandbox file handoff → Receiver Queue → Local Pilot → Approval / Audit → Review/report → marker。
 * `HERMES_REAL_PILOT_MINIMAL_PIPELINE_CONTRACT.md` を参照。Handoff path は実プロセス不使用。
 * 別途 **`runHermesRealPilotMinimalFromExecAdapter`** は許可済み **`execFile` のみ**（任意 shell 禁止）。
 */
import { basename } from "node:path";

import { normalizeAuditEvent, saveAuditLog } from "../audit";

import {
  routeHermesOperation,
  type HermesBridgeOperation,
} from "./hermes-bridge";
import type { HermesBridgePayload } from "./hermes-bridge-payload";
import {
  HermesBridgeInMemoryReceiverQueue,
  type HermesBridgeReceiverLane,
  type HermesBridgeReceiverQueueSubmitOutcome,
} from "./hermes-bridge-receiver-queue";
import {
  enqueueViaAdapterLanePipeline,
  type HermesConnectionAdapterResult,
  type HermesConnectionAdapterSummary,
  validateHermesConnectionAdapterInput,
} from "./hermes-connection-adapter";
import {
  type HermesFileHandoffSummary,
  markHermesFileHandoffProcessed,
  processHermesFileHandoffPayload,
  validateHermesFileHandoffPath,
} from "./hermes-file-handoff-adapter";
import {
  runHermesLocalPilotTask,
  type HermesLocalPilotResult,
} from "./hermes-local-pilot";
import {
  runHermesRealProcessIngressExec,
  type HermesRealProcessAdapterExecCall,
} from "./hermes-real-process-adapter";

export type HermesRealPilotMinimalStatus =
  | "completed"
  | "partial"
  | "failed"
  | "rejected_validation"
  | "rejected_receiver";

export interface HermesRealPilotMinimalError {
  code: string;
  message: string;
}

/** `runHermesRealPilotMinimal*` の集計（短命・外向けは summary 関数側で短文化）。 */
export interface HermesRealPilotMinimalCounts {
  approvalsPersisted: number;
  auditAppendsAttempted: number;
  auditAppendsOk: number;
  /** 監査 JSONL 追記行の **推定総数**（Receiver 受理行 + 承認キュー保存に伴う監査行の足し上げ） */
  auditPersistenceLinesEstimate: number;
  forbiddenOperations: number;
  blockedSensitiveOperations: number;
  bridgeApprovalOperations: number;
  reportsQueued: number;
}

export interface HermesRealPilotMinimalResult {
  status: HermesRealPilotMinimalStatus;
  pilotStatus?: HermesLocalPilotResult["status"];
  errors: HermesRealPilotMinimalError[];
  inboxBasename?: string;
  inboxZoneRelativePath?: string;
  markerRelativePath?: string;
  handoffSummary?: HermesConnectionAdapterSummary;
  receiverOutcome?: HermesBridgeReceiverQueueSubmitOutcome["outcome"];
  enqueueDiagnostics?: readonly string[];
  queueLane: HermesBridgeReceiverLane;
  /** false のとき enqueue を省略（単体検証のみ） */
  receiverEnqueueExecuted: boolean;
  summaryLines: string[];
  counts: HermesRealPilotMinimalCounts;
  pilotResult?: HermesLocalPilotResult;
  requiresUserApproval: true;
  autoExecutable: false;
  shouldSpeak: false;
  productionMode: "fail_closed";
  partialMode: "dry_run_only" | "disabled";
  /** Sandbox file handoff 以外の Ingress（例: exec adapter）でのみ設定 */
  processAdapterIngress?: "none" | "exec_attempted" | "exec_completed";
}

export interface HermesRealPilotMinimalInput {
  projectRoot: string;
  zoneRoot: string;
  /** handoff inbox JSON へのパス（検証済み平坦 inbox のみ） */
  targetPath: string;
  handoffRelativeDir?: string;
  /** 省略時は `production_fail_closed` の新規キューを内部生成して使用 */
  receiverQueue?: HermesBridgeInMemoryReceiverQueue;
  receiverLane?: HermesBridgeReceiverLane;
  nowUnixMs?: number;
  dateUtc?: string;
  persistApprovals?: boolean;
  persistAudits?: boolean;
  approvalSubdirectory?: string;
  auditSubdirectory?: string;
  /** 既定 true — 検証／receiver ／ pilot に応じた handoff marker */
  writeHandoffMarkers?: boolean;
  /** 既定 false — Receiver への enqueue をスキップ（payload だけで Pilot を回す検証） */
  skipReceiverEnqueue?: boolean;
  /** Pilot の result 出力相対パス（payload に無いときの既定上書き） */
  pilotOutputRelativePath?: string;
}

export interface HermesRealPilotMinimalFromValidatedInput extends Omit<
  HermesRealPilotMinimalInput,
  "targetPath"
> {
  payloadWire: unknown;
}

export interface HermesRealPilotMinimalExecAdapterInput {
  exec: HermesRealProcessAdapterExecCall;
  pilot: Omit<HermesRealPilotMinimalFromValidatedInput, "payloadWire">;
}

function emptyPilotMinimalCounts(): HermesRealPilotMinimalCounts {
  return {
    approvalsPersisted: 0,
    auditAppendsAttempted: 0,
    auditAppendsOk: 0,
    auditPersistenceLinesEstimate: 0,
    forbiddenOperations: 0,
    blockedSensitiveOperations: 0,
    bridgeApprovalOperations: 0,
    reportsQueued: 0,
  };
}

/** `execFile` Ingress → payload 検証済みwire → Receiver → Pilot。**実 Hermes / index 配線なし**。 */
export async function runHermesRealPilotMinimalFromExecAdapter(
  input: HermesRealPilotMinimalExecAdapterInput,
): Promise<HermesRealPilotMinimalResult> {
  const laneQueue =
    input.pilot.receiverQueue ??
    new HermesBridgeInMemoryReceiverQueue({
      lane: input.pilot.receiverLane ?? "production_fail_closed",
    });
  const laneLabel = laneQueue.getLane();

  const ingress = await runHermesRealProcessIngressExec(input.exec);

  if (!ingress.ok) {
    const ar = ingress.adapterResult;
    const lines = [
      `exec_adapter:${ar.status}`,
      `reason:${String(ar.reasonCode)}`,
    ];
    if (ar.safeSummary) lines.push(ar.safeSummary.slice(0, 240));
    return {
      status: "rejected_validation",
      errors: [
        {
          code: String(ar.reasonCode),
          message: ar.message.slice(0, 420),
        },
      ],
      summaryLines: lines,
      counts: emptyPilotMinimalCounts(),
      queueLane: laneLabel,
      receiverEnqueueExecuted: false,
      requiresUserApproval: true,
      autoExecutable: false,
      shouldSpeak: false,
      productionMode: "fail_closed",
      partialMode: "disabled",
      processAdapterIngress: "exec_attempted",
    };
  }

  const merged = runHermesRealPilotMinimalFromValidatedPayload({
    ...input.pilot,
    receiverQueue: laneQueue,
    payloadWire: ingress.normalizedPayload,
  });
  return {
    ...merged,
    processAdapterIngress: "exec_completed",
  };
}

function countOperationTiers(operations: HermesBridgeOperation[]): {
  forbidden: number;
  blocked: number;
  bridgeApproval: number;
} {
  let forbidden = 0;
  let blocked = 0;
  let bridgeApproval = 0;
  for (const op of operations) {
    const t = routeHermesOperation(op).tier;
    if (t === "forbidden_boundary") forbidden += 1;
    else if (t === "blocked_zone_sensitive") blocked += 1;
    else if (t === "bridge_requires_approval") bridgeApproval += 1;
  }
  return { forbidden, blocked, bridgeApproval };
}

function mergePilotSummary(
  summary: HermesFileHandoffSummary,
  pilot: HermesLocalPilotResult,
): HermesFileHandoffSummary {
  return {
    ...summary,
    diagnostics: [
      ...summary.diagnostics,
      `pilot:${pilot.status}`,
      `forbidOps:${pilot.forbiddenOperations.length}`,
    ].slice(-24),
  };
}

/** adapter / receiver / pilot が完了後の marker とみなせるとき accepted、それ以外 rejected */
export function summarizeHermesRealPilotMinimalForMarker(params: {
  pipelineStatus: HermesRealPilotMinimalStatus;
  handoffMarkerSummary: HermesFileHandoffSummary;
  pilot?: HermesLocalPilotResult;
  receiverRejected?: boolean;
}): {
  markerStatus: "accepted" | "rejected";
  summary: HermesFileHandoffSummary;
} {
  if (
    params.receiverRejected ||
    params.pipelineStatus === "rejected_validation" ||
    params.pipelineStatus === "rejected_receiver"
  ) {
    return {
      markerStatus: "rejected",
      summary: params.handoffMarkerSummary,
    };
  }

  const pilotBad =
    params.pilot?.status === "failed" ||
    (params.pipelineStatus !== "completed" &&
      params.pipelineStatus !== "partial");

  if (pilotBad || !params.pilot)
    return { markerStatus: "rejected", summary: params.handoffMarkerSummary };

  return {
    markerStatus: "accepted",
    summary: mergePilotSummary(params.handoffMarkerSummary, params.pilot),
  };
}

function persistReceiverInboundAudit(params: {
  projectRoot: string;
  zoneRoot: string;
  auditSubdirectory?: string;
  dateUtc?: string;
  actor: HermesBridgePayload["actor"];
  taskIdBrief: string;
  outcome: HermesBridgeReceiverQueueSubmitOutcome;
}): { attempted: boolean; ok: boolean } {
  if (params.outcome.outcome !== "accepted")
    return { attempted: false, ok: false };
  try {
    const rec = normalizeAuditEvent({
      mode: "review_completed",
      actor: params.actor,
      agent: "hermes",
      source: "review_mode",
      requestId: `bridge_rq_${params.taskIdBrief.slice(0, 42)}`,
      reason: "Receiver queue inbound accepted (no payload duplication)",
      reasonCode: "BRIDGE_RECEIVER_INBOUND_ACCEPTED",
      metadata: {
        fqItemIdHex: `${params.outcome.envelope.sanitizedFingerprintHex16}`,
        fqOpCount: `${params.outcome.envelope.operationCount}`,
      },
    });
    const r = saveAuditLog(rec, {
      projectRoot: params.projectRoot,
      zoneRoot: params.zoneRoot,
      auditSubdirectory: params.auditSubdirectory,
      dateUtc: params.dateUtc,
    });
    return { attempted: true, ok: r.ok };
  } catch {
    return { attempted: true, ok: false };
  }
}

function runPilotFromPayload(params: {
  projectRoot: string;
  zoneRoot: string;
  payload: HermesBridgePayload;
  persistApprovals: boolean;
  persistAudits: boolean;
  approvalSubdirectory?: string;
  auditSubdirectory?: string;
  dateUtc?: string;
  outputRelativeOverride?: string;
}): HermesLocalPilotResult {
  const p = params.payload;
  return runHermesLocalPilotTask({
    projectRoot: params.projectRoot,
    zoneRoot: params.zoneRoot,
    taskId: p.taskId,
    title: p.title,
    description: p.description,
    actor: p.actor,
    requestedOperations: p.requestedOperations,
    sampleInputRelativePath: p.sampleInputRelativePath ?? "sample/input.txt",
    outputRelativePath:
      params.outputRelativeOverride ??
      p.outputRelativePath ??
      `output/hermes-real-pilot-${p.taskId.slice(0, 40)}.txt`,
    persistApprovals: params.persistApprovals,
    persistAudits: params.persistAudits,
    approvalSubdirectory: params.approvalSubdirectory,
    auditSubdirectory: params.auditSubdirectory,
    dateUtc: params.dateUtc,
    continueAfterForbiddenClassification:
      p.continueAfterForbiddenClassification,
  });
}

function finalizeMarker(params: {
  zoneRoot: string;
  handoffRelativeDir?: string;
  inboxZoneRelativePath: string;
  inboxBasename: string;
  markerStatus: "accepted" | "rejected";
  summary: HermesFileHandoffSummary;
  adapterErrors?: HermesRealPilotMinimalError[];
  nowUnixMs: number;
  write: boolean;
}): string | undefined {
  if (!params.write) return undefined;
  const mk = markHermesFileHandoffProcessed({
    zoneRoot: params.zoneRoot,
    handoffRelativeDir: params.handoffRelativeDir,
    inboxZoneRelativePath: params.inboxZoneRelativePath,
    inboxBasename: params.inboxBasename,
    markerStatus: params.markerStatus,
    summary: params.summary,
    adapterErrors:
      params.markerStatus === "rejected" && params.adapterErrors?.length
        ? params.adapterErrors.map((e) => ({
            code: e.code,
            message: e.message,
          }))
        : undefined,
    atUnixMs: params.nowUnixMs,
  });
  return mk.ok ? mk.markerRelativePath : undefined;
}

/**
 * Sandbox handoff inbox JSON から Adapter →（任意 enqueue）→ Local Pilot を一括実行。
 */
export function runHermesRealPilotMinimalFromFileHandoff(
  input: HermesRealPilotMinimalInput,
): HermesRealPilotMinimalResult {
  const now = input.nowUnixMs ?? Date.now();
  const persistA = input.persistApprovals ?? true;
  const persistAudit = input.persistAudits ?? true;
  const dateUtc = input.dateUtc;
  const writeMarkers = input.writeHandoffMarkers ?? true;
  const skipEnqueue = input.skipReceiverEnqueue ?? false;

  const queue =
    input.receiverQueue ??
    new HermesBridgeInMemoryReceiverQueue({
      lane: input.receiverLane ?? "production_fail_closed",
    });
  const lane = queue.getLane();

  const pathRes = validateHermesFileHandoffPath({
    zoneRoot: input.zoneRoot,
    handoffRelativeDir: input.handoffRelativeDir,
    targetPath: input.targetPath,
  });
  if (!pathRes.ok) {
    return {
      status: "rejected_validation",
      errors: pathRes.errors.map((e) => ({
        code: e.code,
        message: e.message,
      })),
      summaryLines: pathRes.errors.map((e) => e.code),
      counts: {
        approvalsPersisted: 0,
        auditAppendsAttempted: 0,
        auditAppendsOk: 0,
        auditPersistenceLinesEstimate: 0,
        forbiddenOperations: 0,
        blockedSensitiveOperations: 0,
        bridgeApprovalOperations: 0,
        reportsQueued: 0,
      },
      queueLane: lane,
      receiverEnqueueExecuted: false,
      requiresUserApproval: true,
      autoExecutable: false,
      shouldSpeak: false,
      productionMode: "fail_closed",
      partialMode: "disabled",
    };
  }

  const inboxBase = basename(pathRes.zoneRelativePath);
  const inboxRel = pathRes.zoneRelativePath;

  const handoff = processHermesFileHandoffPayload({
    zoneRoot: input.zoneRoot,
    handoffRelativeDir: input.handoffRelativeDir,
    targetPath: input.targetPath,
    writeMarkers: false,
    skipEnqueue: true,
    nowUnixMs: now,
  });

  if (handoff.status === "rejected") {
    const markerSumm = handoff.summary;
    const errs = [...handoff.errors];
    const markerRel = finalizeMarker({
      zoneRoot: input.zoneRoot,
      handoffRelativeDir: input.handoffRelativeDir,
      inboxZoneRelativePath: inboxRel,
      inboxBasename: inboxBase,
      markerStatus: "rejected",
      summary: markerSumm,
      adapterErrors: errs,
      nowUnixMs: now,
      write: writeMarkers,
    });
    return {
      status: "rejected_validation",
      errors: errs,
      inboxBasename: inboxBase,
      inboxZoneRelativePath: inboxRel,
      markerRelativePath: markerRel,
      handoffSummary: handoff.adapterResult?.summary,
      summaryLines: errs.map((e) => e.code),
      counts: {
        approvalsPersisted: 0,
        auditAppendsAttempted: 0,
        auditAppendsOk: 0,
        auditPersistenceLinesEstimate: 0,
        forbiddenOperations: 0,
        blockedSensitiveOperations: 0,
        bridgeApprovalOperations: 0,
        reportsQueued: 0,
      },
      queueLane: lane,
      receiverEnqueueExecuted: false,
      requiresUserApproval: true,
      autoExecutable: false,
      shouldSpeak: false,
      productionMode: "fail_closed",
      partialMode:
        handoff.summary.interactionModeLabel === "dry_run"
          ? "dry_run_only"
          : "disabled",
    };
  }

  const adapterResult: HermesConnectionAdapterResult = handoff.adapterResult;
  const payload = handoff.adapterResult.enqueuePayload;
  const tierCounts = countOperationTiers(payload.requestedOperations);
  const partialMode: "dry_run_only" | "disabled" = handoff.summary
    .partialEligible
    ? "dry_run_only"
    : "disabled";

  let receiverOutcome:
    | HermesBridgeReceiverQueueSubmitOutcome["outcome"]
    | undefined;
  let enqueueDiag: readonly string[] | undefined;
  let receiverEnqueueExecuted = false;
  let auditAttempt = 0;
  let auditOk = 0;

  if (!skipEnqueue) {
    receiverEnqueueExecuted = true;
    const enqueued = enqueueViaAdapterLanePipeline({
      queue,
      nowUnixMs: now,
      adapterResult,
    });
    receiverOutcome = enqueued.outcome;

    if (enqueued.outcome !== "accepted") {
      const dq = enqueued.diagnostics;
      enqueueDiag = dq;
      const markerRel = finalizeMarker({
        zoneRoot: input.zoneRoot,
        handoffRelativeDir: input.handoffRelativeDir,
        inboxZoneRelativePath: inboxRel,
        inboxBasename: inboxBase,
        markerStatus: "rejected",
        summary: handoff.summary,
        adapterErrors: [
          {
            code: enqueued.reason ?? "RECEIVER_REJECTED",
            message: dq.slice(0, 4).join(","),
          },
        ],
        nowUnixMs: now,
        write: writeMarkers,
      });
      return {
        status: "rejected_receiver",
        errors: [
          {
            code: enqueued.reason ?? "RECEIVER_REJECTED",
            message: dq.join(";").slice(0, 420),
          },
        ],
        inboxBasename: inboxBase,
        inboxZoneRelativePath: inboxRel,
        markerRelativePath: markerRel,
        handoffSummary: adapterResult.summary,
        receiverOutcome,
        enqueueDiagnostics: dq,
        summaryLines: [receiverOutcome ?? "?", ...dq].slice(0, 8),
        counts: countOperationTiersToResult(payload.requestedOperations),
        queueLane: lane,
        receiverEnqueueExecuted,
        requiresUserApproval: true,
        autoExecutable: false,
        shouldSpeak: false,
        productionMode: "fail_closed",
        partialMode,
      };
    }

    enqueueDiag = [];
    if (persistA && persistAudit && dateUtc) {
      const a = persistReceiverInboundAudit({
        projectRoot: input.projectRoot,
        zoneRoot: input.zoneRoot,
        auditSubdirectory: input.auditSubdirectory,
        dateUtc,
        actor: payload.actor,
        taskIdBrief: payload.taskId,
        outcome: enqueued,
      });
      auditAttempt += a.attempted ? 1 : 0;
      auditOk += a.ok ? 1 : 0;
    }
  }

  const pilot = runPilotFromPayload({
    projectRoot: input.projectRoot,
    zoneRoot: input.zoneRoot,
    payload,
    persistApprovals: persistA,
    persistAudits: persistAudit,
    approvalSubdirectory: input.approvalSubdirectory,
    auditSubdirectory: input.auditSubdirectory,
    dateUtc,
    outputRelativeOverride: input.pilotOutputRelativePath,
  });

  let pipelineStatus: HermesRealPilotMinimalStatus =
    pilot.status === "completed"
      ? "completed"
      : pilot.status === "partial"
        ? "partial"
        : "failed";

  const reportsQueued =
    pilot.approvalReport && pilot.approvalItems.some((x) => x.ok) ? 1 : 0;
  const approvalsPersisted = pilot.approvalItems.filter((x) => x.ok).length;
  const auditPersistenceLinesEstimate = auditOk + approvalsPersisted;

  const markerPick = summarizeHermesRealPilotMinimalForMarker({
    pipelineStatus,
    handoffMarkerSummary: handoff.summary,
    pilot,
    receiverRejected: false,
  });
  if (markerPick.markerStatus === "rejected") pipelineStatus = "failed";

  const pilotErrs: HermesRealPilotMinimalError[] =
    pilot.status === "failed"
      ? [
          {
            code: "PILOT_FAILED",
            message:
              pilot.forbiddenOperations.length > 0
                ? "forbidden_early"
                : "zone_io_or_other",
          },
        ]
      : [];

  const markerRel = finalizeMarker({
    zoneRoot: input.zoneRoot,
    handoffRelativeDir: input.handoffRelativeDir,
    inboxZoneRelativePath: inboxRel,
    inboxBasename: inboxBase,
    markerStatus: markerPick.markerStatus,
    summary: markerPick.summary,
    adapterErrors:
      markerPick.markerStatus === "rejected" ? pilotErrs : undefined,
    nowUnixMs: now,
    write: writeMarkers,
  });

  return {
    status: pipelineStatus,
    pilotStatus: pilot.status,
    errors: pilotErrs,
    inboxBasename: inboxBase,
    inboxZoneRelativePath: inboxRel,
    markerRelativePath: markerRel,
    handoffSummary: adapterResult.summary,
    receiverOutcome,
    enqueueDiagnostics: enqueueDiag,
    pilotResult: pilot,
    summaryLines: [
      `pilot:${pilot.status}`,
      `marker:${markerPick.markerStatus}`,
      ...(markerRel ? [`markerRel:${markerRel.split("/").pop() ?? "?"}`] : []),
    ],
    counts: {
      approvalsPersisted,
      auditAppendsAttempted: auditAttempt,
      auditAppendsOk: auditOk,
      auditPersistenceLinesEstimate,
      forbiddenOperations: tierCounts.forbidden,
      blockedSensitiveOperations: tierCounts.blocked,
      bridgeApprovalOperations: tierCounts.bridgeApproval,
      reportsQueued,
    },
    queueLane: lane,
    receiverEnqueueExecuted,
    requiresUserApproval: true,
    autoExecutable: false,
    shouldSpeak: false,
    productionMode: "fail_closed",
    partialMode,
  };
}

function countOperationTiersToResult(
  ops: HermesBridgeOperation[],
): HermesRealPilotMinimalCounts {
  const t = countOperationTiers(ops);
  return {
    approvalsPersisted: 0,
    auditAppendsAttempted: 0,
    auditAppendsOk: 0,
    auditPersistenceLinesEstimate: 0,
    forbiddenOperations: t.forbidden,
    blockedSensitiveOperations: t.blocked,
    bridgeApprovalOperations: t.bridgeApproval,
    reportsQueued: 0,
  };
}

/**
 * Sandbox 経路無し検証:** marker は書かない**。Adapter → enqueue → pilot のみ。
 */
export function runHermesRealPilotMinimalFromValidatedPayload(
  input: HermesRealPilotMinimalFromValidatedInput,
): HermesRealPilotMinimalResult {
  const queue =
    input.receiverQueue ??
    new HermesBridgeInMemoryReceiverQueue({
      lane: input.receiverLane ?? "production_fail_closed",
    });
  const lane = queue.getLane();
  const now = input.nowUnixMs ?? Date.now();
  const persistA = input.persistApprovals ?? true;
  const persistAudit = input.persistAudits ?? true;
  const dateUtc = input.dateUtc;
  const skipEnqueue = input.skipReceiverEnqueue ?? false;

  const adapterResult = validateHermesConnectionAdapterInput({
    kind: "in_memory",
    payloadWire: input.payloadWire,
  });

  if (adapterResult.status === "rejected") {
    return {
      status: "rejected_validation",
      errors: adapterResult.errors.map((e) => ({
        code: e.code,
        message: e.message,
      })),
      handoffSummary: adapterResult.summary,
      summaryLines: [...adapterResult.summary.diagnostics],
      counts: {
        approvalsPersisted: 0,
        auditAppendsAttempted: 0,
        auditAppendsOk: 0,
        auditPersistenceLinesEstimate: 0,
        forbiddenOperations: 0,
        blockedSensitiveOperations: 0,
        bridgeApprovalOperations: 0,
        reportsQueued: 0,
      },
      queueLane: lane,
      receiverEnqueueExecuted: false,
      requiresUserApproval: true,
      autoExecutable: false,
      shouldSpeak: false,
      productionMode: "fail_closed",
      partialMode: "disabled",
    };
  }

  const payload = adapterResult.enqueuePayload;
  let receiverEnqueueExecuted = false;
  let auditAttempt = 0;
  let auditOk = 0;
  let receiverOutcome:
    | HermesBridgeReceiverQueueSubmitOutcome["outcome"]
    | undefined;
  let enqueueDiag: readonly string[] | undefined;
  const partialMode: "dry_run_only" | "disabled" = adapterResult.summary
    .partialEligible
    ? "dry_run_only"
    : "disabled";

  if (!skipEnqueue) {
    receiverEnqueueExecuted = true;
    const enq = enqueueViaAdapterLanePipeline({
      queue,
      nowUnixMs: now,
      adapterResult,
    });
    receiverOutcome = enq.outcome;

    if (enq.outcome !== "accepted") {
      const dq = enq.diagnostics;
      enqueueDiag = dq;
      return {
        status: "rejected_receiver",
        errors: [
          {
            code: enq.reason ?? "RECEIVER_REJECTED",
            message: dq.join(";").slice(0, 420),
          },
        ],
        receiverOutcome,
        enqueueDiagnostics: dq,
        summaryLines: [`receiver:${receiverOutcome ?? "?"}`, ...dq.slice(0, 6)],
        counts: countOperationTiersToResult(payload.requestedOperations),
        queueLane: lane,
        receiverEnqueueExecuted,
        requiresUserApproval: true,
        autoExecutable: false,
        shouldSpeak: false,
        productionMode: "fail_closed",
        partialMode,
      };
    }

    enqueueDiag = [];
    if (persistA && persistAudit && dateUtc) {
      const a = persistReceiverInboundAudit({
        projectRoot: input.projectRoot,
        zoneRoot: input.zoneRoot,
        auditSubdirectory: input.auditSubdirectory,
        dateUtc,
        actor: payload.actor,
        taskIdBrief: payload.taskId,
        outcome: enq,
      });
      auditAttempt += a.attempted ? 1 : 0;
      auditOk += a.ok ? 1 : 0;
    }
  }

  const pilot = runPilotFromPayload({
    projectRoot: input.projectRoot,
    zoneRoot: input.zoneRoot,
    payload,
    persistApprovals: persistA,
    persistAudits: persistAudit,
    approvalSubdirectory: input.approvalSubdirectory,
    auditSubdirectory: input.auditSubdirectory,
    dateUtc,
    outputRelativeOverride: input.pilotOutputRelativePath,
  });

  let pipelineStatus: HermesRealPilotMinimalStatus =
    pilot.status === "completed"
      ? "completed"
      : pilot.status === "partial"
        ? "partial"
        : "failed";

  const markerPickLocal = summarizeHermesRealPilotMinimalForMarker({
    pipelineStatus,
    handoffMarkerSummary: {
      inboxBasename: "validated-wire",
      inboxZoneRelativePath: "validated-wire",
      payloadSchemaVersionMatched: true,
      taskIdBrief: adapterResult.summary.taskIdBrief,
      operationCount: adapterResult.summary.operationCount,
      partialEligible: adapterResult.summary.partialEligible,
      interactionModeLabel: adapterResult.summary.interactionModeLabel,
      tierSummaryLabel: adapterResult.summary.tierSummaryLabel,
      diagnostics: [...adapterResult.summary.diagnostics],
    },
    pilot,
  });
  if (markerPickLocal.markerStatus === "rejected") pipelineStatus = "failed";

  const tierCounts = countOperationTiers(payload.requestedOperations);

  const pilotErrs: HermesRealPilotMinimalError[] =
    pilot.status === "failed"
      ? [
          {
            code: "PILOT_FAILED",
            message:
              pilot.forbiddenOperations.length > 0
                ? "forbidden_early"
                : "other",
          },
        ]
      : [];

  const reportsQueued =
    pilot.approvalReport && pilot.approvalItems.some((x) => x.ok) ? 1 : 0;
  const approvalsPersisted = pilot.approvalItems.filter((x) => x.ok).length;
  const auditPersistenceLinesEstimate = auditOk + approvalsPersisted;

  return {
    status: pipelineStatus,
    pilotStatus: pilot.status,
    errors: pilotErrs,
    handoffSummary: adapterResult.summary,
    receiverOutcome,
    enqueueDiagnostics: enqueueDiag,
    pilotResult: pilot,
    summaryLines: [`pilot:${pilot.status}`, `pipeline:${pipelineStatus}`],
    counts: {
      approvalsPersisted,
      auditAppendsAttempted: auditAttempt,
      auditAppendsOk: auditOk,
      auditPersistenceLinesEstimate,
      forbiddenOperations: tierCounts.forbidden,
      blockedSensitiveOperations: tierCounts.blocked,
      bridgeApprovalOperations: tierCounts.bridgeApproval,
      reportsQueued,
    },
    queueLane: lane,
    receiverEnqueueExecuted,
    requiresUserApproval: true,
    autoExecutable: false,
    shouldSpeak: false,
    productionMode: "fail_closed",
    partialMode,
  };
}

/** 短文行の並びを返す — raw payload を含めない */
export function createHermesRealPilotMinimalSummaryLines(
  r: HermesRealPilotMinimalResult,
): readonly string[] {
  return [
    ...r.summaryLines,
    `status:${r.status}`,
    `approvalsPersisted:${r.counts.approvalsPersisted}`,
    `forbid:${r.counts.forbiddenOperations}`,
    `blocked:${r.counts.blockedSensitiveOperations}`,
    `reportsQueued:${r.counts.reportsQueued}`,
  ].slice(0, 32);
}

/** Approval Report の短文メタのみ（オブジェクト本体は Pilot 側に依存） */
export function createHermesRealPilotMinimalReportMeta(
  r: HermesRealPilotMinimalResult,
): {
  generated: boolean;
  decision?: string;
  riskLevel?: string;
  titleSnippet?: string;
} | null {
  const ar = r.pilotResult?.approvalReport;
  if (!ar) return { generated: false };
  return {
    generated: true,
    decision: ar.decision,
    riskLevel: ar.riskLevel,
    titleSnippet: ar.title.slice(0, 120),
  };
}
