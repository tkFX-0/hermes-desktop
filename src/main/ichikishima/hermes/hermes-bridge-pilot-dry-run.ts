import path from "node:path";

import type { ReviewModeDecision } from "../review/review-mode";

import type { HermesBridgePayload } from "./hermes-bridge-payload";
import {
  pilotInputToHermesBridgePayload,
  validateHermesBridgePayload,
} from "./hermes-bridge-payload";
import type { HermesBridgeOperation } from "./hermes-bridge";
import { getHermesBridgePilotReadiness } from "./hermes-bridge-readiness";
import {
  runHermesLocalPilotTask,
  type HermesLocalPilotResult,
  type HermesPilotOperationOutcome,
  type RunHermesLocalPilotTaskInput,
} from "./hermes-local-pilot";

/**
 * シナリオ Vitest が緑であり、複数ブランチ Pilot dry-run が通ったことを示す文書・ダッシュボード用ラベル。
 * （`getHermesBridgePilotReadiness` の準備ゲートとは独立）
 */
export const HERMES_BRIDGE_PILOT_NEXT_DRY_RUN_SCENARIOS_LABEL =
  "READY_FOR_HERMES_BRIDGE_PILOT_NEXT_DRY_RUN" as const;

export const HERMES_BRIDGE_PILOT_DRY_RUN_SCENARIO_ORDER = [
  "scenario_a_safe_file_task",
  "scenario_b_blocked_operations",
  "scenario_c_bridge_requires_approval",
  "scenario_d_forbidden_classification",
  "scenario_e_mixed_classification",
] as const;

export type HermesBridgePilotDryRunScenarioId =
  (typeof HERMES_BRIDGE_PILOT_DRY_RUN_SCENARIO_ORDER)[number];

/** 単一シナリオの dry-run で期待検証に通過したか。 */
export type HermesBridgePilotDryRunGateStatus = "passed" | "failed";

/** Zone 出力本文や raw API 名前を増幅しない運用サマリー。 */
export interface HermesBridgePilotDryRunOperationWire {
  kind: HermesBridgeOperation["kind"];
  summary: string;
}

export interface HermesBridgePilotScenarioResult {
  scenarioId: HermesBridgePilotDryRunScenarioId;
  status: HermesBridgePilotDryRunGateStatus;
  readinessLabel: string;
  pilotStatus: HermesLocalPilotResult["status"];
  operations: HermesBridgePilotDryRunOperationWire[];
  approvalsCreated: number;
  auditRecordsCreated: number;
  reportsCreated: number;
  forbiddenResults: HermesBridgePilotDryRunOperationWire[];
  blockedResults: HermesBridgePilotDryRunOperationWire[];
  bridgeRequiresApprovalResults: HermesBridgePilotDryRunOperationWire[];
  requiresUserApproval: true;
  autoExecutable: false;
  shouldSpeak: false;
  reviewModeDecision: ReviewModeDecision | null;
  summary: string;
}

export interface HermesBridgePilotDryRunResult {
  readinessLabel: string;
  readinessReady: boolean;
  scenarioResults: HermesBridgePilotScenarioResult[];
  status: HermesBridgePilotDryRunGateStatus;
  requiresUserApproval: true;
  autoExecutable: false;
  shouldSpeak: false;
  summary: string;
}

export interface HermesBridgePilotDryRunSharedInput {
  projectRoot: string;
  zoneRoot: string;
  dateUtc: string;
  approvalSubdirectory: string;
  auditSubdirectory: string;
  taskIdSuffix: string;
  /** 省略時は `sample/input.txt` */
  sampleInputRelativePath?: string;
}

export function wireDryRunOperations(
  outcomes: HermesPilotOperationOutcome[],
): HermesBridgePilotDryRunOperationWire[] {
  return outcomes.map((o) => ({
    kind: o.operation.kind,
    summary: o.summary,
  }));
}

export function summarizeHermesBridgePilotDryRunForControlCenterSnapshot(
  input: HermesBridgePilotDryRunResult,
): string {
  const parts = [
    `[hermes.bridge_pilot_dry_run] readiness=${input.readinessLabel}`,
    `gate=${input.status}`,
    `scenarios=${input.scenarioResults
      .map((s) => `${s.scenarioId}:${s.status}`)
      .join("|")}`,
  ];
  return parts.join("; ");
}

function buildHermesBridgeDryRunEnvelopeFromPilotInput(
  scenarioId: HermesBridgePilotDryRunScenarioId,
  input: RunHermesLocalPilotTaskInput,
): HermesBridgePayload {
  return pilotInputToHermesBridgePayload({
    taskId: input.taskId,
    title: input.title,
    description: input.description,
    actor: input.actor,
    requestedOperations: input.requestedOperations,
    sampleInputRelativePath: input.sampleInputRelativePath,
    outputRelativePath: input.outputRelativePath,
    continueAfterForbiddenClassification:
      input.continueAfterForbiddenClassification,
    interactionMode: "dry_run",
    allowPartialOnForbidden:
      input.continueAfterForbiddenClassification === true,
    dryRunContinuationMode:
      scenarioId === "scenario_e_mixed_classification"
        ? "mixed_forbidden_audit"
        : undefined,
  });
}

function partitionDryRunBuckets(
  outcomes: HermesBridgePilotDryRunOperationWire[],
): {
  forbidden: HermesBridgePilotDryRunOperationWire[];
  blocked: HermesBridgePilotDryRunOperationWire[];
  approvalBridge: HermesBridgePilotDryRunOperationWire[];
} {
  const forbidden: HermesBridgePilotDryRunOperationWire[] = [];
  const blocked: HermesBridgePilotDryRunOperationWire[] = [];
  const approvalBridge: HermesBridgePilotDryRunOperationWire[] = [];

  for (const row of outcomes) {
    const s = row.summary.toLowerCase();
    if (s.startsWith("forbidden_boundary:")) {
      forbidden.push(row);
    } else if (s.includes("bridge_requires_approval")) {
      approvalBridge.push(row);
    } else if (s.includes("blocked") || s.includes("blocked via autonomy")) {
      blocked.push(row);
    }
  }

  return { forbidden, blocked, approvalBridge };
}

export function validateHermesBridgePilotDryRunScenario(
  scenarioId: HermesBridgePilotDryRunScenarioId,
  pilot: HermesLocalPilotResult,
): HermesBridgePilotDryRunGateStatus {
  const wireOps = wireDryRunOperations(pilot.operations);
  const buckets = partitionDryRunBuckets(wireOps);

  switch (scenarioId) {
    case "scenario_a_safe_file_task":
      return pilot.status === "completed" &&
        pilot.approvalReport !== null &&
        pilot.requiresUserApproval === true &&
        pilot.autoExecutable === false &&
        pilot.auditRecords.length > 0 &&
        wireOps.some((o) => o.kind === "zone_read") &&
        wireOps.some((o) => o.kind === "zone_write")
        ? "passed"
        : "failed";

    case "scenario_b_blocked_operations": {
      const blockedish = pilot.operations.filter(
        (o) =>
          o.summary.includes("blocked") ||
          (o.operation.kind === "zone_delete" && o.summary.includes("delete")),
      );
      return pilot.status === "completed" &&
        blockedish.length >= 4 &&
        pilot.approvalItems.filter((c) => c.ok).length > 3
        ? "passed"
        : "failed";
    }

    case "scenario_c_bridge_requires_approval":
      return pilot.status === "completed" &&
        buckets.approvalBridge.length >= 2 &&
        pilot.approvalItems.filter((c) => c.ok).length >= 2
        ? "passed"
        : "failed";

    case "scenario_d_forbidden_classification":
      return pilot.status === "failed" &&
        pilot.forbiddenOperations.length > 0 &&
        pilot.approvalReport === null
        ? "passed"
        : "failed";

    case "scenario_e_mixed_classification":
      return pilot.status === "partial" &&
        pilot.approvalReport !== null &&
        buckets.forbidden.length > 0 &&
        buckets.blocked.length > 0 &&
        buckets.approvalBridge.length > 1
        ? "passed"
        : "failed";

    default: {
      const _never: never = scenarioId;
      return _never;
    }
  }
}

export function buildHermesBridgePilotDryRunPilotInput(
  scenarioId: HermesBridgePilotDryRunScenarioId,
  ctx: HermesBridgePilotDryRunSharedInput,
): RunHermesLocalPilotTaskInput {
  const sampleRel = ctx.sampleInputRelativePath ?? "sample/input.txt";
  const actor: RunHermesLocalPilotTaskInput["actor"] = "ichikishima";

  const base = {
    projectRoot: ctx.projectRoot,
    zoneRoot: ctx.zoneRoot,
    actor,
    persistApprovals: true,
    persistAudits: true,
    approvalSubdirectory: ctx.approvalSubdirectory,
    auditSubdirectory: ctx.auditSubdirectory,
    dateUtc: ctx.dateUtc,
    sampleInputRelativePath: sampleRel,
  } satisfies Omit<
    RunHermesLocalPilotTaskInput,
    | "taskId"
    | "title"
    | "description"
    | "requestedOperations"
    | "outputRelativePath"
    | "continueAfterForbiddenClassification"
  >;

  switch (scenarioId) {
    case "scenario_a_safe_file_task":
      return {
        ...base,
        taskId: `dry_a_${ctx.taskIdSuffix}`,
        title: "Bridge Pilot Dry-run A — safe file task",
        description: "zone read/write と監査だけ（危険操作なし）。",
        requestedOperations: [],
        outputRelativePath: path.posix.join(
          "output",
          `dry-run-a-${ctx.taskIdSuffix}.txt`,
        ),
      };

    case "scenario_b_blocked_operations":
      return {
        ...base,
        taskId: `dry_b_${ctx.taskIdSuffix}`,
        title: "Bridge Pilot Dry-run B — blocked operations",
        description:
          "delete/execute/network/git は stubs でブロック、キューだけ。",
        requestedOperations: [
          {
            kind: "zone_delete",
            requestedPath: "output/pilot-delete-block.txt",
          },
          { kind: "execute_shell", command: "node", args: ["-e", "0"] },
          {
            kind: "network_http",
            url: `https://example.invalid/dry-run-b-${ctx.taskIdSuffix}`,
          },
          { kind: "git_operation", operation: "status" },
        ],
        outputRelativePath: path.posix.join(
          "output",
          `dry-run-b-${ctx.taskIdSuffix}.txt`,
        ),
      };

    case "scenario_c_bridge_requires_approval":
      return {
        ...base,
        taskId: `dry_c_${ctx.taskIdSuffix}`,
        title: "Bridge Pilot Dry-run C — bridge_requires_approval",
        description: "dependency / external escalation は自動実行しない。",
        requestedOperations: [
          { kind: "dependency_install", detail: "[dry-run: no npm]" },
          { kind: "external_ai_escalation", detail: "[dry-run: no outbound]" },
        ],
        outputRelativePath: path.posix.join(
          "output",
          `dry-run-c-${ctx.taskIdSuffix}.txt`,
        ),
      };

    case "scenario_d_forbidden_classification":
      return {
        ...base,
        taskId: `dry_d_${ctx.taskIdSuffix}`,
        title: "Bridge Pilot Dry-run D — forbidden boundary",
        description:
          "memory / MT5 / secrets / dependency policy_blocked は即拒否のみ。",
        requestedOperations: [
          { kind: "memory_db_access", detail: "dry-run" },
          { kind: "mt5_ea_access", detail: "dry-run" },
          { kind: "env_secret_read", detail: "dry-run" },
          {
            kind: "dependency_install",
            disposition: "policy_blocked",
            detail: "[dry-run: policy_blocked]",
          },
        ],
        outputRelativePath: path.posix.join(
          "output",
          `dry-run-d-${ctx.taskIdSuffix}.txt`,
        ),
      };

    case "scenario_e_mixed_classification":
      return {
        ...base,
        taskId: `dry_e_${ctx.taskIdSuffix}`,
        title: "Bridge Pilot Dry-run E — mixed classification",
        description:
          "safe と blocked と approval と forbidden を同一タスクに混在。",
        continueAfterForbiddenClassification: true,
        requestedOperations: [
          { kind: "zone_read", requestedPath: "sample/safe-sample.txt" },
          {
            kind: "zone_write",
            requestedPath: path.posix.join(
              "output",
              `dry-run-e-extra-${ctx.taskIdSuffix}.txt`,
            ),
            content: `[dry-run-e extra write ${ctx.taskIdSuffix}]`,
          },
          {
            kind: "zone_delete",
            requestedPath: "output/pilot-delete-block.txt",
          },
          { kind: "dependency_install", detail: "[dry-run: no npm]" },
          { kind: "external_ai_escalation", detail: "[dry-run: no outbound]" },
          { kind: "memory_db_access", detail: "dry-run forbidden" },
        ],
        outputRelativePath: path.posix.join(
          "output",
          `dry-run-e-main-${ctx.taskIdSuffix}.txt`,
        ),
      };

    default: {
      const _never: never = scenarioId;
      return _never;
    }
  }
}

/** 単一シナリオだけ dry-run を実行してパッケージ化する。 */
export function runHermesBridgePilotDryRunScenario(
  scenarioId: HermesBridgePilotDryRunScenarioId,
  ctx: HermesBridgePilotDryRunSharedInput,
): HermesBridgePilotScenarioResult {
  const input = buildHermesBridgePilotDryRunPilotInput(scenarioId, ctx);
  const envelope = buildHermesBridgeDryRunEnvelopeFromPilotInput(
    scenarioId,
    input,
  );
  const ingress = validateHermesBridgePayload(envelope);
  if (!ingress.ok) {
    throw new Error(
      `HermesBridge dry-run envelope failed validation unexpectedly: ${JSON.stringify(ingress.errors)}`,
    );
  }
  const pilot = runHermesLocalPilotTask(input);
  const readiness = getHermesBridgePilotReadiness({
    projectRoot: ctx.projectRoot,
  });

  const wireOps = wireDryRunOperations(pilot.operations);
  const buckets = partitionDryRunBuckets(wireOps);
  const gate = validateHermesBridgePilotDryRunScenario(scenarioId, pilot);

  const summaryPieces = [
    `${scenarioId} pilot=${pilot.status} gate=${gate}`,
    `reads=${wireOps.filter((o) => o.kind === "zone_read").length}`,
    `writes=${wireOps.filter((o) => o.kind === "zone_write").length}`,
    `forbidWire=${buckets.forbidden.length}`,
    `blockedWire=${buckets.blocked.length}`,
    `bridgeApprovalWire=${buckets.approvalBridge.length}`,
  ];

  const scenario: HermesBridgePilotScenarioResult = {
    scenarioId,
    status: gate,
    readinessLabel: readiness.label,
    pilotStatus: pilot.status,
    operations: wireOps,
    approvalsCreated: pilot.approvalItems.filter((c) => c.ok).length,
    auditRecordsCreated: pilot.auditRecords.length,
    reportsCreated: pilot.approvalReport ? 1 : 0,
    forbiddenResults: buckets.forbidden,
    blockedResults: buckets.blocked,
    bridgeRequiresApprovalResults: buckets.approvalBridge,
    requiresUserApproval: true,
    autoExecutable: false,
    shouldSpeak: false,
    reviewModeDecision: pilot.approvalReport?.decision ?? null,
    summary: summaryPieces.join("; "),
  };

  return scenario;
}

/** 順序どおり Scenario A〜E を実行して dry-run を集約する（実Hermesなし）。 */
export function runHermesBridgePilotDryRunSuite(
  ctx: HermesBridgePilotDryRunSharedInput,
): HermesBridgePilotDryRunResult {
  const readiness = getHermesBridgePilotReadiness({
    projectRoot: ctx.projectRoot,
  });

  const scenarioResults = [...HERMES_BRIDGE_PILOT_DRY_RUN_SCENARIO_ORDER].map(
    (id) => runHermesBridgePilotDryRunScenario(id, ctx),
  );

  const ok = scenarioResults.every((row) => row.status === "passed");

  const nextLabelNote = ok
    ? HERMES_BRIDGE_PILOT_NEXT_DRY_RUN_SCENARIOS_LABEL
    : "DRY_RUN_SCENARIOS_INCOMPLETE";

  return {
    readinessLabel: readiness.label,
    readinessReady: readiness.ready,
    scenarioResults,
    status: ok ? "passed" : "failed",
    requiresUserApproval: true,
    autoExecutable: false,
    shouldSpeak: false,
    summary: `suite=${ok ? "passed" : "failed"}; readiness=${readiness.label}; tracker=${nextLabelNote}`,
  };
}
