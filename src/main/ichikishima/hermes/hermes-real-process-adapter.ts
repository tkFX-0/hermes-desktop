/**
 * Real Hermes Process Adapter — **`child_process.execFile` のみ**（`spawn` / `exec` / `shell:true` 禁止）。
 * `HERMES_REAL_PROCESS_ADAPTER_FINAL_GATE.md` / Signoff §12 / Entry E-25 と整合。
 *
 * **Controlled Pilot Run**: `controlledPilot` に **許可 executable id・固定 argv・短文 signoff メタ**を必須とする。
 * 返却に stdout/stderr 全文・raw/validated payload・process handle を含めない。
 *
 * 既定は **`disabled`**。`enableRealProcessExecution` と `humanSignoffConfirmed` の両方が **明示 true**
 * のときのみ **短時間・timeout 付き**で subprocess を起動しうる。
 *
 * **`runHermesRealProcessIngressExec`**: 検証済み `HermesBridgePayload` を **`hermes-real-pilot-minimal` の鎖のみ**
 * が消費すること（IPC / renderer / Control Center への raw payload 直渡し禁止）。
 */
import { execFile } from "node:child_process";
import { realpathSync } from "node:fs";
import { isAbsolute, resolve } from "node:path";
import { promisify } from "node:util";

import {
  isInsidePath,
  isSamePath,
  normalizePathForCompare,
  resolveExistingPath,
  validatePathInput,
} from "../autonomy-zone/path-guard";
import type { HermesBridgePayload } from "./hermes-bridge-payload";
import {
  validateHermesBridgePayload,
  type HermesBridgePayloadValidationResult,
} from "./hermes-bridge-payload";

const execFileP = promisify(execFile) as (
  file: string,
  args: readonly string[],
  options: {
    cwd: string;
    env?: NodeJS.ProcessEnv;
    timeout?: number;
    maxBuffer?: number;
    windowsHide?: boolean;
  },
) => Promise<{ stdout: string | Buffer; stderr: string | Buffer }>;

const SECRET_ENV_KEY =
  /SECRET|PASSWORD|TOKEN|(^|_)KEY(_|$)|AUTH|CREDENTIAL|AWS_|AZURE_|OPENAI|API_KEY|PRIVATE|PAT\b/i;

export type HermesRealProcessAdapterStatus =
  | "disabled"
  | "rejected"
  | "timed_out"
  | "failed"
  | "completed";

export type HermesRealProcessAdapterReasonCode =
  | "REQUIRES_HUMAN_SIGNOFF"
  | "EXECUTABLE_NOT_ALLOWLISTED"
  | "ARGUMENTS_NOT_ALLOWLISTED"
  | "CWD_NOT_ALLOWED"
  | "ENV_NOT_ALLOWED"
  | "PROCESS_TIMEOUT"
  | "OUTPUT_TOO_LARGE"
  | "STDERR_TOO_LARGE"
  | "MALFORMED_OUTPUT"
  | "UNSUPPORTED_SCHEMA_VERSION"
  | "PAYLOAD_REJECTED"
  | "EXECUTION_FAILED"
  | "POLICY_REJECTED"
  | "SUCCESS";

export interface HermesRealProcessAdapterCommandPolicy {
  allowedExecutableRealPaths: readonly string[];
  allowedArgSequences: readonly ReadonlyArray<string>[];
}

/** 許可バイナリ 1 系統（id は証跡用短文ラベル。パスは allowlist 完全一致で解決） */
export interface HermesAllowedExecutablePolicy {
  allowedExecutableId: string;
  allowedExecutableRealPaths: readonly string[];
}

/** argv は **固定配列パターンの列挙のみ**（ユーザー入力を混ぜない） */
export interface HermesAllowedArgPolicy {
  allowedArgSequences: readonly ReadonlyArray<string>[];
}

/** Controlled Pilot 用の最小ポリシー束 */
export interface HermesRealProcessControlledPilotPolicy {
  executable: HermesAllowedExecutablePolicy;
  argv: HermesAllowedArgPolicy;
}

/** Signoff 証跡として返してよい短文メタのみ（payload・env・stdio 全文は含めない） */
export interface HermesRealProcessControlledPilotSignoffEvidenceMeta {
  signoffConfirmed: true;
  signoffSource: string;
  signoffAtUnixMs: number;
  operatorLabel: string;
  allowedExecutableId: string;
  adapterMode: string;
  timeoutMs: number;
  maxStdoutBytes: number;
  maxStderrBytes: number;
}

/** exec 活性化時に必須の Controlled Pilot 本文 */
export interface HermesRealProcessControlledPilotInvocation {
  policy: HermesRealProcessControlledPilotPolicy;
  signoffSource: string;
  signoffAtUnixMs: number;
  operatorLabel: string;
  adapterMode: string;
}

export interface HermesRealProcessAdapterOptionsBase {
  requestLabel?: string;
}

export type HermesRealProcessAdapterOptions =
  | (HermesRealProcessAdapterOptionsBase & {
      enableRealProcessExecution?: false;
      humanSignoffConfirmed?: false;
    })
  | HermesRealProcessAdapterExecCall;

export interface HermesRealProcessAdapterExecCall extends HermesRealProcessAdapterOptionsBase {
  enableRealProcessExecution: true;
  humanSignoffConfirmed: true;
  controlledPilot: HermesRealProcessControlledPilotInvocation;
  timeoutMs: number;
  maxStdoutBytes: number;
  maxStderrBytes: number;
  executablePath: string;
  cwd: string;
  args: readonly string[];
  zoneRoot: string;
  projectRoot: string;
  env?: Readonly<Record<string, string>>;
  /** **単体試験専用** — `execFile` を呼ばずに Buffer を返す */
  __testOnlySimulateExec?: (ctx: {
    executableRealpath: string;
    args: readonly string[];
    cwd: string;
  }) => Promise<{ stdout: Buffer; stderr: Buffer }>;
  /** @deprecated — `__testOnlySimulateExec` を推奨 */
  __testOnlyExecFile?: typeof execFile;
}

export interface HermesRealProcessAdapterPayloadValidationSummary {
  schemaVersionOk: boolean;
  operationCount?: number;
  taskIdBrief?: string;
  errorCodes?: readonly string[];
}

export interface HermesRealProcessAdapterResult {
  status: HermesRealProcessAdapterStatus;
  reasonCode: HermesRealProcessAdapterReasonCode;
  message: string;
  exitCode?: number;
  signalBrief?: string;
  stdoutBytes?: number;
  stderrBytes?: number;
  payloadValidationSummary?: HermesRealProcessAdapterPayloadValidationSummary;
  safeSummary?: string;
  /** Controlled Pilot 経路の exec では必ず付与（短文メタのみ） */
  signoffEvidence?: HermesRealProcessControlledPilotSignoffEvidenceMeta;
}

function isExecCall(
  o?: HermesRealProcessAdapterOptions,
): o is HermesRealProcessAdapterExecCall {
  if (o === undefined) return false;
  if (o.enableRealProcessExecution !== true) return false;
  if (o.humanSignoffConfirmed !== true) return false;
  const e = o as HermesRealProcessAdapterExecCall;
  return (
    typeof e.timeoutMs === "number" &&
    typeof e.maxStdoutBytes === "number" &&
    typeof e.maxStderrBytes === "number" &&
    typeof e.executablePath === "string" &&
    typeof e.cwd === "string" &&
    typeof e.zoneRoot === "string" &&
    typeof e.projectRoot === "string" &&
    Array.isArray(e.args) &&
    e.controlledPilot !== undefined &&
    typeof e.controlledPilot === "object" &&
    e.controlledPilot.policy !== undefined &&
    typeof e.controlledPilot.policy === "object"
  );
}

export function validateHermesRealProcessCommandPolicy(
  policy: HermesRealProcessAdapterCommandPolicy,
):
  | { ok: true }
  | { ok: false; reasonCode: "POLICY_REJECTED"; message: string } {
  if (!policy.allowedExecutableRealPaths?.length) {
    return {
      ok: false,
      reasonCode: "POLICY_REJECTED",
      message: "allowedExecutableRealPaths must be non-empty",
    };
  }
  if (!policy.allowedArgSequences || policy.allowedArgSequences.length < 1) {
    return {
      ok: false,
      reasonCode: "POLICY_REJECTED",
      message: "allowedArgSequences must list at least one argv pattern",
    };
  }
  return { ok: true };
}

export function buildCommandPolicyFromControlledPilot(
  pilot: HermesRealProcessControlledPilotPolicy,
): HermesRealProcessAdapterCommandPolicy {
  return {
    allowedExecutableRealPaths: pilot.executable.allowedExecutableRealPaths,
    allowedArgSequences: pilot.argv.allowedArgSequences,
  };
}

export function validateHermesRealProcessControlledPilotPolicy(
  pilot: HermesRealProcessControlledPilotPolicy,
):
  | { ok: true }
  | { ok: false; reasonCode: "POLICY_REJECTED"; message: string } {
  const id = pilot.executable?.allowedExecutableId?.trim() ?? "";
  if (!id.length) {
    return {
      ok: false,
      reasonCode: "POLICY_REJECTED",
      message: "allowedExecutableId required",
    };
  }
  if (id.length > 160) {
    return {
      ok: false,
      reasonCode: "POLICY_REJECTED",
      message: "allowedExecutableId too long",
    };
  }
  if (!pilot.executable?.allowedExecutableRealPaths?.length) {
    return {
      ok: false,
      reasonCode: "POLICY_REJECTED",
      message: "allowedExecutableRealPaths must be non-empty",
    };
  }
  if (!pilot.argv?.allowedArgSequences?.length) {
    return {
      ok: false,
      reasonCode: "POLICY_REJECTED",
      message: "allowedArgSequences must list at least one pattern",
    };
  }
  for (const seq of pilot.argv.allowedArgSequences) {
    if (!Array.isArray(seq)) {
      return {
        ok: false,
        reasonCode: "POLICY_REJECTED",
        message: "allowedArgSequences entries must be arrays",
      };
    }
  }
  return { ok: true };
}

function validateControlledPilotInvocationFields(
  inv: HermesRealProcessControlledPilotInvocation,
):
  | { ok: true }
  | { ok: false; reasonCode: "POLICY_REJECTED"; message: string } {
  const pi = validateHermesRealProcessControlledPilotPolicy(inv.policy);
  if (!pi.ok) return pi;

  const src =
    typeof inv.signoffSource === "string" ? inv.signoffSource.trim() : "";
  if (!src.length) {
    return {
      ok: false,
      reasonCode: "POLICY_REJECTED",
      message: "signoffSource required",
    };
  }
  if (src.length > 260) {
    return {
      ok: false,
      reasonCode: "POLICY_REJECTED",
      message: "signoffSource too long",
    };
  }
  if (
    typeof inv.signoffAtUnixMs !== "number" ||
    !Number.isFinite(inv.signoffAtUnixMs)
  ) {
    return {
      ok: false,
      reasonCode: "POLICY_REJECTED",
      message: "signoffAtUnixMs must be finite",
    };
  }

  const op =
    typeof inv.operatorLabel === "string" ? inv.operatorLabel.trim() : "";
  if (!op.length || op.length > 128) {
    return {
      ok: false,
      reasonCode: "POLICY_REJECTED",
      message: "operatorLabel invalid length",
    };
  }

  const mode =
    typeof inv.adapterMode === "string" ? inv.adapterMode.trim() : "";
  if (!mode.length || mode.length > 64) {
    return {
      ok: false,
      reasonCode: "POLICY_REJECTED",
      message: "adapterMode invalid length",
    };
  }

  return { ok: true };
}

function resolveTrustedPath(
  absPath: string,
  label: string,
): { ok: false; reason: string } | { ok: true; realpath: string } {
  const inv = validatePathInput(absPath, label);
  if (inv) return { ok: false, reason: inv.reason };
  if (!isAbsolute(absPath)) {
    return { ok: false, reason: `${label} must be absolute` };
  }
  try {
    return { ok: true, realpath: resolveExistingPath(absPath) };
  } catch {
    return { ok: false, reason: `${label} could not be resolved` };
  }
}

export function validateHermesExecutablePath(
  executablePath: string,
  policy: HermesRealProcessAdapterCommandPolicy,
): { ok: true; realpath: string } | { ok: false; message: string } {
  const r = resolveTrustedPath(executablePath, "executablePath");
  if (!r.ok) return { ok: false, message: r.reason };
  const normExec = normalizePathForCompare(r.realpath);
  for (const allow of policy.allowedExecutableRealPaths) {
    const ar = resolveTrustedPath(allow, "allowlistEntry");
    if (!ar.ok) continue;
    if (
      isSamePath(ar.realpath, r.realpath) ||
      normExec === normalizePathForCompare(ar.realpath)
    ) {
      return { ok: true, realpath: r.realpath };
    }
  }
  return { ok: false, message: "executable not in allowlist" };
}

export function validateHermesProcessArgs(
  args: readonly string[],
  policy: HermesRealProcessAdapterCommandPolicy,
): { ok: true } | { ok: false; message: string } {
  for (const pattern of policy.allowedArgSequences) {
    if (pattern.length !== args.length) continue;
    let match = true;
    for (let i = 0; i < args.length; i += 1) {
      if (args[i] !== pattern[i]) {
        match = false;
        break;
      }
    }
    if (match) return { ok: true };
  }
  return { ok: false, message: "argv not in allowedArgSequences" };
}

export function validateHermesProcessCwd(
  cwd: string,
  zoneRoot: string,
  projectRoot: string,
):
  | { ok: true; realpath: string }
  | { ok: false; reasonCode: "CWD_NOT_ALLOWED"; message: string } {
  const inv = validatePathInput(cwd, "cwd");
  if (inv)
    return { ok: false, reasonCode: "CWD_NOT_ALLOWED", message: inv.reason };
  if (!isAbsolute(cwd)) {
    return {
      ok: false,
      reasonCode: "CWD_NOT_ALLOWED",
      message: "cwd must be absolute",
    };
  }
  let cwdReal: string;
  let zoneReal: string;
  try {
    cwdReal = realpathSync.native(resolve(cwd));
    zoneReal = realpathSync.native(resolve(zoneRoot));
  } catch {
    return {
      ok: false,
      reasonCode: "CWD_NOT_ALLOWED",
      message: "cwd or zoneRoot could not be resolved",
    };
  }
  const sandboxResolved = resolve(
    projectRoot,
    "sandbox",
    "hermes-autonomy-zone",
  );
  let sandboxReal: string;
  try {
    sandboxReal = realpathSync.native(sandboxResolved);
  } catch {
    return {
      ok: false,
      reasonCode: "CWD_NOT_ALLOWED",
      message: "sandbox zone path could not be resolved",
    };
  }
  const inZone = isInsidePath(cwdReal, zoneReal);
  const inSandbox = isInsidePath(cwdReal, sandboxReal);
  if (!inZone && !inSandbox) {
    return {
      ok: false,
      reasonCode: "CWD_NOT_ALLOWED",
      message: "cwd must be under zoneRoot or sandbox/hermes-autonomy-zone",
    };
  }
  return { ok: true, realpath: cwdReal };
}

export function buildMinimalHermesProcessEnv(
  user?: Readonly<Record<string, string>>,
):
  | { ok: true; env: NodeJS.ProcessEnv }
  | { ok: false; reasonCode: "ENV_NOT_ALLOWED"; message: string } {
  const env: NodeJS.ProcessEnv = Object.create(null) as NodeJS.ProcessEnv;
  if (process.platform === "win32" && process.env.SystemRoot) {
    env.SystemRoot = process.env.SystemRoot;
  }
  if (!user || Object.keys(user).length === 0) return { ok: true, env };

  for (const [key, val] of Object.entries(user)) {
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
      return {
        ok: false,
        reasonCode: "ENV_NOT_ALLOWED",
        message: `invalid env key shape: ${key.slice(0, 32)}`,
      };
    }
    if (SECRET_ENV_KEY.test(key)) {
      return {
        ok: false,
        reasonCode: "ENV_NOT_ALLOWED",
        message: `forbidden env key pattern: ${key.slice(0, 32)}`,
      };
    }
    if (typeof val !== "string" || Buffer.byteLength(val, "utf8") > 4096) {
      return {
        ok: false,
        reasonCode: "ENV_NOT_ALLOWED",
        message: "env value must be string <= 4096 utf8 bytes",
      };
    }
    env[key] = val;
  }
  return { ok: true, env };
}

export function parseHermesProcessStdoutAsPayload(
  stdoutRaw: Buffer | string,
  maxUtf8Bytes: number,
): {
  parsed: Record<string, unknown> | null;
  byteLength: number;
  truncated: boolean;
} {
  const buf = Buffer.isBuffer(stdoutRaw)
    ? stdoutRaw
    : Buffer.from(stdoutRaw, "utf8");
  const byteLength = buf.length;
  let slice = buf;
  let truncated = false;
  if (byteLength > maxUtf8Bytes) {
    slice = buf.subarray(0, maxUtf8Bytes);
    truncated = true;
  }
  const text = slice.toString("utf8").trim();
  if (!text) return { parsed: null, byteLength, truncated };
  try {
    const parsed = JSON.parse(text) as Record<string, unknown>;
    return { parsed, byteLength, truncated };
  } catch {
    return { parsed: null, byteLength, truncated };
  }
}

function mapPayloadValidationSummary(
  v: HermesBridgePayloadValidationResult,
): HermesRealProcessAdapterPayloadValidationSummary {
  return {
    schemaVersionOk: !v.errors.some(
      (e) => e.code === "UNSUPPORTED_SCHEMA_VERSION",
    ),
    operationCount:
      v.normalizedPayload?.requestedOperations?.length ??
      v.operations?.length ??
      undefined,
    taskIdBrief: v.normalizedPayload?.taskId?.slice(0, 48),
    errorCodes: v.errors.slice(0, 8).map((e) => e.code),
  };
}

/** stdout/stderr 本文を含めない短文。 */
export function summarizeHermesProcessAdapterResult(
  r: HermesRealProcessAdapterResult,
): string {
  const parts = [
    `status=${r.status}`,
    `reason=${r.reasonCode}`,
    r.stdoutBytes !== undefined ? `outB=${r.stdoutBytes}` : "",
    r.stderrBytes !== undefined ? `errB=${r.stderrBytes}` : "",
    r.exitCode !== undefined ? `exit=${r.exitCode}` : "",
    r.signalBrief ? `sig=${r.signalBrief}` : "",
  ].filter(Boolean);
  return parts.join("|").slice(0, 512);
}

function rejectResult(
  reasonCode: HermesRealProcessAdapterReasonCode,
  message: string,
  extra?: Partial<
    Omit<HermesRealProcessAdapterResult, "status" | "reasonCode" | "message">
  >,
): HermesRealProcessAdapterResult {
  const core: HermesRealProcessAdapterResult = {
    status: "rejected",
    reasonCode,
    message: message.slice(0, 800),
    ...extra,
    safeSummary: "",
  };
  core.safeSummary = summarizeHermesProcessAdapterResult(core);
  return core;
}

type ExecInnerOutcome = {
  adapterResult: HermesRealProcessAdapterResult;
  normalizedPayload?: HermesBridgePayload;
};

function withSignoffEvidence(
  o: HermesRealProcessAdapterExecCall,
  r: HermesRealProcessAdapterResult,
): HermesRealProcessAdapterResult {
  const cp = o.controlledPilot;
  return {
    ...r,
    signoffEvidence: {
      signoffConfirmed: true,
      signoffSource: cp.signoffSource.slice(0, 260),
      signoffAtUnixMs: cp.signoffAtUnixMs,
      operatorLabel: cp.operatorLabel.slice(0, 128),
      allowedExecutableId: cp.policy.executable.allowedExecutableId.slice(
        0,
        160,
      ),
      adapterMode: cp.adapterMode.slice(0, 64),
      timeoutMs: o.timeoutMs,
      maxStdoutBytes: o.maxStdoutBytes,
      maxStderrBytes: o.maxStderrBytes,
    },
  };
}

function finalizeAdapter(
  o: HermesRealProcessAdapterExecCall,
  adapterResult: HermesRealProcessAdapterResult,
  normalizedPayload?: HermesBridgePayload,
): ExecInnerOutcome {
  return {
    adapterResult: withSignoffEvidence(o, adapterResult),
    normalizedPayload,
  };
}

async function execHermesProcessInner(
  o: HermesRealProcessAdapterExecCall,
): Promise<ExecInnerOutcome> {
  const invCk = validateControlledPilotInvocationFields(o.controlledPilot);
  if (!invCk.ok) {
    return {
      adapterResult: rejectResult(invCk.reasonCode, invCk.message),
    };
  }

  const derivedPolicy = buildCommandPolicyFromControlledPilot(
    o.controlledPilot.policy,
  );

  const pol = validateHermesRealProcessCommandPolicy(derivedPolicy);
  if (!pol.ok) {
    return finalizeAdapter(o, rejectResult(pol.reasonCode, pol.message));
  }

  if (
    typeof o.timeoutMs !== "number" ||
    o.timeoutMs < 100 ||
    o.timeoutMs > 3600_000
  ) {
    return finalizeAdapter(
      o,
      rejectResult(
        "POLICY_REJECTED",
        "timeoutMs must be between 100 and 3600000",
      ),
    );
  }

  if (typeof o.maxStdoutBytes !== "number" || o.maxStdoutBytes < 256) {
    return finalizeAdapter(
      o,
      rejectResult("POLICY_REJECTED", "maxStdoutBytes must be >= 256"),
    );
  }

  if (typeof o.maxStderrBytes !== "number" || o.maxStderrBytes < 256) {
    return finalizeAdapter(
      o,
      rejectResult("POLICY_REJECTED", "maxStderrBytes must be >= 256"),
    );
  }

  const ex = validateHermesExecutablePath(o.executablePath, derivedPolicy);
  if (!ex.ok) {
    return finalizeAdapter(
      o,
      rejectResult("EXECUTABLE_NOT_ALLOWLISTED", ex.message),
    );
  }

  const argsOk = validateHermesProcessArgs(o.args, derivedPolicy);
  if (!argsOk.ok) {
    return finalizeAdapter(
      o,
      rejectResult("ARGUMENTS_NOT_ALLOWLISTED", argsOk.message),
    );
  }

  const cwdOk = validateHermesProcessCwd(o.cwd, o.zoneRoot, o.projectRoot);
  if (!cwdOk.ok) {
    return finalizeAdapter(o, rejectResult(cwdOk.reasonCode, cwdOk.message));
  }

  const envB = buildMinimalHermesProcessEnv(o.env);
  if (!envB.ok) {
    return finalizeAdapter(o, rejectResult(envB.reasonCode, envB.message));
  }

  const runnerFn = o.__testOnlyExecFile
    ? (promisify(o.__testOnlyExecFile) as typeof execFileP)
    : execFileP;

  const maxBuffer = Math.max(o.maxStdoutBytes, o.maxStderrBytes, 65_536);

  let stdoutBuf: Buffer;
  let stderrBuf: Buffer;
  let exitCodeNum: number | undefined;

  try {
    if (o.__testOnlySimulateExec) {
      const sim = await o.__testOnlySimulateExec({
        executableRealpath: ex.realpath,
        args: o.args,
        cwd: cwdOk.realpath,
      });
      stdoutBuf = sim.stdout;
      stderrBuf = sim.stderr;
      exitCodeNum = 0;
    } else {
      const procRes = await runnerFn(ex.realpath, [...o.args], {
        cwd: cwdOk.realpath,
        env: envB.env,
        timeout: o.timeoutMs,
        maxBuffer,
        windowsHide: true,
      });

      stdoutBuf = Buffer.isBuffer(procRes.stdout)
        ? procRes.stdout
        : Buffer.from(String(procRes.stdout ?? ""), "utf8");

      stderrBuf = Buffer.isBuffer(procRes.stderr)
        ? procRes.stderr
        : Buffer.from(String(procRes.stderr ?? ""), "utf8");

      exitCodeNum = 0;
    }
  } catch (unknownErr: unknown) {
    const err = unknownErr as NodeJS.ErrnoException &
      Partial<{
        killed: boolean;
        code?: string | number;
        signal?: string;
        stdout: string | Buffer;
        stderr: string | Buffer;
      }>;

    const outRaw = err.stdout ?? "";
    const errRaw = err.stderr ?? "";

    stdoutBuf = Buffer.isBuffer(outRaw)
      ? outRaw
      : Buffer.from(String(outRaw), "utf8");
    stderrBuf = Buffer.isBuffer(errRaw)
      ? errRaw
      : Buffer.from(String(errRaw), "utf8");

    if (
      err.code === "ETIMEDOUT" ||
      err.killed === true ||
      err.signal === "SIGTERM"
    ) {
      if (stderrBuf.length > o.maxStderrBytes) {
        const ovr: HermesRealProcessAdapterResult = {
          status: "rejected",
          reasonCode: "STDERR_TOO_LARGE",
          message: "stderr exceeds cap after termination",
          stdoutBytes: stdoutBuf.length,
          stderrBytes: o.maxStderrBytes + 1,
          signalBrief:
            typeof err.signal === "string"
              ? err.signal.slice(0, 24)
              : "timeout",
        };
        ovr.safeSummary = summarizeHermesProcessAdapterResult(ovr);
        return finalizeAdapter(o, ovr);
      }
      const timed: HermesRealProcessAdapterResult = {
        status: "timed_out",
        reasonCode: "PROCESS_TIMEOUT",
        message: "child terminated by timeout",
        stdoutBytes: stdoutBuf.length,
        stderrBytes: stderrBuf.length,
        signalBrief:
          typeof err.signal === "string"
            ? err.signal.slice(0, 24)
            : String(err.code ?? "timeout"),
        exitCode:
          typeof err.code === "number" && Number.isFinite(err.code)
            ? err.code
            : undefined,
        safeSummary: "timed_out",
      };
      timed.safeSummary = summarizeHermesProcessAdapterResult(timed);
      return finalizeAdapter(o, timed);
    }

    const codeLabel = String(err.code ?? "");

    if (
      codeLabel.includes("MAXBUFFER") ||
      err.code === "ERR_CHILD_PROCESS_STDIO_MAXBUFFER"
    ) {
      const mx: HermesRealProcessAdapterResult = {
        status: "failed",
        reasonCode: "OUTPUT_TOO_LARGE",
        message: "stdio maxBuffer exceeded",
        stdoutBytes: Math.min(stdoutBuf.length, o.maxStdoutBytes),
        stderrBytes: Math.min(stderrBuf.length, o.maxStderrBytes),
      };
      mx.safeSummary = summarizeHermesProcessAdapterResult(mx);
      return finalizeAdapter(o, mx);
    }

    if (
      stdoutBuf.length > o.maxStdoutBytes ||
      stderrBuf.length > o.maxStderrBytes
    ) {
      const big: HermesRealProcessAdapterResult = {
        status: "failed",
        reasonCode:
          stdoutBuf.length > o.maxStdoutBytes
            ? "OUTPUT_TOO_LARGE"
            : "STDERR_TOO_LARGE",
        message: "output exceeded cap before validation",
        stdoutBytes: stdoutBuf.length,
        stderrBytes: stderrBuf.length,
      };
      big.safeSummary = summarizeHermesProcessAdapterResult(big);
      return finalizeAdapter(o, big);
    }

    if (
      typeof err.code === "number" &&
      Number.isFinite(err.code) &&
      err.code !== 0
    ) {
      const codeNum = err.code;
      const failEarly: HermesRealProcessAdapterResult = {
        status: "failed",
        reasonCode: "EXECUTION_FAILED",
        message: `non-zero exit (${codeNum})`,
        exitCode: codeNum,
        stdoutBytes: stdoutBuf.length,
        stderrBytes: stderrBuf.length,
      };
      failEarly.safeSummary = summarizeHermesProcessAdapterResult(failEarly);
      return finalizeAdapter(o, failEarly);
    }

    const unk: HermesRealProcessAdapterResult = {
      status: "failed",
      reasonCode: "EXECUTION_FAILED",
      message: codeLabel.slice(0, 420),
      stdoutBytes: stdoutBuf.length,
      stderrBytes: stderrBuf.length,
      safeSummary: "exec_throw",
    };
    unk.safeSummary = summarizeHermesProcessAdapterResult(unk);
    return finalizeAdapter(o, unk);
  }

  if (stdoutBuf.length > o.maxStdoutBytes) {
    return finalizeAdapter(
      o,
      rejectResult(
        "OUTPUT_TOO_LARGE",
        `stdout ${stdoutBuf.length} exceeds maxStdoutBytes ${o.maxStdoutBytes}`,
        { stdoutBytes: stdoutBuf.length, stderrBytes: stderrBuf.length },
      ),
    );
  }

  if (stderrBuf.length > o.maxStderrBytes) {
    return finalizeAdapter(
      o,
      rejectResult(
        "STDERR_TOO_LARGE",
        `stderr ${stderrBuf.length} exceeds maxStderrBytes ${o.maxStderrBytes}`,
        { stdoutBytes: stdoutBuf.length, stderrBytes: stderrBuf.length },
      ),
    );
  }

  const parsedWrap = parseHermesProcessStdoutAsPayload(
    stdoutBuf,
    o.maxStdoutBytes,
  );

  if (parsedWrap.truncated) {
    return finalizeAdapter(
      o,
      rejectResult("OUTPUT_TOO_LARGE", "stdout truncated at parse boundary", {
        stdoutBytes: parsedWrap.byteLength,
        stderrBytes: stderrBuf.length,
      }),
    );
  }

  if (parsedWrap.parsed === null) {
    return finalizeAdapter(
      o,
      rejectResult("MALFORMED_OUTPUT", "stdout is not JSON", {
        stdoutBytes: stdoutBuf.length,
        stderrBytes: stderrBuf.length,
      }),
    );
  }

  const validated = validateHermesBridgePayload(parsedWrap.parsed);

  const vSum = mapPayloadValidationSummary(validated);

  if (!validated.ok || !validated.normalizedPayload) {
    const rc = validated.errors.some(
      (e) => e.code === "UNSUPPORTED_SCHEMA_VERSION",
    )
      ? "UNSUPPORTED_SCHEMA_VERSION"
      : "PAYLOAD_REJECTED";

    return finalizeAdapter(
      o,
      rejectResult(
        rc,
        validated.errors
          .slice(0, 3)
          .map((e) => e.code)
          .join(","),
        {
          stdoutBytes: stdoutBuf.length,
          stderrBytes: stderrBuf.length,
          payloadValidationSummary: vSum,
        },
      ),
    );
  }

  const okRet: HermesRealProcessAdapterResult = {
    status: "completed",
    reasonCode: "SUCCESS",
    message: "ok",
    exitCode:
      typeof exitCodeNum === "number" && Number.isFinite(exitCodeNum)
        ? exitCodeNum
        : 0,
    stdoutBytes: stdoutBuf.length,
    stderrBytes: stderrBuf.length,
    payloadValidationSummary: {
      schemaVersionOk: true,
      operationCount: validated.normalizedPayload.requestedOperations.length,
      taskIdBrief: validated.normalizedPayload.taskId.slice(0, 48),
    },
    safeSummary: `payload_ok ops=${validated.normalizedPayload.requestedOperations.length}`,
  };
  okRet.safeSummary = summarizeHermesProcessAdapterResult(okRet);
  return finalizeAdapter(o, okRet, validated.normalizedPayload);
}

/**
 * アダプター単体：**返却に stdout/stderr 全文・raw payload・handle を含めない**。
 */
export async function runRealHermesProcessAdapter(
  options?: HermesRealProcessAdapterOptions,
): Promise<HermesRealProcessAdapterResult> {
  const o = options ?? {};

  if (o.enableRealProcessExecution !== true) {
    const dis: HermesRealProcessAdapterResult = {
      status: "disabled",
      reasonCode: "REQUIRES_HUMAN_SIGNOFF",
      message:
        "enableRealProcessExecution must be explicitly true — see HERMES_REAL_PROCESS_ADAPTER_FINAL_GATE.md",
    };
    dis.safeSummary = summarizeHermesProcessAdapterResult(dis);
    return dis;
  }

  if (o.humanSignoffConfirmed !== true) {
    const rej: HermesRealProcessAdapterResult = {
      status: "rejected",
      reasonCode: "REQUIRES_HUMAN_SIGNOFF",
      message: "humanSignoffConfirmed must be explicitly true before execFile",
    };
    rej.safeSummary = summarizeHermesProcessAdapterResult(rej);
    return rej;
  }

  if (!isExecCall(options)) {
    const rej: HermesRealProcessAdapterResult = {
      status: "rejected",
      reasonCode: "POLICY_REJECTED",
      message:
        "missing required exec fields (controlledPilot, timeouts, paths, args) after gates",
    };
    rej.safeSummary = summarizeHermesProcessAdapterResult(rej);
    return rej;
  }

  const r = await execHermesProcessInner(options);
  return r.adapterResult;
}

/**
 * **パイプライン専用** — `HermesBridgePayload` は **Receiver チェーンのみ** が使用する。
 * UI / preload / ipcMain へ渡さない。
 */
export async function runHermesRealProcessIngressExec(
  options: HermesRealProcessAdapterExecCall,
): Promise<
  | { ok: false; adapterResult: HermesRealProcessAdapterResult }
  | {
      ok: true;
      adapterResult: HermesRealProcessAdapterResult;
      normalizedPayload: HermesBridgePayload;
    }
> {
  const r = await execHermesProcessInner(options);

  if (r.adapterResult.status !== "completed") {
    return { ok: false, adapterResult: r.adapterResult };
  }

  if (!r.normalizedPayload) {
    return {
      ok: false,
      adapterResult: withSignoffEvidence(
        options,
        rejectResult(
          "EXECUTION_FAILED",
          "internal: missing normalized payload",
        ),
      ),
    };
  }

  return {
    ok: true,
    adapterResult: r.adapterResult,
    normalizedPayload: r.normalizedPayload,
  };
}

/** `controlledPilot.policy` と本体フィールドを分離して組み立てる際のヘルパ */
export type HermesRealProcessAdapterExecPhysicalFields = Omit<
  HermesRealProcessAdapterExecCall,
  "controlledPilot"
>;

export async function runRealHermesProcessAdapterWithPolicy(
  execCore: HermesRealProcessAdapterExecPhysicalFields,
  pilotPolicy: HermesRealProcessControlledPilotPolicy,
  signoffFields: Omit<HermesRealProcessControlledPilotInvocation, "policy">,
): Promise<HermesRealProcessAdapterResult> {
  const merged: HermesRealProcessAdapterExecCall = {
    ...execCore,
    controlledPilot: { policy: pilotPolicy, ...signoffFields },
  };
  return runRealHermesProcessAdapter(merged);
}
