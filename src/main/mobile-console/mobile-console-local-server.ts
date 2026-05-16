/**
 * MobileConsole localhost-only GET server — Phase 2B-2.
 *
 * STARTUP POLICY (Option A):
 *   This module is NOT wired to main/index.ts in Phase 2B-2.
 *   Auto-start is NOT enabled.
 *   Phase 2C will wire `startMobileConsoleLocalServer()` after
 *   pairing token and LAN controls are in place.
 *
 * BIND POLICY:
 *   Binds to 127.0.0.1 only. 0.0.0.0 throws at startup.
 *
 * ENDPOINT POLICY:
 *   GET-only. All writes (POST/PUT/PATCH/DELETE) → 405.
 *   Unknown routes → 404.
 *   No execution. No push. No Level 3 mutation.
 */
import { createServer, Server } from "http";
import type { IncomingMessage, ServerResponse } from "http";
import {
  MOBILE_CONSOLE_ALLOWED_BIND_HOST,
  MOBILE_CONSOLE_DEFAULT_PORT,
  assertBindHost,
  isAllowedMethod,
  writeJsonResponse,
  writeErrorResponse,
} from "./mobile-console-http-security";
import { buildLiveMobileConsoleSnapshot } from "./mobile-console-snapshot-service";
import { extractBearerToken } from "./mobile-console-pairing";
import type { ControlCenterDataProviderParams } from "../ichikishima/control-center/control-center-data-provider";

export interface MobileConsoleLocalServerOptions {
  getParams: () => ControlCenterDataProviderParams;
  port?: number;
  /** Override bind host for testing. Production must always be 127.0.0.1 (Phase 2B-2) or LAN IP (Phase 2C). */
  host?: string;
  /** Phase 2C pairing token. If provided, all non-health endpoints require it. */
  pairingToken?: string;
}

const ROUTES: ReadonlySet<string> = new Set([
  "/mobile/health",
  "/mobile/status",
  "/mobile/snapshot",
]);

function handleRequest(
  req: IncomingMessage,
  res: ServerResponse,
  opts: MobileConsoleLocalServerOptions,
): void {
  if (!isAllowedMethod(req.method)) {
    writeErrorResponse(res, 405, "method_not_allowed");
    return;
  }

  const pathname = (req.url ?? "/").split("?")[0];

  if (pathname === "/mobile/health") {
    writeJsonResponse(res, 200, {
      ok: true,
      phase: "2b-2",
      rawValuesReported: false,
    });
    return;
  }

  if (opts.pairingToken) {
    const bearer = extractBearerToken(req.headers["authorization"] as string | undefined);
    if (!bearer || bearer !== opts.pairingToken) {
      writeErrorResponse(res, 401, "unauthorized");
      return;
    }
  }

  if (pathname === "/mobile/status" || pathname === "/mobile/snapshot") {
    try {
      const snapshot = buildLiveMobileConsoleSnapshot({
        controlCenterParams: opts.getParams(),
      });
      const dataSource = opts.pairingToken
        ? ("redacted_snapshot_phase2c_same_lan" as const)
        : ("redacted_snapshot_phase2b_localhost" as const);
      writeJsonResponse(res, 200, { ...snapshot, dataSource });
    } catch {
      writeErrorResponse(res, 500, "snapshot_unavailable");
    }
    return;
  }

  if (!ROUTES.has(pathname)) {
    writeErrorResponse(res, 404, "not_found");
    return;
  }

  writeErrorResponse(res, 500, "not_available");
}

export interface MobileConsoleLocalServerInstance {
  readonly server: Server;
  readonly host: string;
  readonly port: number;
  readonly stop: () => Promise<void>;
}

/**
 * Start the localhost-only GET server.
 *
 * IMPORTANT: This function is NOT called from main/index.ts in Phase 2B-2.
 * It is wired in Phase 2C after pairing token is in place.
 */
export async function startMobileConsoleLocalServer(
  opts: MobileConsoleLocalServerOptions,
): Promise<MobileConsoleLocalServerInstance> {
  const host = opts.host ?? MOBILE_CONSOLE_ALLOWED_BIND_HOST;
  const port = opts.port ?? MOBILE_CONSOLE_DEFAULT_PORT;

  // Phase 2B-2 (no token): localhost-only guard. Phase 2C (token present): caller
  // (startPhase2cServer) already ran assertPhase2cBindHost — do not override with
  // the stricter 127.0.0.1-only check, which would reject LAN IPs.
  if (!opts.pairingToken) {
    assertBindHost(host);
  }

  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    handleRequest(req, res, opts);
  });

  await new Promise<void>((resolve, reject) => {
    server.on("error", reject);
    server.listen(port, host, () => {
      server.removeListener("error", reject);
      resolve();
    });
  });

  const stop = (): Promise<void> =>
    new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });

  return { server, host, port, stop };
}
