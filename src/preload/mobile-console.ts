import { ipcRenderer } from "electron";
import type { MobileConsoleSnapshot } from "../shared/mobile-console";
import { MOBILE_CONSOLE_READONLY_GET_SNAPSHOT_IPC_CHANNEL } from "../shared/mobile-console";

export const MOBILE_CONSOLE_PRELOAD_PUBLIC_METHODS = [
  "getRedactedSnapshot",
  "getPhase2cConnectionInfo",
] as const;

export interface Phase2cConnectionInfo {
  readonly active: boolean;
  readonly phase2cEnabled: boolean;
  readonly lanUrl?: string;
  readonly pairingToken?: string;
  readonly pairingTokenPresent?: true;
  readonly pairingTokenRawReported?: false;
}

export interface MobileConsolePreloadApi {
  /** Read-only redacted snapshot. No execution, no mutation. */
  readonly getRedactedSnapshot: () => Promise<MobileConsoleSnapshot>;
  /** Phase 2C LAN connection info — for Electron UI display only. */
  readonly getPhase2cConnectionInfo: () => Promise<Phase2cConnectionInfo>;
}

export function createMobileConsolePreloadApi(): MobileConsolePreloadApi {
  return {
    getRedactedSnapshot: () =>
      ipcRenderer.invoke(
        MOBILE_CONSOLE_READONLY_GET_SNAPSHOT_IPC_CHANNEL,
      ) as Promise<MobileConsoleSnapshot>,
    getPhase2cConnectionInfo: () =>
      ipcRenderer.invoke("mobile-console.getPhase2cConnectionInfo") as Promise<Phase2cConnectionInfo>,
  };
}
