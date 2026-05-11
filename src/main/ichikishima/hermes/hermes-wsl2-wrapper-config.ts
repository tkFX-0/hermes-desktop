/**
 * WSL2 wrapper **設計入力の検証** — `wsl.exe` を起動しない。`execFile`・外部通信なし。
 */

import {
  type HermesControlledPilotAdapterKind,
  isStrictWslWrapperArgv,
} from "./hermes-controlled-pilot-config";

/** 入力はすべて任意。欠落は **`pending`** として扱い、強制エラーにはしない（安全サマリー用）。 */
export interface HermesWsl2WrapperConfigInput {
  readonly distroName?: string;
  /** WSL 内の wrapper 論理パス（先頭 `/` で始まる想定のみ受理）。詳細全文は Renderer に渡さない。 */
  readonly wrapperScriptPathInsideWsl?: string;
  readonly unixUserSlug?: string;
  readonly allowedExecutableId?: string;
  /** Windows allowlist で使う論理 argv（完全一致検証のみ）。実行しない。 */
  readonly argv?: readonly string[];
  readonly adapterKind?: HermesControlledPilotAdapterKind;
}

export type HermesWsl2WrapperValidationOutcome =
  | "pending"
  | "invalidArgv"
  | "forbiddenToken"
  | "designReadyNoExecution";

export interface HermesWsl2WrapperValidationResult {
  readonly outcome: HermesWsl2WrapperValidationOutcome;
  readonly pendingFields: readonly string[];
  readonly messages: readonly string[];
  readonly argvTokenCount: number;
}

export interface HermesWsl2WrapperSummary {
  readonly statusLine: string;
  readonly outcome: HermesWsl2WrapperValidationOutcome;
  readonly pendingFields: readonly string[];
}

export interface HermesWsl2WrapperPreparedRun {
  readonly executableId: string;
  readonly willInvokeWsl: false;
  readonly argvTokenCount: number;
  readonly outcome: HermesWsl2WrapperValidationOutcome;
  readonly nextRequiredUserAction: string;
}

const FORBIDDEN_ARG_JOIN =
  /(\.env)|(curl)|(wget)|(http:)|(https:)|(install)|(npm)|(pip)|(git\s+push)|[\r\n]|(\|\|)|(`)|(\$\()/i;

const REQUIRED_FIELDS = [
  "distroName",
  "wrapperScriptPathInsideWsl",
  "allowedExecutableId",
] as const;

function forbiddenTokenInArgv(argv: readonly string[]): boolean {
  const j = argv.join("\0");
  return FORBIDDEN_ARG_JOIN.test(j);
}

/** ユーザー向け短文 — パス詳細・secrets を含めない。 */
export function validateHermesWsl2WrapperConfig(
  input: HermesWsl2WrapperConfigInput | null | undefined,
): HermesWsl2WrapperValidationResult {
  const pending: string[] = [];

  if (!input || typeof input !== "object") {
    REQUIRED_FIELDS.forEach((f) => pending.push(f));
    return {
      outcome: "pending",
      pendingFields: pending,
      messages: ["input_missing_or_null"],
      argvTokenCount: 0,
    };
  }

  const argvTokenCount = Array.isArray(input.argv) ? input.argv.length : 0;

  for (const f of REQUIRED_FIELDS) {
    const v = input[f as keyof HermesWsl2WrapperConfigInput];
    if (typeof v !== "string" || !String(v).trim()) {
      pending.push(f);
    }
  }

  if (
    typeof input.wrapperScriptPathInsideWsl === "string" &&
    input.wrapperScriptPathInsideWsl.trim() !== "" &&
    !input.wrapperScriptPathInsideWsl.trim().startsWith("/")
  ) {
    return {
      outcome: "invalidArgv",
      pendingFields: [],
      messages: ["wrapper_script_must_start_with_slash_inside_wsl"],
      argvTokenCount,
    };
  }

  if (pending.length > 0) {
    return {
      outcome: "pending",
      pendingFields: pending,
      messages: ["missing_required_logical_fields"],
      argvTokenCount,
    };
  }

  if (
    typeof input.wrapperScriptPathInsideWsl === "string" &&
    forbiddenTokenInArgv([input.wrapperScriptPathInsideWsl])
  ) {
    return {
      outcome: "forbiddenToken",
      pendingFields: [],
      messages: ["forbidden_fragment_in_wrapper_path_hint"],
      argvTokenCount,
    };
  }

  if (input.adapterKind === "wsl_wrapper") {
    if (!isStrictWslWrapperArgv(input.argv ?? [])) {
      return {
        outcome: "invalidArgv",
        pendingFields: [],
        messages: ["wsl_adapter_requires_strict_four_token_argv"],
        argvTokenCount,
      };
    }
  }

  if (
    argvTokenCount > 0 &&
    input.argv !== undefined &&
    forbiddenTokenInArgv(input.argv ?? [])
  ) {
    return {
      outcome: "forbiddenToken",
      pendingFields: [],
      messages: ["dangerous_argv_fragment_blocked"],
      argvTokenCount,
    };
  }

  return {
    outcome: "designReadyNoExecution",
    pendingFields: [],
    messages: ["shape_ok_execution_forbidden_goal"],
    argvTokenCount,
  };
}

export function summarizeHermesWsl2WrapperConfig(
  input: HermesWsl2WrapperConfigInput | null | undefined,
): HermesWsl2WrapperSummary {
  const v = validateHermesWsl2WrapperConfig(input);
  const pf = v.pendingFields.length;
  const line =
    pf > 0
      ? `pending_fields=${pf}:${v.pendingFields.join("+")}`
      : v.outcome === "designReadyNoExecution"
        ? "design_ready_no_execution"
        : `outcome=${v.outcome}`;
  return {
    statusLine: line.slice(0, 220),
    outcome: v.outcome,
    pendingFields: [...v.pendingFields],
  };
}

/**
 * 「この設定なら論理準備のみ」オブジェクト。**プロセスは起動しない**。
 */
export function createHermesWsl2WrapperPreparedRun(
  input: HermesWsl2WrapperConfigInput | null | undefined,
): HermesWsl2WrapperPreparedRun {
  const v = validateHermesWsl2WrapperConfig(input);
  const exeId =
    input?.allowedExecutableId && String(input.allowedExecutableId).trim()
      ? String(input.allowedExecutableId).trim().slice(0, 96)
      : "pending:allowed_executable_id";
  let next = "defer:separate_goal_user_signoff_before_wsl_invoke";
  if (v.outcome === "pending") {
    next = "provide:distroName+wrapperPathInsideWsl+allowedExecutableId";
  } else if (v.outcome === "invalidArgv") {
    next = "fix:strict_wsl_four_token_argv";
  } else if (v.outcome === "forbiddenToken") {
    next = "remove:forbidden_argv_or_path_fragments";
  }
  return {
    executableId: exeId,
    willInvokeWsl: false,
    argvTokenCount: v.argvTokenCount,
    outcome: v.outcome,
    nextRequiredUserAction: next,
  };
}
