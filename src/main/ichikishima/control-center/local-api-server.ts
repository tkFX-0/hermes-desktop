/**
 * Control Center localhost read-only HTTP の最小サーバー。
 * **`node:http` のみ**。CORS を付けない。`OPTIONS`/`HEAD`/書込メソッドは拒否。
 */

import http from "node:http";

import { getControlCenterReadonlyData } from "./control-center-data-provider";
import type { ControlCenterDataProviderParams } from "./control-center-data-provider";
import {
  CONTROL_CENTER_LOCAL_API_BIND_LOOPBACK_IPV4,
  CONTROL_CENTER_LOCAL_API_MAX_SNAPSHOT_BODY_BYTES_GUESS,
  type ControlCenterLocalApiErrorEnvelope,
} from "./local-api-contract";

const SNAPSHOT_PATH = "/snapshot";

function errEnvelope(input: {
  reasonCode: string;
  reason: string;
}): ControlCenterLocalApiErrorEnvelope {
  const reason =
    input.reason.length > 500 ? `${input.reason.slice(0, 499)}…` : input.reason;
  return { ok: false, reasonCode: input.reasonCode, reason };
}

function sendJsonUnknown(
  res: http.ServerResponse,
  status: number,
  body: unknown,
): void {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

function sendError(
  res: http.ServerResponse,
  status: number,
  envelope: ControlCenterLocalApiErrorEnvelope,
): void {
  sendJsonUnknown(res, status, envelope);
}

function parsePathname(rawUrl: string | undefined): string {
  try {
    return new URL(rawUrl ?? "/", "http://127.0.0.1").pathname;
  } catch {
    return "/";
  }
}

function normalizedMethod(method: string | undefined): string {
  return (method ?? "").toUpperCase();
}

/** CORS は付けない（意図的に未定義）。 */
function assertBindHost(host: string | undefined): string {
  const h =
    host === undefined || host.trim() === ""
      ? CONTROL_CENTER_LOCAL_API_BIND_LOOPBACK_IPV4
      : host.trim();

  const lower = h.toLowerCase();
  const banned = ["0.0.0.0", "::", "[::]", "localhost"];

  const isOtherIPv4LoopbackGuess =
    /^\d+\.\d+\.\d+\.\d+$/.test(lower) &&
    lower !== CONTROL_CENTER_LOCAL_API_BIND_LOOPBACK_IPV4;

  const looksIPv6 = lower.includes(":");

  if (
    banned.includes(lower) ||
    looksIPv6 ||
    lower !== CONTROL_CENTER_LOCAL_API_BIND_LOOPBACK_IPV4 ||
    isOtherIPv4LoopbackGuess
  ) {
    throw new HostBindRejectedError();
  }

  return CONTROL_CENTER_LOCAL_API_BIND_LOOPBACK_IPV4;
}

class HostBindRejectedError extends Error {
  readonly code = "HOST_BIND_REJECTED" as const;
  constructor() {
    super("only 127.0.0.1 bind is allowed");
    this.name = "HostBindRejectedError";
  }
}

export interface ControlCenterLocalApiServerHandle {
  readonly server: http.Server;
  readonly boundHost: string;
  readonly boundPort: number;
}

export interface ControlCenterLocalApiServerOptions {
  readonly providerParams: ControlCenterDataProviderParams;
  /** 省略または空は `127.0.0.1`。それ以外は拒否して起動しない。 */
  readonly host?: string;
  /** 省略時は OS エフェメラル（競合軽減）。 */
  readonly port?: number;
}

export type StartControlCenterLocalApiServerResult =
  | {
      readonly ok: true;
      readonly handle: ControlCenterLocalApiServerHandle;
    }
  | {
      readonly ok: false;
      readonly reasonCode: string;
      readonly reason: string;
    };

export type StopControlCenterLocalApiServerResult =
  | { readonly ok: true }
  | {
      readonly ok: false;
      readonly reasonCode: string;
      readonly reason: string;
    };

let activeHandle: ControlCenterLocalApiServerHandle | undefined;

function handleIncoming(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  providerParams: ControlCenterDataProviderParams,
): void {
  try {
    const pathname = parsePathname(req.url);
    const method = normalizedMethod(req.method);

    // パスが /snapshot 以外は 404
    if (pathname !== SNAPSHOT_PATH) {
      sendError(
        res,
        404,
        errEnvelope({ reasonCode: "NOT_FOUND", reason: "見つかりません" }),
      );
      return;
    }

    // /snapshot で GET のみ許可（HEAD/OPTIONS は body 無しで 405 とし、読取面を増やさない）
    if (method !== "GET") {
      if (method === "HEAD" || method === "OPTIONS") {
        res.statusCode = 405;
        res.end();
        return;
      }
      sendError(
        res,
        405,
        errEnvelope({
          reasonCode: "METHOD_NOT_ALLOWED",
          reason: "GET /snapshot のみ許可されています",
        }),
      );
      return;
    }

    let body: unknown;
    try {
      body = getControlCenterReadonlyData(providerParams);
    } catch {
      sendError(
        res,
        500,
        errEnvelope({
          reasonCode: "SNAPSHOT_INTERNAL_ERROR",
          reason: "Snapshot の構築に失敗しました",
        }),
      );
      return;
    }

    let jsonRaw: string;
    try {
      jsonRaw = JSON.stringify(body);
    } catch {
      sendError(
        res,
        500,
        errEnvelope({
          reasonCode: "SERIALIZATION_ERROR",
          reason: "JSON 直列化に失敗しました",
        }),
      );
      return;
    }

    if (
      Buffer.byteLength(jsonRaw, "utf8") >
      CONTROL_CENTER_LOCAL_API_MAX_SNAPSHOT_BODY_BYTES_GUESS
    ) {
      sendError(
        res,
        507,
        errEnvelope({
          reasonCode: "RESPONSE_TOO_LARGE",
          reason: "Snapshot が大きすぎます",
        }),
      );
      return;
    }

    sendJsonUnknown(res, 200, body);
  } catch {
    sendError(
      res,
      500,
      errEnvelope({
        reasonCode: "UNHANDLED",
        reason: "内部エラー",
      }),
    );
  }
}

export function startControlCenterLocalApiServer(
  options: ControlCenterLocalApiServerOptions,
): Promise<StartControlCenterLocalApiServerResult> {
  if (activeHandle?.server.listening) {
    return Promise.resolve({
      ok: false,
      reasonCode: "LOCAL_API_ALREADY_STARTED",
      reason:
        "既に localhost read-only API が稼働中です。stop してから再開してください",
    });
  }

  let bindHost: string;
  try {
    bindHost = assertBindHost(options.host);
  } catch {
    return Promise.resolve({
      ok: false,
      reasonCode: "BIND_HOST_REJECTED",
      reason: "127.0.0.1 以外への bind は拒否されています",
    });
  }

  const port = options.port === undefined ? 0 : options.port;
  const providerParams = options.providerParams;

  const server = http.createServer((req, res) => {
    handleIncoming(req, res, providerParams);
  });

  return new Promise<StartControlCenterLocalApiServerResult>((resolve) => {
    let settled = false;
    function finishFailure(reasonCode: string, reason: string): void {
      if (settled) return;
      settled = true;
      try {
        server.close();
      } catch {
        // ignore
      }
      resolve({ ok: false, reasonCode, reason });
    }

    function finishOk(handle: ControlCenterLocalApiServerHandle): void {
      if (settled) return;
      settled = true;
      resolve({ ok: true, handle });
    }

    function onListening(): void {
      server.off("error", onError);
      const addr = server.address();
      if (
        typeof addr !== "object" ||
        addr === null ||
        typeof addr.port !== "number"
      ) {
        finishFailure(
          "BIND_ADDRESS_MISSING",
          "bind ポートの取得に失敗しました",
        );
        return;
      }
      const handle: ControlCenterLocalApiServerHandle = {
        server,
        boundHost: bindHost,
        boundPort: addr.port,
      };
      activeHandle = handle;
      finishOk(handle);
    }

    function onError(err: NodeJS.ErrnoException): void {
      activeHandle = undefined;
      server.off("listening", onListening);
      finishFailure(
        typeof err.code === "string" && err.code.length > 0
          ? err.code
          : "LISTEN_FAILED",
        err.code === "EADDRINUSE"
          ? "指定ポートが既に使用されています"
          : "listen に失敗しました",
      );
    }

    server.once("listening", onListening);
    server.once("error", onError);

    try {
      server.listen(port, bindHost);
    } catch {
      finishFailure("LISTEN_EXCEPTION", "listen 呼び出しに失敗しました");
    }
  });
}

export function stopControlCenterLocalApiServer(
  handle: ControlCenterLocalApiServerHandle,
): Promise<StopControlCenterLocalApiServerResult> {
  return new Promise<StopControlCenterLocalApiServerResult>((resolve) => {
    if (typeof handle?.server?.close !== "function") {
      resolve({
        ok: false,
        reasonCode: "INVALID_HANDLE",
        reason: "無効なハンドルです",
      });
      return;
    }
    handle.server.close((err?: Error) => {
      if (activeHandle?.server === handle.server) activeHandle = undefined;
      if (err) {
        resolve({
          ok: false,
          reasonCode: "STOP_FAILED",
          reason: String(err.message).slice(0, 200),
        });
        return;
      }
      resolve({ ok: true });
    });
  });
}
