/**
 * Phase 2C — same-LAN iPhone access with pairing token.
 *
 * DISABLED BY DEFAULT. Only starts when:
 *   MOBILE_CONSOLE_PHASE_2C_ENABLED = true
 *
 * BIND POLICY:
 *   Discovers first non-loopback IPv4 via os.networkInterfaces().
 *   Never binds to 0.0.0.0 or hardcoded IPs.
 *
 * AUTH POLICY:
 *   All endpoints (except /mobile/health) require pairing token.
 */
import { networkInterfaces } from "os";
import { startMobileConsoleLocalServer } from "./mobile-console-local-server";
import type { MobileConsoleLocalServerInstance } from "./mobile-console-local-server";
import { createPairingState } from "./mobile-console-pairing";
import type { PairingState } from "./mobile-console-pairing";
import type { ControlCenterDataProviderParams } from "../ichikishima/control-center/control-center-data-provider";

/** Set to true only after explicit Phase 2C GO. Remains false by default. */
export const MOBILE_CONSOLE_PHASE_2C_ENABLED = false as const;

export const MOBILE_CONSOLE_PHASE_2C_PORT = 3030 as const;

/** Discover first non-loopback IPv4 address. Returns null if none found. */
export function discoverLanIp(): string | null {
  for (const ifaces of Object.values(networkInterfaces())) {
    for (const addr of ifaces ?? []) {
      if (addr.family === "IPv4" && !addr.internal) {
        return addr.address;
      }
    }
  }
  return null;
}

function assertPhase2cBindHost(host: string): void {
  if (host === "0.0.0.0" || host === "::" || host === "") {
    throw new Error(`phase2c:forbidden_bind_host:${host}`);
  }
  if (host === "127.0.0.1") {
    throw new Error("phase2c:use_lan_ip_not_localhost — localhost is Phase 2B-2 scope");
  }
}

export interface Phase2cStartResult {
  readonly server: MobileConsoleLocalServerInstance;
  readonly pairing: PairingState & { readonly rawTokenForElectronUiOnly: string };
  /** LAN URL — for display in Electron UI only, not logged raw in transcript */
  readonly lanUrlForElectronUiOnly: string;
  readonly pairingTokenPresent: true;
  readonly pairingTokenRawReported: false;
}

export interface Phase2cOptions {
  getParams: () => ControlCenterDataProviderParams;
  port?: number;
}

/**
 * Start Phase 2C same-LAN server with pairing token.
 * Called only when MOBILE_CONSOLE_PHASE_2C_ENABLED is true.
 * The LAN URL and token are for Electron UI display only.
 */
export async function startPhase2cServer(
  opts: Phase2cOptions,
): Promise<Phase2cStartResult> {
  const lanIp = discoverLanIp();
  if (!lanIp) {
    throw new Error("phase2c:lan_ip_not_found — no non-loopback IPv4 available");
  }

  assertPhase2cBindHost(lanIp);

  const pairing = createPairingState();
  const port = opts.port ?? MOBILE_CONSOLE_PHASE_2C_PORT;

  const server = await startMobileConsoleLocalServer({
    getParams: opts.getParams,
    port,
    host: lanIp,
    pairingToken: pairing.rawTokenForElectronUiOnly,
  });

  return {
    server,
    pairing,
    lanUrlForElectronUiOnly: `http://${lanIp}:${port}`,
    pairingTokenPresent: true,
    pairingTokenRawReported: false,
  };
}
