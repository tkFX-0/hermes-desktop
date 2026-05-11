import type { DenylistResult, ZonePathPolicy } from "./types";
import { normalizePathForCompare } from "./path-guard";

export const DEFAULT_ZONE_PATH_POLICY: ZonePathPolicy = {
  defaultRelativeRoot: "sandbox/hermes-autonomy-zone",
  envVarName: "HERMES_AUTONOMY_ZONE_ROOT",
  deniedSegments: [
    ".git",
    ".ssh",
    ".aws",
    ".azure",
    ".config",
    ".gcloud",
    ".kube",
    ".npmrc",
    ".pypirc",
    "appdata",
    "application data",
    "account_history",
    "accounts",
    "backtest",
    "backtests",
    "cloudsdk",
    "deploy",
    "deployment",
    "gcloud",
    "mql5",
    "mt5",
    "metatrader",
    "terminal64.exe",
    "experts",
    "propfusion",
    "production",
    "prod",
    "secrets",
    "secret",
    "credentials",
    "credential",
    "id_ecdsa",
    "id_ed25519",
    "id_rsa",
    "known_hosts",
    "local state",
    "login data",
    "memory",
    "sessions.db",
    "memory.md",
    "user.md",
    "soul.md",
    "cookies",
    "cookie",
    "trade_history",
    "trading_history",
    "token",
    "tokens",
    "personal",
    "private",
    "pii",
    "system32",
    "windows",
  ],
  deniedSegmentPrefixes: [".env", "token"],
  deniedSegmentSuffixes: [".pem", ".key", ".p12", ".pfx"],
  deniedSubstrings: [
    "api_key",
    "apikey",
    "api-key",
    "browser_cookie",
    "browser-cookie",
    "browsercookie",
    "cloud credential",
    "cloud-credential",
    "credential cache",
    "credential-cache",
    "ssh_key",
    "trade history",
    "trading history",
  ],
};

export function mergeZonePathPolicy(
  policy?: Partial<ZonePathPolicy>,
): ZonePathPolicy {
  return {
    ...DEFAULT_ZONE_PATH_POLICY,
    ...policy,
    deniedSegments:
      policy?.deniedSegments ?? DEFAULT_ZONE_PATH_POLICY.deniedSegments,
    deniedSegmentPrefixes:
      policy?.deniedSegmentPrefixes ??
      DEFAULT_ZONE_PATH_POLICY.deniedSegmentPrefixes,
    deniedSegmentSuffixes:
      policy?.deniedSegmentSuffixes ??
      DEFAULT_ZONE_PATH_POLICY.deniedSegmentSuffixes,
    deniedSubstrings:
      policy?.deniedSubstrings ?? DEFAULT_ZONE_PATH_POLICY.deniedSubstrings,
  };
}

function splitSegments(pathValue: string): string[] {
  return normalizePathForCompare(pathValue)
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean);
}

export function checkDenylist(
  pathValue: string,
  policyInput?: Partial<ZonePathPolicy>,
): DenylistResult {
  const policy = mergeZonePathPolicy(policyInput);
  const segments = splitSegments(pathValue);

  for (const segment of segments) {
    if (policy.deniedSegments.includes(segment)) {
      return {
        ok: false,
        reason: `Path includes denied segment: ${segment}`,
        reasonCode: "denied_segment",
        matchedRule: segment,
      };
    }

    if (
      policy.deniedSegmentPrefixes.some((prefix) => segment.startsWith(prefix))
    ) {
      return {
        ok: false,
        reason: `Path includes denied segment prefix: ${segment}`,
        reasonCode: "denied_segment_prefix",
        matchedRule: segment,
      };
    }

    if (
      policy.deniedSegmentSuffixes.some((suffix) => segment.endsWith(suffix))
    ) {
      return {
        ok: false,
        reason: `Path includes denied segment suffix: ${segment}`,
        reasonCode: "denied_segment_suffix",
        matchedRule: segment,
      };
    }
  }

  const comparable = normalizePathForCompare(pathValue);
  const matchedSubstring = policy.deniedSubstrings.find((substring) =>
    comparable.includes(substring),
  );

  if (matchedSubstring) {
    return {
      ok: false,
      reason: `Path includes denied substring: ${matchedSubstring}`,
      reasonCode: "denied_substring",
      matchedRule: matchedSubstring,
    };
  }

  return { ok: true };
}
