import { existsSync, statSync } from "fs";
import { dirname } from "path";
import { checkDenylist } from "./denylist";
import { checkZonePath } from "./path-guard";
import type {
  WritePermissionCheckInput,
  WritePermissionCheckResult,
} from "./types";

export function checkWriteAllowed(
  input: WritePermissionCheckInput,
): WritePermissionCheckResult {
  const overwrite = input.overwrite ?? false;
  const createDirs = input.createDirs ?? false;
  const { contentBytes, maxBytes } = input;
  const hasMaxBytes = typeof maxBytes === "number";
  const hasContentBytes = typeof contentBytes === "number";

  if (
    (hasMaxBytes && (!Number.isFinite(maxBytes) || maxBytes <= 0)) ||
    (hasContentBytes && (!Number.isFinite(contentBytes) || contentBytes < 0))
  ) {
    return {
      ok: false,
      reasonCode: "INVALID_WRITE_OPTIONS",
      reason: "Write size options are invalid",
    };
  }

  if (hasMaxBytes && hasContentBytes && contentBytes > maxBytes) {
    return {
      ok: false,
      reasonCode: "FILE_TOO_LARGE",
      reason: "Write content exceeds maxBytes",
    };
  }

  const pathResult = checkZonePath({
    zoneRoot: input.zoneRoot,
    targetPath: input.targetPath,
    basePath: input.basePath,
  });

  if (!pathResult.ok) {
    return {
      ok: false,
      normalizedPath: pathResult.normalizedPath,
      realPath: pathResult.realPath,
      reasonCode: "DENIED_BY_PATH_GUARD",
      reason: pathResult.reason,
    };
  }

  const denylistResult = checkDenylist(pathResult.relativePath, input.policy);
  if (!denylistResult.ok) {
    return {
      ok: false,
      normalizedPath: pathResult.normalizedPath,
      realPath: pathResult.realPath,
      relativePath: pathResult.relativePath,
      reasonCode: "DENIED_BY_DENYLIST",
      reason: denylistResult.reason,
      matchedRule: denylistResult.matchedRule,
    };
  }

  if (existsSync(pathResult.realPath)) {
    const stat = statSync(pathResult.realPath);

    if (stat.isDirectory()) {
      return {
        ok: false,
        normalizedPath: pathResult.normalizedPath,
        realPath: pathResult.realPath,
        relativePath: pathResult.relativePath,
        reasonCode: "TARGET_IS_DIRECTORY",
        reason: "Write target is a directory",
      };
    }

    if (!overwrite) {
      return {
        ok: false,
        normalizedPath: pathResult.normalizedPath,
        realPath: pathResult.realPath,
        relativePath: pathResult.relativePath,
        reasonCode: "FILE_ALREADY_EXISTS",
        reason: "Write target already exists and overwrite is false",
      };
    }
  }

  const parentPath = dirname(pathResult.realPath);
  if (!existsSync(parentPath) && !createDirs) {
    return {
      ok: false,
      normalizedPath: pathResult.normalizedPath,
      realPath: pathResult.realPath,
      relativePath: pathResult.relativePath,
      reasonCode: "PARENT_DIRECTORY_MISSING",
      reason: "Parent directory is missing and createDirs is false",
    };
  }

  return {
    ok: true,
    normalizedPath: pathResult.normalizedPath,
    realPath: pathResult.realPath,
    relativePath: pathResult.relativePath,
    reasonCode: null,
    reason: null,
    overwrite,
    createDirs,
  };
}
