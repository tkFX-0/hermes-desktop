import { existsSync, mkdirSync, writeFileSync } from "fs";
import { dirname } from "path";
import { checkWriteAllowed } from "./write-policy";
import type {
  WriteAuditEventCandidate,
  WriteFailureReasonCode,
  WriteZoneFileInput,
  WriteZoneFileResult,
} from "./types";

const DEFAULT_WRITE_MAX_BYTES = 64 * 1024;

function createAuditEventCandidate(
  input: WriteZoneFileInput,
  status: WriteAuditEventCandidate["status"],
  details: Omit<
    WriteAuditEventCandidate,
    | "action"
    | "actor"
    | "contentIncluded"
    | "requestId"
    | "status"
    | "timestamp"
  > = {},
): WriteAuditEventCandidate {
  return {
    requestId: input.requestId,
    actor: input.actor,
    action: "write",
    status,
    contentIncluded: false,
    timestamp: new Date().toISOString(),
    ...details,
  };
}

function safeFailure(
  input: WriteZoneFileInput,
  status: "denied" | "error",
  reasonCode: WriteFailureReasonCode,
  reason: string,
  normalizedPath?: string,
): WriteZoneFileResult {
  return {
    ok: false,
    normalizedPath,
    reasonCode,
    reason,
    bytesWritten: 0,
    auditEventCandidate: createAuditEventCandidate(input, status, {
      normalizedPath,
      reasonCode,
      reason,
      bytesWritten: 0,
    }),
  };
}

export function writeZoneFile(input: WriteZoneFileInput): WriteZoneFileResult {
  const encoding = input.encoding ?? "utf8";
  const maxBytes = input.maxBytes ?? DEFAULT_WRITE_MAX_BYTES;
  const overwrite = input.overwrite ?? false;
  const createDirs = input.createDirs ?? false;
  const contentBytes =
    encoding === "utf8" ? Buffer.byteLength(input.content, encoding) : 0;

  const allowed = checkWriteAllowed({
    zoneRoot: input.zoneRoot,
    targetPath: input.requestedPath,
    contentBytes,
    maxBytes,
    overwrite,
    createDirs,
  });

  if (!allowed.ok) {
    return safeFailure(
      input,
      "denied",
      allowed.reasonCode,
      allowed.reason,
      allowed.normalizedPath,
    );
  }

  if (encoding !== "utf8") {
    return safeFailure(
      input,
      "denied",
      "INVALID_WRITE_OPTIONS",
      "Write options are invalid",
      allowed.normalizedPath,
    );
  }

  const existedBeforeWrite = existsSync(allowed.realPath);

  try {
    if (createDirs) {
      mkdirSync(dirname(allowed.realPath), { recursive: true });
    }

    writeFileSync(allowed.realPath, input.content, {
      encoding,
      flag: overwrite ? "w" : "wx",
    });

    return {
      ok: true,
      normalizedPath: allowed.normalizedPath,
      bytesWritten: contentBytes,
      created: !existedBeforeWrite,
      overwritten: existedBeforeWrite,
      auditEventCandidate: createAuditEventCandidate(input, "success", {
        normalizedPath: allowed.normalizedPath,
        bytesWritten: contentBytes,
        created: !existedBeforeWrite,
        overwritten: existedBeforeWrite,
      }),
    };
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error
        ? String(error.code)
        : "";
    const reasonCode: WriteFailureReasonCode =
      code === "EEXIST" ? "FILE_ALREADY_EXISTS" : "WRITE_FAILED";

    return safeFailure(
      input,
      "error",
      reasonCode,
      reasonCode === "FILE_ALREADY_EXISTS"
        ? "Write target already exists"
        : "Write failed",
      allowed.normalizedPath,
    );
  }
}
