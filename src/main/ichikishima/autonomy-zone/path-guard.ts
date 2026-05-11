import { existsSync, realpathSync } from "fs";
import { dirname, isAbsolute, relative, resolve, sep } from "path";
import type { ZonePathCheckInput, ZonePathCheckResult } from "./types";

export function normalizePathForCompare(pathValue: string): string {
  const withoutWindowsLongPrefix = pathValue
    .replace(/^\\\\\?\\UNC\\/i, "\\\\")
    .replace(/^\\\\\?\\/i, "")
    .replace(/^\/\/\?\/UNC\//i, "//")
    .replace(/^\/\/\?\//i, "");
  const normalized = withoutWindowsLongPrefix.replace(/\\/g, "/").toLowerCase();
  return normalized.endsWith("/") && normalized.length > 1
    ? normalized.replace(/\/+$/, "")
    : normalized;
}

export function validatePathInput(
  rawPath: string,
  label = "Path",
):
  | {
      ok: false;
      reason: string;
      reasonCode: "invalid_path_input";
    }
  | undefined {
  if (!rawPath.trim()) {
    return {
      ok: false,
      reason: `${label} must not be empty`,
      reasonCode: "invalid_path_input",
    };
  }

  // eslint-disable-next-line no-control-regex
  if (/[\0-\x1f]/.test(rawPath)) {
    return {
      ok: false,
      reason: `${label} must not contain control characters`,
      reasonCode: "invalid_path_input",
    };
  }

  if (/(^|[\\/])(~|%[^%]+%|\$[A-Za-z_][A-Za-z0-9_]*)/.test(rawPath)) {
    return {
      ok: false,
      reason: `${label} must not rely on implicit environment or home expansion`,
      reasonCode: "invalid_path_input",
    };
  }

  return undefined;
}

export function isSamePath(left: string, right: string): boolean {
  return normalizePathForCompare(left) === normalizePathForCompare(right);
}

export function isInsidePath(child: string, parent: string): boolean {
  const rel = relative(parent, child);
  return rel === "" || (!rel.startsWith("..") && !isAbsolute(rel));
}

export function resolveExistingPath(pathValue: string): string {
  let cursor = resolve(pathValue);
  const missing: string[] = [];

  while (!existsSync(cursor)) {
    const parent = dirname(cursor);
    if (parent === cursor) break;
    missing.unshift(
      cursor.slice(parent.length + (parent.endsWith(sep) ? 0 : 1)),
    );
    cursor = parent;
  }

  const realBase = realpathSync.native(cursor);
  return missing.length > 0 ? resolve(realBase, ...missing) : realBase;
}

export function resolvePathAgainstBase(
  base: string,
  candidate: string,
): string {
  if (isAbsolute(candidate)) return candidate;
  return resolve(base, candidate);
}

function normalizeSlashForward(raw: string): string {
  return raw.replace(/\\/g, "/");
}

/** 既存またはその祖先まで遡って存在するディレクトリ／ファイルへのパス。 */
function findFirstExistingAncestor(absoluteCandidate: string): string {
  let cur = absoluteCandidate;
  for (;;) {
    if (existsSync(cur)) return cur;
    const d = dirname(cur);
    if (d === cur) return absoluteCandidate;
    cur = d;
  }
}

export function checkZonePath(input: ZonePathCheckInput): ZonePathCheckResult {
  const nz = normalizeSlashForward(input.targetPath);

  const inv = validatePathInput(nz, "Path");
  if (inv) {
    return {
      ok: false,
      reason: inv.reason,
      reasonCode: inv.reasonCode,
    };
  }

  let zoneAbs: string;
  try {
    zoneAbs = resolveExistingPath(input.zoneRoot);
  } catch {
    return {
      ok: false,
      reason: "could not resolve zone root",
      reasonCode: "path_resolution_failed",
    };
  }

  let logicalAbs: string;
  try {
    if (input.basePath) {
      const baseAbs = resolveExistingPath(input.basePath);
      logicalAbs = resolvePathAgainstBase(baseAbs, nz);
    } else if (isAbsolute(nz)) logicalAbs = resolve(nz);
    else logicalAbs = resolve(zoneAbs, nz);
    logicalAbs = resolve(logicalAbs);
  } catch {
    return {
      ok: false,
      reason: "could not derive candidate path",
      reasonCode: "path_resolution_failed",
    };
  }

  const relativePathRaw = relative(zoneAbs, logicalAbs).replace(/\\/g, "/");
  if (
    relativePathRaw.startsWith("..") ||
    (relativePathRaw !== "" && isAbsolute(relativePathRaw))
  ) {
    return {
      ok: false,
      reason: "normalized path escapes Zone root boundary (outside_zone)",
      reasonCode: "outside_zone",
      normalizedPath: normalizeSlashForward(logicalAbs),
    };
  }

  try {
    const anchor = findFirstExistingAncestor(logicalAbs);
    const anchorReal = realpathSync.native(anchor);
    if (!isInsidePath(anchorReal, zoneAbs)) {
      return {
        ok: false,
        reason: "resolved path escapes Zone root boundary (symlink-like mount)",
        reasonCode: "outside_zone",
        normalizedPath: normalizeSlashForward(logicalAbs),
        realPath: anchorReal,
      };
    }

    let realPathForResult = logicalAbs;
    if (existsSync(logicalAbs)) {
      try {
        realPathForResult = realpathSync.native(logicalAbs);
      } catch {
        realPathForResult = logicalAbs;
      }
    } else realPathForResult = logicalAbs;

    return {
      ok: true,
      normalizedPath: normalizeSlashForward(logicalAbs),
      realPath: realPathForResult,
      relativePath: relativePathRaw,
      inZone: true,
    };
  } catch {
    return {
      ok: false,
      reason: "path resolution failed at realpath probe",
      reasonCode: "path_resolution_failed",
    };
  }
}
