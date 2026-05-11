import { closeSync, openSync, readFileSync, readSync, statSync } from "fs";
import { checkReadAllowed } from "./read-policy";
import type {
  ReadAuditEventCandidate,
  ReadFailureReasonCode,
  ReadZoneFileInput,
  ReadZoneFileResult,
} from "./types";

const DEFAULT_READ_MAX_BYTES = 64 * 1024;
const BINARY_SNIFF_BYTES = 512;

function createAuditEventCandidate(
  input: ReadZoneFileInput,
  status: ReadAuditEventCandidate["status"],
  details: Omit<
    ReadAuditEventCandidate,
    | "action"
    | "actor"
    | "contentIncluded"
    | "requestId"
    | "status"
    | "timestamp"
  > = {},
): ReadAuditEventCandidate {
  return {
    requestId: input.requestId,
    actor: input.actor,
    action: "read",
    status,
    contentIncluded: false,
    timestamp: new Date().toISOString(),
    ...details,
  };
}

function isLikelyBinary(pathValue: string, bytesToRead: number): boolean {
  if (bytesToRead <= 0) return false;

  const fd = openSync(pathValue, "r");
  try {
    const buffer = Buffer.alloc(Math.min(bytesToRead, BINARY_SNIFF_BYTES));
    const bytesRead = readSync(fd, buffer, 0, buffer.length, 0);
    const sample = buffer.subarray(0, bytesRead);

    return sample.some((byte) => byte === 0);
  } finally {
    closeSync(fd);
  }
}

function safeFailure(
  input: ReadZoneFileInput,
  status: "denied" | "error",
  reasonCode: ReadFailureReasonCode,
  reason: string,
  normalizedPath?: string,
): ReadZoneFileResult {
  return {
    ok: false,
    normalizedPath,
    reasonCode,
    reason,
    content: null,
    auditEventCandidate: createAuditEventCandidate(input, status, {
      normalizedPath,
      reasonCode,
      reason,
    }),
  };
}

export function readZoneFile(input: ReadZoneFileInput): ReadZoneFileResult {
  const allowed = checkReadAllowed({
    zoneRoot: input.zoneRoot,
    targetPath: input.requestedPath,
  });

  if (!allowed.ok) {
    return {
      ok: false,
      normalizedPath: allowed.normalizedPath,
      reasonCode: allowed.reasonCode,
      reason: allowed.reason,
      content: null,
      auditEventCandidate: createAuditEventCandidate(input, "denied", {
        normalizedPath: allowed.normalizedPath,
        reasonCode: allowed.reasonCode,
        reason: allowed.reason,
      }),
    };
  }

  const encoding = input.encoding ?? "utf8";
  const maxBytes = input.maxBytes ?? DEFAULT_READ_MAX_BYTES;
  const allowBinary = input.allowBinary ?? false;

  if (encoding !== "utf8" || maxBytes <= 0) {
    return safeFailure(
      input,
      "denied",
      "INVALID_READ_OPTIONS",
      "Read options are invalid",
      allowed.normalizedPath,
    );
  }

  try {
    const stat = statSync(allowed.realPath);

    if (stat.isDirectory()) {
      return safeFailure(
        input,
        "denied",
        "TARGET_IS_DIRECTORY",
        "Read target is a directory",
        allowed.normalizedPath,
      );
    }

    if (!stat.isFile()) {
      return safeFailure(
        input,
        "error",
        "READ_FAILED",
        "Read target is not a regular file",
        allowed.normalizedPath,
      );
    }

    if (stat.size > maxBytes) {
      return safeFailure(
        input,
        "denied",
        "FILE_TOO_LARGE",
        "Read target exceeds maxBytes",
        allowed.normalizedPath,
      );
    }

    if (isLikelyBinary(allowed.realPath, stat.size)) {
      return safeFailure(
        input,
        "denied",
        "BINARY_NOT_ALLOWED",
        allowBinary
          ? "Binary file reading is not implemented"
          : "Binary files are not allowed",
        allowed.normalizedPath,
      );
    }

    const content = readFileSync(allowed.realPath, encoding);
    const bytesRead = Buffer.byteLength(content, encoding);

    return {
      ok: true,
      normalizedPath: allowed.normalizedPath,
      content,
      bytesRead,
      truncated: false,
      auditEventCandidate: createAuditEventCandidate(input, "success", {
        normalizedPath: allowed.normalizedPath,
        bytesRead,
        truncated: false,
      }),
    };
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error
        ? String(error.code)
        : "";
    const reasonCode = code === "ENOENT" ? "FILE_NOT_FOUND" : "READ_FAILED";

    return safeFailure(
      input,
      "error",
      reasonCode,
      reasonCode === "FILE_NOT_FOUND"
        ? "Read target was not found"
        : "Read failed",
      allowed.normalizedPath,
    );
  }
}
