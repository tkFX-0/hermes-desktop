/**
 * Controlled Pilot を将来の Control Center 向けに渡す **安全な短文要約のみ**。
 * **`executablePath` 絶対パス・stdio・payload 全文・secrets は返さない**。
 */
import type { HermesControlledPilotConfig } from "./hermes-controlled-pilot-config";
import type { HermesControlledPilotPreflightResult } from "./hermes-controlled-pilot-preflight";
import {
  isStrictWslWrapperArgv,
  validateHermesControlledPilotConfig,
  type HermesControlledPilotConfigValidationResult,
} from "./hermes-controlled-pilot-config";

export interface HermesControlledPilotPreparedSafetyOutline {
  readonly missingValueCount: number;
  readonly executablePathStatus: "missing" | "candidate" | "confirmed";
  readonly argvStatus: "missing" | "candidate" | "confirmed";
  readonly wslWrapperStatus:
    | "na"
    | "design_pending"
    | "argv_shape_ok_design_only";
  /** 外に出すフラグのみ false 固定。このフィールド自体は自動実行可否を明示しない（preflight メタとは別レイヤ）。 */
  readonly autoExecutionAllowed: false;
  readonly productionReady: false;
  readonly pendingFieldsCount: number;
  readonly nextRequiredUserAction: string;
}

export interface HermesControlledPilotDashboardSummary {
  controlledPilotCodeStatus:
    | "controlled_pilot_code_ready"
    | "controlled_pilot_code_not_checked";
  controlledPilotPreflightStatus: "GO_READY" | "NO_GO" | "not_evaluated";
  /** 自動実行フラグではない。**次 Goal で人手 1 回が論理可能か**のみ */
  canRunOnce: boolean;
  allowedExecutableId: string;
  argvPatternLabel: string;
  timeoutMs: number | null;
  maxStdoutBytes: number | null;
  maxStderrBytes: number | null;
  signoffSource: string;
  productionReady: false;
  persistent: false;
  ipcConnected: false;
  /** Controlled Pilot が実機準備〜値確定までの短文メタのみ。絶対パスは載せない。 */
  readonly preparedSafetyOutline: HermesControlledPilotPreparedSafetyOutline;
}

function buildHermesControlledPilotPreparedSafetyOutline(
  config: HermesControlledPilotConfig | null | undefined,
  vr: HermesControlledPilotConfigValidationResult,
): HermesControlledPilotPreparedSafetyOutline {
  const exe =
    config &&
    typeof config.executablePath === "string" &&
    config.executablePath.trim().length > 0;
  const argvLen = config?.argv?.length ?? 0;
  const executablePathStatus: "missing" | "candidate" | "confirmed" = !exe
    ? "missing"
    : vr.ok
      ? "confirmed"
      : "candidate";
  const argvStatus: "missing" | "candidate" | "confirmed" =
    argvLen === 0 ? "missing" : vr.ok ? "confirmed" : "candidate";
  const wslWrapperStatus:
    | "na"
    | "design_pending"
    | "argv_shape_ok_design_only" =
    config?.adapterKind === "wsl_wrapper"
      ? isStrictWslWrapperArgv(config.argv)
        ? "argv_shape_ok_design_only"
        : "design_pending"
      : "na";
  let next = "user:confirm_executable_signoff_argv_cwd_via_separate_goal";
  if (!exe) next = "user:provideExecutablePath_logical_only";
  else if (argvLen === 0) next = "user:provideArgv_logical_only";
  else if (vr.missingFields.length > 0) {
    next = `missing_fields:${vr.missingFields.slice(0, 6).join("+")}`;
  } else if (!vr.ok && vr.errors[0]?.code) {
    next = `validation:${vr.errors[0].code}`;
  }
  return {
    missingValueCount: vr.missingFields.length,
    executablePathStatus,
    argvStatus,
    wslWrapperStatus,
    autoExecutionAllowed: false,
    productionReady: false,
    pendingFieldsCount: vr.missingFields.length,
    nextRequiredUserAction: next.slice(0, 260),
  };
}

function argvPatternLabelFrom(argv: readonly string[] | undefined): string {
  if (!argv?.length) return "(no_argv)";
  const head = argv[0]?.trim().slice(0, 48) ?? "";
  const tail = argv[argv.length - 1]?.trim().slice(0, 48) ?? "";
  return `tokens=${argv.length}:h=${head}:t=${tail}`;
}

export function buildHermesControlledPilotDashboardSummary(
  config: HermesControlledPilotConfig | null | undefined,
  preflight?: HermesControlledPilotPreflightResult | null,
): HermesControlledPilotDashboardSummary {
  const v = validateHermesControlledPilotConfig(config ?? undefined);
  const pf = preflight ?? null;

  const idSafe =
    v.ok &&
    config &&
    typeof config.allowedExecutableId === "string" &&
    config.allowedExecutableId.trim().length > 0
      ? config.allowedExecutableId.trim().slice(0, 128)
      : "(redacted_until_valid_config)";

  const sign =
    v.ok &&
    config &&
    typeof config.signoffSource === "string" &&
    config.signoffSource.trim().length > 0
      ? config.signoffSource.trim().slice(0, 220)
      : "(redacted_until_valid_config)";

  const timeoutMs =
    config &&
    typeof config.timeoutMs === "number" &&
    Number.isFinite(config.timeoutMs)
      ? config.timeoutMs
      : null;
  const maxStdoutBytes =
    config &&
    typeof config.maxStdoutBytes === "number" &&
    Number.isFinite(config.maxStdoutBytes)
      ? config.maxStdoutBytes
      : null;
  const maxStderrBytes =
    config &&
    typeof config.maxStderrBytes === "number" &&
    Number.isFinite(config.maxStderrBytes)
      ? config.maxStderrBytes
      : null;

  const argvLbl = v.ok
    ? argvPatternLabelFrom(config?.argv)
    : "(redacted_until_valid_config)";

  const preflightStat: HermesControlledPilotDashboardSummary["controlledPilotPreflightStatus"] =
    pf ? pf.status : "not_evaluated";

  return {
    controlledPilotCodeStatus: "controlled_pilot_code_ready",
    controlledPilotPreflightStatus: preflightStat,
    canRunOnce: pf?.canRunOnce ?? false,
    allowedExecutableId: idSafe,
    argvPatternLabel: argvLbl,
    timeoutMs,
    maxStdoutBytes,
    maxStderrBytes,
    signoffSource: sign,
    productionReady: false,
    persistent: false,
    ipcConnected: false,
    preparedSafetyOutline: buildHermesControlledPilotPreparedSafetyOutline(
      config ?? undefined,
      v,
    ),
  };
}
