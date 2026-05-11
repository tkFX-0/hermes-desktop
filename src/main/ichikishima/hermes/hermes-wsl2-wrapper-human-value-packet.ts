/**
 * WSL2 wrapper — **人手値確認パケット**（検証・要約のみ）。
 * **`wsl.exe` を起動しない**。`execFile`・`child_process`・外部通信なし。
 *
 * @see docs/ichikishima/HERMES_WSL2_WRAPPER_HUMAN_VALUE_PACKET.md
 */
import {
  CANONICAL_WSL_EXE_SYSNATIVE_LOWER,
  CANONICAL_WSL_EXE_PATH_LOWER,
  EXPECTED_ALLOWED_EXECUTABLE_ID,
  validateHermesWsl2WrapperParameterRegistry,
  type HermesWsl2WrapperParameterRegistry,
  type HermesWsl2WrapperRegistryValidationResult,
} from "./hermes-wsl2-wrapper-parameter-registry";

export const HERMES_WSL2_HUMAN_VALUE_PACKET_FIELD_KEYS = [
  "distroName",
  "unixUser",
  "wrapperPath",
  "windowsWslExePath",
  "allowedExecutableId",
  "timeoutMs",
  "maxStdoutBytes",
  "maxStderrBytes",
  "expectedPayloadSchemaVersion",
  "signoffSource",
  "operatorLabel",
] as const;

export type HermesWsl2WrapperHumanValuePacketOptionalField =
  | "logLevel"
  | "signoffAtUnixMs";

export interface HermesWsl2WrapperHumanValuePacket {
  readonly distroName?: string;
  readonly unixUser?: string;
  /** POSIX 絶対。registry の `wrapperScriptPathInsideWsl` と同一 */
  readonly wrapperPath?: string;
  /** Windows `wsl.exe`。V1 は System32 の exact match のみ */
  readonly windowsWslExePath?: string;
  readonly allowedExecutableId?: string;
  readonly timeoutMs?: number;
  readonly maxStdoutBytes?: number;
  readonly maxStderrBytes?: number;
  readonly expectedPayloadSchemaVersion?: string;
  /** registry メタと同じ union。argv には載せない */
  readonly logLevel?: "silent" | "minimal";
  readonly signoffSource?: string;
  /** 運用記録用。registry 必須フィールド外 */
  readonly signoffAtUnixMs?: number;
  readonly operatorLabel?: string;
}

export type HermesWsl2WrapperHumanValuePacketStatus =
  | "pending"
  | "rejected"
  | "packet_complete_execution_forbidden";

export type HermesWsl2WrapperHumanValueWindowsExeClass =
  | "not_provided"
  | "system32_exact_ok"
  | "sysnative_future_v11_blocked"
  | "invalid_or_non_allowlist";

export interface HermesWsl2WrapperHumanValuePacketRejectedField {
  readonly field: string;
  readonly code: string;
}

export interface HermesWsl2WrapperHumanValuePacketValidationResult {
  readonly status: HermesWsl2WrapperHumanValuePacketStatus;
  readonly pendingFields: readonly string[];
  readonly rejectedFields: readonly HermesWsl2WrapperHumanValuePacketRejectedField[];
  readonly windowsExeClass: HermesWsl2WrapperHumanValueWindowsExeClass;
  readonly sysnativePolicy: "future_candidate_not_allowed_v1";
  readonly registryValidation: HermesWsl2WrapperRegistryValidationResult;
  readonly safeSummaryLines: readonly string[];
}

export interface HermesWsl2WrapperHumanValuePacketSafeSummary {
  readonly humanValuePacketStatus: HermesWsl2WrapperHumanValuePacketStatus;
  readonly pendingFieldCount: number;
  readonly rejectedFieldCount: number;
  readonly confirmedFieldCount: number;
  readonly nextRequiredAction: string;
  readonly sysnativePolicy: "future_candidate_not_allowed_v1";
  readonly windowsExeClass: HermesWsl2WrapperHumanValueWindowsExeClass;
  readonly canRunWsl: false;
  readonly canRunBridgeOnceViaWsl: false;
  readonly productionReady: false;
  readonly safeSummaryLines: readonly string[];
}

export interface HermesWsl2WrapperHumanValuePacketRendererRedaction {
  readonly distroNamePresent: boolean;
  readonly unixUserPresent: boolean;
  readonly wrapperPathStatus: "missing" | "accepted_shape" | "rejected";
  readonly windowsWslExeClass: HermesWsl2WrapperHumanValueWindowsExeClass;
  readonly executableIdMatchesV1: boolean | "missing";
  readonly signoffSourcePresent: boolean;
  readonly signoffAtUnixMsPresent: boolean;
  readonly operatorLabelPresent: boolean;
  readonly argvPreviewLabels: readonly string[];
}

const SIGNOFF_MS_MIN = 1_000_000_000_000;
const SIGNOFF_MS_MAX = 4_500_000_000_000;

function nonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function normalizeWinPathForCompare(value: string): string {
  return value.trim().replace(/\//g, "\\").toLowerCase();
}

export function humanValuePacketToRegistry(
  p: HermesWsl2WrapperHumanValuePacket,
): HermesWsl2WrapperParameterRegistry {
  return {
    distroName: p.distroName,
    unixUser: p.unixUser,
    wrapperScriptPathInsideWsl: p.wrapperPath,
    windowsWslExecutableCandidate: p.windowsWslExePath,
    allowedExecutableId: p.allowedExecutableId,
    timeoutMs: p.timeoutMs,
    maxStdoutBytes: p.maxStdoutBytes,
    maxStderrBytes: p.maxStderrBytes,
    payloadSchemaVersion: p.expectedPayloadSchemaVersion,
    expectedPayloadSchemaVersion: p.expectedPayloadSchemaVersion,
    signoffSource: p.signoffSource,
    operatorLabel: p.operatorLabel,
    logLevel: p.logLevel,
  };
}

function classifyWindowsExe(
  raw: string | undefined,
): HermesWsl2WrapperHumanValueWindowsExeClass {
  if (!nonEmptyString(raw)) return "not_provided";
  const n = normalizeWinPathForCompare(raw);
  if (n === CANONICAL_WSL_EXE_PATH_LOWER) return "system32_exact_ok";
  if (n === CANONICAL_WSL_EXE_SYSNATIVE_LOWER)
    return "sysnative_future_v11_blocked";
  return "invalid_or_non_allowlist";
}

function validateSignoffMs(
  ms: number | undefined,
): HermesWsl2WrapperHumanValuePacketRejectedField | null {
  if (ms === undefined) return null;
  if (typeof ms !== "number" || !Number.isFinite(ms))
    return { field: "signoffAtUnixMs", code: "signoff_ms_not_finite" };
  if (ms < SIGNOFF_MS_MIN || ms > SIGNOFF_MS_MAX)
    return {
      field: "signoffAtUnixMs",
      code: "signoff_ms_out_of_reasonable_range",
    };
  return null;
}

export function createEmptyHermesWsl2WrapperHumanValuePacket(): HermesWsl2WrapperHumanValuePacket {
  return {};
}

export function validateHermesWsl2WrapperHumanValuePacket(
  packet: HermesWsl2WrapperHumanValuePacket | null | undefined,
): HermesWsl2WrapperHumanValuePacketValidationResult {
  const safeLines: string[] = [
    `packet_scope:human_wsl2_value_confirmation:no_process_spawn`,
    `sysnative_policy:future_candidate_not_allowed_v1`,
  ];

  const rejected: HermesWsl2WrapperHumanValuePacketRejectedField[] = [];

  if (!packet || typeof packet !== "object") {
    safeLines.push("input:missing_or_invalid");
    const reg = validateHermesWsl2WrapperParameterRegistry(null);
    return {
      status: "pending",
      pendingFields: [...HERMES_WSL2_HUMAN_VALUE_PACKET_FIELD_KEYS],
      rejectedFields: [],
      windowsExeClass: "not_provided",
      sysnativePolicy: "future_candidate_not_allowed_v1",
      registryValidation: reg,
      safeSummaryLines: safeLines,
    };
  }

  const signoffErr = validateSignoffMs(packet.signoffAtUnixMs);
  if (signoffErr) {
    rejected.push(signoffErr);
    safeLines.push(`reject:${signoffErr.field}:${signoffErr.code}`);
  }

  const winClass = classifyWindowsExe(packet.windowsWslExePath);
  if (winClass === "sysnative_future_v11_blocked") {
    rejected.push({
      field: "windowsWslExePath",
      code: "sysnative_v11_future_candidate_not_allowed_in_v1",
    });
    safeLines.push(
      "reject:windowsWslExePath:sysnative_blocked_use_system32_or_v11_goal",
    );
  }

  const registry = humanValuePacketToRegistry(packet);
  const registryValidation =
    validateHermesWsl2WrapperParameterRegistry(registry);

  for (const rf of registryValidation.rejectedFields) {
    rejected.push({
      field: mapRegistryFieldToPacketField(rf.field),
      code: rf.code,
    });
  }

  const uniqReject = dedupeRejected(rejected);

  let status: HermesWsl2WrapperHumanValuePacketStatus;
  if (uniqReject.length > 0) status = "rejected";
  else if (registryValidation.status === "registry_ready_execution_forbidden")
    status = "packet_complete_execution_forbidden";
  else status = "pending";

  const uniqPending = collectPendingHumanFields(registryValidation);

  if (status === "pending") {
    safeLines.push(`pending_field_count:${uniqPending.length}`);
  }

  if (status === "packet_complete_execution_forbidden")
    safeLines.push("execution_gate:defer_user_signed_goal_only");

  return {
    status,
    pendingFields: uniqPending,
    rejectedFields: uniqReject,
    windowsExeClass: winClass,
    sysnativePolicy: "future_candidate_not_allowed_v1",
    registryValidation,
    safeSummaryLines: safeLines,
  };
}

function mapRegistryFieldToPacketField(registryField: string): string {
  if (registryField === "wrapperScriptPathInsideWsl") return "wrapperPath";
  if (registryField === "windowsWslExecutableCandidate")
    return "windowsWslExePath";
  if (registryField === "payloadSchemaVersion")
    return "expectedPayloadSchemaVersion";
  return registryField;
}

function collectPendingHumanFields(
  reg: HermesWsl2WrapperRegistryValidationResult,
): string[] {
  return reg.pendingFields
    .map(mapRegistryFieldToPacketField)
    .filter((f) => f !== "pendingReasonNote" && f !== "registryVersion")
    .sort((a, b) => a.localeCompare(b));
}

function dedupeRejected(
  items: readonly HermesWsl2WrapperHumanValuePacketRejectedField[],
): readonly HermesWsl2WrapperHumanValuePacketRejectedField[] {
  const seen = new Set<string>();
  const out: HermesWsl2WrapperHumanValuePacketRejectedField[] = [];
  for (const x of items) {
    const k = `${x.field}:${x.code}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(x);
  }
  return out;
}

export function summarizeHermesWsl2WrapperHumanValuePacket(
  packet: HermesWsl2WrapperHumanValuePacket | null | undefined,
): HermesWsl2WrapperHumanValuePacketSafeSummary {
  const v = validateHermesWsl2WrapperHumanValuePacket(packet);
  let next = "user:fill_human_value_packet_via_template_then_signoff";
  if (v.status === "rejected")
    next = "user:fix_rejected_human_value_fields_then_revalidate";
  else if (v.status === "packet_complete_execution_forbidden")
    next = "defer:separate_goal_exec_wsl_explicit_signoff_only";
  else if (v.pendingFields.length > 0)
    next = `pending:${v.pendingFields.slice(0, 8).join("+")}`;

  const confirmedN = v.registryValidation.confirmedFields.length;

  return {
    humanValuePacketStatus: v.status,
    pendingFieldCount: v.pendingFields.length,
    rejectedFieldCount: v.rejectedFields.length,
    confirmedFieldCount: confirmedN,
    nextRequiredAction: next.slice(0, 280),
    sysnativePolicy: "future_candidate_not_allowed_v1",
    windowsExeClass: v.windowsExeClass,
    canRunWsl: false,
    canRunBridgeOnceViaWsl: false,
    productionReady: false,
    safeSummaryLines: [...v.safeSummaryLines],
  };
}

/** local-only JSON のトップレキー（`_comment` + packet フィールド）。fs 読込は行わない。 */
const LOCAL_ONLY_JSON_TOP_LEVEL_KEYS = new Set<string>([
  "_comment",
  ...HERMES_WSL2_HUMAN_VALUE_PACKET_FIELD_KEYS,
  "logLevel",
  "signoffAtUnixMs",
]);

export interface LocalOnlyValuePacketShapeResult {
  readonly ok: boolean;
  readonly issues: readonly string[];
}

/**
 * **`fs` でファイルを読まない**。`JSON.parse` 後のオブジェクトに対して、許可キーと粗い型だけ検査する。
 * @see docs/ichikishima/HERMES_WSL2_WRAPPER_LOCAL_VALUE_FILL_IN_RUNBOOK.md
 */
export function validateLocalOnlyValuePacketShape(
  input: unknown,
): LocalOnlyValuePacketShapeResult {
  const issues: string[] = [];
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, issues: ["root:not_plain_object"] };
  }
  const o = input as Record<string, unknown>;
  for (const k of Object.keys(o)) {
    if (!LOCAL_ONLY_JSON_TOP_LEVEL_KEYS.has(k))
      issues.push(`unknown_top_level_key:${k}`);
  }

  const checkStringField = (field: string): void => {
    if (!(field in o)) return;
    if (typeof o[field] !== "string")
      issues.push(`type:${field}:expected_string`);
  };

  for (const field of [
    "distroName",
    "unixUser",
    "wrapperPath",
    "windowsWslExePath",
    "allowedExecutableId",
    "expectedPayloadSchemaVersion",
    "signoffSource",
    "operatorLabel",
  ] as const) {
    checkStringField(field);
  }

  for (const field of [
    "timeoutMs",
    "maxStdoutBytes",
    "maxStderrBytes",
  ] as const) {
    if (!(field in o)) continue;
    const v = o[field];
    if (typeof v !== "number" || !Number.isFinite(v))
      issues.push(`type:${field}:expected_finite_number`);
  }

  if ("logLevel" in o && o.logLevel !== undefined && o.logLevel !== null) {
    if (o.logLevel !== "silent" && o.logLevel !== "minimal")
      issues.push("type:logLevel:expected_silent_or_minimal");
  }

  if ("signoffAtUnixMs" in o && o.signoffAtUnixMs !== undefined) {
    const v = o.signoffAtUnixMs;
    if (v === null) {
      /* allowed */
    } else if (typeof v !== "number" || !Number.isFinite(v)) {
      issues.push("type:signoffAtUnixMs:expected_finite_number_or_null");
    }
  }

  return { ok: issues.length === 0, issues };
}

/**
 * JSON 由来のプレーンオブジェクトから packet へ射影する。**機密をマスクしない** — 呼び出し側は repo 外・未共有のメモリ上のみで使うこと。
 * **`fs` 不使用**。
 */
export function coerceLocalOnlyJsonObjectToHumanValuePacket(
  input: unknown,
): HermesWsl2WrapperHumanValuePacket {
  if (!input || typeof input !== "object" || Array.isArray(input)) return {};
  const o = input as Record<string, unknown>;
  const str = (k: string): string | undefined =>
    k in o && typeof o[k] === "string" ? o[k] : undefined;
  const num = (k: string): number | undefined => {
    if (!(k in o)) return undefined;
    const v = o[k];
    return typeof v === "number" && Number.isFinite(v) ? v : undefined;
  };
  let logLevel: "silent" | "minimal" | undefined;
  if (o.logLevel === "silent" || o.logLevel === "minimal")
    logLevel = o.logLevel;

  let signoffAtUnixMs: number | undefined;
  if (
    typeof o.signoffAtUnixMs === "number" &&
    Number.isFinite(o.signoffAtUnixMs)
  )
    signoffAtUnixMs = o.signoffAtUnixMs;

  const p: HermesWsl2WrapperHumanValuePacket = {
    distroName: str("distroName"),
    unixUser: str("unixUser"),
    wrapperPath: str("wrapperPath"),
    windowsWslExePath: str("windowsWslExePath"),
    allowedExecutableId: str("allowedExecutableId"),
    timeoutMs: num("timeoutMs"),
    maxStdoutBytes: num("maxStdoutBytes"),
    maxStderrBytes: num("maxStderrBytes"),
    expectedPayloadSchemaVersion: str("expectedPayloadSchemaVersion"),
    logLevel,
    signoffSource: str("signoffSource"),
    operatorLabel: str("operatorLabel"),
  };
  if (signoffAtUnixMs !== undefined) {
    return { ...p, signoffAtUnixMs };
  }
  return p;
}

export interface HermesWsl2WrapperRedactedLocalValuePacketSummary {
  readonly summarySchemaVersion: "redacted_local_value_packet_summary/v1";
  /** repo / チャットに貼ってよい行（raw path・distro 名・ユーザー名を含まない） */
  readonly lines: readonly string[];
  readonly humanValuePacketStatus: HermesWsl2WrapperHumanValuePacketStatus;
  readonly rendererRedaction: HermesWsl2WrapperHumanValuePacketRendererRedaction;
}

/**
 * ローカル JSON 相当の `unknown` から **redacted 行**を生成する。**生の path / argv / distro を lines に出さない**。
 * **`fs` 不使用**。
 */
export function summarizeRedactedLocalValuePacket(
  input: unknown,
): HermesWsl2WrapperRedactedLocalValuePacketSummary {
  const packet = coerceLocalOnlyJsonObjectToHumanValuePacket(input);
  const v = validateHermesWsl2WrapperHumanValuePacket(packet);
  const r = redactHermesWsl2WrapperHumanValuePacketForRenderer(packet);
  const lines: string[] = [
    "redacted_local_value_packet_summary:v1",
    `human_value_packet_status:${v.status}`,
    `pending_field_count:${v.pendingFields.length}`,
    `rejected_field_count:${v.rejectedFields.length}`,
    `windows_wsl_exe_class:${r.windowsWslExeClass}`,
    `sysnative_policy:v1_blocked`,
    `distro_field:present:${r.distroNamePresent}`,
    `unix_user_field:present:${r.unixUserPresent}`,
    `wrapper_path_shape:${r.wrapperPathStatus}`,
    `executable_id_v1:${String(r.executableIdMatchesV1)}`,
    `signoff_source_present:${r.signoffSourcePresent}`,
    `signoff_ms_present:${r.signoffAtUnixMsPresent}`,
    `operator_label_present:${r.operatorLabelPresent}`,
    `argv_preview:${r.argvPreviewLabels.join("|")}`,
  ];
  lines.push(...v.safeSummaryLines.map((x) => `validation:${x}`));
  return {
    summarySchemaVersion: "redacted_local_value_packet_summary/v1",
    lines,
    humanValuePacketStatus: v.status,
    rendererRedaction: r,
  };
}

export function redactHermesWsl2WrapperHumanValuePacketForRenderer(
  packet: HermesWsl2WrapperHumanValuePacket | null | undefined,
): HermesWsl2WrapperHumanValuePacketRendererRedaction {
  const v = validateHermesWsl2WrapperHumanValuePacket(packet);
  const p =
    packet && typeof packet === "object"
      ? packet
      : createEmptyHermesWsl2WrapperHumanValuePacket();

  const idOk =
    nonEmptyString(p.allowedExecutableId) &&
    p.allowedExecutableId.trim() === EXPECTED_ALLOWED_EXECUTABLE_ID;

  let wrapperPathStatus: HermesWsl2WrapperHumanValuePacketRendererRedaction["wrapperPathStatus"] =
    "missing";
  if (nonEmptyString(p.wrapperPath)) {
    wrapperPathStatus = v.rejectedFields.some((x) => x.field === "wrapperPath")
      ? "rejected"
      : "accepted_shape";
  }

  const preview =
    v.registryValidation.derivedArgvForValidation &&
    v.registryValidation.derivedArgvForValidation.length === 4
      ? (["-d", "DISTRO_REDACTED", "--", "WSL_SCRIPT_REDACTED"] as const)
      : [];

  return {
    distroNamePresent: nonEmptyString(p.distroName),
    unixUserPresent: nonEmptyString(p.unixUser),
    wrapperPathStatus,
    windowsWslExeClass: v.windowsExeClass,
    executableIdMatchesV1: !nonEmptyString(p.allowedExecutableId)
      ? "missing"
      : idOk,
    signoffSourcePresent: nonEmptyString(p.signoffSource),
    signoffAtUnixMsPresent:
      typeof p.signoffAtUnixMs === "number" &&
      Number.isFinite(p.signoffAtUnixMs),
    operatorLabelPresent: nonEmptyString(p.operatorLabel),
    argvPreviewLabels: [...preview],
  };
}

export function createHermesWsl2WrapperHumanSignoffChecklist(): readonly string[] {
  return [
    "distroName: non-empty, pattern matches WSL distro name rules",
    "unixUser: lowercase POSIX user token for /home/<user> layout",
    "wrapperPath: exact /home/<unixUser>/.hermes-bridge/hermes-bridge-payload-once.sh only",
    "windowsWslExePath: C:\\Windows\\System32\\wsl.exe exact (normalized) — Sysnative is V1.1-only gate",
    "allowedExecutableId: wsl-hermes-bridge-wrapper-v1",
    "expectedPayloadSchemaVersion: hermes-bridge-payload/v1",
    "timeoutMs / maxStdoutBytes / maxStderrBytes: within registry design caps",
    "signoffSource / operatorLabel: short non-secret labels",
    "signoffAtUnixMs: optional; ms range sanity if set",
    "No PATH lookup, WindowsApps alias, .cmd/.bat, shell strings, secrets, or .env references",
  ];
}
