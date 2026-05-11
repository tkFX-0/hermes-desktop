import { homedir } from "os";
import { parse, relative } from "path";
import {
  checkDenylist,
  DEFAULT_ZONE_PATH_POLICY,
  mergeZonePathPolicy,
} from "./denylist";
import {
  checkZonePath,
  isInsidePath,
  isSamePath,
  resolveExistingPath,
  resolvePathAgainstBase,
  validatePathInput,
} from "./path-guard";
import type {
  ResolveZoneConfigOptions,
  ZoneConfig,
  ZonePathPolicy,
  ZoneValidationResult,
} from "./types";

function pickRootInput(
  options: ResolveZoneConfigOptions,
  policy: ZonePathPolicy,
): { root: string; source: ZoneConfig["source"] } {
  const configured = options.configuredRoot?.trim();
  if (configured) return { root: configured, source: "configured" };

  const fromEnv = options.env?.[policy.envVarName]?.trim();
  if (fromEnv) return { root: fromEnv, source: "env" };

  return { root: policy.defaultRelativeRoot, source: "default" };
}

export function validateZoneRoot(
  projectRootInput: string,
  rootInput: string | null | undefined,
  policyInput?: Partial<ZonePathPolicy>,
): ZoneValidationResult {
  const policy = mergeZonePathPolicy(policyInput);
  const rawRoot = rootInput?.trim() || policy.defaultRelativeRoot;

  if (!rawRoot) {
    return {
      ok: false,
      reason: "Zone root must not be empty",
      reasonCode: "empty_root",
    };
  }

  const inputError = validatePathInput(rawRoot, "Zone root");
  if (inputError) {
    return {
      ok: false,
      reason: inputError.reason,
      reasonCode: inputError.reasonCode,
    };
  }

  try {
    const projectRoot = resolveExistingPath(projectRootInput);
    const candidateRoot = resolvePathAgainstBase(projectRoot, rawRoot);
    const normalizedRoot = resolveExistingPath(candidateRoot);

    if (isSamePath(normalizedRoot, projectRoot)) {
      return {
        ok: false,
        reason: "Zone root must not be project root",
        reasonCode: "project_root",
        normalizedRoot,
      };
    }

    const osRoot = parse(normalizedRoot).root;
    if (isSamePath(normalizedRoot, osRoot)) {
      return {
        ok: false,
        reason: "Zone root must not be OS root",
        reasonCode: "os_root",
        normalizedRoot,
      };
    }

    const userHome = resolveExistingPath(homedir());
    if (isSamePath(normalizedRoot, userHome)) {
      return {
        ok: false,
        reason: "Zone root must not be user home",
        reasonCode: "user_home",
        normalizedRoot,
      };
    }

    if (!isInsidePath(candidateRoot, projectRoot)) {
      return {
        ok: false,
        reason: "Zone root must stay inside project root",
        reasonCode: "outside_project_root",
        normalizedRoot,
      };
    }

    const requestedPathForDeny = isInsidePath(candidateRoot, projectRoot)
      ? relative(projectRoot, candidateRoot)
      : rawRoot;
    const requestedDenylist = checkDenylist(requestedPathForDeny, policy);
    if (!requestedDenylist.ok) {
      return {
        ok: false,
        reason: `Zone root includes denied path segment: ${requestedDenylist.matchedRule}`,
        reasonCode: "denied_path",
        normalizedRoot,
        matchedRule: requestedDenylist.matchedRule,
      };
    }

    const zoneRootCheck = checkZonePath({
      zoneRoot: projectRoot,
      targetPath: rawRoot,
      basePath: projectRoot,
    });
    if (!zoneRootCheck.ok) {
      return {
        ok: false,
        reason:
          zoneRootCheck.reasonCode === "outside_zone"
            ? "Zone root must stay inside project root"
            : zoneRootCheck.reason,
        reasonCode:
          zoneRootCheck.reasonCode === "outside_zone"
            ? "outside_project_root"
            : zoneRootCheck.reasonCode,
        normalizedRoot: zoneRootCheck.realPath ?? normalizedRoot,
      };
    }

    const normalizedDenylist = checkDenylist(
      zoneRootCheck.relativePath,
      policy,
    );
    if (!normalizedDenylist.ok) {
      return {
        ok: false,
        reason: `Zone root includes denied path segment: ${normalizedDenylist.matchedRule}`,
        reasonCode: "denied_path",
        normalizedRoot,
        matchedRule: normalizedDenylist.matchedRule,
      };
    }

    return {
      ok: true,
      normalizedRoot,
      config: {
        projectRoot,
        root: normalizedRoot,
        source: "configured",
      },
    };
  } catch (error) {
    return {
      ok: false,
      reason:
        error instanceof Error ? error.message : "Failed to resolve Zone root",
      reasonCode: "path_resolution_failed",
    };
  }
}

export function resolveZoneConfig(
  options: ResolveZoneConfigOptions,
): ZoneValidationResult {
  const policy = mergeZonePathPolicy(options.policy);
  const picked = pickRootInput(options, policy);
  const result = validateZoneRoot(options.projectRoot, picked.root, policy);

  if (!result.ok) return result;

  return {
    ...result,
    config: {
      ...result.config,
      source: picked.source,
    },
  };
}

export { DEFAULT_ZONE_PATH_POLICY };
