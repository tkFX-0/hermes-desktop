/**
 * Hermes が送ることを想定する Bridge Payload の契約検証のみ（実Hermes未接続）。
 * FS / ネットワーク / ipcMain は呼ばない。
 *
 * validated をログ/UI/Control Center Snapshot に丸ごと渡さない — `docs/ichikishima/HERMES_BRIDGE_PAYLOAD_CONTRACT.md` §15、`HERMES_BRIDGE_RECEIVER_QUEUE_CONTRACT.md`。
 */

import type { RunHermesLocalPilotTaskInput } from "./hermes-local-pilot";
import {
  routeHermesOperation,
  type HermesBridgeOperation,
} from "./hermes-bridge";

/** Control Center Snapshot の ipcBinding 「v1」とは名前空間が異なる — Hermes ingress のみこの文字列で固定する。 */
export const HERMES_BRIDGE_PAYLOAD_SCHEMA_VERSION_V1 =
  "hermes-bridge-payload/v1" as const;

export type HermesBridgePayloadInteractionMode = "dry_run" | "production_stub";

/** dry-run で mixed forbidden を許すラボ専用。本番送信禁止（契約書参照）。 */
export type HermesBridgeDryRunContinuationMode = "mixed_forbidden_audit";

export interface HermesBridgePayload {
  payloadSchemaVersion: typeof HERMES_BRIDGE_PAYLOAD_SCHEMA_VERSION_V1;
  taskId: string;
  title: string;
  description: string;
  actor: RunHermesLocalPilotTaskInput["actor"];
  interactionMode?: HermesBridgePayloadInteractionMode;
  allowPartialOnForbidden?: boolean;
  continueAfterForbiddenClassification?: boolean;
  dryRunContinuationMode?: HermesBridgeDryRunContinuationMode;
  requestedOperations: HermesBridgeOperation[];
  sampleInputRelativePath?: string;
  outputRelativePath?: string;
}

export const HERMES_BRIDGE_PAYLOAD_DEFAULT_LIMITS = {
  maxOperations: 32,
  maxPayloadUtf8Bytes: 65536,
  maxTitleLength: 280,
  maxDescriptionLength: 12000,
  maxTaskIdLength: 96,
} as const;

export interface HermesBridgePayloadValidationOptions {
  maxOperations?: number;
  maxPayloadUtf8Bytes?: number;
  maxTitleLength?: number;
  maxDescriptionLength?: number;
  maxTaskIdLength?: number;
}

export type HermesBridgePayloadValidationErrorCode =
  | "MALFORMED_PAYLOAD"
  | "MISSING_REQUIRED_FIELD"
  | "INVALID_FIELD_TYPE"
  | "UNSUPPORTED_SCHEMA_VERSION"
  | "UNKNOWN_OPERATION_KIND"
  | "INVALID_OPERATION_SHAPE"
  | "INVALID_RELATIVE_PATH"
  | "OPERATIONS_LIMIT_EXCEEDED"
  | "PAYLOAD_SIZE_LIMIT_EXCEEDED"
  | "INVALID_ACTOR"
  | "INVALID_INTERACTION_MODE"
  | "INVALID_DRY_RUN_CONTINUATION_MODE"
  | "SUSPICIOUS_CONTENT";

export interface HermesBridgePayloadValidationError {
  code: HermesBridgePayloadValidationErrorCode;
  message: string;
  field?: string;
}

export interface HermesBridgePayloadValidationResult {
  ok: boolean;
  errors: HermesBridgePayloadValidationError[];
  normalizedPayload: HermesBridgePayload | null;
  operations: HermesBridgeOperation[];
  /** production_stub では常に false。dry_run でも compute で満たさなければ false */
  partialEligible: boolean;
}

function bytesUtf8(body: string): number {
  return Buffer.byteLength(body, "utf8");
}

/** zone 後段 guard に渡すまでのヒューリスティックのみ（raw fs は行わない） */
export function assertSafeHermesBridgeRelativePath(
  value: unknown,
): value is string {
  if (typeof value !== "string" || value.length === 0) return false;
  if (value.length > 1024) return false;
  if (value.includes("..")) return false;
  for (let i = 0; i < value.length; i += 1) {
    const cc = value.charCodeAt(i);
    if (cc <= 31 || cc === 127) return false;
  }
  if (value.startsWith("/")) return false;
  if (/^[a-zA-Z]:[\\/]/.test(value)) return false;
  if (value.includes("\\")) return false;
  if (/\.env(\.|$|\/)/i.test(value)) return false;
  return true;
}

const SUSPICIOUS_SERIALIZED_PATTERNS: ReadonlyArray<RegExp> = [
  /\.env\b/i,
  /\bBearer\s+[A-Za-z0-9._-]{20,}\b/i,
  /\b(sk_(live|test)_[a-zA-Z0-9]{16,})\b/i,
  /\bAKIA[A-Z0-9]{14,}\b/,
  /OPENAI[_-]?API[_-]?KEY\s*=/i,
  /AWS_SECRET_ACCESS_KEY\s*=/i,
  // JSON.stringify が改行を \\n と出すため、\b だけでは "...nPASSWORD..." を拾えない
  /\x5cnPASSWORD\s*=\s*[^\s"',\\]{2,}\b/i,
  /\nPASSWORD\s*=\s*[^\s"',\\]{2,}\b/i,
  /\b(API_KEY|PRIVATE_KEY|PASSWORD|CLIENT_SECRET|ACCESS_TOKEN|PRIVATE_TOKEN)\s*=\s*[^\s"',[\]\\]{2,}\b/i,
  /-----BEGIN [A-Z ]+PRIVATE KEY-----/i,
];

function payloadLooksSuspicious(serializedJson: string): boolean {
  for (const p of SUSPICIOUS_SERIALIZED_PATTERNS) {
    if (p.test(serializedJson)) return true;
  }
  return false;
}

const HARD_PARTIAL_BLOCK_OPERATION_KINDS = new Set<
  HermesBridgeOperation["kind"]
>([
  "memory_db_access",
  "mt5_ea_access",
  "env_secret_read",
  "production_config_write",
  "raw_fs",
  "raw_child_process",
  "raw_network",
  "raw_git",
]);

function operationHasHardPartialBlock(op: HermesBridgeOperation): boolean {
  if (HARD_PARTIAL_BLOCK_OPERATION_KINDS.has(op.kind)) return true;
  return (
    op.kind === "dependency_install" && op.disposition === "policy_blocked"
  );
}

function routedHasForbidden(ops: HermesBridgeOperation[]): boolean {
  for (const op of ops) {
    if (routeHermesOperation(op).tier === "forbidden_boundary") return true;
  }
  return false;
}

/**
 * 「partial で forbidden を混在分類」を許していい検証済み Payload か。
 * `production_stub` では常に false（将来 Hermes-facing もこの前提）。
 */
export function computeHermesBridgePartialEligible(
  payload: HermesBridgePayload,
  operations: HermesBridgeOperation[],
): boolean {
  if (payload.interactionMode !== "dry_run") return false;
  if (payload.actor !== "ichikishima") return false;
  if (payload.allowPartialOnForbidden !== true) return false;
  if (!routedHasForbidden(operations)) return false;

  const hard = operations.some((o) => operationHasHardPartialBlock(o));
  if (hard) return payload.dryRunContinuationMode === "mixed_forbidden_audit";

  return true;
}

function err(
  code: HermesBridgePayloadValidationErrorCode,
  message: string,
  field?: string,
): HermesBridgePayloadValidationError {
  return { code, message, field };
}

function finalize(params: {
  errors: HermesBridgePayloadValidationError[];
  normalized: HermesBridgePayload | null;
  operations: HermesBridgeOperation[];
}): HermesBridgePayloadValidationResult {
  const ok = params.errors.length === 0 && params.normalized !== null;
  return {
    ok,
    errors: params.errors,
    normalizedPayload: ok ? params.normalized : null,
    operations: ok ? params.operations : [],
    partialEligible:
      ok && params.normalized
        ? params.normalized.interactionMode === "dry_run"
          ? computeHermesBridgePartialEligible(
              params.normalized,
              params.operations,
            )
          : false
        : false,
  };
}

export function classifyHermesPayloadOperation(
  raw: unknown,
):
  | { ok: true; operation: HermesBridgeOperation }
  | { ok: false; reason: string } {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ok: false, reason: "operation is not an object" };
  }

  const r = raw as Record<string, unknown>;
  const kind = r.kind;
  if (typeof kind !== "string") {
    return { ok: false, reason: "operation.kind missing" };
  }

  switch (kind) {
    case "zone_read": {
      const p = r.requestedPath;
      if (!assertSafeHermesBridgeRelativePath(p)) {
        return { ok: false, reason: "zone_read.requestedPath invalid" };
      }
      return {
        ok: true,
        operation: { kind: "zone_read", requestedPath: p },
      };
    }

    case "zone_write": {
      const p = r.requestedPath;
      const c = r.content;
      if (!assertSafeHermesBridgeRelativePath(p)) {
        return { ok: false, reason: "zone_write.requestedPath invalid" };
      }
      if (typeof c !== "string") {
        return { ok: false, reason: "zone_write.content must be string" };
      }
      if (bytesUtf8(c) > 65536) {
        return {
          ok: false,
          reason: "zone_write.content exceeds per-operation body limit",
        };
      }
      return {
        ok: true,
        operation: {
          kind: "zone_write",
          requestedPath: p,
          content: c,
        },
      };
    }

    case "zone_delete": {
      const p = r.requestedPath;
      if (!assertSafeHermesBridgeRelativePath(p)) {
        return { ok: false, reason: "zone_delete.requestedPath invalid" };
      }
      return {
        ok: true,
        operation: { kind: "zone_delete", requestedPath: p },
      };
    }

    case "execute_shell": {
      const command = r.command;
      const argsRaw = r.args;
      if (typeof command !== "string" || command.length === 0) {
        return { ok: false, reason: "execute_shell.command invalid" };
      }
      let args: readonly string[] | undefined;
      if (argsRaw !== undefined) {
        if (!Array.isArray(argsRaw)) {
          return { ok: false, reason: "execute_shell.args must be array" };
        }
        for (const a of argsRaw) {
          if (typeof a !== "string") {
            return { ok: false, reason: "execute_shell.args must be strings" };
          }
        }
        args = Object.freeze(argsRaw.slice() as string[]);
      }
      return {
        ok: true,
        operation: {
          kind: "execute_shell",
          command,
          args,
        },
      };
    }

    case "network_http": {
      const url = r.url;
      if (typeof url !== "string" || url.length === 0 || url.length > 2048) {
        return { ok: false, reason: "network_http.url invalid" };
      }
      return { ok: true, operation: { kind: "network_http", url } };
    }

    case "git_operation": {
      const operation = r.operation;
      if (typeof operation !== "string" || operation.length === 0) {
        return { ok: false, reason: "git_operation.operation invalid" };
      }
      return {
        ok: true,
        operation: {
          kind: "git_operation",
          operation,
        },
      };
    }

    case "dependency_install": {
      const disposition = r.disposition;
      if (
        disposition !== undefined &&
        disposition !== "approval_queue" &&
        disposition !== "policy_blocked"
      ) {
        return { ok: false, reason: "dependency_install.disposition invalid" };
      }
      const detail = r.detail;
      if (
        detail !== undefined &&
        (typeof detail !== "string" || detail.length > 8000)
      ) {
        return { ok: false, reason: "dependency_install.detail invalid" };
      }
      return {
        ok: true,
        operation: {
          kind: "dependency_install",
          disposition,
          detail,
        } as HermesBridgeOperation,
      };
    }

    case "external_ai_escalation": {
      const detail = r.detail;
      if (
        detail !== undefined &&
        (typeof detail !== "string" || detail.length > 8000)
      ) {
        return {
          ok: false,
          reason: "external_ai_escalation.detail invalid",
        };
      }
      return {
        ok: true,
        operation: {
          kind: "external_ai_escalation",
          detail,
        },
      };
    }

    case "raw_fs":
    case "raw_child_process":
    case "raw_network":
    case "raw_git":
    case "memory_db_access":
    case "mt5_ea_access":
    case "env_secret_read":
    case "production_config_write": {
      const detail = r.detail;
      if (
        detail !== undefined &&
        (typeof detail !== "string" || detail.length > 8000)
      ) {
        return { ok: false, reason: `${kind}.detail invalid` };
      }
      return {
        ok: true,
        operation: { kind, detail } as HermesBridgeOperation,
      };
    }

    default:
      return {
        ok: false,
        reason: `UNKNOWN_OPERATION_KIND:${kind}`,
      };
  }
}

/** 許容される文字（taskId）は英数と `. _ -`。 */
export function isValidHermesBridgeTaskId(value: string): boolean {
  return value.length > 0 && /^[a-zA-Z0-9._-]+$/.test(value);
}

export function normalizeHermesBridgePayload(
  input: unknown,
  options?: HermesBridgePayloadValidationOptions,
): HermesBridgePayloadValidationResult {
  return validateHermesBridgePayload(input, options);
}

export function rejectMalformedHermesPayload(
  input: unknown,
  options?: HermesBridgePayloadValidationOptions,
): HermesBridgePayloadValidationResult {
  return validateHermesBridgePayload(input, options);
}

export function validateHermesBridgePayload(
  input: unknown,
  options?: HermesBridgePayloadValidationOptions,
): HermesBridgePayloadValidationResult {
  let serializedForSize = "";
  try {
    serializedForSize =
      typeof input === "string" ? input : JSON.stringify(input);
  } catch {
    return finalize({
      errors: [err("MALFORMED_PAYLOAD", "JSON serialization failed")],
      normalized: null,
      operations: [],
    });
  }

  const errs: HermesBridgePayloadValidationError[] = [];

  const maxOperations =
    options?.maxOperations ??
    HERMES_BRIDGE_PAYLOAD_DEFAULT_LIMITS.maxOperations;
  const maxBytes =
    options?.maxPayloadUtf8Bytes ??
    HERMES_BRIDGE_PAYLOAD_DEFAULT_LIMITS.maxPayloadUtf8Bytes;
  const maxTitle =
    options?.maxTitleLength ??
    HERMES_BRIDGE_PAYLOAD_DEFAULT_LIMITS.maxTitleLength;
  const maxDesc =
    options?.maxDescriptionLength ??
    HERMES_BRIDGE_PAYLOAD_DEFAULT_LIMITS.maxDescriptionLength;
  const maxTid =
    options?.maxTaskIdLength ??
    HERMES_BRIDGE_PAYLOAD_DEFAULT_LIMITS.maxTaskIdLength;

  if (bytesUtf8(serializedForSize) > maxBytes) {
    errs.push(err("PAYLOAD_SIZE_LIMIT_EXCEEDED", "payload too large"));
  }

  let parsedRoot: Record<string, unknown> | undefined;
  if (typeof input === "string") {
    try {
      const j = JSON.parse(input) as unknown;
      if (!j || typeof j !== "object" || Array.isArray(j)) {
        errs.push(err("MALFORMED_PAYLOAD", "root must be JSON object"));
      } else {
        parsedRoot = j as Record<string, unknown>;
      }
    } catch {
      errs.push(err("MALFORMED_PAYLOAD", "invalid JSON text"));
    }
  } else if (input && typeof input === "object" && !Array.isArray(input)) {
    parsedRoot = input as Record<string, unknown>;
  } else {
    errs.push(err("MALFORMED_PAYLOAD", "root must be object"));
  }

  if (errs.length > 0 || !parsedRoot) {
    return finalize({ errors: errs, normalized: null, operations: [] });
  }

  const rawVers =
    parsedRoot.payloadSchemaVersion !== undefined &&
    typeof parsedRoot.payloadSchemaVersion === "string"
      ? parsedRoot.payloadSchemaVersion.trim()
      : "";
  const taskIdRaw =
    typeof parsedRoot.taskId === "string" ? parsedRoot.taskId.trim() : "";
  const title =
    typeof parsedRoot.title === "string" ? parsedRoot.title.trim() : "";
  const description =
    typeof parsedRoot.description === "string"
      ? parsedRoot.description.trim()
      : "";

  const actorRaw =
    typeof parsedRoot.actor === "string" ? parsedRoot.actor.trim() : "";

  const interactionRaw = parsedRoot.interactionMode;
  let interactionMode: HermesBridgePayloadInteractionMode = "production_stub";
  if (interactionRaw !== undefined) {
    if (interactionRaw !== "dry_run" && interactionRaw !== "production_stub") {
      errs.push(
        err("INVALID_INTERACTION_MODE", "interactionMode unsupported", ""),
      );
    } else {
      interactionMode = interactionRaw;
    }
  }

  const allowPartialOnForbidden =
    typeof parsedRoot.allowPartialOnForbidden === "boolean"
      ? parsedRoot.allowPartialOnForbidden
      : undefined;

  const continueAfterForbiddenClassification =
    typeof parsedRoot.continueAfterForbiddenClassification === "boolean"
      ? parsedRoot.continueAfterForbiddenClassification
      : undefined;

  let dryRunContinuationMode: HermesBridgeDryRunContinuationMode | undefined;
  const dm = parsedRoot.dryRunContinuationMode;
  if (dm !== undefined) {
    if (dm !== "mixed_forbidden_audit") {
      errs.push(
        err(
          "INVALID_DRY_RUN_CONTINUATION_MODE",
          "dryRunContinuationMode unsupported",
        ),
      );
    } else {
      dryRunContinuationMode = dm;
    }
  }

  let sampleInputRelativePath: string | undefined;
  if (parsedRoot.sampleInputRelativePath !== undefined) {
    if (typeof parsedRoot.sampleInputRelativePath !== "string") {
      errs.push(err("INVALID_FIELD_TYPE", "sampleInputRelativePath", ""));
    } else {
      sampleInputRelativePath =
        parsedRoot.sampleInputRelativePath.trim() || undefined;
      if (
        sampleInputRelativePath &&
        !assertSafeHermesBridgeRelativePath(sampleInputRelativePath)
      ) {
        errs.push(
          err("INVALID_RELATIVE_PATH", "sampleInputRelativePath unsafe", ""),
        );
      }
    }
  }

  let outputRelativePath: string | undefined;
  if (parsedRoot.outputRelativePath !== undefined) {
    if (typeof parsedRoot.outputRelativePath !== "string") {
      errs.push(err("INVALID_FIELD_TYPE", "outputRelativePath", ""));
    } else {
      outputRelativePath = parsedRoot.outputRelativePath.trim() || undefined;
      if (
        outputRelativePath &&
        !assertSafeHermesBridgeRelativePath(outputRelativePath)
      ) {
        errs.push(
          err("INVALID_RELATIVE_PATH", "outputRelativePath unsafe", ""),
        );
      }
    }
  }

  const opsMaybe = parsedRoot.requestedOperations;
  const operations: HermesBridgeOperation[] = [];

  if (rawVers !== HERMES_BRIDGE_PAYLOAD_SCHEMA_VERSION_V1) {
    errs.push(err("UNSUPPORTED_SCHEMA_VERSION", "payloadSchemaVersion", ""));
  }

  const allowedActors = ["hermes", "user", "ichikishima", "system"] as const;
  if (!(allowedActors as readonly string[]).includes(actorRaw)) {
    errs.push(err("INVALID_ACTOR", "actor unsupported", "actor"));
  }

  if (!isValidHermesBridgeTaskId(taskIdRaw) || taskIdRaw.length > maxTid)
    errs.push(err("INVALID_FIELD_TYPE", "taskId invalid"));

  if (!title) errs.push(err("MISSING_REQUIRED_FIELD", "title required"));
  else if (title.length > maxTitle)
    errs.push(err("INVALID_FIELD_TYPE", "title too long"));

  if (!description)
    errs.push(err("MISSING_REQUIRED_FIELD", "description required"));
  else if (description.length > maxDesc)
    errs.push(err("INVALID_FIELD_TYPE", "description too long"));

  let opEntries = 0;
  if (!Array.isArray(opsMaybe)) {
    errs.push(err("INVALID_FIELD_TYPE", "requestedOperations must be array"));
  } else {
    opEntries = opsMaybe.length;
    if (opEntries > maxOperations) {
      errs.push(err("OPERATIONS_LIMIT_EXCEEDED", "too many operations"));
    }

    if (errs.length === 0) {
      for (let idx = 0; idx < opEntries; idx += 1) {
        const classified = classifyHermesPayloadOperation(opsMaybe[idx]);
        if (!classified.ok) {
          if (classified.reason.startsWith("UNKNOWN_OPERATION_KIND")) {
            errs.push(
              err(
                "UNKNOWN_OPERATION_KIND",
                classified.reason,
                `requestedOperations[${idx}]`,
              ),
            );
          } else {
            errs.push(
              err(
                "INVALID_OPERATION_SHAPE",
                classified.reason,
                `requestedOperations[${idx}]`,
              ),
            );
          }
          continue;
        }
        operations.push(classified.operation);
      }
    }
  }

  if (
    dryRunContinuationMode === "mixed_forbidden_audit" &&
    interactionMode !== "dry_run"
  ) {
    errs.push(
      err(
        "INVALID_DRY_RUN_CONTINUATION_MODE",
        "continuation mode requires interactionMode=dry_run",
      ),
    );
  }

  if (payloadLooksSuspicious(serializedForSize)) {
    errs.push(
      err(
        "SUSPICIOUS_CONTENT",
        "payload contains suspicious credential-like text",
      ),
    );
  }

  if (errs.length > 0) {
    return finalize({ errors: errs, normalized: null, operations: [] });
  }

  const normalizedPayload: HermesBridgePayload = {
    payloadSchemaVersion: HERMES_BRIDGE_PAYLOAD_SCHEMA_VERSION_V1,
    taskId: taskIdRaw,
    title,
    description,
    actor: actorRaw as RunHermesLocalPilotTaskInput["actor"],
    interactionMode,
    allowPartialOnForbidden,
    continueAfterForbiddenClassification,
    dryRunContinuationMode,
    requestedOperations: operations,
    sampleInputRelativePath,
    outputRelativePath,
  };

  return finalize({
    errors: [],
    normalized: normalizedPayload,
    operations,
  });
}

/** dry-run と Hermes メタのみを載せて Local Pilot と突き合わせる。 */
export function pilotInputToHermesBridgePayload(
  input: Pick<
    RunHermesLocalPilotTaskInput,
    | "taskId"
    | "title"
    | "description"
    | "actor"
    | "requestedOperations"
    | "sampleInputRelativePath"
    | "outputRelativePath"
    | "continueAfterForbiddenClassification"
  > & {
    interactionMode: HermesBridgePayloadInteractionMode;
    allowPartialOnForbidden?: boolean;
    dryRunContinuationMode?: HermesBridgeDryRunContinuationMode;
  },
): HermesBridgePayload {
  return {
    payloadSchemaVersion: HERMES_BRIDGE_PAYLOAD_SCHEMA_VERSION_V1,
    taskId: input.taskId,
    title: input.title,
    description: input.description,
    actor: input.actor,
    interactionMode: input.interactionMode,
    allowPartialOnForbidden: input.allowPartialOnForbidden ?? false,
    continueAfterForbiddenClassification:
      input.continueAfterForbiddenClassification === true,
    dryRunContinuationMode: input.dryRunContinuationMode,
    requestedOperations: input.requestedOperations ?? [],
    sampleInputRelativePath: input.sampleInputRelativePath,
    outputRelativePath: input.outputRelativePath,
  };
}
