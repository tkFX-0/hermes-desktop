import {
  createApprovalQueueItemFromBlockedDelete,
  createApprovalQueueItemFromBlockedOperation,
  createApprovalQueueItemFromReport,
  createApprovalQueueItem,
  createApprovalReport,
  saveApprovalQueueItem,
  type ApprovalReport,
  type CreateApprovalQueueItemResult,
} from "../approval";
import {
  normalizeAuditEvent,
  saveAuditLog,
  maskAuditSensitiveText,
  type AuditLogRecord,
} from "../audit";
import {
  deleteZoneFile,
  executeCommand,
  readZoneFile,
  requestGitOperation,
  requestNetworkAccess,
  writeZoneFile,
} from "../autonomy-zone";
import type {
  BlockedOperationAuditEventCandidate,
  DeleteAuditEventCandidate,
  ReadAuditEventCandidate,
  WriteAuditEventCandidate,
} from "../autonomy-zone/types";
import { evaluateReviewMode } from "../review/review-mode";

import {
  createHermesBridgeReport,
  createHermesBridgeTask,
  routeHermesOperation,
  type HermesBridgeOperation,
} from "./hermes-bridge";

export interface RunHermesLocalPilotTaskInput {
  projectRoot: string;
  zoneRoot: string;
  taskId: string;
  title: string;
  description: string;
  actor: "hermes" | "user" | "ichikishima" | "system";
  requestedOperations?: HermesBridgeOperation[];
  sampleInputRelativePath?: string;
  outputRelativePath?: string;
  persistApprovals?: boolean;
  persistAudits?: boolean;
  approvalSubdirectory?: string;
  auditSubdirectory?: string;
  dateUtc?: string;
  /**
   * `true` のとき、forbidden 区分があっても即時 `failed` で打ち切らず、
   * zone 標準 read/write と他操作の分類（未実行記録）まで進める。mixed dry-run 用。
   */
  continueAfterForbiddenClassification?: boolean;
}

export interface HermesPilotOperationOutcome {
  operation: HermesBridgeOperation;
  summary: string;
}

export interface HermesLocalPilotResult {
  status: "completed" | "partial" | "failed";
  bridgeTask: ReturnType<typeof createHermesBridgeTask>;
  bridgeReport: ReturnType<typeof createHermesBridgeReport>;
  operations: HermesPilotOperationOutcome[];
  approvalItems: CreateApprovalQueueItemResult[];
  approvalReport: ApprovalReport | null;
  auditRecords: AuditLogRecord[];
  finalSummary: string;
  forbiddenOperations: HermesBridgeOperation[];
  requiresUserApproval: true;
  autoExecutable: false;
}

type PilotZoneAuditCandidate =
  | ReadAuditEventCandidate
  | WriteAuditEventCandidate
  | DeleteAuditEventCandidate
  | BlockedOperationAuditEventCandidate;

function bridgeDetailSnippet(raw: string | undefined, maxLen: number): string {
  const t = maskAuditSensitiveText((raw ?? "").trim()).slice(0, maxLen);
  return t.length ? t : "[no-detail]";
}

function enqueueBridgeApprovalCandidate(input: {
  taskId: string;
  actor: RunHermesLocalPilotTaskInput["actor"];
  routedOp: HermesBridgeOperation &
    ({ kind: "dependency_install" } | { kind: "external_ai_escalation" });
}): CreateApprovalQueueItemResult {
  if (input.routedOp.kind === "dependency_install") {
    return createApprovalQueueItem({
      source: "operation_block",
      actor: input.actor,
      actionType: "dependency_install",
      riskLevel: "high",
      title: `Dependency install request (${input.taskId})`,
      reason: bridgeDetailSnippet(input.routedOp.detail, 420),
      expectedResult:
        "User reviews lockfile/policy; no automatic npm install by Bridge Pilot.",
      rollbackPlan:
        "Do not merge dependency changes until reviewed; discard workspace edits if rejected.",
      testPlan:
        "Run approved CI checks manually after dependency change (not by this pilot).",
      commands: ["[bridge:dependency_install_declared_only]"],
      metadata: {
        bridgeOp: "dependency_install",
        bridgeTaskId: input.taskId,
      },
    });
  }

  return createApprovalQueueItem({
    source: "operation_block",
    actor: input.actor,
    actionType: "external_escalation",
    riskLevel: "high",
    title: `External AI escalation request (${input.taskId})`,
    reason: bridgeDetailSnippet(input.routedOp.detail, 420),
    expectedResult:
      "User approves escalation channel; no outbound API call by Bridge Pilot.",
    rollbackPlan:
      "Discard escalation payloads; confirm no outbound keys were exposed.",
    testPlan:
      "If approved, invoke separate reviewed tool manually (not Bridge Pilot).",
    externalUrls: [],
    commands: [],
    metadata: {
      bridgeOp: "external_ai_escalation",
      bridgeTaskId: input.taskId,
    },
  });
}

function normalizeZoneAuditCandidate(
  candidate: PilotZoneAuditCandidate,
): AuditLogRecord {
  return normalizeAuditEvent({
    mode: "zone_audit_candidate",
    candidate,
    agent: "hermes",
    source: "autonomy_zone",
  });
}

/** sandbox ベースで read/write と危険操作ブロックのみを処理する Hermes-like ダミーランナー。 */
export function runHermesLocalPilotTask(
  input: RunHermesLocalPilotTaskInput,
): HermesLocalPilotResult {
  const persistApprovals = input.persistApprovals ?? true;
  const persistAudits = input.persistAudits ?? true;

  const samplePath = input.sampleInputRelativePath ?? "sample/input.txt";
  const outputPath = input.outputRelativePath ?? "output/result.txt";
  const requestedOperations = input.requestedOperations ?? [];

  const forbiddenOperations: HermesBridgeOperation[] = [];
  for (const operation of requestedOperations) {
    const routed = routeHermesOperation(operation);
    if (routed.tier === "forbidden_boundary")
      forbiddenOperations.push(operation);
  }

  const auditRecords: AuditLogRecord[] = [];
  const approvalItems: CreateApprovalQueueItemResult[] = [];
  const outcomes: HermesPilotOperationOutcome[] = [];

  const bridgeTask = createHermesBridgeTask({
    taskId: input.taskId,
    title: input.title,
    description: input.description,
    requestedOperations,
  });

  const bridgeReport = createHermesBridgeReport(bridgeTask);

  function persistApprovalAndAudit(
    candidate: CreateApprovalQueueItemResult,
  ): void {
    if (!(candidate.ok && persistApprovals && persistAudits && input.dateUtc))
      return;

    const saved = saveApprovalQueueItem(candidate.item, {
      projectRoot: input.projectRoot,
      zoneRoot: input.zoneRoot,
      approvalSubdirectory: input.approvalSubdirectory,
      dateUtc: input.dateUtc,
    });

    if (!saved.ok) return;

    auditRecords.push(saved.auditEventCandidate);

    saveAuditLog(saved.auditEventCandidate, {
      projectRoot: input.projectRoot,
      zoneRoot: input.zoneRoot,
      auditSubdirectory: input.auditSubdirectory,
      dateUtc: input.dateUtc,
    });
  }

  if (
    forbiddenOperations.length > 0 &&
    input.continueAfterForbiddenClassification !== true
  ) {
    return {
      status: "failed",
      bridgeTask,
      bridgeReport,
      operations: outcomes,
      approvalItems,
      approvalReport: null,
      auditRecords,
      finalSummary: `Hermes Bridge で forbidden が検知されました: ${forbiddenOperations.length} 件`,
      forbiddenOperations,
      requiresUserApproval: true,
      autoExecutable: false,
    };
  }

  const sampleRead = readZoneFile({
    zoneRoot: input.zoneRoot,
    requestedPath: samplePath,
    requestId: `${input.taskId}_sample_read`,
    actor: input.actor,
  });

  if (sampleRead.ok) {
    auditRecords.push(
      normalizeZoneAuditCandidate(sampleRead.auditEventCandidate),
    );
    outcomes.push({
      operation: { kind: "zone_read", requestedPath: samplePath },
      summary: "sample read succeeded",
    });
  } else {
    auditRecords.push(
      normalizeZoneAuditCandidate(sampleRead.auditEventCandidate),
    );
    outcomes.push({
      operation: { kind: "zone_read", requestedPath: samplePath },
      summary: `sample read failed: ${sampleRead.reasonCode}`,
    });
  }

  const readOk = sampleRead.ok;
  let preview = "";

  if (
    readOk &&
    "content" in sampleRead &&
    typeof sampleRead.content === "string"
  ) {
    preview = sampleRead.content.slice(0, 280);
  }

  const body =
    `${preview}\n---\ntask ${input.taskId}\nHermesローカルパイロットは autonomy zone 経由のみで書き込み。\n変更したファイル: ${outputPath}\n外部通信はしていません。\nmemory DB は触っていません。\n実delete・execute・network・git は実行していません。\nHermes変更レポート相当の自動集計としてキュー自動実行しない。\n禁止領域: EA本体やMT5、本番設定、.env は参照していない。\n`.trimEnd();

  const writeResult = writeZoneFile({
    zoneRoot: input.zoneRoot,
    requestedPath: outputPath,
    content: body,
    overwrite: true,
    createDirs: true,
    actor: input.actor,
    requestId: `${input.taskId}_write_result`,
  });

  outcomes.push({
    operation: { kind: "zone_write", requestedPath: outputPath, content: body },
    summary: writeResult.ok
      ? "result write succeeded"
      : `write denied ${writeResult.reasonCode}`,
  });
  auditRecords.push(
    normalizeZoneAuditCandidate(writeResult.auditEventCandidate),
  );

  for (const operation of requestedOperations) {
    const routed = routeHermesOperation(operation);
    if (routed.tier === "forbidden_boundary") {
      outcomes.push({
        operation,
        summary: `forbidden_boundary:${routed.reasonCode} (no execution)`,
      });
      continue;
    }
    if (routed.tier === "allowed_zone_candidate") {
      if (
        routed.op.kind === "zone_read" &&
        routed.op.requestedPath !== samplePath
      ) {
        const extra = readZoneFile({
          zoneRoot: input.zoneRoot,
          requestedPath: routed.op.requestedPath,
          actor: input.actor,
        });
        auditRecords.push(
          normalizeZoneAuditCandidate(extra.auditEventCandidate),
        );
        outcomes.push({
          operation,
          summary: extra.ok
            ? "extra read succeeded"
            : `extra read failed ${extra.reasonCode}`,
        });
      }

      if (routed.op.kind === "zone_write") {
        const ew = writeZoneFile({
          zoneRoot: input.zoneRoot,
          requestedPath: routed.op.requestedPath,
          content: routed.op.content,
          overwrite: true,
          createDirs: true,
          actor: input.actor,
        });
        auditRecords.push(normalizeZoneAuditCandidate(ew.auditEventCandidate));
        outcomes.push({
          operation,
          summary: ew.ok
            ? "extra write succeeded"
            : `extra write denied ${ew.reasonCode}`,
        });
      }
      continue;
    }

    if (routed.tier === "bridge_requires_approval") {
      const item = enqueueBridgeApprovalCandidate({
        taskId: input.taskId,
        actor: input.actor,
        routedOp: routed.op,
      });
      outcomes.push({
        operation,
        summary: item.ok
          ? "bridge_requires_approval: enqueued without execution"
          : `approval enqueue failed: ${item.reasonCode}`,
      });
      if (item.ok) {
        approvalItems.push(item);
        persistApprovalAndAudit(item);
      }
      continue;
    }

    if (routed.tier !== "blocked_zone_sensitive") continue;

    switch (operation.kind) {
      case "zone_delete": {
        const dr = deleteZoneFile({
          zoneRoot: input.zoneRoot,
          requestedPath: operation.requestedPath,
          actor: input.actor,
        });
        outcomes.push({
          operation,
          summary: `delete blocked (${dr.reasonCode})`,
        });
        auditRecords.push(normalizeZoneAuditCandidate(dr.auditEventCandidate));

        const item = createApprovalQueueItemFromBlockedDelete(dr);
        if (item?.ok) {
          approvalItems.push(item);
          persistApprovalAndAudit(item);
        }
        break;
      }
      case "execute_shell": {
        const xr = executeCommand({
          command: operation.command,
          args: [...(operation.args ?? [])],
          actor: input.actor,
        });
        outcomes.push({
          operation,
          summary: "execute_shell blocked via autonomy stubs",
        });
        auditRecords.push(normalizeZoneAuditCandidate(xr.auditEventCandidate));
        const item = createApprovalQueueItemFromBlockedOperation(xr);
        if (item.ok) {
          approvalItems.push(item);
          persistApprovalAndAudit(item);
        }
        break;
      }
      case "network_http": {
        const nr = requestNetworkAccess({
          url: operation.url,
          actor: input.actor,
        });
        outcomes.push({
          operation,
          summary: "network_http blocked via autonomy stubs",
        });
        auditRecords.push(normalizeZoneAuditCandidate(nr.auditEventCandidate));

        const item = createApprovalQueueItemFromBlockedOperation(nr);
        if (item.ok) {
          approvalItems.push(item);
          persistApprovalAndAudit(item);
        }
        break;
      }
      case "git_operation": {
        const gr = requestGitOperation({
          operation: operation.operation,
          actor: input.actor,
        });
        outcomes.push({
          operation,
          summary: "git_operation blocked via autonomy stubs",
        });
        auditRecords.push(normalizeZoneAuditCandidate(gr.auditEventCandidate));

        const item = createApprovalQueueItemFromBlockedOperation(gr);
        if (item.ok) {
          approvalItems.push(item);
          persistApprovalAndAudit(item);
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  const baseComplete = readOk && writeResult.ok;
  const forbiddenCount = forbiddenOperations.length;
  const summaryNotes: string[] = [
    `task ${input.taskId}: ${input.title}`,
    `${input.description}`,
    "Hermes変更レポート: Local Pilot が sandbox で read/write と危険操作ブロックのみを評価。",
    `サンプル read: ${readOk ? "成功" : "失敗"} path=${samplePath}`,
    `出力 write: ${writeResult.ok ? "成功" : "拒否"} path=${outputPath}`,
    `変更したファイル: ${outputPath}`,
    `外部通信していない`,
    `実delete実行・実execute実行・実network実行・実git実行はしていない`,
    `memory DB 更新していない`,
    `Hermes本体は起動していない`,
    "SHADOW_MODE_READY のままキュー自動実行しない",
    "自動発話しない",
    "通知しない",
    "Electron起動/UIテストは未実行",
  ];
  if (
    forbiddenCount > 0 &&
    input.continueAfterForbiddenClassification === true
  ) {
    summaryNotes.push(
      `forbidden_boundary 検知: ${forbiddenCount} 件（自動実行・外部通信なし／分類のみ）`,
    );
  }
  const finalSummary = summaryNotes.join("\n");

  let status: HermesLocalPilotResult["status"];
  if (!baseComplete) {
    status = "failed";
  } else if (forbiddenCount > 0) {
    status = "partial";
  } else {
    status = "completed";
  }

  let approvalReport: ApprovalReport | null = null;

  if (status === "completed" || status === "partial") {
    const mixedNote =
      status === "partial"
        ? "forbidden 境界を検知したが zone read/write は完了（mixed 分類）。\n"
        : "";
    const review = evaluateReviewMode({
      reportText: `${mixedNote}${finalSummary}`,
      changedFiles: [outputPath],
      executedTests: ["tests/ichikishima/hermes/hermes-local-pilot.test.ts"],
      unexecutedTests: ["Electron起動/UIテスト未実行"],
      untouchedImportantAreas: [
        "EA本体",
        "MT5関連",
        "memory DB",
        ".env / APIキー / secrets",
        "Hermes本体接続経路",
      ],
      rollbackPlan:
        "sandbox output を開発者が削除または git で巻き戻す場合は手順に従う",
      codeChanged: true,
      docsOnly: false,
    });

    approvalReport = createApprovalReport({
      source: "hermes_report",
      title: `Hermes Local Pilot — ${input.title}`,
      summary:
        status === "partial"
          ? `task ${input.taskId}: zone I/O 完了、forbidden は分類のみ（未実行）`
          : `task ${input.taskId} が autonomy zone で疑似 Hermes を完了`,
      reviewResult: review,
      changedFiles: [outputPath],
      untouchedCriticalAreas: ["EA本体", "MT5関連", "memory DB", "Hermes本体"],
      userVisibleChanges: [
        status === "partial"
          ? "sandbox へ zone 出力＋危険/forbidden 区分を記録（forbidden は未実行）"
          : "sandbox に Hermes Pilot 結果テキストを書き込みました",
      ],
      executedTests: ["hermes-local-pilot unit"],
      skippedTests:
        status === "partial"
          ? ["electron integration", "forbidden 自動実行はしない"]
          : ["electron integration"],
      safetyFlags: ["requires_human_gate"],
    });

    const reportQueue = createApprovalQueueItemFromReport(approvalReport);
    if (reportQueue.ok) {
      approvalItems.push(reportQueue);
      persistApprovalAndAudit(reportQueue);
    }
  }

  return {
    status,
    bridgeTask,
    bridgeReport,
    operations: outcomes,
    approvalItems,
    approvalReport,
    auditRecords,
    finalSummary,
    forbiddenOperations,
    requiresUserApproval: true,
    autoExecutable: false,
  };
}
