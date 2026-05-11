/**
 * Controlled Pilot **設定の検証のみ** — 実プロセス・`execFile`・外部通信なし。
 * 実実行はユーザーがすべての値を明示した別 Goal でのみ。
 */
import { basename, isAbsolute } from "node:path";

import type { HermesRealProcessAdapterExecCall } from "./hermes-real-process-adapter";
import { validateHermesProcessCwd } from "./hermes-real-process-adapter";

const SECRET_ENV_KEY =
  /SECRET|PASSWORD|TOKEN|(^|_)KEY(_|$)|AUTH|CREDENTIAL|AWS_|AZURE_|OPENAI|API_KEY|PRIVATE|PAT\b/i;

/** argv フラグ／コマンド名に拒否する断片（Controlled Pilot の初期スコープ外） */
const FORBIDDEN_ARG_FRAGMENT =
  /--(prompt|file|exec|shell|network|install|write|delete|git|env|secret)\b/i;

/** 単体 argv に拒否する危険なコマンド名 */
const FORBIDDEN_EXECUTABLE_NAME = /^(cmd|powershell|pwsh|bash|sh)$/i;

const DOT_ENV_SEGMENT = /\.env$/i;

/**
 * Controlled Pilot の実行口区分。省略時は **`native_executable`** とみなす。
 * Windows 上で **`wsl.exe`** を allowlist する場合は **`wsl_wrapper`** を必須とし、argv を厳格固定する。
 */
export type HermesControlledPilotAdapterKind =
  | "native_executable"
  | "wsl_wrapper";

export interface HermesControlledPilotConfig {
  executablePath: string;
  /** 省略時は `native_executable` */
  adapterKind?: HermesControlledPilotAdapterKind;
  allowedExecutableId: string;
  argv: readonly string[];
  cwd: string;
  zoneRoot: string;
  projectRoot: string;
  timeoutMs: number;
  maxStdoutBytes: number;
  maxStderrBytes: number;
  humanSignoffConfirmed: boolean;
  enableRealProcessExecution: boolean;
  signoffAtUnixMs: number;
  signoffSource: string;
  operatorLabel: string;
  /** `controlledPilot.adapterMode` 相当（短文） */
  adapterMode?: string;
  notes?: string;
}

export interface HermesControlledPilotConfigError {
  code:
    | "MISSING_OR_INVALID_FIELD"
    | "GATE_FIELDS_INVALID"
    | "FORBIDDEN_ARG"
    | "FORBIDDEN_PATH_OR_TOKEN"
    | "UNSUPPORTED_SHAPE"
    | "CWD_NOT_ALLOWED"
    | "ADAPTER_KIND_MISMATCH"
    | "WSL_WRAPPER_ARGV_INVALID";
  field?: string;
  message: string;
}

export interface HermesControlledPilotConfigValidationResult {
  ok: boolean;
  errors: HermesControlledPilotConfigError[];
  missingFields: string[];
  safeSummaryLines: readonly string[];
}

export interface HermesControlledPilotPreparedRun {
  readonly ready: boolean;
  /** 絶対パスを外部要約へ出さない — 構造化ハンドオフ用 */
  readonly internalAdapterOptions?: unknown;
}

function suspiciousSecretText(s: string): boolean {
  return SECRET_ENV_KEY.test(s) || /\.env\b/i.test(s);
}

/** パス正規化後ベース名が `wsl.exe`（大小無視）か。 */
export function isWslExecutableBasename(executablePath: string): boolean {
  const b = basename(executablePath.trim().replace(/\\/g, "/"));
  return b.toLowerCase() === "wsl.exe";
}

/**
 * `wsl.exe` 用の **厳格 4 トークン** argv:
 * `["-d", "<DistroName>", "--", "/absolute/path/wrapper.sh"]`
 * — 実実行はしない（形のみ検証）。
 */
export function isStrictWslWrapperArgv(
  argv: readonly string[] | null | undefined,
): boolean {
  if (!argv || argv.length !== 4) return false;
  const [a0, distro, a2, script] = argv;
  if (a0 !== "-d") return false;
  if (typeof distro !== "string" || !distro.trim()) return false;
  if (a2 !== "--") return false;
  if (typeof script !== "string" || !script.trim()) return false;
  const s = script.trim();
  if (!s.startsWith("/")) return false;
  return true;
}

export function rejectIncompleteHermesControlledPilotConfig(
  config: HermesControlledPilotConfig,
): HermesControlledPilotConfigValidationResult {
  return validateHermesControlledPilotConfig(config);
}

export function validateHermesControlledPilotConfig(
  config: HermesControlledPilotConfig | undefined | null,
): HermesControlledPilotConfigValidationResult {
  const missing: string[] = [];
  const errors: HermesControlledPilotConfigError[] = [];

  if (!config || typeof config !== "object") {
    return {
      ok: false,
      errors: [
        {
          code: "UNSUPPORTED_SHAPE",
          message: "config missing",
        },
      ],
      missingFields: ["*"],
      safeSummaryLines: ["config:missing_object"],
    };
  }

  const pushMissing = (f: string): void => {
    missing.push(f);
    errors.push({
      code: "MISSING_OR_INVALID_FIELD",
      field: f,
      message: `${f} required`,
    });
  };

  const ep =
    typeof config.executablePath === "string"
      ? config.executablePath.trim()
      : "";
  if (!ep.length) pushMissing("executablePath");
  else if (!isAbsolute(ep)) {
    errors.push({
      code: "MISSING_OR_INVALID_FIELD",
      field: "executablePath",
      message: "executablePath must be absolute",
    });
    missing.push("executablePath.absolute");
  } else if (DOT_ENV_SEGMENT.test(ep) || /\.env\b/i.test(ep)) {
    errors.push({
      code: "FORBIDDEN_PATH_OR_TOKEN",
      field: "executablePath",
      message: ".env-like executable path forbidden",
    });
  }

  const idRaw =
    typeof config.allowedExecutableId === "string"
      ? config.allowedExecutableId.trim()
      : "";
  if (!idRaw.length) pushMissing("allowedExecutableId");

  const argv = Array.isArray(config.argv) ? config.argv : null;
  if (!argv?.length)
    errors.push({
      code: "MISSING_OR_INVALID_FIELD",
      field: "argv",
      message: "argv fixed array required",
    });

  const resolvedAdapterKind: HermesControlledPilotAdapterKind =
    config.adapterKind === "wsl_wrapper" ? "wsl_wrapper" : "native_executable";

  if (ep.length && isAbsolute(ep)) {
    const wslBin = isWslExecutableBasename(ep);
    if (wslBin && resolvedAdapterKind !== "wsl_wrapper") {
      errors.push({
        code: "ADAPTER_KIND_MISMATCH",
        field: "adapterKind",
        message:
          "executablePath basename is wsl.exe; set adapterKind to wsl_wrapper",
      });
    }
    if (!wslBin && resolvedAdapterKind === "wsl_wrapper") {
      errors.push({
        code: "ADAPTER_KIND_MISMATCH",
        field: "adapterKind",
        message: "wsl_wrapper requires executablePath basename wsl.exe",
      });
    }
    if (wslBin && resolvedAdapterKind === "wsl_wrapper" && argv?.length) {
      if (!isStrictWslWrapperArgv(argv)) {
        errors.push({
          code: "WSL_WRAPPER_ARGV_INVALID",
          field: "argv",
          message:
            "wsl.exe argv must be exactly [-d, <Distro>, --, /abs/wrapper.sh]",
        });
      }
    }
  }

  const cwd = typeof config.cwd === "string" ? config.cwd.trim() : "";
  if (!cwd.length) pushMissing("cwd");

  const zr = typeof config.zoneRoot === "string" ? config.zoneRoot.trim() : "";
  if (!zr.length) pushMissing("zoneRoot");

  const pr =
    typeof config.projectRoot === "string" ? config.projectRoot.trim() : "";
  if (!pr.length) pushMissing("projectRoot");

  if (
    typeof config.timeoutMs !== "number" ||
    config.timeoutMs < 100 ||
    config.timeoutMs > 3_600_000
  ) {
    errors.push({
      code: "MISSING_OR_INVALID_FIELD",
      field: "timeoutMs",
      message: "timeoutMs invalid range",
    });
    missing.push("timeoutMs");
  }

  if (typeof config.maxStdoutBytes !== "number" || config.maxStdoutBytes < 256)
    errors.push({
      code: "MISSING_OR_INVALID_FIELD",
      field: "maxStdoutBytes",
      message: "maxStdoutBytes invalid",
    });

  if (typeof config.maxStderrBytes !== "number" || config.maxStderrBytes < 256)
    errors.push({
      code: "MISSING_OR_INVALID_FIELD",
      field: "maxStderrBytes",
      message: "maxStderrBytes invalid",
    });

  if (config.humanSignoffConfirmed !== true) {
    errors.push({
      code: "GATE_FIELDS_INVALID",
      field: "humanSignoffConfirmed",
      message: "humanSignoffConfirmed must be literal true",
    });
    missing.push("humanSignoffConfirmed");
  }

  if (config.enableRealProcessExecution !== true) {
    errors.push({
      code: "GATE_FIELDS_INVALID",
      field: "enableRealProcessExecution",
      message: "enableRealProcessExecution must be literal true",
    });
    missing.push("enableRealProcessExecution");
  }

  if (
    typeof config.signoffAtUnixMs !== "number" ||
    !Number.isFinite(config.signoffAtUnixMs)
  ) {
    errors.push({
      code: "MISSING_OR_INVALID_FIELD",
      field: "signoffAtUnixMs",
      message: "signoffAtUnixMs must be finite",
    });
    missing.push("signoffAtUnixMs");
  }

  const src =
    typeof config.signoffSource === "string" ? config.signoffSource.trim() : "";
  if (!src.length) pushMissing("signoffSource");

  const op =
    typeof config.operatorLabel === "string" ? config.operatorLabel.trim() : "";
  if (!op.length || op.length > 128) {
    errors.push({
      code: "MISSING_OR_INVALID_FIELD",
      field: "operatorLabel",
      message: "operatorLabel invalid",
    });
    missing.push("operatorLabel");
  }

  /* argv と secrets */
  if (argv?.length) {
    const base = argv[argv.length - 1]?.replace(/\\/g, "/").split("/").pop();
    if (base && FORBIDDEN_EXECUTABLE_NAME.test(base)) {
      errors.push({
        code: "FORBIDDEN_ARG",
        field: "argv",
        message: "forbidden interpreter-like argv segment",
      });
    }

    if (argv.some((a) => typeof a !== "string" || !a.trim().length))
      errors.push({
        code: "FORBIDDEN_ARG",
        field: "argv",
        message: "argv must be non-empty strings only",
      });
    else
      for (const a of argv) {
        const t = String(a).trim();
        if (FORBIDDEN_ARG_FRAGMENT.test(t) || /\.env\b/i.test(t))
          errors.push({
            code: "FORBIDDEN_ARG",
            field: "argv",
            message: `forbidden argv fragment: ${t.slice(0, 32)}`,
          });
      }
  }

  for (const [label, txt] of [
    ["executablePath", ep],
    ["signoffSource", src],
    ["operatorLabel", op],
    ["notes", typeof config.notes === "string" ? config.notes : ""],
  ] as const) {
    if (txt?.length && suspiciousSecretText(txt)) {
      errors.push({
        code: "FORBIDDEN_PATH_OR_TOKEN",
        field: label,
        message: "secrets-ish or .env substring forbidden",
      });
    }
  }

  if (
    cwd.length &&
    zr.length &&
    pr.length &&
    argv?.length &&
    typeof config.timeoutMs === "number" &&
    typeof config.maxStdoutBytes === "number" &&
    typeof config.maxStderrBytes === "number"
  ) {
    const cw = validateHermesProcessCwd(cwd, zr, pr);
    if (!cw.ok) {
      errors.push({
        code: "CWD_NOT_ALLOWED",
        field: "cwd",
        message: cw.message,
      });
    }
  }

  const ok = errors.length === 0;
  const safeSummaryLines = ok
    ? [
        "config_validation:OK",
        `allowed_executable_id:${idRaw.slice(0, 96)}`,
        `argv_tokens:${argv?.length ?? 0}`,
      ]
    : [
        "config_validation:FAIL",
        `error_count:${errors.length}`,
        `missing_hints:${missing.slice(0, 6).join(",")}`,
      ];

  const dedupeMissing = [...new Set(missing)];
  return {
    ok,
    errors,
    missingFields: dedupeMissing,
    safeSummaryLines,
  };
}

/**
 * validated config から **実行はせず** 次 Goal へ渡せる構造のみ組み立てる。
 */
export function createHermesControlledPilotPreparedRun(
  config: HermesControlledPilotConfig,
): HermesControlledPilotPreparedRun {
  const v = validateHermesControlledPilotConfig(config);
  if (!v.ok) {
    return { ready: false };
  }

  const defaultAdapterMode =
    config.adapterKind === "wsl_wrapper"
      ? "controlled_pilot_wsl_wrapper"
      : "controlled_pilot_once";

  const execBundle: HermesRealProcessAdapterExecCall = {
    enableRealProcessExecution: true,
    humanSignoffConfirmed: true,
    controlledPilot: {
      policy: {
        executable: {
          allowedExecutableId: config.allowedExecutableId.trim(),
          allowedExecutableRealPaths: [config.executablePath.trim()],
        },
        argv: { allowedArgSequences: [[...config.argv]] },
      },
      signoffSource: config.signoffSource.trim(),
      signoffAtUnixMs: config.signoffAtUnixMs,
      operatorLabel: config.operatorLabel.trim(),
      adapterMode:
        typeof config.adapterMode === "string" &&
        config.adapterMode.trim().length > 0
          ? config.adapterMode.trim().slice(0, 64)
          : defaultAdapterMode,
    },
    timeoutMs: config.timeoutMs,
    maxStdoutBytes: config.maxStdoutBytes,
    maxStderrBytes: config.maxStderrBytes,
    executablePath: config.executablePath.trim(),
    cwd: config.cwd.trim(),
    args: config.argv,
    zoneRoot: config.zoneRoot.trim(),
    projectRoot: config.projectRoot.trim(),
  };
  return {
    ready: true,
    internalAdapterOptions: execBundle,
  };
}

export function summarizeHermesControlledPilotConfig(
  result: HermesControlledPilotConfigValidationResult,
): readonly string[] {
  return [...result.safeSummaryLines];
}
