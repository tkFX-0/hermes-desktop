/**
 * Stage 1: sandbox 内 handoff の JSON を読み、validate →（任意）receiver queueへ。
 * 実 Hermes 起動・child_process・listen なし。V1 は inbox ファイルを削除／移動しない。
 */
import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from "fs";
import { basename, join } from "path";

import { checkReadAllowed } from "../autonomy-zone/read-policy";
import { validatePathInput } from "../autonomy-zone/path-guard";

import type { HermesConnectionAdapterResult } from "./hermes-connection-adapter";
import {
  enqueueViaAdapterLanePipeline,
  validateHermesConnectionAdapterInput,
} from "./hermes-connection-adapter";
import type { HermesBridgeInMemoryReceiverQueue } from "./hermes-bridge-receiver-queue";
import type { HermesBridgeReceiverQueueSubmitOutcome } from "./hermes-bridge-receiver-queue";

export const HERMES_FILE_HANDOFF_MARKER_SCHEMA_V1 =
  "hermes-file-handoff-marker/v1" as const;

/** 同名・同一時刻付き marker の連番割り当て上限。超過時は `HANDOFF_MARKER_PATH_COLLISION`。 */
export const HANDOFF_MARKER_COLLISION_MAX_ATTEMPTS = 1024;

export interface HermesFileHandoffAdapterOptions {
  /** Zone ルート絶対パス（実在） */
  zoneRoot: string;
  /**
   * Zone 直下の handoff ルート（例 `handoff`）。
   * inbox は `{zoneRoot}/{handoffRelativeDir}/inbox`
   */
  handoffRelativeDir?: string;
  /** 読込 UTF-8 上限（既定 Bridge payload 上限と同程度） */
  maxPayloadUtf8Bytes?: number;
}

export interface HermesFileHandoffError {
  code: string;
  message: string;
}

export type HermesFileHandoffStatus = "accepted" | "rejected";

export interface HermesFileHandoffSummary {
  inboxBasename: string;
  /** Zone からの inbox ファイル相対パス（説明用・短文） */
  inboxZoneRelativePath: string;
  payloadSchemaVersionMatched: boolean;
  taskIdBrief?: string;
  operationCount: number;
  partialEligible: boolean;
  interactionModeLabel: string;
  tierSummaryLabel: string;
  diagnostics: readonly string[];
}

export interface HermesFileHandoffInput extends HermesFileHandoffAdapterOptions {
  /** Zone からのパスまたは絶対パス（inbox 内の .json のみ許可） */
  targetPath: string;
  writeMarkers?: boolean;
  skipEnqueue?: boolean;
  queue?: HermesBridgeInMemoryReceiverQueue;
  nowUnixMs?: number;
}

export interface HermesFileHandoffMarkerV1 {
  markerSchemaVersion: typeof HERMES_FILE_HANDOFF_MARKER_SCHEMA_V1;
  status: HermesFileHandoffStatus;
  inboxZoneRelativePath: string;
  atUnixMs: number;
  summary: HermesFileHandoffSummaryWire;
  errors?: readonly HermesFileHandoffMarkerErrorWire[];
}

export interface HermesFileHandoffSummaryWire {
  inboxBasename: string;
  payloadSchemaVersionMatched: boolean;
  taskIdBrief?: string;
  operationCount: number;
  partialEligible: boolean;
  interactionModeLabel: string;
  tierSummaryLabel: string;
  diagnostics: readonly string[];
}

export interface HermesFileHandoffMarkerErrorWire {
  code: string;
  message: string;
}

interface HermesFileHandoffAccepted {
  status: "accepted";
  summary: HermesFileHandoffSummary;
  markerRelativePath?: string;
  adapterResult: Extract<HermesConnectionAdapterResult, { status: "accepted" }>;
  enqueueOutcome?: HermesBridgeReceiverQueueSubmitOutcome;
}

interface HermesFileHandoffRejected {
  status: "rejected";
  summary: HermesFileHandoffSummary;
  markerRelativePath?: string;
  adapterResult?: Extract<
    HermesConnectionAdapterResult,
    { status: "rejected" }
  >;
  errors: HermesFileHandoffError[];
}

export type HermesFileHandoffResult =
  | HermesFileHandoffAccepted
  | HermesFileHandoffRejected;

const DEFAULT_HANDOFF_DIR = "handoff";
const INBOX_SEGMENT = "inbox";
/** Bridge validate と同一デフォルト */
const DEFAULT_MAX_BYTES = 65536;

function utcTimestampSuffixForMarker(atUnixMs: number): string {
  const d = new Date(atUnixMs);
  const z = (n: number, w = 2): string => String(n).padStart(w, "0");
  return `${d.getUTCFullYear()}${z(d.getUTCMonth() + 1)}${z(d.getUTCDate())}-${z(d.getUTCHours())}${z(d.getUTCMinutes())}${z(d.getUTCSeconds())}`;
}

function allocateUniqueMarkerPath(options: {
  outDirAbs: string;
  baseNoExt: string;
  markerStatus: HermesFileHandoffStatus;
  atUnixMs: number;
}):
  | { ok: true; markerAbs: string; markerName: string }
  | { ok: false; errors: HermesFileHandoffError[] } {
  const kind = options.markerStatus === "accepted" ? "accepted" : "rejected";
  const stamp = utcTimestampSuffixForMarker(options.atUnixMs);

  for (let i = 0; i < HANDOFF_MARKER_COLLISION_MAX_ATTEMPTS; i += 1) {
    const timePart = i === 0 ? stamp : `${stamp}.${i}`;
    const markerName = `${options.baseNoExt}.${kind}.${timePart}.marker.json`;
    const markerAbs = join(options.outDirAbs, markerName);
    if (existsSync(markerAbs)) continue;
    const pending = `${markerAbs}.partial`;
    if (existsSync(pending)) continue;
    return { ok: true, markerAbs, markerName };
  }

  return {
    ok: false,
    errors: [
      {
        code: "HANDOFF_MARKER_PATH_COLLISION",
        message: `exhausted unique marker attempts (${HANDOFF_MARKER_COLLISION_MAX_ATTEMPTS})`,
      },
    ],
  };
}

export type MarkHermesFileHandoffProcessedOutcome =
  | { ok: true; markerRelativePath: string }
  | { ok: false; errors: HermesFileHandoffError[] };

function normalizeHandoffRelativeDir(raw: string | undefined): string | null {
  const dir = (raw ?? DEFAULT_HANDOFF_DIR).trim().replace(/\\/g, "/");
  const stripped = dir.replace(/^\/+|\/+$/g, "");
  if (!stripped || stripped.includes("..")) return null;
  for (const seg of stripped.split("/")) {
    if (!seg.trim() || seg === "." || seg === "..") return null;
  }
  return stripped;
}

function inboxPrefix(handoffDir: string): string {
  return `${handoffDir}/${INBOX_SEGMENT}/`;
}

/** inbox 直下のファイル相対パス（handoff/inbox/name.json）のみ受理 */
export function validateHermesFileHandoffPath(
  opts: HermesFileHandoffAdapterOptions & {
    targetPath: string;
  },
):
  | { ok: true; normalizedAbsolutePath: string; zoneRelativePath: string }
  | { ok: false; errors: HermesFileHandoffError[] } {
  const handoffDir = normalizeHandoffRelativeDir(opts.handoffRelativeDir);
  if (!handoffDir)
    return {
      ok: false,
      errors: [
        {
          code: "HANDOFF_INVALID_HANDOFF_ROOT",
          message: "handoffRelativeDir is invalid",
        },
      ],
    };

  const zErr = validatePathInput(opts.zoneRoot, "zoneRoot");
  if (zErr)
    return {
      ok: false,
      errors: [{ code: "HANDOFF_BAD_ZONE_ROOT", message: zErr.reason }],
    };

  const tpErr = validatePathInput(opts.targetPath, "targetPath");
  if (tpErr)
    return {
      ok: false,
      errors: [{ code: "HANDOFF_BAD_TARGET", message: tpErr.reason }],
    };

  const readCheck = checkReadAllowed({
    zoneRoot: opts.zoneRoot,
    targetPath: opts.targetPath,
  });
  if (!readCheck.ok) {
    return {
      ok: false,
      errors: [
        {
          code:
            readCheck.reasonCode === "DENIED_BY_PATH_GUARD"
              ? "HANDOFF_PATH_GUARD"
              : "HANDOFF_DENYLIST",
          message: readCheck.reason,
        },
      ],
    };
  }

  const zoneRelNorm = readCheck.relativePath.replace(/\\/g, "/");

  const needPrefix = inboxPrefix(handoffDir);
  const fileBase = basename(readCheck.normalizedPath);
  if (!fileBase.toLowerCase().endsWith(".json")) {
    return {
      ok: false,
      errors: [
        { code: "HANDOFF_NOT_JSON_FILE", message: "only .json inbox files" },
      ],
    };
  }

  if (fileBase.startsWith(".")) {
    return {
      ok: false,
      errors: [
        { code: "HANDOFF_HIDDEN_FILE", message: "hidden inbox files denied" },
      ],
    };
  }

  if (
    !zoneRelNorm.startsWith(needPrefix) ||
    zoneRelNorm === needPrefix.slice(0, -1)
  ) {
    return {
      ok: false,
      errors: [
        {
          code: "HANDOFF_OUTSIDE_INBOX",
          message: "path must stay under handoff inbox",
        },
      ],
    };
  }

  const afterInbox = zoneRelNorm.slice(needPrefix.length);
  if (!afterInbox || afterInbox.includes("/")) {
    return {
      ok: false,
      errors: [
        {
          code: "HANDOFF_INBOX_DEPTH",
          message: "only flat inbox files allowed",
        },
      ],
    };
  }

  return {
    ok: true,
    normalizedAbsolutePath: readCheck.normalizedPath,
    zoneRelativePath: zoneRelNorm,
  };
}

export function readHermesPayloadFromSandboxFile(
  opts: HermesFileHandoffAdapterOptions & {
    targetPath: string;
    maxPayloadUtf8Bytes?: number;
  },
):
  | {
      ok: true;
      wire: Record<string, unknown>;
      bytesUtf8: number;
      zoneRelativePath: string;
    }
  | { ok: false; errors: HermesFileHandoffError[] } {
  const v = validateHermesFileHandoffPath(opts);
  if (!v.ok) return v;

  const maxBytes = opts.maxPayloadUtf8Bytes ?? DEFAULT_MAX_BYTES;
  const absPath = v.normalizedAbsolutePath;
  if (!existsSync(absPath)) {
    return {
      ok: false,
      errors: [
        { code: "HANDOFF_FILE_MISSING", message: "inbox file not found" },
      ],
    };
  }

  const raw = readFileSync(absPath);
  if (raw.length === 0) {
    return {
      ok: false,
      errors: [{ code: "HANDOFF_EMPTY_FILE", message: "empty file" }],
    };
  }
  if (raw.length > maxBytes) {
    return {
      ok: false,
      errors: [
        {
          code: "HANDOFF_FILE_TOO_LARGE",
          message: `file exceeds ${maxBytes} bytes`,
        },
      ],
    };
  }

  let text: string;
  try {
    text = raw.toString("utf8");
  } catch {
    return {
      ok: false,
      errors: [{ code: "HANDOFF_UTF8_DECODE", message: "invalid UTF-8" }],
    };
  }

  if (Buffer.byteLength(text, "utf8") !== raw.length) {
    /** 防御: 複合文字列での乖離など */
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text) as unknown;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      ok: false,
      errors: [{ code: "HANDOFF_JSON_PARSE", message: msg.slice(0, 240) }],
    };
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return {
      ok: false,
      errors: [
        {
          code: "HANDOFF_JSON_NOT_OBJECT",
          message: "payload root must be object",
        },
      ],
    };
  }

  return {
    ok: true,
    wire: parsed as Record<string, unknown>,
    bytesUtf8: Buffer.byteLength(text, "utf8"),
    zoneRelativePath: v.zoneRelativePath,
  };
}

function buildEmptySummary(params: {
  inboxBasename: string;
  inboxZoneRelativePath: string;
  diagnostics?: readonly string[];
}): HermesFileHandoffSummary {
  return {
    inboxBasename: params.inboxBasename,
    inboxZoneRelativePath: params.inboxZoneRelativePath,
    payloadSchemaVersionMatched: false,
    taskIdBrief: undefined,
    operationCount: 0,
    partialEligible: false,
    interactionModeLabel: "production_stub",
    tierSummaryLabel: "",
    diagnostics: params.diagnostics?.length
      ? [...params.diagnostics.slice(0, 16)]
      : [],
  };
}

/** プレログ用短文（validated / raw は含めない） */
export function summarizeHermesFileHandoffResult(
  r: HermesFileHandoffResult,
): string {
  const s = r.summary;
  const base = `[handoff:${r.status}] file=${s.inboxBasename} sid=${s.taskIdBrief ?? "?"}`;
  const marker = r.markerRelativePath ? ` marker=${r.markerRelativePath}` : "";
  const ec =
    r.status === "rejected"
      ? ` errs=${r.errors
          .slice(0, 4)
          .map((e) => e.code)
          .join(",")}`
      : "";
  return `${base}${marker}${ec}`;
}

export function rejectHermesFileHandoffPayload(params: {
  inboxBasename: string;
  inboxZoneRelativePath: string;
  errors: HermesFileHandoffError[];
  diagnostics?: readonly string[];
}): HermesFileHandoffRejected {
  return {
    status: "rejected",
    summary: buildEmptySummary({
      inboxBasename: params.inboxBasename,
      inboxZoneRelativePath: params.inboxZoneRelativePath,
      diagnostics: params.diagnostics ?? params.errors.map((e) => e.code),
    }),
    errors: params.errors.slice(0, 32).map((e) => ({
      code: truncate(e.code, 80),
      message: truncate(e.message, 480),
    })),
    markerRelativePath: undefined,
  };
}

function truncate(s: string, max: number): string {
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

function summaryWire(
  summary: HermesFileHandoffSummary,
): HermesFileHandoffSummaryWire {
  return {
    inboxBasename: summary.inboxBasename,
    payloadSchemaVersionMatched: summary.payloadSchemaVersionMatched,
    taskIdBrief: summary.taskIdBrief,
    operationCount: summary.operationCount,
    partialEligible: summary.partialEligible,
    interactionModeLabel: summary.interactionModeLabel,
    tierSummaryLabel: summary.tierSummaryLabel,
    diagnostics: [...summary.diagnostics],
  };
}

/** marker のみ書き込む。inbox 元ファイルは V1 では触れない。既存 marker は上書きしない（UTC 時刻suffix＋連番）。 */
export function markHermesFileHandoffProcessed(params: {
  zoneRoot: string;
  handoffRelativeDir?: string;
  inboxZoneRelativePath: string;
  inboxBasename: string;
  markerStatus: HermesFileHandoffStatus;
  summary: HermesFileHandoffSummary;
  adapterErrors?: readonly HermesFileHandoffError[];
  atUnixMs: number;
}): MarkHermesFileHandoffProcessedOutcome {
  const handoffDir = normalizeHandoffRelativeDir(params.handoffRelativeDir);
  if (!handoffDir) {
    return {
      ok: false,
      errors: [
        { code: "HANDOFF_INVALID_HANDOFF_ROOT", message: "handoff dir" },
      ],
    };
  }

  const sub = params.markerStatus === "accepted" ? "processed" : "rejected";
  const outDirAbs = join(params.zoneRoot, handoffDir, sub);
  mkdirSync(outDirAbs, { recursive: true });

  const baseNoExt = params.inboxBasename.replace(/\.json$/i, "");

  const alloc = allocateUniqueMarkerPath({
    outDirAbs,
    baseNoExt,
    markerStatus: params.markerStatus,
    atUnixMs: params.atUnixMs,
  });
  if (!alloc.ok) return alloc;

  const markerPayload: HermesFileHandoffMarkerV1 = {
    markerSchemaVersion: HERMES_FILE_HANDOFF_MARKER_SCHEMA_V1,
    status: params.markerStatus,
    inboxZoneRelativePath: params.inboxZoneRelativePath,
    atUnixMs: params.atUnixMs,
    summary: summaryWire(params.summary),
    errors:
      params.markerStatus === "rejected"
        ? (params.adapterErrors ?? []).slice(0, 16).map((e) => ({
            code: truncate(e.code, 80),
            message: truncate(e.message, 200),
          }))
        : undefined,
  };

  const tmpPath = `${alloc.markerAbs}.partial`;
  try {
    writeFileSync(tmpPath, `${JSON.stringify(markerPayload)}\n`, "utf8");
    renameSync(tmpPath, alloc.markerAbs);
  } catch (e) {
    try {
      if (existsSync(tmpPath)) unlinkSync(tmpPath);
    } catch {
      /* ignore */
    }
    const msg = e instanceof Error ? e.message : String(e);
    return {
      ok: false,
      errors: [
        {
          code: "HANDOFF_MARKER_IO",
          message: truncate(msg, 240),
        },
      ],
    };
  }

  const markerRel = `${handoffDir}/${sub}/${alloc.markerName}`;
  return { ok: true, markerRelativePath: markerRel };
}

export function processHermesFileHandoffPayload(
  input: HermesFileHandoffInput,
): HermesFileHandoffResult {
  const inboxBaseUnknown = basename(input.targetPath.replace(/\\/g, "/"));

  const read = readHermesPayloadFromSandboxFile({
    zoneRoot: input.zoneRoot,
    handoffRelativeDir: input.handoffRelativeDir,
    targetPath: input.targetPath,
    maxPayloadUtf8Bytes: input.maxPayloadUtf8Bytes ?? DEFAULT_MAX_BYTES,
  });
  if (!read.ok) {
    const pathProbe = validateHermesFileHandoffPath({
      zoneRoot: input.zoneRoot,
      handoffRelativeDir: input.handoffRelativeDir,
      targetPath: input.targetPath,
    });
    const rel = pathProbe.ok
      ? pathProbe.zoneRelativePath
      : `handoff:inbox:${inboxBaseUnknown}`;
    let readErrors = [...read.errors];
    let markerRel: string | undefined;
    if (pathProbe.ok && input.writeMarkers) {
      const mk = markHermesFileHandoffProcessed({
        zoneRoot: input.zoneRoot,
        handoffRelativeDir: input.handoffRelativeDir,
        inboxZoneRelativePath: pathProbe.zoneRelativePath,
        inboxBasename: basename(pathProbe.zoneRelativePath),
        markerStatus: "rejected",
        summary: buildEmptySummary({
          inboxBasename: basename(pathProbe.zoneRelativePath),
          inboxZoneRelativePath: pathProbe.zoneRelativePath,
          diagnostics: read.errors.map((e) => e.code),
        }),
        adapterErrors: read.errors,
        atUnixMs: input.nowUnixMs ?? Date.now(),
      });
      if (mk.ok) markerRel = mk.markerRelativePath;
      else readErrors = [...readErrors, ...mk.errors];
    }

    const rejected = rejectHermesFileHandoffPayload({
      inboxBasename: pathProbe.ok
        ? basename(pathProbe.zoneRelativePath)
        : inboxBaseUnknown,
      inboxZoneRelativePath: pathProbe.ok ? pathProbe.zoneRelativePath : rel,
      errors: readErrors,
      diagnostics: readErrors.map((e) => e.code),
    });
    return markerRel
      ? { ...rejected, markerRelativePath: markerRel }
      : rejected;
  }

  const adapterResult = validateHermesConnectionAdapterInput({
    kind: "in_memory",
    payloadWire: read.wire,
  });

  const inboxBase = basename(read.zoneRelativePath);
  const im =
    adapterResult.status === "accepted"
      ? (adapterResult.enqueuePayload.interactionMode ?? "production_stub")
      : adapterResult.summary.interactionModeLabel;

  const fileSummaryBase: Omit<
    HermesFileHandoffSummary,
    "tierSummaryLabel" | "diagnostics"
  > = {
    inboxBasename: inboxBase,
    inboxZoneRelativePath: read.zoneRelativePath,
    payloadSchemaVersionMatched:
      adapterResult.summary.payloadSchemaVersionMatched,
    taskIdBrief: adapterResult.summary.taskIdBrief,
    operationCount: adapterResult.summary.operationCount,
    partialEligible: adapterResult.summary.partialEligible,
    interactionModeLabel: im === "dry_run" ? "dry_run" : "production_stub",
  };

  if (adapterResult.status === "rejected") {
    const fullSummaryErr: HermesFileHandoffSummary = {
      ...fileSummaryBase,
      tierSummaryLabel: adapterResult.summary.tierSummaryLabel,
      diagnostics: adapterResult.summary.diagnostics.length
        ? [...adapterResult.summary.diagnostics]
        : adapterResult.errors.map((e) => e.code),
    };
    const pathOk = validateHermesFileHandoffPath({
      zoneRoot: input.zoneRoot,
      handoffRelativeDir: input.handoffRelativeDir,
      targetPath: input.targetPath,
    });
    let markerRelativePath: string | undefined;
    let markerWriteErrs: HermesFileHandoffError[] = [];
    if (pathOk.ok && input.writeMarkers) {
      const mk = markHermesFileHandoffProcessed({
        zoneRoot: input.zoneRoot,
        handoffRelativeDir: input.handoffRelativeDir,
        inboxZoneRelativePath: pathOk.zoneRelativePath,
        inboxBasename: basename(pathOk.zoneRelativePath),
        markerStatus: "rejected",
        summary: fullSummaryErr,
        adapterErrors: adapterResult.errors.map((e) => ({
          code: e.code,
          message: e.message,
        })),
        atUnixMs: input.nowUnixMs ?? Date.now(),
      });
      if (mk.ok) markerRelativePath = mk.markerRelativePath;
      else markerWriteErrs = [...mk.errors];
    }

    const errorsFromAdapter = adapterResult.errors.map((e) => ({
      code: e.code,
      message: truncate(e.message, 480),
    }));

    const mergedErrs = [...errorsFromAdapter, ...markerWriteErrs];

    const rejectedEarly: HermesFileHandoffRejected = {
      status: "rejected",
      summary: fullSummaryErr,
      adapterResult,
      errors:
        mergedErrs.length > 0
          ? mergedErrs
          : [
              {
                code: "HANDOFF_ADAPTER_REJECTED",
                message: "validation failed",
              },
            ],
      markerRelativePath,
    };

    return rejectedEarly;
  }

  const okAdapter = adapterResult;
  const fullSummaryOk: HermesFileHandoffSummary = {
    ...fileSummaryBase,
    tierSummaryLabel: okAdapter.summary.tierSummaryLabel,
    diagnostics: [...okAdapter.summary.diagnostics],
  };

  let enqueueOutcome: HermesBridgeReceiverQueueSubmitOutcome | undefined;
  if (input.queue && !input.skipEnqueue) {
    enqueueOutcome = enqueueViaAdapterLanePipeline({
      queue: input.queue,
      nowUnixMs: input.nowUnixMs ?? Date.now(),
      adapterResult,
    });
  }

  let markerRelativePath: string | undefined;
  const markerDiag: string[] = [];
  const pathOk2 = validateHermesFileHandoffPath({
    zoneRoot: input.zoneRoot,
    handoffRelativeDir: input.handoffRelativeDir,
    targetPath: input.targetPath,
  });
  if (pathOk2.ok && input.writeMarkers) {
    const mk = markHermesFileHandoffProcessed({
      zoneRoot: input.zoneRoot,
      handoffRelativeDir: input.handoffRelativeDir,
      inboxZoneRelativePath: pathOk2.zoneRelativePath,
      inboxBasename: basename(pathOk2.zoneRelativePath),
      markerStatus: "accepted",
      summary: fullSummaryOk,
      atUnixMs: input.nowUnixMs ?? Date.now(),
    });
    if (mk.ok) markerRelativePath = mk.markerRelativePath;
    else markerDiag.push(...mk.errors.map((e) => e.code));
  }

  return {
    status: "accepted",
    summary: {
      ...fullSummaryOk,
      diagnostics: [...fullSummaryOk.diagnostics, ...markerDiag],
    },
    adapterResult: okAdapter,
    enqueueOutcome,
    markerRelativePath,
  };
}
