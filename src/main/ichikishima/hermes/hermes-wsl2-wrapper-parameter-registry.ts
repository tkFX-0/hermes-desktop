/**
 * WSL2 Hermes Wrapper — **parameter registry**（検証・要約のみ）。
 * **`wsl.exe` を起動しない**。`execFile`・`child_process`・外部通信なし。
 *
 * @see docs/ichikishima/HERMES_WSL2_WRAPPER_PARAMETER_REGISTRY_SPEC.md
 * @see docs/ichikishima/HERMES_WSL2_WRAPPER_VALUE_CONFIRMATION.md
 */
import { isStrictWslWrapperArgv } from "./hermes-controlled-pilot-config";

export const EXPECTED_ALLOWED_EXECUTABLE_ID =
  "wsl-hermes-bridge-wrapper-v1" as const;

/** V1 許可: 正規化後の **exact match** のみ（`endsWith` や PATH 解決は禁止）。 */
export const CANONICAL_WSL_EXE_PATH_LOWER = "c:\\windows\\system32\\wsl.exe";

/**
 * V1.1 候補（**コードでは未許可**）。64bit Electron からは通常不要。
 * @see HERMES_WSL2_WRAPPER_CONTRACT.md — wsl.exe allowlist
 */
export const CANONICAL_WSL_EXE_SYSNATIVE_LOWER =
  "c:\\windows\\sysnative\\wsl.exe";

/** registry 文書／メタ用の推奨ラベル（任意フィールド `registryVersion` に使ってよい）。 */
export const RECOMMENDED_REGISTRY_DOCUMENT_VERSION =
  "wsl2-param-registry/1" as const;

export const EXPECTED_BRIDGE_PAYLOAD_SCHEMA_VERSION =
  "hermes-bridge-payload/v1" as const;

export type HermesWsl2WrapperRegistryLogLevel = "silent" | "minimal";

/** Fixed argv suffix after `-d Distro --` (`isStrictWslWrapperArgv` 整合). */
export const EXPECTED_WRAPPER_SCRIPT_REL_SEGMENTS =
  ".hermes-bridge/hermes-bridge-payload-once.sh" as const;

export const HERMES_WSL2_REGISTRY_FIELD_KEYS = [
  "distroName",
  "unixUser",
  "wrapperScriptPathInsideWsl",
  "windowsWslExecutableCandidate",
  "allowedExecutableId",
  "timeoutMs",
  "maxStdoutBytes",
  "maxStderrBytes",
  "payloadSchemaVersion",
  "signoffSource",
  "operatorLabel",
] as const;

export type HermesWsl2WrapperRegistryOptionalMetaField =
  | "registryVersion"
  | "expectedPayloadSchemaVersion"
  | "logLevel";

export type HermesWsl2WrapperPendingField =
  | (typeof HERMES_WSL2_REGISTRY_FIELD_KEYS)[number]
  | HermesWsl2WrapperRegistryOptionalMetaField;

export type HermesWsl2WrapperConfirmedField = HermesWsl2WrapperPendingField;

export interface HermesWsl2WrapperParameterRegistry {
  /** WSL distro 名 */
  readonly distroName?: string;
  /** POSIX ユーザー（ホーム直下パス構成用） */
  readonly unixUser?: string;
  /** WSL 内 wrapper 論理パス（先頭 `/`） */
  readonly wrapperScriptPathInsideWsl?: string;
  /** Windows `wsl.exe` 候補。未設定は内部 hint のみ（Renderer に絶対パスを増幅しない）。 */
  readonly windowsWslExecutableCandidate?: string;
  readonly allowedExecutableId?: string;
  readonly timeoutMs?: number;
  readonly maxStdoutBytes?: number;
  readonly maxStderrBytes?: number;
  readonly payloadSchemaVersion?: string;
  readonly signoffSource?: string;
  readonly operatorLabel?: string;
  /**
   * 表示・検証用メタ。**argv / wrapper には渡さない**。
   * 推奨: `RECOMMENDED_REGISTRY_DOCUMENT_VERSION`
   */
  readonly registryVersion?: string;
  /**
   * 期待スキーマ（任意）。未設定なら `payloadSchemaVersion` のみで判定。
   * 両方ある場合は **同一**必須。
   */
  readonly expectedPayloadSchemaVersion?: string;
  /** 表示・検証用。**argv・環境変数に含めない**。 */
  readonly logLevel?: HermesWsl2WrapperRegistryLogLevel;
  /** 短文メタのみ。unsafe 語を含むと reject */
  readonly pendingReasonNote?: string;
}

export type HermesWsl2WrapperParameterStatus =
  | "pending"
  | "rejected"
  | "registry_ready_execution_forbidden";

export interface HermesWsl2WrapperRegistryRejectedField {
  readonly field: string;
  readonly code: string;
}

export interface HermesWsl2WrapperRegistryValidationResult {
  readonly status: HermesWsl2WrapperParameterStatus;
  readonly pendingFields: readonly HermesWsl2WrapperPendingField[];
  readonly rejectedFields: readonly HermesWsl2WrapperRegistryRejectedField[];
  readonly confirmedFields: readonly HermesWsl2WrapperConfirmedField[];
  readonly safeSummaryLines: readonly string[];
  readonly derivedArgvForValidation: readonly string[] | null;
}

export interface HermesWsl2WrapperSafeSummary {
  readonly status: HermesWsl2WrapperParameterStatus;
  readonly pendingFieldCount: number;
  readonly confirmedFieldCount: number;
  readonly rejectedFieldCount: number;
  readonly nextRequiredUserAction: string;
  readonly canRunWsl: false;
  readonly canRunBridgeOnceViaWsl: false;
  readonly productionReady: false;
  readonly pendingReasonBrief: string;
  readonly safeSummaryLines: readonly string[];
}

export interface HermesWsl2WrapperPreparedInvocationPreview {
  readonly willExecute: false;
  readonly patternId: "wsl_strict_v1_four_token" | "not_applicable";
  readonly resolvedArgvTokenCount: number;
  readonly redactedArgvLabels: readonly string[];
  readonly windowsExecutableResolutionHint:
    | "system32_wsl_exe_default_no_candidate_field"
    | "system32_wsl_exe_candidate_validated_shape_only"
    | "candidate_present_but_invalid_shape";
}

const SHELL_METAL = /[|;&$><`\\\r\n]|(\$\()|(\$\{)/;

const SECRET_LIKE =
  /SECRET|PASSWORD|TOKEN|(^|_)KEY(_|$)|API[_-]?KEY|CREDENTIAL|PRIVATE|OPENAI|AZURE_|AWS_|\.env\b|Bearer\s/i;

const FORBIDDEN_OP =
  /(\bcurl\b)|(\bwget\b)|(\bhttp:)|(\bhttps:)|(\binstall\b)|(\brm\b)|(\bdelete\b)|(\bgit\s+push\b)|(\bnpm\b)|(\bpip\b)|(\bssh\b)/i;

const DISTRO_RE = /^[A-Za-z0-9_.-]{1,64}$/;

const UNIX_USER_RE = /^[a-z_][a-z0-9_-]{0,31}$/;

const MAX_TIMEOUT_MS = 30 * 60 * 1000;

const MAX_IO_BYTES = 16 * 1024 * 1024;

/** `registryVersion` 用（argv・シェル渡しなし）。 */
const REGISTRY_VERSION_SAFE_RE = /^[a-zA-Z0-9._/-]{1,48}$/;

function nonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function unsafeText(s: string): boolean {
  return (
    SHELL_METAL.test(s) ||
    SECRET_LIKE.test(s) ||
    FORBIDDEN_OP.test(s) ||
    s.includes("..")
  );
}

export function expectedWrapperPathForUnixUser(unixUser: string): string {
  const u = unixUser.trim();
  return `/home/${u}/.hermes-bridge/hermes-bridge-payload-once.sh`;
}

function normalizeWinPath(p: string): string {
  return p.trim().replace(/\//g, "\\").toLowerCase();
}

/** V1: 正規化パスが **System32 の wsl.exe と完全一致**のみ。`\\…\\System32\\wsl.exe` の部分一致は拒否。 */
export function isAcceptableWindowsWslExeCandidate(pathValue: string): boolean {
  if (!nonEmptyString(pathValue)) return false;
  const n = normalizeWinPath(pathValue);
  return n === CANONICAL_WSL_EXE_PATH_LOWER;
}

/**
 * wrapper 厳密ポリシーの **禁止セグメント**（`/home/<u>/.hermes-bridge/…` 以外の漏れを拒否）。
 */
export function isForbiddenWrapperPathPolicy(pathValue: string): boolean {
  const w = pathValue.trim();
  if (w.length === 0) return false;
  if (/\s/.test(w)) return true;
  if (w.includes("~") || /\$/.test(w)) return true;
  if (/[*?]/.test(w)) return true;
  if (/[[\]{}]/.test(w)) return true;
  const lower = w.toLowerCase();
  if (lower.includes("/mnt/")) return true;
  if (
    lower.startsWith("/tmp") &&
    (lower === "/tmp" || lower.startsWith("/tmp/"))
  )
    return true;
  if (lower.includes("/var/tmp")) return true;
  if (lower.includes("/downloads/")) return true;
  return false;
}

function buildStrictArgv(
  distro: string,
  scriptPath: string,
): readonly string[] {
  return ["-d", distro.trim(), "--", scriptPath.trim()];
}

export function createEmptyHermesWsl2WrapperParameterRegistry(): HermesWsl2WrapperParameterRegistry {
  return {};
}

export function validateHermesWsl2WrapperParameterRegistry(
  registry: HermesWsl2WrapperParameterRegistry | null | undefined,
): HermesWsl2WrapperRegistryValidationResult {
  const pending: HermesWsl2WrapperPendingField[] = [];
  const rejected: HermesWsl2WrapperRegistryRejectedField[] = [];
  const confirmed = new Set<HermesWsl2WrapperConfirmedField>();

  const safeLines: string[] = [
    `registry_scope:wsl2_wrapper_parameters_only:no_process_spawn`,
  ];

  if (!registry || typeof registry !== "object") {
    safeLines.push("input:missing_or_invalid");
    return {
      status: "pending",
      pendingFields: [...HERMES_WSL2_REGISTRY_FIELD_KEYS],
      rejectedFields: [],
      confirmedFields: [],
      safeSummaryLines: safeLines,
      derivedArgvForValidation: null,
    };
  }

  if (
    registry.pendingReasonNote !== undefined &&
    nonEmptyString(registry.pendingReasonNote)
  ) {
    const n = registry.pendingReasonNote.trim();
    if (n.length > 200 || unsafeText(n)) {
      rejected.push({
        field: "pendingReasonNote",
        code: "pending_reason_unsafe_or_too_long",
      });
    } else {
      safeLines.push(`pending_reason_note:length=${n.length}`);
    }
  }

  const markUnsafe = (
    field: HermesWsl2WrapperPendingField | "pendingReasonNote",
    code: string,
    msg: string,
  ): void => {
    rejected.push({ field, code });
    safeLines.push(msg);
  };

  const stringsToScan: ReadonlyArray<{
    field: keyof HermesWsl2WrapperParameterRegistry;
  }> = [
    { field: "distroName" },
    { field: "unixUser" },
    { field: "wrapperScriptPathInsideWsl" },
    { field: "allowedExecutableId" },
    { field: "payloadSchemaVersion" },
    { field: "signoffSource" },
    { field: "operatorLabel" },
    { field: "registryVersion" },
    { field: "expectedPayloadSchemaVersion" },
  ];

  for (const { field } of stringsToScan) {
    const v = registry[field];
    if (!nonEmptyString(v)) continue;
    if (unsafeText(v)) {
      markUnsafe(
        field as HermesWsl2WrapperPendingField,
        `unsafe_fragment:${field}`,
        `reject:${field}:unsafe_fragment`,
      );
    }
  }

  if (registry.logLevel !== undefined) {
    if (registry.logLevel !== "silent" && registry.logLevel !== "minimal") {
      markUnsafe(
        "logLevel",
        "log_level_invalid",
        "reject:logLevel:not_silent_or_minimal",
      );
    }
  }

  if (nonEmptyString(registry.registryVersion)) {
    const rv = registry.registryVersion.trim();
    if (!REGISTRY_VERSION_SAFE_RE.test(rv)) {
      markUnsafe(
        "registryVersion",
        "registry_version_shape_invalid",
        "reject:registryVersion:unsafe_shape",
      );
    }
  }

  if (nonEmptyString(registry.expectedPayloadSchemaVersion)) {
    const ev = registry.expectedPayloadSchemaVersion.trim();
    if (ev !== EXPECTED_BRIDGE_PAYLOAD_SCHEMA_VERSION) {
      markUnsafe(
        "expectedPayloadSchemaVersion",
        "expected_schema_mismatch",
        "reject:expectedPayloadSchemaVersion:not_v1_namespace",
      );
    }
  }

  if (
    nonEmptyString(registry.windowsWslExecutableCandidate) &&
    (SECRET_LIKE.test(registry.windowsWslExecutableCandidate) ||
      FORBIDDEN_OP.test(registry.windowsWslExecutableCandidate))
  ) {
    markUnsafe(
      "windowsWslExecutableCandidate",
      "unsafe_fragment_in_windows_exe_candidate",
      "reject:windowsWslExecutableCandidate:forbidden_token",
    );
  }

  const requiredStrings: HermesWsl2WrapperPendingField[] = [
    "distroName",
    "unixUser",
    "wrapperScriptPathInsideWsl",
    "allowedExecutableId",
    "payloadSchemaVersion",
    "signoffSource",
    "operatorLabel",
  ];

  for (const key of requiredStrings) {
    const v = registry[key];
    if (!nonEmptyString(v)) pending.push(key);
    else confirmed.add(key);
  }

  const needNum: HermesWsl2WrapperPendingField[] = [
    "timeoutMs",
    "maxStdoutBytes",
    "maxStderrBytes",
  ];
  for (const key of needNum) {
    const v = registry[key];
    if (typeof v !== "number" || !Number.isFinite(v) || v <= 0)
      pending.push(key);
    else confirmed.add(key);
  }

  if (
    typeof registry.timeoutMs === "number" &&
    registry.timeoutMs > MAX_TIMEOUT_MS
  ) {
    markUnsafe(
      "timeoutMs",
      "timeout_out_of_design_cap",
      "reject:timeoutMs:above_cap",
    );
  }
  if (
    typeof registry.maxStdoutBytes === "number" &&
    registry.maxStdoutBytes > MAX_IO_BYTES
  ) {
    markUnsafe(
      "maxStdoutBytes",
      "stdout_cap_out_of_design",
      "reject:maxStdoutBytes:above_cap",
    );
  }
  if (
    typeof registry.maxStderrBytes === "number" &&
    registry.maxStderrBytes > MAX_IO_BYTES
  ) {
    markUnsafe(
      "maxStderrBytes",
      "stderr_cap_out_of_design",
      "reject:maxStderrBytes:above_cap",
    );
  }

  if (
    nonEmptyString(registry.distroName) &&
    !DISTRO_RE.test(registry.distroName.trim())
  ) {
    markUnsafe(
      "distroName",
      "distro_shape_invalid",
      "reject:distroName:pattern",
    );
    confirmed.delete("distroName");
  }

  if (
    nonEmptyString(registry.unixUser) &&
    !UNIX_USER_RE.test(registry.unixUser.trim())
  ) {
    markUnsafe(
      "unixUser",
      "unix_user_shape_invalid",
      "reject:unixUser:pattern",
    );
    confirmed.delete("unixUser");
  }

  if (
    nonEmptyString(registry.allowedExecutableId) &&
    registry.allowedExecutableId.trim() !== EXPECTED_ALLOWED_EXECUTABLE_ID
  ) {
    markUnsafe(
      "allowedExecutableId",
      "allowed_executable_id_mismatch",
      "reject:allowedExecutableId:not_v1_label",
    );
    confirmed.delete("allowedExecutableId");
  }

  if (
    nonEmptyString(registry.payloadSchemaVersion) &&
    registry.payloadSchemaVersion.trim() !==
      EXPECTED_BRIDGE_PAYLOAD_SCHEMA_VERSION
  ) {
    markUnsafe(
      "payloadSchemaVersion",
      "payload_schema_mismatch",
      "reject:payloadSchemaVersion:not_v1_namespace",
    );
    confirmed.delete("payloadSchemaVersion");
  }

  if (nonEmptyString(registry.wrapperScriptPathInsideWsl)) {
    const w = registry.wrapperScriptPathInsideWsl.trim();
    if (isForbiddenWrapperPathPolicy(w)) {
      markUnsafe(
        "wrapperScriptPathInsideWsl",
        "wrapper_path_forbidden_segment",
        "reject:wrapper:forbidden_path_segment_policy",
      );
      confirmed.delete("wrapperScriptPathInsideWsl");
    } else if (!w.startsWith("/")) {
      markUnsafe(
        "wrapperScriptPathInsideWsl",
        "wrapper_not_posix_absolute",
        "reject:wrapper:must_start_with_slash",
      );
      confirmed.delete("wrapperScriptPathInsideWsl");
    }
  }

  if (
    nonEmptyString(registry.windowsWslExecutableCandidate) &&
    !isAcceptableWindowsWslExeCandidate(registry.windowsWslExecutableCandidate)
  ) {
    markUnsafe(
      "windowsWslExecutableCandidate",
      "windows_wsl_exe_candidate_shape_invalid",
      "reject:windowsWslExecutableCandidate:not_system32_wsl_exe",
    );
    confirmed.delete("windowsWslExecutableCandidate");
  } else if (nonEmptyString(registry.windowsWslExecutableCandidate)) {
    confirmed.add("windowsWslExecutableCandidate");
  }

  let derivedArgv: readonly string[] | null = null;

  if (
    nonEmptyString(registry.unixUser) &&
    nonEmptyString(registry.wrapperScriptPathInsideWsl)
  ) {
    const expected = expectedWrapperPathForUnixUser(registry.unixUser.trim());
    if (registry.wrapperScriptPathInsideWsl.trim() !== expected) {
      markUnsafe(
        "wrapperScriptPathInsideWsl",
        "wrapper_path_mismatch_fixed_policy",
        "reject:wrapper:must_match_home_bridge_script",
      );
      confirmed.delete("wrapperScriptPathInsideWsl");
    }
  }

  if (
    nonEmptyString(registry.distroName) &&
    nonEmptyString(registry.wrapperScriptPathInsideWsl) &&
    !rejected.some(
      (r) =>
        r.field === "wrapperScriptPathInsideWsl" || r.field === "distroName",
    )
  ) {
    derivedArgv = buildStrictArgv(
      registry.distroName.trim(),
      registry.wrapperScriptPathInsideWsl.trim(),
    );
    if (!isStrictWslWrapperArgv(derivedArgv)) {
      derivedArgv = null;
      markUnsafe(
        "wrapperScriptPathInsideWsl",
        "strict_argv_shape_failed_internal",
        "reject:argv:strict_shape_failed",
      );
    }
  }

  if (registry.logLevel === "silent" || registry.logLevel === "minimal") {
    if (!rejected.some((r) => r.field === "logLevel")) {
      confirmed.add("logLevel");
      safeLines.push(`registry_meta:log_level=${registry.logLevel}`);
    }
  }

  if (
    nonEmptyString(registry.registryVersion) &&
    REGISTRY_VERSION_SAFE_RE.test(registry.registryVersion.trim()) &&
    !rejected.some((r) => r.field === "registryVersion")
  ) {
    confirmed.add("registryVersion");
    safeLines.push(
      `registry_meta:registry_document_version_len=${registry.registryVersion.trim().length}`,
    );
  }

  if (
    nonEmptyString(registry.expectedPayloadSchemaVersion) &&
    registry.expectedPayloadSchemaVersion.trim() ===
      EXPECTED_BRIDGE_PAYLOAD_SCHEMA_VERSION &&
    !rejected.some((r) => r.field === "expectedPayloadSchemaVersion")
  ) {
    confirmed.add("expectedPayloadSchemaVersion");
    safeLines.push("registry_meta:expected_payload_schema_field=v1_namespace");
  }

  let status: HermesWsl2WrapperParameterStatus;
  const uniqPending = [...new Set(pending)];
  sortPending(uniqPending);

  if (rejected.length > 0) status = "rejected";
  else if (uniqPending.length > 0 || !derivedArgv) status = "pending";
  else status = "registry_ready_execution_forbidden";

  if (
    rejected.length === 0 &&
    status === "registry_ready_execution_forbidden" &&
    derivedArgv
  ) {
    safeLines.push(
      `strict_argv:tokens=${derivedArgv.length}:pattern=wsl_strict_v1_four_token`,
    );
    safeLines.push("execution_gate:defer_user_signoff_goal");
  } else if (status === "pending") {
    safeLines.push(`pending_field_count:${uniqPending.length}`);
  }

  const confirmedFinal = [...confirmed].filter((f) => {
    if (uniqPending.includes(f)) return false;
    return !rejected.some((r) => r.field === f);
  });

  sortPending(confirmedFinal);

  return {
    status,
    pendingFields: uniqPending,
    rejectedFields: [...rejected],
    confirmedFields: confirmedFinal,
    safeSummaryLines: safeLines,
    derivedArgvForValidation: derivedArgv,
  };
}

function sortPending(f: HermesWsl2WrapperPendingField[]): void {
  f.sort((a, b) => a.localeCompare(b));
}

export function summarizeHermesWsl2WrapperParameterRegistry(
  registry: HermesWsl2WrapperParameterRegistry | null | undefined,
): HermesWsl2WrapperSafeSummary {
  const v = validateHermesWsl2WrapperParameterRegistry(registry);
  let next = "user:supply_all_required_fields_via_signoff_templates";
  if (v.status === "rejected")
    next = "user:clear_rejected_registry_fields_then_revalidate";
  else if (v.status === "registry_ready_execution_forbidden") {
    next = "defer:separate_goal_wsl_invoke_execfile_explicit_signoff_only";
  } else if (v.pendingFields.length > 0)
    next = `pending:${v.pendingFields.slice(0, 8).join("+")}`;
  else next = "user:provide_distro_unix_wrapper_schema_signoff_operator";

  const prNoteLen =
    registry &&
    typeof registry.pendingReasonNote === "string" &&
    registry.pendingReasonNote.trim()
      ? Math.min(registry.pendingReasonNote.trim().length, 200)
      : 0;

  return {
    status: v.status,
    pendingFieldCount: v.pendingFields.length,
    confirmedFieldCount: v.confirmedFields.length,
    rejectedFieldCount: v.rejectedFields.length,
    nextRequiredUserAction: next.slice(0, 260),
    canRunWsl: false,
    canRunBridgeOnceViaWsl: false,
    productionReady: false,
    pendingReasonBrief:
      prNoteLen > 0 ? `note_length=${prNoteLen}` : "note_empty",
    safeSummaryLines: [...v.safeSummaryLines],
  };
}

export function createHermesWsl2WrapperPreparedInvocationPreview(
  registry: HermesWsl2WrapperParameterRegistry | null | undefined,
): HermesWsl2WrapperPreparedInvocationPreview {
  const v = validateHermesWsl2WrapperParameterRegistry(registry);
  let hint: HermesWsl2WrapperPreparedInvocationPreview["windowsExecutableResolutionHint"] =
    "system32_wsl_exe_default_no_candidate_field";
  if (
    registry &&
    nonEmptyString(registry.windowsWslExecutableCandidate) &&
    isAcceptableWindowsWslExeCandidate(registry.windowsWslExecutableCandidate)
  ) {
    hint = "system32_wsl_exe_candidate_validated_shape_only";
  }
  if (
    registry &&
    nonEmptyString(registry.windowsWslExecutableCandidate) &&
    !isAcceptableWindowsWslExeCandidate(registry.windowsWslExecutableCandidate)
  ) {
    hint = "candidate_present_but_invalid_shape";
  }

  if (
    v.status !== "registry_ready_execution_forbidden" ||
    !v.derivedArgvForValidation
  ) {
    return {
      willExecute: false,
      patternId: "not_applicable",
      resolvedArgvTokenCount: 0,
      redactedArgvLabels: [],
      windowsExecutableResolutionHint: hint,
    };
  }

  return {
    willExecute: false,
    patternId: "wsl_strict_v1_four_token",
    resolvedArgvTokenCount: v.derivedArgvForValidation.length,
    redactedArgvLabels: ["-d", "DISTRO_REDACTED", "--", "WSL_SCRIPT_REDACTED"],
    windowsExecutableResolutionHint: hint,
  };
}
