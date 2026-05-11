import { checkDenylist } from "./denylist";
import { checkZonePath } from "./path-guard";
import type {
  ReadPermissionCheckInput,
  ReadPermissionCheckResult,
} from "./types";

export function checkReadAllowed(
  input: ReadPermissionCheckInput,
): ReadPermissionCheckResult {
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

  return {
    ok: true,
    normalizedPath: pathResult.normalizedPath,
    realPath: pathResult.realPath,
    relativePath: pathResult.relativePath,
    reasonCode: null,
    reason: null,
  };
}
