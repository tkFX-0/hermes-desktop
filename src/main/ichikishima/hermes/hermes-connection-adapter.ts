/**
 * Hermes ingress の Stage 0（in-memory）接続適配のみ。
 */
import {
  routeHermesOperation,
  type HermesBridgeOperation,
} from "./hermes-bridge";
import type { HermesBridgePayload } from "./hermes-bridge-payload";
import {
  validateHermesBridgePayload,
  type HermesBridgePayloadValidationResult,
} from "./hermes-bridge-payload";
import type { HermesBridgeReceiverLane } from "./hermes-bridge-receiver-queue";
import {
  HermesBridgeInMemoryReceiverQueue,
  sanitizedOperationKindsSignature,
  type HermesBridgeReceiverQueueSubmitOutcome,
} from "./hermes-bridge-receiver-queue";

export type HermesConnectionAdapterOperationalKind = "in_memory";
export type HermesConnectionAdapterFutureKind =
  | "sandbox_file_handoff"
  | "stdin_stdout"
  | "real_hermes_process"
  | "socket"
  | "http"
  | "ipc";

export type HermesConnectionAdapterKind =
  | HermesConnectionAdapterOperationalKind
  | HermesConnectionAdapterFutureKind;

export interface HermesConnectionAdapterError {
  code: string;
  message: string;
}

export interface HermesConnectionAdapterSummary {
  adapterKind: HermesConnectionAdapterOperationalKind;
  payloadSchemaVersionMatched: boolean;
  taskIdBrief?: string;
  operationCount: number;
  partialEligible: boolean;
  interactionModeLabel: "dry_run" | "production_stub" | "production_default";
  tierSummaryLabel: string;
  diagnostics: readonly string[];
}

export interface HermesConnectionAdapterInput {
  kind: HermesConnectionAdapterKind;
  payloadWire: unknown;
}

export interface HermesConnectionAdapterAccepted {
  status: "accepted";
  summary: HermesConnectionAdapterSummary;
  enqueuePayload: HermesBridgePayload;
}

export interface HermesConnectionAdapterRejected {
  status: "rejected";
  errors: HermesConnectionAdapterError[];
  summary: HermesConnectionAdapterSummary;
}

export type HermesConnectionAdapterResult =
  | HermesConnectionAdapterAccepted
  | HermesConnectionAdapterRejected;

export interface HermesConnectionAdapter {
  readonly adapterKind: HermesConnectionAdapterOperationalKind;
  submit(payloadWire: unknown): HermesConnectionAdapterResult;
}

const MAX_DIAG = 16;
const TASK_BRIEF = 48;

function tierCountsLabel(ops: HermesBridgeOperation[]): string {
  const r = { allowed: 0, blocked: 0, bridgeApproval: 0, forbidden: 0 };
  for (const op of ops) {
    const t = routeHermesOperation(op).tier;
    if (t === "allowed_zone_candidate") r.allowed += 1;
    else if (t === "blocked_zone_sensitive") r.blocked += 1;
    else if (t === "bridge_requires_approval") r.bridgeApproval += 1;
    else r.forbidden += 1;
  }
  return `a:${r.allowed},b:${r.blocked},ap:${r.bridgeApproval},f:${r.forbidden}`;
}

function normalizeTaskIdBrief(taskId: string): string | undefined {
  const t = taskId.trim();
  if (!t) return undefined;
  if (t.length <= TASK_BRIEF) return t;
  return `${t.slice(0, TASK_BRIEF - 1)}…`;
}

function emptyDiagnostics(): readonly string[] {
  return Object.freeze([]);
}

export function rejectUnsupportedHermesConnectionAdapterKind(
  kind: HermesConnectionAdapterKind,
): HermesConnectionAdapterError | null {
  if (kind !== "in_memory") {
    return {
      code: "UNSUPPORTED_ADAPTER_KIND",
      message: `only in_memory adapter is implemented (got=${kind})`,
    };
  }
  return null;
}

function buildRejectedSummaryPartial(input: {
  diagnostics: readonly string[];
}): HermesConnectionAdapterSummary {
  return {
    adapterKind: "in_memory",
    payloadSchemaVersionMatched: false,
    taskIdBrief: undefined,
    operationCount: 0,
    partialEligible: false,
    interactionModeLabel: "production_default",
    tierSummaryLabel: "",
    diagnostics: [...input.diagnostics.slice(0, MAX_DIAG)],
  };
}

export function summarizeHermesConnectionAdapterResult(
  result: HermesConnectionAdapterResult,
): HermesConnectionAdapterSummary {
  return result.summary;
}

export function normalizeHermesConnectionAdapterResult(
  result: HermesConnectionAdapterResult,
): HermesConnectionAdapterResult {
  if (result.status === "accepted") {
    return {
      ...result,
      summary: {
        ...result.summary,
        diagnostics: [...result.summary.diagnostics],
      },
    };
  }
  return {
    ...result,
    errors: result.errors.map((e) => ({ ...e })),
    summary: {
      ...result.summary,
      diagnostics: [...result.summary.diagnostics],
    },
  };
}

function mapValidationToErrors(
  v: HermesBridgePayloadValidationResult,
): HermesConnectionAdapterError[] {
  return v.errors.map((e) => ({
    code: e.code,
    message: e.message.length > 240 ? `${e.message.slice(0, 239)}…` : e.message,
  }));
}

export function validateHermesConnectionAdapterInput(
  input: HermesConnectionAdapterInput,
): HermesConnectionAdapterResult {
  const unsupported = rejectUnsupportedHermesConnectionAdapterKind(input.kind);
  if (unsupported) {
    return {
      status: "rejected",
      errors: [unsupported],
      summary: buildRejectedSummaryPartial({
        diagnostics: [unsupported.code],
      }),
    };
  }

  const validated = validateHermesBridgePayload(input.payloadWire);

  if (!validated.ok || !validated.normalizedPayload) {
    const errs = mapValidationToErrors(validated);
    const codes = validated.errors.slice(0, MAX_DIAG).map((e) => e.code);
    return {
      status: "rejected",
      errors: errs.slice(0, MAX_DIAG),
      summary: buildRejectedSummaryPartial({ diagnostics: codes }),
    };
  }

  const p = validated.normalizedPayload;
  const im = p.interactionMode ?? "production_stub";
  const partialEligible =
    validated.partialEligible === true && validated.ok === true
      ? validated.partialEligible
      : false;

  const summary: HermesConnectionAdapterSummary = {
    adapterKind: "in_memory",
    payloadSchemaVersionMatched: true,
    taskIdBrief: normalizeTaskIdBrief(p.taskId),
    operationCount: p.requestedOperations.length,
    partialEligible,
    interactionModeLabel: im === "dry_run" ? "dry_run" : "production_stub",
    tierSummaryLabel: tierCountsLabel(p.requestedOperations),
    diagnostics: emptyDiagnostics(),
  };

  const okValidated = validated as HermesBridgePayloadValidationResult & {
    ok: true;
    normalizedPayload: HermesBridgePayload;
  };

  return {
    status: "accepted",
    summary,
    enqueuePayload: okValidated.normalizedPayload,
  };
}

export function createInMemoryHermesConnectionAdapter(): HermesConnectionAdapter {
  return {
    adapterKind: "in_memory",
    submit(payloadWire: unknown): HermesConnectionAdapterResult {
      return validateHermesConnectionAdapterInput({
        kind: "in_memory",
        payloadWire,
      });
    },
  };
}

export function validateAdapterResultForReceiverQueue(
  result: HermesConnectionAdapterResult,
  lane: HermesBridgeReceiverLane,
): { ok: true } | { ok: false; reasons: string[] } {
  if (result.status !== "accepted") {
    return { ok: false, reasons: ["adapter_not_accepted"] };
  }
  const im = result.enqueuePayload.interactionMode ?? "production_stub";

  if (lane === "production_fail_closed") {
    if (im === "dry_run")
      return {
        ok: false,
        reasons: ["production_lane forbids interactionMode=dry_run"],
      };

    const p = result.enqueuePayload;

    if (
      p.allowPartialOnForbidden === true ||
      p.continueAfterForbiddenClassification === true ||
      p.dryRunContinuationMode !== undefined
    ) {
      return {
        ok: false,
        reasons: ["production_lane forbids partial/dry-run knobs"],
      };
    }
    return { ok: true };
  }

  if (lane === "dry_run_lab") {
    if (im !== "dry_run")
      return {
        ok: false,
        reasons: ["dry_run_lab_requires_interactionMode_dry_run"],
      };
    return { ok: true };
  }

  return { ok: false, reasons: ["invalid_lane"] };
}

export function summarizeAdapterResultForReceiverQueue(
  adapterResult: HermesConnectionAdapterResult,
): string {
  if (adapterResult.status !== "accepted") {
    return `[adapter:${adapterResult.status}] ${adapterResult.summary.diagnostics.join(";")}`;
  }

  const s = adapterResult.summary;
  const opSig = sanitizedOperationKindsSignature(
    adapterResult.enqueuePayload.requestedOperations,
  );
  return `[adapter:in_memory accepted] taskBrief=${s.taskIdBrief ?? "?"}\nopCount=${adapterResult.enqueuePayload.requestedOperations.length}\ntier=${s.tierSummaryLabel}\nopKinds=${opSig}`;
}

export function enqueueHermesInboundFromAcceptedAdapter(options: {
  queue: HermesBridgeInMemoryReceiverQueue;
  nowUnixMs: number;
  accepted: HermesConnectionAdapterAccepted;
}): HermesBridgeReceiverQueueSubmitOutcome {
  return options.queue.submitInbound(
    options.accepted.enqueuePayload,
    options.nowUnixMs,
  );
}

export function enqueueViaAdapterLanePipeline(options: {
  queue: HermesBridgeInMemoryReceiverQueue;
  nowUnixMs: number;
  adapterResult: HermesConnectionAdapterResult;
}): HermesBridgeReceiverQueueSubmitOutcome {
  const { queue, nowUnixMs, adapterResult } = options;
  if (adapterResult.status !== "accepted") {
    return {
      outcome: "rejected",
      reason: "VALIDATION_FAILED",
      diagnostics: ["adapter_result_not_accepted"],
    };
  }

  const lane = queue.getLane();
  const v = validateAdapterResultForReceiverQueue(adapterResult, lane);
  if (!v.ok)
    return {
      outcome: "rejected",
      reason: "LANE_REJECTED",
      diagnostics: v.reasons,
      taskIdGuess: adapterResult.enqueuePayload.taskId,
    };

  return enqueueHermesInboundFromAcceptedAdapter({
    queue,
    nowUnixMs,
    accepted: adapterResult,
  });
}
