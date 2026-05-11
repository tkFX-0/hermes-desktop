/**
 * Hermes inbound を想定したインメモリ受信キュー（実 Hermes 未接続）。
 * raw JSON 文字列・ユーザー本文長文・zone_write 本文は永続しない（pending/in-flight 中のみ短命に保持）。
 *
 * dequeue の validated を Renderer/Snapshot にそのまま渡さない — `docs/ichikishima/HERMES_BRIDGE_RECEIVER_QUEUE_CONTRACT.md`。
 */

import { createHash, randomUUID } from "node:crypto";

import {
  routeHermesOperation,
  type HermesBridgeOperation,
} from "./hermes-bridge";
import {
  HERMES_BRIDGE_PAYLOAD_DEFAULT_LIMITS,
  HERMES_BRIDGE_PAYLOAD_SCHEMA_VERSION_V1,
  validateHermesBridgePayload,
  type HermesBridgePayload,
  type HermesBridgePayloadInteractionMode,
  type HermesBridgePayloadValidationOptions,
  type HermesBridgePayloadValidationResult,
} from "./hermes-bridge-payload";

export type HermesBridgeReceiverLane = "production_fail_closed" | "dry_run_lab";

export interface HermesBridgeReceiverDequeuedMessage {
  itemId: string;
  taskId: string;
  receivedAtUnixMs: number;
  processingAttemptNumber: number;
  validated: HermesBridgePayloadValidationResult & {
    ok: true;
    normalizedPayload: HermesBridgePayload;
  };
}

export interface HermesBridgeReceiverQueueEnvelope {
  itemId: string;
  sanitizedFingerprintHex16: string;
  tierCountsLabel: string;
  operationKindsLabel: string;
  operationCount: number;
}

export interface HermesBridgeReceiverQueueAccepted {
  outcome: "accepted";
  envelope: HermesBridgeReceiverQueueEnvelope;
}

export type HermesBridgeReceiverRejectReason =
  | "MALFORMED_OR_PARSE"
  | "PAYLOAD_OVERSIZED"
  | "UNSUPPORTED_SCHEMA_VERSION"
  | "VALIDATION_FAILED"
  | "DUPLICATE_TASK_ID_ACTIVE"
  | "QUEUE_CAPACITY"
  | "LANE_REJECTED";

export interface HermesBridgeReceiverQueueRejected {
  outcome: "rejected";
  reason: HermesBridgeReceiverRejectReason;
  diagnostics: string[];
  taskIdGuess?: string;
}

export type HermesBridgeReceiverQueueSubmitOutcome =
  | HermesBridgeReceiverQueueAccepted
  | HermesBridgeReceiverQueueRejected;

export interface HermesBridgeReceiverQueueLimits {
  maxQueueItems: number;
  /** dequeue 処理試行ごとに増加し、この回数を超えたメッセージは破棄（fail-closed）。 */
  maxProcessingAttemptsBeforeDead: number;
  messageTtlMs: number;
  inboundMaxUtf8Bytes: number;
  validationOverrides?: HermesBridgePayloadValidationOptions;
}

export const HERMES_BRIDGE_RECEIVER_QUEUE_DEFAULT_LIMITS: HermesBridgeReceiverQueueLimits =
  {
    maxQueueItems: 64,
    maxProcessingAttemptsBeforeDead: 3,
    messageTtlMs: 300_000,
    inboundMaxUtf8Bytes:
      HERMES_BRIDGE_PAYLOAD_DEFAULT_LIMITS.maxPayloadUtf8Bytes,
  };

interface StoredMessage {
  itemId: string;
  taskId: string;
  state: "pending" | "in_flight";
  receivedAtUnixMs: number;
  lastTouchUnixMs: number;
  expiresAtUnixMs: number;
  /** dequeue のたびに +1 — 処理成功時までリセットしない */
  processingAttempts: number;
  validated?:
    | (HermesBridgePayloadValidationResult & {
        ok: true;
        normalizedPayload: HermesBridgePayload;
      })
    | undefined;
}

function utf8bytes(value: string): number {
  return Buffer.byteLength(value, "utf8");
}

export function sanitizedOperationKindsSignature(
  operations: HermesBridgeOperation[],
): string {
  return operations
    .map((op) => {
      if (op.kind === "zone_write") return `zone_write:${op.requestedPath}`;
      if (op.kind === "zone_read") return `zone_read:${op.requestedPath}`;
      if (op.kind === "zone_delete") return `zone_delete:${op.requestedPath}`;
      return op.kind;
    })
    .join("|");
}

function tierCounts(ops: HermesBridgeOperation[]): {
  allowed: number;
  blocked: number;
  bridgeApproval: number;
  forbidden: number;
} {
  const r = {
    allowed: 0,
    blocked: 0,
    bridgeApproval: 0,
    forbidden: 0,
  };
  for (const op of ops) {
    const t = routeHermesOperation(op).tier;
    if (t === "allowed_zone_candidate") r.allowed += 1;
    else if (t === "blocked_zone_sensitive") r.blocked += 1;
    else if (t === "bridge_requires_approval") r.bridgeApproval += 1;
    else r.forbidden += 1;
  }
  return r;
}

function fingerprint16FromPayload(p: HermesBridgePayload): string {
  const base = `${p.taskId}:${p.actor}:${sanitizedOperationKindsSignature(p.requestedOperations)}`;
  return createHash("sha256").update(base, "utf8").digest("hex").slice(0, 16);
}

/** JSON で schema ヒントのみ。 */
export function readInboundPayloadSchemaHint(
  input: Record<string, unknown>,
): string {
  const v = input.payloadSchemaVersion;
  return typeof v === "string" ? v.trim() : "";
}

/** キュー項目の短文メタ（本文・zone_write は含めない）。 */
export function buildHermesBridgeReceiverEnvelope(
  itemId: string,
  validated: HermesBridgePayloadValidationResult & {
    ok: true;
    normalizedPayload: HermesBridgePayload;
  },
): HermesBridgeReceiverQueueEnvelope {
  const p = validated.normalizedPayload;
  const tc = tierCounts(p.requestedOperations);
  return {
    itemId,
    sanitizedFingerprintHex16: fingerprint16FromPayload(p),
    tierCountsLabel: `a:${tc.allowed},b:${tc.blocked},ap:${tc.bridgeApproval},f:${tc.forbidden}`,
    operationKindsLabel: sanitizedOperationKindsSignature(
      p.requestedOperations,
    ),
    operationCount: p.requestedOperations.length,
  };
}

export class HermesBridgeInMemoryReceiverQueue {
  private readonly lane: HermesBridgeReceiverLane;
  private readonly limits: HermesBridgeReceiverQueueLimits;
  private readonly fifo: StoredMessage[] = [];
  private readonly activeTaskIds = new Set<string>();

  public constructor(init: {
    lane: HermesBridgeReceiverLane;
    limits?: Partial<HermesBridgeReceiverQueueLimits>;
  }) {
    this.lane = init.lane;
    this.limits = {
      ...HERMES_BRIDGE_RECEIVER_QUEUE_DEFAULT_LIMITS,
      ...(init.limits ?? {}),
    };
  }

  public pruneExpired(nowUnixMs: number): void {
    for (let i = this.fifo.length - 1; i >= 0; i -= 1) {
      const m = this.fifo[i];

      const timedOutPending =
        m.state === "pending" && m.expiresAtUnixMs <= nowUnixMs;
      const timedOutInflight =
        m.state === "in_flight" && m.expiresAtUnixMs <= nowUnixMs;
      const stalledPending =
        m.state === "pending" &&
        m.processingAttempts >= this.limits.maxProcessingAttemptsBeforeDead;

      if (timedOutPending || timedOutInflight || stalledPending) {
        this.activeTaskIds.delete(m.taskId);
        m.validated = undefined;
        this.fifo.splice(i, 1);
      }
    }
  }

  public submitInbound(
    input: unknown,
    nowUnixMs: number,
  ): HermesBridgeReceiverQueueSubmitOutcome {
    this.pruneExpired(nowUnixMs);

    let wiredSize = "";
    try {
      wiredSize = typeof input === "string" ? input : JSON.stringify(input);
    } catch {
      return {
        outcome: "rejected",
        reason: "MALFORMED_OR_PARSE",
        diagnostics: ["json stringify failure"],
      };
    }

    if (utf8bytes(wiredSize) > this.limits.inboundMaxUtf8Bytes)
      return {
        outcome: "rejected",
        reason: "PAYLOAD_OVERSIZED",
        diagnostics: [`limit=${this.limits.inboundMaxUtf8Bytes}`],
      };

    let parsed: Record<string, unknown>;
    try {
      const root =
        typeof input === "string"
          ? (JSON.parse(input) as unknown)
          : typeof input === "object" && input !== null && !Array.isArray(input)
            ? input
            : undefined;
      if (!root || typeof root !== "object" || Array.isArray(root))
        return {
          outcome: "rejected",
          reason: "MALFORMED_OR_PARSE",
          diagnostics: ["root must be plain object"],
        };
      parsed = root as Record<string, unknown>;
    } catch {
      return {
        outcome: "rejected",
        reason: "MALFORMED_OR_PARSE",
        diagnostics: ["json parse failure"],
      };
    }

    const taskIdGuess =
      typeof parsed.taskId === "string" ? parsed.taskId.trim() : undefined;

    if (
      readInboundPayloadSchemaHint(parsed) !==
      HERMES_BRIDGE_PAYLOAD_SCHEMA_VERSION_V1
    )
      return {
        outcome: "rejected",
        reason: "UNSUPPORTED_SCHEMA_VERSION",
        diagnostics: [
          `expected exactly ${HERMES_BRIDGE_PAYLOAD_SCHEMA_VERSION_V1}`,
        ],
        taskIdGuess,
      };

    const validatedFull = validateHermesBridgePayload(
      parsed,
      this.limits.validationOverrides,
    );

    if (!validatedFull.ok || validatedFull.normalizedPayload === null) {
      return {
        outcome: "rejected",
        reason: "VALIDATION_FAILED",
        diagnostics: validatedFull.errors.slice(0, 24).map((e) => e.code),
        taskIdGuess,
      };
    }

    const normalized = validatedFull.normalizedPayload;
    const im: HermesBridgePayloadInteractionMode =
      normalized.interactionMode ?? "production_stub";

    if (this.lane === "production_fail_closed") {
      if (im === "dry_run")
        return {
          outcome: "rejected",
          reason: "LANE_REJECTED",
          diagnostics: ["production forbids interactionMode=dry_run"],
          taskIdGuess: normalized.taskId,
        };

      if (
        normalized.allowPartialOnForbidden === true ||
        normalized.continueAfterForbiddenClassification === true ||
        normalized.dryRunContinuationMode !== undefined
      )
        return {
          outcome: "rejected",
          reason: "LANE_REJECTED",
          diagnostics: ["production forbids explicit partial/dry-run knobs"],
          taskIdGuess: normalized.taskId,
        };
    } else if (this.lane === "dry_run_lab") {
      if (im !== "dry_run")
        return {
          outcome: "rejected",
          reason: "LANE_REJECTED",
          diagnostics: ["dry_run_lab lane requires interactionMode=dry_run"],
          taskIdGuess: normalized.taskId,
        };
    }

    const activeWorking = this.fifo.filter(
      (m) => m.state === "pending" || m.state === "in_flight",
    );

    if (activeWorking.length >= this.limits.maxQueueItems)
      return {
        outcome: "rejected",
        reason: "QUEUE_CAPACITY",
        diagnostics: [`max=${this.limits.maxQueueItems}`],
        taskIdGuess: normalized.taskId,
      };

    if (this.activeTaskIds.has(normalized.taskId))
      return {
        outcome: "rejected",
        reason: "DUPLICATE_TASK_ID_ACTIVE",
        diagnostics: [`active taskId collision`],
        taskIdGuess: normalized.taskId,
      };

    const itemId = randomUUID();

    const okValidated = validatedFull as HermesBridgePayloadValidationResult & {
      ok: true;
      normalizedPayload: HermesBridgePayload;
    };

    const stored: StoredMessage = {
      itemId,
      taskId: normalized.taskId,
      state: "pending",
      receivedAtUnixMs: nowUnixMs,
      lastTouchUnixMs: nowUnixMs,
      expiresAtUnixMs: nowUnixMs + this.limits.messageTtlMs,
      processingAttempts: 0,
      validated: okValidated,
    };

    this.fifo.push(stored);
    this.activeTaskIds.add(normalized.taskId);

    return {
      outcome: "accepted",
      envelope: buildHermesBridgeReceiverEnvelope(itemId, okValidated),
    };
  }

  public dequeueOrUndefined(
    nowUnixMs: number,
  ): HermesBridgeReceiverDequeuedMessage | undefined {
    this.pruneExpired(nowUnixMs);
    const next = this.fifo.find((m) => {
      if (m.state !== "pending" || !m.validated) return false;
      if (m.processingAttempts >= this.limits.maxProcessingAttemptsBeforeDead)
        return false;
      if (m.expiresAtUnixMs <= nowUnixMs) return false;
      return true;
    });
    if (!next?.validated) return undefined;

    next.state = "in_flight";
    next.lastTouchUnixMs = nowUnixMs;
    next.processingAttempts += 1;

    return {
      itemId: next.itemId,
      taskId: next.taskId,
      receivedAtUnixMs: next.receivedAtUnixMs,
      processingAttemptNumber: next.processingAttempts,
      validated: next.validated as HermesBridgePayloadValidationResult & {
        ok: true;
        normalizedPayload: HermesBridgePayload;
      },
    };
  }

  public acknowledgeHandled(
    itemId: string,
    nowUnixMs: number,
    disposition:
      | "completed_ok"
      | "discard_permanent_failure"
      | "transient_retry",
  ): "ok" | "unknown_item" | "dead_exhausted" {
    const idx = this.fifo.findIndex((m) => m.itemId === itemId);
    if (idx < 0) return "unknown_item";

    const msg = this.fifo[idx];
    msg.lastTouchUnixMs = nowUnixMs;

    if (
      disposition === "completed_ok" ||
      disposition === "discard_permanent_failure"
    ) {
      this.activeTaskIds.delete(msg.taskId);
      msg.validated = undefined;
      this.fifo.splice(idx, 1);
      return "ok";
    }

    /** transient_retry */
    if (msg.processingAttempts >= this.limits.maxProcessingAttemptsBeforeDead) {
      this.activeTaskIds.delete(msg.taskId);
      msg.validated = undefined;
      this.fifo.splice(idx, 1);
      return "dead_exhausted";
    }

    msg.state = "pending";
    msg.expiresAtUnixMs = nowUnixMs + this.limits.messageTtlMs;
    msg.lastTouchUnixMs = nowUnixMs;
    return "ok";
  }

  public getActiveQueueDepth(): number {
    return this.fifo.filter(
      (m) => m.state === "pending" || m.state === "in_flight",
    ).length;
  }

  public getLane(): HermesBridgeReceiverLane {
    return this.lane;
  }
}
